# Gönder

B2B / B2C logistics, parcel and courier web platform operated by **Arf**.

This repository contains the Step 1 foundation: design system, shared components, localization, typed mock repositories, and panel route shells. Shipment-specific flows are intentionally out of scope.

## Stack

- Next.js App Router + TypeScript (strict)
- Tailwind CSS v4 + design tokens
- shadcn/ui-style primitives (Radix)
- TanStack Query + TanStack Table
- React Hook Form + Zod (schemas ready)
- Zustand for minimal UI chrome state
- next-intl (Turkish default, English)
- Vitest + React Testing Library + Playwright

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/tr`.

### Useful scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Local development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | Playwright smoke tests |

## Folder structure

```text
src/
  app/
    [locale]/
      (customer)/     # End-user panel routes
      (ops)/          # Internal operations panel routes
      design-system/  # Component showcase
  components/
    ui/               # Base primitives (button, input, dialog…)
    shared/           # Product shared components
    layout/           # App shell, navigation chrome
  features/           # Feature modules (auth, quotes, shipments, services)
  lib/
    api/              # Repository interfaces + client switch
    i18n/             # next-intl routing/request helpers
    validation/       # Zod schemas
    utils/            # cn, format, breakpoints
  mocks/
    data/             # Realistic mock payloads
    repositories/     # Mock repository implementations
  providers/          # Theme + Query providers
  stores/             # Zustand UI store
  styles/             # Design tokens
  types/              # Domain + API types
messages/
  tr.json             # Turkish (default)
  en.json             # English
tests/
  unit/
  e2e/
