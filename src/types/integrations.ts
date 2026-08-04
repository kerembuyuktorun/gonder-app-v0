import type { ServiceType } from "@/types/domain";

export type IntegrationCategory =
  | "ecommerce"
  | "marketplace"
  | "erp"
  | "wms"
  | "accounting"
  | "einvoice"
  | "carrier"
  | "api"
  | "webhook"
  | "messaging";

export type IntegrationStatus =
  | "connected"
  | "setup_pending"
  | "syncing"
  | "auth_expired"
  | "sync_error"
  | "disabled";

export type IntegrationProvider = {
  id: string;
  slug: string;
  name: string;
  category: IntegrationCategory;
  descriptionKey: string;
  website?: string;
  popular?: boolean;
};

export type IntegrationConnection = {
  id: string;
  providerId: string;
  status: IntegrationStatus;
  connectedAt?: string;
  lastSyncAt?: string;
  errorMessage?: string;
  storeName?: string;
  syncOrders: boolean;
  syncProducts: boolean;
  syncInventory: boolean;
};

export type IntegrationDetail = IntegrationProvider & {
  connection?: IntegrationConnection;
  capabilities: string[];
  setupSteps: string[];
};

export type ExcelColumnKey =
  | "recipientName"
  | "recipientPhone"
  | "address"
  | "district"
  | "city"
  | "desi"
  | "weightKg"
  | "reference"
  | "notes"
  | "ignore";

export type ExcelSheet = {
  name: string;
  rowCount: number;
  headers: string[];
  previewRows: string[][];
};

export type ExcelColumnMapping = Record<string, ExcelColumnKey>;

export type ExcelRowValidation = {
  rowIndex: number;
  values: Record<string, string>;
  errors: string[];
  fixed?: boolean;
};

export type ExcelImportJobStatus =
  | "draft"
  | "validated"
  | "importing"
  | "completed"
  | "failed";

export type ExcelImportJob = {
  id: string;
  fileName: string;
  sheetName: string;
  status: ExcelImportJobStatus;
  createdAt: string;
  completedAt?: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  importedCount: number;
  quotesRequested: number;
  mapping: ExcelColumnMapping;
  rows: ExcelRowValidation[];
  reportSummary?: string;
};

export type ShipmentTemplate = {
  id: string;
  name: string;
  serviceType: ServiceType;
  originLabel: string;
  destinationLabel: string;
  defaultDesi?: number;
  defaultWeightKg?: number;
  carrierRule?: string;
  favoriteAddressId?: string;
  createdAt: string;
  updatedAt: string;
};

export type FavoriteAddress = {
  id: string;
  label: string;
  contactName: string;
  phone?: string;
  line1: string;
  district: string;
  city: string;
  isDefault?: boolean;
};

export type PackagePreset = {
  id: string;
  name: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  isDefault?: boolean;
};

export type CarrierSelectionRule = {
  id: string;
  name: string;
  preferCheapest: boolean;
  maxEtaDays?: number;
  preferredCarrier?: string;
  serviceType: ServiceType | "all";
};
