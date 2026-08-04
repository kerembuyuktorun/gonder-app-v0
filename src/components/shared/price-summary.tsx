"use client";

import { useTranslations } from "next-intl";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Separator } from "@/components/ui/separator";
import type { PriceSummaryModel } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

export type PriceSummaryProps = {
  summary: PriceSummaryModel;
  className?: string;
};

export function PriceSummary({ summary, className }: PriceSummaryProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <h3 className="mb-3 text-sm font-semibold">{t("price.summary")}</h3>
      <dl className="space-y-2 text-sm">
        {summary.lines.map((line) => (
          <div key={line.id} className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t(line.labelKey)}</dt>
            <dd>
              <MoneyDisplay value={line.amount} size="sm" />
            </dd>
          </div>
        ))}
        {summary.discount ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t("price.discount")}</dt>
            <dd className="text-success-fg">
              −
              <MoneyDisplay value={summary.discount} size="sm" />
            </dd>
          </div>
        ) : null}
        {summary.tax ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t("price.tax")}</dt>
            <dd>
              <MoneyDisplay value={summary.tax} size="sm" />
            </dd>
          </div>
        ) : null}
      </dl>
      <Separator className="my-3" />
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold">{t("price.total")}</span>
        <MoneyDisplay value={summary.total} size="lg" />
      </div>
    </div>
  );
}
