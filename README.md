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
