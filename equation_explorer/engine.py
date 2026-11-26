"""Fit equation families and expose each search round."""

import itertools
import math
import re
from dataclasses import dataclass
from typing import Callable, Iterator

import numpy as np
from numpy.polynomial import Polynomial

from dataset import Dataset, FloatArray


PENALTY = 0.001
REFINEMENTS = 8
EXACT_ERROR = 1e-9
PRECISION_START = 1e-8
PRECISION_FLOOR = 1e-8
FLOAT_EPSILON = np.finfo(float).eps
PRECISION_ERROR = 8 * FLOAT_EPSILON


def number(value: float) -> str:
    return f"{value:.12g}"


def exact_number(value: float) -> str:
    short = number(value)
    return short if float(short) == value else repr(float(value))


@dataclass(frozen=True)
class Axis:
    center: float
    span: float
    name: str = "x"

    @classmethod
    def from_values(cls, values: FloatArray, name: str = "x") -> "Axis":
        low, high = float(values.min()), float(values.max())
        span = high * 0.5 - low * 0.5 or high - low or 1
        return cls(low * 0.5 + high * 0.5, span, name)

    @property
    def term(self) -> str:
        sign = "-" if self.center >= 0 else "+"
        numerator = (f"({self.name} {sign} {exact_number(abs(self.center))})"
                     if self.center else self.name)
        return f"({numerator} / {exact_number(self.span)})" if self.span != 1 else numerator

    def values(self, x: FloatArray) -> FloatArray:
        return (x - self.center) / self.span


Term = tuple[str, FloatArray]
Shape = tuple[float, ...]


@dataclass(frozen=True)
class Scan:
    name: str
    low: float
    high: float
    points: int


@dataclass(frozen=True)
class Family:
    name: str
    terms: Callable[[FloatArray, Axis, Shape], tuple[Term, ...]]
    scan: tuple[Scan, ...] = ()
    domain: str = ""
    degree: int = 0


@dataclass(frozen=True)
class Fit:
    family: Family
    shape: Shape
    axis: Axis
    weights: FloatArray
    feature_scale: FloatArray
    y_scale: float
    equation: str
    train_rmse: float
    validation_rmse: float | None
    objective: float
    score: float
    parameters: int
    precision_fit: bool
    validation_precision: float | None

    def predict(self, x: FloatArray) -> FloatArray:
        with np.errstate(all="ignore"):
            terms = self.family.terms(x, self.axis, self.shape)
            matrix = np.column_stack([*(values for _, values in terms), np.ones(len(x))])
            return ((matrix / self.feature_scale) @ self.weights) * self.y_scale


@dataclass(frozen=True)
class Round:
    phase: str
    family: str
    detail: str
    model: Fit | None = None
    ranked: bool = False
    final: bool = False


def polynomial(name: str, degree: int) -> Family:
    def terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
        t = axis.values(x)
        return tuple((axis.term if order == 1 else f"{axis.term}^{order}", t ** order)
                     for order in range(degree, 0, -1))

    return Family(name, terms, degree=degree)


def fixed(name: str, expression: str, function, domain: str = "") -> Family:
    return Family(name, lambda x, axis, shape: ((expression, function(x)),), domain=domain)


def power_terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
    exponent = shape[0]
    return ((f"x^({number(exponent)})", np.power(x, exponent)),)


def exponential_terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
    rate = shape[0]
    if abs(axis.center / axis.span * rate) <= 12 and math.isfinite(rate / axis.span):
        raw_rate = rate / axis.span
        return ((f"exp({number(raw_rate)} * x)", np.exp(raw_rate * x)),)
    return ((f"exp({number(rate)} * {axis.term})", np.exp(rate * axis.values(x))),)


