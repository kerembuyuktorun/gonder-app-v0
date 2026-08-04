"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { AppButton } from "@/components/shared/app-button";
import { FilterBar } from "@/components/shared/filter-bar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceBadge } from "@/components/shared/service-badge";
import { Badge } from "@/components/ui/badge";
import {
  useBulkAssignMutation,
  useOpsRequestsQuery,
  useOpsStaffQuery,
} from "@/features/operations/hooks/use-operations";
import {
  DEFAULT_OPS_COLUMNS,
  priorityTone,
  slaTone,
} from "@/features/operations/lib/nav";
import type { OpsPriority, OpsQueueView } from "@/types/operations";
import { formatDateTime } from "@/lib/utils/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Can } from "@/lib/auth/guards";

export function OpsRequestQueue({ view }: { view: OpsQueueView }) {
  const t = useTranslations("operations");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const staff = useOpsStaffQuery();
  const bulk = useBulkAssignMutation();

  const [search, setSearch] = React.useState("");
  const [priority, setPriority] = React.useState<OpsPriority | "all">("all");
  const [assigneeId, setAssigneeId] = React.useState<string | "all">("all");
  const [sort, setSort] = React.useState<"updatedAt" | "priority" | "slaDueAt">(
    "updatedAt",
  );
  const [page, setPage] = React.useState(1);
  const [columns, setColumns] = React.useState<string[]>([...DEFAULT_OPS_COLUMNS]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulkReason, setBulkReason] = React.useState("");
  const [bulkAssignee, setBulkAssignee] = React.useState("staff_1");
  const [savedViews, setSavedViews] = React.useState<
    { name: string; columns: string[]; priority: OpsPriority | "all" }[]
  >([{ name: "Kritik SLA", columns: [...DEFAULT_OPS_COLUMNS], priority: "critical" }]);

  const { data, isLoading } = useOpsRequestsQuery({
    view,
    search: search || undefined,
    priority,
    assigneeId,
    sort,
    sortDir: "desc",
    page,
    pageSize: 20,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={t(`nav.${view}`)}
        description={t("queue.subtitle")}
      />

      <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} onReset={() => {
        setSearch("");
        setPriority("all");
        setAssigneeId("all");
        setPage(1);
      }}>
        <select
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as OpsPriority | "all");
            setPage(1);
          }}
        >
          <option value="all">{t("queue.allPriorities")}</option>
          {(["critical", "high", "normal", "low"] as const).map((p) => (
            <option key={p} value={p}>{t(`priority.${p}`)}</option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          value={assigneeId}
          onChange={(e) => {
            setAssigneeId(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">{t("queue.allAssignees")}</option>
          {(staff.data ?? []).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="updatedAt">{t("queue.sortUpdated")}</option>
          <option value="priority">{t("queue.sortPriority")}</option>
          <option value="slaDueAt">{t("queue.sortSla")}</option>
        </select>
        <AppButton
          size="sm"
          variant="ghost"
          onClick={() => {
            const name = window.prompt(t("queue.saveViewPrompt"));
            if (!name) return;
            setSavedViews((v) => [...v, { name, columns, priority }]);
          }}
        >
          {t("queue.saveView")}
        </AppButton>
      </FilterBar>

      {savedViews.length ? (
        <div className="flex flex-wrap gap-2 text-sm">
          {savedViews.map((v) => (
            <button
              key={v.name}
              type="button"
              className="rounded-lg border border-border px-2 py-1 hover:bg-muted"
              onClick={() => {
                setColumns(v.columns);
                setPriority(v.priority);
              }}
            >
              {v.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {DEFAULT_OPS_COLUMNS.map((col) => {
          const on = columns.includes(col);
          return (
            <button
              key={col}
              type="button"
              onClick={() =>
                setColumns((c) =>
                  on ? c.filter((x) => x !== col) : [...c, col],
                )
              }
              className={cn(
                "rounded-md border px-2 py-1 text-xs",
                on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
              )}
            >
              {t(`columns.${col}`)}
            </button>
          );
        })}
      </div>

      {selected.size > 0 ? (
        <Can permission="ops:assign">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
            <span>{t("queue.selected", { count: selected.size })}</span>
            <AppButton size="sm" onClick={() => setBulkOpen(true)}>
              {t("queue.bulkAssign")}
            </AppButton>
            <AppButton size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              {t("queue.clear")}
            </AppButton>
          </div>
        </Can>
      ) : null}

      {isLoading ? <LoadingSkeleton rows={4} /> : null}
      {!isLoading && items.length === 0 ? (
        <EmptyState title={t("queue.emptyTitle")} description={t("queue.emptyDescription")} />
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="border-b border-border bg-muted/60">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === items.length}
                    onChange={() =>
                      setSelected(
                        selected.size === items.length
                          ? new Set()
                          : new Set(items.map((i) => i.id)),
                      )
                    }
                  />
                </th>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-3 text-left font-medium text-muted-foreground">
                    {t(`columns.${col}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border last:border-0",
                    (row.delayed || row.hasIssue || row.slaState === "breached") &&
                      "bg-error-bg/20",
                    row.priority === "critical" && "bg-warning-bg/20",
                  )}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-2">
                      {col === "reference" ? (
                        <Link
                          href={`/operations/requests/${row.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {row.reference}
                        </Link>
                      ) : null}
                      {col === "service" ? <ServiceBadge type={row.serviceType} /> : null}
                      {col === "status" ? t(`status.${row.status}`) : null}
                      {col === "customer" ? (
                        <span>
                          {row.customerName}
                          {row.organizationName ? (
                            <span className="block text-xs text-muted-foreground">
                              {row.organizationName}
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                      {col === "route" ? `${row.originCity} → ${row.destinationCity}` : null}
                      {col === "priority" ? (
                        <Badge tone={priorityTone[row.priority]}>
                          {t(`priority.${row.priority}`)}
                        </Badge>
                      ) : null}
                      {col === "assignee" ? row.assigneeName ?? "—" : null}
                      {col === "sla" ? (
                        <Badge tone={slaTone[row.slaState]}>
                          {t(`sla.${row.slaState}`)}
                          {row.delayed ? ` · ${t("queue.delayedFlag")}` : ""}
                        </Badge>
                      ) : null}
                      {col === "updatedAt"
                        ? formatDateTime(row.updatedAt, intlLocale)
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {total > 20 ? (
        <div className="flex items-center gap-2 text-sm">
          <AppButton size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            {t("queue.prev")}
          </AppButton>
          <span>{page}</span>
          <AppButton
            size="sm"
            variant="secondary"
            disabled={page * 20 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            {t("queue.next")}
          </AppButton>
        </div>
      ) : null}

      <ConfirmDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title={t("queue.bulkConfirmTitle")}
        description={t("queue.bulkConfirmDescription", { count: selected.size })}
        onConfirm={() => {
          const person = (staff.data ?? []).find((s) => s.id === bulkAssignee);
          if (!person || !bulkReason.trim()) return;
          void bulk.mutateAsync({
            requestIds: [...selected],
            assigneeId: person.id,
            assigneeName: person.name,
            reason: bulkReason.trim(),
          }).then(() => {
            setBulkOpen(false);
            setSelected(new Set());
            setBulkReason("");
          });
        }}
      />
      {bulkOpen ? (
        <div className="fixed inset-x-0 bottom-4 z-[var(--z-popover)] mx-auto flex max-w-lg flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-lg">
          <select
            className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
            value={bulkAssignee}
            onChange={(e) => setBulkAssignee(e.target.value)}
          >
            {(staff.data ?? []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
            placeholder={t("reasonRequired")}
            value={bulkReason}
            onChange={(e) => setBulkReason(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}
