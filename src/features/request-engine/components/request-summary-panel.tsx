"use client";

import { Box, CalendarDays, MapPin, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { useRequestDraftStore } from "@/stores/request-draft-store";
import { calculateDesi, getRequestQuotes } from "@/features/request-engine/lib/quotes";
import { MoneyDisplay } from "@/components/shared/money-display";

export function RequestSummaryPanel() {
  const t = useTranslations("redesign.summary");
  const draft = useRequestDraftStore((state) => state.draft);
  const selectedQuoteId = useRequestDraftStore(
    (state) => state.selectedQuoteId,
  );
  const resetDraft = useRequestDraftStore((state) => state.resetDraft);
  const selectedQuote = getRequestQuotes(draft).find(
    (quote) => quote.id === selectedQuoteId,
  );

  return (
    <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold">
            {t("title")}
          </h2>
        </div>
        <AppButton
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("reset")}
          onClick={resetDraft}
        >
          <RotateCcw className="size-4" />
        </AppButton>
      </div>

      <div className="space-y-4 border-y border-border py-4">
        <SummaryRow
          icon={MapPin}
          label={t("route")}
          value={
            draft.origin && draft.destination
              ? `${draft.origin} → ${draft.destination}`
              : t("notSet")
          }
        />
        <SummaryRow
          icon={CalendarDays}
          label={t("date")}
          value={draft.date || t("notSet")}
        />
        <SummaryRow
          icon={Box}
          label={t("load")}
          value={
            draft.operationType === "logistics"
              ? `${draft.logisticsMode.toUpperCase()} · ${draft.weight} kg`
              : `${draft.quantity} × ${draft.packagePreset} · ${Math.ceil(
                  calculateDesi(draft),
                )} desi`
          }
        />
      </div>

      {selectedQuote ? (
        <div className="rounded-xl bg-accent/60 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            {t("selectedQuote")}
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{selectedQuote.provider}</p>
              <p className="text-xs text-muted-foreground">
                {selectedQuote.serviceName}
              </p>
            </div>
            {selectedQuote.price ? (
              <MoneyDisplay value={selectedQuote.price} size="lg" />
            ) : (
              <span className="text-sm font-semibold">{t("preparing")}</span>
            )}
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          {t("noQuote")}
        </p>
      )}

      <div className="space-y-2 text-xs text-muted-foreground">
        <p>{t("autoSave")}</p>
        <p>{t("secure")}</p>
      </div>
    </aside>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
