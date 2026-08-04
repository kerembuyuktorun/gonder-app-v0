# Gönder

B2B / B2C logistics, parcel and courier **web** platform operated by **Arf**.

This repository is an integrated Next.js frontend demo covering authentication through the internal operations panel (Steps 1–13), with typed mock repositories ready to swap for real APIs.

## Stack

- Next.js App Router + TypeScript (strict)
- Tailwind CSS v4 + design tokens
- shadcn/ui-style primitives (Radix)
- TanStack Query + TanStack Table
- React Hook Form + Zod
- Zustand for minimal UI chrome state
- next-intl (Turkish default, English)
- Vitest + React Testing Library + Playwright

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/tr`.

Before the first E2E run, install the browser once:

```bash
pnpm exec playwright install chromium
```

Playwright boots its own production server on port **3100**, so it never collides with `pnpm dev`.

### Useful scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Local development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit / component tests (Vitest) |
| `pnpm test:e2e` | Playwright smoke, demo scenarios, quality suite |
| `pnpm verify` | All gates: lint → typecheck → test → build → e2e |
| `pnpm smoke <url>` | HTTP health check of every key route |
| `pnpm deploy:preview` / `pnpm deploy:prod` | Vercel deploy (needs `VERCEL_TOKEN`) |

## Documentation

| Doc | Path |
| --- | --- |
| Route list | [`docs/ROUTES.md`](docs/ROUTES.md) |
| Screen inventory | [`docs/SCREEN_INVENTORY.md`](docs/SCREEN_INVENTORY.md) |
| Component inventory | [`docs/COMPONENT_INVENTORY.md`](docs/COMPONENT_INVENTORY.md) |
| Demo scenarios | [`docs/DEMO_SCENARIOS.md`](docs/DEMO_SCENARIOS.md) |
| Known limitations | [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) |
| Backend contracts | [`docs/BACKEND_CONTRACTS.md`](docs/BACKEND_CONTRACTS.md) |
| Production API checklist | [`docs/PRODUCTION_API_CHECKLIST.md`](docs/PRODUCTION_API_CHECKLIST.md) |
| Environment & deploy | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |
| Test report | [`docs/TEST_REPORT.md`](docs/TEST_REPORT.md) |

## Folder structure

```text
src/
  app/[locale]/
    (auth)/ (onboarding)/ (app)/ (operations)/
  components/ui|shared|layout
  features/   # auth, dashboard, agent, courier, parcel, xl, freight, spot, orders, integrations, settings, operations
  lib/api|i18n|auth|validation|utils
  mocks/data|repositories
  types/
messages/tr.json|en.json
docs/
tests/unit|e2e
```

## Design tokens & themes

Tokens live in `src/styles/tokens.css` (wired via `src/app/globals.css`). Light and dark themes use CSS variables + `next-themes`. Breakpoints for QA: **390 / 768 / 1024 / 1280 / 1440**.

## Localization

- Default locale: `tr`
- Supported: `tr`, `en`
- User-facing copy belongs in `messages/*.json`

## Mock vs real API

Repository interfaces: `src/lib/api/repositories.ts` (and feature-specific repos). Selection in `src/lib/api/client.ts`:

```bash
NEXT_PUBLIC_DATA_SOURCE=mock   # default
NEXT_PUBLIC_DATA_SOURCE=api    # throws until real clients are added
```

Feature code depends on repositories / query hooks — never raw `fetch` in components.

## Demo credentials (mock users)

| User | Email | Password | Notes |
| --- | --- | --- | --- |
| Customer | `ayse@example.com` | `Password1!` | Completed onboarding → `/app/home` |
| Onboarding | `mehmet@example.com` | `Password1!` | Resumes at company tax step |
| Ops staff | `ops@gonder.com` | `Password1!` | → `/operations` |
| OTP | — | `123456` valid / `000000` expired | Phone login |

## Feature modules (Steps 1–12)

| Step | Area | Entry |
| --- | --- | --- |
| 1 | Foundation, design system, shells | `/design-system` |
| 2 | Auth & onboarding | `/welcome`, `/login/*`, `/onboarding/*` |
| 3 | Dashboard | `/app/home` |
| 4 | AI Logistics Agent | `/app/agent`, `/app/requests/new` |
| 5 | City courier | `/app/requests/courier` |
| 6 | Parcel + carrier compare | `/app/requests/parcel` |
| 7 | Gönder XL | `/app/requests/xl` |
| 8 | FTL / LTL | `/app/requests/ftl`, `/ltl`, `/freight` |
| 9 | Spot quotes & payments | `/app/requests/spot` |
| 10 | Orders, tracking, documents | `/app/orders` |
| 11 | Integrations, Excel, settings | `/app/integrations`, `/app/settings` |
| 12 | Operations panel | `/operations` |

## Integration polish (Step 13)

Cross-module quality pass:

- Dashboard widgets and quick actions deep-link to shared `MOCK_ORDERS` ids / live `/app/orders` views
- Quotes / reports / support screens wired (no empty stubs)
- Manual request form validates and routes into service wizards
- Excel template download is a real CSV blob
- Copy-previous banner on orders when `?action=copy`
- Loading / empty / error / permission states on core screens
- Accessible form labels (`htmlFor` + `aria-describedby` / `role="alert"`)
- Pagination on dense order/ops tables
- Expanded unit, a11y smoke, responsive breakpoint, and Playwright demo-scenario coverage
- Full technical docs under `docs/`

## Key routes (summary)

See [`docs/ROUTES.md`](docs/ROUTES.md). Highlights:

| Path | Purpose |
| --- | --- |
| `/tr/app/home` | Customer dashboard |
| `/tr/app/agent` | AI agent (+ WhatsApp handoff query) |
| `/tr/app/requests/*` | Service wizards |
| `/tr/app/orders` | Shared order management |
| `/tr/app/integrations` | Marketplace / Excel / templates |
| `/tr/app/settings` | Org & preferences |
| `/tr/operations` | Internal ops panel |

## Shared components

`AppButton`, `AppInput`, `AppTextarea`, `AppSelect`, `AppCombobox`, `AppDatePicker`, `AppDateTimePicker`, `AddressInput`, `PhoneInput`, `FileUploader`, `StatusBadge`, `ServiceBadge`, `ChannelBadge`, `MoneyDisplay`, `PriceSummary`, `DataTable`, `FilterBar`, `SearchInput`, `PageHeader`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `ConfirmDialog`, `SidePanel`, `DetailDrawer`, `Timeline`, `StepIndicator`, `ResponsiveFormLayout`

Browse at `/tr/design-system`. Full list: [`docs/COMPONENT_INVENTORY.md`](docs/COMPONENT_INVENTORY.md).

## Notes for production

- Do not embed backend business rules in the frontend
- Keep customer (`/app`) and ops (`/operations`) route groups separate
- Prefer tables / split panels for dense operational screens
- Wire real API repositories behind existing interfaces — see [`docs/PRODUCTION_API_CHECKLIST.md`](docs/PRODUCTION_API_CHECKLIST.md)
- Known demo limits: [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md)

## Deploying to Vercel

Full instructions: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

Git integration is the recommended path — import the repo in Vercel, set
`NEXT_PUBLIC_DATA_SOURCE=mock`, and every push deploys. For CLI deploys:

```bash
export VERCEL_TOKEN=...     # vercel.com/account/tokens
pnpm deploy:prod            # pull → build → deploy → route smoke check
```

Node 22 (`.nvmrc`), pnpm 10, build settings and security headers in `vercel.json`.
CI (`.github/workflows/ci.yml`) runs the same gates on every push and pull request.
