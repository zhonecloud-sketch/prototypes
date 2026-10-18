"""Wheel-order sector supplement. Uses the original audit's math helpers.

Usage from rou: python docs/2m_rng_analysis/analyze_wheel_sectors.py
Expected output: docs/2M_RNG_SECTOR_ANALYSIS.md and sector CSV/JSON/PNG files.
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import math
import re
import subprocess
import sys
import textwrap
from pathlib import Path

sys.dont_write_bytecode = True
import analyze_2m_rng as base
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats


HERE = Path(__file__).resolve().parent
ROU = HERE.parents[1]
ALPHA = .05
SIMULATIONS = 50000
SEED = 20261016


def read_geometry(frontend):
    source = frontend.read_text(encoding="utf-8")
    wheel_match = re.search(r"^const ORDER=(\[[^\n]+?\]);",source,re.M)
    call_match = re.search(r"^const CALLS=(\{[^\n]+\});",source,re.M)
    if not wheel_match or not call_match:
        raise ValueError("Wheel/called-bet declarations not found")
    wheel = json.loads(wheel_match[1])
    if len(wheel) != 37 or sorted(wheel) != list(range(37)):
        raise ValueError("Expected each European-wheel number exactly once")
    regions = []
    for key in ["voisins","tiers","orphelins","zero"]:
        match = re.search(
            rf"{key}:\{{label:'([^']+)',units:(\d+),legs:(\[.*?\])\}}",
            call_match[1])
        if not match:
            raise ValueError(f"Cannot parse {key} bet definition")
        legs = json.loads(match[3])
        members = sorted({number for numbers,units in legs for number in numbers})
        regions.append(dict(region=key,kind="named",label=match[1],
                            size=len(members),start_index=-1,
                            numbers=members,bet_units=int(match[2])))
    expected = [17,12,8,7]
    if [r["size"] for r in regions] != expected:
        raise ValueError("Unexpected named-sector sizes")
    main_sets = [set(r["numbers"]) for r in regions[:3]]
    if (set.union(*main_sets) != set(wheel) or
            sum(map(len,main_sets)) != len(set.union(*main_sets))):
        raise ValueError("Voisins/Tiers/Orphelins must partition the wheel")
    if not set(regions[3]["numbers"]) <= main_sets[0]:
        raise ValueError("Jeu zero must be a subset of Voisins")
    for length in range(1,37):
        for start in range(37):
            members = [wheel[(start+i)%37] for i in range(length)]
            regions.append(dict(region=f"arc_k{length:02d}_i{start:02d}",
                                kind="arc",label=f"{members[0]} to {members[-1]}",
                                size=length,start_index=start,numbers=members,
                                bet_units=length))
    return wheel,regions,call_match[1]


def calibrate_scan(n,wheel,regions,observed_z,repetitions):
    """Simulate the same max-absolute-Z search, including every named set."""
    rng = np.random.default_rng(SEED)
    simulated_maxima = np.empty(repetitions)
    starts = np.arange(37)
    for offset in range(0,repetitions,1000):
        count = min(1000,repetitions-offset)
        hist = rng.multinomial(n,np.full(37,1/37),size=count)
        wheel_counts = hist[:,wheel]
        doubled = np.concatenate([wheel_counts,wheel_counts],axis=1)
        cumulative = np.pad(np.cumsum(doubled,axis=1),((0,0),(1,0)))
        maximum = np.zeros(count)
        for length in range(1,37):
            hits = cumulative[:,starts+length]-cumulative[:,starts]
            p0 = length/37
            z = (hits-n*p0)/math.sqrt(n*p0*(1-p0))
            maximum = np.maximum(maximum,np.abs(z).max(axis=1))
        for region in regions[:4]:
            p0 = region["size"]/37
            z = ((hist[:,region["numbers"]].sum(axis=1)-n*p0)/
                 math.sqrt(n*p0*(1-p0)))
            maximum = np.maximum(maximum,np.abs(z))
        simulated_maxima[offset:offset+count] = maximum
    observed = float(np.max(np.abs(observed_z)))
    exceedances = int(np.count_nonzero(simulated_maxima>=observed))
    p = (exceedances+1)/(repetitions+1)
    interval = stats.beta.ppf([.025,.975],
                             [max(1,exceedances),exceedances+1],
                             [repetitions-exceedances+1,
                              max(1,repetitions-exceedances)])
    return dict(statistic="max absolute standardized count deviation",
                observed_max_abs_z=observed,replications=repetitions,seed=SEED,
                exceedances=exceedances,p_plus_one=p,
                estimated_mc_standard_error=math.sqrt(p*(1-p)/(repetitions+1)),
                binomial_mc_interval95=list(map(float,interval)),
                null_95th_percentile=float(np.quantile(simulated_maxima,.95))),simulated_maxima


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--input",type=Path,default=ROU/"assets/2m-rng.txt")
    parser.add_argument("--frontend",type=Path,default=ROU/"index.html")
    parser.add_argument("--app",type=Path,default=ROU.parent/"bias_calc/index.html")
    parser.add_argument("--output-dir",type=Path,default=ROU/"docs/2m_rng_sector_analysis")
    parser.add_argument("--node",default="node")
    args=parser.parse_args()
    out=args.output_dir.resolve()
    out.mkdir(parents=True,exist_ok=True)
    wheel,regions,called_source=read_geometry(args.frontend)
    raw=args.input.read_bytes()
    text_lines=raw.decode("utf-8-sig").splitlines()
    for index,line in enumerate(text_lines,1):
        value=line.strip()
        if not value.isascii() or not value.isdigit() or not 0<=int(value)<=36:
            raise ValueError(f"Invalid row {index}")
    x=np.array([int(line.strip()) for line in text_lines],dtype=np.int16)
    n=len(x)
    if not n:
        raise ValueError("Empty dataset")
    counts=np.bincount(x,minlength=37)
    masks=np.zeros((len(regions),37),dtype=np.int64)
    for index,region in enumerate(regions):
        masks[index,region["numbers"]]=1
    p0=masks.sum(axis=1)/37
    k=masks@counts
    z=(k-n*p0)/np.sqrt(n*p0*(1-p0))
    schedule=np.unique(np.r_[np.arange(base.WEEK_SIZE,n+1,base.WEEK_SIZE),n])
    source_hash=hashlib.sha256(raw).hexdigest()
    protocol=dict(
        analysis_date="2026-10-16",retrospective=True,
        previous_full_pocket_counts_already_inspected=True,
        null="IID uniform categorical outcomes 0..36",
        source_sha256=source_hash,app_sha256=base.sha256(args.app),
        frontend_sha256=base.sha256(args.frontend),
        wheel_order=wheel,named_called_bets_source=called_source,
        regions=regions,alpha=ALPHA,
        region_family="1332 clockwise arcs (sizes 1..36) plus 4 named regions",
        marginal_family="1336 region binomial tests plus partition chi-square",
        posterior_prior=[1,1],posterior_direction_threshold=.99,
        monitoring_prefixes=schedule.tolist(),
        monitoring_multiplicity=len(regions)*len(schedule),
        monitoring_correction="Bonferroni across every region and prefix",
        monte_carlo=dict(replications=SIMULATIONS,seed=SEED,
                         statistic="maximum absolute Z across all 1336 regions"),
        follow_up_status="supplement; prior audit not silently combined",
    )
    base.save_json(out/"protocol.json",protocol)
    print(f"Testing {len(regions)} sectors/arcs on {n:,} results",flush=True)

    raw_p=base.app_p(k,n,p0)
    partition_hits=k[:3]
    partition=stats.chisquare(partition_hits,f_exp=n*p0[:3])
    holm_all=base.holm(np.r_[raw_p,partition.pvalue])
    holm_named=base.holm(raw_p[:4])
    rows=[]
    for index,region in enumerate(regions):
        wins=int(k[index])
        ci=stats.beta.ppf([.025,.975],wins+1,n-wins+1)
        above=float(stats.beta.sf(p0[index],wins+1,n-wins+1))
        below=float(stats.beta.cdf(p0[index],wins+1,n-wins+1))
        row={key:value for key,value in region.items() if key!="numbers"}
        row.update(numbers=" ".join(map(str,region["numbers"])),n=n,wins=wins,
                   p0=float(p0[index]),observed_probability=wins/n,
                   deviation_pp=100*(wins/n-p0[index]),
                   relative_deviation_percent=100*(wins/n/p0[index]-1),
                   z=float(z[index]),p_raw=float(raw_p[index]),
                   p_holm_1337=float(holm_all[index]),
                   p_holm_named4=float(holm_named[index]) if index<4 else None,
                   app_final_seq_alert=bool(raw_p[index]<.001),
                   posterior_mean=(wins+1)/(n+2),
                   credible95_low=float(ci[0]),credible95_high=float(ci[1]),
                   posterior_above=above,posterior_below=below,
                   app_bayes_stop=max(above,below)>.99)
        rows.append(row)

    block_hist=np.array([np.bincount(x[start:start+base.WEEK_SIZE],minlength=37)
                         for start in range(0,n,base.WEEK_SIZE)])
    prefix_hits=np.cumsum(block_hist,axis=0)@masks.T
    prefix_p=base.app_p(prefix_hits,schedule[:,None],p0[None,:])
    look_count=int(prefix_p.size)
    with gzip.open(out/"sector_prefix_monitor.csv.gz","wt",encoding="utf-8",newline="") as f:
        import csv
        writer=csv.writer(f)
        writer.writerow(["region","prefix_n","wins","p_raw","app_alert",
                         "p_bonferroni_all_looks","corrected_alert"])
        for j,stop in enumerate(schedule):
            for i,region in enumerate(regions):
                p=float(prefix_p[j,i])
                adjusted=min(1,p*look_count)
                writer.writerow([region["region"],int(stop),int(prefix_hits[j,i]),
                                 p,p<.001,adjusted,adjusted<ALPHA])
    named_blocks=[]
    for j,hist in enumerate(block_hist):
        block_n=int(hist.sum())
        for i,region in enumerate(regions[:4]):
            wins=int(hist@ masks[i])
            named_blocks.append(dict(block=j+1,region=region["region"],n=block_n,
                                     wins=wins,p0=float(p0[i]),
                                     p_raw=float(base.app_p(wins,block_n,p0[i]))))
    for row,adjusted in zip(named_blocks,base.holm([r["p_raw"] for r in named_blocks])):
        row["p_holm_named_blocks"]=float(adjusted)

    simulation,maxima=calibrate_scan(n,wheel,regions,z,SIMULATIONS)
    np.save(out/"null_scan_maxima.npy",maxima,allow_pickle=False)
    # Six related headline tests: named four, named partition, calibrated scan.
    headline_adjusted=base.holm(np.r_[raw_p[:4],partition.pvalue,
                                     simulation["p_plus_one"]])
    simulation["p_holm_headline6"]=float(headline_adjusted[-1])
    base.save_json(out/"scan_calibration.json",simulation)

    cases=[dict(category=r["region"],k=r["wins"],n=n,p0=r["p0"],
                scipy_p=r["p_raw"],scipy_above=r["posterior_above"],
                scipy_ci_low=r["credible95_low"],scipy_ci_high=r["credible95_high"])
           for r in rows]
    base.save_json(out/"app_validation_cases.json",cases)
    subprocess.run([args.node,str(HERE/"verify_app_math.cjs"),
                    str(args.app.resolve()),str(out)],check=True,timeout=120)
    parity=json.loads((out/"app_math_validation.json").read_text())
    if not parity["passed"]:
        raise AssertionError("App parity failed")

    most_favoured=max((r for r in rows if r["kind"]=="arc"),key=lambda r:r["z"])
    most_compact=max((r for r in rows if r["kind"]=="arc" and r["size"]<=18),
                     key=lambda r:r["z"])
    most_depleted=min((r for r in rows if r["kind"]=="arc"),key=lambda r:r["z"])
    powers=[]
    for region in regions[:4]:
        for effect in [-.01,.01]:
            probability=region["size"]/37
            powers.append(dict(region=region["region"],relative_effect=effect,
                               n=n,p0=probability,p1=probability*(1+effect),
                               alpha=ALPHA/len(holm_all),
                               power=base.binomial_power(n,probability*(1+effect),
                                                         probability,ALPHA/len(holm_all))))
    summary=dict(n=n,source_sha256=source_hash,wheel_order=wheel,
                 regions=len(rows),contiguous_arcs=1332,
                 raw_region_flags=int(np.count_nonzero(raw_p<.05)),
                 holm_region_flags=int(np.count_nonzero(holm_all[:-1]<ALPHA)),
                 named_raw_flags=int(np.count_nonzero(raw_p[:4]<.05)),
                 named_holm4_flags=int(np.count_nonzero(holm_named<ALPHA)),
                 partition_chi2=float(partition.statistic),partition_df=2,
                 partition_p=float(partition.pvalue),
                 partition_p_holm1337=float(holm_all[-1]),
                 monitoring_prefixes=len(schedule),monitoring_looks=look_count,
                 monitoring_threshold=ALPHA/look_count,
                 raw_prefix_alerts=int(np.count_nonzero(prefix_p<.001)),
                 corrected_prefix_alerts=int(np.count_nonzero(prefix_p<ALPHA/look_count)),
                 raw_bayesian_stops=sum(r["app_bayes_stop"] for r in rows),
                 raw_named_week_flags=sum(r["p_raw"]<ALPHA for r in named_blocks),
                 corrected_named_week_flags=sum(r["p_holm_named_blocks"]<ALPHA for r in named_blocks),
                 most_favoured_arc=most_favoured,
                 most_favoured_compact_arc=most_compact,
                 most_depleted_arc=most_depleted,scan_calibration=simulation,
                 app_validation={key:parity[key] for key in ["cases","passed",
                     "max_abs_p_error","max_abs_above_error","max_abs_ci_error"]})
    base.save_json(out/"summary.json",summary)
    base.save_csv(out/"sector_results.csv",rows)
    base.save_csv(out/"named_weekly_sectors.csv",named_blocks)
    base.save_csv(out/"named_sector_power.csv",powers)
    make_chart(out,wheel,rows,maxima,summary)
    make_report(out,rows,summary,powers,protocol)
    print(json.dumps(base.plain(summary),indent=2),flush=True)


def make_chart(out,wheel,rows,maxima,s):
    fig=plt.figure(figsize=(14,10),layout="constrained")
    grid=fig.add_gridspec(2,2)
    heat=fig.add_subplot(grid[0,:])
    z=np.array([r["z"] for r in rows[4:]]).reshape(36,37)
    limit=max(3.5,float(np.max(np.abs(z))))
    plot=heat.imshow(z,origin="lower",aspect="auto",cmap="RdBu_r",
                     vmin=-limit,vmax=limit,extent=(-.5,36.5,.5,36.5))
    heat.set(xticks=range(37),xticklabels=wheel,
             xlabel="Starting pocket, in the game's clockwise wheel order",
             ylabel="Arc length (pockets)",
             title="All contiguous arcs: standardized excess (red) / deficit (blue)")
    heat.tick_params(axis="x",labelsize=8)
    fig.colorbar(plot,ax=heat,label="Z = (hits - expected) / null SD",shrink=.85)
    names=fig.add_subplot(grid[1,0])
    for i,r in enumerate(rows[:4]):
        delta=100*(r["posterior_mean"]-r["p0"])
        interval=[100*(r["posterior_mean"]-r["credible95_low"]),
                  100*(r["credible95_high"]-r["posterior_mean"])]
        names.errorbar(delta,i,xerr=np.array(interval).reshape(2,1),
                        fmt="o",color="#256b8e",capsize=4)
    names.axvline(0,color="black",lw=1,ls="--")
    names.set(yticks=range(4),yticklabels=[r["label"] for r in rows[:4]],
              xlabel="Posterior deviation from fair rate (percentage points)",
              title="Named regions: marginal 95% credible intervals")
    calibration=fig.add_subplot(grid[1,1])
    calibration.hist(maxima,bins=50,color="#256b8e",alpha=.85,density=True)
    calibration.axvline(s["scan_calibration"]["observed_max_abs_z"],
                         color="#a63d40",lw=2,label="Observed wheel scan")
    calibration.set(xlabel="Maximum |Z| over the complete region search",
                    ylabel="Simulated density",
                    title=f"{s['scan_calibration']['replications']:,} fair-count simulations")
    calibration.legend()
    fig.suptitle("2m-rng.txt: European wheel-sector audit",fontsize=17)
    fig.savefig(out/"wheel_sector_diagnostics.png",dpi=170)
    plt.close(fig)


def make_report(out,rows,s,powers,protocol):
    named=rows[:4]
    strongest=s["most_favoured_arc"]
    compact=s["most_favoured_compact_arc"]
    depleted=s["most_depleted_arc"]
    scan=s["scan_calibration"]
    named_table=base.md_table(
        ["Region","Pockets","Fair %","Observed %","Excess pp","App p","Holm p (4)"],
        [[r["label"],r["size"],f"{100*r['p0']:.6f}",
          f"{100*r['observed_probability']:.6f}",f"{r['deviation_pp']:+.6f}",
          f"{r['p_raw']:.6g}",f"{r['p_holm_named4']:.6g}"] for r in named])
    bayes_table=base.md_table(
        ["Region","95% credible probability interval","P(p > fair)","App stop"],
        [[r["label"],f"[{r['credible95_low']:.8f}, {r['credible95_high']:.8f}]",
          f"{r['posterior_above']:.6f}",r["app_bayes_stop"]] for r in named])
    # Complementary arcs can tie by construction; show the favoured direction.
    top=sorted([r for r in rows[4:] if r["z"]>0],key=lambda r:r["p_raw"])[:10]
    top_table=base.md_table(
        ["Size","Clockwise pockets","Count","Z","Raw p","Holm p (1337)"],
        [[r["size"],r["numbers"],f"{r['wins']:,}",f"{r['z']:.4f}",
          f"{r['p_raw']:.6g}",f"{r['p_holm_1337']:.6g}"] for r in top])
    names_list="\n".join(f"- **{r['label']}**: {r['numbers']}." for r in named)
    power_table=base.md_table(["Region","Relative shift","Corrected alpha","Power"],[
        [r["region"],f"{100*r['relative_effect']:+.0f}%",f"{r['alpha']:.8g}",
         f"{100*r['power']:.3f}%"] for r in powers])
    family_verdict=("No region rejected after correction for the 1,337-test "
        "sector family." if s["holm_region_flags"]==0 else
        "At least one region rejected after sector-family correction.")
    scan_verdict=("The strongest wheel-order concentration is not unusual "
        "relative to the fair-wheel scan simulations." if scan["p_plus_one"]>=.05 else
        "The complete wheel scan is unusual under the specified fair model.")
    opening=textwrap.fill(f"**{family_verdict}** {scan_verdict}",width=80)
    report=f'''# Roulette wheel-sector analysis of 2m-rng.txt

Analysis date: 16 October 2026 (Asia/Kuala_Lumpur).

## Usage and expected output

From `C:/automation/prototypes/rou`, using the original analysis dependencies:

```powershell
python -m pip install -r docs/2m_rng_analysis/requirements-analysis.txt
python docs/2m_rng_analysis/analyze_wheel_sectors.py
```

Expected output: this report; sector CSV/JSON files; a compressed complete
prefix-monitor CSV; simulation maxima; an app-math cross-check; and a chart
under `docs/2m_rng_sector_analysis`. Input, frontend, and calculator source
files are read without modification. The script imports the existing audit's
documented binomial, Holm, power, and serialization helpers.

## Finding and next-step implication

{opening}

This is a retrospective frequency test in physical wheel **order**, using
the same {s['n']:,} results. It addresses whether hits concentrate in a
named sector or contiguous arc, rather than only at individual pockets.
It does not prove that the source came from a physical wheel or that a
particular rotor/ball mechanism is unbiased. A public replay is still
predictable if its position is known.

The source should remain unchanged. These findings do not justify discarding
weeks, rearranging numbers, or inventing a new extraction offset. Very small
effects and untested time-varying or physical-angle effects can remain.

## Definitions and the complete search

Wheel order was parsed from `const ORDER` in `rou/index.html` near line 155:

```text
{' '.join(map(str,s['wheel_order']))}
```

The four called-bet region memberships were parsed from `const CALLS` near
line 225. This uses unique covered pockets, not chip allocation weights:

{names_list}

Voisins, Tiers, and Orphelins partition all 37 pockets (17 + 12 + 8).
Orphelins covers two disjoint arcs; Jeu zero is a seven-pocket arc within
Voisins. This matches the named-set coverage in the operator's published
rules [S3]. Called-bet profit is not determined by hit frequency alone,
because the wager legs and unit allocations can have different returns.
This audit tests landing probability, not called-bet profitability.

To avoid selecting just a visually attractive arc, every clockwise start
position and every nontrivial size from 1 to 36 is included: 37 * 36 =
1,332 arcs. Arcs wrap across zero. Add the four named regions for 1,336
binary tests. Sizes 1 and 36 also revisit the previous single-pocket tests
or their complements; these are not independent new evidence.

Complementary arcs give the same two-sided binomial p-value, and some named
sets duplicate scanned arcs. They are retained transparently. Holm remains
valid with dependent/duplicate hypotheses and can be conservative. An
additional scan simulation accounts directly for the correlated search.
There is no unique 18.5-pocket half-wheel; sizes 18 and 19 are both covered.

## Same calculator equations, correct sector probabilities

For a region of m unique pockets, W means a result lands in that region,
L means it lands outside, and p0=m/37. Thus X~Binomial(N,m/37) under the
independent uniform null. The calculator's doubled-inclusive-tail formula is:

```text
p_app = min(1, 2 * min(P(X <= observed), P(X >= observed)))
posterior = Beta(observed+1, N-observed+1)
posterior P(favoured) = P(p > m/37 | observed data)
app Bayesian stop = max(P(p > p0), P(p < p0)) > 0.99
```

The same Beta(1,1) prior, marginal 95% credible intervals, 0.05 one-time
threshold, and 0.001 app-monitor threshold are retained. An ordinary 0.5
baseline would be wrong for these sectors. Membership is defined in wheel
order, not numerical runs such as 1-12.

## Named sector results

{named_table}

No claim about arbitrary arcs is inferred only from the four named tests.
The three-way sector-partition omnibus gives chi-square
{s['partition_chi2']:.9f}, df=2, p={s['partition_p']:.9g}.
Its Holm p in the complete 1,337-test sector family is
{s['partition_p_holm1337']:.9g}.

{bayes_table}

Posterior intervals/probabilities are **marginal** app outputs, not
simultaneous guarantees or probabilities that the whole generator is biased.
The continuous prior has no point mass at exact fairness. A high probability
on one side of p0 can concern a tiny deviation; significance and practical
effect size remain separate questions.

## Arbitrary contiguous sectors

Most favoured standardized arc (selected after scanning the full file):

- Pockets, clockwise: **{strongest['numbers']}**.
- Size: {strongest['size']} pockets; hits: {strongest['wins']:,}.
- Fair share: {100*strongest['p0']:.6f}%; observed share:
  {100*strongest['observed_probability']:.6f}%.
- Excess: {strongest['deviation_pp']:+.6f} percentage points, or
  {strongest['relative_deviation_percent']:+.6f}% relative to its fair share.
- Z={strongest['z']:.6f}; raw two-sided p={strongest['p_raw']:.9g};
  complete-family Holm p={strongest['p_holm_1337']:.9g}.

This is the most favoured **standardized** arc, not necessarily the arc with
the greatest raw number of extra hits. Larger sectors naturally have more
hits, so their fair expectations and variance must be included.

The broad {strongest['size']}-pocket surplus is the complement of a
{depleted['size']}-pocket deficit at **{depleted['numbers']}**. For a more
compact view, among arcs of at most 18 pockets the strongest positive region
is **{compact['numbers']}** ({compact['size']} pockets):
{100*compact['observed_probability']:.6f}% observed versus
{100*compact['p0']:.6f}% fair, raw p={compact['p_raw']:.7g},
complete-family Holm p={compact['p_holm_1337']:.7g}. This compact region
is also selected after searching; its raw p is not a standalone discovery.

{top_table}

There are {s['raw_region_flags']} raw p<0.05 flags among all 1,336 regions,
but {s['holm_region_flags']} after Holm correction for the 1,336 binary
tests plus the partition test. Unadjusted flags from searching overlapping
arcs are not independent discoveries. The two-sided scan also tests deficits;
a deficit for one arc can appear as a surplus in its complementary arc.

The app's unadjusted 0.99 posterior-direction stop rule triggers for
{s['raw_bayesian_stops']} of the 1,336 regions. Those flags concern many
overlapping/complementary sets and are not independent discoveries or a
0.99 posterior probability that the generator is biased. They do not
provide a search-wide false-alarm guarantee. The calibrated whole-search
result below addresses how unusual the selected strongest effect is under
the specified fair null.

## A calibrated test of the strongest apparent sector

Statistic: T=max over all 1,336 regions of absolute standardized deviation.
Under the fair null, simulate complete count vectors from
Multinomial(N, [1/37,...,1/37]) and perform **the same entire search** on each.
This includes all start positions, lengths, and named regions; it does not
compare a selected arc against an unsearched single-arc reference.

- Observed T: {scan['observed_max_abs_z']:.7f}.
- Fair simulations: {scan['replications']:,}; fixed seed {scan['seed']}.
- Simulations with T >= observed: {scan['exceedances']:,}.
- Selection-adjusted Monte Carlo p: **{scan['p_plus_one']:.7f}**,
  calculated as (exceedances+1)/(simulations+1).
- Estimated Monte Carlo standard error: {scan['estimated_mc_standard_error']:.6f}.
- 95% interval for the underlying simulation tail probability:
  [{scan['binomial_mc_interval95'][0]:.6f},
  {scan['binomial_mc_interval95'][1]:.6f}]. This interval measures simulation
  precision, not the probability the wheel is fair.
- Fair-scan 95th percentile of T: {scan['null_95th_percentile']:.6f}.
- A further Holm correction across six headline tests (four named tests,
  their partition test, and this global scan) gives scan
  p={scan['p_holm_headline6']:.7f}.

This calibration is conditional on the stated IID uniform null. It is not
a correction for every analysis ever performed on this source. The earlier
audit and this requested follow-up are not represented as a preregistered
single prospective experiment.

## Sequential and weekly checks

The app's monitor was evaluated at {s['monitoring_prefixes']} cumulative
prefixes: each full 20,160-spin week and the final partial section. Across
1,336 regions there are {s['monitoring_looks']:,} checks. Bonferroni for an
overall 0.05 schedule goal uses p < {s['monitoring_threshold']:.10g}.

- Raw app p<0.001 prefix alerts: {s['raw_prefix_alerts']}.
- All-look corrected prefix alerts: {s['corrected_prefix_alerts']}.
- Raw named-sector 0.05 flags across 100 individual blocks and four names:
  {s['raw_named_week_flags']}.
- Corrected named-block flags across those 400 tests:
  {s['corrected_named_week_flags']}.

These are finite-prefix and named-block checks, not an assertion that every
arbitrary arc was tested at every possible stopping time or every weekly
block. Full cumulative-prefix results are saved as compressed CSV to keep
the complete table manageable. The earlier audit supplies additional whole-
sequence/order diagnostics. Small recurring checks do not automatically
inherit a 5% false-alarm guarantee from the app's reference-only field.

## Sensitivity and limitations

Power for hypothetical +/-1% **relative** shifts in named sector probability
at this N, using the app's exact binomial rejection tails and conservative
alpha=0.05/1337:

{power_table}

Those are planning scenarios, not observed-effect sample-size claims.
Reported powers may round to 100%; that is not a proof that every possible
bias is detectable. Small arcs have lower power for the same relative shift.
Combining data from different real wheels or alternating source processes
could also conceal opposing biases. The file supplies outcomes, without
wheel identity, rotor orientation, ball launch angle, speed, or timestamps.
Physical-angle bias and generator unpredictability need additional evidence.

## Numerical checks and artifacts

All {s['app_validation']['cases']} region p-values, posterior direction
probabilities, and credible intervals were checked directly against the
attached calculator's isolated math declarations. Maximum absolute errors:
p={s['app_validation']['max_abs_p_error']:.7g}; posterior direction
={s['app_validation']['max_abs_above_error']:.7g}; interval endpoint
={s['app_validation']['max_abs_ci_error']:.7g}. Validation passed using the
same tolerances as the original audit. No UI/event-handler code executes.

Source SHA-256: `{s['source_sha256']}`.
Geometry, calculator hashes, exact membership sets, simulation seed, and
check schedule are recorded in the protocol.

![Wheel-order arc scan and named-sector results](2m_rng_sector_analysis/wheel_sector_diagnostics.png)

- [Reproducible sector script](2m_rng_analysis/analyze_wheel_sectors.py).
- [Protocol](2m_rng_sector_analysis/protocol.json).
- [Summary](2m_rng_sector_analysis/summary.json).
- [All named-sector and arc results](2m_rng_sector_analysis/sector_results.csv).
- [Complete finite-prefix monitor CSV, gzip](2m_rng_sector_analysis/sector_prefix_monitor.csv.gz).
- [Named sectors by weekly block](2m_rng_sector_analysis/named_weekly_sectors.csv).
- [Monte Carlo calibration](2m_rng_sector_analysis/scan_calibration.json).
- [Saved fair-scan maxima](2m_rng_sector_analysis/null_scan_maxima.npy).
- [App numerical validation](2m_rng_sector_analysis/app_math_validation.json).
- [Sensitivity scenarios](2m_rng_sector_analysis/named_sector_power.csv).
- [Original pocket/order analysis](2M_RNG_ANALYSIS.md).

## Sources

- [S1] `rou/index.html`: exact wheel order and called-bet memberships,
  extracted from the current source and checksummed in the protocol.
- [S2] `bias_calc/index.html`: doubled binomial tails, Beta posterior,
  monitoring defaults, and exact-power equations. The supplementary script
  uses the existing audit helpers and cross-checks the original math.
- [S3] [Loto-Quebec published roulette rules](https://assets.lotoquebec.com/ressources/assets/v3/assets/blt8296e79a7001648c/blt064c43f7eba0d096/6470f7c980a2483496a7cc4b/instant-roulette-regles-fr.pdf),
  pages 3-4: named-region memberships and the two-arc Orphelins definition.
- [SciPy binomial reference](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html)
  and [Beta reference](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.beta.html):
  stable numerical tails and posterior quantiles.
- [NIST Bonferroni inequality](https://www.itl.nist.gov/div898/handbook/prc/section4/prc473.htm):
  finite-family error control even when the regions overlap.

All result claims are derived from the saved unchanged data and audit
outputs. This supplement does not modify game behavior, infer source
provenance, or authorize changes to the weekly extraction.
'''
    (out.parent/"2M_RNG_SECTOR_ANALYSIS.md").write_text(report,encoding="utf-8")


if __name__=="__main__":
    main()
