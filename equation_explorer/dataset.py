"""Read observations and generate them from real-valued expressions."""

import ast
import csv
import io
import json
import keyword
import math
import re
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from numpy.typing import NDArray


MAX_ROWS = 20_000
MAX_INPUTS = 12
FloatArray = NDArray[np.float64]


@dataclass(frozen=True)
class Dataset:
    features: FloatArray
    y: FloatArray
    name: str
    inputs: tuple[str, ...]
    target: str

    @property
    def x(self) -> FloatArray:
        return self.features[:, 0]

    @property
    def columns(self) -> tuple[str, ...]:
        return (*self.inputs, self.target)

    def rows(self):
        return zip(*self.features.T, self.y)


def valid_name(name: str) -> bool:
    return bool(re.fullmatch(r"[a-zA-Z_][a-zA-Z_0-9]*", name)) and not keyword.iskeyword(name)


def default_columns(width: int) -> tuple[str, ...]:
    return ("x", *(f"x{index}" for index in range(2, width)), "y")


def make_dataset(x, y, name: str) -> Dataset:
    return make_table((x, y), ("x", "y"), name)


def make_table(columns, labels: tuple[str, ...], name: str) -> Dataset:
    if not 2 <= len(labels) <= MAX_INPUTS + 1:
        raise ValueError(f"Supply between 1 and {MAX_INPUTS} inputs and one result column.")
    if len(set(labels)) != len(labels):
        raise ValueError("Column names must be distinct.")
    try:
        matrix = np.array(columns, dtype=float).T
    except (TypeError, ValueError, OverflowError) as error:
        raise ValueError("Every column needs the same number of numeric values.") from error
    if matrix.ndim != 2 or matrix.shape[1] != len(labels):
        raise ValueError("Supply a value for every input and result on each row.")
    if not 2 <= len(matrix) <= MAX_ROWS:
        raise ValueError(f"Supply between 2 and {MAX_ROWS:,} rows.")
    invalid = np.flatnonzero(~np.isfinite(matrix).all(axis=1))
    if len(invalid):
        raise ValueError(f"Data row {invalid[0] + 1} contains a non-finite value.")
    features = matrix[:, :-1]
    if np.all(features == features[0]):
        raise ValueError("Supply at least two distinct combinations of inputs.")
    matrix.setflags(write=False)
    features.setflags(write=False)
    return Dataset(features, matrix[:, -1], name, labels[:-1], labels[-1])


def read_dataset(path: Path) -> Dataset:
    if path.suffix.lower() == ".json":
        return read_json(path)
    if path.suffix.lower() in {".csv", ".tsv", ".txt"}:
        return read_csv(path)
    raise ValueError("Choose a CSV, TSV, or JSON file.")


def read_json(path: Path) -> Dataset:
    with path.open(encoding="utf-8-sig") as stream:
        value = json.load(stream)
    if isinstance(value, dict):
        inputs, result = value.get("inputs"), value.get("result")
        if isinstance(inputs, dict) and isinstance(result, dict) and len(result) == 1:
            labels = tuple((*inputs.keys(), *result.keys()))
            return make_table([*inputs.values(), *result.values()], checked_labels(labels), path.name)
        columns = {key: column for key, column in value.items() if isinstance(column, list)}
        if set(columns) == {"x", "y"}:
            return make_dataset(columns["x"], columns["y"], path.name)
        if len(columns) >= 2:
            return make_table(list(columns.values()), checked_labels(tuple(columns)), path.name)
    if isinstance(value, list) and value:
        first = value[0]
        if isinstance(first, dict) and all(isinstance(row, dict) and row.keys() == first.keys()
                                           for row in value):
            labels = tuple(first)
            if len(labels) == 2 and set(labels) == {"x", "y"}:
                labels = ("x", "y")
            return make_table([[row[key] for row in value] for key in labels],
                              checked_labels(labels), path.name)
        if isinstance(first, list) and all(isinstance(row, list) and len(row) == len(first)
                                           for row in value):
            return make_table(list(zip(*value)), default_columns(len(first)), path.name)
    raise ValueError("Use JSON data rows, named arrays, or an inputs and result object.")


def checked_labels(labels: tuple[str, ...]) -> tuple[str, ...]:
    if len(set(labels)) != len(labels):
        raise ValueError("Column names must be distinct.")
    if all(valid_name(label) and label not in CONSTANTS for label in labels):
        return labels
    return default_columns(len(labels))


