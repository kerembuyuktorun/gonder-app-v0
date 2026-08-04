import type { Money } from "@/types/domain";

export type SpotServiceKind =
  | "ftl"
  | "ltl"
  | "xl"
  | "parcel"
  | "courier";

export type SpotSupplierStatus =
  | "invited"
  | "waiting"
  | "quoted"
  | "declined"
  | "expired";

export type SpotQuoteSort =
  | "price_asc"
  | "price_desc"
  | "eta_asc"
  | "score_desc";

export type SpotWorkspaceStep =
  | "request"
  | "board"
  | "checkout"
  | "result";

export type SpotRequestDraft = {
  title: string;
  originCity: string;
  destinationCity: string;
  serviceKind: SpotServiceKind;
  cargoSummary: string;
  weightKg: number;
  pickupDate: string;
  notes: string;
};

export type SpotSupplier = {
  id: string;
  name: string;
  serviceKind: SpotServiceKind;
  vehicleFit: string;
  performanceScore: number;
  completedShipments: number;
  status: SpotSupplierStatus;
  opsNotes?: string;
};

export type SpotOffer = {
  id: string;
  supplierId: string;
  supplierName: string;
  serviceKind: SpotServiceKind;
  vehicleFit: string;
  price: Money;
  tax: Money;
  surcharges: Money;
  total: Money;
  etaDaysMin: number;
  etaDaysMax: number;
  insuranceCoverage: string;
  paymentTerms: string;
  validUntil: string;
  performanceScore: number;
  completedShipments: number;
  opsNotes: string;
  recommended?: boolean;
  counterOfferSent?: boolean;
  counterOfferAmount?: Money;
};

export type SpotRequest = {
  id: string;
  reference: string;
  draft: SpotRequestDraft;
  suppliers: SpotSupplier[];
  offers: SpotOffer[];
  selectedOfferId: string | null;
  status: "open" | "comparing" | "accepted" | "closed";
  createdAt: string;
};

export type CounterOfferInput = {
  requestId: string;
  offerId: string;
  amount: number;
  note: string;
};
