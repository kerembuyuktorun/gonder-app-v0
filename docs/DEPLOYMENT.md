# Environment variables

| Variable | Values | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` \| `api` | `mock` | Selects mock vs API repository implementations in `src/lib/api/client.ts` |
| `NEXT_PUBLIC_SITE_URL` | absolute URL | unset | Optional canonical origin for metadata / absolute links |

Locally:

```bash
cp .env.example .env.local
```

With `api`, unimplemented repository methods throw until HTTP clients are added — keep `mock` for the demo.

# Local setup

```bash
pnpm install --frozen-lockfile
pnpm dev            # http://localhost:3000 → redirects to /tr
```

Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm test                                  # Vitest
pnpm build
pnpm exec playwright install chromium      # once
pnpm test:e2e                              # boots `pnpm start` on port 3100
```

`playwright.config.ts` starts its own production server on port **3100** (override with `E2E_PORT`) so it never collides with a running `pnpm dev` on 3000.

# Deployment — Vercel

Node **22** (`.nvmrc`), package manager **pnpm 10** (`packageManager` field). Build settings come from `vercel.json`.

## Option A — Git integration (recommended)

1. In Vercel, **Add New → Project** and import `kerembuyuktorun/gonder-app-v0`.
2. Framework preset: **Next.js** (auto-detected). Install/build commands come from `vercel.json`.
3. Add environment variable `NEXT_PUBLIC_DATA_SOURCE=mock` for Production, Preview and Development.
4. Deploy. Every push to the default branch ships Production; every PR gets a Preview URL.

## Option B — Vercel CLI

```bash
pnpm dlx vercel login
pnpm dlx vercel link            # select scope + project
pnpm dlx vercel env add NEXT_PUBLIC_DATA_SOURCE production   # value: mock
pnpm dlx vercel --prod          # build + deploy Production
```

Non-interactive (CI or an agent with a token):

```bash
export VERCEL_TOKEN=...         # Vercel → Account Settings → Tokens
pnpm dlx vercel pull --yes --environment=production --token "$VERCEL_TOKEN"
pnpm dlx vercel build --prod --token "$VERCEL_TOKEN"
pnpm dlx vercel deploy --prebuilt --prod --token "$VERCEL_TOKEN"
```

## Post-deploy smoke checks

Run against the deployed origin:

```bash
BASE=https://<your-deployment>.vercel.app
for p in /tr /tr/welcome /tr/login/email /tr/app/home /tr/operations /tr/design-system; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")  $p"
done
```

Then log in with `ayse@example.com` / `Password1!` and confirm `/tr/app/home`, and with
`ops@gonder.com` / `Password1!` for `/tr/operations`.

Playwright can also target the deployment directly:

```bash
PLAYWRIGHT_TEST_BASE_URL=$BASE pnpm exec playwright test tests/e2e/smoke.spec.ts
```

## Notes

- Locales are path-prefixed (`/tr`, `/en`); default `tr`. `/` redirects to `/tr`.
- Mock auth state lives in `localStorage`, so no backend or database is required for the demo.
- Security headers are set in `vercel.json`; adjust `Permissions-Policy` if a real map SDK is added.
- Demo credentials are shipped in the mock repositories — gate or remove them before any public production launch.
