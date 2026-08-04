"use client";

import { useTranslations } from "next-intl";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils/cn";
import type { XlDraft, XlQuote, XlTotals } from "@/types/xl";

export function XlSidebar({
  draft,
  totals,
  quote,
  isLoading,
  belowParcel,
}: {
  draft: XlDraft;
  totals: XlTotals;
  quote?: XlQuote;
  isLoading?: boolean;
  belowParcel?: boolean;
}) {
  const t = useTranslations("xl");

  return (
    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      {belowParcel ? (
        <div className="rounded-xl border border-warning/40 bg-warning-bg px-4 py-3 text-sm text-warning-fg">
          <p className="font-semibold">{t("parcelNudgeTitle")}</p>
          <p className="mt-1">{t("parcelNudgeBody")}</p>
          <Link href="/app/requests/parcel" className="mt-2 inline-block">
            <AppButton type="button" size="sm" variant="secondary">
              {t("parcelNudgeCta")}
            </AppButton>
          </Link>
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">{t("sidebarPieces")}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {draft.pieces.map((p) => (
            <li key={p.id} className="flex justify-between gap-2">
              <span className="truncate text-muted-foreground">{p.name}</span>
              <span className="shrink-0 font-medium">{p.weightKg} kg</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
          <div>
            <dt className="text-muted-foreground">{t("totalWeight")}</dt>
            <dd className="font-semibold">{totals.totalWeightKg} kg</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("totalVolume")}</dt>
            <dd className="font-semibold">{totals.totalVolumeM3} m³</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">{t("chargeableDesi")}</dt>
            <dd className="font-semibold">{totals.chargeableDesi}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">{t("sidebarServices")}</h3>
        {draft.extras.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("noExtras")}</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {draft.extras.map((e) => (
              <li key={e}>{t(`extras.${e}`)}</li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {t("packaging")}: {t(`packagingOptions.${draft.packaging}`)}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">{t("sidebarPrice")}</h3>
        {isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("states.calculating")}
          </p>
        ) : quote ? (
          <div className="mt-3 space-y-2">
            <span
              className={cn(
                "inline-flex rounded-md px-2 py-1 text-xs font-medium",
                quote.state === "instant_ready" || quote.state === "quote_ready"
                  ? "bg-success-bg text-success-fg"
                  : quote.state === "service_unavailable"
                    ? "bg-error-bg text-error-fg"
                    : "bg-warning-bg text-warning-fg",
              )}
            >
              {t(`states.${quote.state}`)}
            </span>
            <p className="text-xs text-muted-foreground">
              {t(`models.${quote.model}`)}
            </p>
            {quote.total ? (
              <MoneyDisplay value={quote.total} size="lg" />
            ) : (
              <p className="text-sm text-muted-foreground">
                {t(quote.nextStepKey.replace("xl.", "") as "next.awaitingInfo")}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("pricePending")}
          </p>
        )}
      </div>
    </aside>
  );
}
