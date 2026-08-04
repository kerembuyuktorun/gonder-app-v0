"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentRepository, spotRepository } from "@/lib/api/client";
import { createDefaultSpotDraft } from "@/mocks/data/spot";
import {
  createIdempotencyKey,
  fastestId,
  lowestPriceId,
  recommendedId,
  sortOffers,
  supplierStatusCounts,
} from "@/features/spot/lib/comparison";
import { buildPaymentBreakdown } from "@/types/payment";
import type {
  InvoiceDetails,
  PaymentIntent,
  PaymentMethod,
  PaymentTiming,
} from "@/types/payment";
import type {
  SpotOffer,
  SpotQuoteSort,
  SpotRequest,
  SpotRequestDraft,
  SpotWorkspaceStep,
} from "@/types/spot";

export function useSpotWorkspace() {
  const [draft, setDraft] = React.useState<SpotRequestDraft>(() =>
    createDefaultSpotDraft(),
  );
  const [step, setStep] = React.useState<SpotWorkspaceStep>("request");
  const [request, setRequest] = React.useState<SpotRequest | null>(null);
  const [sort, setSort] = React.useState<SpotQuoteSort>("price_asc");
  const [serviceFilter, setServiceFilter] = React.useState<string>("all");
  const [compareIds, setCompareIds] = React.useState<string[]>([]);
  const [detailOfferId, setDetailOfferId] = React.useState<string | null>(null);
  const [counterOfferId, setCounterOfferId] = React.useState<string | null>(
    null,
  );
  const [acceptOfferId, setAcceptOfferId] = React.useState<string | null>(null);
  const [explicitAccept, setExplicitAccept] = React.useState(false);

  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>("saved_card");
  const [timing, setTiming] = React.useState<PaymentTiming>("full");
  const [savedCardId, setSavedCardId] = React.useState<string>("");
  const [discountCode, setDiscountCode] = React.useState("");
  const [discountPercent, setDiscountPercent] = React.useState(0);
  const [invoice, setInvoice] = React.useState<InvoiceDetails>({
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    address: "",
    email: "",
  });
  const [contractAccepted, setContractAccepted] = React.useState(false);
  const [require3ds, setRequire3ds] = React.useState(false);
  const [simulateOutcome, setSimulateOutcome] = React.useState<
    "succeeded" | "failed" | "uncertain" | undefined
  >(undefined);
  const [idempotencyKey, setIdempotencyKey] = React.useState(() =>
    createIdempotencyKey(),
  );
  const [intent, setIntent] = React.useState<PaymentIntent | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const payingLock = React.useRef(false);

  const cardsQuery = useQuery({
    queryKey: ["payment-cards"],
    queryFn: () => paymentRepository.listSavedCards(),
  });
  const walletQuery = useQuery({
    queryKey: ["payment-wallet"],
    queryFn: () => paymentRepository.getWalletBalance(),
  });
  const invoiceQuery = useQuery({
    queryKey: ["payment-invoice-default"],
    queryFn: () => paymentRepository.getDefaultInvoice(),
  });

  const effectiveInvoice: InvoiceDetails = invoice.companyName
    ? invoice
    : (invoiceQuery.data ?? invoice);

  const effectiveSavedCardId =
    savedCardId || cardsQuery.data?.[0]?.id || "";

  const offers: SpotOffer[] = React.useMemo(() => {
    if (!request) return [];
    let list = request.offers;
    if (serviceFilter !== "all") {
      list = list.filter((o) => o.serviceKind === serviceFilter);
    }
    return sortOffers(list, sort);
  }, [request, sort, serviceFilter]);

  const selectedOffer =
    offers.find((o) => o.id === (acceptOfferId ?? request?.selectedOfferId)) ??
    request?.offers.find(
      (o) => o.id === (acceptOfferId ?? request?.selectedOfferId),
    ) ??
    null;

  const breakdown = selectedOffer
    ? buildPaymentBreakdown(selectedOffer, timing, discountPercent)
    : null;

  const badges = React.useMemo(
    () => ({
      lowest: lowestPriceId(request?.offers ?? []),
      fastest: fastestId(request?.offers ?? []),
      recommended: recommendedId(request?.offers ?? []),
    }),
    [request?.offers],
  );

  const counts = request
    ? supplierStatusCounts(request.suppliers)
    : null;

  function patchDraft(patch: Partial<SpotRequestDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function openToSpot() {
    setSubmitting(true);
    setError(null);
    try {
      const created = await spotRepository.openRequest(draft);
      setRequest(created);
      setStep("board");
      setCompareIds([]);
    } catch {
      setError("open_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function refreshOffers() {
    if (!request) return;
    setSubmitting(true);
    try {
      const updated = await spotRepository.refreshOffers(request.id);
      setRequest(updated);
    } finally {
      setSubmitting(false);
    }
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  async function sendCounterOffer(amount: number, note: string) {
    if (!request || !counterOfferId) return;
    setSubmitting(true);
    try {
      await spotRepository.sendCounterOffer({
        requestId: request.id,
        offerId: counterOfferId,
        amount,
        note,
      });
      const refreshed = await spotRepository.getRequest(request.id);
      setRequest(refreshed);
      setCounterOfferId(null);
    } catch {
      setError("counter_failed");
    } finally {
      setSubmitting(false);
    }
  }

  function beginAccept(offerId: string) {
    if (!offerId) {
      setAcceptOfferId(null);
      setExplicitAccept(false);
      return;
    }
    setAcceptOfferId(offerId);
    setExplicitAccept(false);
  }

  async function confirmAcceptAndCheckout() {
    if (!request || !acceptOfferId || !explicitAccept) return;
    setSubmitting(true);
    try {
      await spotRepository.selectOffer(request.id, acceptOfferId);
      const refreshed = await spotRepository.getRequest(request.id);
      setRequest(refreshed);
      setIdempotencyKey(createIdempotencyKey());
      setIntent(null);
      setStep("checkout");
    } catch {
      setError("accept_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function applyDiscount() {
    const result = await paymentRepository.validateDiscount(discountCode);
    setDiscountPercent(result?.percent ?? 0);
    if (!result) setError("invalid_discount");
    else setError(null);
  }

  async function pay() {
    if (!request || !selectedOffer || !breakdown || !contractAccepted) return;
    if (payingLock.current) return;
    payingLock.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const result = await paymentRepository.checkout({
        idempotencyKey,
        requestId: request.id,
        offerId: selectedOffer.id,
        method: paymentMethod,
        timing,
        savedCardId:
          paymentMethod === "saved_card" ? effectiveSavedCardId : undefined,
        require3ds,
        simulateOutcome,
        discountCode: discountCode || undefined,
        invoice: effectiveInvoice,
        contractAccepted,
        amount: breakdown.totalDue,
      });
      setIntent(result);
      if (result.status === "succeeded") {
        await spotRepository.markAccepted(request.id, selectedOffer.id);
        setStep("result");
      } else if (
        result.status === "requires_3ds" ||
        result.status === "failed" ||
        result.status === "uncertain"
      ) {
        setStep("result");
      }
    } catch {
      setError("pay_failed");
    } finally {
      setSubmitting(false);
      payingLock.current = false;
    }
  }

  async function confirm3ds() {
    if (!intent || !request || !selectedOffer) return;
    setSubmitting(true);
    try {
      const result = await paymentRepository.confirm3ds(intent.id);
      setIntent(result);
      if (result.status === "succeeded") {
        await spotRepository.markAccepted(request.id, selectedOffer.id);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function pollStatus() {
    if (!intent) return;
    setSubmitting(true);
    try {
      const result = await paymentRepository.getIntentStatus(intent.id);
      setIntent(result);
      if (result.status === "succeeded" && request && selectedOffer) {
        await spotRepository.markAccepted(request.id, selectedOffer.id);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setDraft(createDefaultSpotDraft());
    setStep("request");
    setRequest(null);
    setSort("price_asc");
    setServiceFilter("all");
    setCompareIds([]);
    setDetailOfferId(null);
    setCounterOfferId(null);
    setAcceptOfferId(null);
    setExplicitAccept(false);
    setIntent(null);
    setContractAccepted(false);
    setDiscountCode("");
    setDiscountPercent(0);
    setIdempotencyKey(createIdempotencyKey());
    setError(null);
    payingLock.current = false;
  }

  const compareOffers = compareIds
    .map(
      (id) =>
        request?.offers.find((o) => o.id === id) ??
        offers.find((o) => o.id === id),
    )
    .filter(Boolean) as SpotOffer[];

  const detailOffer =
    request?.offers.find((o) => o.id === detailOfferId) ?? null;
  const counterOffer =
    request?.offers.find((o) => o.id === counterOfferId) ?? null;

  return {
    draft,
    patchDraft,
    step,
    setStep,
    request,
    openToSpot,
    refreshOffers,
    offers,
    sort,
    setSort,
    serviceFilter,
    setServiceFilter,
    badges,
    counts,
    compareIds,
    toggleCompare,
    compareOffers,
    detailOfferId,
    setDetailOfferId,
    detailOffer,
    counterOfferId,
    setCounterOfferId,
    counterOffer,
    sendCounterOffer,
    acceptOfferId,
    beginAccept,
    explicitAccept,
    setExplicitAccept,
    confirmAcceptAndCheckout,
    selectedOffer,
    breakdown,
    paymentMethod,
    setPaymentMethod,
    timing,
    setTiming,
    savedCardId: effectiveSavedCardId,
    setSavedCardId,
    cards: cardsQuery.data ?? [],
    wallet: walletQuery.data,
    discountCode,
    setDiscountCode,
    discountPercent,
    applyDiscount,
    invoice: effectiveInvoice,
    setInvoice,
    contractAccepted,
    setContractAccepted,
    require3ds,
    setRequire3ds,
    simulateOutcome,
    setSimulateOutcome,
    pay,
    confirm3ds,
    pollStatus,
    intent,
    submitting,
    error,
    reset,
  };
}
