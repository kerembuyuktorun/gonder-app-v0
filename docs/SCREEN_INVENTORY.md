# Gönder frontend — screen inventory

| Screen | Route | Module | States covered |
| --- | --- | --- | --- |
| Marketing home | `/[locale]` | marketing | static |
| Splash | `/splash` | auth | loading → redirect |
| Welcome | `/welcome` | auth | unauthenticated |
| Email login | `/login/email` | auth | validation / error / success |
| Phone / OTP | `/login/phone`, `/login/otp` | auth | OTP valid/expired |
| Forgot password | `/login/forgot-password` | auth | reset flow |
| Onboarding steps | `/onboarding/*` | onboarding | step guards |
| App home | `/app/home` | dashboard | loading / error / empty widgets / populated |
| AI Agent | `/app/agent`, `/app/requests/new` | agent | chat + draft + WhatsApp handoff |
| Manual form | `/app/requests/new/form` | agent | validation → wizard redirect |
| Courier | `/app/requests/courier` | courier | wizard |
| Parcel | `/app/requests/parcel` | parcel | quotes / XL nudge / checkout |
| XL | `/app/requests/xl` | xl | pricing states / checkout |
| Freight picker | `/app/requests/freight` | freight | FTL vs LTL |
| FTL / LTL | `/app/requests/ftl`, `/ltl` | freight | quote messaging |
| Spot | `/app/requests/spot` | spot | compare / pay / 3DS |
| Orders | `/app/orders` | orders | views / empty / table / copy banner |
| Order detail | `/app/orders/[id]` | orders | full sections / drawer peek |
| Quotes | `/app/quotes` | orders-backed | empty / list |
| Reports | `/app/reports` | reports | summary cards |
| Support | `/app/support` | support | help cards |
| Integrations | `/app/integrations` | integrations | marketplace / excel / templates |
| Integration detail | `/app/integrations/[id]` | integrations | connect states |
| Settings | `/app/settings` | settings | sections / permission |
| Operations home | `/operations` | operations | staff guard / metrics |
| Ops queues | `/operations/queue/[view]` | operations | dense table |
| Ops request | `/operations/requests/[id]` | operations | split workspace |
| Partners / prices / finance / docs / reports | `/operations/*` | operations | permission gated |
| Design system | `/design-system` | shared | showcase |
| Legacy | `/ops`, `/app/shipments`, `/customer/*` | redirects / stubs | |

## Demo scenarios checklist

1. AI FTL request — `/app/requests/new?service=ftl` or agent prompt  
2. WhatsApp → web — `/app/agent?from=whatsapp&conversationId=wa-handoff-001`  
3. Courier — `/app/requests/courier`  
4. Parcel carrier compare — `/app/requests/parcel`  
5. >30 desi → XL — parcel wizard nudge → `/app/requests/xl`  
6. LTL — `/app/requests/ltl`  
7. Spot compare — `/app/requests/spot`  
8. Payment — spot / parcel / xl checkout  
9. Track active order — `/app/orders?view=active` or detail `/app/orders/ord_c1`  
10. Excel bulk — `/app/integrations?tab=excel`  
11. Ops quote prep — `ops@gonder.com` → `/operations/queue/quote_prep` → `/operations/requests/opr_3`
