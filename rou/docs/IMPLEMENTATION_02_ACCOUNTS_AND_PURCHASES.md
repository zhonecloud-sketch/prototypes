# Accounts, repeat collectibles and navigation

Open the local `rou/index.html` through your preview server. Choose
**Multiplayer** between **Return to table / Enter as Guest** and **Sign in
with Google**. It opens the invited test Site in a separate tab so an
accepted solo wager can still settle:

<https://atelier-roulette-test.zhonecloud.chatgpt.site>

Published on 19 October 2026 (Malaysia time). Sites confirmed successful
deployment of source commit `351f9630561c8dae0b2cd9ee563be1277658c7fe`.
Access is restricted to the owner and the supplied tester address. The
Sites access response confirms one external viewer; email receipt has not
been independently checked. The main game is maintained and published
separately through GitHub Pages.

Expected account flow: Sites access gate → game email login / New user →
email verification → player account → Collection, Chips and Orders.
The new server source is in `rou/sites-server/`. This is the accounts and
commerce test slice; shared multiplayer wagering is not connected yet.

## Navigation and collection fixes

- The launch, wagering/wheel header, Shop, Insights and dialogs provide
  Wide view. It requests browser fullscreen and landscape orientation where
  supported, and hides while fullscreen is active. About, Privacy and Terms
  pages have the same entry control.
- The wagering cog now opens the launch menu, replacing its former direct
  Table settings action and the separate text Menu button. Other screens
  provide a cog with the same return-to-launch meaning. Game settings remain
  available through **Setup & how to play** on launch.
- The mobile launch content starts at the top and can scroll; controls
  cannot be clipped above the viewport when the screen is short.
- Shop retains the compact landscape layout, with a visible native vertical
  scrollbar and scrolling through all nine items. Back and Menu stay at
  the top. Native scrollbar visibility still follows the browser/OS on
  devices that enforce overlay scrollbars.
- Repeat acquisitions are permitted. Each copy is stored separately with
  its purchase value and reference. Cards show the quantity and offer
  **Buy another**; showcasing still selects one item type.

## Account rules implemented

| Area | Rule |
| --- | --- |
| Registration | Email, unique username and password; no account or starter chips until a valid code is consumed. |
| Username | 3–24 ASCII letters, digits or underscores; uniqueness ignores case. Used as player identification. |
| Email | Trimmed and case-normalized; unique. Verification and recovery messages use a server email adapter. |
| Password | 12–128 characters; salted scrypt (N=32768, r=8, p=3), never plaintext storage. Show/hide and confirmation controls. |
| Code | Cryptographically generated six digits, stored as a digest, valid ten minutes, five attempts, one use. |
| Resend | At least 60 seconds between sends; at most five sends/email/hour. Newly delivered code invalidates earlier codes. |
| Login | Email/password; generic credential error; ten attempts/email/15 minutes. |
| Session | Random 256-bit token, only its digest stored. HttpOnly, SameSite=Strict and HTTPS Secure cookie. Bound to the invited Sites visitor. |
| Expiry | 24 hours normally; Remember me grants a persistent 30-day session. |
| Recovery | Email code plus new password; revokes every previous session. |
| Logout | This session or all devices. |
| Delete | Current password plus typed DELETE and explicit confirmation button. Removes player, wallet, items, access, orders, sessions and challenges. |
| Request protection | Same-origin JSON requests with a custom header, request-size validation, visitor/IP and operation rate limits. |

Account deletion affects the game database, not the user's independent
Sites/ChatGPT account or the organiser's invitation list. Platform backup
retention is outside this application's deletion controls. Solo guest and
Google Drive records are separate and are not deleted by server deletion.

## Purchases and wealth

All purchasing now requires a server account. The existing solo Shop is a
browse surface whose purchase actions open the server login/shop. It no
longer grants browser-local simulated credits or collectibles. Existing
solo saves and collectibles remain readable and are not imported into the
server wallet.

The verified test account starts with 10,000 server chips. Prices and chip
amounts come from the server catalogue; the client cannot supply its own.
The test checkout offers Approved, Declined and Pending, with no real card
number, expiry or CVV entry. Pending orders can be approved or declined
later from Orders. Success grants chips or a 30-day Insights test entitlement;
decline is terminal; pending grants nothing. Insights access does not renew
automatically. The server gameplay report is not yet connected to this pass.

Each request has a purchase reference. Retrying the same operation returns
the existing outcome. Optimistic revision checks on the persistent player
wallet prevent concurrent purchases from overwriting each other or
overspending. The browser never sends a replacement wallet or balance.

