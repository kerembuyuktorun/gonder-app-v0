# Route list

All paths are locale-prefixed (`/tr` default, `/en`).

## Public / auth

| Route | Notes |
| --- | --- |
| `/` | Marketing home |
| `/splash` | Splash → redirect |
| `/welcome` | Auth welcome |
| `/login/email` | Email/password |
| `/login/phone` | Phone login |
| `/login/otp` | OTP |
| `/login/forgot-password` | Reset |
| `/onboarding/*` | Account type → complete |

## Customer app (`/app`)

| Route | Notes |
| --- | --- |
| `/app/home` | Dashboard |
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
| `/app/orders` | Order management |
| `/app/orders/[id]` | Order detail |
| `/app/shipments` | → `/app/orders` |
| `/app/quotes` | Quote queue (orders-backed) |
| `/app/reports` | Usage summary |
| `/app/support` | Help links |
| `/app/integrations` | Marketplace / Excel / templates |
| `/app/integrations/[id]` | Connect |
| `/app/settings` | Org & preferences |

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
