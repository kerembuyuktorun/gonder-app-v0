import type { DashboardSnapshot } from "@/types/dashboard";
import { MOCK_ORDERS } from "@/mocks/data/orders";
import type { OrderDetail, OrderLifecycleStatus } from "@/types/orders";
import type { QuoteStatus, ShipmentStatus } from "@/types/domain";

function mapShipmentStatus(status: OrderLifecycleStatus): ShipmentStatus {
  if (status === "issue") return "failed";
  if (status === "quote_pending" || status === "awaiting_approval") return "quoted";
  if (status === "awaiting_payment" || status === "draft") return "draft";
  return status as ShipmentStatus;
}

function mapQuoteStatus(status: OrderLifecycleStatus): QuoteStatus {
  if (status === "quote_pending") return "pending";
  if (status === "awaiting_approval") return "ready";
  if (status === "cancelled") return "rejected";
  return "ready";
}

function toActive(order: OrderDetail) {
  return {
    id: order.id,
    orderId: order.id,
    trackingNumber: order.trackingNumber,
    serviceType: order.serviceType,
    status: mapShipmentStatus(order.status),
    originCity: order.originCity,
    destinationCity: order.destinationCity,
    updatedAt: order.updatedAt,
    total: order.total,
  };
}

const activeStatuses: OrderLifecycleStatus[] = [
  "confirmed",
  "picked_up",
  "in_transit",
  "out_for_delivery",
];

const ACTIVE = MOCK_ORDERS.filter((o) => activeStatuses.includes(o.status));
const COMPLETED = MOCK_ORDERS.filter((o) => o.status === "delivered");
const QUOTE_PENDING = MOCK_ORDERS.filter((o) => o.status === "quote_pending");
const AWAITING_APPROVAL = MOCK_ORDERS.filter(
  (o) => o.status === "awaiting_approval",
);
const AWAITING_PAYMENT = MOCK_ORDERS.filter(
  (o) => o.status === "awaiting_payment",
);
const NEEDS_SHIPMENT = MOCK_ORDERS.filter(
  (o) =>
    o.shipmentConversion === "not_converted" && o.status !== "cancelled",
);

