import type { OperationsRepository } from "@/lib/api/operations-repository";
import { QUEUE_STATUS_MAP } from "@/lib/api/operations-repository";
import type {
  AssignPartnerInput,
  AssignVehicleInput,
  BulkAssignInput,
  ChangeServiceTypeInput,
  ChangeStatusInput,
  CreateManualQuoteInput,
  OpsListParams,
  OpsRequestDetail,
  OpsRequestSummary,
  RequestMissingInfoInput,
  UploadDocumentInput,
} from "@/types/operations";
import {
  MOCK_OPS_FINANCE,
  MOCK_OPS_METRICS,
  MOCK_OPS_PARTNERS,
  MOCK_OPS_REQUESTS,
  MOCK_OPS_STAFF,
  MOCK_PRICE_LISTS,
} from "@/mocks/data/operations";
import { paginate, withMockLatency } from "@/mocks/repositories/helpers";

let idSeq = 9000;
function nextId(prefix: string) {
  idSeq += 1;
  return `${prefix}_${idSeq}`;
}

function toSummary(r: OpsRequestDetail): OpsRequestSummary {
  return {
    id: r.id,
    reference: r.reference,
    serviceType: r.serviceType,
    status: r.status,
    channel: r.channel,
    customerName: r.customerName,
    organizationName: r.organizationName,
    originCity: r.originCity,
    destinationCity: r.destinationCity,
    priority: r.priority,
    assigneeName: r.assigneeName,
    assigneeId: r.assigneeId,
    slaState: r.slaState,
    slaDueAt: r.slaDueAt,
    delayed: r.delayed,
    hasIssue: r.hasIssue,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    amount: r.amount,
  };
}

function matchesView(r: OpsRequestDetail, view?: OpsListParams["view"]) {
  if (!view || view === "summary" || view === "partners" || view === "price_lists" || view === "finance" || view === "documents" || view === "reports") {
    return true;
  }
  const statuses = QUEUE_STATUS_MAP[view];
  if (statuses === "all") return true;
  return statuses.includes(r.status);
}

export class MockOperationsRepository implements OperationsRepository {
  private requests = structuredClone(MOCK_OPS_REQUESTS);
  private partners = structuredClone(MOCK_OPS_PARTNERS);

  async getMetrics() {
    return withMockLatency(structuredClone(MOCK_OPS_METRICS));
  }

  async getFinance() {
    return withMockLatency(structuredClone(MOCK_OPS_FINANCE));
  }

  async listStaff() {
    return withMockLatency([...MOCK_OPS_STAFF]);
  }

  async listPartners() {
    return withMockLatency(structuredClone(this.partners));
  }

  async listPriceLists() {
    return withMockLatency(structuredClone(MOCK_PRICE_LISTS));
  }

  async listRequests(params: OpsListParams = {}) {
    let items = this.requests.filter((r) => matchesView(r, params.view));
    if (params.search) {
      const q = params.search.toLocaleLowerCase("tr-TR");
      items = items.filter((r) =>
        [r.reference, r.customerName, r.organizationName ?? "", r.originCity, r.destinationCity]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(q),
      );
    }
    if (params.priority && params.priority !== "all") {
      items = items.filter((r) => r.priority === params.priority);
    }
    if (params.assigneeId && params.assigneeId !== "all") {
      items = items.filter((r) => r.assigneeId === params.assigneeId);
    }
    const sort = params.sort ?? "updatedAt";
    const dir = params.sortDir === "asc" ? 1 : -1;
    const priorityRank = { critical: 4, high: 3, normal: 2, low: 1 };
    items = [...items].sort((a, b) => {
      if (sort === "priority") {
        return (priorityRank[a.priority] - priorityRank[b.priority]) * dir;
      }
      return String(a[sort] ?? "").localeCompare(String(b[sort] ?? "")) * dir;
    });
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.max(1, params.pageSize ?? 20);
    const sliced = paginate(items.map(toSummary), page, pageSize);
    return withMockLatency(sliced);
  }

  async getRequest(id: string) {
    return withMockLatency(this.requests.find((r) => r.id === id) ?? null);
  }

  private require(id: string) {
    const r = this.requests.find((x) => x.id === id);
    if (!r) throw new Error("Talep bulunamadı");
    return r;
  }

  private audit(
    r: OpsRequestDetail,
    action: string,
    reason: string,
    before?: string,
    after?: string,
    critical?: boolean,
  ) {
    r.audit.unshift({
      id: nextId("aud"),
      at: new Date().toISOString(),
      actorName: "Ops Kullanıcı",
      action,
      reason,
      before,
      after,
      critical,
    });
    r.updatedAt = new Date().toISOString();
  }

