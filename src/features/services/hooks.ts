"use client";

import { useQuery } from "@tanstack/react-query";
import {
  quoteRepository,
  serviceRepository,
  shipmentRepository,
} from "@/lib/api/client";
import type { ListParams } from "@/lib/api/repositories";

export const queryKeys = {
  services: ["services"] as const,
  quotes: (params?: ListParams) => ["quotes", params] as const,
  shipments: (params?: ListParams) => ["shipments", params] as const,
};

export function useServicesQuery() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: () => serviceRepository.listServices(),
  });
}

export function useQuotesQuery(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.quotes(params),
    queryFn: () => quoteRepository.listQuotes(params),
  });
}

export function useShipmentsQuery(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.shipments(params),
    queryFn: () => shipmentRepository.listShipments(params),
  });
}
