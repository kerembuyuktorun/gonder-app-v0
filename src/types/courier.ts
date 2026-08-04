import type { Money } from "@/types/domain";

export type CourierVehicleType = "moto" | "van";

export type CourierServiceLevel =
  | "express"
  | "same_day"
  | "scheduled";

export type CourierPackageType =
  | "document"
  | "small_box"
  | "medium_box"
  | "large_box"
  | "other";

export type CourierExtraService =
  | "fragile"
  | "signature"
  | "return_document"
  | "sms_notify"
  | "wait_and_return";

export type CourierZoneStatus = "same_zone" | "adjacent_zone" | "out_of_zone";

export type CourierMapPoint = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  kind: "pickup" | "delivery" | "stop";
};

export type CourierStop = {
  id: string;
  label: string;
  addressLine: string;
  district: string;
  city: string;
  contactName: string;
  phone: string;
  notes?: string;
};

export type CourierAddress = {
  line1: string;
  district: string;
  city: string;
  postalCode?: string;
  lat: number;
  lng: number;
  zoneId: string;
};

export type CourierContact = {
  name: string;
  phone: string;
  company?: string;
  email?: string;
};

export type CourierPackage = {
  type: CourierPackageType;
  quantity: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightKg: number;
  description?: string;
};

export type CourierSchedule = {
  pickupDate: string;
  windowStart: string;
  windowEnd: string;
};

export type CourierQuoteLine = {
  id: string;
  labelKey: string;
  amount: Money;
};

export type CourierQuote = {
  status: "ready" | "preparing" | "unavailable";
  currency: string;
  lines: CourierQuoteLine[];
  total: Money;
  etaMinutes?: number;
  vehicleSuggestion?: CourierVehicleType;
  warnings: string[];
};

export type CourierRequestDraft = {
  pickup: CourierAddress;
  delivery: CourierAddress;
  stops: CourierStop[];
  sender: CourierContact;
  recipient: CourierContact;
  package: CourierPackage;
  vehicleType: CourierVehicleType;
  serviceLevel: CourierServiceLevel;
  schedule: CourierSchedule;
  notes: string;
  extras: CourierExtraService[];
};

export type CourierValidationResult = {
  zoneStatus: CourierZoneStatus;
  motoSuitable: boolean;
  suggestedVehicle?: CourierVehicleType;
  messages: Array<{ id: string; tone: "info" | "warning" | "error"; messageKey: string }>;
};

export type CourierWizardStepId =
  | "addresses"
  | "contacts"
  | "package"
  | "vehicle_service"
  | "schedule_extras"
  | "review";
