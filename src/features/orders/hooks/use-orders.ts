"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersRepository } from "@/lib/api/client";
import type {
  CancelOrderInput,
  OrderListParams,
  ReportIssueInput,
  SavedOrderView,
} from "@/types/orders";

export const orderQueryKeys = {
  list: (params: OrderListParams) => ["orders", "list", params] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
  notifications: ["orders", "notifications"] as const,
  savedViews: ["orders", "savedViews"] as const,
};

export function useOrdersQuery(params: OrderListParams) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: () => ordersRepository.list(params),
  });
}

export function useOrderDetailQuery(id: string | null) {
  return useQuery({
    queryKey: orderQueryKeys.detail(id ?? ""),
    queryFn: () => ordersRepository.getById(id!),
    enabled: Boolean(id),
  });
}

export function useOrderNotificationsQuery() {
  return useQuery({
    queryKey: orderQueryKeys.notifications,
    queryFn: () => ordersRepository.listNotifications(),
    refetchInterval: 30_000,
  });
}

export function useSavedOrderViewsQuery() {
  return useQuery({
    queryKey: orderQueryKeys.savedViews,
    queryFn: () => ordersRepository.listSavedViews(),
  });
}

export function useReportIssueMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReportIssueInput) => ordersRepository.reportIssue(input),
    onSuccess: (order) => {
      void qc.invalidateQueries({ queryKey: ["orders"] });
      void qc.setQueryData(orderQueryKeys.detail(order.id), order);
    },
  });
}

export function useCancelOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CancelOrderInput) => ordersRepository.cancelOrder(input),
    onSuccess: (order) => {
      void qc.invalidateQueries({ queryKey: ["orders"] });
      void qc.setQueryData(orderQueryKeys.detail(order.id), order);
    },
  });
}

export function useSendOrderMessageMutation(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => ordersRepository.sendMessage(orderId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderQueryKeys.detail(orderId) });
    },
  });
}

export function useMarkNotificationReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersRepository.markNotificationRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderQueryKeys.notifications });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ordersRepository.markAllNotificationsRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderQueryKeys.notifications });
    },
  });
}

export function useSaveOrderViewMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (view: Omit<SavedOrderView, "id">) =>
      ordersRepository.saveView(view),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderQueryKeys.savedViews });
    },
  });
}

export function useExportOrdersCsv() {
  return useMutation({
    mutationFn: (params: OrderListParams) => ordersRepository.exportCsv(params),
  });
}
