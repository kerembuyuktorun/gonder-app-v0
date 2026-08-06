import type { Money, ServiceType, StatusTone, TimelineEvent } from "@/types/domain";

/** Unified Gönder order lifecycle (provider statuses mapped here). */
export type OrderLifecycleStatus =
  | "draft"
  | "quote_pending"
  | "awaiting_approval"
  | "awaiting_payment"
  | "confirmed"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "issue";

export type OrderListView =
  | "all"
  | "needs_shipment"
  | "converted"
  | "awaiting_quote"
  | "awaiting_approval"
  | "awaiting_payment"
  | "active"
  | "completed"
  | "cancelled"
  | "problematic";

/** Where the commercial order entered Gönder. */
export type OrderSource = "integration" | "manual" | "excel" | "api";

/** Whether the order already has a physical shipment record. */
export type OrderShipmentConversion = "not_converted" | "converted";

export type OrderDocumentType =
  | "label"
  | "barcode"
  | "waybill"
  | "invoice"
  | "contract"
  | "cargo_photo"
  | "delivery_photo"
  | "signature"
  | "damage_report";

export type OrderDocument = {
  id: string;
  type: OrderDocumentType;
  name: string;
  url: string;
  createdAt: string;
};

export type OrderParty = {
  name: string;
  phone?: string;
  company?: string;
};

export type OrderAddress = {
  line1: string;
  district: string;
  city: string;
};

export type OrderCargoLine = {
  id: string;
  description: string;
  quantity: number;
  weightKg: number;
};

export type OrderProvider = {
  name: string;
  code?: string;
  rawStatus: string;
  vehicle?: string;
  driverName?: string;
  driverPhone?: string;
};

export type OrderLocation = {
  lat: number;
  lng: number;
  label: string;
  updatedAt: string;
  live: boolean;
};

export type OrderTrackingEvent = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  occurredAt: string;
  tone?: StatusTone;
  locationLabel?: string;
};

export type OrderMessage = {
  id: string;
  author: "customer" | "ops" | "provider";
  authorName: string;
  body: string;
  createdAt: string;
};

export type OrderIssueCategory = "delay" | "damage" | "missing" | "address" | "other";

export type OrderIssue = {
  id: string;
  category: OrderIssueCategory;
  description: string;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
};

export type OrderDeliveryProof = {
  photoName?: string;
  signatureName?: string;
  receivedBy?: string;
  deliveredAt?: string;
  notes?: string;
};

export type OrderSummary = {
  id: string;
  reference: string;
  trackingNumber: string;
  serviceType: ServiceType;
  status: OrderLifecycleStatus;
  originCity: string;
  destinationCity: string;
  total: Money;
  createdAt: string;
  updatedAt: string;
  etaAt?: string;
  providerName?: string;
  critical?: boolean;
  hasIssue?: boolean;
  /** Integration / channel provenance */
  source: OrderSource;
  integrationName?: string;
  externalRef?: string;
  shipmentConversion: OrderShipmentConversion;
  shipmentId?: string;
};

export type OrderDetail = OrderSummary & {
  sender: OrderParty;
  recipient: OrderParty;
  pickup: OrderAddress;
  delivery: OrderAddress;
  cargo: OrderCargoLine[];
  quoteReference?: string;
  quoteAmount?: Money;
  paymentStatus: "unpaid" | "partial" | "paid" | "refunded";
  paymentMethod?: string;
  provider: OrderProvider;
  location?: OrderLocation;
  timeline: TimelineEvent[];
  tracking: OrderTrackingEvent[];
  documents: OrderDocument[];
  messages: OrderMessage[];
  issues: OrderIssue[];
  deliveryProof?: OrderDeliveryProof;
  cancelReason?: string;
};

export type OrderNotification = {
  id: string;
  orderId: string;
  titleKey: string;
  bodyKey: string;
  createdAt: string;
  read: boolean;
  severity: "info" | "warning" | "error";
};

export type OrderSortField =
  | "updatedAt"
  | "createdAt"
  | "total"
  | "status"
  | "reference";

export type SavedOrderView = {
  id: string;
  name: string;
  listView: OrderListView;
  serviceType?: ServiceType | "all";
  search?: string;
  sort: OrderSortField;
  sortDir: "asc" | "desc";
  columns: string[];
};

export type OrderListParams = {
  view?: OrderListView;
  search?: string;
  serviceType?: ServiceType | "all";
  serviceTypes?: ServiceType[];
  statuses?: OrderLifecycleStatus[];
  providers?: string[];
  cities?: string[];
  dateFrom?: string;
  dateTo?: string;
  criticalOnly?: boolean;
  sort?: OrderSortField;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type OrderListResult = {
  items: OrderSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type ReportIssueInput = {
  orderId: string;
  category: OrderIssueCategory;
  description: string;
  severity?: "warning" | "critical";
};

export type CancelOrderInput = {
  orderId: string;
  reason: string;
};
