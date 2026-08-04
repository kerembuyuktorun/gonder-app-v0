# Backend API contract needs

Frontend repositories today are mock-backed via `NEXT_PUBLIC_DATA_SOURCE=mock`. When switching to `api`, implement HTTP clients that match these interfaces (stable contracts):

| Repository | File | Priority endpoints |
| --- | --- | --- |
| AuthRepository | `src/lib/api/auth-repository.ts` | session, OTP, email login, reset, org context, onboarding |
| DashboardRepository | `dashboard-repository.ts` | `GET /dashboard` snapshot |
| AgentRepository | `agent-repository.ts` | conversations, messages, draft confirm, WhatsApp handoff |
| CourierRepository | `courier-repository.ts` | validate, quote, submit |
| ParcelRepository | `parcel-repository.ts` | templates, quotes, checkout, excel parse |
| XlRepository | `xl-repository.ts` | quote states, ops review, checkout |
| FreightRepository | `freight-repository.ts` | FTL/LTL submit, quote lifecycle, messaging |
| SpotRepository | `spot-repository.ts` | open request, offers, counter, accept |
| PaymentRepository | `payment-repository.ts` | cards, wallet, discount, checkout, 3DS, poll |
| OrdersRepository | `orders-repository.ts` | list (filters/pagination), detail, issue, cancel, messages, notifications, CSV |
| IntegrationsRepository | `integrations-repository.ts` | providers, connect, excel import jobs, templates |
| SettingsRepository | `settings-repository.ts` | profile, org, team, addresses, payments, prefs |
| OperationsRepository | `operations-repository.ts` | metrics, queues, workspace mutations, partners, finance, audit |

## Shared requirements
- Idempotency keys for payment & quote accept  
- Cursor or page/pageSize pagination for tables  
- Provider status → Gönder lifecycle mapping server-side  
- Audit log for ops mutations (reason, before/after)  
- Role claims for customer org permissions and `staffRole` for `/operations`

## Production API integration checklist
- [ ] Set `NEXT_PUBLIC_DATA_SOURCE=api`  
- [ ] Base URL + auth header (Bearer) wiring  
- [ ] Replace each `notImplemented` client in `src/lib/api/client.ts`  
- [ ] Map API errors to existing AuthError / UI error states  
- [ ] Keep TanStack Query keys stable while swapping `queryFn`  
- [ ] Contract tests against OpenAPI / mock server  
- [ ] Feature flags for partial cutovers (orders first recommended)  
- [ ] Observability: request id correlation on ops audit  
- [ ] Remove or gate demo credentials in production builds
