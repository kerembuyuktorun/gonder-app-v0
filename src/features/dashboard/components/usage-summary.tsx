"use client";

import { useTranslations } from "next-intl";
import { MoneyDisplay } from "@/components/shared/money-display";
import type { DashboardUsageSummary } from "@/types/dashboard";

export function UsageSummaryCard({ usage }: { usage: DashboardUsageSummary }) {
  const t = useTranslations();

  const stats = [
    {
      label: t("dashboard.usage.shipments"),
      value: usage.shipmentCount.toLocaleString(),
    },
    {
      label: t("dashboard.usage.spend"),
      value: <MoneyDisplay value={usage.spend} size="sm" />,
    },
    {
      label: t("dashboard.usage.quotes"),
      value: usage.quoteCount.toLocaleString(),
    },
    {
      label: t("dashboard.usage.avgCost"),
      value: <MoneyDisplay value={usage.avgCost} size="sm" />,
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t(usage.periodLabelKey)}
      </p>
      <dl className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border/70 bg-muted/45 px-4 py-3.5"
          >
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-base font-semibold tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
