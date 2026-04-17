# verify-site

Run Playwright tests. Report terse. Save tokens.

## Modes

- **dev** (default): `npx playwright test`
- **preview** (pre-PR): `PW_MODE=preview npx playwright test`
- **screenshots**: `npm run test:e2e:screenshots` — captures every page in both themes/viewports to `test-results/screenshots/`

## How to run

```bash
npx playwright test
```

For preview mode:
```bash
PW_MODE=preview npx playwright test
```

## Reporting rules

**Pass:** One line. Example: `PASS: 24/24 tests passed.`

**Fail:** List only failed tests. Example:
```
FAIL: 2/24
- smoke > home: missing meta description
- functional > theme toggle: class not toggled
```

If screenshot exists for failed test, read it and add one sentence describing what looks wrong structurally. Do NOT dump full Playwright output.

**Do NOT:**
- Paste raw Playwright stdout
- Explain what Playwright is
- Narrate your process
- Add commentary beyond the result
