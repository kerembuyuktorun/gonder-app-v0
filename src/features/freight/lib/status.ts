import type { FreightDraft, FreightQuote, FreightQuoteStatus } from "@/types/freight";

const MISSING_MAP: Array<{ field: string; check: (d: FreightDraft) => boolean }> = [
  { field: "loading", check: (d) => !d.loading.line1 || !d.loading.city },
  { field: "delivery", check: (d) => !d.delivery.line1 || !d.delivery.city },
  { field: "loadingDate", check: (d) => !d.loadingDate },
  { field: "lines", check: (d) => d.lines.length === 0 },
  { field: "weight", check: (d) => d.totalWeightKg <= 0 },
];

export function findMissingFields(draft: FreightDraft): string[] {
  return MISSING_MAP.filter((m) => m.check(draft)).map((m) => m.field);
}

export function initialQuoteAfterSubmit(draft: FreightDraft): FreightQuote {
  const missing = findMissingFields(draft);
  if (missing.length > 0) {
    return {
      status: "needs_info",
      missingFields: missing,
      processKey: "freight.process.needsInfo",
      nextStepKey: "freight.next.needsInfo",
    };
  }
  return {
    status: "submitted",
    missingFields: [],
    processKey: "freight.process.submitted",
    nextStepKey: "freight.next.submitted",
  };
}

/** Mock progression for ops timeline simulation */
export function advanceQuoteStatus(
  status: FreightQuoteStatus,
  draft: FreightDraft,
): FreightQuote {
  const missing = findMissingFields(draft);
  if (missing.length > 0 && status !== "accepted") {
    return {
      status: "needs_info",
      missingFields: missing,
      processKey: "freight.process.needsInfo",
      nextStepKey: "freight.next.needsInfo",
    };
  }

  switch (status) {
    case "submitted":
      return {
        status: "ops_reviewing",
        missingFields: [],
        processKey: "freight.process.opsReviewing",
        nextStepKey: "freight.next.opsReviewing",
      };
    case "ops_reviewing":
      return {
        status: "quote_preparing",
        missingFields: [],
        processKey: "freight.process.quotePreparing",
        nextStepKey: "freight.next.quotePreparing",
      };
    case "needs_info":
      return {
        status: "ops_reviewing",
        missingFields: [],
        processKey: "freight.process.opsReviewing",
        nextStepKey: "freight.next.opsReviewing",
      };
    case "quote_preparing":
    case "revision_requested": {
      const base = draft.mode === "ftl" ? 18500 : 6400;
      const weightFee = Math.round(draft.totalWeightKg * 0.35);
      const total = base + weightFee + (draft.ftl.adrRequired ? 2500 : 0);
      return {
        status: "quote_ready",
        total: { amount: total, currency: "TRY" },
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        etaDaysMin: draft.mode === "ftl" ? 1 : 2,
        etaDaysMax: draft.mode === "ftl" ? 3 : 5,
        vehicleSummaryKey: `freight.vehicles.${draft.vehicleType}`,
        missingFields: [],
        processKey: "freight.process.quoteReady",
        nextStepKey: "freight.next.quoteReady",
      };
    }
    case "quote_ready":
      return {
        status: "accepted",
        total: undefined,
        missingFields: [],
        processKey: "freight.process.accepted",
        nextStepKey: "freight.next.accepted",
      };
    default:
      return {
        status,
        missingFields: [],
        processKey: "freight.process.submitted",
        nextStepKey: "freight.next.submitted",
      };
  }
}

export const QUOTE_STATUS_ORDER: FreightQuoteStatus[] = [
  "submitted",
  "ops_reviewing",
  "needs_info",
  "quote_preparing",
  "quote_ready",
  "revision_requested",
  "accepted",
];
