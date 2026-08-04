import type { Money, ServiceType, ShipmentStatus, QuoteStatus } from "@/types/domain";

export type IntegrationConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "pending";

export type DashboardShipmentItem = {
  id: string;
  trackingNumber: string;
  serviceType: ServiceType;
  status: ShipmentStatus;
  originCity: string;
  destinationCity: string;
  updatedAt: string;
  total?: Money;
};

export type DashboardQuoteItem = {
  id: string;
  reference: string;
  serviceType: ServiceType;
  status: QuoteStatus;
  originCity: string;
  destinationCity: string;
  total: Money;
  validUntil: string;
};

export type DashboardPaymentItem = {
  id: string;
  reference: string;
  serviceType: ServiceType;
  amount: Money;
  dueAt: string;
};

export type DashboardIntegrationItem = {
  id: string;
  nameKey: string;
  status: IntegrationConnectionStatus;
  lastSyncedAt?: string;
};

export type DashboardUsageSummary = {
  periodLabelKey: string;
  shipmentCount: number;
  spend: Money;
  quoteCount: number;
  avgCost: Money;
};

export type DashboardServiceCard = {
  id: string;
  serviceType: ServiceType;
  nameKey: string;
  descriptionKey: string;
  helpKey?: string;
  href: string;
};

export type DashboardQuickAction = {
  id: string;
  labelKey: string;
  href: string;
  icon:
    | "plus"
    | "sparkles"
    | "upload"
    | "copy"
    | "quotes"
    | "track"
    | "plug";
};

export type DashboardSnapshot = {
  greetingName: string;
  contextLabel: string;
  activeShipments: DashboardShipmentItem[];
  pendingQuoteRequests: DashboardQuoteItem[];
  awaitingUserApproval: DashboardQuoteItem[];
  awaitingPayment: DashboardPaymentItem[];
  recentlyCompleted: DashboardShipmentItem[];
  integrations: DashboardIntegrationItem[];
  usage: DashboardUsageSummary;
  services: DashboardServiceCard[];
  quickActions: DashboardQuickAction[];
};
