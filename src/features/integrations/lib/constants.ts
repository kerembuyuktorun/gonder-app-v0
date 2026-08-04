import type { IntegrationCategory, IntegrationStatus } from "@/types/integrations";
import type { StatusTone } from "@/types/domain";

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  "ecommerce",
  "marketplace",
  "erp",
  "wms",
  "accounting",
  "einvoice",
  "carrier",
  "api",
  "webhook",
  "messaging",
];

export const statusTone: Record<IntegrationStatus, StatusTone> = {
  connected: "success",
  setup_pending: "warning",
  syncing: "info",
  auth_expired: "error",
  sync_error: "error",
  disabled: "neutral",
};

export const EXCEL_COLUMN_KEYS = [
  "recipientName",
  "recipientPhone",
  "address",
  "district",
  "city",
  "desi",
  "weightKg",
  "reference",
  "notes",
  "ignore",
] as const;

export type IntegrationsTab = "marketplace" | "excel" | "templates";
