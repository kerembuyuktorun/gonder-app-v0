import { describe, expect, it } from "vitest";
import {
  calculateDesi,
  getRequestQuotes,
} from "@/features/request-engine/lib/quotes";
import { createRequestDraft } from "@/types/request-engine";

describe("shared request engine", () => {
  it("calculates volumetric weight and applies actual-weight floor", () => {
    const draft = createRequestDraft();
    expect(calculateDesi(draft)).toBe(8);
    expect(calculateDesi({ ...draft, weight: 12 })).toBe(12);
  });

  it("returns comparable instant parcel quotes", () => {
    const quotes = getRequestQuotes({
      ...createRequestDraft(),
      operationType: "parcel",
    });
    expect(quotes).toHaveLength(3);
    expect(quotes.every((quote) => quote.price)).toBe(true);
    expect(quotes.some((quote) => quote.recommended)).toBe(true);
    expect(quotes.some((quote) => quote.fastest)).toBe(true);
  });

  it("models logistics estimates and asynchronous quote preparation", () => {
    const quotes = getRequestQuotes({
      ...createRequestDraft(),
      operationType: "logistics",
      logisticsMode: "ftl",
    });
    expect(quotes.some((quote) => quote.price)).toBe(true);
    expect(quotes.some((quote) => quote.preparing && !quote.price)).toBe(true);
  });
});