export const mockDashboardSnapshot: DashboardSnapshot = {
  greetingName: "Ayşe",
  contextLabel: "Arf Lojistik Demo",
  services: [
    {
      id: "svc-courier",
      serviceType: "courier",
      nameKey: "services.courier",
      descriptionKey: "dashboard.services.courierDesc",
      href: "/app/requests/courier",
    },
    {
      id: "svc-parcel",
      serviceType: "parcel_1_30",
      nameKey: "services.parcel_1_30",
      descriptionKey: "dashboard.services.parcelDesc",
      href: "/app/requests/parcel",
    },
    {
      id: "svc-xl",
      serviceType: "gonder_xl",
      nameKey: "services.gonder_xl",
      descriptionKey: "dashboard.services.xlDesc",
      href: "/app/requests/xl",
    },
    {
      id: "svc-ftl",
      serviceType: "ftl",
      nameKey: "services.ftl",
      descriptionKey: "dashboard.services.ftlDesc",
      helpKey: "dashboard.services.ftlHelp",
      href: "/app/requests/ftl",
    },
    {
      id: "svc-ltl",
      serviceType: "ltl",
      nameKey: "services.ltl",
      descriptionKey: "dashboard.services.ltlDesc",
      helpKey: "dashboard.services.ltlHelp",
      href: "/app/requests/ltl",
    },
    {
      id: "svc-spot",
      serviceType: "spot",
      nameKey: "services.spot",
      descriptionKey: "dashboard.services.spotDesc",
      href: "/app/requests/spot",
    },
  ],
  quickActions: [
    {
      id: "qa-new",
      labelKey: "dashboard.quickActions.newShipment",
      href: "/create-shipment",
      icon: "plus",
    },
    {
      id: "qa-ai",
      labelKey: "dashboard.quickActions.aiRequest",
      href: "/create-with-ai",
      icon: "sparkles",
    },
    {
      id: "qa-excel",
      labelKey: "dashboard.quickActions.uploadExcel",
      href: "/integrations?tab=excel",
      icon: "upload",
    },
    {
      id: "qa-copy",
      labelKey: "dashboard.quickActions.copyPrevious",
      href: "/orders?action=copy&peek=ord_p1",
      icon: "copy",
    },
    {
      id: "qa-quotes",
      labelKey: "dashboard.quickActions.viewQuotes",
      href: "/quotes",
      icon: "quotes",
    },
    {
      id: "qa-orders",
      labelKey: "dashboard.quickActions.viewOrders",
      href: "/orders?view=needs_shipment",
      icon: "quotes",
    },
    {
      id: "qa-track",
      labelKey: "dashboard.quickActions.trackShipment",
      href: "/shipments",
      icon: "track",
    },
    {
      id: "qa-integrations",
      labelKey: "dashboard.quickActions.connectIntegration",
      href: "/integrations",
      icon: "plug",
    },
  ],
  activeShipments: ACTIVE.map(toActive),
  ordersNeedingShipment: NEEDS_SHIPMENT.map((o) => ({
    id: o.id,
    orderId: o.id,
    reference: o.externalRef ?? o.reference,
    serviceType: o.serviceType,
    amount: o.total,
    dueAt: o.updatedAt,
  })),
  pendingQuoteRequests: QUOTE_PENDING.map((o) => ({
    id: o.id,
    orderId: o.id,
    reference: o.reference,
    serviceType: o.serviceType,
    status: mapQuoteStatus(o.status),
    originCity: o.originCity,
    destinationCity: o.destinationCity,
    total: o.total,
    validUntil: o.updatedAt,
  })),
  awaitingUserApproval: AWAITING_APPROVAL.map((o) => ({
    id: o.id,
    orderId: o.id,
    reference: o.reference,
    serviceType: o.serviceType,
    status: mapQuoteStatus(o.status),
    originCity: o.originCity,
    destinationCity: o.destinationCity,
    total: o.quoteAmount ?? o.total,
    validUntil: o.updatedAt,
  })),
  awaitingPayment: AWAITING_PAYMENT.map((o) => ({
    id: o.id,
    orderId: o.id,
    reference: o.reference,
    serviceType: o.serviceType,
    amount: o.total,
    dueAt: o.updatedAt,
  })),
  recentlyCompleted: COMPLETED.map((o) => ({
    ...toActive(o),
    total: o.total,
  })),
  integrations: [
    {
      id: "int-trendyol",
      nameKey: "dashboard.integrations.trendyol",
      status: "connected",
      lastSyncedAt: "2026-08-04T09:00:00.000Z",
    },
    {
      id: "int-n11",
      nameKey: "dashboard.integrations.n11",
      status: "pending",
    },
    {
      id: "int-erp",
      nameKey: "dashboard.integrations.erp",
      status: "error",
      lastSyncedAt: "2026-08-03T18:20:00.000Z",
    },
    {
      id: "int-shopify",
      nameKey: "dashboard.integrations.shopify",
      status: "connected",
      lastSyncedAt: "2026-08-04T08:30:00.000Z",
    },
  ],
  usage: {
    periodLabelKey: "dashboard.usage.thisMonth",
    shipmentCount: MOCK_ORDERS.length,
    spend: {
      amount: MOCK_ORDERS.reduce((s, o) => s + o.total.amount, 0),
      currency: "TRY",
    },
    quoteCount: QUOTE_PENDING.length + AWAITING_APPROVAL.length,
    avgCost: {
      amount: Math.round(
        MOCK_ORDERS.reduce((s, o) => s + o.total.amount, 0) /
          Math.max(1, MOCK_ORDERS.length),
      ),
      currency: "TRY",
    },
  },
};

export const mockEmptyDashboardSnapshot: DashboardSnapshot = {
  ...mockDashboardSnapshot,
  greetingName: "Yeni kullanıcı",
  contextLabel: "",
  ordersNeedingShipment: [],
  activeShipments: [],
  pendingQuoteRequests: [],
  awaitingUserApproval: [],
  awaitingPayment: [],
  recentlyCompleted: [],
  integrations: mockDashboardSnapshot.integrations.map((item) => ({
    ...item,
    status: "disconnected" as const,
    lastSyncedAt: undefined,
  })),
  usage: {
    periodLabelKey: "dashboard.usage.thisMonth",
    shipmentCount: 0,
    spend: { amount: 0, currency: "TRY" },
    quoteCount: 0,
    avgCost: { amount: 0, currency: "TRY" },
  },
};
