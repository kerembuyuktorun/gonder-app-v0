"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Columns3,
  Download,
  Eye,
  ExternalLink,
  Save,
} from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { FilterBar } from "@/components/shared/filter-bar";
import { ServiceBadge } from "@/components/shared/service-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { OrderDetailDrawer } from "@/features/orders/components/order-detail-drawer";
import {
  useExportOrdersCsv,
  useOrdersQuery,
  useSaveOrderViewMutation,
  useSavedOrderViewsQuery,
} from "@/features/orders/hooks/use-orders";
import { useOrdersUrlState } from "@/features/orders/hooks/use-orders-url-state";
import {
  ALL_ORDER_COLUMNS,
  ORDER_LIST_VIEWS,
} from "@/features/orders/lib/status";
import { formatDateTime } from "@/lib/utils/format";
import { Link } from "@/lib/i18n/navigation";
import type { OrderSummary } from "@/types/orders";
import type { ServiceType } from "@/types/domain";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

const SERVICE_OPTIONS: Array<ServiceType | "all"> = [
  "all",
  "courier",
  "parcel_1_30",
  "gonder_xl",
  "ftl",
  "ltl",
  "spot",
];

const PROVIDER_OPTIONS = [
  "Gönder Kurye",
  "Yurtiçi Kargo",
  "Aras Kargo",
  "MNG Kargo",
  "XL Liste Partneri",
  "Arf Line",
  "Anadolu Freight",
];