def harmonic_terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
    cycles = shape[0]
    omega = math.pi * cycles / axis.span
    if abs(axis.center / axis.span) <= 4 and math.isfinite(omega):
        expression, angle = f"{number(omega)} * x", omega * x
    else:
        expression, angle = f"{number(math.pi * cycles)} * {axis.term}", math.pi * cycles * axis.values(x)
    return ((f"sin({expression})", np.sin(angle)), (f"cos({expression})", np.cos(angle)))


def gaussian_terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
    center, log_width = shape
    width = math.exp(log_width)
    offset = f"{axis.term} - ({number(center)})"
    expression = f"exp(-0.5 * (({offset}) / {number(width)})^2)"
    return ((expression, np.exp(-0.5 * ((axis.values(x) - center) / width) ** 2)),)


def logistic_terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
    center, log_width = shape
    width = math.exp(log_width)
    expression = f"(1 / (1 + exp(-({axis.term} - ({number(center)})) / {number(width)})))"
    return ((expression, 1 / (1 + np.exp(-(axis.values(x) - center) / width))),)


def with_trend(family: Family) -> Family:
    def terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
        line = ("x", x) if abs(axis.center / axis.span) <= 4 else (axis.term, axis.values(x))
        return (*family.terms(x, axis, shape), line)

    return Family(f"{family.name} + line", terms, family.scan, family.domain)


def spline(knots: FloatArray) -> Family:
    def terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
        if abs(axis.center / axis.span) <= 4:
            variable, values, breaks = "x", x, knots
        else:
            variable, values, breaks = axis.term, axis.values(x), axis.values(knots)
        pieces = tuple((f"max(0, {variable} - ({exact_number(knot)}))", np.maximum(0, values - knot))
                       for knot in breaks)
        return ((variable, values), *pieces)

    count = len(knots)
    return Family(f"Linear spline ({count} {'knot' if count == 1 else 'knots'})", terms)


def format_equation(labels, coefficients: FloatArray, target: str,
                    contributions: FloatArray | None = None) -> str:
    pieces = []
    for index, (label, coefficient) in enumerate(zip(labels, coefficients)):
        if coefficient == 0:
            continue
        absolute = abs(coefficient)
        magnitude = number(absolute)
        if contributions is not None:
            rounding = abs(float(magnitude) / absolute - 1) * contributions[index]
            if rounding > PRECISION_ERROR:
                magnitude = exact_number(absolute)
        if not label:
            term = magnitude
        elif magnitude == "1":
            term = label
        elif label.startswith("1 /"):
            term = f"{magnitude}{label[1:]}"
        else:
            term = f"{magnitude} * {label}"
        if pieces:
            pieces.append((" - " if coefficient < 0 else " + ") + term)
        else:
            pieces.append(("-" if coefficient < 0 else "") + term)
    return f"{target} = " + ("".join(pieces) or "0")


Feature = tuple[str, Callable[[FloatArray], FloatArray]]


def feature(name, index, transform) -> Feature:
    return name, lambda matrix: transform(matrix[:, index])


def combination(name: str, specs: tuple[Feature, ...]) -> Family:
    def terms(x: FloatArray, axis: Axis, shape: Shape) -> tuple[Term, ...]:
        return tuple((label, calc(x)) for label, calc in specs)

    return Family(name, terms)


def rmse(errors: FloatArray) -> float:
    peak = float(np.max(np.abs(errors)))
    return float(peak * np.sqrt(np.mean((errors / peak) ** 2))) if peak else 0.0


def precision_scale(target: FloatArray) -> FloatArray:
    # Targets are already scaled to their peak training magnitude. The floor
    # limits the weight given to rows where the result is close to zero.
    return np.maximum(np.abs(target), PRECISION_FLOOR)


