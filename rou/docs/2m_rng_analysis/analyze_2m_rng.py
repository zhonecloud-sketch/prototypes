"""Audit roulette data using bias_calc equations and order diagnostics.

Usage: python analyze_2m_rng.py
Dependencies: numpy, scipy, matplotlib. No application files are modified.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import platform
import subprocess
import sys
import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import scipy
from scipy import stats


HERE = Path(__file__).resolve().parent
ROU = HERE.parents[1]
RED = {1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36}
ALPHA = 0.05
WEEK_SIZE = 20160
DATE = "2026-10-16"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def plain(value):
    if isinstance(value, dict):
        return {str(k): plain(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [plain(v) for v in value]
    if isinstance(value, np.ndarray):
        return plain(value.tolist())
    if isinstance(value, np.generic):
        return plain(value.item())
    if isinstance(value, float) and not math.isfinite(value):
        return None
    return value


def save_json(path, value):
    path.write_text(json.dumps(plain(value), indent=2, allow_nan=False) + "\n",
                    encoding="utf-8")


def save_csv(path, rows):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(plain(rows))


def app_p(k, n, p0):
    """Same inclusive doubled-small-tail definition as the supplied app."""
    return np.minimum(1.0, 2 * np.minimum(
        stats.binom.cdf(k, n, p0), stats.binom.sf(np.asarray(k) - 1, n, p0)))


def holm(values):
    values = np.asarray(values, dtype=float)
    order = np.argsort(values)
    adjusted = np.minimum(1, np.maximum.accumulate(
        values[order] * np.arange(len(values), 0, -1)))
    output = np.empty(len(values))
    output[order] = adjusted
    return output


def categories():
    result = [(f"number_{i:02d}", [i]) for i in range(37)]
    result += [
        ("red", sorted(RED)),
        ("black", sorted(set(range(1, 37)) - RED)),
        ("odd", list(range(1, 37, 2))),
        ("even", list(range(2, 37, 2))),
        ("low_1_18", list(range(1, 19))),
        ("high_19_36", list(range(19, 37))),
    ]
    result += [(f"dozen_{i+1}", list(range(12*i+1, 12*i+13)))
               for i in range(3)]
    result += [(f"column_{i+1}", list(range(i+1, 37, 3)))
               for i in range(3)]
    return result


def add_test(tests, family, name, statistic, p, **extra):
    tests.append(dict(family=family, test=name, statistic=float(statistic),
                      p_raw=float(p), **extra))


def binomial_power(n, p1, p0, alpha):
    low = int(stats.binom.ppf(alpha / 2, n, p0))
    while low >= 0 and stats.binom.cdf(low, n, p0) > alpha / 2:
        low -= 1
    while low + 1 <= n and stats.binom.cdf(low + 1, n, p0) <= alpha / 2:
        low += 1
    high = int(stats.binom.isf(alpha / 2, n, p0)) + 1
    while high <= n and stats.binom.sf(high - 1, n, p0) > alpha / 2:
        high += 1
    while high - 1 >= 0 and stats.binom.sf(high - 2, n, p0) <= alpha / 2:
        high -= 1
    return float((stats.binom.cdf(low, n, p1) if low >= 0 else 0) +
                 (stats.binom.sf(high - 1, n, p1) if high <= n else 0))


def md_table(headers, rows):
    return "\n".join([
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
        *["| " + " | ".join(map(str, row)) + " |" for row in rows],
    ])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=ROU / "assets/2m-rng.txt")
    parser.add_argument("--app", type=Path,
                        default=ROU.parent / "bias_calc/index.html")
    parser.add_argument("--output-dir", type=Path, default=HERE)
    parser.add_argument("--node", default="node")
    args = parser.parse_args()
    out = args.output_dir.resolve()
    out.mkdir(parents=True, exist_ok=True)

    raw = args.input.read_bytes()
    lines = raw.decode("utf-8-sig").splitlines()
    invalid = [(i + 1, value) for i, value in enumerate(lines)
               if not value.strip().isascii() or not value.strip().isdigit()
               or not 0 <= int(value.strip()) <= 36]
    if invalid:
        raise ValueError(f"Invalid data rows, not silently removed: {invalid[:10]}")
    x = np.array([int(value.strip()) for value in lines], dtype=np.int16)
    n = len(x)
    if n == 0:
        raise ValueError("Empty input")
    cats = categories()
    counts = np.bincount(x, minlength=37)
    schedule = np.unique(np.r_[np.arange(WEEK_SIZE, n + 1, WEEK_SIZE), n])
    protocol = dict(
        analysis_date=DATE,
        null="independent identically distributed uniform integers 0..36",
        retrospective=True,
        initial_counts_seen_before_protocol=True,
        alpha=ALPHA,
        categories=[dict(name=name, numbers=nums, p0=len(nums)/37)
                    for name, nums in cats],
        app_defaults=dict(freq_alpha=.05, freq_power=.8, seq_alpha=.001,
                          seq_overall_alpha_reference=.05,
                          prior_a=1, prior_b=1, bayes_threshold=.99),
        monitoring_prefixes=schedule.tolist(),
        monitoring_correction="Bonferroni across all categories and prefixes",
        marginal_correction="Holm across 49 binomial tests plus omnibus",
        order_correction="Holm across 15 fixed order diagnostics",
        block_correction="Holm across block uniformity plus homogeneity",
        audit_correction="additional Holm across all frequentist tests",
        block_size=WEEK_SIZE,
        relative_bayesian_tolerance=.01,
        source_sha256=hashlib.sha256(raw).hexdigest(),
        app_sha256=sha256(args.app),
    )
    save_json(out / "protocol.json", protocol)
    print(f"Validated {n:,} results; protocol saved", flush=True)

    tests, rows = [], []
    for name, nums in cats:
        k = int(counts[nums].sum())
        p0, phat = len(nums) / 37, k / n
        p = float(app_p(k, n, p0))
        low, high = stats.beta.ppf([.025, .975], k + 1, n - k + 1)
        simultaneous_alpha = ALPHA / len(cats)
        cp_low = (float(stats.beta.ppf(simultaneous_alpha/2, k, n-k+1))
                  if k else 0.0)
        cp_high = (float(stats.beta.ppf(1-simultaneous_alpha/2, k+1, n-k))
                   if k < n else 1.0)
        above = float(stats.beta.sf(p0, k+1, n-k+1))
        below = float(stats.beta.cdf(p0, k+1, n-k+1))
        tol = .01 * p0
        outside = float(stats.beta.cdf(p0-tol, k+1, n-k+1) +
                        stats.beta.sf(p0+tol, k+1, n-k+1))
        row = dict(category=name, numbers=" ".join(map(str, nums)), n=n,
                   wins=k, losses=n-k, p0=p0, observed_probability=phat,
                   deviation_percentage_points=100*(phat-p0),
                   relative_deviation_percent=100*(phat/p0-1),
                   z=(k-n*p0)/math.sqrt(n*p0*(1-p0)), p_raw=p,
                   app_freq_reject=p < .05, app_monitor_final_alert=p < .001,
                   posterior_a=k+1, posterior_b=n-k+1,
                   posterior_mean=(k+1)/(n+2),
                   credible95_low=float(low), credible95_high=float(high),
                   posterior_probability_above=above,
                   posterior_probability_below=below,
                   app_bayesian_stop=max(above, below) > .99,
                   posterior_outside_relative_1pct_band=outside,
                   simultaneous95_cp_low=cp_low,
                   simultaneous95_cp_high=cp_high)
        rows.append(row)
        add_test(tests, "marginal", name, row["z"], p)

    omnibus = stats.chisquare(counts)
    add_test(tests, "marginal", "all_37_pockets_uniform", omnibus.statistic,
             omnibus.pvalue)

    blocks, block_counts = [], []
    for index, start in enumerate(range(0, n, WEEK_SIZE), 1):
        sample = x[start:start+WEEK_SIZE]
        hist = np.bincount(sample, minlength=37)
        block_counts.append(hist)
        test = stats.chisquare(hist)
        row = dict(block=index, first_row=start+1,
                   last_row=start+len(sample), n=len(sample),
                   full_week=len(sample) == WEEK_SIZE,
                   chi2=float(test.statistic), df=36, p_raw=float(test.pvalue))
        blocks.append(row)
        add_test(tests, "blocks", f"block_{index:03d}",
                 test.statistic, test.pvalue)
    block_counts = np.array(block_counts)
    homogeneity = stats.chi2_contingency(block_counts, correction=False)
    add_test(tests, "blocks", "block_distribution_homogeneity",
             homogeneity.statistic, homogeneity.pvalue)

    monitoring = []
    cumulative = np.cumsum(block_counts, axis=0)
    for name, nums in cats:
        k = cumulative[:, nums].sum(axis=1)
        probabilities = app_p(k, schedule, len(nums)/37)
        for stop, successes, p in zip(schedule, k, probabilities):
            monitoring.append(dict(category=name, prefix_n=int(stop),
                                   wins=int(successes), p_raw=float(p),
                                   app_alert=p < .001))
            add_test(tests, "monitor", f"{name}@{stop}", successes, p)
    number_looks = len(monitoring)
    for row in monitoring:
        row["p_bonferroni_schedule"] = min(1, row["p_raw"]*number_looks)
        row["schedule_adjusted_alert"] = row["p_bonferroni_schedule"] < ALPHA

    order_rows = []
    for lag in range(1, 11):
        r = float(np.corrcoef(x[:-lag], x[lag:])[0, 1])
        z = r * math.sqrt(n-lag)
        p = float(2*stats.norm.sf(abs(z)))
        order_rows.append(dict(test=f"numeric_lag_{lag}", statistic=r,
                               z=z, p_raw=p, method="large-sample normal"))
        add_test(tests, "order", f"numeric_lag_{lag}", z, p)
    for name, members in [("red", RED), ("odd", set(range(1, 37, 2))),
                          ("low", set(range(1, 19)))]:
        binary = np.isin(x, sorted(members))
        n1 = int(binary.sum())
        n0 = n-n1
        runs = int(1 + np.count_nonzero(binary[1:] != binary[:-1]))
        expectation = 1 + 2*n1*n0/n
        variance = 2*n1*n0*(2*n1*n0-n)/(n*n*(n-1))
        z = (runs-expectation)/math.sqrt(variance)
        p = float(2*stats.norm.sf(abs(z)))
        order_rows.append(dict(test=f"runs_{name}", statistic=runs,
                               z=z, p_raw=p, method="conditional runs normal"))
        add_test(tests, "order", f"runs_{name}", z, p)

    left = x[0:n-1:2].astype(np.int64)
    right = x[1:n:2].astype(np.int64)
    table = np.bincount(left*37+right, minlength=37*37).reshape(37, 37)
    independence = stats.chi2_contingency(table, correction=False)
    add_test(tests, "order", "disjoint_pair_independence",
             independence.statistic, independence.pvalue)
    order_rows.append(dict(test="disjoint_pair_independence",
                           statistic=float(independence.statistic), z=None,
                           p_raw=float(independence.pvalue),
                           method=f"chi2 df={independence.dof}"))
    repeats = int(np.count_nonzero(left == right))
    repeat_p = float(app_p(repeats, len(left), 1/37))
    add_test(tests, "order", "disjoint_pair_equal", repeats, repeat_p)
    order_rows.append(dict(test="disjoint_pair_equal", statistic=repeats,
                           z=None, p_raw=repeat_p,
                           method="app binomial p0=1/37"))

    for family in {test["family"] for test in tests}:
        members = [test for test in tests if test["family"] == family]
        for test, adj in zip(members, holm([test["p_raw"] for test in members])):
            test["p_holm_family"] = float(adj)
    for test, adj in zip(tests, holm([test["p_raw"] for test in tests])):
        test["p_holm_entire_audit"] = float(adj)
    test_lookup = {(test["family"], test["test"]): test for test in tests}
    for row in rows:
        test = test_lookup[("marginal", row["category"])]
        row["p_holm_50"] = test["p_holm_family"]
        row["p_holm_entire_audit"] = test["p_holm_entire_audit"]
    for row in blocks:
        row["p_holm_blocks"] = test_lookup[
            ("blocks", f"block_{row['block']:03d}")]["p_holm_family"]
    for row in order_rows:
        row["p_holm_order"] = test_lookup[("order", row["test"])]["p_holm_family"]

    # Power is prospective sensitivity to stated effects, not observed power.
    power_rows = []
    for p0, label in [(1/37, "single_number"), (18/37, "red")]:
        for relative in [.01, .05]:
            for direction in [-1, 1]:
                p1 = p0*(1+direction*relative)
                for alpha in [.05, .05/49]:
                    power_rows.append(dict(category=label, n=n, p0=p0, p1=p1,
                                           relative_effect=direction*relative,
                                           alpha=alpha,
                                           exact_power=binomial_power(n,p1,p0,alpha)))

    # Directly execute only the attached app's isolated math functions.
    cases = [dict(category=row["category"], k=row["wins"], n=n, p0=row["p0"],
                  scipy_p=row["p_raw"],
                  scipy_above=row["posterior_probability_above"],
                  scipy_ci_low=row["credible95_low"],
                  scipy_ci_high=row["credible95_high"]) for row in rows]
    # Exact small-n checks independently sum binomial coefficients.
    for small_n, k, p0 in [(10,0,.5),(10,5,.5),(10,10,.5),(25,3,1/37),
                           (40,20,18/37)]:
        lower = sum(math.comb(small_n,i)*p0**i*(1-p0)**(small_n-i)
                    for i in range(k+1))
        upper = sum(math.comb(small_n,i)*p0**i*(1-p0)**(small_n-i)
                    for i in range(k,small_n+1))
        direct = min(1,2*min(lower,upper))
        if not math.isclose(direct,float(app_p(k,small_n,p0)),abs_tol=1e-12):
            raise AssertionError("Independent small-n binomial validation failed")
        ci = stats.beta.ppf([.025,.975],k+1,small_n-k+1)
        cases.append(dict(category=f"check_n{small_n}_k{k}",k=k,n=small_n,
                          p0=p0,scipy_p=direct,
                          scipy_above=float(stats.beta.sf(p0,k+1,small_n-k+1)),
                          scipy_ci_low=float(ci[0]),scipy_ci_high=float(ci[1])))
    save_json(out / "app_validation_cases.json", cases)
    subprocess.run([args.node, str(HERE / "verify_app_math.cjs"),
                    str(args.app.resolve()), str(out)], check=True, timeout=90)
    parity = json.loads((out / "app_math_validation.json").read_text())
    if not parity["passed"]:
        raise AssertionError("Attached app numerical validation failed")
    for example in parity["sample_size_examples"]:
        scipy_current = binomial_power(n, example["p1"], example["p0"], .05)
        example["scipy_power_current"] = scipy_current
        example["abs_current_power_error"] = abs(
            scipy_current - example["app_power_current"])
        planned_n = example["app_required_n"]
        example["scipy_power_at_app_required_n"] = (
            binomial_power(int(planned_n),example["p1"],example["p0"],.05)
            if planned_n is not None else None)
        if example["abs_current_power_error"] > 1e-6:
            raise AssertionError("App power does not match independent tails")
    save_json(out / "app_math_validation.json",parity)

    full_weeks, remainder = divmod(n, WEEK_SIZE)
    summary = dict(
        n=n, valid_rows=n, invalid_rows=0, unique_numbers=len(np.unique(x)),
        source_bytes=len(raw), source_sha256=protocol["source_sha256"],
        app_sha256=protocol["app_sha256"],
        expected_per_pocket=n/37, full_weeks=full_weeks,
        final_partial_rows=remainder,
        omnibus_chi2=float(omnibus.statistic), omnibus_df=36,
        omnibus_p=float(omnibus.pvalue),
        omnibus_p_holm_50=test_lookup[("marginal","all_37_pockets_uniform")]["p_holm_family"],
        raw_binomial_rejections=sum(row["p_raw"]<ALPHA for row in rows),
        corrected_binomial_rejections=sum(row["p_holm_50"]<ALPHA for row in rows),
        app_bayes_final_stops=sum(row["app_bayesian_stop"] for row in rows),
        monitoring_looks=number_looks,
        monitoring_prefixes=len(schedule),
        monitoring_threshold=ALPHA/number_looks,
        raw_monitor_alerts=sum(row["app_alert"] for row in monitoring),
        adjusted_monitor_alerts=sum(row["schedule_adjusted_alert"] for row in monitoring),
        raw_block_rejections=sum(row["p_raw"]<ALPHA for row in blocks),
        corrected_block_rejections=sum(row["p_holm_blocks"]<ALPHA for row in blocks),
        homogeneity_chi2=float(homogeneity.statistic),
        homogeneity_df=homogeneity.dof,homogeneity_p=float(homogeneity.pvalue),
        corrected_order_rejections=sum(row["p_holm_order"]<ALPHA for row in order_rows),
        pair_count=len(left),pair_independence_df=independence.dof,
        pair_independence_min_expected=float(independence.expected_freq.min()),
        entire_audit_tests=len(tests),
        entire_audit_rejections=sum(t["p_holm_entire_audit"]<ALPHA for t in tests),
        empirical_entropy_bits=float(stats.entropy(counts, base=2)),
        uniform_entropy_bits=math.log2(37),
        max_abs_relative_pocket_deviation_percent=max(
            abs(row["relative_deviation_percent"]) for row in rows[:37]),
        software=dict(python=platform.python_version(),numpy=np.__version__,
                      scipy=scipy.__version__,matplotlib=matplotlib.__version__),
        app_math_validation=parity,
    )
    for filename, values in [
        ("category_results.csv",rows), ("weekly_blocks.csv",blocks),
        ("monitoring_prefixes.csv",monitoring), ("order_tests.csv",order_rows),
        ("power_sensitivity.csv",power_rows), ("frequentist_tests.csv",tests),
    ]:
        save_csv(out / filename,values)
    save_json(out / "summary.json",summary)
    (out / "requirements-analysis.txt").write_text(
        f"numpy=={np.__version__}\nscipy=={scipy.__version__}\n"
        f"matplotlib=={matplotlib.__version__}\n",encoding="utf-8")

    make_chart(out,rows,blocks,order_rows,monitoring,summary)
    make_report(out,rows,blocks,order_rows,power_rows,summary,protocol)
    print(json.dumps(plain({k:v for k,v in summary.items()
                           if k != "app_math_validation"}),indent=2),flush=True)


def make_chart(out,rows,blocks,order_rows,monitoring,summary):
    plt.rcParams.update({"font.size":10,"axes.spines.top":False,
                         "axes.spines.right":False})
    fig,axes=plt.subplots(2,2,figsize=(14,9),layout="constrained")
    pockets=rows[:37]
    z=np.array([row["z"] for row in pockets])
    axes[0,0].bar(range(37),z,color="#256b8e")
    limit=stats.norm.isf(.05/(2*50))
    for level in [-limit,limit]:
        axes[0,0].axhline(level,color="#a63d40",ls="--",lw=1)
    axes[0,0].set(title="Pocket deviations from 1/37",xlabel="Pocket number",
                  ylabel="Standardized count deviation")
    axes[0,0].text(.02,.95,"Dashed: approximate 50-test Bonferroni guide",
                    transform=axes[0,0].transAxes,va="top",fontsize=9)
    axes[0,1].plot([b["block"] for b in blocks],
                    [-math.log10(max(b["p_raw"],1e-300)) for b in blocks],
                    color="#256b8e",lw=1.2)
    axes[0,1].axhline(-math.log10(.05/(len(blocks)+1)),
                       color="#a63d40",ls="--")
    axes[0,1].set(title="Consecutive 20,160-spin blocks (last is partial)",
                  xlabel="Block index, not a historical calendar date",
                  ylabel="-log10(uniformity p-value)")
    lags=order_rows[:10]
    axes[1,0].bar(range(1,11),[r["statistic"] for r in lags],color="#317873")
    limit=stats.norm.isf(.05/(2*15))/math.sqrt(summary["n"])
    axes[1,0].axhline(limit,color="#a63d40",ls="--")
    axes[1,0].axhline(-limit,color="#a63d40",ls="--")
    axes[1,0].set(title="Numeric-label autocorrelation (limited order check)",
                  xlabel="Lag in records",ylabel="Pearson correlation")
    for category,color in [("number_09","#256b8e"),("red","#a63d40"),
                            ("odd","#317873")]:
        selected=[r for r in monitoring if r["category"]==category]
        axes[1,1].plot([r["prefix_n"] for r in selected],
                        [-math.log10(max(r["p_raw"],1e-300)) for r in selected],
                        label=category,color=color,lw=1.3)
    axes[1,1].axhline(-math.log10(summary["monitoring_threshold"]),
                       color="black",ls="--",label="All-look Bonferroni")
    axes[1,1].set(title="Illustrative cumulative app p-values",
                  xlabel="Prefix length",ylabel="-log10(p-value)")
    axes[1,1].legend(fontsize=8)
    fig.suptitle(f"2m-rng.txt: {summary['n']:,} roulette results",fontsize=17)
    fig.savefig(out / "diagnostics.png",dpi=170)
    plt.close(fig)


def make_report(out,rows,blocks,order_rows,power_rows,s,p):
    pocket_sorted=sorted(rows[:37],key=lambda r:r["p_raw"])
    group_rows=rows[37:]
    order_table=md_table(["Check","Statistic","Raw p","Holm p (15)"],[
        [r["test"],f"{r['statistic']:.7g}",f"{r['p_raw']:.6g}",
         f"{r['p_holm_order']:.6g}"] for r in order_rows])
    category_table=md_table(
        ["Category","Count","Observed %","Deviation, pp","App p","Holm p"],
        [[r["category"],f"{r['wins']:,}",f"{100*r['observed_probability']:.6f}",
          f"{r['deviation_percentage_points']:+.6f}",f"{r['p_raw']:.6g}",
          f"{r['p_holm_50']:.6g}"] for r in rows])
    bayes_table=md_table(
        ["Pocket","Posterior mean %","95% credible interval %","P(p > p0)",
         "App 0.99 stop"],
        [[r["category"],f"{100*r['posterior_mean']:.6f}",
          f"[{100*r['credible95_low']:.6f}, {100*r['credible95_high']:.6f}]",
          f"{r['posterior_probability_above']:.6f}",r["app_bayesian_stop"]]
         for r in pocket_sorted[:5]])
    power_table=md_table(["Mapping","Relative effect","Alpha","Power at 2M"],[
        [r["category"],f"{100*r['relative_effect']:+.0f}%",
         f"{r['alpha']:.6g}",f"{100*r['exact_power']:.3f}%"]
         for r in power_rows])
    sample_size_table=md_table(
        ["Observed-effect example","App required N","SciPy power there"],
        [[r["category"],f"{r['app_required_n']:,}",
          f"{100*r['scipy_power_at_app_required_n']:.6f}%"]
         for r in s["app_math_validation"]["sample_size_examples"]])
    worst=pocket_sorted[0]
    marginal_conclusion=("No marginal uniformity null was rejected after the "
        "50-test Holm correction." if not s["corrected_binomial_rejections"]
        and s["omnibus_p_holm_50"]>=.05 else
        "There is corrected evidence against at least one marginal null; "
        "inspect the tables before describing the data as unbiased.")
    order_conclusion=("No selected order diagnostic rejected after its "
        "15-test Holm correction." if not s["corrected_order_rejections"] else
        "At least one selected order diagnostic rejected after correction.")
    conclusion=("No statistically significant departure was detected by the "
        "fixed audit after its experiment-wide correction." if not
        s["entire_audit_rejections"] else
        "The fixed audit detected at least one experiment-wide corrected "
        "departure; see the machine-readable test table.")
    result_paragraph = textwrap.fill(
        f"**{conclusion}** {marginal_conclusion} {order_conclusion}", width=80)
    text=f'''# Analysis of 2m-rng.txt using the bias calculator

Analysis date: {DATE} (Asia/Kuala_Lumpur).

## Usage and expected output

Run from the repository's `rou` folder with Python 3.12+ and Node.js:

```powershell
python -m pip install -r docs/2m_rng_analysis/requirements-analysis.txt
python docs/2m_rng_analysis/analyze_2m_rng.py
```

The app defaults to `../bias_calc/index.html`; pass `--app PATH` if needed.
Run in an analysis environment rather than modifying application dependencies.
The script validates the input, writes CSV/JSON/PNG artifacts, checks the
attached app's math against SciPy, and regenerates this report. Expected
summary: {s['n']:,} valid rows; {s['entire_audit_tests']:,} frequentist checks;
{s['entire_audit_rejections']} experiment-wide rejections. See
[`summary.json`](2m_rng_analysis/summary.json) for exact values and versions.

## Result and implication

{result_paragraph}

This supports compatibility with independent uniform roulette draws on the
tested properties. It does **not** prove true randomness, independence at
all lags, cryptographic unpredictability, physical-wheel provenance, or lack
of every possible bias. A publicly downloadable sequence is predictable
to anyone who knows its position, even if its frequencies look random.
Passing this audit therefore does not make replay an unpredictable live RNG.

Next step: retain the unchanged source and its checksum, investigate any
unadjusted alerts in their multiple-testing context, and request generator/
provenance information if stronger claims are needed. No input results were
filtered, shuffled, regenerated, or changed. No game code was modified.

## Data integrity and audit protocol

| Item | Observed value / evidence |
| --- | --- |
| Input | `rou/assets/2m-rng.txt` |
| Bytes | {s['source_bytes']:,} |
| Valid integer rows | {s['n']:,} |
| Invalid / blank rows discarded | 0; validation would abort instead |
| Supported values seen | All 37 integers, 0 through 36 |
| Input SHA-256 | `{s['source_sha256']}` |
| Equation source | `bias_calc/index.html` |
| Equation-source SHA-256 | `{s['app_sha256']}` |
| Fair pocket probability | Exact 1/37 = {100/37:.9f}% |
| Expected count per pocket | {s['expected_per_pocket']:.6f} |
| Complete replay weeks | {s['full_weeks']} of 20,160 spins |
| Remaining partial week | {s['final_partial_rows']:,} spins |

Evidence: strict parser and checksums in the reproducible script and
[`protocol.json`](2m_rng_analysis/protocol.json). Blank/invalid rows are not
silently skipped. The analysis is retrospective: the initial counts were
inspected before the fixed test script was written. This is not a preregistered
prospective experiment. Mappings and thresholds were then held fixed across
the full dataset; selected illustrative plots do not change the test family.

Null model: independent, identically distributed categorical draws with
probability 1/37 for each pocket. The primary marginal question is uniformity;
order diagnostics additionally examine limited forms of non-independence.

## How the app's equations were applied

The app accepts W/L observations, so it cannot ingest a roulette integer
without a mapping. For each number, W means that number occurred; otherwise
L. For outside bets, W means membership of the named set. Zero loses all
even-money outside bets and is not treated as odd/even or red/black.

There are 49 fixed mappings: 37 pockets; red/black; odd/even; low/high;
three dozens; and three columns. Their exact null probabilities are 1/37,
18/37, or 12/37. The app's default 0.5 and rounded 0.027 are not substituted
for the correct roulette values.

### 1. One-time binomial review

For count k in N observations, the supplied app defines:

```text
X ~ Binomial(N, p0)
p_app = min(1, 2 * min(P(X <= k), P(X >= k)))
```

Source: `twoSidedP`, app lines 385-389, with inclusive tails from lines
371-383. This doubled-tail definition is deliberately retained. It can
differ from another library's probability-ordered two-sided binomial test.
Raw app threshold: 0.05. Holm adjustment covers the 49 mappings plus the
37-pocket omnibus test: 50 marginal tests. Arbitrarily dependent mappings
do not invalidate Holm's familywise adjustment.

For sorted p-values p(1) <= ... <= p(m), the adjusted value at rank i is
min(1, max over j<=i of (m-j+1)*p(j)). The saved code applies that rule
without assuming the categories or prefixes are independent.

### 2. Sequential monitor, with an explicit finite checking schedule

The app reuses the same p-value and flags p < 0.001 (lines 520-553).
Its 'overall 0.05' field is reference-only; it does not control repeated
looks. Dividing alpha by a fixed 20 or 50 does not provide a general
guarantee for indefinitely checking every record.

This audit evaluates {s['monitoring_prefixes']} cumulative prefixes: each
completed 20,160-spin block and the final incomplete block. Across 49
mappings, that is {s['monitoring_looks']:,} opportunities. To bound their
combined false-alarm probability at 0.05 under the null, the Bonferroni
per-opportunity threshold is {s['monitoring_threshold']:.10g}.

Observed: {s['raw_monitor_alerts']} app-threshold alerts, versus
{s['adjusted_monitor_alerts']} schedule-corrected alerts. These are
retrospective scheduled-prefix diagnostics, **not** a replay of every
possible stopping time. Use a valid alpha-spending/confidence-sequence
method before deploying continuous real-time inference.

### 3. Beta-binomial posterior estimates

Preserving the app's Beta(1,1) prior and its equations (lines 556-580):

```text
p | data ~ Beta(k+1, N-k+1)
posterior mean = (k+1)/(N+2)
95% interval = Beta quantiles at 0.025 and 0.975
P(p > p0) = Beta survival probability at p0
P(p < p0) = Beta CDF at p0
app stop = max(P(p > p0), P(p < p0)) > 0.99
```

At the final sample, {s['app_bayes_final_stops']} of 49 mappings meet that
directional stop rule. These are marginal posterior direction probabilities,
not probabilities that 'the whole generator is biased'. A continuous Beta
prior assigns zero probability to exact equality p=p0 before seeing data,
so P(p != p0) is not a useful fairness probability under this model. A
posterior threshold also does not automatically control the frequentist
false-alarm rate across many categories or repeated stopping.

For an explicitly illustrative practical tolerance, the CSV also gives
posterior probability outside p0 +/- 1% of p0. That tolerance was not
provided by the owner and is not an accepted product bias threshold.
Separate marginal Beta(1,1) priors are app-compatible binary analyses, not
a single coherent 37-category Dirichlet posterior.

### 4. Power and the app's required-N display

`criticalRegion`, `exactPower`, and `requiredN` are at app lines 392-438.
Power sums binomial probabilities in both rejection tails under a specified
alternative p1. The required-N search uses fixed normal-score constants as
an initial bracket, discrete-power binary search, and a 100-million guard
only while expanding that bracket. It is not a general proof of the exact
minimum N; discrete rejection regions can make power nonmonotone locally.

Do not estimate 'more records needed' from the same observed deviation and
use it as additional evidence for bias. Here, sensitivity is calculated for
declared hypothetical relative effects of +/-1% and +/-5%, using exact
binomial tails at the actual N. No data-dependent required-N claim is used
to decide fairness. The attached app's sample-size and power outputs for
the three most deviant pockets are also cross-checked and retained in
[`app_math_validation.json`](2m_rng_analysis/app_math_validation.json).

{sample_size_table}

These observed-effect examples reproduce the app's display. They are not
prospective sample-size recommendations or additional evidence for bias.

## Marginal results

Overall Pearson goodness-of-fit statistic:
chi-square = **{s['omnibus_chi2']:.9f}**, df = 36,
raw p = **{s['omnibus_p']:.9g}**,
50-test Holm p = **{s['omnibus_p_holm_50']:.9g}**.

{s['raw_binomial_rejections']} of the individual mappings cross unadjusted
0.05; {s['corrected_binomial_rejections']} cross the marginal-family adjusted
threshold. The largest absolute pocket frequency deviation is
{s['max_abs_relative_pocket_deviation_percent']:.6f}% **relative** to 1/37;
relative percent is not the same as percentage points.

The smallest raw pocket p-value is for {worst['category']}, with
{worst['wins']:,} occurrences, {100*worst['observed_probability']:.6f}%
frequency, p={worst['p_raw']:.7g}, and corrected
p={worst['p_holm_50']:.7g}. This pocket is highlighted because it is the
observed extreme, not because it was selected before seeing the data.

{category_table}

Exact machine-readable values and app flags are in
[`category_results.csv`](2m_rng_analysis/category_results.csv). Its
Clopper-Pearson intervals use alpha/49 per category, providing simultaneous
at-least-95% coverage for these 49 binary probabilities under the model.
The app's ordinary 95% posterior intervals are marginal, not simultaneous.

Five most deviant pockets, with the app's posterior calculations:

{bayes_table}

## Sequence order and independence diagnostics

These checks supplement the app, whose W/L count summaries cannot detect
all order effects. A repeating 0,1,...,36 cycle could have perfect pocket
counts and still be completely deterministic.

- Pearson numeric-label correlations at lags 1 through 10 use a large-sample
  normal approximation. Numeric labels are only one projection of the data.
- Binary runs tests use red/non-red, odd/non-odd, and low/non-low, retaining
  zero in the complementary category. Conditional run-count mean/variance
  follow the standard two-class runs test; no continuity correction.
- A 37-by-37 independence table uses **non-overlapping** pairs (rows 1/2,
  3/4, ...), avoiding a naive independent-cell claim for overlapping pairs.
  It has {s['pair_count']:,} pairs, df={s['pair_independence_df']}, and minimum
  fitted expected cell count {s['pair_independence_min_expected']:.3f}.
- A separate app-form binomial test checks equality within those disjoint
  pairs against probability 1/37 under independent uniform draws.

Holm correction covers all 15 order diagnostics.

{order_table}

These checks can miss longer-period, nonlinear, state-dependent, or
cryptographic structure. Counts and order tests do not identify how the
source file was generated.

## Consecutive blocks and replay-week relevance

There are {s['full_weeks']} complete 20,160-spin blocks plus a final
{s['final_partial_rows']:,}-spin block. These are sequential input sections,
not dated physical-wheel observations. Each is tested against uniformity;
the shorter last block uses its own expected counts.

Raw 0.05 block flags: {s['raw_block_rejections']}; corrected flags:
{s['corrected_block_rejections']}. The correction family also includes
a contingency-table homogeneity test across blocks:
chi-square={s['homogeneity_chi2']:.7g}, df={s['homogeneity_df']},
raw p={s['homogeneity_p']:.7g}. See
[`weekly_blocks.csv`](2m_rng_analysis/weekly_blocks.csv).

Do not discard, reorder, or choose only weeks that pass tests; doing so
would alter the source and its statistical interpretation. The required
weekly extraction can preserve contiguous original rows without changing
these analysis results.

## Prospective sensitivity at the actual sample size

Relative effects mean multiplicative changes in p0, not percentage-point
shifts. For a pocket, +1% means p1=(1/37)*1.01. The .05/49 scenarios use a
conservative Bonferroni threshold for the 49 binary mappings. Actual Holm
power depends on the joint pattern of alternatives and is not claimed here.

{power_table}

Power below 80% for a specified small effect means the audit may miss it;
it does not make the observed file biased. High power does not prove the
generator is unpredictable or free of untested structure.

## Numerical validation and software

- Source-app math runs in an isolated Node VM containing only the math
  declarations, with a timeout. No DOM handlers or app instructions execute.
- {s['app_math_validation']['cases']} cases compare app doubled-tail p-values,
  posterior direction probabilities, and credible limits with SciPy.
- Maximum absolute p-value discrepancy:
  {s['app_math_validation']['max_abs_p_error']:.6g}; posterior-direction
  discrepancy: {s['app_math_validation']['max_abs_above_error']:.6g};
  credible-limit discrepancy: {s['app_math_validation']['max_abs_ci_error']:.6g}.
- Validation tolerances: absolute p/posterior-direction error below 1e-6;
  credible-limit error below 1e-7; current-N power error below 1e-6.
- Five small-N p-values are independently checked by summing binomial PMFs
  with integer binomial coefficients, rather than trusting one implementation.
- App power/required-N cases are retained with achieved power recomputed by
  SciPy; their limitations are stated above.
- Software: Python {s['software']['python']}, NumPy {s['software']['numpy']},
  SciPy {s['software']['scipy']}, Matplotlib {s['software']['matplotlib']}.

Across all four frequentist families there are {s['entire_audit_tests']:,}
p-values. An additional audit-wide Holm correction produces
{s['entire_audit_rejections']} rejections. Family-specific adjusted values
remain available, so a broader correction does not hide their results.
Bayesian stop flags are not p-values and are not part of that correction.

![Frequency, block, order, and cumulative diagnostics](2m_rng_analysis/diagnostics.png)

## Files and sources

- [`analyze_2m_rng.py`](2m_rng_analysis/analyze_2m_rng.py): reproducible audit.
- [`verify_app_math.cjs`](2m_rng_analysis/verify_app_math.cjs): original-math
  extraction and numerical comparisons.
- [`protocol.json`](2m_rng_analysis/protocol.json): fixed mappings, settings,
  checksums, look schedule, and retrospective-design disclosure.
- [`summary.json`](2m_rng_analysis/summary.json): exact summary and versions.
- [`frequentist_tests.csv`](2m_rng_analysis/frequentist_tests.csv): all raw,
  family-adjusted, and experiment-wide adjusted p-values.
- [`monitoring_prefixes.csv`](2m_rng_analysis/monitoring_prefixes.csv): complete
  finite-prefix app-monitor audit, including schedule adjustment.
- [`order_tests.csv`](2m_rng_analysis/order_tests.csv) and
  [`power_sensitivity.csv`](2m_rng_analysis/power_sensitivity.csv): diagnostics.
- Equation source: `C:/automation/prototypes/bias_calc/index.html`, especially
  lines 321-453 and 486-580. Only its numerical methods were used; explanatory
  claims are evaluated rather than treated as instructions or guarantees.
- [SciPy binomial reference](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html):
  binomial tails and numerical implementation.
- [SciPy Beta reference](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.beta.html):
  posterior distribution CDF/survival/quantiles.
- [NIST goodness-of-fit reference](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm):
  categorical goodness-of-fit interpretation.
- [NIST runs-test reference](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35d.htm):
  conditional run-count diagnostics.
- [NIST Bonferroni inequality](https://www.itl.nist.gov/div898/handbook/prc/section4/prc473.htm):
  finite-family simultaneous error/coverage control via the union bound.
- [NIST randomness-testing limits](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-22.pdf):
  statistical tests cannot substitute for analysis of generator construction.

All numerical claims in this report come from the unchanged checksummed
input and saved audit outputs. No legal classification or source-provenance
claim is made. Input file and app hashes should be rechecked before comparing
this report with later versions.
'''
    (out.parent / "2M_RNG_ANALYSIS.md").write_text(text,encoding="utf-8")


if __name__ == "__main__":
    main()
