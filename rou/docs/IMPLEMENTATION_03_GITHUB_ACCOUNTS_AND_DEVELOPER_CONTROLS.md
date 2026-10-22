# GitHub accounts, multiplayer and developer controls

Updated: 22 October 2026 | Asia/Kuala_Lumpur

## Use the test release

1. Open the [game][game] and choose **Sign in**.
2. Enter your email and password, or choose **New user** to register.
3. For a new account, supply a username and password, then enter
   the clearly labelled on-screen test code. Existing players choose
   **Sign in**. Signed-out recovery awaits a connected email sender.
4. Successful activation or login returns to launch. Your player button
   opens account information, wealth, collection, purchases and orders.
5. Choose **Multiplayer** to enter the shared six-seat table. **Enter as
   Guest** keeps the existing local game.
6. Open [developer controls][admin] for account and RNG maintenance.
   Enter the operator account email, its game password and the separate
   private operator key, then choose **Unlock developer controls**.

Open the HTTPS link above rather than double-clicking `admin.html` on
disk. Browsers block JavaScript modules on `file://` pages, which prevents
login from starting. A local-file launch now explains this and offers
**Open online developer controls**. The online page manages the same
Sites database. Reloading a `file://` page cannot remove that restriction.

Unlock needs the game password as well as the private key. When an
account is already signed in, the page names that account and asks only
for the key. **Use another game account** signs out that session and
restores the email/password fields. The page shows progress during login
and key checking, then displays success or the returned error. [S2, S5]

The 22 October frontend update was checked with disposable local accounts:
wrong-key denial, successful unlock, Lock and account switching. A live
signed-out request also returned the expected invalid-login message.
These checks do not verify a particular player's private password/key.

The operator key is in
`atelier-private-access.json` in the local **European Roulette** workspace.
This file is outside the GitHub repository. Do not publish it. Only
configured operator accounts can use the key. Legacy invitation values
in this file are no longer needed for player registration or login.

Expected result: every visible page stays on GitHub. Sites processes
requests and stores data. No Sites tab is needed for account creation,
login, purchases, play or developer controls. Test codes do not prove
mailbox ownership, and simulated purchases never charge a card. [S1–S4]

The owner approved public API access and open player registration on
20 October. Anyone can register; account login protects player data.
Developer actions additionally require an operator email and key.
The [public-login update][public-login] supersedes the invitation flow.
[S1, S2, S5]

## Start, stop and availability

On the developer **Server** tab:

- **Start multiplayer** enables the room until an operator issues Stop.
- **Stop multiplayer** blocks new joins and wagers. Previously accepted
  wagers remain payable and settle through subsequent requests.
- **Refresh status** shows the stored state, account count, active seats
  and selected draw source.

The enabled state is stored in the Sites database. Closing the developer
page, closing the game, or shutting down the developer's computer does
not switch it off. A new deployment also preserves stored runtime state.
The initial state is running with live server RNG. [S5, S6]

Sites runs an on-demand serverless API, not an always-running Node
process. Connected players refresh the room every two seconds. Round
times follow a shared 30-second clock: 20 seconds of betting, seven of
spinning, then three for the result. With all clients closed, there is no
background settlement timer; accepted wagers settle on the next relevant
account, room or operator request. No uptime SLA or scheduled background
jobs are claimed by this release. [S3, S5–S7]

Start/Stop deliberately controls the game while leaving the account and
developer API reachable. Otherwise a stopped API could not receive its
own Start command.

## Manage players

Stop multiplayer before changing accounts. The backend settles due wagers
and rejects maintenance while unsettled wagers remain. Refresh after the
round finishes, then retry. [S5]

| Action | Expected result |
| --- | --- |
| Search | Find accounts by email or username, 50 per page. |
| Add test player | Create an account with 10,000 chips and a password. |
| Edit | Change username or whole-chip balance. |
| Reset records | Start a new profit/analysis epoch; retain wealth. |
| Reset player | Restore 10,000 chips and clear collection/orders/pass. |
| Delete | Remove the account and dependent game data permanently. |

