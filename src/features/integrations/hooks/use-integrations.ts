"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { integrationsRepository } from "@/lib/api/client";
import type {
  ApplyExcelMappingInput,
  ConnectIntegrationInput,
  FixExcelRowInput,
} from "@/lib/api/integrations-repository";
import type { ShipmentTemplate } from "@/types/integrations";

export const integrationKeys = {
  providers: ["integrations", "providers"] as const,
  connections: ["integrations", "connections"] as const,
  detail: (id: string) => ["integrations", "detail", id] as const,
  imports: ["integrations", "imports"] as const,
  importJob: (id: string) => ["integrations", "import", id] as const,
  sheets: (id: string) => ["integrations", "sheets", id] as const,
  templates: ["integrations", "templates"] as const,
  addresses: ["integrations", "addresses"] as const,
  presets: ["integrations", "presets"] as const,
  rules: ["integrations", "rules"] as const,
};

export function useIntegrationProvidersQuery() {
  return useQuery({
    queryKey: integrationKeys.providers,
    queryFn: () => integrationsRepository.listProviders(),
  });
}

export function useIntegrationConnectionsQuery() {
  return useQuery({
    queryKey: integrationKeys.connections,
    queryFn: () => integrationsRepository.listConnections(),
  });
}

export function useIntegrationDetailQuery(id: string | null) {
  return useQuery({
    queryKey: integrationKeys.detail(id ?? ""),
    queryFn: () => integrationsRepository.getDetail(id!),
    enabled: Boolean(id),
  });
}

export function useConnectIntegrationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ConnectIntegrationInput) =>
      integrationsRepository.connect(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
}

export function useIntegrationActionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      action,
      connectionId,
    }: {
      action: "retry" | "disable" | "disconnect";
      connectionId: string;
    }) => {
      if (action === "retry") return integrationsRepository.retrySync(connectionId);
      if (action === "disable") return integrationsRepository.disable(connectionId);
      await integrationsRepository.disconnect(connectionId);
      return null;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
}

export function useImportHistoryQuery() {
  return useQuery({
    queryKey: integrationKeys.imports,
    queryFn: () => integrationsRepository.listImportHistory(),
  });
}

export function useImportJobQuery(id: string | null) {
  return useQuery({
    queryKey: integrationKeys.importJob(id ?? ""),
    queryFn: () => integrationsRepository.getImportJob(id!),
    enabled: Boolean(id),
  });
}

export function useImportSheetsQuery(jobId: string | null) {
  return useQuery({
    queryKey: integrationKeys.sheets(jobId ?? ""),
    queryFn: () => integrationsRepository.listSheets(jobId!),
    enabled: Boolean(jobId),
  });
}

export function useStartExcelImportMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileName: string) =>
      integrationsRepository.startExcelImport({ fileName }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: integrationKeys.imports });
    },
  });
}

export function useApplyExcelMappingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplyExcelMappingInput) =>
      integrationsRepository.applyMapping(input),
    onSuccess: (job) => {
      void qc.setQueryData(integrationKeys.importJob(job.id), job);
      void qc.invalidateQueries({ queryKey: integrationKeys.imports });
    },
  });
}

export function useFixExcelRowMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FixExcelRowInput) => integrationsRepository.fixRow(input),
    onSuccess: (job) => {
      void qc.setQueryData(integrationKeys.importJob(job.id), job);
    },
  });
}

export function useImportValidRowsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => integrationsRepository.importValidRows(jobId),
    onSuccess: (job) => {
      void qc.setQueryData(integrationKeys.importJob(job.id), job);
      void qc.invalidateQueries({ queryKey: integrationKeys.imports });
    },
  });
}

export function useBulkQuotesMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => integrationsRepository.requestBulkQuotes(jobId),
    onSuccess: (job) => {
      void qc.setQueryData(integrationKeys.importJob(job.id), job);
      void qc.invalidateQueries({ queryKey: integrationKeys.imports });
    },
  });
}

export function useShipmentTemplatesQuery() {
  return useQuery({
    queryKey: integrationKeys.templates,
    queryFn: () => integrationsRepository.listTemplates(),
  });
}

export function useSaveTemplateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      template: Omit<ShipmentTemplate, "id" | "createdAt" | "updatedAt">,
    ) => integrationsRepository.saveTemplate(template),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: integrationKeys.templates });
    },
  });
}

export function useDeleteTemplateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationsRepository.deleteTemplate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
}

export function useRepeatShipmentMetaQuery() {
  return useQuery({
    queryKey: ["integrations", "repeat-meta"],
    queryFn: async () => {
      const [addresses, presets, rules] = await Promise.all([
        integrationsRepository.listFavoriteAddresses(),
        integrationsRepository.listPackagePresets(),
        integrationsRepository.listCarrierRules(),
      ]);
      return { addresses, presets, rules };
    },
  });
}

export function useCopyPreviousMutation() {
  return useMutation({
    mutationFn: (orderId: string) =>
      integrationsRepository.copyPreviousShipment(orderId),
  });
}
