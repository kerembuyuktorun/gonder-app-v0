"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { OrderLifecycleStatus } from "@/types/orders";
import type { StatusTone } from "@/types/domain";

const toneByStatus: Record<OrderLifecycleStatus, StatusTone> = {
  draft: "neutral",
  quote_pending: "warning",
  awaiting_approval: "warning",
  awaiting_payment: "warning",
  confirmed: "info",
  picked_up: "info",
  in_transit: "info",
  out_for_delivery: "warning",
  delivered: "success",
  cancelled: "neutral",
  issue: "error",
};

export function OrderStatusBadge({
  status,
  critical,
}: {
  status: OrderLifecycleStatus;
  critical?: boolean;
}) {
  const t = useTranslations("orders.status");
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge tone={toneByStatus[status]}>{t(status)}</Badge>
      {critical ? <Badge tone="error">{t("critical")}</Badge> : null}
    </span>
  );
}
