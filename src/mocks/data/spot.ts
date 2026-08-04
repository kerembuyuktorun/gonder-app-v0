import type { SpotOffer, SpotRequest, SpotRequestDraft, SpotSupplier } from "@/types/spot";

export function createDefaultSpotDraft(): SpotRequestDraft {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return {
    title: "Bursa → İstanbul mamul sevkiyatı",
    originCity: "Bursa",
    destinationCity: "İstanbul",
    serviceKind: "ftl",
    cargoSummary: "22 palet mamul, 12 ton",
    weightKg: 12000,
    pickupDate: date.toISOString().slice(0, 10),
    notes: "Forklift yükleme mevcut",
  };
}

const SUPPLIER_SEED: Array<Omit<SpotSupplier, "status">> = [
  {
    id: "sup_arf_line",
    name: "Arf Line",
    serviceKind: "ftl",
    vehicleFit: "13.6 m tenteli",
    performanceScore: 4.8,
    completedShipments: 842,
    opsNotes: "Tercih edilen partner",
  },
  {
    id: "sup_anadolu",
    name: "Anadolu Freight",
    serviceKind: "ftl",
    vehicleFit: "18 t kapalı kasa",
    performanceScore: 4.5,
    completedShipments: 510,
  },
  {
    id: "sup_ege",
    name: "Ege Spot Lojistik",
    serviceKind: "ltl",
    vehicleFit: "12 t parsiyel",
    performanceScore: 4.1,
    completedShipments: 290,
  },
  {
    id: "sup_karadeniz",
    name: "Karadeniz Nakliyat",
    serviceKind: "ftl",
    vehicleFit: "Tır / frigo opsiyon",
    performanceScore: 3.9,
    completedShipments: 176,
  },
  {
    id: "sup_marmara",
    name: "Marmara Express",
    serviceKind: "xl",
    vehicleFit: "Özel ekipman",
    performanceScore: 4.3,
    completedShipments: 120,
  },
  {
    id: "sup_deniz",
    name: "Deniz Intermodal",
    serviceKind: "ftl",
    vehicleFit: "Kombineli hat",
    performanceScore: 4.0,
    completedShipments: 88,
  },
];

export function buildInvitedSuppliers(): SpotSupplier[] {
  return SUPPLIER_SEED.map((s, index) => ({
    ...s,
    status:
      index === 5
        ? "declined"
        : index === 4
          ? "waiting"
          : index < 4
            ? "quoted"
            : "invited",
  }));
}

export function buildMockOffers(requestId: string): SpotOffer[] {
  const currency = "TRY";
  const base: Array<Omit<SpotOffer, "id">> = [
    {
      supplierId: "sup_arf_line",
      supplierName: "Arf Line",
      serviceKind: "ftl",
      vehicleFit: "13.6 m tenteli",
      price: { amount: 18500, currency },
      tax: { amount: 3700, currency },
      surcharges: { amount: 450, currency },
      total: { amount: 22650, currency },
      etaDaysMin: 1,
      etaDaysMax: 2,
      insuranceCoverage: "500.000 TRY",
      paymentTerms: "Peşin / 7 gün vade",
      validUntil: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      performanceScore: 4.8,
      completedShipments: 842,
      opsNotes: "En dengeli fiyat / süre",
      recommended: true,
    },
    {
      supplierId: "sup_anadolu",
      supplierName: "Anadolu Freight",
      serviceKind: "ftl",
      vehicleFit: "18 t kapalı kasa",
      price: { amount: 17200, currency },
      tax: { amount: 3440, currency },
      surcharges: { amount: 600, currency },
      total: { amount: 21240, currency },
      etaDaysMin: 2,
      etaDaysMax: 3,
      insuranceCoverage: "300.000 TRY",
      paymentTerms: "Peşin",
      validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      performanceScore: 4.5,
      completedShipments: 510,
      opsNotes: "En düşük fiyat",
    },
    {
      supplierId: "sup_ege",
      supplierName: "Ege Spot Lojistik",
      serviceKind: "ltl",
      vehicleFit: "12 t parsiyel",
      price: { amount: 9800, currency },
      tax: { amount: 1960, currency },
      surcharges: { amount: 300, currency },
      total: { amount: 12060, currency },
      etaDaysMin: 3,
      etaDaysMax: 5,
      insuranceCoverage: "150.000 TRY",
      paymentTerms: "Peşin",
      validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      performanceScore: 4.1,
      completedShipments: 290,
      opsNotes: "Parsiyel — rota aktarmalı",
    },
    {
      supplierId: "sup_karadeniz",
      supplierName: "Karadeniz Nakliyat",
      serviceKind: "ftl",
      vehicleFit: "Tır",
      price: { amount: 19800, currency },
      tax: { amount: 3960, currency },
      surcharges: { amount: 200, currency },
      total: { amount: 23960, currency },
      etaDaysMin: 1,
      etaDaysMax: 1,
      insuranceCoverage: "400.000 TRY",
      paymentTerms: "Peşin / 14 gün vade",
      validUntil: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      performanceScore: 3.9,
      completedShipments: 176,
      opsNotes: "En hızlı teslimat",
    },
  ];

  return base.map((o, i) => ({
    ...o,
    id: `${requestId}_offer_${i + 1}`,
  }));
}

export const MOCK_SAVED_CARDS = [
  {
    id: "card_visa_4242",
    brand: "Visa",
    last4: "4242",
    expMonth: 8,
    expYear: 2028,
  },
  {
    id: "card_mc_4444",
    brand: "Mastercard",
    last4: "4444",
    expMonth: 11,
    expYear: 2027,
  },
];

export const MOCK_WALLET_BALANCE = { amount: 50000, currency: "TRY" };

export type { SpotRequest };