Reset player preserves the login account and starts a new analysis epoch.
Record reset keeps old raw records in their previous epoch. It does not
implement any unresolved Hall of Fame history policy. Sensitive reset and
delete forms require typing the player's username; an operator cannot
delete their own account through these controls. [S5]

New test-account credentials are displayed only in the current result
panel. Deliver them privately to the intended tester. The tool does not
send invitation emails. The operator key is held in page memory, cleared
by **Lock controls**, and never saved in browser storage. Account tokens
use session storage and expire server-side. [S1, S2, S5]

## Manage recorded RNG databases

1. Stop multiplayer and wait for accepted wagers to finish.
2. Open **RNG databases**. Enter a name and select a number file.
3. Import integers from 0 to 36 using text, CSV, a JSON array or the
   project's generated `real.html` format.
4. Wait for **Ready**. Choose **Use / reset to record 1**, or open
   **View / edit** and select another starting position.
5. Start multiplayer. The room identifies the source as recorded replay.

The importer accepts at most two million results and a 32 MB file. It
validates the entire file, uploads chunks of 4,000 results and verifies
all chunks before making the database usable. Invalid values are rejected,
not silently removed. An interrupted upload stays incomplete; delete it
and retry while the room is stopped. [S5, S8]

**View / edit** previews the first 60 numbers, renames the database, changes
a specified result, or selects a playback position. **Export** downloads
all stored numbers. Select **Use live server RNG** before editing or
deleting the currently selected recorded database. Deletion requires the
database name. Existing settled draws are immutable even if their source
database is subsequently edited or deleted. [S5, S6]

Recorded playback advances with the shared clock and loops at the end.
Stop preserves its next position; Start resumes from the next full round.
Reset explicitly selects a new starting position. Uploading a recording
does not generate new real-world observations. Weekly source generation
and unattended compilation are not scheduled in this release. [S5–S7]

## Frontend and collectible changes

Launch uses a Sign in/player button in place of its cog. Account pages
slide within the same landscape surface; Back reverses the transition.
Menu cogs elsewhere return to launch. Wide view is a toggle with a
**Default view** label when fullscreen is active. [S3, S9]

Compact account entry uses a landscape button keyboard with Next/Done,
letters, digits, spaces and password symbols. Verification uses a number
keypad. Both avoid editable fields inside the keyboard overlay.
Collection pages scroll vertically, support multiple copies of the same
item, and count every copy in total wealth. Purchases require login and
run through the server's simulated checkout. [S3, S4, S9]

All nine collectible PNGs were replaced with WebP at their original
dimensions. Their combined size fell from 23,153,002 to 2,342,842 bytes:
**89.9% smaller**. The originals are archived outside the public repository
in the local workspace's `original-collectibles-png` folder. [S10]

## Storage and deployment

| Component | Location |
| --- | --- |
| Game and developer HTML/CSS/JavaScript | GitHub Pages |
| Collectible WebP images | GitHub Pages |
| Account, wallet and room processing | Sites Worker |
| Accounts, orders, wager records and runtime state | Sites D1 database |
| Uploaded RNG numbers and operator action audit | Sites D1 database |
| Operator account allowlist and key hash | Sites runtime secrets |

The separate backend checkout is `rou/sites-server/`, which is ignored by
the parent GitHub repository. It has its own Sites source repository.
Do not deploy the older root Node/WebSocket server as though it were this
Sites backend. [S1, S5–S7, S11]

For subsequent backend releases, use the Sites skill to build, synchronize
the source, save a version and publish the existing project:
`appgprj_6ad4b4b6cfc08191a69da6579543d29c`.
Preserve its database and runtime secrets. The backend home URL redirects
to the GitHub game. [S11]

