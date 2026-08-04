"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { MoneyDisplay } from "@/components/shared/money-display";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { XlQuote } from "@/types/xl";
import { cn } from "@/lib/utils/cn";

export function XlQuotePanel({
  quote,
  isLoading,
  onResolvePreparing,
  onSubmitOps,
  opsRequestId,
  opsEtaHours,
  submitting,
  onContinuePayment,
  canPay,
}: {
  quote?: XlQuote;
  isLoading?: boolean;
  onResolvePreparing: () => void;
  onSubmitOps: () => void;
  opsRequestId: string | null;
  opsEtaHours: number | null;
  submitting?: boolean;
  onContinuePayment: () => void;
  canPay?: boolean;
}) {
  const t = useTranslations("xl");

  if (isLoading && !quote) {
    return <LoadingSkeleton rows={4} variant="form" />;
  }

  if (!quote) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        {t("pricePending")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold">{t("quoteTitle")}</h2>
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
        </div>
        <p className="text-sm text-muted-foreground">
          {t(`models.${quote.model}`)}
          {quote.partnerNameKey
            ? ` · ${t(quote.partnerNameKey.replace("xl.", "") as "partners.listPartner")}`
            : null}
        </p>

        <div className="rounded-lg bg-muted/40 px-3 py-3 text-sm">
          <p className="font-medium">{t("processLabel")}</p>
          <p className="mt-1 text-muted-foreground">
            {t(quote.processKey.replace("xl.", "") as "process.awaitingInfo")}
          </p>
          <p className="mt-2 font-medium">{t("nextLabel")}</p>
          <p className="mt-1 text-muted-foreground">
            {t(quote.nextStepKey.replace("xl.", "") as "next.awaitingInfo")}
          </p>
        </div>

        {quote.warnings.map((w) => (
          <p
            key={w}
            className="rounded-md bg-warning-bg px-3 py-2 text-xs text-warning-fg"
          >
            {t(w.replace("xl.", "") as "warnings.noElevator")}
          </p>
        ))}

        {quote.missingFields.length > 0 ? (
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {quote.missingFields.map((f) => (
              <li key={f}>{t(`missing.${f}`)}</li>
            ))}
          </ul>
        ) : null}

        {quote.lines.length > 0 ? (
          <dl className="space-y-2 text-sm">
            {quote.lines.map((line) => (
              <div key={line.id} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">
                  {t(line.labelKey.replace("xl.", "") as "price.transport")}
                </dt>
                <dd>
                  <MoneyDisplay value={line.amount} size="sm" />
                </dd>
              </div>
            ))}
            {quote.total ? (
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold">{t("total")}</span>
                <MoneyDisplay value={quote.total} size="lg" />
              </div>
            ) : null}
          </dl>
        ) : null}

        {quote.etaDaysMin != null ? (
          <p className="text-xs text-muted-foreground">
            {t("etaDays", { min: quote.etaDaysMin, max: quote.etaDaysMax ?? quote.etaDaysMin })}
          </p>
        ) : null}

        {quote.validUntil ? (
          <p className="text-xs text-muted-foreground">
            {t("validUntil", {
              time: new Date(quote.validUntil).toLocaleString("tr-TR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
            })}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2">
          {quote.state === "quote_preparing" ? (
            <AppButton type="button" onClick={onResolvePreparing}>
              {t("refreshQuote")}
            </AppButton>
          ) : null}
          {quote.state === "ops_review_required" && !opsRequestId ? (
            <AppButton
              type="button"
              onClick={onSubmitOps}
              loading={submitting}
            >
              {t("submitOps")}
            </AppButton>
          ) : null}
          {canPay ? (
            <AppButton type="button" onClick={onContinuePayment}>
              {t("continuePayment")}
            </AppButton>
          ) : null}
        </div>

        {opsRequestId ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm">
            <p className="font-medium">{t("opsSubmittedTitle")}</p>
            <p className="mt-1 text-muted-foreground">
              {t("opsSubmittedBody", {
                id: opsRequestId,
                hours: opsEtaHours ?? 4,
              })}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
