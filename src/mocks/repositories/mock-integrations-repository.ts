import type {
  ApplyExcelMappingInput,
  ConnectIntegrationInput,
  FixExcelRowInput,
  IntegrationsRepository,
  StartExcelImportInput,
} from "@/lib/api/integrations-repository";
import type {
  CarrierSelectionRule,
  ExcelColumnKey,
  ExcelColumnMapping,
  ExcelImportJob,
  ExcelRowValidation,
  FavoriteAddress,
  IntegrationConnection,
  IntegrationDetail,
  IntegrationProvider,
  PackagePreset,
  ShipmentTemplate,
} from "@/types/integrations";
import {
  MOCK_CARRIER_RULES,
  MOCK_CONNECTIONS,
  MOCK_FAVORITE_ADDRESSES,
  MOCK_IMPORT_HISTORY,
  MOCK_PACKAGE_PRESETS,
  MOCK_PROVIDERS,
  MOCK_TEMPLATES,
  createMockSheets,
} from "@/mocks/data/integrations";
import { withMockLatency } from "@/mocks/repositories/helpers";

let idSeq = 5000;
function nextId(prefix: string) {
  idSeq += 1;
  return `${prefix}_${idSeq}`;
}

const DEFAULT_MAPPING: ExcelColumnMapping = {
  "Alıcı Adı": "recipientName",
  Telefon: "recipientPhone",
  Adres: "address",
  İlçe: "district",
  İl: "city",
  Desi: "desi",
  Kg: "weightKg",
  Referans: "reference",
  Not: "notes",
};

function validateRows(
  headers: string[],
  previewRows: string[][],
  mapping: ExcelColumnMapping,
): ExcelRowValidation[] {
  return previewRows.map((cells, index) => {
    const values: Record<string, string> = {};
    headers.forEach((h, i) => {
      const key = mapping[h] ?? "ignore";
      if (key !== "ignore") values[key] = cells[i] ?? "";
    });
    const errors: string[] = [];
    if (!values.recipientName?.trim()) errors.push("recipientName");
    if (!values.city?.trim()) errors.push("city");
    if (!values.address?.trim()) errors.push("address");
    const desi = Number(values.desi);
    if (values.desi && (Number.isNaN(desi) || desi <= 0)) errors.push("desi");
    return { rowIndex: index + 2, values, errors };
  });
}

export class MockIntegrationsRepository implements IntegrationsRepository {
  private providers = structuredClone(MOCK_PROVIDERS);
  private connections = structuredClone(MOCK_CONNECTIONS);
  private jobs = structuredClone(MOCK_IMPORT_HISTORY);
  private templates = structuredClone(MOCK_TEMPLATES);
  private addresses = structuredClone(MOCK_FAVORITE_ADDRESSES);
  private presets = structuredClone(MOCK_PACKAGE_PRESETS);
  private rules = structuredClone(MOCK_CARRIER_RULES);
  private sheetsByJob = new Map<string, ReturnType<typeof createMockSheets>>();

  async listProviders(): Promise<IntegrationProvider[]> {
    return withMockLatency(structuredClone(this.providers));
  }

  async listConnections(): Promise<IntegrationConnection[]> {
    return withMockLatency(structuredClone(this.connections));
  }

  async getDetail(providerId: string): Promise<IntegrationDetail | null> {
    const provider = this.providers.find((p) => p.id === providerId);
    if (!provider) return null;
    const connection = this.connections.find((c) => c.providerId === providerId);
    return withMockLatency({
      ...provider,
      connection: connection ? structuredClone(connection) : undefined,
      capabilities: [
        "orders.sync",
        "webhooks",
        "label.print",
        "tracking.push",
      ],
      setupSteps: ["authorize", "selectStore", "mapFields", "enableSync"],
    });
  }

  async connect(input: ConnectIntegrationInput): Promise<IntegrationConnection> {
    const existing = this.connections.find((c) => c.providerId === input.providerId);
    if (existing) {
      existing.status = "connected";
      existing.connectedAt = new Date().toISOString();
      existing.lastSyncAt = new Date().toISOString();
      existing.errorMessage = undefined;
      existing.storeName = input.storeName ?? existing.storeName;
      return withMockLatency(structuredClone(existing), 400);
    }
    const conn: IntegrationConnection = {
      id: nextId("conn"),
      providerId: input.providerId,
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      storeName: input.storeName ?? "Demo Mağaza",
      syncOrders: true,
      syncProducts: false,
      syncInventory: false,
    };
    this.connections.push(conn);
    return withMockLatency(structuredClone(conn), 400);
  }

  async disconnect(connectionId: string): Promise<void> {
    this.connections = this.connections.filter((c) => c.id !== connectionId);
    await withMockLatency(undefined, 200);
  }

  async retrySync(connectionId: string): Promise<IntegrationConnection> {
    const conn = this.connections.find((c) => c.id === connectionId);
    if (!conn) throw new Error("Bağlantı bulunamadı");
    conn.status = "syncing";
    await withMockLatency(undefined, 300);
    conn.status = "connected";
    conn.lastSyncAt = new Date().toISOString();
    conn.errorMessage = undefined;
    return structuredClone(conn);
  }

  async disable(connectionId: string): Promise<IntegrationConnection> {
    const conn = this.connections.find((c) => c.id === connectionId);
    if (!conn) throw new Error("Bağlantı bulunamadı");
    conn.status = "disabled";
    return withMockLatency(structuredClone(conn), 200);
  }

  async listImportHistory(): Promise<ExcelImportJob[]> {
    return withMockLatency(
      structuredClone(this.jobs).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    );
  }

