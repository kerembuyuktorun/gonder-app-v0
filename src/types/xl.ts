import type { Money } from "@/types/domain";

export type XlWizardStepId = "form" | "quote" | "checkout" | "success";

export type XlProductCategory =
  | "furniture"
  | "appliance"
  | "electronics"
  | "machinery"
  | "palletized"
  | "other";

export type XlPackaging =
  | "original"
  | "pallet"
  | "crate"
  | "blanket"
  | "none";

export type XlExtraService =
  | "extra_crew"
  | "assembly"
  | "disassembly"
  | "insurance"
  | "floor_protection"
  | "weekend";

export type XlPricingModel =
  | "partner_list"
  | "rule_based"
  | "manual_ops";

export type XlPricingState =
  | "calculating"
  | "instant_ready"
  | "ops_review_required"
  | "awaiting_info"
  | "quote_preparing"
  | "quote_ready"
  | "service_unavailable";

export type XlAddress = {
  line1: string;
  district: string;
  city: string;
  postalCode?: string;
  floor: string;
  hasElevator: boolean;
};

export type XlPiece = {
  id: string;
  name: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
};

export type XlPhoto = {
  id: string;
  name: string;
  sizeLabel: string;
};

export type XlDraft = {
  pickup: XlAddress;
  delivery: XlAddress;
  category: XlProductCategory;
  description: string;
  pieces: XlPiece[];
  photos: XlPhoto[];
  packaging: XlPackaging;
  extras: XlExtraService[];
  transportDate: string;
  notes: string;
  declaredValue: Money;
};

export type XlTotals = {
  pieceCount: number;
  totalWeightKg: number;
  totalVolumeM3: number;
  chargeableDesi: number;
};

export type XlQuoteLine = {
  id: string;
  labelKey: string;
  amount: Money;
};

export type XlQuote = {
  state: XlPricingState;
  model: XlPricingModel;
  currency: string;
  lines: XlQuoteLine[];
  total?: Money;
  validUntil?: string;
  partnerNameKey?: string;
  etaDaysMin?: number;
  etaDaysMax?: number;
  missingFields: string[];
  nextStepKey: string;
  processKey: string;
  warnings: string[];
};

export type XlOrderResult = {
  orderId: string;
  reference: string;
  quote: XlQuote;
  paidWith: "card" | "balance" | "invoice";
  total: Money;
};
