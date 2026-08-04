"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { xlRepository } from "@/lib/api/client";
import {
  createDefaultXlDraft,
  createEmptyPiece,
} from "@/mocks/data/xl";
import {
  isBelowParcelThreshold,
  summarizeXlTotals,
} from "@/features/xl/lib/totals";
import type {
  XlAddress,
  XlDraft,
  XlExtraService,
  XlOrderResult,
  XlPhoto,
  XlPiece,
  XlWizardStepId,
} from "@/types/xl";

export const XL_STEPS: XlWizardStepId[] = [
  "form",
  "quote",
  "checkout",
  "success",
];

export function useXlWizard() {
  const [draft, setDraft] = React.useState<XlDraft>(() =>
    createDefaultXlDraft(),
  );
  const [step, setStep] = React.useState<XlWizardStepId>("form");
  const [quoteEnabled, setQuoteEnabled] = React.useState(false);
  const [resolvePreparing, setResolvePreparing] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<
    "card" | "balance" | "invoice"
  >("invoice");
  const [order, setOrder] = React.useState<XlOrderResult | null>(null);
  const [opsRequestId, setOpsRequestId] = React.useState<string | null>(null);
  const [opsEtaHours, setOpsEtaHours] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const totals = React.useMemo(
    () => summarizeXlTotals(draft.pieces),
    [draft.pieces],
  );
  const belowParcel = isBelowParcelThreshold(draft);

  const walletQuery = useQuery({
    queryKey: ["xl-wallet"],
    queryFn: () => xlRepository.getWalletBalance(),
  });

  const quoteQuery = useQuery({
    queryKey: ["xl-quote", draft, resolvePreparing],
    queryFn: () =>
      xlRepository.getQuote({ draft, resolvePreparing }),
    enabled: quoteEnabled,
    placeholderData: (prev) => prev,
  });

  function patchDraft(patch: Partial<XlDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setQuoteEnabled(false);
    setResolvePreparing(false);
    setOpsRequestId(null);
  }

  function updatePickup(patch: Partial<XlAddress>) {
    setDraft((prev) => ({ ...prev, pickup: { ...prev.pickup, ...patch } }));
    setQuoteEnabled(false);
  }

  function updateDelivery(patch: Partial<XlAddress>) {
    setDraft((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, ...patch },
    }));
    setQuoteEnabled(false);
  }

  function updatePiece(id: string, patch: Partial<XlPiece>) {
    setDraft((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    setQuoteEnabled(false);
  }

  function addPiece() {
    setDraft((prev) => ({
      ...prev,
      pieces: [...prev.pieces, createEmptyPiece(prev.pieces.length + 1)],
    }));
    setQuoteEnabled(false);
  }

  function removePiece(id: string) {
    setDraft((prev) => ({
      ...prev,
      pieces:
        prev.pieces.length <= 1
          ? prev.pieces
          : prev.pieces.filter((p) => p.id !== id),
    }));
    setQuoteEnabled(false);
  }

  function addPhotos(files: FileList) {
    const photos: XlPhoto[] = Array.from(files).map((file, i) => ({
      id: `photo_${Date.now()}_${i}`,
      name: file.name,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }));
    setDraft((prev) => ({ ...prev, photos: [...prev.photos, ...photos] }));
  }

  function removePhoto(id: string) {
    setDraft((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  }

  function toggleExtra(service: XlExtraService) {
    setDraft((prev) => {
      const has = prev.extras.includes(service);
      return {
        ...prev,
        extras: has
          ? prev.extras.filter((e) => e !== service)
          : [...prev.extras, service],
      };
    });
    setQuoteEnabled(false);
  }

  function goTo(next: XlWizardStepId) {
    if (next === "quote") {
      setQuoteEnabled(true);
      setResolvePreparing(false);
    }
    setStep(next);
  }

  function requestQuotes() {
    setQuoteEnabled(true);
    setResolvePreparing(false);
    setStep("quote");
  }

  async function refreshPreparing() {
    setResolvePreparing(true);
    setQuoteEnabled(true);
    await quoteQuery.refetch();
  }

  async function submitOps() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await xlRepository.submitForOpsReview(draft);
      setOpsRequestId(result.requestId);
      setOpsEtaHours(result.etaHours);
    } catch {
      setSubmitError("ops_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function checkout() {
    const quote = quoteQuery.data;
    if (!quote?.total) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await xlRepository.checkout({
        draft,
        quote,
        paymentMethod,
      });
      setOrder(result);
      setStep("success");
    } catch {
      setSubmitError("checkout_failed");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setDraft(createDefaultXlDraft());
    setStep("form");
    setQuoteEnabled(false);
    setResolvePreparing(false);
    setPaymentMethod("invoice");
    setOrder(null);
    setOpsRequestId(null);
    setOpsEtaHours(null);
    setSubmitError(null);
  }

  const stepIndex = XL_STEPS.indexOf(step);
  const quote = quoteQuery.data;
  const payable =
    quote &&
    quote.total &&
    (quote.state === "instant_ready" || quote.state === "quote_ready");

  return {
    draft,
    totals,
    belowParcel,
    step,
    stepIndex,
    goTo,
    requestQuotes,
    patchDraft,
    updatePickup,
    updateDelivery,
    updatePiece,
    addPiece,
    removePiece,
    addPhotos,
    removePhoto,
    toggleExtra,
    quote,
    quoteQuery,
    refreshPreparing,
    submitOps,
    opsRequestId,
    opsEtaHours,
    paymentMethod,
    setPaymentMethod,
    wallet: walletQuery.data,
    checkout,
    submitting,
    submitError,
    order,
    payable,
    reset,
  };
}
