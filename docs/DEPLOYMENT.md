# Environment variables

| Variable | Values | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` \| `api` | `mock` | Selects mock vs API repository implementations in `src/lib/api/client.ts` |

Copy from `.env.example`:

```bash
cp .env.example .env.local
```

When `api` is set, unimplemented repository methods throw until HTTP clients are added.

# Deployment

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

- Host as a standard Next.js App Router app (Node 20+ recommended).  
- Set `NEXT_PUBLIC_DATA_SOURCE=mock` for demos; switch to `api` only after backend clients exist.  
- Locales are prefixed (`/tr`, `/en`); default locale `tr`.  
- No Docker asset is required for the frontend-only demo.
