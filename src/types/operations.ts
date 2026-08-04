import type { Money, ServiceType, StatusTone } from "@/types/domain";
import type { ChannelType as DomainChannel } from "@/types/domain";

export type OpsQueueView =
  | "summary"
  | "new"
  | "missing_info"
  | "quote_prep"
  | "awaiting_approval"
  | "awaiting_payment"
  | "active"
  | "delayed"
  | "problematic"
  | "completed"
  | "partners"
  | "price_lists"
  | "finance"
  | "documents"
  | "reports";

export type OpsPriority = "low" | "normal" | "high" | "critical";

export type OpsRequestStatus =
  | "new"
  | "missing_info"
  | "quote_prep"
  | "awaiting_approval"
  | "awaiting_payment"
  | "active"
  | "delayed"
  | "problematic"
  | "completed"
  | "cancelled";

export type OpsChannel = "web" | "mobile" | "whatsapp" | "api" | "operator" | "excel";

export type SlaState = "ok" | "warning" | "breached";

export type OpsRequestSummary = {
  id: string;
  reference: string;
  serviceType: ServiceType;
  status: OpsRequestStatus;
  channel: OpsChannel;
  customerName: string;
  organizationName?: string;
  originCity: string;
  destinationCity: string;
  priority: OpsPriority;
  assigneeName?: string;
  assigneeId?: string;
  slaState: SlaState;
  slaDueAt?: string;
  delayed?: boolean;
  hasIssue?: boolean;
  createdAt: string;
  updatedAt: string;
  amount?: Money;
};

export type OpsPriceLine = {
  id: string;
  label: string;
  amount: Money;
};

export type OpsQuoteDraft = {
  lines: OpsPriceLine[];
  partnerCost: Money;
  margin: Money;
  tax: Money;
  total: Money;
  validUntil: string;
  notes?: string;
};

export type OpsPartner = {
  id: string;
  name: string;
  regions: string[];
  services: ServiceType[];
  saasStatus: "connected" | "pending" | "error" | "offline";
  performanceScore: number;
  activeOps: number;
  contractRef?: string;
};

export type OpsVehicleDriver = {
  vehicleId: string;
  vehicleLabel: string;
  driverName: string;
  driverPhone: string;
};

export type OpsAuditEntry = {
  id: string;
  at: string;
  actorName: string;
  action: string;
  reason?: string;
  before?: string;
  after?: string;
  critical?: boolean;
};

export type OpsDocument = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type OpsRequestDetail = OpsRequestSummary & {
  customerEmail?: string;
  customerPhone?: string;
  extractedFields: Record<string, string>;
  missingFields: string[];
  quote?: OpsQuoteDraft;
  partnerId?: string;
  partnerName?: string;
  assignment?: OpsVehicleDriver;
  opsNotes: string;
  documents: OpsDocument[];
  audit: OpsAuditEntry[];
  exceptionNote?: string;
};

export type OpsDashboardMetrics = {
  newRequests: number;
  firstQuoteMinutesAvg: number;
  pendingQuotes: number;
  activeShipments: number;
  delayedShipments: number;
  problematicOrders: number;
  dailyVolume: Money;
  estimatedGrossProfit: Money;
};

export type OpsFinanceSummary = {
  receivables: Money;
  payables: Money;
  marginToday: Money;
  unpaidCount: number;
  refundsPending: number;
};

export type OpsPriceList = {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  serviceType: ServiceType;
  validFrom: string;
  validTo?: string;
};

export type OpsListParams = {
  view?: OpsQueueView;
  search?: string;
  priority?: OpsPriority | "all";
  assigneeId?: string | "all";
  sort?: "updatedAt" | "createdAt" | "priority" | "slaDueAt";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type ManualChangeInput = {
  requestId: string;
  reason: string;
};

export type CreateManualQuoteInput = ManualChangeInput & {
  lines: OpsPriceLine[];
  partnerCost: Money;
  taxRate: number;
  validHours: number;
};

export type AssignPartnerInput = ManualChangeInput & {
  partnerId: string;
};

export type AssignVehicleInput = ManualChangeInput & {
  assignment: OpsVehicleDriver;
};

export type ChangeStatusInput = ManualChangeInput & {
  status: OpsRequestStatus;
};

export type RequestMissingInfoInput = ManualChangeInput & {
  fields: string[];
  message: string;
};

export type ChangeServiceTypeInput = ManualChangeInput & {
  serviceType: ServiceType;
};

export type UploadDocumentInput = {
  requestId: string;
  name: string;
  type: string;
};

export type BulkAssignInput = {
  requestIds: string[];
  assigneeId: string;
  assigneeName: string;
  reason: string;
};

export type OpsTone = StatusTone;
export type OpsDomainChannel = DomainChannel;
