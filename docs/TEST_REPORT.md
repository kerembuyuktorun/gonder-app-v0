# Test report

Last run: 2026-08-04 · commit on `cursor/gonder-web-foundation-0c4a`

## Quality gates

| Gate | Command | Result |
| --- | --- | --- |
| Lint | `pnpm lint` | Pass — 0 errors, 0 warnings |
| Types | `pnpm typecheck` | Pass |
| Unit / component | `pnpm test` | **112 passed** (22 files) |
| Production build | `pnpm build` | Pass — 91 static pages |
| E2E / quality | `pnpm test:e2e` | **28 passed** |
| Route smoke | `pnpm smoke <url>` | 28/28 routes 2xx |

One command: `pnpm verify`.

## Unit / component (Vitest)

22 files, 112 tests: auth, agent, courier, parcel, xl, freight, spot/payment, orders,
integrations/settings, operations, permissions, mock consistency (`integration-polish`),
shared component a11y (`components-a11y`), responsive breakpoints (`responsive`).

## E2E (Playwright, Chromium)

Config starts its own production server on port **3100** (`E2E_PORT` to override), or targets a
deployed origin with `PLAYWRIGHT_TEST_BASE_URL`.

| Spec | Covers |
| --- | --- |
| `smoke.spec.ts` | Locale home, welcome, email login |
| `demo-scenarios.spec.ts` | Home→orders deep links, agent/courier/parcel/xl/ftl/ltl/spot, Excel tab, WhatsApp handoff, ops quote prep |
| `quality.spec.ts` | Route health, responsive, keyboard/focus, theme, axe accessibility, EN locale |
| `screenshots.spec.ts` | Visual capture (opt-in via `CAPTURE_SCREENSHOTS=1`) |

### `quality.spec.ts` detail

- **Route coverage** — 16 customer + 8 operations routes return 2xx, expose a `main` landmark, and
  produce no console/page errors; `/app/shipments` redirects to `/app/orders`.
- **Responsive** — home and orders at 1440 / 1280 / 1024 / 768 / 390 px with a horizontal-overflow
  assertion (≤2px); mobile drawer opens and closes.
- **Keyboard & focus** — skip link is the first tab stop and moves focus to `#main-content`; login is
  completable with keys only and Tab order reaches the password field; focus styles resolve.
- **Theme** — dark mode toggles, persists across navigation, and keeps content visible.
- **Accessibility** — axe `wcag2a` + `wcag2aa` on `/login/email`, `/app/home`, `/app/orders`,
  `/app/settings` with zero serious or critical violations.
- **Localization** — `/en` app shell renders.

## Issues found and fixed during this pass

| Finding | Fix |
| --- | --- |
| No `<title>` on any page (axe `document-title`, serious) | Localized `generateMetadata` at locale layout + per-section titles for `(app)` and `(operations)` |
| No keyboard bypass to main content | Skip link in both shells, `id="main-content"` on `main` |
| Auth and onboarding screens had no `main` landmark | `AuthPageFrame` renders `main` |
| Operations sidebar collapse button rendered a raw `«` glyph | Chevron icon + localized label and `aria-label` |
| Form error text was not announced | `role="alert"` on `AppInput` errors and `ErrorState` |
| Playwright reused whatever server held port 3000 (stale builds) | Dedicated port 3100, `reuseExistingServer: false` |
| `react-hooks/incompatible-library` warning on phone login | `useWatch` instead of `form.watch` |

## Manual checklist

| Check | Status |
| --- | --- |
| Route / link audit (dashboard → orders) | Pass |
| No dead CTAs | Pass |
| Loading / empty / error / permission states | Pass |
| Mock identity aligned (dashboard ↔ orders) | Pass |
| TR / EN copy without overflow at 390px | Pass (screenshots) |
| Light / dark parity | Pass (screenshots) |
| Table pagination (orders / ops) | Pass |

## Known limitations

See [`KNOWN_LIMITATIONS.md`](./KNOWN_LIMITATIONS.md).
