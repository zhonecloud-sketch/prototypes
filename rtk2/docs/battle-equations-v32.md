# V32: recovered domestic and battle equations

The supplied English `main.exe` supersedes the Python reconstruction. Addresses below are physical offsets in the unpacked executable, not offsets in its compressed on-disk representation. Executable SHA-256: `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`.

These findings come from static control-flow inspection and bounded execution of unchanged arithmetic routines. They do not constitute a complete DOS playthrough. The test harness intercepts the original random-number helper with controlled rolls and executes no DOS services.

## Cultiv and Flood

Both orders call the shared routine at `0x10750`. Cultiv passes Land (`0x107EC`, province byte `+0x16`); Flood passes flood protection (`0x107C6`, byte `+0x18`). Each uses the selected general's **INT and CHA**. WAR has no role in this recovered calculation.

Let `V` be the current attribute, `G` the gold spent (1–100), and `D` the difficulty (1–5). All square roots round down:

```text
A = INT + floor(CHA / 2)
B = floor((100 - floor(V / 2)) * G / 100)
C = floor(sqrt(B * A))
H = floor((D + 1) / 2)
gain = max(0, floor(sqrt(floor(C / H))) - D)
new attribute = min(100, V + gain)
```

The final subtraction is **D**, not H. The subtraction helper at `0x04A2C` saturates at zero. The former remaster formula followed the Python reconstruction's smaller subtraction; v32 fixes the order, preview, AI and delegated development together. Gold is spent and the chosen general uses their monthly action. An attribute already at 100 cannot improve.

## Army power and equipment

The native officer record contains soldiers at word `+0x12`, weapons at word `+0x14`, and training at byte `+0x16`. The weapons word is not morale. Equipment coverage comes from `0x0533E`:

```text
E = min(100, floor(100 * weapons / soldiers))
P = 3 * (WAR + bonus) + training + E
```

Zero soldiers yields E = 100 in the native helper, but such units do not conduct melee. The power routine at `0x23702` gives **+20 WAR** when the native face word is `0xA3` (Lu Bu; zero-based portrait 162 in scenario data). No other portrait bonus is inferred here.

Soldier count does not multiply P. It limits casualties and the random opposing-men term. Thus twice as many soldiers is not twice the recovered normal-melee power.

## Normal melee casualties

The signed-loss helper at `0x2375A` is called for both armies using their **pre-exchange** powers and soldier counts. For each army:

```text
R = random integer 0..299
raw = trunc(trunc(10 * (own P - opposing P - min(opposing men, R)) / T) / F)
loss = -raw, if raw < 0
loss = random integer 1..30, otherwise
loss = min(own men, loss)
```

`trunc` rounds toward zero, including negative values. Each army rolls separately. The divisors at `0x3ADD6` are:

| Terrain/context | T |
|---|---:|
| Plain | 10 |
| Jungle | 10 |
| Hill | 12 |
| Mountain | 10 (ordinary movement cannot enter) |
| Water | 8 |
| Fort | 15 |
| Palace | 20 |
| Acting unit assaulting the selected palace defender | 5 |

The palace branch at `0x23790` overrides the **acting unit's own casualty divisor** with 5. The defending unit retains its palace divisor of 20. A water attacker does not retain a water divisor of 8 in that particular assault branch.

Normal F = 1. Simultaneous attacks use the participating-unit count as the acting unit's own-loss factor; the defending unit's factor remains 1. The caller at `0x24C58` adds D−1 to the acting unit's factor when an AI unit attacks a human target. This difficulty benefit is not added to AI-versus-AI or human-versus-AI exchanges.

### Controlled examples

With equal powers, both armies at least 150 men, R = 150, and F = 1:

| Exchange | Acting army loses | Target army loses |
|---|---:|---:|
| Plain against plain | 150 | 150 |
| Water attacker against palace defender | 300 | 75 |

With different powers or random rolls, the losses need not follow that simple ratio. The corrected implementation includes these effects rather than imposing a fixed casualty percentage or always forcing the attacker to lose more.

A weak 1,000-man water unit **can** be annihilated by one strong melee exchange, including a sufficiently strong Lu Bu army with a high opposing random roll. There is no recovered fixed 1,000-man kill or minimum. Conversely, equal powers and R = 0 enter the 1–30 fallback, not a large guaranteed loss.

