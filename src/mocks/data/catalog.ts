import type {
  PriceSummaryModel,
  QuoteSummary,
  ServiceCatalogItem,
  ShipmentSummary,
  TimelineEvent,
} from "@/types/domain";

export const mockServices: ServiceCatalogItem[] = [
  {
    id: "svc-courier",
    type: "courier",
    nameKey: "services.courier",
    descriptionKey: "services.courierDesc",
    etaKey: "services.etaSameDay",
    channels: ["b2c", "b2b"],
  },
  {
    id: "svc-parcel",
    type: "parcel_1_30",
    nameKey: "services.parcel_1_30",
    descriptionKey: "services.parcelDesc",
    etaKey: "services.eta1_3",
    channels: ["b2c", "b2b"],
  },
  {
    id: "svc-xl",
    type: "gonder_xl",
    nameKey: "services.gonder_xl",
    descriptionKey: "services.xlDesc",
    etaKey: "services.eta2_5",
    channels: ["b2c", "b2b"],
  },
  {
    id: "svc-ftl",
    type: "ftl",
    nameKey: "services.ftl",
    descriptionKey: "services.ftlDesc",
    etaKey: "services.etaOnDemand",
    channels: ["b2b"],
  },
  {
    id: "svc-ltl",
    type: "ltl",
    nameKey: "services.ltl",
    descriptionKey: "services.ltlDesc",
    etaKey: "services.etaOnDemand",
    channels: ["b2b"],
  },
  {
    id: "svc-spot",
    type: "spot",
    nameKey: "services.spot",
    descriptionKey: "services.spotDesc",
    etaKey: "services.etaOnDemand",
    channels: ["b2b", "ops"],
  },
];

export const mockQuotes: QuoteSummary[] = [
  {
    id: "q-1001",
    reference: "QT-2026-1001",
    serviceType: "parcel_1_30",
    status: "ready",
    channel: "b2c",
    originCity: "İstanbul",
    destinationCity: "Ankara",
    total: { amount: 189.5, currency: "TRY" },
    createdAt: "2026-08-01T09:12:00.000Z",
    validUntil: "2026-08-08T09:12:00.000Z",
  },
  {
    id: "q-1002",
    reference: "QT-2026-1002",
    serviceType: "ftl",
    status: "pending",
    channel: "b2b",
    originCity: "İzmir",
    destinationCity: "Gaziantep",
    total: { amount: 18500, currency: "TRY" },
    createdAt: "2026-08-02T14:30:00.000Z",
    validUntil: "2026-08-05T14:30:00.000Z",
  },
  {
    id: "q-1003",
    reference: "QT-2026-1003",
    serviceType: "courier",
    status: "accepted",
    channel: "b2c",
    originCity: "İstanbul",
    destinationCity: "İstanbul",
    total: { amount: 249, currency: "TRY" },
    createdAt: "2026-08-03T08:00:00.000Z",
    validUntil: "2026-08-04T08:00:00.000Z",
  },
];

export const mockShipments: ShipmentSummary[] = [
  {
    id: "s-2001",
    trackingNumber: "GND2608001",
    serviceType: "parcel_1_30",
    status: "in_transit",
    channel: "b2c",
    originCity: "İstanbul",
    destinationCity: "Bursa",
    total: { amount: 156.75, currency: "TRY" },
    createdAt: "2026-08-01T11:00:00.000Z",
    estimatedDeliveryAt: "2026-08-04T18:00:00.000Z",
  },
  {
    id: "s-2002",
    trackingNumber: "GND2608002",
    serviceType: "ltl",
    status: "picked_up",
    channel: "b2b",
    originCity: "Kocaeli",
    destinationCity: "Adana",
    total: { amount: 9200, currency: "TRY" },
    createdAt: "2026-08-02T07:45:00.000Z",
    estimatedDeliveryAt: "2026-08-06T17:00:00.000Z",
  },
  {
    id: "s-2003",
    trackingNumber: "GND2608003",
    serviceType: "courier",
    status: "delivered",
    channel: "b2c",
    originCity: "Ankara",
    destinationCity: "Ankara",
    total: { amount: 129, currency: "TRY" },
    createdAt: "2026-07-30T10:20:00.000Z",
    estimatedDeliveryAt: "2026-07-30T16:00:00.000Z",
  },
];

export const mockPriceSummary: PriceSummaryModel = {
  lines: [
    {
      id: "line-shipping",
      labelKey: "price.shipping",
      amount: { amount: 150, currency: "TRY" },
    },
    {
      id: "line-service",
      labelKey: "price.serviceFee",
      amount: { amount: 25, currency: "TRY" },
    },
  ],
  tax: { amount: 35, currency: "TRY" },
  discount: { amount: 20.5, currency: "TRY" },
  total: { amount: 189.5, currency: "TRY" },
};

export const mockTimeline: TimelineEvent[] = [
  {
    id: "t1",
    titleKey: "timeline.created",
    occurredAt: "2026-08-01T09:12:00.000Z",
    tone: "info",
  },
  {
    id: "t2",
    titleKey: "timeline.quoted",
    occurredAt: "2026-08-01T09:40:00.000Z",
    tone: "neutral",
  },
  {
    id: "t3",
    titleKey: "timeline.confirmed",
    occurredAt: "2026-08-01T10:05:00.000Z",
    tone: "success",
  },
  {
    id: "t4",
    titleKey: "timeline.pickedUp",
    occurredAt: "2026-08-02T08:15:00.000Z",
    tone: "info",
  },
  {
    id: "t5",
    titleKey: "timeline.inTransit",
    occurredAt: "2026-08-02T12:00:00.000Z",
    tone: "info",
  },
];
