#!/usr/bin/env bash
# Verify a deployed Gönder frontend answers on every key route.
#
#   ./scripts/smoke-deployment.sh https://gonder.vercel.app
set -euo pipefail

BASE="${1:-${PLAYWRIGHT_TEST_BASE_URL:-http://127.0.0.1:3000}}"
BASE="${BASE%/}"

ROUTES=(
  /
  /tr
  /en
  /tr/welcome
  /tr/login/email
  /tr/login/phone
  /tr/onboarding/account-type
  /tr/app/home
  /tr/app/agent
  /tr/app/requests/new
  /tr/app/requests/courier
  /tr/app/requests/parcel
  /tr/app/requests/xl
  /tr/app/requests/freight
  /tr/app/requests/ftl
  /tr/app/requests/ltl
  /tr/app/requests/spot
  /tr/app/orders
  /tr/app/orders/ord_c1
  /tr/app/quotes
  /tr/app/reports
  /tr/app/support
  /tr/app/integrations
  /tr/app/settings
  /tr/operations
  /tr/operations/queue/quote_prep
  /tr/operations/requests/opr_3
  /tr/design-system
)

failed=0
for route in "${ROUTES[@]}"; do
  code=$(curl -sSL -o /dev/null -w "%{http_code}" --max-time 30 "$BASE$route" || echo "000")
  if [[ "$code" =~ ^2 ]]; then
    printf '  ok   %s  %s\n' "$code" "$route"
  else
    printf '  FAIL %s  %s\n' "$code" "$route"
    failed=$((failed + 1))
  fi
done

if (( failed > 0 )); then
  echo "$failed route(s) failed against $BASE" >&2
  exit 1
fi

echo "All ${#ROUTES[@]} routes healthy on $BASE"
