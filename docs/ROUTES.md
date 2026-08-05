# Route list

All paths are locale-prefixed (`/tr` default, `/en`).

## Public / auth

| Route | Notes |
| --- | --- |
| `/` | Marketing home |
| `/results` | Public price / quote results |
| `/create-with-ai` | Public AI request demo |
| `/register` | Mock account creation |
| `/splash` | Splash → redirect |
| `/welcome` | Auth welcome |
| `/login/email` | Email/password |
| `/login/phone` | Phone login |
| `/login/otp` | OTP |
| `/login/forgot-password` | Reset |
| `/onboarding/*` | Account type → complete |

## Customer app

| Route | Notes |
| --- | --- |
| `/dashboard` | Dashboard |
| `/price-calculation` | Shared request engine · quote mode |
| `/create-shipment` | Shared request engine · order completion mode |
| `/orders` | Commercial order records |
| `/orders/[id]` | Order detail |
| `/quotes` | Pre-order quote records |
| `/shipments` | Active physical transport records |
| `/integrations` | Marketplace / Excel / templates |
| `/integrations/[id]` | Integration detail |
| `/reports` | Usage summary |
| `/settings` | Organization and preferences |
| `/support` | Support entry points |

### Specialized / legacy-compatible flows

| Route | Notes |
| --- | --- |
| `/app/agent` | AI Logistics Agent |
| `/app/requests/new` | New request (AI) |
| `/app/requests/new/form` | Manual form → wizard |
| `/app/requests/courier` | City courier |
| `/app/requests/parcel` | 1–30 desi + carriers |
| `/app/requests/xl` | Gönder XL |
| `/app/requests/freight` | FTL vs LTL picker |
| `/app/requests/ftl` | FTL |
| `/app/requests/ltl` | LTL |
| `/app/requests/spot` | Spot + payment |
| `/app/orders`, `/app/quotes`, `/app/integrations/*` | Compatibility routes |
| `/app/shipments` | → legacy order view |

## Operations (`/operations`)

| Route | Notes |
| --- | --- |
| `/operations` | Ops dashboard |
| `/operations/queue/[view]` | Queues |
| `/operations/requests/[id]` | Request workspace |
| `/operations/partners` | Partners |
| `/operations/price-lists` | Price lists |
| `/operations/finance` | Finance |
| `/operations/documents` | Documents |
| `/operations/reports` | Ops reports |
| `/ops` | → `/operations` |

## Other

| Route | Notes |
| --- | --- |
| `/design-system` | Shared components |
| `/customer/*` | Legacy Step 1 demos |
