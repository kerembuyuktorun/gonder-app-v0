import type {
  CarrierSelectionRule,
  ExcelColumnMapping,
  ExcelImportJob,
  FavoriteAddress,
  IntegrationConnection,
  IntegrationDetail,
  IntegrationProvider,
  PackagePreset,
  ShipmentTemplate,
} from "@/types/integrations";

export type StartExcelImportInput = {
  fileName: string;
};

export type ApplyExcelMappingInput = {
  jobId: string;
  sheetName: string;
  mapping: ExcelColumnMapping;
};

export type FixExcelRowInput = {
  jobId: string;
  rowIndex: number;
  values: Record<string, string>;
};

export type ConnectIntegrationInput = {
  providerId: string;
  storeName?: string;
};

export interface IntegrationsRepository {
  listProviders(): Promise<IntegrationProvider[]>;
  listConnections(): Promise<IntegrationConnection[]>;
  getDetail(providerId: string): Promise<IntegrationDetail | null>;
  connect(input: ConnectIntegrationInput): Promise<IntegrationConnection>;
  disconnect(connectionId: string): Promise<void>;
  retrySync(connectionId: string): Promise<IntegrationConnection>;
  disable(connectionId: string): Promise<IntegrationConnection>;

  listImportHistory(): Promise<ExcelImportJob[]>;
  getImportJob(id: string): Promise<ExcelImportJob | null>;
  startExcelImport(input: StartExcelImportInput): Promise<ExcelImportJob>;
  listSheets(
    jobId: string,
  ): Promise<{ name: string; rowCount: number; headers: string[] }[]>;
  applyMapping(input: ApplyExcelMappingInput): Promise<ExcelImportJob>;
  fixRow(input: FixExcelRowInput): Promise<ExcelImportJob>;
  importValidRows(jobId: string): Promise<ExcelImportJob>;
  requestBulkQuotes(jobId: string): Promise<ExcelImportJob>;

  listTemplates(): Promise<ShipmentTemplate[]>;
  saveTemplate(
    template: Omit<ShipmentTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<ShipmentTemplate>;
  deleteTemplate(id: string): Promise<void>;
  listFavoriteAddresses(): Promise<FavoriteAddress[]>;
  listPackagePresets(): Promise<PackagePreset[]>;
  listCarrierRules(): Promise<CarrierSelectionRule[]>;
  copyPreviousShipment(
    orderId: string,
  ): Promise<{ draftId: string; label: string }>;
}