Required settings are `FRONTEND_ORIGIN`, `EMAIL_MODE`, `ADMIN_EMAILS`
and `ADMIN_KEY_HASH`. Legacy `TEST_INVITES` is unused by public login.
The frontend origin is exactly
`https://zhonecloud-sketch.github.io`; the email mode is currently `test`.
Do not place secret values in source files or documentation. [S1, S2, S5]

## Verification and next work

Run from `rou/`:

```powershell
node --test --test-force-exit test/*.test.js
```

Run from `rou/sites-server/`:

```powershell
node --test test/*.test.mjs
node node_modules/typescript/bin/tsc --noEmit
node scripts/run-framework.mjs build
```

Expected results after the public-login update: 84 root tests and 16 Sites
tests pass;
type checking and the production build succeed. Root tests include the
older Node server as well as shared game mathematics and the new importer.
The Sites suite separately covers the currently deployed API. [S12]

Checks performed:

- Public signup, on-screen code, login and return to launch.
- Two local players sharing one room, wager settlement and reload.
- Simulated chip purchase and buying two copies of one collectible.
- Landscape collection scrolling and focused field entry at 896 × 414.
- Developer login, Stop, player balance edit, a 21,600-row `real.html`
  import, recorded-source selection, Start and the fullscreen toggle.
- Parsing the actual two-million-row archive without losing records.
- Automated authentication, operator authorization, payment idempotency,
  concurrent wallet updates, six-seat limits, draw secrecy, settlement
  once, maintenance guards, user resets/deletion and RNG lifecycle.
- Live GitHub-origin preflight returning 204 with the exact allowed
  origin; anonymous session returns no player, protected requests reject
  missing authentication, and Site home redirects to GitHub.
- Two live disposable players join, see each other, share a draw and
  settle once after the Sites seat-query compatibility fix.

Browser checks use local disposable accounts unless described as live.
Native keyboard behavior on a physical phone and sustained multiplayer
load have not been verified. Screenshots are in `implementation_03/`.

**Remaining product work:** server wagers are retained beyond the recent
222-spin display, but the complete server record has not yet been wired
to the paid Insights model. Guest Insights still uses local records.
Multiplayer Insights says this explicitly and cannot reset a server record
through the guest-only interface. The simulated pass tests checkout and
access storage only; it does not claim a complete multiplayer report.
Hall of Fame, daily wealth compilation, weekly generation and inactivity
automation also remain future work. [S3, S4, S7]

Next, connect every server record since the current reset to the existing
Bias Calculator model. Preserve draw identities for replay deduplication,
separate payoff-probability groups, and gate both positive and inverted
signals using required N and significance. Implement that before treating
paid multiplayer Insights as a finished product. Real payments and email
delivery remain separate integrations.

## Evidence

- S1: `../sites-server/lib/frontend-access.mjs`, `lib/service.mjs`.
- S2: `../client/account-api.js`.
- S3: `../client/account.js`, `client/game-account.js`.
- S4: `../client/catalogue.js`, backend `shared/catalogue.js`.
- S5: `../sites-server/lib/admin.mjs`, `../client/admin.js`.
- S6: `../sites-server/lib/runtime.mjs`.
- S7: `../sites-server/lib/room.mjs`, `../client/multiplayer.js`.
- S8: `../client/rng-import.js`, `../test/rng-import.test.js`.
- S9: `../client/mobile-entry.js`, `wide-view.js`, `account.css`.
- S10: `../assets/collectibles/manifest.json`; measured file byte totals.
- S11: `../sites-server/.openai/hosting.json`, `app/page.tsx`, `.gitignore`.
- S12: `../test/*.test.js`, `../sites-server/test/service.test.mjs`;
  local test/build results and browser checks on 20 October 2026.

[game]: https://zhonecloud-sketch.github.io/prototypes/rou/
[admin]: https://zhonecloud-sketch.github.io/prototypes/rou/admin.html
[public-login]: IMPLEMENTATION_04_PUBLIC_LOGIN_AND_KEYBOARD.md
