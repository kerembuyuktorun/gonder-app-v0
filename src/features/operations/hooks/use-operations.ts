"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { operationsRepository } from "@/lib/api/client";
import type {
  AssignPartnerInput,
  AssignVehicleInput,
  BulkAssignInput,
  ChangeServiceTypeInput,
  ChangeStatusInput,
  CreateManualQuoteInput,
  OpsListParams,
  RequestMissingInfoInput,
  UploadDocumentInput,
} from "@/types/operations";

export const opsKeys = {
  metrics: ["ops", "metrics"] as const,
  finance: ["ops", "finance"] as const,
  list: (params: OpsListParams) => ["ops", "list", params] as const,
  detail: (id: string) => ["ops", "detail", id] as const,
  partners: ["ops", "partners"] as const,
  priceLists: ["ops", "priceLists"] as const,
  staff: ["ops", "staff"] as const,
};

export function useOpsMetricsQuery() {
  return useQuery({
    queryKey: opsKeys.metrics,
    queryFn: () => operationsRepository.getMetrics(),
  });
}

export function useOpsFinanceQuery() {
  return useQuery({
    queryKey: opsKeys.finance,
    queryFn: () => operationsRepository.getFinance(),
  });
}

export function useOpsRequestsQuery(params: OpsListParams) {
  return useQuery({
    queryKey: opsKeys.list(params),
    queryFn: () => operationsRepository.listRequests(params),
  });
}

export function useOpsRequestQuery(id: string | null) {
  return useQuery({
    queryKey: opsKeys.detail(id ?? ""),
    queryFn: () => operationsRepository.getRequest(id!),
    enabled: Boolean(id),
  });
}

export function useOpsPartnersQuery() {
  return useQuery({
    queryKey: opsKeys.partners,
    queryFn: () => operationsRepository.listPartners(),
  });
}

export function useOpsPriceListsQuery() {
  return useQuery({
    queryKey: opsKeys.priceLists,
    queryFn: () => operationsRepository.listPriceLists(),
  });
}

export function useOpsStaffQuery() {
  return useQuery({
    queryKey: opsKeys.staff,
    queryFn: () => operationsRepository.listStaff(),
  });
}

function invalidateOps(qc: ReturnType<typeof useQueryClient>, id?: string) {
  void qc.invalidateQueries({ queryKey: ["ops"] });
  if (id) void qc.invalidateQueries({ queryKey: opsKeys.detail(id) });
}

export function useCreateManualQuoteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateManualQuoteInput) =>
      operationsRepository.createManualQuote(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useAssignPartnerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AssignPartnerInput) =>
      operationsRepository.assignPartner(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useAssignVehicleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AssignVehicleInput) =>
      operationsRepository.assignVehicle(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useChangeStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangeStatusInput) =>
      operationsRepository.changeStatus(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useRequestMissingInfoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RequestMissingInfoInput) =>
      operationsRepository.requestMissingInfo(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useChangeServiceTypeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangeServiceTypeInput) =>
      operationsRepository.changeServiceType(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useUploadOpsDocumentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadDocumentInput) =>
      operationsRepository.uploadDocument(input),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}

export function useBulkAssignMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BulkAssignInput) =>
      operationsRepository.bulkAssign(input),
    onSuccess: () => invalidateOps(qc),
  });
}

export function useResolveExceptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      resolution,
      reason,
    }: {
      requestId: string;
      resolution: string;
      reason: string;
    }) => operationsRepository.resolveException(requestId, resolution, reason),
    onSuccess: (r) => invalidateOps(qc, r.id),
  });
}
