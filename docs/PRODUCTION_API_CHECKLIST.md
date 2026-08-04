# Production API integration checklist

Use with `docs/BACKEND_CONTRACTS.md`.

## Cutover steps

1. [ ] Implement HTTP clients for each repository interface under `src/lib/api/`
2. [ ] Wire clients in `src/lib/api/client.ts` when `NEXT_PUBLIC_DATA_SOURCE=api`
3. [ ] Configure API base URL + Bearer token from session
4. [ ] Map API error envelopes to existing UI error / AuthError paths
5. [ ] Keep TanStack Query keys stable while swapping `queryFn`
6. [ ] Add idempotency keys for payment accept and quote accept
7. [ ] Server-side map provider statuses → Gönder lifecycle
8. [ ] Contract tests (OpenAPI / mock server) for list pagination + detail
9. [ ] Feature-flag partial cutover (recommend: orders → dashboard → wizards)
10. [ ] Gate or remove demo credentials in production builds
11. [ ] Verify ops audit mutations send reason + before/after payloads
12. [ ] Confirm locale headers / Accept-Language if backend localizes copy

## Acceptance smoke (post-cutover)

- [ ] Login + session restore
- [ ] Dashboard snapshot loads
- [ ] Create one request per service type (or AI confirm)
- [ ] Orders list filters + detail tracking
- [ ] Payment success / fail / uncertain poll
- [ ] Ops quote write as `ops_agent`, denied as `ops_viewer`
