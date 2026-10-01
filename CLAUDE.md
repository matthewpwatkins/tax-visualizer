# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
|---|---|
| Dev server (localhost:3000) | `npm start` |
| Production build | `npm run build` |
| Tests (watch) | `npm test` |
| Single test file | `npm test -- --testPathPattern=App.test.tsx` |
| One test by name | `npm test -- -t "renders"` |
| CI-style single pass | `CI=true npm test` |
| Typecheck only | `npx tsc --noEmit` |

Create React App (react-scripts 5) with TypeScript, React 19, Bootstrap 5. Lint runs as part of `start`/`build` via the `react-app` ESLint config in `package.json`. Deploys to Netlify automatically on push to the main branch.

## Architecture

Single-page, entirely client-side. No backend, no state management library, no router. Tax math is pure functions; React holds only form state and the last result.

```
URL query params ──> useTaxParams ──> initialConfig ──┐
                           ^                          v
TaxForm (user input) ──> App.handleConfigSubmit ──> useTaxCalculation ──> calculateTax()
                           |                                                  |
                           └──> pushState (shareable URL)                     v
                                                               TaxResultsTable (per-bracket rows)
```

### Tax year data
Each tax year is a JSON file in `src/data/<year>.json` holding brackets and standard deductions for all four filing statuses. `tax-data-init.ts` imports them at module load and registers them with `TaxDataService`; `tax-constants.ts` then flattens that into `TAX_BRACKETS` / `STANDARD_DEDUCTIONS` lookup tables keyed by year and filing status.

**To add a tax year:** add `src/data/<year>.json` and register it in `src/model/tax-data/tax-data-init.ts`. Nothing else needs changing — available years, the default year (the highest), and the year dropdown all derive from the registry. The top bracket's `maxIncome` is `null` in JSON and becomes `undefined` in the model, which `calculateTax` treats as unbounded.

### URL as the only persistence
The form state round-trips through query params (`income`, `filingStatus`, `deductions`, `nonRefundableCredits`, `refundableCredits`, `year`), which is how sharing works. Any new input must be added to both directions in `tax-utils.ts` or it will be silently dropped from shared links. Links shared before the credit split carry a single `credits` param, which is still read as non-refundable. Reset works by clearing the query string and reloading the page.

### Conventions
- Models and interfaces live in `src/model`, enums and derived lookup tables in `src/constants`, pure helpers in `src/utils/tax-utils.ts`.
- All currency and percent formatting goes through the formatters in `tax-utils.ts`; don't inline `Intl.NumberFormat`.
- Styling is Bootstrap utility classes in JSX; `App.css` is small and app-specific.

### Credits
Credits are split in two because they behave differently: non-refundable credits stop once tax reaches zero and the remainder is forfeited, while refundable credits keep going and turn into a refund. `calculateTax` spends the non-refundable ones first so none are wasted, and returns a negative `taxAfterCredits` to mean a refund. Any UI reading that field has to handle the negative case.
