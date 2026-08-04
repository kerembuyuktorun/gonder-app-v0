"use client";

import * as React from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type {
  OrderLifecycleStatus,
  OrderListParams,
  OrderListView,
  OrderSortField,
} from "@/types/orders";
import type { ServiceType } from "@/types/domain";
import { DEFAULT_ORDER_COLUMNS } from "@/features/orders/lib/status";

export type OrdersUrlState = {
  view: OrderListView;
  search: string;
  serviceType: ServiceType | "all";
  sort: OrderSortField;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
  criticalOnly: boolean;
  columns: string[];
  statuses: OrderLifecycleStatus[];
  providers: string[];
  drawerId: string | null;
};

const VIEWS: OrderListView[] = [
  "all",
  "awaiting_quote",
  "awaiting_approval",
  "awaiting_payment",
  "active",
  "completed",
  "cancelled",
  "problematic",
];

const SORTS: OrderSortField[] = [
  "updatedAt",
  "createdAt",
  "total",
  "status",
  "reference",
];

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseState(params: URLSearchParams): OrdersUrlState {
  const viewRaw = params.get("view") ?? "all";
  const view = VIEWS.includes(viewRaw as OrderListView)
    ? (viewRaw as OrderListView)
    : "all";
  const sortRaw = params.get("sort") ?? "updatedAt";
  const sort = SORTS.includes(sortRaw as OrderSortField)
    ? (sortRaw as OrderSortField)
    : "updatedAt";
  const sortDir = params.get("sortDir") === "asc" ? "asc" : "desc";
  const serviceType = (params.get("service") as ServiceType | "all") || "all";
  const columns = parseList(params.get("cols"));
  return {
    view,
    search: params.get("q") ?? "",
    serviceType: serviceType || "all",
    sort,
    sortDir,
    page: Math.max(1, Number(params.get("page") ?? 1) || 1),
    pageSize: Math.min(50, Math.max(5, Number(params.get("pageSize") ?? 10) || 10)),
    criticalOnly: params.get("critical") === "1",
    columns: columns.length ? columns : [...DEFAULT_ORDER_COLUMNS],
    statuses: parseList(params.get("status")) as OrderLifecycleStatus[],
    providers: parseList(params.get("provider")),
    drawerId: params.get("peek"),
  };
}

function toSearchParams(state: OrdersUrlState): string {
  const p = new URLSearchParams();
  if (state.view !== "all") p.set("view", state.view);
  if (state.search) p.set("q", state.search);
  if (state.serviceType !== "all") p.set("service", state.serviceType);
  if (state.sort !== "updatedAt") p.set("sort", state.sort);
  if (state.sortDir !== "desc") p.set("sortDir", state.sortDir);
  if (state.page !== 1) p.set("page", String(state.page));
  if (state.pageSize !== 10) p.set("pageSize", String(state.pageSize));
  if (state.criticalOnly) p.set("critical", "1");
  if (state.statuses.length) p.set("status", state.statuses.join(","));
  if (state.providers.length) p.set("provider", state.providers.join(","));
  const defaultCols = DEFAULT_ORDER_COLUMNS.join(",");
  if (state.columns.join(",") !== defaultCols) {
    p.set("cols", state.columns.join(","));
  }
  if (state.drawerId) p.set("peek", state.drawerId);
  return p.toString();
}

export function useOrdersUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = React.useMemo(
    () => parseState(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const setState = React.useCallback(
    (patch: Partial<OrdersUrlState>) => {
      const next = { ...state, ...patch };
      if (
        patch.view !== undefined ||
        patch.search !== undefined ||
        patch.serviceType !== undefined ||
        patch.criticalOnly !== undefined ||
        patch.statuses !== undefined ||
        patch.providers !== undefined
      ) {
        if (patch.page === undefined) next.page = 1;
      }
      const qs = toSearchParams(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, state],
  );

  const listParams: OrderListParams = React.useMemo(
    () => ({
      view: state.view,
      search: state.search || undefined,
      serviceType: state.serviceType,
      statuses: state.statuses.length ? state.statuses : undefined,
      providers: state.providers.length ? state.providers : undefined,
      criticalOnly: state.criticalOnly || undefined,
      sort: state.sort,
      sortDir: state.sortDir,
      page: state.page,
      pageSize: state.pageSize,
    }),
    [state],
  );

  return { state, setState, listParams };
}
