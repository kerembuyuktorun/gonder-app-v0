import type {
  AssignPartnerInput,
  AssignVehicleInput,
  BulkAssignInput,
  ChangeServiceTypeInput,
  ChangeStatusInput,
  CreateManualQuoteInput,
  OpsDashboardMetrics,
  OpsFinanceSummary,
  OpsListParams,
  OpsPartner,
  OpsPriceList,
  OpsQueueView,
  OpsRequestDetail,
  OpsRequestStatus,
  OpsRequestSummary,
  RequestMissingInfoInput,
  UploadDocumentInput,
} from "@/types/operations";

export interface OperationsRepository {
  getMetrics(): Promise<OpsDashboardMetrics>;
  getFinance(): Promise<OpsFinanceSummary>;
  listRequests(params: OpsListParams): Promise<{
    items: OpsRequestSummary[];
    total: number;
    page: number;
    pageSize: number;
  }>;
  getRequest(id: string): Promise<OpsRequestDetail | null>;
  listPartners(): Promise<OpsPartner[]>;
  listPriceLists(): Promise<OpsPriceList[]>;
  listStaff(): Promise<{ id: string; name: string }[]>;
  createManualQuote(input: CreateManualQuoteInput): Promise<OpsRequestDetail>;
  assignPartner(input: AssignPartnerInput): Promise<OpsRequestDetail>;
  assignVehicle(input: AssignVehicleInput): Promise<OpsRequestDetail>;
  changeStatus(input: ChangeStatusInput): Promise<OpsRequestDetail>;
  requestMissingInfo(input: RequestMissingInfoInput): Promise<OpsRequestDetail>;
  changeServiceType(input: ChangeServiceTypeInput): Promise<OpsRequestDetail>;
  uploadDocument(input: UploadDocumentInput): Promise<OpsRequestDetail>;
  addOpsNote(requestId: string, note: string, reason: string): Promise<OpsRequestDetail>;
  bulkAssign(input: BulkAssignInput): Promise<number>;
  resolveException(
    requestId: string,
    resolution: string,
    reason: string,
  ): Promise<OpsRequestDetail>;
}

export const QUEUE_STATUS_MAP: Record<
  Exclude<OpsQueueView, "summary" | "partners" | "price_lists" | "finance" | "documents" | "reports">,
  OpsRequestStatus[] | "all"
> = {
  new: ["new"],
  missing_info: ["missing_info"],
  quote_prep: ["quote_prep"],
  awaiting_approval: ["awaiting_approval"],
  awaiting_payment: ["awaiting_payment"],
  active: ["active"],
  delayed: ["delayed"],
  problematic: ["problematic"],
  completed: ["completed"],
};
