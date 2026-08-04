import { describe, expect, it } from "vitest";
import {
  estimateXlQuote,
  resolvePreparingQuote,
} from "@/features/xl/lib/pricing";
import { summarizeXlTotals, isBelowParcelThreshold } from "@/features/xl/lib/totals";
import { createDefaultXlDraft } from "@/mocks/data/xl";
import { mockXlRepository } from "@/mocks/repositories/mock-xl-repository";

describe("xl totals", () => {
  it("sums weight volume and desi", () => {
    const draft = createDefaultXlDraft();
    const totals = summarizeXlTotals(draft.pieces);
    expect(totals.pieceCount).toBe(2);
    expect(totals.totalWeightKg).toBe(77);
    expect(totals.totalVolumeM3).toBeGreaterThan(0.5);
    expect(totals.chargeableDesi).toBeGreaterThan(30);
    expect(isBelowParcelThreshold(draft)).toBe(false);
  });
});

describe("xl pricing states", () => {
  it("returns awaiting_info when description missing", () => {
    const draft = createDefaultXlDraft();
    draft.description = "";
    const quote = estimateXlQuote(draft);
    expect(quote.state).toBe("awaiting_info");
    expect(quote.missingFields).toContain("description");
  });

  it("returns quote_preparing for no-elevator high floors", () => {
    const draft = createDefaultXlDraft();
    // default delivery floor 4 without elevator
    const quote = estimateXlQuote(draft);
    expect(quote.state).toBe("quote_preparing");
    expect(quote.model).toBe("rule_based");
  });

  it("resolves preparing into quote_ready", () => {
    const draft = createDefaultXlDraft();
    const ready = resolvePreparingQuote(draft);
    expect(ready.state).toBe("quote_ready");
    expect(ready.total?.amount).toBeGreaterThan(0);
  });

  it("returns instant_ready for simple partner-list cases", () => {
    const draft = createDefaultXlDraft();
    draft.delivery.hasElevator = true;
    draft.delivery.floor = "1";
    draft.extras = [];
    draft.category = "palletized";
    const quote = estimateXlQuote(draft);
    expect(quote.state).toBe("instant_ready");
    expect(quote.model).toBe("partner_list");
    expect(quote.total?.amount).toBeGreaterThan(0);
  });

  it("requires ops review for very heavy shipments", () => {
    const draft = createDefaultXlDraft();
    draft.pieces = [
      {
        id: "huge",
        name: "Makine",
        lengthCm: 300,
        widthCm: 200,
        heightCm: 200,
        weightKg: 600,
      },
    ];
    const quote = estimateXlQuote(draft);
    expect(quote.state).toBe("ops_review_required");
    expect(quote.model).toBe("manual_ops");
  });
});

describe("mock xl repository", () => {
  it("gets a quote and allows checkout when ready", async () => {
    const draft = createDefaultXlDraft();
    draft.delivery.hasElevator = true;
    draft.delivery.floor = "0";
    draft.extras = [];
    draft.category = "palletized";
    const quote = await mockXlRepository.getQuote({ draft });
    expect(quote.state).toBe("instant_ready");
    const order = await mockXlRepository.checkout({
      draft,
      quote,
      paymentMethod: "invoice",
    });
    expect(order.reference).toMatch(/^GNDX/);
    expect(order.paidWith).toBe("invoice");
  });

  it("submits ops review requests", async () => {
    const draft = createDefaultXlDraft();
    const result = await mockXlRepository.submitForOpsReview(draft);
    expect(result.requestId).toMatch(/^xl_ops_/);
    expect(result.etaHours).toBeGreaterThan(0);
  });

  it("resolves preparing quotes on demand", async () => {
    const draft = createDefaultXlDraft();
    const preparing = await mockXlRepository.getQuote({ draft });
    expect(preparing.state).toBe("quote_preparing");
    const ready = await mockXlRepository.getQuote({
      draft,
      resolvePreparing: true,
    });
    expect(ready.state).toBe("quote_ready");
  });
});
