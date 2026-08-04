import type {
  CarrierId,
  CarrierProfile,
  ParcelDesiSummary,
  ParcelQuoteOffer,
  ParcelServiceLevel,
  ParcelShipmentDraft,
} from "@/types/parcel";
import { summarizeDesi } from "@/features/parcel/lib/desi";

export const CARRIERS: CarrierProfile[] = [
  { id: "yurtici", nameKey: "parcel.carriers.yurtici", logoInitials: "YK" },
  { id: "aras", nameKey: "parcel.carriers.aras", logoInitials: "AR" },
  { id: "mng", nameKey: "parcel.carriers.mng", logoInitials: "MG" },
  { id: "ptt", nameKey: "parcel.carriers.ptt", logoInitials: "PT" },
  { id: "surat", nameKey: "parcel.carriers.surat", logoInitials: "SK" },
  { id: "horoz", nameKey: "parcel.carriers.horoz", logoInitials: "HZ" },
];

type CarrierRule = {
  id: CarrierId;
  base: number;
  perDesi: number;
  pickupFee: number;
  levels: ParcelServiceLevel[];
  eta: Record<ParcelServiceLevel, [number, number]>;
  insuranceIncluded: boolean;
  insuranceLimit: number;
};

const RULES: CarrierRule[] = [
  {
    id: "yurtici",
    base: 89,
    perDesi: 12,
    pickupFee: 35,
    levels: ["standard", "express"],
    eta: { economy: [3, 5], standard: [2, 3], express: [1, 2] },
    insuranceIncluded: true,
    insuranceLimit: 2000,
  },
  {
    id: "aras",
    base: 79,
    perDesi: 11,
    pickupFee: 30,
    levels: ["economy", "standard", "express"],
    eta: { economy: [4, 6], standard: [2, 4], express: [1, 2] },
    insuranceIncluded: false,
    insuranceLimit: 1500,
  },
  {
    id: "mng",
    base: 84,
    perDesi: 11.5,
    pickupFee: 28,
    levels: ["standard", "express"],
    eta: { economy: [3, 5], standard: [2, 3], express: [1, 1] },
    insuranceIncluded: true,
    insuranceLimit: 2500,
  },
  {
    id: "ptt",
    base: 69,
    perDesi: 9.5,
    pickupFee: 25,
    levels: ["economy", "standard"],
    eta: { economy: [4, 7], standard: [3, 5], express: [2, 3] },
    insuranceIncluded: false,
    insuranceLimit: 1000,
  },
  {
    id: "surat",
    base: 75,
    perDesi: 10.5,
    pickupFee: 32,
    levels: ["standard", "express"],
    eta: { economy: [3, 5], standard: [2, 4], express: [1, 2] },
    insuranceIncluded: true,
    insuranceLimit: 1800,
  },
  {
    id: "horoz",
    base: 95,
    perDesi: 13,
    pickupFee: 40,
    levels: ["standard", "express"],
    eta: { economy: [3, 4], standard: [2, 3], express: [1, 2] },
    insuranceIncluded: true,
    insuranceLimit: 5000,
  },
];

function cityDistanceFactor(from: string, to: string): number {
  if (from === to) return 0.85;
  const metro = new Set(["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"]);
  if (metro.has(from) && metro.has(to)) return 1;
  return 1.15;
}

export function buildCarrierOffers(
  draft: ParcelShipmentDraft,
  desi: ParcelDesiSummary = summarizeDesi(draft.packages),
): ParcelQuoteOffer[] {
  if (desi.exceedsParcelLimit || desi.packageCount === 0) return [];

  const factor = cityDistanceFactor(draft.pickup.city, draft.delivery.city);
  const wantsInsurance = draft.extras.includes("insurance");
  const validUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  const offers: ParcelQuoteOffer[] = [];

  for (const rule of RULES) {
    for (const level of rule.levels) {
      const transport =
        (rule.base + rule.perDesi * desi.chargeableDesi) * factor;
      const surcharges: ParcelQuoteOffer["surcharges"] = [];

      if (draft.pickupFromAddress) {
        surcharges.push({
          id: "pickup",
          labelKey: "parcel.surcharges.pickup",
          amount: { amount: Math.round(rule.pickupFee), currency: "TRY" },
        });
      }
      if (wantsInsurance && !rule.insuranceIncluded) {
        const premium = Math.max(
          15,
          Math.round(draft.declaredValue.amount * 0.01),
        );
        surcharges.push({
          id: "insurance",
          labelKey: "parcel.surcharges.insurance",
          amount: { amount: premium, currency: "TRY" },
        });
      }
      if (draft.extras.includes("cod")) {
        surcharges.push({
          id: "cod",
          labelKey: "parcel.surcharges.cod",
          amount: { amount: 25, currency: "TRY" },
        });
      }
      if (draft.extras.includes("sms")) {
        surcharges.push({
          id: "sms",
          labelKey: "parcel.surcharges.sms",
          amount: { amount: 5, currency: "TRY" },
        });
      }
      if (draft.extras.includes("weekend_delivery")) {
        surcharges.push({
          id: "weekend",
          labelKey: "parcel.surcharges.weekend",
          amount: { amount: 40, currency: "TRY" },
        });
      }
      if (draft.extras.includes("fragile")) {
        surcharges.push({
          id: "fragile",
          labelKey: "parcel.surcharges.fragile",
          amount: { amount: 20, currency: "TRY" },
        });
      }
      if (level === "express") {
        surcharges.push({
          id: "express",
          labelKey: "parcel.surcharges.express",
          amount: {
            amount: Math.round(transport * 0.35),
            currency: "TRY",
          },
        });
      }
      if (level === "economy") {
        surcharges.push({
          id: "economy",
          labelKey: "parcel.surcharges.economy",
          amount: {
            amount: -Math.round(transport * 0.12),
            currency: "TRY",
          },
        });
      }

      const surchargeTotal = surcharges.reduce(
        (sum, s) => sum + s.amount.amount,
        0,
      );
      const baseRounded = Math.round(transport);
      const total = baseRounded + surchargeTotal;
      const [etaMin, etaMax] = rule.eta[level];
      const score =
        1000 -
        total -
        etaMax * 15 +
        (rule.insuranceIncluded ? 20 : 0) +
        (draft.pickupFromAddress && rule.pickupFee < 35 ? 10 : 0);

      offers.push({
        id: `${rule.id}_${level}`,
        carrierId: rule.id,
        carrierNameKey: `parcel.carriers.${rule.id}`,
        total: { amount: total, currency: "TRY" },
        basePrice: { amount: baseRounded, currency: "TRY" },
        surcharges,
        etaDaysMin: etaMin,
        etaDaysMax: etaMax,
        pickupFromAddress: true,
        serviceLevel: level,
        insuranceIncluded: rule.insuranceIncluded || wantsInsurance,
        insuranceLimit: {
          amount: rule.insuranceLimit,
          currency: "TRY",
        },
        returnPolicyKey: `parcel.returnPolicy.${rule.id}`,
        validUntil,
        score,
      });
    }
  }

  return offers.sort((a, b) => a.total.amount - b.total.amount);
}
