"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils/cn";
import { XL_STEPS, useXlWizard } from "@/features/xl/hooks/use-xl-wizard";
import { XlShipmentForm } from "@/features/xl/components/xl-shipment-form";
import { XlSidebar } from "@/features/xl/components/xl-sidebar";
import { XlQuotePanel } from "@/features/xl/components/xl-quote-panel";
import {
  XlCheckout,
  XlSuccess,
} from "@/features/xl/components/xl-checkout";
import type { XlWizardStepId } from "@/types/xl";

function StepNav({
  current,
  onSelect,
}: {
  current: XlWizardStepId;
  onSelect: (s: XlWizardStepId) => void;
}) {
  const t = useTranslations("xl.steps");
  const currentIndex = XL_STEPS.indexOf(current);
  const visible = XL_STEPS.filter((s) => s !== "success");

  return (
    <ol className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-2">
      {visible.map((step, index) => {
        const active = step === current;
        const done = index < currentIndex;
        return (
          <li key={step}>
            <button
              type="button"
              onClick={() => onSelect(step)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm touch-target",
                active && "bg-primary text-primary-foreground",
                done && !active && "bg-success-bg text-success-fg",
                !active && !done && "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-black/10 text-xs font-semibold dark:bg-white/10">
                {index + 1}
              </span>
              {t(step)}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function XlWizard() {
  const t = useTranslations("xl");
  const w = useXlWizard();

  if (w.step === "success" && w.order) {
    return <XlSuccess order={w.order} onReset={w.reset} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <StepNav current={w.step} onSelect={w.goTo} />

      {w.step === "form" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <XlShipmentForm
            draft={w.draft}
            patchDraft={w.patchDraft}
            updatePickup={w.updatePickup}
            updateDelivery={w.updateDelivery}
            updatePiece={w.updatePiece}
            addPiece={w.addPiece}
            removePiece={w.removePiece}
            addPhotos={w.addPhotos}
            removePhoto={w.removePhoto}
            toggleExtra={w.toggleExtra}
          />
          <XlSidebar
            draft={w.draft}
            totals={w.totals}
            quote={w.quote}
            isLoading={w.quoteQuery.isFetching}
            belowParcel={w.belowParcel}
          />
        </div>
      ) : null}

      {w.step === "quote" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <XlQuotePanel
            quote={w.quote}
            isLoading={w.quoteQuery.isFetching}
            onResolvePreparing={() => void w.refreshPreparing()}
            onSubmitOps={() => void w.submitOps()}
            opsRequestId={w.opsRequestId}
            opsEtaHours={w.opsEtaHours}
            submitting={w.submitting}
            canPay={Boolean(w.payable)}
            onContinuePayment={() => w.goTo("checkout")}
          />
          <XlSidebar
            draft={w.draft}
            totals={w.totals}
            quote={w.quote}
            isLoading={w.quoteQuery.isFetching}
            belowParcel={w.belowParcel}
          />
        </div>
      ) : null}

      {w.step === "checkout" && w.quote ? (
        <XlCheckout
          quote={w.quote}
          paymentMethod={w.paymentMethod}
          onPaymentMethod={w.setPaymentMethod}
          wallet={w.wallet}
          onConfirm={() => void w.checkout()}
          submitting={w.submitting}
          error={w.submitError}
        />
      ) : null}

      {w.step !== "success" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <AppButton
            type="button"
            variant="ghost"
            disabled={w.step === "form"}
            onClick={() => {
              if (w.step === "checkout") w.goTo("quote");
              else if (w.step === "quote") w.goTo("form");
            }}
          >
            {t("back")}
          </AppButton>
          {w.step === "form" ? (
            <AppButton type="button" onClick={w.requestQuotes}>
              {t("getQuote")}
            </AppButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
