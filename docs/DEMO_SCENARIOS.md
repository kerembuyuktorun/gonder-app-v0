# Demo scenarios

Run the app with `pnpm dev` and `NEXT_PUBLIC_DATA_SOURCE=mock`.

## Credentials

| User | Email | Password | Landing |
| --- | --- | --- | --- |
| Customer (complete) | `ayse@example.com` | `Password1!` | `/tr/app/home` |
| Customer (onboarding) | `mehmet@example.com` | `Password1!` | onboarding tax step |
| Ops staff | `ops@gonder.com` | `Password1!` | `/tr/operations` |
| OTP | — | `123456` (valid) / `000000` (expired) | — |

## Scenarios

| # | Scenario | Path / steps |
| --- | --- | --- |
| 1 | AI FTL request | Login → `/tr/app/requests/new` or `/tr/app/agent` → ask for FTL Istanbul→Ankara |
| 2 | WhatsApp → web | `/tr/app/agent?from=whatsapp&conversationId=wa-handoff-001` |
| 3 | Courier request | `/tr/app/requests/courier` → complete wizard steps |
| 4 | Carrier comparison | `/tr/app/requests/parcel` → get quotes → compare |
| 5 | >30 desi → XL | Parcel wizard with chargeable desi > 30 → XL nudge → `/tr/app/requests/xl` |
| 6 | LTL request | `/tr/app/requests/ltl` |
| 7 | Spot offers | `/tr/app/requests/spot` → compare → accept |
| 8 | Payment | Spot / parcel / XL checkout (3DS mock) |
| 9 | Track active order | `/tr/app/orders?view=active` → open detail |
| 10 | Excel bulk upload | `/tr/app/integrations?tab=excel` → template → import |
| 11 | Ops quote prep | Ops login → `/tr/operations/queue/quote_prep` → open request → prepare quote |

## Shared mock order ids (dashboard ↔ orders)

Dashboard widgets deep-link to the same `MOCK_ORDERS` ids (e.g. active tracking numbers and payment references stay aligned).
