"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { useSpotWorkspace } from "@/features/spot/hooks/use-spot-workspace";
import { SpotRequestForm } from "@/features/spot/components/spot-request-form";
import {
  SpotComparePanel,
  SpotQuoteDrawer,
  SpotQuoteTable,
  SpotQuoteToolbar,
  SpotSupplierBoard,
} from "@/features/spot/components/spot-quotes";
import {
  SpotAcceptConfirm,
  SpotCounterOfferModal,
} from "@/features/spot/components/spot-modals";
import {
  SpotCheckout,
  SpotPaymentResult,
} from "@/features/spot/components/spot-checkout";

export function SpotWorkspace() {
  const t = useTranslations("spot");
  const w = useSpotWorkspace();

  if (w.step === "result" && w.intent) {
    return (
      <SpotPaymentResult
        intent={w.intent}
        onConfirm3ds={() => void w.confirm3ds()}
        onPoll={() => void w.pollStatus()}
        onReset={w.reset}
        submitting={w.submitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      {w.step === "request" ? (
        <SpotRequestForm
          draft={w.draft}
          onChange={w.patchDraft}
          onSubmit={() => void w.openToSpot()}
          submitting={w.submitting}
        />
      ) : null}

      {w.step === "board" && w.request ? (
        <div className="space-y-4">
          <SpotSupplierBoard
            request={w.request}
            counts={w.counts}
            onRefresh={() => void w.refreshOffers()}
            submitting={w.submitting}
          />
          <SpotQuoteToolbar
            sort={w.sort}
            onSort={w.setSort}
            serviceFilter={w.serviceFilter}
            onFilter={w.setServiceFilter}
            compareCount={w.compareIds.length}
          />
          <SpotQuoteTable
            offers={w.offers}
            badges={w.badges}
            compareIds={w.compareIds}
            onToggleCompare={w.toggleCompare}
            onDetail={w.setDetailOfferId}
            onCounter={w.setCounterOfferId}
            onAccept={w.beginAccept}
          />
          <SpotComparePanel offers={w.compareOffers} />
          <SpotQuoteDrawer
            offer={w.detailOffer}
            open={Boolean(w.detailOfferId)}
            onOpenChange={(open) => {
              if (!open) w.setDetailOfferId(null);
            }}
            onAccept={(id) => {
              w.setDetailOfferId(null);
              w.beginAccept(id);
            }}
            onCounter={(id) => {
              w.setDetailOfferId(null);
              w.setCounterOfferId(id);
            }}
          />
          <SpotCounterOfferModal
            offer={w.counterOffer}
            open={Boolean(w.counterOfferId)}
            onOpenChange={(open) => {
              if (!open) w.setCounterOfferId(null);
            }}
            onSubmit={(amount, note) => void w.sendCounterOffer(amount, note)}
            submitting={w.submitting}
          />
          <SpotAcceptConfirm
            offer={
              w.request.offers.find((o) => o.id === w.acceptOfferId) ?? null
            }
            open={Boolean(w.acceptOfferId)}
            explicitAccept={w.explicitAccept}
            onExplicitAccept={w.setExplicitAccept}
            onConfirm={() => void w.confirmAcceptAndCheckout()}
            onCancel={() => w.beginAccept("")}
            submitting={w.submitting}
          />
        </div>
      ) : null}

      {w.step === "checkout" && w.selectedOffer && w.breakdown ? (
        <SpotCheckout
          offer={w.selectedOffer}
          breakdown={w.breakdown}
          paymentMethod={w.paymentMethod}
          onPaymentMethod={w.setPaymentMethod}
          timing={w.timing}
          onTiming={w.setTiming}
          cards={w.cards}
          savedCardId={w.savedCardId}
          onSavedCardId={w.setSavedCardId}
          wallet={w.wallet}
          discountCode={w.discountCode}
          onDiscountCode={w.setDiscountCode}
          onApplyDiscount={() => void w.applyDiscount()}
          discountPercent={w.discountPercent}
          invoice={w.invoice}
          onInvoice={(p) => w.setInvoice({ ...w.invoice, ...p })}
          contractAccepted={w.contractAccepted}
          onContractAccepted={w.setContractAccepted}
          require3ds={w.require3ds}
          onRequire3ds={w.setRequire3ds}
          simulateOutcome={w.simulateOutcome}
          onSimulateOutcome={w.setSimulateOutcome}
          onPay={() => void w.pay()}
          submitting={w.submitting}
          error={w.error}
        />
      ) : null}
    </div>
  );
}
