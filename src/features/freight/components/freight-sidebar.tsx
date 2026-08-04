"use client";

import { useTranslations } from "next-intl";
import { MoneyDisplay } from "@/components/shared/money-display";
import type { FreightDraft, FreightQuote, FreightRequest } from "@/types/freight";

export function FreightSidebar({
  draft,
  quote,
  request,
}: {
  draft: FreightDraft;
  quote?: FreightQuote | null;
  request?: FreightRequest | null;
}) {
  const t = useTranslations("freight");
  const pallets = draft.lines.reduce((s, l) => s + l.pallets, 0);
  const boxes = draft.lines.reduce((s, l) => s + l.boxes, 0);
  const activeQuote = request?.quote ?? quote;

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">{t("sidebarSummary")}</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("mode")}</dt>
            <dd className="font-medium">
              {draft.mode ? t(`modes.${draft.mode}`) : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("route")}</dt>
            <dd className="text-right font-medium">
              {draft.loading.city} → {draft.delivery.city}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("totalWeight")}</dt>
            <dd className="font-medium">{draft.totalWeightKg} kg</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("pallets")}</dt>
            <dd className="font-medium">{pallets}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("boxes")}</dt>
            <dd className="font-medium">{boxes}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("vehicleTitle")}</dt>
            <dd className="font-medium">{t(`vehicles.${draft.vehicleType}`)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("bodyTitle")}</dt>
            <dd className="font-medium">{t(`bodies.${draft.bodyType}`)}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">{t("sidebarQuote")}</h3>
        {activeQuote ? (
          <div className="mt-3 space-y-2 text-sm">
            <p className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium">
              {t(`statuses.${activeQuote.status}`)}
            </p>
            {activeQuote.total ? (
              <MoneyDisplay value={activeQuote.total} size="lg" />
            ) : (
              <p className="text-muted-foreground">{t("quotePending")}</p>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("quotePending")}
          </p>
        )}
      </div>
    </aside>
  );
}
