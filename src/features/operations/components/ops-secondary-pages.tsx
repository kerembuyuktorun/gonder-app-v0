"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyDisplay } from "@/components/shared/money-display";
import { useOpsFinanceQuery, useOpsMetricsQuery, useOpsRequestsQuery } from "@/features/operations/hooks/use-operations";
import { Can } from "@/lib/auth/guards";

export function OpsFinancePage() {
  const t = useTranslations("operations");
  const { data, isLoading } = useOpsFinanceQuery();

  return (
    <Can permission="ops:finance:read">
      <div className="space-y-4">
        <PageHeader title={t("nav.finance")} description={t("finance.subtitle")} />
        {isLoading || !data ? <LoadingSkeleton rows={3} /> : null}
        {data ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label={t("finance.receivables")} money={data.receivables} />
            <Metric label={t("finance.payables")} money={data.payables} />
            <Metric label={t("finance.marginToday")} money={data.marginToday} />
            <Metric label={t("finance.unpaid")} value={String(data.unpaidCount)} />
            <Metric label={t("finance.refunds")} value={String(data.refundsPending)} />
          </div>
        ) : null}
      </div>
    </Can>
  );
}

function Metric({
  label,
  money,
  value,
}: {
  label: string;
  money?: { amount: number; currency: string };
  value?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 font-display text-xl font-semibold">
        {money ? <MoneyDisplay value={money} size="lg" /> : value}
      </div>
    </div>
  );
}

export function OpsDocumentsPage() {
  const t = useTranslations("operations");
  const { data, isLoading } = useOpsRequestsQuery({ view: "summary", pageSize: 50 });
  const docs = (data?.items ?? []).flatMap((r) =>
    // summaries don't include docs — fetch hint from completed/problematic via list only counts
    [{ ref: r.reference, id: r.id }],
  );

  return (
    <div className="space-y-4">
      <PageHeader title={t("nav.documents")} description={t("documents.subtitle")} />
      {isLoading ? <LoadingSkeleton rows={2} /> : null}
      <p className="text-sm text-muted-foreground">{t("documents.hint")}</p>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {docs.slice(0, 8).map((d) => (
          <li key={d.id} className="px-4 py-3 text-sm">
            {d.ref} — {t("documents.openInWorkspace")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OpsReportsPage() {
  const t = useTranslations("operations");
  const metrics = useOpsMetricsQuery();

  return (
    <div className="space-y-4">
      <PageHeader title={t("nav.reports")} description={t("reports.subtitle")} />
      {metrics.isLoading || !metrics.data ? <LoadingSkeleton rows={2} /> : null}
      {metrics.data ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p>
            {t("reports.line", {
              newCount: metrics.data.newRequests,
              active: metrics.data.activeShipments,
              delayed: metrics.data.delayedShipments,
              profit: metrics.data.estimatedGrossProfit.amount,
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
}