The weapon-loss helpers at `0x235A8` and `0x235C4` remove `floor(actual soldier losses * old E / 100)` weapons, bounded by the army's old weapon stock. V32 applies both soldiers and proportional equipment losses to both sides and preserves them through settlement.

## Charge, morale and defeat

Charge's routine at `0x26399` selects **1–10 exchanges**, replacing the former remaster fixed three. Each exchange uses the corrected casualty calculation. A charge that reduces its target to zero occupies that target's tile immediately; it cannot then overcharge beyond that defeated target.

No melee morale subtraction or morale-at-ten rout appears in the recovered path. V32 removes that unsupported rout and morale contribution to tactical/abstract power. The legacy save field is preserved for compatibility; it is unused and omitted from battle inspection. This does not assert that every unrecovered strategy or event branch has been decoded.

A side can lose with thousands of ordinary soldiers remaining:

- Its food reaches zero: the native food checks at `0x22DBC` and `0x22DD0` end the battle immediately.
- Its commander is removed: commander outcome checks at `0x25207` and `0x2521F` do not require every other unit to be annihilated.
- A valid palace occupation or army withdrawal can end the battle.

The strategic Events summary now includes the recorded outcome reason and survives tactical-log eviction/save/load. Watched spectator battles return to Events. Without the affected save, no particular observed defeat can be attributed to one cause retrospectively.

## Province deployment zones

The loader at `0x2709E` reads 156 terrain bytes for each province and the 156-byte zone block at `41 * 156 + provinceIndex * 156`. The predicate at `0x23992` checks that a chosen cell's zone equals the originating province number.

The audited original `Hexdata.dat` contains **41 maps, 186 directed neighboring approaches, five passable attacker cells per approach and twenty defender cells per province**. Several cells shift inward depending on the province; a uniform template per direction is insufficient. All explicit target/source coordinates are recorded in [deployment-v32.json](deployment-v32.json).

Resource reference commit: `99bdf5a1516e5b7d9ef8def4c935a11319e88bd9` of `https://github.com/JuQiang/Rotk2_Python`. Verify its local original resource with `python3 tools/verify-deployment.py /path/to/Hexdata.dat`.

No English-edition `Hexdata.dat` was supplied. These original resource bytes are from the pinned JuQiang repository's Chinese game resource; its terrain portion matches all current game terrain bytes. The supplied English executable confirms the loader and predicate, but cross-edition resource-byte identity remains unverified.

V32 uses these province-specific cells for placement, Province Map previews, AI deployment, reinforcement arrival and validation. Legacy deployment saves are migrated; already fighting armies retain their current positions.

## Five-unit main invading army

Initial War selection uses the five-unit helper at `0x128A0`, called from `0x156E2`. The ongoing-war helper at `0x1F044` compares the sending ruler with the defender: defender list CB72 has capacity ten, main attacking list CB86 has capacity five, with existing and pending units deducted. Assignment is at `0x1EBD2`.

The tactical Reinforce menu at `0x2CCFC` is defender-only; an attacker reaches “Can't use that command!”. Thus the native evidence does **not** support adding five more ordinary units from another province belonging to the same attacking ruler. Such troops may fill vacancies in the five-unit main list. Allied attacking support remains a separate five-unit contingent in the remaster, with ten total field units.

The remaster's convenient attacker reinforcement button remains an extension to original monthly War dispatch. Its capacity now respects the main-list limit. Complete native allied scheduling and the initial defender selection UI remain untraced; the ten-unit field bound is not an unlimited defender claim.

## Reproduce the arithmetic checks

From the game directory, with the supplied executable and scenario.dat available together in the original-files directory:

```sh
python3 tools/verify-original.py /path/to/original-files-directory /tmp/original-checks.json
python3 -m pip install unicorn
python3 tools/verify-native-equations.py /path/to/main.exe /tmp/native-vectors.json
node tests/v32-tests.mjs
```

The first command asserts 97 native byte checks. The second verification tool runs **1,300 bounded native cases**: 500 domestic, 100 power and 700 casualty vectors, each checked against a separate integer formula. The committed [native-equation-vectors-v32.json](native-equation-vectors-v32.json) allows production regression testing without distributing or executing `main.exe`. Randomness is controlled only for verification, not in normal gameplay.

Remaining approximations include hidden ambush triggers/context, challenge, capture/retreat probability, AI policy, abstract battle coefficients, and allied scheduling. The recovered normal-melee equation is not evidence that these other systems match the original.
