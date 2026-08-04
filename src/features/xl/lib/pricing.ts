import type { XlDraft, XlPricingModel, XlQuote } from "@/types/xl";
import { summarizeXlTotals } from "@/features/xl/lib/totals";

function hasFloorAccessGap(draft: XlDraft): boolean {
  return (
    (!draft.pickup.hasElevator && Number(draft.pickup.floor) >= 3) ||
    (!draft.delivery.hasElevator && Number(draft.delivery.floor) >= 3)
  );
}

function needsMoreInfo(draft: XlDraft): string[] {
  const missing: string[] = [];
  if (!draft.description.trim()) missing.push("description");
  if (draft.pieces.length === 0) missing.push("pieces");
  if (draft.pieces.some((p) => !p.weightKg || !p.lengthCm)) missing.push("dimensions");
  if (!draft.transportDate) missing.push("transportDate");
  if (draft.photos.length === 0 && draft.category === "machinery") {
    missing.push("photos");
  }
  if (!draft.pickup.line1 || !draft.delivery.line1) missing.push("addresses");
  return missing;
}

function resolveModel(draft: XlDraft, totals: ReturnType<typeof summarizeXlTotals>): XlPricingModel {
  if (totals.chargeableDesi > 400 || totals.totalWeightKg > 500) return "manual_ops";
  if (
    draft.category === "machinery" ||
    draft.extras.includes("assembly") ||
    hasFloorAccessGap(draft)
  ) {
    return "rule_based";
  }
  return "partner_list";
}

export function estimateXlQuote(draft: XlDraft): XlQuote {
  const totals = summarizeXlTotals(draft.pieces);
  const missing = needsMoreInfo(draft);

  if (missing.length > 0) {
    return {
      state: "awaiting_info",
      model: "rule_based",
      currency: "TRY",
      lines: [],
      missingFields: missing,
      nextStepKey: "xl.next.awaitingInfo",
      processKey: "xl.process.awaitingInfo",
      warnings: [],
    };
  }

  if (totals.pieceCount === 0 || totals.totalWeightKg <= 0) {
    return {
      state: "service_unavailable",
      model: "manual_ops",
      currency: "TRY",
      lines: [],
      missingFields: [],
      nextStepKey: "xl.next.unavailable",
      processKey: "xl.process.unavailable",
      warnings: ["xl.warnings.emptyShipment"],
    };
  }

  const model = resolveModel(draft, totals);

  if (model === "manual_ops") {
    return {
      state: "ops_review_required",
      model,
      currency: "TRY",
      lines: [],
      missingFields: [],
      nextStepKey: "xl.next.opsReview",
      processKey: "xl.process.opsReview",
      warnings: ["xl.warnings.heavyOrComplex"],
      partnerNameKey: "xl.partners.opsDesk",
    };
  }

  if (model === "rule_based") {
    // Semi-auto: first "preparing", caller can re-fetch to get ready
    const base = 890 + totals.chargeableDesi * 18 + totals.totalWeightKg * 4;
    const extrasTotal = draft.extras.reduce((sum, e) => {
      const map: Record<string, number> = {
        extra_crew: 350,
        assembly: 450,
        disassembly: 300,
        insurance: Math.max(80, Math.round(draft.declaredValue.amount * 0.015)),
        floor_protection: 120,
        weekend: 200,
      };
      return sum + (map[e] ?? 0);
    }, 0);
    if (hasFloorAccessGap(draft)) {
      // Still needs ops for no-elevator high floors after rule draft
      return {
        state: "quote_preparing",
        model,
        currency: "TRY",
        lines: [],
        missingFields: [],
        nextStepKey: "xl.next.preparing",
        processKey: "xl.process.preparing",
        warnings: ["xl.warnings.noElevator"],
        partnerNameKey: "xl.partners.regionPartner",
      };
    }
    const transport = Math.round(base);
    return {
      state: "quote_ready",
      model,
      currency: "TRY",
      lines: [
        {
          id: "transport",
          labelKey: "xl.price.transport",
          amount: { amount: transport, currency: "TRY" },
        },
        ...(extrasTotal
          ? [
              {
                id: "extras",
                labelKey: "xl.price.extras",
                amount: { amount: extrasTotal, currency: "TRY" },
              },
            ]
          : []),
      ],
      total: { amount: transport + extrasTotal, currency: "TRY" },
      validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      partnerNameKey: "xl.partners.regionPartner",
      etaDaysMin: 2,
      etaDaysMax: 5,
      missingFields: [],
      nextStepKey: "xl.next.quoteReady",
      processKey: "xl.process.quoteReady",
      warnings: [],
    };
  }

  // partner_list → instant
  const base = 720 + totals.chargeableDesi * 14 + totals.totalVolumeM3 * 400;
  const floorFee =
    (Number(draft.pickup.floor) > 0 && !draft.pickup.hasElevator ? 150 : 0) +
    (Number(draft.delivery.floor) > 0 && !draft.delivery.hasElevator ? 150 : 0);
  const extrasTotal = draft.extras.reduce((sum, e) => {
    const map: Record<string, number> = {
      extra_crew: 280,
      assembly: 400,
      disassembly: 250,
      insurance: Math.max(60, Math.round(draft.declaredValue.amount * 0.012)),
      floor_protection: 90,
      weekend: 160,
    };
    return sum + (map[e] ?? 0);
  }, 0);
  const transport = Math.round(base + floorFee);
  return {
    state: "instant_ready",
    model: "partner_list",
    currency: "TRY",
    lines: [
      {
        id: "transport",
        labelKey: "xl.price.transport",
        amount: { amount: transport, currency: "TRY" },
      },
      ...(floorFee
        ? [
            {
              id: "floor",
              labelKey: "xl.price.floorAccess",
              amount: { amount: floorFee, currency: "TRY" },
            },
          ]
        : []),
      ...(extrasTotal
        ? [
            {
              id: "extras",
              labelKey: "xl.price.extras",
              amount: { amount: extrasTotal, currency: "TRY" },
            },
          ]
        : []),
    ],
    total: { amount: transport + extrasTotal, currency: "TRY" },
    validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    partnerNameKey: "xl.partners.listPartner",
    etaDaysMin: 1,
    etaDaysMax: 3,
    missingFields: [],
    nextStepKey: "xl.next.instantReady",
    processKey: "xl.process.instantReady",
    warnings: [],
  };
}

/** Second-pass for quote_preparing → quote_ready or ops_review */
export function resolvePreparingQuote(draft: XlDraft): XlQuote {
  const first = estimateXlQuote(draft);
  if (first.state !== "quote_preparing") return first;

  const totals = summarizeXlTotals(draft.pieces);
  const transport = Math.round(950 + totals.chargeableDesi * 20);
  const crew = draft.extras.includes("extra_crew") ? 400 : 250;
  return {
    state: "quote_ready",
    model: "rule_based",
    currency: "TRY",
    lines: [
      {
        id: "transport",
        labelKey: "xl.price.transport",
        amount: { amount: transport, currency: "TRY" },
      },
      {
        id: "access",
        labelKey: "xl.price.floorAccess",
        amount: { amount: crew, currency: "TRY" },
      },
    ],
    total: { amount: transport + crew, currency: "TRY" },
    validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    partnerNameKey: "xl.partners.regionPartner",
    etaDaysMin: 3,
    etaDaysMax: 6,
    missingFields: [],
    nextStepKey: "xl.next.quoteReady",
    processKey: "xl.process.quoteReady",
    warnings: ["xl.warnings.noElevator"],
  };
}
