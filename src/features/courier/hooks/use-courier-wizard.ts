"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { courierRepository } from "@/lib/api/client";
import {
  addressFromDistrict,
  createDefaultCourierDraft,
} from "@/mocks/data/courier";
import type {
  CourierAddress,
  CourierContact,
  CourierExtraService,
  CourierPackage,
  CourierRequestDraft,
  CourierSchedule,
  CourierStop,
  CourierWizardStepId,
} from "@/types/courier";

export const COURIER_STEPS: CourierWizardStepId[] = [
  "addresses",
  "contacts",
  "package",
  "vehicle_service",
  "schedule_extras",
  "review",
];

function newStopId() {
  return `stop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function useCourierWizard() {
  const [draft, setDraft] = React.useState<CourierRequestDraft>(() =>
    createDefaultCourierDraft(),
  );
  const [step, setStep] = React.useState<CourierWizardStepId>("addresses");
  const [submitted, setSubmitted] = React.useState<{
    requestId: string;
    trackingNumber: string;
  } | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const quoteQuery = useQuery({
    queryKey: ["courier-quote", draft],
    queryFn: () => courierRepository.getQuote(draft),
    placeholderData: (prev) => prev,
  });

  function patchDraft(patch: Partial<CourierRequestDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function updatePickup(patch: Partial<CourierAddress>) {
    setDraft((prev) => {
      let next = { ...prev.pickup, ...patch };
      if (patch.district && patch.district !== prev.pickup.district) {
        next = {
          ...addressFromDistrict(patch.district, next.line1 || prev.pickup.line1),
          postalCode: next.postalCode,
        };
      }
      return { ...prev, pickup: next };
    });
  }

  function updateDelivery(patch: Partial<CourierAddress>) {
    setDraft((prev) => {
      let next = { ...prev.delivery, ...patch };
      if (patch.district && patch.district !== prev.delivery.district) {
        next = {
          ...addressFromDistrict(patch.district, next.line1 || prev.delivery.line1),
          postalCode: next.postalCode,
        };
      }
      return { ...prev, delivery: next };
    });
  }

  function addStop() {
    setDraft((prev) => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          id: newStopId(),
          label: "",
          addressLine: "",
          district: "",
          city: "İstanbul",
          contactName: "",
          phone: "",
        },
      ],
    }));
  }

  function updateStop(id: string, patch: Partial<CourierStop>) {
    setDraft((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === id ? { ...stop, ...patch } : stop,
      ),
    }));
  }

  function removeStop(id: string) {
    setDraft((prev) => ({
      ...prev,
      stops: prev.stops.filter((stop) => stop.id !== id),
    }));
  }

  function updateSender(patch: Partial<CourierContact>) {
    setDraft((prev) => ({ ...prev, sender: { ...prev.sender, ...patch } }));
  }

  function updateRecipient(patch: Partial<CourierContact>) {
    setDraft((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, ...patch },
    }));
  }

  function updatePackage(patch: Partial<CourierPackage>) {
    setDraft((prev) => ({
      ...prev,
      package: { ...prev.package, ...patch },
    }));
  }

  function updateSchedule(patch: Partial<CourierSchedule>) {
    setDraft((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, ...patch },
    }));
  }

  function toggleExtra(service: CourierExtraService) {
    setDraft((prev) => {
      const has = prev.extras.includes(service);
      return {
        ...prev,
        extras: has
          ? prev.extras.filter((e) => e !== service)
          : [...prev.extras, service],
      };
    });
  }

  function goTo(next: CourierWizardStepId) {
    setStep(next);
  }

  function nextStep() {
    const index = COURIER_STEPS.indexOf(step);
    if (index < COURIER_STEPS.length - 1) {
      setStep(COURIER_STEPS[index + 1]);
    }
  }

  function prevStep() {
    const index = COURIER_STEPS.indexOf(step);
    if (index > 0) setStep(COURIER_STEPS[index - 1]);
  }

  async function confirm() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await courierRepository.submit(draft);
      setSubmitted(result);
      return result;
    } catch {
      setSubmitError("failed");
      throw new Error("failed");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setDraft(createDefaultCourierDraft());
    setStep("addresses");
    setSubmitted(null);
    setSubmitError(null);
    setAcceptedTerms(false);
  }

  const stepIndex = COURIER_STEPS.indexOf(step);

  return {
    draft,
    setDraft,
    patchDraft,
    updatePickup,
    updateDelivery,
    addStop,
    updateStop,
    removeStop,
    updateSender,
    updateRecipient,
    updatePackage,
    updateSchedule,
    toggleExtra,
    step,
    goTo,
    nextStep,
    prevStep,
    stepIndex,
    isFirst: stepIndex === 0,
    isLast: stepIndex === COURIER_STEPS.length - 1,
    quoteQuery,
    validation: quoteQuery.data?.validation,
    quote: quoteQuery.data?.quote,
    isQuoteLoading: quoteQuery.isFetching,
    confirm,
    submitting,
    submitted,
    submitError,
    acceptedTerms,
    setAcceptedTerms,
    reset,
  };
}
