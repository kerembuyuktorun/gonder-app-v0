"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import {
  PARCEL_STEPS,
  useParcelWizard,
} from "@/features/parcel/hooks/use-parcel-wizard";
import { ParcelStepNav } from "@/features/parcel/components/parcel-step-nav";
import { ParcelMethodPicker } from "@/features/parcel/components/parcel-method-picker";
import { ParcelShipmentForm } from "@/features/parcel/components/parcel-shipment-form";
import {
  ParcelDesiSummaryCard,
  ParcelXlNudge,
} from "@/features/parcel/components/parcel-desi-summary";
import {
  ParcelQuoteCards,
  ParcelQuoteCompare,
  ParcelQuoteDrawer,
  ParcelQuoteTable,
  ParcelQuoteToolbar,
  ParcelQuotesLoading,
} from "@/features/parcel/components/parcel-quotes";
import {
  ParcelCheckoutSummary,
  ParcelSuccess,
} from "@/features/parcel/components/parcel-checkout";

export function ParcelWizard() {
  const t = useTranslations("parcel");
  const wizard = useParcelWizard();

  const unlockedThrough =
    wizard.step === "success"
      ? 3
      : wizard.step === "checkout"
        ? 3
        : wizard.step === "quotes"
          ? 2
          : wizard.step === "shipment"
            ? 1
            : 0;

  if (wizard.step === "success" && wizard.order) {
    return (
      <ParcelSuccess
        order={wizard.order}
        onReset={wizard.reset}
        onPrint={() => window.print()}
        onExportPdf={() => {
          const blob = new Blob(
            [
              `Gönder Label\n${wizard.order!.trackingNumber}\n${wizard.order!.label.barcode}\n`,
            ],
            { type: "application/pdf" },
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${wizard.order!.trackingNumber}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <ParcelStepNav
        current={wizard.step}
        onSelect={wizard.goTo}
        unlockedThrough={unlockedThrough}
      />

      {wizard.step === "method" ? (
        <ParcelMethodPicker
          templates={wizard.templates}
          previousShipments={wizard.previousShipments}
          integrationOrders={wizard.integrationOrders}
          onManual={wizard.selectManual}
          onPrevious={wizard.selectPrevious}
          onTemplate={wizard.selectTemplate}
          onIntegration={wizard.selectIntegration}
          onExcel={(name) => void wizard.selectExcel(name)}
        />
      ) : null}

      {wizard.step === "shipment" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <ParcelShipmentForm
            draft={wizard.draft}
            patchDraft={wizard.patchDraft}
            updateSender={wizard.updateSender}
            updateRecipient={wizard.updateRecipient}
            updatePickup={wizard.updatePickup}
            updateDelivery={wizard.updateDelivery}
            updateReturn={wizard.updateReturn}
            updatePackage={wizard.updatePackage}
            addPackage={wizard.addPackage}
            removePackage={wizard.removePackage}
            toggleExtra={wizard.toggleExtra}
          />
          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <ParcelDesiSummaryCard desi={wizard.desi} />
            <ParcelXlNudge show={wizard.suggestGonderXl} />
          </aside>
        </div>
      ) : null}

      {wizard.step === "quotes" ? (
        <div className="space-y-4">
          <ParcelXlNudge show={wizard.suggestGonderXl} />
          <ParcelQuoteToolbar
            sort={wizard.sort}
            onSort={wizard.setSort}
            viewMode={wizard.viewMode}
            onViewMode={wizard.setViewMode}
            compareCount={wizard.compareIds.length}
          />
          {wizard.quotesQuery.isFetching && !wizard.offers.length ? (
            <ParcelQuotesLoading loading />
          ) : null}
          {wizard.viewMode === "table" ? (
            <ParcelQuoteTable
              offers={wizard.offers}
              selectedId={wizard.selectedOfferId}
              compareIds={wizard.compareIds}
              onSelect={wizard.setSelectedOfferId}
              onToggleCompare={wizard.toggleCompare}
              onOpenDetail={wizard.setDetailOfferId}
            />
          ) : (
            <ParcelQuoteCards
              offers={wizard.offers}
              selectedId={wizard.selectedOfferId}
              compareIds={wizard.compareIds}
              onSelect={wizard.setSelectedOfferId}
              onToggleCompare={wizard.toggleCompare}
              onOpenDetail={wizard.setDetailOfferId}
            />
          )}
          <ParcelQuoteCompare offers={wizard.compareOffers} />
          <ParcelQuoteDrawer
            offer={wizard.detailOffer}
            open={Boolean(wizard.detailOfferId)}
            onOpenChange={(open) => {
              if (!open) wizard.setDetailOfferId(null);
            }}
            onSelect={wizard.setSelectedOfferId}
          />
        </div>
      ) : null}

      {wizard.step === "checkout" && wizard.selectedOffer ? (
        <ParcelCheckoutSummary
          offer={wizard.selectedOffer}
          paymentMethod={wizard.paymentMethod}
          onPaymentMethod={wizard.setPaymentMethod}
          wallet={wizard.wallet}
          onConfirm={() => void wizard.checkout()}
          submitting={wizard.submitting}
          error={wizard.submitError}
        />
      ) : null}

      {wizard.step === "checkout" && !wizard.selectedOffer ? (
        <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          {t("selectOfferFirst")}
        </div>
      ) : null}

      {wizard.step !== "success" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <AppButton
            type="button"
            variant="ghost"
            disabled={wizard.isFirst}
            onClick={wizard.prevStep}
          >
            {t("back")}
          </AppButton>
          <div className="flex gap-2">
            {wizard.step === "method" ? null : wizard.step === "shipment" ? (
              <AppButton
                type="button"
                onClick={() => wizard.goTo("quotes")}
                disabled={
                  wizard.suggestGonderXl ||
                  !wizard.draft.recipient.name ||
                  !wizard.draft.recipient.phone
                }
              >
                {t("getQuotes")}
              </AppButton>
            ) : wizard.step === "quotes" ? (
              <AppButton
                type="button"
                onClick={() => wizard.goTo("checkout")}
                disabled={!wizard.selectedOfferId}
              >
                {t("continueCheckout")}
              </AppButton>
            ) : null}
          </div>
          <p className="w-full text-xs text-muted-foreground sm:w-auto">
            {t("stepProgress", {
              current: Math.min(wizard.stepIndex + 1, PARCEL_STEPS.length - 1),
              total: PARCEL_STEPS.length - 1,
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
}
