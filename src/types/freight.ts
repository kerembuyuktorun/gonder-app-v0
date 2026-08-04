import type { Money } from "@/types/domain";

export type FreightMode = "ftl" | "ltl";

export type FreightWizardStepId =
  | "select"
  | "form"
  | "status"
  | "success";

export type FreightCargoType =
  | "general"
  | "palletized"
  | "bulk"
  | "fragile"
  | "food"
  | "hazardous";

export type FreightLoadMethod =
  | "forklift"
  | "manual"
  | "ramp"
  | "crane"
  | "dock";

export type FreightVehicleType =
  | "van"
  | "truck_7_5"
  | "truck_12"
  | "truck_18"
  | "trailer_40"
  | "trailer_90";

export type FreightBodyType =
  | "closed"
  | "curtain"
  | "reefer"
  | "open"
  | "flatbed";

export type FreightQuoteStatus =
  | "submitted"
  | "ops_reviewing"
  | "needs_info"
  | "quote_preparing"
  | "quote_ready"
  | "revision_requested"
  | "accepted";

export type FreightAddress = {
  line1: string;
  district: string;
  city: string;
  postalCode?: string;
};

export type FreightCargoLine = {
  id: string;
  description: string;
  pallets: number;
  boxes: number;
  weightKg: number;
};

export type FreightAttachment = {
  id: string;
  name: string;
  kind: "photo" | "document";
  sizeLabel: string;
};

export type FreightFtlDetails = {
  vehicleCapacityTons: number;
  vehicleLengthM: number;
  multiVehicle: boolean;
  vehicleCount: number;
  bodyClosed: boolean;
  bodyCurtain: boolean;
  bodyReefer: boolean;
  bodyOpen: boolean;
  adrRequired: boolean;
  specialRequirements: string;
};

export type FreightLtlDetails = {
  volumeM3: number;
  loadingMeters: number;
  stackable: boolean;
  hubTransferOk: boolean;
  flexibleDelivery: boolean;
  constraints: string;
};

export type FreightDraft = {
  mode: FreightMode | null;
  loading: FreightAddress;
  delivery: FreightAddress;
  loadingDate: string;
  loadingWindowStart: string;
  loadingWindowEnd: string;
  deliveryExpectation: string;
  cargoType: FreightCargoType;
  totalWeightKg: number;
  lines: FreightCargoLine[];
  loadMethod: FreightLoadMethod;
  vehicleType: FreightVehicleType;
  bodyType: FreightBodyType;
  attachments: FreightAttachment[];
  notes: string;
  ftl: FreightFtlDetails;
  ltl: FreightLtlDetails;
};

export type FreightMessage = {
  id: string;
  author: "customer" | "ops";
  authorName: string;
  body: string;
  createdAt: string;
};

export type FreightQuote = {
  status: FreightQuoteStatus;
  total?: Money;
  validUntil?: string;
  etaDaysMin?: number;
  etaDaysMax?: number;
  vehicleSummaryKey?: string;
  missingFields: string[];
  processKey: string;
  nextStepKey: string;
};

export type FreightRequest = {
  id: string;
  reference: string;
  mode: FreightMode;
  draft: FreightDraft;
  quote: FreightQuote;
  messages: FreightMessage[];
  createdAt: string;
  updatedAt: string;
};

export type FreightModeRecommendation = {
  suggested: FreightMode;
  reasonKey: string;
  warnIfSelected?: FreightMode;
  warningKey?: string;
};
