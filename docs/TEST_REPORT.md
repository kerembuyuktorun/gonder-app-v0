# Test report (Step 13)

## Unit / component (Vitest)

- Command: `pnpm test`
- **Result:** 22 files, **112 tests passed** (2026-08-04)
- Coverage areas: auth, agent, courier, parcel, xl, freight, spot/payment, orders, integrations/settings, operations, permissions, mock consistency (`integration-polish`), empty/error/status a11y smoke (`components-a11y`), responsive breakpoints

## E2E (Playwright)

- Command: `pnpm build && pnpm test:e2e` (config uses `pnpm start`; install browsers once via `pnpm exec playwright install chromium`)
- **Result:** 10 passed (smoke + demo scenarios)
- `tests/e2e/smoke.spec.ts` — locale home, welcome, email login
- `tests/e2e/demo-scenarios.spec.ts` — home→orders, agent/courier/parcel/xl/ftl/ltl/spot, excel tab, WhatsApp handoff query, ops quote prep, 390/1440 viewport

## Quality gates

| Check | Command | Status |
| --- | --- | --- |
| Unit tests | `pnpm test` | Pass (112) |
| Typecheck | `pnpm typecheck` | Pass |
| Lint | `pnpm lint` | Pass (1 pre-existing RHF watch warning) |
| Build | `pnpm build` | Pass |

## Manual quality checklist

| Check | Status |
| --- | --- |
| Route / link audit (dashboard → orders) | Fixed |
| Dead CTAs (excel template, form fallback, reports/support) | Fixed / wired |
| Loading / empty / error on core screens | Present |
| Permission guards (customer + ops staff) | Present |
| Mock identity aligned (dashboard ↔ orders) | Fixed |
| TR/EN messages for new screens | Added |
| Light/dark via tokens + next-themes | Existing |
| Form label / error a11y (`aria-*`, `role="alert"`) | Present |
| Table pagination (orders / ops) | Present |
| Breakpoints 390–1440 | Token + unit + E2E viewport |

## Known limitations

See [`KNOWN_LIMITATIONS.md`](./KNOWN_LIMITATIONS.md).