def read_csv(path: Path) -> Dataset:
    with path.open(encoding="utf-8-sig", newline="") as stream:
        sample = stream.read(8192)
        stream.seek(0)
        try:
            delimiter = csv.Sniffer().sniff(sample, delimiters=",\t;").delimiter
        except csv.Error:
            first_line = next((line for line in sample.splitlines() if line.strip()), "")
            delimiter = max(",\t;", key=lambda char: len(next(csv.reader([first_line], delimiter=char))))
        reader = csv.reader(stream, delimiter=delimiter, strict=True)
        rows = (row for row in reader if any(cell.strip() for cell in row))
        first = next(rows, None)
        if first is None:
            raise ValueError("The file is empty.")
        labels = tuple(cell.strip() for cell in first)
        numeric = sum(is_numeric(cell) for cell in labels)
        records = []
        if numeric == len(labels):
            records.append((reader.line_num, first))
            labels = default_columns(len(labels))
        elif numeric or not all(labels):
            raise ValueError(f"CSV line {reader.line_num} needs numeric values in every column.")
        for row in rows:
            records.append((reader.line_num, row))
            if len(records) > MAX_ROWS:
                raise ValueError(f"This app can load up to {MAX_ROWS:,} rows at a time.")

    def values(indices):
        columns = [[] for _ in indices]
        for line, row in records:
            try:
                row_values = [float(row[index]) for index in indices]
            except (IndexError, ValueError) as error:
                raise ValueError(f"CSV line {line} needs numeric values in every selected column.") from error
            for column, value in zip(columns, row_values):
                column.append(value)
        return columns

    lower = tuple(label.lower() for label in labels)
    legacy = "x" in lower and "y" in lower
    if len(labels) == 2 and legacy:
        x_index, y_index = lower.index("x"), lower.index("y")
        return make_table(values((x_index, y_index)), (labels[x_index], labels[y_index]), path.name)
    explicit = labels[-1].startswith("result:")
    if explicit:
        labels = (*labels[:-1], labels[-1].removeprefix("result:"))
    try:
        columns = values(range(len(labels)))
    except ValueError:
        if legacy and not explicit and lower[-1] not in {"z", "result", "output", "target"}:
            pair = (lower.index("x"), lower.index("y"))
            extras = set(range(len(labels))) - set(pair)
            if not any(index < len(row) and is_numeric(row[index]) for _, row in records for index in extras):
                return make_table(values(pair), tuple(labels[index] for index in pair), path.name)
        raise
    return make_table(columns, checked_labels(labels), path.name)


def is_numeric(text: str) -> bool:
    try:
        float(text)
    except ValueError:
        return False
    return True


def write_dataset(path: Path, data: Dataset) -> None:
    if path.suffix.lower() == ".json":
        inputs = {key: column.tolist() for key, column in zip(data.inputs, data.features.T)}
        result = {data.target: data.y.tolist()}
        content = {**inputs, **result} if data.columns == ("x", "y") else {"inputs": inputs, "result": result}
        encoded = json.dumps(content, allow_nan=False)
        encoded += "\n"
    elif path.suffix.lower() == ".csv":
        buffer = io.StringIO(newline="")
        writer = csv.writer(buffer)
        labels = data.columns if tuple(name.lower() for name in data.columns) != ("y", "x") else (*data.inputs, f"result:{data.target}")
        writer.writerow(labels)
        writer.writerows(data.rows())
        encoded = buffer.getvalue()
    else:
        raise ValueError("Use a .csv or .json file extension.")
    path.write_text(encoded, encoding="utf-8", newline="")


BINARY_OPERATORS = {
    ast.Add: np.add, ast.Sub: np.subtract, ast.Mult: np.multiply,
    ast.Div: np.divide, ast.Pow: np.power, ast.Mod: np.remainder,
}
FUNCTIONS = {
    "abs": (np.abs, 1), "sqrt": (np.sqrt, 1), "cbrt": (np.cbrt, 1),
    "exp": (np.exp, 1), "log": (np.log, 1), "ln": (np.log, 1),
    "log10": (np.log10, 1), "log2": (np.log2, 1),
    "sin": (np.sin, 1), "cos": (np.cos, 1), "tan": (np.tan, 1),
    "asin": (np.arcsin, 1), "acos": (np.arccos, 1), "atan": (np.arctan, 1),
    "sinh": (np.sinh, 1), "cosh": (np.cosh, 1), "tanh": (np.tanh, 1),
    "floor": (np.floor, 1), "ceil": (np.ceil, 1), "square": (np.square, 1),
    "min": (np.minimum, 2), "max": (np.maximum, 2), "pow": (np.power, 2),
}
CONSTANTS = {"pi": math.pi, "e": math.e}


@dataclass(frozen=True)
class Equation:
    tree: ast.expr
    inputs: tuple[str, ...]
    target: str


