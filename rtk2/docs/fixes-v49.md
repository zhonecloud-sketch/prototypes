# Version 49 fixes and verified rules

11 October 2026 · Romance of the Three Kingdoms II

This update addresses the twelve reported issues and retains the earlier mobile layout, Governor label, ownership colours, timed spectator triumphs, governance-only playback, ambush and charge animation fixes. Legacy AI remains the default. Previous saved campaigns remain supported; incompatible optional AI profiles fall back to Legacy until a current profile is imported.

## 1. Advice uses numbers and explains their meaning

“Enemy loyalty is strong” and “Our officers are dependable” have been removed. Council advice now identifies the actual officer and loyalty score, explains how much remains before 100, and describes recruitment risk without implying that loyalty alone guarantees success or failure. Recruitment and intelligence advice point to the order's estimated chance. Envoy ability, relationships, trust and protection can also affect eligibility or success.

Council text refreshes when circumstances change. Asking again does not reroll the monthly adviser-availability gate. Scouting alone does not lower loyalty; covert infiltration can affect it through its separate upkeep mechanics. War advice treats a numerical army advantage as an estimate rather than a guaranteed victory.

## 2. What happens to invasion supplies?

The remaining attacker and defender field gold and food are deposited in the **battlefield province**, regardless of which side wins. A successful attacker therefore receives those remaining supplies in the conquered province. A defeated attacker does **not** get those field supplies refunded to the province it marched from. Provincial caps remain 30,000 gold and 3,000,000 food.

Surviving or captured generals retain their remaining soldiers, training and weapons according to their final fate and destination; these belong to the generals rather than a separate provincial weapons bank. Winning officers also receive the existing two-point training gain, based on their actual field training. Escaping generals carry their surviving troops and equipment, not a share of the army's food and gold.

Native evidence: settlement is called unconditionally at `0x08BC1`, and `0x0907C` adds both field stores to the battlefield province. Flight at `0x25670` does not refund them. The remaster's existing allied contingent refund and optional thank-you decision remain; the post-battle thank-you now draws from the supplies landed at the battlefield province.

## 3. Portrait rules and custom choices

All 352 canonical officer identities have distinct portrait assignments and distinct rendered portrait crops. The rule uses canonical starting attributes, so training, books and temporary edits do not change a person's face.

| Starting attributes | Portrait direction |
| --- | --- |
| Only WAR exceeds 80 | Military attire: 武官 |
| INT or CHARM exceeds 80, while WAR does not | Scholar or court attire: 文官 |
| WAR and another attribute exceed 80 | Commander combining military and court cues |
| No attribute exceeds 80 | An ordinary officer, with the strongest ability guiding attire where possible |
| A recognisable historical identity | Its established historical appearance takes priority |

Historical exceptions preserve Liu Bei's ruler appearance, Zhao Yun's white military look, and the established identities of Zhang Fei, Guan Yu, Cao Cao, Dong Zhuo, Ma Chao, Sun Jian, Sun Ce and Sun Quan. Tai Shi Ci receives an armoured archer portrait and Cao Pi a young court-ruler portrait. Face uniqueness takes priority over reusing one generic face for everyone in the same ability class. The minimal role remapping changes 74 non-iconic assignments rather than changing every existing face.

Create custom ruler offers **four male and four female portraits**. The choice persists in saves. The companion has a separate portrait, and naming a custom ruler after Cao Cao or another historical officer does not borrow that historical face. The ruler-selection silhouette tile and its location remain as requested.

## 4. Alphabetical lists

Officer choice cards now sort A–Z by their English names. Recruit's All, A–F, G–L, M–R and S–Z views retain that order. Its `#` view groups officers under their numbered province, sorts province groups alphabetically by province name, then sorts the officers within each group alphabetically. The province number is always shown.

The common choice renderer applies the same ordering to other officer and province lists, including movement, appointments and merchant selection. Province number display is a label choice, not a request for numerical sorting. Explicit **Data order**, which deliberately changes a province's stored officer order, remains available.

## 5. Give, Reward and other spending advice

Give advice now scans affordable amounts under the current actor and governor. It reports the maximum attainable popular loyalty and the **smallest food amount** achieving that capped result, rather than assuming one food. At popular loyalty 100 it advises spending nothing. The per-order food limit remains 10,000.

Gold Reward selects the recipient before the amount, then reports the cheapest amount attaining the best affordable loyalty result. The native gain uses the governor's CHARM, with a random zero-or-one bonus, and a per-order limit of 100 gold. Advice distinguishes that range from a guaranteed gain and respects the cap of 100. A horse is offered as an alternative when available; Writings raise INT by one under their own eligibility rule and are not a loyalty reward. Fully loyal recipients are identified before money or horses are spent.

Cultivation and flood-control advice similarly report the best affordable capped improvement and smallest useful cost. Training advice excludes armies already at full training. Chance-based advice reports an estimate rather than promising success.

## 6. Merchant weapons and interface

The original executable does **not** give an INT discount for weapon purchases. Both its human and AI buying branches use one gold per lot of 100 weapons. The maximum number of lots is:

`min(available gold, 100 − floor(current weapons / 100))`

Weapons cap at 10,000. The last partial lot still costs one gold: an officer with 9,999 weapons buys one additional weapon, not an impossible extra hundred. Different INT values produce the same native weapon price. Food trades retain their separate rice-price rule.

