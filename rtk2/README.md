# RTK2 Remastered

Current imported game: v56. See [release notes](docs/fixes-v56.html), [validation](docs/verification-v56.json) and [development workflow](docs/development-workflow.md).

Keep this folder beside the repository's existing `lib/` folder. With Python 3 installed, run `start-game.bat` on Windows or `sh start-game.sh` on macOS/Linux. Development checks use Node.js: `npm ci`, then `npm test`; mounted v56 regressions use `npm run test:v56:ui`.

Routine delivery uses Git commits and pushes. ZIP exports and AI training require explicit requests. Every reported bug requires behavioral regression coverage or a documented pending test design.

This native-faithful build is not commercially cleared. See [commercial rights review](docs/commercial-rights-audit-v56.md) and [audio conditions](docs/audio-licenses-v55.md).
