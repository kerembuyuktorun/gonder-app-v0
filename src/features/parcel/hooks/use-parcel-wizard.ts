"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { parcelRepository } from "@/lib/api/client";
import { createDefaultParcelDraft } from "@/mocks/data/parcel";
import {
  createEmptyPackage,
  summarizeDesi,
} from "@/features/parcel/lib/desi";
import type {
  ParcelAddress,
  ParcelCreationMethod,
  ParcelExtraService,
  ParcelOrderResult,
  ParcelPackage,
  ParcelParty,
  ParcelQuoteOffer,
  ParcelQuoteSort,
  ParcelQuoteViewMode,
  ParcelShipmentDraft,
  ParcelWizardStepId,
} from "@/types/parcel";

export const PARCEL_STEPS: ParcelWizardStepId[] = [
  "method",
  "shipment",
  "quotes",
  "checkout",
  "success",
];

export function useParcelWizard() {
  const [draft, setDraft] = React.useState<ParcelShipmentDraft>(() =>
    createDefaultParcelDraft(),
  );
  const [step, setStep] = React.useState<ParcelWizardStepId>("method");
  const [selectedOfferId, setSelectedOfferId] = React.useState<string | null>(
    null,
  );
  const [compareIds, setCompareIds] = React.useState<string[]>([]);
  const [detailOfferId, setDetailOfferId] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<ParcelQuoteSort>("price_asc");
  const [viewMode, setViewMode] = React.useState<ParcelQuoteViewMode>("table");
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "balance">(
    "balance",
  );
  const [order, setOrder] = React.useState<ParcelOrderResult | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [quotesEnabled, setQuotesEnabled] = React.useState(false);

  const desi = React.useMemo(
    () => summarizeDesi(draft.packages),
    [draft.packages],
  );

  const templatesQuery = useQuery({
    queryKey: ["parcel-templates"],
    queryFn: () => parcelRepository.listTemplates(),
  });
  const previousQuery = useQuery({
    queryKey: ["parcel-previous"],
    queryFn: () => parcelRepository.listPreviousShipments(),
  });
  const integrationsQuery = useQuery({
    queryKey: ["parcel-integrations"],
    queryFn: () => parcelRepository.listIntegrationOrders(),
  });
  const walletQuery = useQuery({
    queryKey: ["parcel-wallet"],
    queryFn: () => parcelRepository.getWalletBalance(),
  });

  const quotesQuery = useQuery({
    queryKey: ["parcel-quotes", draft],
    queryFn: () => parcelRepository.getQuotes(draft),
    enabled: quotesEnabled,
    placeholderData: (prev) => prev,
  });

  function patchDraft(patch: Partial<ParcelShipmentDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setQuotesEnabled(false);
    setSelectedOfferId(null);
    setOrder(null);
  }

  function applyMethodSeed(
    method: ParcelCreationMethod,
    seed: Partial<ParcelShipmentDraft> = {},
  ) {
    setDraft((prev) => ({
      ...prev,
      ...seed,
      method,
    }));
    setQuotesEnabled(false);
    setSelectedOfferId(null);
    setCompareIds([]);
    setOrder(null);
    setStep("shipment");
  }

  function selectManual() {
    applyMethodSeed("manual", createDefaultParcelDraft());
  }

  function selectPrevious(id: string) {
    const item = previousQuery.data?.find((p) => p.id === id);
    if (!item) return;
    applyMethodSeed("copy_previous", {
      ...item.draft,
      previousShipmentId: id,
      templateId: null,
      integrationOrderId: null,
      excelFileName: null,
    });
  }

  function selectTemplate(id: string) {
    const item = templatesQuery.data?.find((p) => p.id === id);
    if (!item) return;
    applyMethodSeed("template", {
      ...item.draft,
      templateId: id,
      previousShipmentId: null,
      integrationOrderId: null,
      excelFileName: null,
    });
  }

  function selectIntegration(id: string) {
    const item = integrationsQuery.data?.find((p) => p.id === id);
    if (!item) return;
    applyMethodSeed("integration_order", {
      ...item.draft,
      integrationOrderId: id,
      templateId: null,
      previousShipmentId: null,
      excelFileName: null,
    });
  }

  async function selectExcel(fileName: string) {
    const parsed = await parcelRepository.parseExcelUpload(fileName);
    applyMethodSeed("excel_bulk", parsed);
  }

  function updateSender(patch: Partial<ParcelParty>) {
    setDraft((prev) => ({ ...prev, sender: { ...prev.sender, ...patch } }));
  }
  function updateRecipient(patch: Partial<ParcelParty>) {
    setDraft((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, ...patch },
    }));
  }
  function updatePickup(patch: Partial<ParcelAddress>) {
    setDraft((prev) => ({ ...prev, pickup: { ...prev.pickup, ...patch } }));
  }
  function updateDelivery(patch: Partial<ParcelAddress>) {
    setDraft((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, ...patch },
    }));
  }
  function updateReturn(patch: Partial<ParcelAddress>) {
    setDraft((prev) => ({
      ...prev,
      returnAddress: {
        ...(prev.returnAddress ?? {
          line1: "",
          district: "",
          city: "İstanbul",
          country: "TR",
        }),
        ...patch,
      },
    }));
  }

  function updatePackage(id: string, patch: Partial<ParcelPackage>) {
    setDraft((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === id ? { ...pkg, ...patch } : pkg,
      ),
    }));
    setQuotesEnabled(false);
  }

  function addPackage() {
    setDraft((prev) => ({
      ...prev,
      packages: [...prev.packages, createEmptyPackage()],
    }));
    setQuotesEnabled(false);
  }

  function removePackage(id: string) {
    setDraft((prev) => ({
      ...prev,
      packages:
        prev.packages.length <= 1
          ? prev.packages
          : prev.packages.filter((pkg) => pkg.id !== id),
    }));
    setQuotesEnabled(false);
  }

  function toggleExtra(service: ParcelExtraService) {
    setDraft((prev) => {
      const has = prev.extras.includes(service);
      return {
        ...prev,
        extras: has
          ? prev.extras.filter((e) => e !== service)
          : [...prev.extras, service],
      };
    });
    setQuotesEnabled(false);
  }

  function goTo(next: ParcelWizardStepId) {
    if (next === "quotes") setQuotesEnabled(true);
    setStep(next);
  }

  function nextStep() {
    const index = PARCEL_STEPS.indexOf(step);
    const next = PARCEL_STEPS[index + 1];
    if (!next || next === "success") return;
    if (next === "quotes") setQuotesEnabled(true);
    setStep(next);
  }

  function prevStep() {
    const index = PARCEL_STEPS.indexOf(step);
    if (index > 0) setStep(PARCEL_STEPS[index - 1]);
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const offers: ParcelQuoteOffer[] = React.useMemo(() => {
    const list = quotesQuery.data?.offers ?? [];
    const sorted = [...list];
    switch (sort) {
      case "price_desc":
        sorted.sort((a, b) => b.total.amount - a.total.amount);
        break;
      case "eta_asc":
        sorted.sort(
          (a, b) =>
            a.etaDaysMax - b.etaDaysMax || a.total.amount - b.total.amount,
        );
        break;
      case "carrier_asc":
        sorted.sort((a, b) => a.carrierId.localeCompare(b.carrierId));
        break;
      default:
        sorted.sort((a, b) => a.total.amount - b.total.amount);
    }
    return sorted;
  }, [quotesQuery.data?.offers, sort]);

  const selectedOffer =
    offers.find((o) => o.id === selectedOfferId) ??
    quotesQuery.data?.offers.find((o) => o.id === selectedOfferId) ??
    null;

  const detailOffer =
    offers.find((o) => o.id === detailOfferId) ??
    quotesQuery.data?.offers.find((o) => o.id === detailOfferId) ??
    null;

  const compareOffers = compareIds
    .map(
      (id) =>
        offers.find((o) => o.id === id) ??
        quotesQuery.data?.offers.find((o) => o.id === id),
    )
    .filter(Boolean) as ParcelQuoteOffer[];

  async function checkout() {
    if (!selectedOfferId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await parcelRepository.checkout({
        draft,
        offerId: selectedOfferId,
        paymentMethod,
      });
      setOrder(result);
      setStep("success");
    } catch {
      setSubmitError("failed");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setDraft(createDefaultParcelDraft());
    setStep("method");
    setSelectedOfferId(null);
    setCompareIds([]);
    setDetailOfferId(null);
    setSort("price_asc");
    setViewMode("table");
    setPaymentMethod("balance");
    setOrder(null);
    setSubmitError(null);
    setQuotesEnabled(false);
  }

  const stepIndex = PARCEL_STEPS.indexOf(step);

  return {
    draft,
    desi,
    step,
    stepIndex,
    goTo,
    nextStep,
    prevStep,
    isFirst: stepIndex === 0,
    patchDraft,
    selectManual,
    selectPrevious,
    selectTemplate,
    selectIntegration,
    selectExcel,
    updateSender,
    updateRecipient,
    updatePickup,
    updateDelivery,
    updateReturn,
    updatePackage,
    addPackage,
    removePackage,
    toggleExtra,
    templates: templatesQuery.data ?? [],
    previousShipments: previousQuery.data ?? [],
    integrationOrders: integrationsQuery.data ?? [],
    wallet: walletQuery.data,
    quotesQuery,
    offers,
    selectedOfferId,
    setSelectedOfferId,
    selectedOffer,
    compareIds,
    toggleCompare,
    compareOffers,
    detailOfferId,
    setDetailOfferId,
    detailOffer,
    sort,
    setSort,
    viewMode,
    setViewMode,
    paymentMethod,
    setPaymentMethod,
    checkout,
    submitting,
    submitError,
    order,
    reset,
    suggestGonderXl:
      desi.suggestGonderXl || Boolean(quotesQuery.data?.suggestGonderXl),
  };
}
