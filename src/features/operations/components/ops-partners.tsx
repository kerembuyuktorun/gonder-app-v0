"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { useOpsPartnersQuery, useOpsPriceListsQuery } from "@/features/operations/hooks/use-operations";
import { ServiceBadge } from "@/components/shared/service-badge";
import { Can } from "@/lib/auth/guards";

const saasTone = {
  connected: "success" as const,
  pending: "warning" as const,
  error: "error" as const,
  offline: "neutral" as const,
};

export function OpsPartnersPage() {
  const t = useTranslations("operations");
  const { data, isLoading } = useOpsPartnersQuery();

  return (
    <Can permission="ops:partners:manage">
      <div className="space-y-4">
        <PageHeader title={t("nav.partners")} description={t("partners.subtitle")} />
        {isLoading ? <LoadingSkeleton rows={3} /> : null}
        <div className="grid gap-3 lg:grid-cols-2">
          {(data ?? []).map((p) => (
            <article key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold">{p.name}</h3>
                <Badge tone={saasTone[p.saasStatus]}>{t(`partners.saas.${p.saasStatus}`)}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("partners.regions")}: {p.regions.join(", ")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.services.map((s) => (
                  <ServiceBadge key={s} type={s} />
                ))}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">{t("partners.performance")}</dt>
                  <dd className="font-medium">{p.performanceScore}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t("partners.active")}</dt>
                  <dd className="font-medium">{p.activeOps}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">{t("partners.contract")}</dt>
                  <dd className="font-medium">{p.contractRef ?? "—"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </Can>
  );
}

export function OpsPriceListsPage() {
  const t = useTranslations("operations");
  const { data, isLoading } = useOpsPriceListsQuery();

  return (
    <Can permission="ops:partners:manage">
      <div className="space-y-4">
        <PageHeader title={t("nav.price_lists")} description={t("priceLists.subtitle")} />
        {isLoading ? <LoadingSkeleton rows={2} /> : null}
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {(data ?? []).map((pl) => (
            <li key={pl.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{pl.name}</p>
                <p className="text-xs text-muted-foreground">
                  {pl.partnerName} · {pl.validFrom}
                  {pl.validTo ? ` → ${pl.validTo}` : ""}
                </p>
              </div>
              <ServiceBadge type={pl.serviceType} />
            </li>
          ))}
        </ul>
      </div>
    </Can>
  );
}
