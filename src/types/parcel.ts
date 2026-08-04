import type { Money } from "@/types/domain";

export type ParcelCreationMethod =
  | "manual"
  | "copy_previous"
  | "template"
  | "excel_bulk"
  | "integration_order";

export type ParcelWizardStepId =
  | "method"
  | "shipment"
  | "quotes"
  | "checkout"
  | "success";

export type ParcelExtraService =
  | "insurance"
  | "cod"
  | "sms"
  | "weekend_delivery"
  | "fragile";

export type ParcelParty = {
  name: string;
  company?: string;
  phone: string;
  email?: string;
};

export type ParcelAddress = {
  line1: string;
  line2?: string;
  district: string;
  city: string;
  postalCode?: string;
  country: string;
};

export type ParcelPackage = {
  id: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
};

export type ParcelShipmentDraft = {
  method: ParcelCreationMethod;
  templateId?: string | null;
  previousShipmentId?: string | null;
  integrationOrderId?: string | null;
  excelFileName?: string | null;
  sender: ParcelParty;
  recipient: ParcelParty;
  pickup: ParcelAddress;
  delivery: ParcelAddress;
  returnAddress?: ParcelAddress | null;
  useReturnAddress: boolean;
  packages: ParcelPackage[];
  contentDescription: string;
  declaredValue: Money;
  pickupFromAddress: boolean;
  extras: ParcelExtraService[];
};

export type CarrierId =
  | "yurtici"
  | "aras"
  | "mng"
  | "ptt"
  | "surat"
  | "horoz";

export type CarrierProfile = {
  id: CarrierId;
  nameKey: string;
  logoInitials: string;
};

export type ParcelServiceLevel = "standard" | "express" | "economy";

export type ParcelQuoteOffer = {
  id: string;
  carrierId: CarrierId;
  carrierNameKey: string;
  total: Money;
  basePrice: Money;
  surcharges: Array<{ id: string; labelKey: string; amount: Money }>;
  etaDaysMin: number;
  etaDaysMax: number;
  pickupFromAddress: boolean;
  serviceLevel: ParcelServiceLevel;
  insuranceIncluded: boolean;
  insuranceLimit?: Money;
  returnPolicyKey: string;
  validUntil: string;
  score: number;
};

export type ParcelQuoteSort =
  | "price_asc"
  | "price_desc"
  | "eta_asc"
  | "carrier_asc";

export type ParcelQuoteViewMode = "table" | "cards";

export type ParcelDesiSummary = {
  volumetricDesi: number;
  chargeableDesi: number;
  totalWeightKg: number;
  packageCount: number;
  exceedsParcelLimit: boolean;
  suggestGonderXl: boolean;
};

export type ParcelLabel = {
  trackingNumber: string;
  barcode: string;
  carrierId: CarrierId;
  carrierNameKey: string;
  labelHtmlPreview: string;
  createdAt: string;
};

export type ParcelOrderResult = {
  orderId: string;
  trackingNumber: string;
  label: ParcelLabel;
  paidWith: "card" | "balance";
  total: Money;
  offer: ParcelQuoteOffer;
};

export type ParcelTemplate = {
  id: string;
  name: string;
  draft: Omit<
    ParcelShipmentDraft,
    "method" | "templateId" | "previousShipmentId" | "integrationOrderId" | "excelFileName"
  >;
};

export type ParcelPreviousShipment = {
  id: string;
  label: string;
  createdAt: string;
  draft: Omit<
    ParcelShipmentDraft,
    "method" | "templateId" | "previousShipmentId" | "integrationOrderId" | "excelFileName"
  >;
};

export type ParcelIntegrationOrder = {
  id: string;
  source: string;
  externalRef: string;
  draft: Omit<
    ParcelShipmentDraft,
    "method" | "templateId" | "previousShipmentId" | "integrationOrderId" | "excelFileName"
  >;
};