```

## Design tokens & themes

Tokens live in `src/styles/tokens.css` and are wired into Tailwind via `src/app/globals.css`.

Covered tokens:

- Brand / semantic colors
- Status colors (success, warning, error, info, neutral)
- Chart colors
- Typography
- Spacing
- Radius / borders
- Shadows (restrained)
- Z-index
- Breakpoints (390 / 768 / 1024 / 1280 / 1440)
- Container widths
- Touch target (44px)

Light and dark themes are supported through CSS variables + `next-themes`.

## Localization

- Default locale: `tr`
- Supported: `tr`, `en`
- User-facing copy belongs in `messages/*.json`, not in components

## Mock vs real API

Repository interfaces are defined in `src/lib/api/repositories.ts`.

The active implementations are selected in `src/lib/api/client.ts`:

```bash
NEXT_PUBLIC_DATA_SOURCE=mock   # default
NEXT_PUBLIC_DATA_SOURCE=api    # throws until real clients are added
```

Feature code should depend on repositories / query hooks, never on fetch calls inside components.

## Auth & onboarding (Step 2)

- Splash `/tr/splash`, welcome `/tr/welcome`
- Phone OTP, email/password, password reset, Google/Apple (mock)
- Onboarding: account type → personal info → organization → tax → address → complete
- Persisted mock session in `localStorage`
- Guards: authenticated, unauthenticated, onboarding, completed onboarding, organization, permission
- App shell at `/tr/app/*` with sidebar, org switcher, search, new request, notifications, language, user menu

### Demo credentials

- Email: `ayse@example.com` / `Password1!` (completed onboarding)
- Email: `mehmet@example.com` / `Password1!` (resumes at company tax step)
- OTP: `123456` (valid), `000000` (expired)

## Dashboard (Step 3)

Authenticated home at `/tr/app/home` includes:

- Personalized greeting (user / organization context)
- AI shipment request command bar (primary action)
- Functional service cards: Kurye, Kargo, Gönder XL, FTL, LTL, Spot (with FTL/LTL help copy)
- Critical ops widgets in first viewport: active shipments, pending quotes, awaiting approval, awaiting payment
- Quick actions, integration status, usage/spend summary
- Loading / empty / error / populated widget states via mock dashboard repository

## AI Logistics Agent (Step 4)

Channel-agnostic agent workspace at `/tr/app/agent` and `/tr/app/requests/new`:

- Shared conversation models: Conversation, Message, Participant, Channel (`web` | `mobile` | `whatsapp` | `api` | `operator`)
- Desktop split: chat left / live editable draft right (resizable)
- Mobile: chat ↔ draft tabs
- Intent classification, field extraction, missing-field questions, conflict checks
- Voice input button, quick replies, confidence indicator, channel badge
- Safety: no order/quote accept/payment without explicit confirm
- WhatsApp → web handoff mock (`?from=whatsapp&conversationId=wa-handoff-001`)
- Fallback detailed form at `/tr/app/requests/new/form`

## City courier request (Step 5)

Web-first courier wizard at `/tr/app/requests/courier`:

- Multi-step form: addresses (+ optional stops), contacts, package, vehicle/service, schedule/extras, review
- Desktop layout: form left/center, sticky mock map + live price summary on the right
- Free navigation between steps; zone / moto suitability / multi-stop mock business rules
- Service levels: express, same-day, scheduled; vehicles: moto / van
- Mock quote statuses: ready, preparing, unavailable; confirm shows total + terms
- Dashboard Kurye card links here; mock repository behind `courierRepository`

## 1–30 desi parcel & carrier comparison (Step 6)

Parcel wizard at `/tr/app/requests/parcel`:

- Creation methods: manual, copy previous, template, Excel bulk, integration order
- Multi-package editor with live desi calculator; Gönder XL nudge when chargeable desi > 30
- Carrier quote table + card views; sort by price / ETA / carrier; multi-select side-by-side compare; detail drawer
- Checkout with wallet or card (mock); label preview, barcode, tracking, print & PDF export
- Mock carriers: Yurtiçi, Aras, MNG, PTT, Sürat, Horoz via `parcelRepository`
- Dashboard 1-30 Desi Kargo card links here

## Gönder XL oversized shipments (Step 7)

XL wizard at `/tr/app/requests/xl`:

- Sectioned form: addresses (floor/elevator), product, multi-piece table, drag-drop photos, extras, schedule
- Sticky right panel: piece list, services, estimated price / pricing state
- Pricing models: partner list (instant), rule-based semi-auto, manual ops review
- States: calculating, instant ready, ops review, awaiting info, preparing, quote ready, unavailable
- Quote detail with process/next-step copy; confirm & pay (invoice / balance / card)
- Under-30 desi nudge back to parcel; dashboard Gönder XL card links here

## FTL & LTL freight requests (Step 8)

Shared freight flows at `/tr/app/requests/ftl`, `/tr/app/requests/ltl`, and mode picker `/tr/app/requests/freight`:

- Selection screen explains FTL vs LTL with recommendation and mismatch warnings
- Shared form: addresses, schedule, cargo table, vehicle/body cards, photos+docs, notes
- FTL-specific: capacity, length, multi-vehicle, body flags, ADR
- LTL-specific: m³, loading meters, stackability, hub transfer, flexible delivery
- Manual quote lifecycle + in-request messaging; mock `freightRepository`
- Dashboard FTL/LTL cards link to dedicated routes

## Spot quotes & payments (Step 9)

Spot workspace at `/tr/app/requests/spot`:

- Open a transport request to invited suppliers (waiting / quoted / declined)
- Comparison table with sort/filter, lowest/fastest/recommended badges, side-by-side compare, detail drawer, counter-offer modal
- Explicit accept shows tax + surcharges; AI recommendation never auto-accepted
- Checkout: saved/new card, 3DS mock, full/deposit, wallet, net terms, discount, invoice, contract
- Payment outcomes: succeeded / failed / uncertain (poll only — no double charge via idempotency)
- Mock `spotRepository` + `paymentRepository`

## Shared order management (Step 10)

Unified orders module at `/tr/app/orders` (detail `/tr/app/orders/[id]`; `/tr/app/shipments` redirects here):

- List views: all / awaiting quote / approval / payment / active / completed / cancelled / problematic
- Table: global search, advanced filters, sort, column picker & width, saved views, bulk select, CSV export, pagination, URL filter state
- Full-page detail + quick-peek drawer: summary, timeline, addresses, cargo, quote, payment, provider/driver, map, tracking, documents, messaging, POD, issue report, cancel/refund
- Provider raw statuses mapped to shared Gönder lifecycle; critical/issue rows highlighted
- Notification center in app shell; mock `ordersRepository` / tracking data

## Key routes

| Path | Purpose |
| --- | --- |
| `/tr` or `/en` | Marketing home |
| `/tr/welcome` | Auth welcome |
| `/tr/login/email` | Email login |
| `/tr/onboarding/*` | Onboarding steps |
| `/tr/app/home` | Authenticated dashboard |
| `/tr/app/agent` | AI Logistics Agent workspace |
| `/tr/app/requests/new` | New request (AI agent) |
| `/tr/app/requests/new/form` | Manual form fallback |
| `/tr/app/requests/courier` | City courier request wizard |
| `/tr/app/requests/parcel` | 1–30 desi parcel + carrier comparison |
| `/tr/app/requests/xl` | Gönder XL oversized shipment wizard |
| `/tr/app/requests/freight` | FTL/LTL mode selection |
| `/tr/app/requests/ftl` | FTL full-truck request |
| `/tr/app/requests/ltl` | LTL partial-load request |
| `/tr/app/requests/spot` | Spot quotes + payment checkout |
| `/tr/app/orders` | Shared order management |
| `/tr/app/orders/[id]` | Order detail (timeline, map, docs) |
| `/tr/app/shipments` | Redirects to `/app/orders` |
| `/tr/design-system` | Shared component showcase |
| `/tr/customer`, `/tr/ops` | Legacy demo panels (step 1) |

## Shared components

`AppButton`, `AppInput`, `AppTextarea`, `AppSelect`, `AppCombobox`, `AppDatePicker`, `AppDateTimePicker`, `AddressInput`, `PhoneInput`, `FileUploader`, `StatusBadge`, `ServiceBadge`, `ChannelBadge`, `MoneyDisplay`, `PriceSummary`, `DataTable`, `FilterBar`, `SearchInput`, `PageHeader`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `ConfirmDialog`, `SidePanel`, `DetailDrawer`, `Timeline`, `StepIndicator`, `ResponsiveFormLayout`

Browse them at `/tr/design-system`.

## Notes for next steps

- Do not embed backend business rules in the frontend
- Keep customer and ops route groups separate
- Prefer tables / split panels for dense operational screens
- Wire real API repositories behind the existing interfaces when backends are ready