def parse_equation(expression: str) -> Equation:
    match = re.match(r"^\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*=\s*", expression)
    target = match[1] if match else None
    if match:
        expression = expression[match.end():]
    expression = expression.strip().replace("^", "**").replace("−", "-").replace(r"\*", "*")
    if not expression or len(expression) > 1200:
        raise ValueError("Enter an equation of up to 1,200 characters.")
    try:
        tree = ast.parse(expression, mode="eval")
    except SyntaxError as error:
        raise ValueError("Check the equation syntax. Use * for multiplication.") from error
    nodes = list(ast.walk(tree))
    called = {node.func for node in nodes if isinstance(node, ast.Call)}
    names = sorted((node for node in nodes if isinstance(node, ast.Name)
                    and node not in called and node.id not in CONSTANTS),
                   key=lambda node: (node.lineno, node.col_offset))
    inputs = tuple(dict.fromkeys(node.id for node in names)) or ("x1" if target == "x" else "x",)
    if len(inputs) > MAX_INPUTS:
        raise ValueError(f"An equation can use up to {MAX_INPUTS} inputs.")
    if not all(valid_name(name) for name in inputs):
        raise ValueError("Use letters, digits, and underscores in input names.")
    if target is not None:
        if not valid_name(target) or target in CONSTANTS:
            raise ValueError("Choose a result name such as z or result.")
        if target in inputs:
            raise ValueError(f"{target} is already an input. Use a different name for the result.")
    else:
        options = ("y", "z", "result", *(f"result{index}" for index in range(2, MAX_INPUTS + 1)))
        target = next(name for name in options if name not in inputs)
    return Equation(tree.body, inputs, target)


def evaluate_expression(expression: str | Equation,
                        inputs: FloatArray | Mapping[str, FloatArray]) -> FloatArray:
    equation = parse_equation(expression) if isinstance(expression, str) else expression
    variables = inputs if isinstance(inputs, Mapping) else {"x": inputs}
    shape = next(iter(variables.values())).shape

    def visit(node):
        if isinstance(node, ast.Constant) and type(node.value) in {int, float}:
            return float(node.value)
        if isinstance(node, ast.Name):
            if node.id in CONSTANTS:
                return CONSTANTS[node.id]
            if node.id in variables:
                return variables[node.id]
            raise ValueError(f"Enter values for {node.id}.")
        if isinstance(node, ast.UnaryOp) and type(node.op) in {ast.UAdd, ast.USub}:
            value = visit(node.operand)
            return value if isinstance(node.op, ast.UAdd) else -value
        if isinstance(node, ast.BinOp) and type(node.op) in BINARY_OPERATORS:
            return BINARY_OPERATORS[type(node.op)](visit(node.left), visit(node.right))
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and not node.keywords:
            name = node.func.id
            if name not in FUNCTIONS:
                raise ValueError(f"{name} is not a supported math function.")
            function, arity = FUNCTIONS[name]
            if len(node.args) != arity:
                raise ValueError(f"{name} expects {arity} argument(s).")
            return function(*(visit(arg) for arg in node.args))
        raise ValueError("Use input names, numbers, pi, e, and supported math functions.")

    with np.errstate(all="ignore"):
        values = np.broadcast_to(np.asarray(visit(equation.tree), dtype=float), shape)
    bad = np.flatnonzero(~np.isfinite(values))
    if len(bad):
        row = ", ".join(f"{name} = {column[bad[0]]:.8g}" for name, column in variables.items())
        raise ValueError(f"The equation is undefined or too large at {row}. "
                         "Choose ranges where the equation is real and finite.")
    return values


def generate_dataset(expression: str | Equation, start: float, stop: float, count: int,
                     mode: str, seed: int | None, noise: float, *,
                     input_ranges: Mapping[str, tuple[float, float]] | None = None) -> Dataset:
    equation = parse_equation(expression) if isinstance(expression, str) else expression
    if not 2 <= count <= MAX_ROWS:
        raise ValueError(f"Enter a row count between 2 and {MAX_ROWS:,}.")
    if seed is not None and seed < 0:
        raise ValueError("The seed must be a non-negative whole number or blank.")
    if not (math.isfinite(noise) and noise >= 0):
        raise ValueError("Enter a finite, non-negative noise level.")
    rng = np.random.default_rng(seed)
    sequencer = np.random.default_rng(0)
    columns = {}
    for name in equation.inputs:
        if input_ranges is not None and name not in input_ranges:
            raise ValueError(f"Enter a minimum and maximum for {name}.")
        low, high = input_ranges[name] if input_ranges is not None else (start, stop)
        if not (math.isfinite(low) and math.isfinite(high) and low < high and math.isfinite(high - low)):
            raise ValueError(f"Enter a finite range for {name} with minimum smaller than maximum.")
        if mode == "Random":
            values = rng.uniform(low, high, count)
        else:
            values = np.linspace(low, high, count)
            if columns:
                values = sequencer.permutation(values)
        columns[name] = values
    y = evaluate_expression(equation, columns)
    if noise:
        with np.errstate(all="ignore"):
            y = y + rng.normal(0, noise, count)
    return make_table([*columns.values(), y], (*equation.inputs, equation.target), "Generated dataset")