export function OrdersWorkspace() {
  const t = useTranslations("orders");
  const tService = useTranslations("services");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const { state, setState, listParams } = useOrdersUrlState();
  const { data, isLoading } = useOrdersQuery(listParams);
  const { data: savedViews } = useSavedOrderViewsQuery();
  const saveView = useSaveOrderViewMutation();
  const exportCsv = useExportOrdersCsv();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = React.useState(false);
  const [showColumns, setShowColumns] = React.useState(false);
  const [colWidths, setColWidths] = React.useState<Record<string, number>>({});
  const [copyDismissed, setCopyDismissed] = React.useState(false);
  const searchParams = useSearchParams();
  const copyBanner =
    !copyDismissed && searchParams.get("action") === "copy";
  const createdBanner = searchParams.get("created") === "true";

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / state.pageSize));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  }

  async function onExport() {
    const csv = await exportCsv.mutateAsync(listParams);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gonder-orders-${state.view}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onSaveView() {
    const name = window.prompt(t("savedViews.prompt"));
    if (!name?.trim()) return;
    await saveView.mutateAsync({
      name: name.trim(),
      listView: state.view,
      serviceType: state.serviceType,
      search: state.search || undefined,
      sort: state.sort,
      sortDir: state.sortDir,
      columns: state.columns,
    });
  }

  function renderCell(col: string, row: OrderSummary): React.ReactNode {
    switch (col) {
      case "reference":
        return (
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setState({ drawerId: row.id })}
          >
            {row.reference}
          </button>
        );
      case "tracking":
        return row.trackingNumber;
      case "service":
        return <ServiceBadge type={row.serviceType} />;
      case "status":
        return (
          <OrderStatusBadge status={row.status} critical={row.critical} />
        );
      case "route":
        return (
          <span>
            {row.originCity} → {row.destinationCity}
          </span>
        );
      case "provider":
        return row.providerName ?? "—";
      case "amount":
        return <MoneyDisplay value={row.total} size="sm" />;
      case "updatedAt":
        return formatDateTime(row.updatedAt, intlLocale);
      case "createdAt":
        return formatDateTime(row.createdAt, intlLocale);
      case "eta":
        return row.etaAt ? formatDateTime(row.etaAt, intlLocale) : "—";
      default:
        return null;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {ORDER_LIST_VIEWS.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setState({ view })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              state.view === view
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`views.${view}`)}
          </button>
        ))}
      </div>

      {copyBanner ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-info/40 bg-info-bg/40 px-3 py-2 text-sm">
          <p>{t("copyBanner")}</p>
          <div className="flex gap-2">
            <Link href="/app/requests/parcel?from=ord_p1">
              <AppButton size="sm">{t("copyContinue")}</AppButton>
            </Link>
            <AppButton
              size="sm"
              variant="ghost"
              onClick={() => setCopyDismissed(true)}
            >
              {t("copyDismiss")}
            </AppButton>
          </div>
        </div>
      ) : null}

      {createdBanner ? (
        <div
          className="rounded-xl border border-success/35 bg-status-success-bg px-4 py-3 text-sm text-status-success-fg"
          role="status"
        >
          <p className="font-semibold">{t("createdBannerTitle")}</p>
          <p className="mt-0.5">{t("createdBannerDescription")}</p>
        </div>
      ) : null}

      <FilterBar
        search={state.search}
        onSearchChange={(value) => setState({ search: value })}
        onReset={() =>
          setState({
            search: "",
            serviceType: "all",
            criticalOnly: false,
            statuses: [],
            providers: [],
            page: 1,
          })
        }
      >
        <select
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          value={state.serviceType}
          onChange={(e) =>
            setState({
              serviceType: e.target.value as ServiceType | "all",
            })
          }
          aria-label={t("filters.service")}
        >
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? t("filters.allServices") : tService(s)}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          value={`${state.sort}:${state.sortDir}`}
          onChange={(e) => {
            const [sort, sortDir] = e.target.value.split(":") as [
              typeof state.sort,
              typeof state.sortDir,
            ];
            setState({ sort, sortDir });
          }}
          aria-label={t("filters.sort")}
        >
          <option value="updatedAt:desc">{t("sort.updatedDesc")}</option>
          <option value="updatedAt:asc">{t("sort.updatedAsc")}</option>
          <option value="createdAt:desc">{t("sort.createdDesc")}</option>
          <option value="total:desc">{t("sort.amountDesc")}</option>
          <option value="total:asc">{t("sort.amountAsc")}</option>
          <option value="reference:asc">{t("sort.referenceAsc")}</option>
        </select>
        <AppButton
          variant={showFilters ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
        >
          {t("filters.advanced")}
        </AppButton>
        <AppButton
          variant={showColumns ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setShowColumns((v) => !v)}
        >
          <Columns3 className="size-4" />
          {t("columns.title")}
        </AppButton>
        <AppButton variant="ghost" size="sm" onClick={onExport} disabled={exportCsv.isPending}>
          <Download className="size-4" />
          CSV
        </AppButton>
        <AppButton variant="ghost" size="sm" onClick={onSaveView}>
          <Save className="size-4" />
          {t("savedViews.save")}
        </AppButton>
      </FilterBar>

      {showFilters ? (
        <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.criticalOnly}
              onChange={(e) => setState({ criticalOnly: e.target.checked })}
            />
            {t("filters.criticalOnly")}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">{t("filters.providers")}</span>
            {PROVIDER_OPTIONS.map((p) => {
              const on = state.providers.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    setState({
                      providers: on
                        ? state.providers.filter((x) => x !== p)
                        : [...state.providers, p],
                    })
                  }
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    on
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {showColumns ? (
        <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
          {ALL_ORDER_COLUMNS.map((col) => {
            const on = state.columns.includes(col);
            return (
              <button
                key={col}
                type="button"
                onClick={() =>
                  setState({
                    columns: on
                      ? state.columns.filter((c) => c !== col)
                      : [...state.columns, col],
                  })
                }
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  on
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {t(`columns.${col}`)}
              </button>
            );
          })}
          {state.columns.map((col) => (
            <label key={`w-${col}`} className="flex items-center gap-1 text-xs text-muted-foreground">
              {t(`columns.${col}`)}
              <input
                type="range"
                min={80}
                max={280}
                value={colWidths[col] ?? 140}
                onChange={(e) =>
                  setColWidths((w) => ({
                    ...w,
                    [col]: Number(e.target.value),
                  }))
                }
              />
            </label>
          ))}
        </div>
      ) : null}

      {savedViews && savedViews.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("savedViews.label")}</span>
          {savedViews.map((v) => (
            <button
              key={v.id}
              type="button"
              className="rounded-lg border border-border px-2.5 py-1 hover:bg-muted"
              onClick={() =>
                setState({
                  view: v.listView,
                  serviceType: v.serviceType ?? "all",
                  search: v.search ?? "",
                  sort: v.sort,
                  sortDir: v.sortDir,
                  columns: v.columns,
                })
              }
            >
              {v.name}
            </button>
          ))}
        </div>
      ) : null}

      {selected.size > 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
          <span>{t("bulk.selected", { count: selected.size })}</span>
          <AppButton variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
            {t("bulk.clear")}
          </AppButton>
        </div>
      ) : null}

      {isLoading ? <LoadingSkeleton rows={4} /> : null}

      {!isLoading && items.length === 0 ? (
        <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="border-b border-border bg-muted/60">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === items.length && items.length > 0}
                    onChange={toggleAll}
                    aria-label={t("bulk.selectAll")}
                  />
                </th>
                {state.columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-left font-medium text-muted-foreground"
                    style={{ width: colWidths[col] }}
                  >
                    {t(`columns.${col}`)}
                  </th>
                ))}
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  {t("columns.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border last:border-0",
                    (row.critical || row.hasIssue) && "bg-error-bg/25",
                    selected.has(row.id) && "bg-info-bg/20",
                  )}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      aria-label={row.reference}
                    />
                  </td>
                  {state.columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2.5"
                      style={{ width: colWidths[col] }}
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <AppButton
                        variant="ghost"
                        size="icon"
                        aria-label={t("actions.peek")}
                        onClick={() => setState({ drawerId: row.id })}
                      >
                        <Eye className="size-4" />
                      </AppButton>
                      <Link href={`/orders/${row.id}`}>
                        <AppButton
                          variant="ghost"
                          size="icon"
                          aria-label={t("actions.open")}
                        >
                          <ExternalLink className="size-4" />
                        </AppButton>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {total > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">
            {t("pagination.summary", {
              from: (state.page - 1) * state.pageSize + 1,
              to: Math.min(state.page * state.pageSize, total),
              total,
            })}
          </p>
          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-lg border border-border bg-background px-2"
              value={state.pageSize}
              onChange={(e) =>
                setState({ pageSize: Number(e.target.value), page: 1 })
              }
              aria-label={t("pagination.pageSize")}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <AppButton
              variant="secondary"
              size="sm"
              disabled={state.page <= 1}
              onClick={() => setState({ page: state.page - 1 })}
            >
              {t("pagination.prev")}
            </AppButton>
            <span>
              {state.page} / {pageCount}
            </span>
            <AppButton
              variant="secondary"
              size="sm"
              disabled={state.page >= pageCount}
              onClick={() => setState({ page: state.page + 1 })}
            >
              {t("pagination.next")}
            </AppButton>
          </div>
        </div>
      ) : null}

      <OrderDetailDrawer
        orderId={state.drawerId}
        open={Boolean(state.drawerId)}
        onOpenChange={(open) => {
          if (!open) setState({ drawerId: null });
        }}
      />
    </div>
  );
}