The merchant interface is retained: choosing the acting general, choosing the transaction and recipient, adjusting the amount while seeing its cost and effect, then confirming is easier to inspect and correct with Back than the original sequence of modal prompts. It also makes clear which general spends the monthly action. The preview now shows the actual weapon increase, including a partial final lot.

## 7. Jungle information is shared fairly

A hidden enemy moving to a different jungle does not update the AI's knowledge. Both Legacy and trained policies receive visible enemies and previously observed positions. A blind attack at the remembered jungle can miss if the enemy has left; the missed attempt still spends the order. Actual contact or combat can reveal the enemy. Merely standing adjacent does not reveal every jungle occupant.

This is an intentional fairness improvement: the native drawing routine conceals jungle units, but the native adjacent-attack selector can still read their actual occupancy. The remaster removes that native AI information advantage. It does not claim that the original executable already followed fair fog of war.

## 8. Tile information and Charge

Tile information now compares the selected tile with its actual neighbouring passable terrains, including jungle, hill and water. It shows enemy-loss and counterattack coefficients, identifies the neighbours and explains how to read them, rather than always comparing with plain terrain. Unit power and random rolls still affect actual losses.

Normal attack and Charge use the **same per-exchange terrain and casualty equation**. Charge repeats that exchange one to ten times; it is not a separate flat terrain bonus. The native palace counterattack branch uses its own divisor. Existing charging march, overlap, repeated strike and return animations remain intact.

## 9. Empty burning palace

An empty palace still matters. At the daily fire update, a palace that remains burning destroys **30% of the defender's remaining field gold and food**, rounded down from the remaining 70%. This applies even without soldiers inside. Rain or extinction before that check prevents the loss. The native branch does not directly reduce provincial population, agriculture or a permanent palace statistic.

Native evidence: `0x22DFC` calls `0x22D76` after weather, extinction and spread processing. The attacking commander's own end-of-order fire penalty remains separate.

## 10. Move enemy: what to do

1. Select your unit, then **Move → Move enemy**.
2. Select an adjacent visible enemy. This selection costs **no mobility points**.
3. Choose a highlighted destination for your own unit. Your unit pays its ordinary movement cost.
4. The selected enemy may follow into your old tile: a 50% check succeeds when its INT is no greater than your unit's INT. Palace occupants cannot be pulled. The enemy pays no mobility points, even when the attempt fails.

The persistent instruction changes after selection. Back or switching units clears that selection.

AI applies the original opportunistic pull after an ordinary move: it checks neighbours of the old tile in native order, considers strictly lower-INT enemies, excludes palace occupants, and rolls separately until one eligible enemy follows. It does not use a separate taunt-destination policy. Fair fog of war also applies to these choices. This verifies the native pull subroutine; it does not claim a complete reconstruction of every native pathfinding decision.

## 11. Defenders return to the palace

When the palace is empty, dry and legally reachable, a ready defender prioritises returning there before an ordinary attack or pursuit. It can be a replacement guard rather than the commander who fled the fire. Fire escape still takes priority while a unit is burning. Legacy and trained policies use the same return rule, and AI highlighting selects the returning unit.

The native empty-palace goal is confirmed for three adjacent starting positions. The complete native route-field algorithm has not been reconstructed; the remaster uses its existing legal movement paths for farther returns.

## 12. Historical events align with other events

Historical rows and their text now align left in Governance's Events view, including rows with artwork. Expanded event paragraphs and the main event text also align left.

## Training under the corrected rules

All three current profiles were actually retrained under the v49 rule fingerprint. Archived v44/v45 profiles retain their original identities; changing their label does not make them compatible.

| Profile | Independent holdout result | Interpretation |
| --- | --- | --- |
| [Governance progress](../config/ai-profiles/governance-v49.json) | Six episodes; mean score difference +10.004 against Legacy | Small exploratory sample |
| [Battlefield](../config/ai-profiles/battlefield-v49.json) | Twelve paired-role episodes from six seeds; 1 wins, 0 losses, 11 draws; mean difference +0.648 | Many draws; no established superiority |
| [Backward conquest](../config/ai-profiles/governance-conquest-v49.json) | Six cases across finish/expand/opening stages; aggregate difference −8.651 against Legacy and −1.588 against the previous weights reevaluated under v49 | Worse in this sample; remains experimental |

The conquest curriculum continues working backward from all 41 provinces and uses abstract battle resolution, with **zero detailed battlefield actions**. Short finish and expansion exercises are separate from original-opening cases. No reliable lightning-speed full-campaign victory is established by these runs. Legacy stays selected until the player explicitly enables a trained profile.

Full reports: [governance](ai-training-v49-governance.json), [battlefield](ai-training-v49-battlefield.json), [conquest](ai-training-v49-conquest.json). [Archived warm-start weights and reproduction commands](ai-training-v49-warmstarts.json). Training instructions: [AI manual](ai-training-manual.html).

## Verification and limits

The update includes 281 new native economy witnesses and 27 native tactical witnesses, with reproducible verifier scripts. Native arithmetic checks execute bounded original 16-bit branches; they are not a complete DOS playthrough. Earlier native-equation vectors remain in the package.

[Verification summary](verification-v49.json): 438 engine groups, 69 interface groups and 7 mobile CSS groups passed. Verification covers the full engine regression suite, unique rendered portrait crops, current-profile compatibility, interface flows with JSDOM and Canvas, and mobile CSS layout checks. Real browser and handset inspection was unavailable in this workspace. Consequently, these checks do not constitute a fresh physical-device screenshot review.