  async getImportJob(id: string): Promise<ExcelImportJob | null> {
    return withMockLatency(this.jobs.find((j) => j.id === id) ?? null);
  }

  async startExcelImport(input: StartExcelImportInput): Promise<ExcelImportJob> {
    const sheets = createMockSheets(input.fileName);
    const job: ExcelImportJob = {
      id: nextId("xls"),
      fileName: input.fileName,
      sheetName: sheets[0].name,
      status: "draft",
      createdAt: new Date().toISOString(),
      totalRows: sheets[0].rowCount,
      validRows: 0,
      errorRows: 0,
      importedCount: 0,
      quotesRequested: 0,
      mapping: { ...DEFAULT_MAPPING },
      rows: [],
    };
    this.jobs.unshift(job);
    this.sheetsByJob.set(job.id, sheets);
    return withMockLatency(structuredClone(job), 350);
  }

  async listSheets(jobId: string) {
    const sheets = this.sheetsByJob.get(jobId) ?? createMockSheets("import.xlsx");
    this.sheetsByJob.set(jobId, sheets);
    return withMockLatency(
      sheets.map((s) => ({
        name: s.name,
        rowCount: s.rowCount,
        headers: s.headers,
      })),
    );
  }

  async applyMapping(input: ApplyExcelMappingInput): Promise<ExcelImportJob> {
    const job = this.jobs.find((j) => j.id === input.jobId);
    if (!job) throw new Error("İş bulunamadı");
    const sheets = this.sheetsByJob.get(job.id) ?? createMockSheets(job.fileName);
    const sheet = sheets.find((s) => s.name === input.sheetName) ?? sheets[0];
    job.sheetName = sheet.name;
    job.mapping = input.mapping;
    job.rows = validateRows(sheet.headers, sheet.previewRows, input.mapping);
    job.totalRows = sheet.rowCount;
    job.validRows = job.rows.filter((r) => r.errors.length === 0).length;
    job.errorRows = job.rows.filter((r) => r.errors.length > 0).length;
    job.status = "validated";
    return withMockLatency(structuredClone(job), 400);
  }

  async fixRow(input: FixExcelRowInput): Promise<ExcelImportJob> {
    const job = this.jobs.find((j) => j.id === input.jobId);
    if (!job) throw new Error("İş bulunamadı");
    const row = job.rows.find((r) => r.rowIndex === input.rowIndex);
    if (!row) throw new Error("Satır bulunamadı");
    row.values = { ...row.values, ...input.values };
    row.errors = [];
    if (!row.values.recipientName?.trim()) row.errors.push("recipientName");
    if (!row.values.city?.trim()) row.errors.push("city");
    if (!row.values.address?.trim()) row.errors.push("address");
    row.fixed = row.errors.length === 0;
    job.validRows = job.rows.filter((r) => r.errors.length === 0).length;
    job.errorRows = job.rows.filter((r) => r.errors.length > 0).length;
    return withMockLatency(structuredClone(job), 200);
  }

  async importValidRows(jobId: string): Promise<ExcelImportJob> {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error("İş bulunamadı");
    job.status = "importing";
    await withMockLatency(undefined, 400);
    job.importedCount = job.rows.filter((r) => r.errors.length === 0).length;
    job.status = "completed";
    job.completedAt = new Date().toISOString();
    job.reportSummary = `${job.importedCount} kayıt içe aktarıldı, ${job.errorRows} satır atlandı.`;
    return structuredClone(job);
  }

  async requestBulkQuotes(jobId: string): Promise<ExcelImportJob> {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error("İş bulunamadı");
    job.quotesRequested = job.importedCount || job.validRows;
    job.reportSummary = `${job.quotesRequested} kayıt için toplu teklif istendi. ${job.reportSummary ?? ""}`;
    return withMockLatency(structuredClone(job), 350);
  }

  async listTemplates(): Promise<ShipmentTemplate[]> {
    return withMockLatency(structuredClone(this.templates));
  }

  async saveTemplate(
    template: Omit<ShipmentTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<ShipmentTemplate> {
    const saved: ShipmentTemplate = {
      ...template,
      id: nextId("tpl"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.unshift(saved);
    return withMockLatency(saved, 250);
  }

  async deleteTemplate(id: string): Promise<void> {
    this.templates = this.templates.filter((t) => t.id !== id);
    await withMockLatency(undefined, 150);
  }

  async listFavoriteAddresses(): Promise<FavoriteAddress[]> {
    return withMockLatency(structuredClone(this.addresses));
  }

  async listPackagePresets(): Promise<PackagePreset[]> {
    return withMockLatency(structuredClone(this.presets));
  }

  async listCarrierRules(): Promise<CarrierSelectionRule[]> {
    return withMockLatency(structuredClone(this.rules));
  }

  async copyPreviousShipment(orderId: string) {
    return withMockLatency(
      {
        draftId: nextId("draft"),
        label: `Kopya · ${orderId}`,
      },
      200,
    );
  }

  _reset() {
    this.providers = structuredClone(MOCK_PROVIDERS);
    this.connections = structuredClone(MOCK_CONNECTIONS);
    this.jobs = structuredClone(MOCK_IMPORT_HISTORY);
    this.templates = structuredClone(MOCK_TEMPLATES);
    this.addresses = structuredClone(MOCK_FAVORITE_ADDRESSES);
    this.presets = structuredClone(MOCK_PACKAGE_PRESETS);
    this.rules = structuredClone(MOCK_CARRIER_RULES);
    this.sheetsByJob.clear();
  }

  /** test helper */
  _suggestMapping(header: string): ExcelColumnKey {
    return DEFAULT_MAPPING[header] ?? "ignore";
  }
}

export const mockIntegrationsRepository = new MockIntegrationsRepository();
