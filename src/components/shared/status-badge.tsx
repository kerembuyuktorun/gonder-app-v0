"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { QuoteStatus, ShipmentStatus, StatusTone } from "@/types/domain";

const shipmentTone: Record<ShipmentStatus, StatusTone> = {
  draft: "neutral",
  quoted: "info",
  confirmed: "info",
  picked_up: "info",
  in_transit: "info",
  out_for_delivery: "warning",
  delivered: "success",
  cancelled: "neutral",
  failed: "error",
};

const quoteTone: Record<QuoteStatus, StatusTone> = {
  pending: "warning",
  ready: "info",
  accepted: "success",
  expired: "neutral",
  rejected: "error",
};

export type StatusBadgeProps = {
  status: ShipmentStatus | QuoteStatus;
  kind?: "shipment" | "quote";
};

export function StatusBadge({ status, kind = "shipment" }: StatusBadgeProps) {
  const t = useTranslations("status");
  const tone =
    kind === "quote"
      ? quoteTone[status as QuoteStatus]
      : shipmentTone[status as ShipmentStatus];

  return <Badge tone={tone}>{t(status)}</Badge>;
}
