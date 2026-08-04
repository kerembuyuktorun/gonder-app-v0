#!/usr/bin/env bash
# Deploy the Gönder web frontend to Vercel without interactive prompts.
#
#   VERCEL_TOKEN=...  ./scripts/deploy-vercel.sh            # preview
#   VERCEL_TOKEN=...  ./scripts/deploy-vercel.sh --prod     # production
#
# Optional: VERCEL_ORG_ID / VERCEL_PROJECT_ID to target an existing project
# without running `vercel link` first.
set -euo pipefail

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "VERCEL_TOKEN is required. Create one at https://vercel.com/account/tokens" >&2
  exit 1
fi

TARGET="preview"
PROD_FLAG=()
if [[ "${1:-}" == "--prod" ]]; then
  TARGET="production"
  PROD_FLAG=(--prod)
fi

VERCEL="pnpm dlx vercel@latest"

echo "==> Pulling $TARGET environment"
$VERCEL pull --yes --environment="$TARGET" --token "$VERCEL_TOKEN"

echo "==> Building"
$VERCEL build "${PROD_FLAG[@]}" --token "$VERCEL_TOKEN"

echo "==> Deploying ($TARGET)"
URL=$($VERCEL deploy --prebuilt "${PROD_FLAG[@]}" --token "$VERCEL_TOKEN")

echo "$URL"
echo "==> Smoke checking $URL"
./scripts/smoke-deployment.sh "$URL"
