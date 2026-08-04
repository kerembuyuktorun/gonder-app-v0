export type Locale = "tr" | "en";

export type ServiceType =
  | "courier"
  | "parcel_1_30"
  | "gonder_xl"
  | "ftl"
  | "ltl"
  | "spot";

export type ChannelType = "b2b" | "b2c" | "ops";

export type ShipmentStatus =
  | "draft"
  | "quoted"
  | "confirmed"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

export type QuoteStatus =
  | "pending"
  | "ready"
  | "accepted"
  | "expired"
  | "rejected";

export type StatusTone = "success" | "warning" | "error" | "info" | "neutral";

export type Money = {
  amount: number;
  currency: string;
};

export type Address = {
  id: string;
  label?: string;
  contactName: string;
  phone?: string;
  line1: string;
  line2?: string;
  district?: string;
  city: string;
  postalCode?: string;
  country: string;
};

export type PriceLine = {
  id: string;
  labelKey: string;
  amount: Money;
};

export type PriceSummaryModel = {
  lines: PriceLine[];
  tax?: Money;
  discount?: Money;
  total: Money;
};

export type ServiceCatalogItem = {
  id: string;
  type: ServiceType;
  nameKey: string;
  descriptionKey: string;
  etaKey: string;
  channels: ChannelType[];
};

export type QuoteSummary = {
  id: string;
  reference: string;
  serviceType: ServiceType;
  status: QuoteStatus;
  channel: ChannelType;
  originCity: string;
  destinationCity: string;
  total: Money;
  createdAt: string;
  validUntil: string;
};

export type ShipmentSummary = {
  id: string;
  trackingNumber: string;
  serviceType: ServiceType;
  status: ShipmentStatus;
  channel: ChannelType;
  originCity: string;
  destinationCity: string;
  total: Money;
  createdAt: string;
  estimatedDeliveryAt?: string;
};

export type TimelineEvent = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  occurredAt: string;
  tone?: StatusTone;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
