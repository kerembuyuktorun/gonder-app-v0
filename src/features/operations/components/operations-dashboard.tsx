"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyDisplay } from "@/components/shared/money-display";
import { useOpsMetricsQuery, useOpsRequestsQuery } from "@/features/operations/hooks/use-operations";
import { Link } from "@/lib/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { slaTone, priorityTone } from "@/features/operations/lib/nav";
import { ServiceBadge } from "@/components/shared/service-badge";

export function OperationsDashboard() {
  const t = useTranslations("operations");
  const { data: metrics, isLoading } = useOpsMetricsQuery();
  const critical = useOpsRequestsQuery({
    view: "delayed",
    page: 1,
    pageSize: 5,
    sort: "priority",
    sortDir: "desc",
  });
  const problems = useOpsRequestsQuery({
    view: "problematic",
    page: 1,
    pageSize: 5,
  });

  if (isLoading || !metrics) return <LoadingSkeleton rows={4} />;

  const cards = [
    { key: "newRequests", value: String(metrics.newRequests) },
    {
      key: "firstQuote",
      value: t("metrics.minutes", { n: metrics.firstQuoteMinutesAvg }),
    },
    { key: "pendingQuotes", value: String(metrics.pendingQuotes) },
    { key: "active", value: String(metrics.activeShipments) },
    { key: "delayed", value: String(metrics.delayedShipments) },
    { key: "problematic", value: String(metrics.problematicOrders) },
    {
      key: "volume",
      value: null as null,
      money: metrics.dailyVolume,
    },
    {
      key: "profit",
      value: null as null,
      money: metrics.estimatedGrossProfit,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader title={t("dashboard.title")} description={t("dashboard.subtitle")} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.key}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t(`metrics.${c.key}`)}
            </p>
            <div className="mt-2 font-display text-2xl font-semibold">
              {"money" in c && c.money ? (
                <MoneyDisplay value={c.money} size="lg" />
              ) : (
                c.value
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <QueuePeek
          title={t("dashboard.delayedTitle")}
          items={critical.data?.items ?? []}
          href="/operations/queue/delayed"
        />
        <QueuePeek
          title={t("dashboard.problemsTitle")}
          items={problems.data?.items ?? []}
          href="/operations/queue/problematic"
        />
      </div>
    </div>
  );
}

function QueuePeek({
  title,
  items,
  href,
}: {
  title: string;
  items: {
    id: string;
    reference: string;
    serviceType: import("@/types/domain").ServiceType;
    priority: import("@/types/operations").OpsPriority;
    slaState: import("@/types/operations").SlaState;
    customerName: string;
  }[];
  href: string;
}) {
  const t = useTranslations("operations");
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        <Link href={href} className="text-sm text-primary hover:underline">
          {t("dashboard.viewAll")}
        </Link>
      </div>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">{t("dashboard.empty")}</li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/operations/requests/${item.id}`}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.reference} · {item.customerName}
                  </p>
                  <ServiceBadge type={item.serviceType} />
                </div>
                <div className="flex shrink-0 gap-1">
                  <Badge tone={priorityTone[item.priority]}>
                    {t(`priority.${item.priority}`)}
                  </Badge>
                  <Badge tone={slaTone[item.slaState]}>
                    {t(`sla.${item.slaState}`)}
                  </Badge>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
