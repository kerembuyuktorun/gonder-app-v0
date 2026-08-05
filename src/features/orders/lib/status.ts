import type {
  OrderLifecycleStatus,
  OrderListView,
  OrderShipmentConversion,
} from "@/types/orders";

export const STATUS_BY_VIEW: Record<
  OrderListView,
  OrderLifecycleStatus[] | "all"
> = {
  all: "all",
  needs_shipment: "all",
  converted: "all",
  awaiting_quote: ["quote_pending"],
  awaiting_approval: ["awaiting_approval"],
  awaiting_payment: ["awaiting_payment"],
  active: ["confirmed", "picked_up", "in_transit", "out_for_delivery"],
  completed: ["delivered"],
  cancelled: ["cancelled"],
  problematic: ["issue"],
};

export const CONVERSION_BY_VIEW: Partial<
  Record<OrderListView, OrderShipmentConversion>
> = {
  needs_shipment: "not_converted",
  converted: "converted",
};

export function statusesForView(
  view: OrderListView,
): OrderLifecycleStatus[] | "all" {
  return STATUS_BY_VIEW[view];
}

export function conversionForView(
  view: OrderListView,
): OrderShipmentConversion | undefined {
  return CONVERSION_BY_VIEW[view];
}

/** Map provider-specific raw statuses into Gönder lifecycle. */
export function mapProviderStatus(
  serviceType: string,
  rawStatus: string,
): OrderLifecycleStatus {
  const key = rawStatus.toLowerCase().replace(/\s+/g, "_");
  const table: Record<string, OrderLifecycleStatus> = {
    created: "confirmed",
    booked: "confirmed",
    label_printed: "confirmed",
    picked_up: "picked_up",
    collected: "picked_up",
    in_transit: "in_transit",
    hub_scan: "in_transit",
    out_for_delivery: "out_for_delivery",
    ofd: "out_for_delivery",
    delivered: "delivered",
    signed: "delivered",
    cancelled: "cancelled",
    exception: "issue",
    delay: "issue",
    damaged: "issue",
    awaiting_quote: "quote_pending",
    quote_ready: "awaiting_approval",
    payment_due: "awaiting_payment",
    draft: "draft",
  };
  return table[key] ?? (serviceType === "spot" ? "quote_pending" : "in_transit");
}

export const DEFAULT_ORDER_COLUMNS = [
  "reference",
  "source",
  "externalRef",
  "conversion",
  "service",
  "status",
  "route",
  "amount",
  "updatedAt",
] as const;

export const ALL_ORDER_COLUMNS = [
  ...DEFAULT_ORDER_COLUMNS,
  "tracking",
  "provider",
  "createdAt",
  "eta",
] as const;

export const ORDER_LIST_VIEWS: OrderListView[] = [
  "all",
  "needs_shipment",
  "converted",
  "awaiting_payment",
  "active",
  "completed",
  "cancelled",
  "problematic",
];