  async createManualQuote(input: CreateManualQuoteInput) {
    const r = this.require(input.requestId);
    const subtotal = input.lines.reduce((s, l) => s + l.amount.amount, 0);
    const tax = Math.round(subtotal * input.taxRate) / 100;
    const margin = subtotal - input.partnerCost.amount;
    const before = r.quote ? String(r.quote.total.amount) : "—";
    const total = subtotal + tax;
    r.quote = {
      lines: input.lines,
      partnerCost: input.partnerCost,
      margin: { amount: margin, currency: "TRY" },
      tax: { amount: tax, currency: "TRY" },
      total: { amount: total, currency: "TRY" },
      validUntil: new Date(
        Date.now() + input.validHours * 3600 * 1000,
      ).toISOString(),
      notes: input.reason,
    };
    r.amount = r.quote.total;
    r.status = "awaiting_approval";
    this.audit(
      r,
      "Manuel teklif oluşturuldu",
      input.reason,
      before,
      String(total),
      true,
    );
    return withMockLatency(structuredClone(r), 400);
  }

  async assignPartner(input: AssignPartnerInput) {
    const r = this.require(input.requestId);
    const partner = this.partners.find((p) => p.id === input.partnerId);
    if (!partner) throw new Error("Partner bulunamadı");
    const before = r.partnerName ?? "—";
    r.partnerId = partner.id;
    r.partnerName = partner.name;
    this.audit(r, "Partner atandı", input.reason, before, partner.name, true);
    return withMockLatency(structuredClone(r), 300);
  }

  async assignVehicle(input: AssignVehicleInput) {
    const r = this.require(input.requestId);
    const before = r.assignment?.vehicleLabel ?? "—";
    r.assignment = input.assignment;
    if (r.status === "awaiting_payment" || r.status === "awaiting_approval") {
      r.status = "active";
    }
    this.audit(
      r,
      "Araç/sürücü atandı",
      input.reason,
      before,
      input.assignment.vehicleLabel,
    );
    return withMockLatency(structuredClone(r), 300);
  }

  async changeStatus(input: ChangeStatusInput) {
    const r = this.require(input.requestId);
    const before = r.status;
    r.status = input.status;
    r.delayed = input.status === "delayed";
    r.hasIssue = input.status === "problematic" || r.hasIssue;
    this.audit(r, "Durum değiştirildi", input.reason, before, input.status, true);
    return withMockLatency(structuredClone(r), 300);
  }

  async requestMissingInfo(input: RequestMissingInfoInput) {
    const r = this.require(input.requestId);
    r.missingFields = input.fields;
    r.status = "missing_info";
    r.opsNotes = [r.opsNotes, input.message].filter(Boolean).join("\n");
    this.audit(r, "Eksik bilgi istendi", input.reason, undefined, input.fields.join(", "));
    return withMockLatency(structuredClone(r), 300);
  }

  async changeServiceType(input: ChangeServiceTypeInput) {
    const r = this.require(input.requestId);
    const before = r.serviceType;
    r.serviceType = input.serviceType;
    this.audit(r, "Hizmet türü değişti", input.reason, before, input.serviceType, true);
    return withMockLatency(structuredClone(r), 300);
  }

  async uploadDocument(input: UploadDocumentInput) {
    const r = this.require(input.requestId);
    r.documents.unshift({
      id: nextId("doc"),
      name: input.name,
      type: input.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Ops Kullanıcı",
    });
    this.audit(r, "Belge yüklendi", input.name);
    return withMockLatency(structuredClone(r), 250);
  }

  async addOpsNote(requestId: string, note: string, reason: string) {
    const r = this.require(requestId);
    r.opsNotes = [r.opsNotes, note].filter(Boolean).join("\n");
    this.audit(r, "Operasyon notu eklendi", reason);
    return withMockLatency(structuredClone(r), 200);
  }

  async bulkAssign(input: BulkAssignInput) {
    let count = 0;
    for (const id of input.requestIds) {
      const r = this.requests.find((x) => x.id === id);
      if (!r) continue;
      r.assigneeId = input.assigneeId;
      r.assigneeName = input.assigneeName;
      this.audit(r, "Toplu atama", input.reason);
      count += 1;
    }
    return withMockLatency(count, 350);
  }

  async resolveException(requestId: string, resolution: string, reason: string) {
    const r = this.require(requestId);
    r.exceptionNote = resolution;
    r.hasIssue = false;
    if (r.status === "problematic" || r.status === "delayed") {
      r.status = "active";
      r.delayed = false;
      r.slaState = "ok";
    }
    this.audit(r, "İstisna çözüldü", reason, undefined, resolution, true);
    return withMockLatency(structuredClone(r), 300);
  }

  _reset() {
    this.requests = structuredClone(MOCK_OPS_REQUESTS);
    this.partners = structuredClone(MOCK_OPS_PARTNERS);
  }
}

export const mockOperationsRepository = new MockOperationsRepository();
