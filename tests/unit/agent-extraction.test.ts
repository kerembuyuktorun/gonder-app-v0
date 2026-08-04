import { describe, expect, it } from "vitest";
import {
  classifyServiceType,
  createEmptyDraft,
  mergeExtraction,
} from "@/features/agent/lib/extraction";

describe("AI extraction", () => {
  it("classifies FTL from komple yük / kapalı kasa", () => {
    const result = classifyServiceType(
      "İstanbul'dan Ankara'ya bugün kapalı kasa komple yük göndereceğim.",
    );
    expect(result.serviceType).toBe("ftl");
    expect(result.confidence).toBe("high");
  });

  it("classifies LTL from palet", () => {
    const result = classifyServiceType(
      "Yarın Antalya'dan İstanbul'a üç palet ürün göndermem gerekiyor.",
    );
    expect(result.serviceType).toBe("ltl");
  });

  it("classifies courier for evrak / urban", () => {
    const result = classifyServiceType(
      "Kadıköy'den Maslak'a bugün bir evrak götüreceğim.",
    );
    expect(result.serviceType).toBe("courier");
  });

  it("classifies parcel by desi", () => {
    const result = classifyServiceType(
      "İzmir'den Bursa'ya 12 desilik bir koli göndermek istiyorum.",
    );
    expect(result.serviceType).toBe("parcel_1_30");
  });

  it("extracts route, date and package fields into draft", () => {
    const draft = mergeExtraction(
      createEmptyDraft("d1"),
      "İzmir'den Bursa'ya 12 desilik bir koli göndermek istiyorum. Yarın.",
    );
    expect(draft.origin).toMatch(/İzmir/i);
    expect(draft.destination).toMatch(/Bursa/i);
    expect(draft.weightDesi).toBe("12");
    expect(draft.pickupDate).toBeTruthy();
    expect(draft.missingFields).not.toContain("origin");
  });

  it("flags desi mismatch for parcel > 30", () => {
    const draft = mergeExtraction(
      createEmptyDraft("d2"),
      "İstanbul'dan Ankara'ya 45 desi koli kargo",
    );
    // 45 desi should classify as XL, but if forced parcel, issue appears
    expect(draft.serviceType).toBe("gonder_xl");
  });
});
