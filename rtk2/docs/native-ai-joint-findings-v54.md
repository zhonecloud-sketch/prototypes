# v54 AI-hostile simultaneous attack follow-up

**All88 cases matched the corrected remaster** for target aggregate loss, each army's final soldiers/equipment, exchange count and casualty RNG consumption. This confirms applicability of the helper-order correction to AI-hostile grouped attacks on a human target, not only the human-command handler.

Native entry `0x27D9E` receives a selected target and its hex. It counts eligible surrounding friends, executes the initiator in its first pass, then scans remaining helpers in original **LL,D,LR,UL,U,UR** order. The linked-list/roster order does not change that geometric order. For each helper it calls unchanged exchange `0x24C58`. The resulting target state—remaining men and weapons—is used by the next exchange, and target losses equal the sum of actual capped losses from executed exchanges. A defeated target stops further exchanges; a defeated attacker does not prevent surviving helpers from contributing.

## Coverage

- Three and four friendly attackers.
- Plain and palace target terrain.
- Equal combat power, mixed powers including Lu Bu's native portrait bonus, and low equipment coverage.
- Early defeated target and early defeated initiating attacker.
- Shuffled linked-list/roster order for three attackers and for four attackers surrounding a palace.
- Nonhuman target baseline.
- Human target classification with difficulty1,3 and5.

The original exchange adds **difficulty minus1** to the attacker-counterattack-loss divisor when the target is human and the attacker is AI. Each witness now records the effective divisor at `0x24C8A`, after native difficulty adjustment. For four attackers against a human target at difficulty5, it is8 (4+5-1). The target's own loss calculation still uses divisor1. The Node replay uses the corresponding current `isHuman` classification and difficulty; all final states and RNG call counts agree.

## Bounded hooks and limits

The original AI grouped-handler geometry, true unit lookup, combat power, both casualty equations, proportional equipment equations, men/equipment mutation, native difficulty adjustment and terminal exchange branches execute unchanged. The witness never replaces the damage exchange or equipment helpers.

The AI's **strategic commander-risk grouping predicate** `0x2B7A8` is controlled as false, permitting all otherwise eligible adjacent friends. Therefore this validates the order and arithmetic **once that group is eligible**; it does not certify when the full original AI selects a target, includes/excludes a strategically protected commander, chooses an attack type or forms the attack. Those policy branches are outside this follow-up's scope.

Human ownership lookup `0x238FA` is controlled by fixture: only the target pointer is classified human in the human-target cases. This exercises native difficulty arithmetic without claiming reconstruction of every original human-controller/province ownership representation. DOS rendering/announcements are suppressed. Native depletion-clear instructions execute, while subsequent captive/officer/province bookkeeping is bypassed. Full capture settlement and whole-battle controller behavior require their separate existing integration checks.

No training ran. This evidence and its portable verifier are included in the release; the behavioral suite replays every vector with original and reversed unit rosters.

## Reproduction

```sh
PYTHONPATH=/path/to/unicorn/dependencies python tools/verify-native-ai-joint-v54.py /path/to/main.exe /tmp/native-ai-joint-witness-v54.json --repo /path/to/rtk2
```

Input main.exe SHA256 must be `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Script and JSON contain no executable bytes.

## Regression links to retain

`V54-02-HELPER-ORDER-INDEPENDENT-OF-UNIT-ARRAY`, `V54-02-TARGET-LOSS-EQUALS-EXCHANGE-SUM`, `V54-02-TARGET-EARLY-DEFEAT-STOPS`, `V54-02-ATTACKER-EARLY-DEFEAT-CONTINUES-HELPERS`, and a human-target difficulty subcase should remain executable in the behavioral suite. Any unsupported full AI grouping-policy claim belongs in pending-test-case design instead of being inferred from this bounded arithmetic evidence.