def fit_at_precision(design: FloatArray, target: FloatArray, row_scale: FloatArray):
    weighted = design / row_scale[:, None]
    column_scale = np.max(np.abs(weighted), axis=0)
    weighted /= column_scale
    scaled_weights, _, rank, _ = np.linalg.lstsq(weighted, target / row_scale, rcond=None)
    weights = scaled_weights / column_scale
    # Correct residuals after rescaling. This recovers small coefficients that
    # can lose precision while solving the combined system at once.
    if rank == design.shape[1]:
        for _ in range(2):
            residual = (target - design @ weights) / row_scale
            correction, _, _, _ = np.linalg.lstsq(weighted, residual, rcond=None)
            weights += correction / column_scale
    return weights, rank


class Search:
    """One reproducible split, a sequence of model trials, and a final refit."""

    def __init__(self, data: Dataset):
        self.data = data
        self.multi = len(data.inputs) > 1
        self.values = data.features if self.multi else data.x
        axis = 0 if self.multi else None
        distinct, groups = np.unique(self.values, return_inverse=True, axis=axis)
        self.distinct_all = len(distinct)
        self.axis = Axis.from_values(data.x)
        held_out = np.arange(2, len(distinct) - 1, 5) if len(distinct) >= 5 else []
        self.validation_mask = np.isin(groups, held_out)
        self.distinct_train = len(distinct) - len(held_out)
        self.x = self.values[~self.validation_mask]
        self.y = data.y[~self.validation_mask]
        self.validation_x = self.values[self.validation_mask]
        self.validation_y = data.y[self.validation_mask]
        self.y_scale = float(np.max(np.abs(self.y))) or 1.0
        self.error_scale = float(np.std(self.y / self.y_scale)) or 1.0
        self.rankings: list[Fit] = []
        self.rounds = self.run()

    def fit(self, family: Family, shape: Shape = (), *, final: bool = False,
            evaluate: bool = True, precision: bool = False) -> Fit | None:
        x, y = (self.values, self.data.y) if final else (self.x, self.y)
        distinct_count = self.distinct_all if final else self.distinct_train
        with np.errstate(all="ignore"):
            terms = family.terms(x, self.axis, shape)
            parameters = len(terms) + 1 + len(shape)
            if parameters > distinct_count:
                return None
            matrix = np.column_stack([*(values for _, values in terms), np.ones(len(x))])
            scale = np.max(np.abs(matrix), axis=0)
            if not np.all(np.isfinite(scale) & (scale > 0)):
                return None
            design = matrix / scale
            target = y / self.y_scale
            row_scale = precision_scale(target) if precision else None
            try:
                if row_scale is None:
                    weights, _, rank, _ = np.linalg.lstsq(design, target, rcond=None)
                else:
                    weights, rank = fit_at_precision(design, target, row_scale)
            except np.linalg.LinAlgError:
                return None
            if rank < matrix.shape[1] or not np.isfinite(weights).all():
                return None
            errors = design @ weights - target
            relative_error = rmse(errors)
            objective = relative_error if row_scale is None else rmse(errors / row_scale)
            validation_error = None
            validation_precision = None
            if evaluate and not final and len(self.validation_x):
                check = family.terms(self.validation_x, self.axis, shape)
                val_matrix = np.column_stack([*(value for _, value in check), np.ones(len(self.validation_x))])
                validation_target = self.validation_y / self.y_scale
                errors = (val_matrix / scale) @ weights - validation_target
                if not np.isfinite(errors).all():
                    return None
                validation_error = rmse(errors)
                if self.multi:
                    validation_precision = rmse(errors / precision_scale(validation_target))
            score = (relative_error if validation_error is None else validation_error) / self.error_scale
            score += PENALTY * parameters
            coefficients = (weights * self.y_scale) / scale
            if not np.isfinite(coefficients).all():
                return None

            equation = ""
            if evaluate:
                labels = [label for label, _ in terms] + [""]
                contributions = None
                if row_scale is None:
                    coefficients[np.abs(weights) < 5e-13 * max(1.0, np.max(np.abs(weights)))] = 0
                else:
                    relative_terms = design * weights / row_scale[:, None]
                    contributions = np.sqrt(np.mean(relative_terms ** 2, axis=0))
                    coefficients[contributions < FLOAT_EPSILON] = 0
                if family.degree and abs(self.axis.center / self.axis.span) <= 4:
                    raw_basis = Polynomial([-self.axis.center / self.axis.span, 1 / self.axis.span])
                    raw = Polynomial(coefficients[::-1])(raw_basis).coef[::-1]
                    if (len(raw) == len(coefficients) and np.isfinite(raw).all()
                            and np.allclose(Polynomial(raw[::-1])(x) / self.y_scale,
                                            design @ weights, rtol=1e-9, atol=1e-11)):
                        coefficients = raw
                        coefficients[np.abs(raw) * np.maximum(1, np.max(np.abs(x))) **
                                     np.arange(family.degree, -1, -1) < 5e-13 * self.y_scale] = 0
                        labels = ["x" if order == 1 else f"x^{order}"
                                  for order in range(family.degree, 0, -1)] + [""]
                if not self.multi and self.data.inputs[0] != "x":
                    labels = [re.sub(r"\bx\b", self.data.inputs[0], label) for label in labels]
                equation = format_equation(labels, coefficients, self.data.target, contributions)

        return Fit(family, shape, self.axis, weights, scale, self.y_scale, equation,
                   relative_error * self.y_scale,
                   None if validation_error is None else validation_error * self.y_scale,
                   objective, score, parameters, precision, validation_precision)

    def families(self) -> Iterator[tuple[str, Family]]:
        for degree, name in enumerate(("Constant", "Straight line", "Quadratic", "Cubic",
                                       "Degree 4 polynomial", "Degree 5 polynomial")):
            yield "Basics", polynomial(name, degree)
        reciprocal = fixed("Reciprocal", "1 / x", np.reciprocal, "nonzero")
        inverse_square = fixed("Inverse square", "1 / x^2", lambda x: np.power(x, -2), "nonzero")
        logarithm = fixed("Logarithm", "log(x)", np.log, "positive")
        for family in (reciprocal, inverse_square, logarithm,
                       fixed("Square root", "sqrt(x)", np.sqrt, "nonnegative"),
                       fixed("Cube root", "cbrt(x)", np.cbrt),
                       fixed("Absolute value", "abs(x)", np.abs)):
            yield "Transforms", family
        cycles = max(0.3, min(24, (self.distinct_train - 1) / 2))
        harmonic = Family("Sinusoid", harmonic_terms, (Scan("cycles", 0.15, cycles, int(cycles * 14) + 9),))
        for family in (
            Family("Power law", power_terms, (Scan("exponent", -8, 8, 65),), "positive"),
            Family("Exponential", exponential_terms, (Scan("rate across half range", -24, 24, 65),)),
            harmonic,
            Family("Gaussian peak", gaussian_terms,
                   (Scan("center", -1.25, 1.25, 13), Scan("log width", -3.5, 1, 10))),
            Family("Logistic curve", logistic_terms,
                   (Scan("center", -1.25, 1.25, 13), Scan("log width", -4, 1, 11))),
        ):
            yield "Tune shape", family
        for family in (reciprocal, inverse_square, logarithm, harmonic):
            yield "Mixed terms", with_trend(family)
        distinct = np.unique(self.x)
        for count in (1, 3, 7):
            knots = np.quantile(distinct, np.linspace(0, 1, count + 2)[1:-1])
            yield "Flexible", spline(knots)

    def domain_issue(self, family: Family) -> str:
        low, high = float(self.data.x.min()), float(self.data.x.max())
        if family.domain == "nonzero" and np.any(self.data.x == 0):
            return "This family is undefined for the observed x = 0."
        if family.domain == "positive" and low <= 0:
            return "This family requires x > 0 across the observed interval."
        if family.domain == "nonnegative" and low < 0:
            return "This family requires x ≥ 0 across the observed interval."
        return ""

    def sweep(self, family: Family, ranges, *, final: bool = False,
              best: Fit | None = None) -> tuple[Fit | None, int]:
        tried = 0
        for shape in itertools.product(*ranges):
            tried += 1
            trial = self.fit(family, shape, final=final, evaluate=False)
            if trial is not None and (best is None or trial.objective < best.objective):
                best = trial
        return best, tried

    def tune(self, family: Family, phase: str) -> Iterator[Round]:
        grids = [np.linspace(scan.low, scan.high, scan.points) for scan in family.scan]
        steps = [float(grid[1] - grid[0]) for grid in grids]
        refinements = REFINEMENTS + 3 if len(grids) > 1 else REFINEMENTS
        size = 17 if len(grids) == 1 else 9
        best = None
        for iteration in range(refinements + 1):
            best, tried = self.sweep(family, grids, best=best)
            if best is None:
                yield Round(phase, family.name, "Skipped because none of the trial shapes could be fitted.")
                return
            model = self.fit(family, best.shape)
            values = ", ".join(f"{scan.name} = {number(value)}"
                               for scan, value in zip(family.scan, best.shape))
            label = "Coarse scan" if iteration == 0 else f"Refinement {iteration}"
            detail = f"{label} evaluated {tried} shapes. Best training fit uses {values}."
            ranked = iteration == refinements and model is not None
            if ranked:
                self.rankings.append(model)
            yield Round(phase, family.name, detail, model, ranked=ranked)
            radius = [step if iteration == 0 else 2 * step for step in steps]
            grids = [np.linspace(max(scan.low, value - step), min(scan.high, value + step), size)
                     for scan, value, step in zip(family.scan, best.shape, radius)]
            steps = [float(grid[1] - grid[0]) for grid in grids]

    def fixed_round(self, phase: str, family: Family) -> Round:
        model = self.fit(family)
        if model is None:
            return Round(phase, family.name, "Skipped because the training data cannot identify these coefficients.")
        self.rankings.append(model)
        return Round(phase, family.name, f"Least squares solved {model.parameters} coefficients using the training rows.",
                     model, ranked=True)

    def univariate_rounds(self) -> Iterator[Round]:
        for phase, family in self.families():
            issue = self.domain_issue(family)
            if issue:
                yield Round(phase, family.name, "Skipped. " + issue)
                continue
            if family.scan:
                center = tuple((scan.low + scan.high) / 2 for scan in family.scan)
                terms = family.terms(self.x[:1], self.axis, center)
                if self.distinct_train < len(family.scan) + len(terms) + 1:
                    yield Round(phase, family.name, "Skipped because there are too few distinct training x values.")
                else:
                    yield from self.tune(family, phase)
                continue
            yield self.fixed_round(phase, family)

    def multivariate_rounds(self) -> Iterator[Round]:
        powers: list[list[Feature]] = [[], [], []]
        transforms: list[Feature] = []
        for index, name in enumerate(self.data.inputs):
            column = self.values[:, index]
            if column.min() == column.max():
                continue
            axis = Axis.from_values(column, name)
            name_for_power = name
            normalized = abs(axis.center / axis.span) > 4
            if normalized:
                name_for_power = axis.term
            for order, group in enumerate(powers, start=1):
                label = name_for_power if order == 1 else f"{name_for_power}^{order}"
                if normalized:
                    transform = lambda values, axis=axis, order=order: axis.values(values) ** order
                else:
                    transform = lambda values, order=order: values ** order
                group.append(feature(label, index, transform))
            if not np.any(column == 0):
                transforms.append(feature(f"1 / {name}", index, np.reciprocal))
                transforms.append(feature(f"1 / {name}^2", index, lambda values: values ** -2))
            if column.min() > 0:
                transforms.append(feature(f"log({name})", index, np.log))
            if column.min() >= 0:
                transforms.append(feature(f"sqrt({name})", index, np.sqrt))
            for label, function in (("abs", np.abs), ("cbrt", np.cbrt), ("sin", np.sin), ("cos", np.cos)):
                transforms.append(feature(f"{label}({name})", index, function))

        interactions: list[Feature] = []
        for (left, first), (right, second) in itertools.combinations(powers[0], 2):
            interactions.append((f"{left} * {right}", lambda matrix, a=first, b=second: a(matrix) * b(matrix)))
        linear, squares, cubes = map(tuple, powers)
        for name, specs in (("Constant", ()), ("Linear model", linear),
                            ("Quadratic model", (*linear, *squares, *interactions)),
                            ("Additive cubic", (*linear, *squares, *cubes))):
            yield self.fixed_round("Basics", combination(name, specs))

        available = [*linear, *squares, *cubes, *transforms, *interactions]
        chosen: tuple[Feature, ...] = ()
        error = math.inf
        precision = False
        for count in range(1, min(8, len(available), self.distinct_train - 1) + 1):
            name = f"Feature mix ({count})"
            best = None
            best_index = 0
            for index, spec in enumerate(available):
                result = self.fit(combination(name, (*chosen, spec)), evaluate=False, precision=precision)
                if result is not None and (best is None or result.objective < best.objective):
                    best, best_index = result, index
            if best is None or best.objective >= error:
                break
            term = available.pop(best_index)
            chosen = (*chosen, term)
            entering_precision = not precision and best.objective <= PRECISION_START
            model = self.fit(best.family, precision=precision or entering_precision)
            if model is None and entering_precision:
                model = self.fit(best.family)
            if model is None:
                break
            error = model.objective
            precision = model.precision_fit
            self.rankings.append(model)
            detail = (f"Compared {len(available) + 1} possible additions. "
                      f"Adding {term[0]} gave the best training fit after refitting all weights.")
            if precision:
                detail += " Small effects are checked against the size of each observed result."
            yield Round("Mixed terms", name, detail, model, ranked=True)
            if precision and error <= 2 * FLOAT_EPSILON:
                break

    def run(self) -> Iterator[Round]:
        count = len(self.validation_x)
        split = (f"Fitting on {len(self.x):,} rows and ranking on {count:,} held-out rows."
                 if count else "Fewer than five distinct input combinations. Ranking uses training error.")
        rule = ("Small held-out errors are compared relative to each observed result."
                if self.multi else "Fits that match the held-out data to numerical precision rank first.")
        yield Round("Prepare", "Split data", split + " The score adds 0.001 per fitted parameter to relative RMSE. " + rule)
        yield from (self.multivariate_rounds() if self.multi else self.univariate_rounds())

        precise = [model for model in self.rankings if model.validation_precision is not None
                   and model.validation_precision <= PRECISION_START]
        if precise:
            closest = min(model.validation_precision for model in precise)
            cutoff = max(PRECISION_ERROR, closest * 1.1)
            finalists = [model for model in precise if model.validation_precision <= cutoff]
            reason = ("matched the held-out rows to numerical precision" if closest <= PRECISION_ERROR
                      else "best explained small effects in the held-out rows")
        else:
            exact = [model for model in self.rankings if not self.multi and count
                     and model.score - PENALTY * model.parameters <= EXACT_ERROR]
            finalists = exact or self.rankings
            reason = "matched the held-out rows to numerical precision" if exact else "had the lowest score"
        winner = min(finalists, key=lambda model: (round(model.score, 12), model.parameters))
        final = self.fit(winner.family, winner.shape, final=True, precision=winner.precision_fit)
        if final is None:
            final = winner
            refit = "The original training fit is shown because the full-data refit was unstable."
        else:
            refit = f"Refit the coefficients on all {len(self.data.x):,} rows."
        detail = (f"{winner.family.name} {reason} (score {winner.score:.6g}) among "
                  f"{len(self.rankings)} ranked equations. {refit}")
        if winner.validation_rmse is not None:
            detail += f" Its held-out RMSE before refitting was {number(winner.validation_rmse)}."
        yield Round("Select", winner.family.name, detail, final, final=True)