```text
wealth = chip balance + sum(price paid for every collectible copy)
```

Example: 1,010,000 chips → buy two 200,000-chip watches → 610,000 chips
+ 400,000 collectible value = 1,010,000 total wealth. Buying a collectible
converts wealth; it does not double-count the spent chips. Purchased chips
increase wealth. Collectibles cannot be sold, transferred or cashed out.

The compact collection shows all nine accepted catalogue items. Each copy
is purchased individually, avoiding an extra quantity selector in this slice.
Server currency is integer chips, and prices use integer USD cents.

## Email and invited-access setup

The user selected invited testers and supplied one invitation address.
Sites access and game account verification are separate. An invitation does not
create a game account or prove a game password.

Real email delivery requires the chosen provider and sender configuration.
The published Site currently has no email sender configured. Registration
and password recovery therefore cannot send codes yet. Hosted test-inbox
mode is not enabled.
The prepared Resend adapter uses these Sites runtime values:

- `RESEND_API_KEY`: secret sending-only API key.
- `EMAIL_FROM`: verified sender, such as `Atelier <accounts@your-domain>`.
- `EMAIL_MODE`: omit for real email; `test` is an explicit test-inbox mode.

Never put a provider key into the repository, browser or hosting manifest.
Deploy after setting runtime values. If email is unconfigured, registration
and recovery fail clearly without creating an account. Delivery failures
also create no usable account. Test-inbox mode is currently used only by the
ignored local `.dev.vars` file for browser checks. It displays a labelled
code and does **not** validate real mailbox ownership. Local preview data
and this file are excluded from publication.

The application sends only the requested verification/recovery message.
Provider delivery and inbox receipt must be checked after the sender is
configured; a mocked transport test is not evidence of real delivery.

## Verification

On 19 October 2026, the 80 existing tests and ten account-server tests
passed. Added checks confirm existing-player login works without an email
sender, and explicit test-inbox registration, login and password recovery
work without sending email. The setup warning is limited to registration
and recovery; it no longer appears on the login form. Test-code screens
explicitly say no email was sent.

On 18 October 2026:

- Existing suite: 80 tests passed, including payout and server integration.
- New server suite: eight tests passed for code gating/replay/expiry,
  authentication, recovery, session revocation, deletion, anonymous purchase
  rejection, concurrent wallet changes, repeated copies and idempotency.
- TypeScript checking passed. The Sites Worker build completed locally.
- Browser test used a disposable local test-inbox account: verified account,
  bought a one-million-chip test pack, acquired the watch twice, then reloaded
  to check server persistence. No real email or payment was used.
- The mobile collection scrolled to the last row with its header accessible.
  The wagering cog returned to launch and retained Return to table. Wide
  view requested fullscreen and hid its entry button.

Tests for the new server, from `rou/sites-server`:

```powershell
node --test --test-force-exit test/*.test.mjs
node node_modules/typescript/bin/tsc --noEmit
```

The test database adapter uses Node's SQLite API; use Node 22.13 or newer
for the Sites project. The usual Sites helper could not resolve this
machine's npm command shim, so installation used the installed npm JS
entrypoint and build used `node scripts/run-framework.mjs build`. The
starter's Sites build integration was preserved.

Publication used Git Bash on PATH and `TAR_OPTIONS=--force-local` to let
the standard Sites packager handle Windows drive-letter archive paths.
The source helper confirmed the pushed commit and archive before Sites
reported a successful deployment. A fresh browser recheck on 19 October
was blocked by browser-access policy; the preceding local browser checks
and saved screenshot remain the available visual evidence.

## Next boundary

Connect shared rooms, accepted wagers, authoritative draws/settlement and
complete server analysis records before claiming playable multiplayer or
selling live Insights access. The existing Node draw server remains intact;
its browser integration and Worker hosting adaptation are separate work.
No real payment processing is enabled in this test slice.

Implementation sources: `client/catalogue.js`, `client/club.js`,
`client/club.css`, `client/multiplayer.js`, `sites-server/lib/service.mjs`,
`sites-server/lib/security.mjs`, `sites-server/db/schema.ts` and
`sites-server/app/portal.tsx`.

Provider references: [Resend email API](https://resend.com/docs/api-reference/emails/send-email),
[Cloudflare crypto support](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/).

![Repeat ownership and wealth](implementation_02/server-collection-two-copies.jpg)
