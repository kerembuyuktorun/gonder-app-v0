"use client";

import { useTranslations } from "next-intl";
import { MoneyDisplay } from "@/components/shared/money-display";
import { AppButton } from "@/components/shared/app-button";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { CourierQuote, CourierValidationResult } from "@/types/courier";
import { cn } from "@/lib/utils/cn";

export function CourierPriceSidebar({
  quote,
  validation,
  isLoading,
  onApplyVanSuggestion,
}: {
  quote?: CourierQuote;
  validation?: CourierValidationResult;
  isLoading?: boolean;
  onApplyVanSuggestion?: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{t("courier.priceTitle")}</h3>

      {validation ? (
        <ul className="space-y-2">
          {validation.messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "rounded-md px-3 py-2 text-xs",
                message.tone === "info" && "bg-info-bg text-info-fg",
                message.tone === "warning" && "bg-warning-bg text-warning-fg",
                message.tone === "error" && "bg-error-bg text-error-fg",
              )}
            >
              {t(message.messageKey)}
            </li>
          ))}
        </ul>
      ) : null}

      {validation?.suggestedVehicle === "van" && onApplyVanSuggestion ? (
        <AppButton
          size="sm"
          variant="secondary"
          className="w-full"
          onClick={onApplyVanSuggestion}
        >
          {t("courier.applySuggestion")}
        </AppButton>
      ) : null}

      {isLoading && !quote ? <LoadingSkeleton rows={3} variant="form" /> : null}

      {quote?.status === "preparing" ? (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-4 text-sm text-muted-foreground">
          {t("courier.pricePreparing")}
        </div>
      ) : null}

      {quote?.status === "unavailable" ? (
        <div className="rounded-lg border border-error/30 bg-error-bg px-3 py-4 text-sm text-error-fg">
          {t("courier.priceUnavailable")}
        </div>
      ) : null}

      {quote?.status === "ready" ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("courier.priceReady")}
          </p>
          <dl className="space-y-2 text-sm">
            {quote.lines.map((line) => (
              <div key={line.id} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{t(line.labelKey)}</dt>
                <dd>
                  <MoneyDisplay value={line.amount} size="sm" />
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold">{t("courier.price.total")}</span>
            <MoneyDisplay value={quote.total} size="lg" />
          </div>
          {quote.etaMinutes ? (
            <p className="text-xs text-muted-foreground">
              {t("courier.eta", { minutes: quote.etaMinutes })}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
