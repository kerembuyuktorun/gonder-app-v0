import { describe, expect, it } from "vitest";
import {
  detectMismatch,
  recommendFreightMode,
} from "@/features/freight/lib/recommendation";
import {
  advanceQuoteStatus,
  initialQuoteAfterSubmit,
} from "@/features/freight/lib/status";
import { createDefaultFreightDraft } from "@/mocks/data/freight";
import { mockFreightRepository } from "@/mocks/repositories/mock-freight-repository";

describe("freight mode recommendation", () => {
  it("suggests FTL for heavy loads", () => {
    const rec = recommendFreightMode({
      totalWeightKg: 12000,
      pallets: 22,
    });
    expect(rec.suggested).toBe("ftl");
    expect(rec.warnIfSelected).toBe("ltl");
  });

  it("suggests LTL for light loads", () => {
    const rec = recommendFreightMode({
      totalWeightKg: 1200,
      pallets: 4,
      volumeM3: 6,
      loadingMeters: 2,
    });
    expect(rec.suggested).toBe("ltl");
    expect(rec.warnIfSelected).toBe("ftl");
  });

  it("detects mismatch when heavy draft uses LTL", () => {
    const draft = createDefaultFreightDraft("ltl");
    draft.totalWeightKg = 15000;
    draft.lines[0].pallets = 24;
    const mismatch = detectMismatch("ltl", draft);
    expect(mismatch?.warnIfSelected).toBe("ltl");
  });
});

describe("freight quote status", () => {
  it("starts as submitted for complete drafts", () => {
    const draft = createDefaultFreightDraft("ftl");
    const quote = initialQuoteAfterSubmit(draft);
    expect(quote.status).toBe("submitted");
  });

  it("flags needs_info when addresses missing", () => {
    const draft = createDefaultFreightDraft("ftl");
    draft.loading.line1 = "";
    const quote = initialQuoteAfterSubmit(draft);
    expect(quote.status).toBe("needs_info");
    expect(quote.missingFields).toContain("loading");
  });

  it("advances toward a ready quote with amount", () => {
    const draft = createDefaultFreightDraft("ftl");
    let quote = initialQuoteAfterSubmit(draft);
    quote = advanceQuoteStatus(quote.status, draft);
    expect(quote.status).toBe("ops_reviewing");
    quote = advanceQuoteStatus(quote.status, draft);
    expect(quote.status).toBe("quote_preparing");
    quote = advanceQuoteStatus(quote.status, draft);
    expect(quote.status).toBe("quote_ready");
    expect(quote.total?.amount).toBeGreaterThan(0);
  });
});

describe("mock freight repository", () => {
  it("submits FTL and advances to accepted", async () => {
    const draft = createDefaultFreightDraft("ftl");
    const { request } = await mockFreightRepository.submit(draft);
    expect(request.reference).toMatch(/^GNDF/);
    expect(request.mode).toBe("ftl");

    let current = await mockFreightRepository.advanceStatus(request.id);
    current = await mockFreightRepository.advanceStatus(current.id);
    current = await mockFreightRepository.advanceStatus(current.id);
    expect(current.quote.status).toBe("quote_ready");

    const accepted = await mockFreightRepository.acceptQuote(current.id);
    expect(accepted.quote.status).toBe("accepted");
  });

  it("supports messaging and revision", async () => {
    const draft = createDefaultFreightDraft("ltl");
    const { request } = await mockFreightRepository.submit(draft);
    const messages = await mockFreightRepository.sendMessage(
      request.id,
      "Palet ölçüleri eklendi, kontrol eder misiniz?",
    );
    expect(messages.at(-1)?.author).toBe("customer");

    let current = request;
    current = await mockFreightRepository.advanceStatus(current.id);
    current = await mockFreightRepository.advanceStatus(current.id);
    current = await mockFreightRepository.advanceStatus(current.id);
    expect(current.quote.status).toBe("quote_ready");

    const revised = await mockFreightRepository.requestRevision(
      current.id,
      "Fiyatı gözden geçirelim",
    );
    expect(revised.quote.status).toBe("revision_requested");
  });
});
