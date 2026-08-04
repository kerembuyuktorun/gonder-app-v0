import { describe, expect, it } from "vitest";
import {
  createEmptyPackage,
  packageChargeableDesi,
  packageVolumetricDesi,
  summarizeDesi,
  PARCEL_MAX_DESI,
} from "@/features/parcel/lib/desi";
import { buildCarrierOffers } from "@/features/parcel/lib/quoting";
import { createDefaultParcelDraft } from "@/mocks/data/parcel";
import { mockParcelRepository } from "@/mocks/repositories/mock-parcel-repository";

describe("desi calculator", () => {
  it("computes volumetric and chargeable desi per package", () => {
    const pkg = {
      id: "1",
      lengthCm: 60,
      widthCm: 40,
      heightCm: 40,
      weightKg: 5,
    };
    // 60*40*40/3000 = 32
    expect(packageVolumetricDesi(pkg)).toBe(32);
    expect(packageChargeableDesi(pkg)).toBe(32);
  });

  it("uses weight when heavier than volumetric", () => {
    const pkg = {
      id: "1",
      lengthCm: 20,
      widthCm: 20,
      heightCm: 20,
      weightKg: 8,
    };
    expect(packageVolumetricDesi(pkg)).toBeCloseTo(2.67, 1);
    expect(packageChargeableDesi(pkg)).toBe(8);
  });

  it("flags Gönder XL when chargeable desi exceeds 30", () => {
    const summary = summarizeDesi([
      {
        id: "a",
        lengthCm: 80,
        widthCm: 50,
        heightCm: 50,
        weightKg: 10,
      },
    ]);
    expect(summary.chargeableDesi).toBeGreaterThan(PARCEL_MAX_DESI);
    expect(summary.suggestGonderXl).toBe(true);
    expect(summary.exceedsParcelLimit).toBe(true);
  });

  it("sums multiple packages", () => {
    const summary = summarizeDesi([
      createEmptyPackage(),
      {
        id: "2",
        lengthCm: 30,
        widthCm: 20,
        heightCm: 15,
        weightKg: 2,
      },
    ]);
    expect(summary.packageCount).toBe(2);
    expect(summary.suggestGonderXl).toBe(false);
  });
});

describe("carrier quoting", () => {
  it("returns multiple carrier offers under the desi limit", () => {
    const draft = createDefaultParcelDraft();
    const offers = buildCarrierOffers(draft);
    expect(offers.length).toBeGreaterThan(5);
    expect(offers.every((o) => o.total.amount > 0)).toBe(true);
    expect(offers[0].total.amount).toBeLessThanOrEqual(offers[1].total.amount);
  });

  it("adds pickup surcharge when address pickup is enabled", () => {
    const draft = createDefaultParcelDraft();
    draft.pickupFromAddress = true;
    const offers = buildCarrierOffers(draft);
    expect(
      offers.some((o) => o.surcharges.some((s) => s.id === "pickup")),
    ).toBe(true);
  });
});

describe("mock parcel repository", () => {
  it("lists templates, previous shipments and integrations", async () => {
    const [templates, previous, integrations] = await Promise.all([
      mockParcelRepository.listTemplates(),
      mockParcelRepository.listPreviousShipments(),
      mockParcelRepository.listIntegrationOrders(),
    ]);
    expect(templates.length).toBeGreaterThan(0);
    expect(previous.length).toBeGreaterThan(0);
    expect(integrations.length).toBeGreaterThan(0);
  });

  it("returns quotes for a valid draft", async () => {
    const draft = createDefaultParcelDraft();
    const result = await mockParcelRepository.getQuotes(draft);
    expect(result.suggestGonderXl).toBe(false);
    expect(result.offers.length).toBeGreaterThan(0);
    expect(result.desi.chargeableDesi).toBeGreaterThan(0);
  });

  it("suggests XL and returns no offers when over limit", async () => {
    const draft = createDefaultParcelDraft();
    draft.packages = [
      {
        id: "big",
        lengthCm: 100,
        widthCm: 80,
        heightCm: 80,
        weightKg: 40,
      },
    ];
    const result = await mockParcelRepository.getQuotes(draft);
    expect(result.suggestGonderXl).toBe(true);
    expect(result.offers).toHaveLength(0);
  });

  it("checks out with balance and returns label", async () => {
    const draft = createDefaultParcelDraft();
    const quotes = await mockParcelRepository.getQuotes(draft);
    const offer = quotes.offers[0];
    const order = await mockParcelRepository.checkout({
      draft,
      offerId: offer.id,
      paymentMethod: "balance",
    });
    expect(order.trackingNumber).toMatch(/^GNDP/);
    expect(order.label.barcode.length).toBeGreaterThan(5);
    expect(order.paidWith).toBe("balance");
  });

  it("parses excel upload into a draft", async () => {
    const draft = await mockParcelRepository.parseExcelUpload("bulk.xlsx");
    expect(draft.method).toBe("excel_bulk");
    expect(draft.excelFileName).toBe("bulk.xlsx");
    expect(draft.packages.length).toBeGreaterThan(1);
  });
});
