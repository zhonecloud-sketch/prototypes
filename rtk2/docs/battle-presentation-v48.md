# V48 governor, messages and battle presentation

The governor value was populated in v47 but the legacy `#governor { display:none }` rule still hid it. That rule and its obsolete short-screen variant have been removed. The existing shared font, font size and three-row province summary remain in place.

Battle-injury presentation keeps the general's name and expected recovery time. It omits the redundant zero-impact resource list. Stored events and recovery rules remain unchanged.

Spectator battle-result artwork and attacker/defender/province/commander-fate text close automatically at Game Speed. There is no Continue button in spectator mode. Human result reviews retain their Continue action. Durations are Slow 3 s, Normal 2 s, Fast 1 s and Very Fast 0.5 s. Backgrounding the page preserves unread time. Battlefield tile information expires at the same speeds for both controller modes; governance never displays it. Fort construction's requested location confirmation remains functional.

## Multiple ambushes

`battle.mjs` already loops through the direction-dependent native forward arc and applies every eligible jungle ambush. The previous renderer overwrote all but the last visual cue. The renderer now reads the resolved, serial-numbered ambush messages from the current action and queues each animation separately. Movement reaches the destination before the first strike; subsequent strikes play in order. A routed victim stops further engine ambushes as before. Animation does not spend orders/mobility, modify casualties or consume randomness.

The existing native witness is `main.exe` SHA-256 `25f92228309660160cbd6b5cd55098b26b8ece266899aa9f262848c017b1efd8`. Native `0x24938` loops over the three forward-arc cells and calls the occupied-hostile-jungle test and ambush exchange. See `native-battle-v33.md` for arithmetic and controlled executable vectors.

## Charge movement

The supplied native charge routine `0x26318` calls the animation routine at `0x250F8` from `0x263D3`, with both drawing endpoints set to the defender's coordinates. This supports the overlapping-unit presentation. The existing terminal branches distinguish attacker defeat (`0x26438`), occupation of a defeated defender's tile (`0x2644C`) and a surviving defender's WAR-based breakthrough (`0x26503`). Those gameplay branches are unchanged.

The remaster adds a 650 ms approach march, retains its ten two-frame 600 ms charge attack cycles, and adds a 650 ms exit/return phase. During the strike phase the attacker occupies the defender's visual position and the defender's sprite, badge and flag are hidden. Successful occupation stays there; breakthrough marches onward to its resolved tile; an unsuccessful charge returns to its starting tile. These timings are remaster presentation choices, not a claim of exact DOS frame timing. Normal and simultaneous attack remain five cycles.

## Validation and limits

`tests/v48-tests.mjs` checks two initially concealed ambushers in all six directions and both column parities, sequential native damage, separate animation cues, unchanged RNG/order costs, offset-hex charge paths and shortened injury text. Mounted interface checks verify actual message expiry, governor computed visibility, attacker overlap and separate ambush animation playback. Full gameplay and UI suites remain required before publication.

JSDOM and Canvas checks do not establish real-device layout or DOS gameplay parity. The engine fingerprint and existing trained policies are unchanged because this release changes presentation only. Earlier launch-screen and custom-ruler portrait changes remain included.
