import { createEmptyCargoLine } from "@/features/freight/lib/recommendation";
import type { FreightDraft, FreightFtlDetails, FreightLtlDetails } from "@/types/freight";

export function defaultFtlDetails(): FreightFtlDetails {
  return {
    vehicleCapacityTons: 18,
    vehicleLengthM: 13.6,
    multiVehicle: false,
    vehicleCount: 1,
    bodyClosed: true,
    bodyCurtain: false,
    bodyReefer: false,
    bodyOpen: false,
    adrRequired: false,
    specialRequirements: "",
  };
}

export function defaultLtlDetails(): FreightLtlDetails {
  return {
    volumeM3: 8,
    loadingMeters: 3,
    stackable: true,
    hubTransferOk: true,
    flexibleDelivery: true,
    constraints: "",
  };
}

export function createDefaultFreightDraft(
  mode: FreightDraft["mode"] = null,
): FreightDraft {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return {
    mode,
    loading: {
      line1: "Organize Sanayi Bölgesi 4. Cad. No:22",
      district: "Nilüfer",
      city: "Bursa",
      postalCode: "16140",
    },
    delivery: {
      line1: "Hadımköy Lojistik Merkezi A Blok",
      district: "Arnavutköy",
      city: "İstanbul",
      postalCode: "34555",
    },
    loadingDate: date.toISOString().slice(0, 10),
    loadingWindowStart: "09:00",
    loadingWindowEnd: "12:00",
    deliveryExpectation: "48 saat içinde",
    cargoType: "palletized",
    totalWeightKg: mode === "ltl" ? 1800 : 12000,
    lines: [
      {
        ...createEmptyCargoLine(1),
        description: mode === "ltl" ? "Karton koli paletleri" : "Paletli mamul",
        pallets: mode === "ltl" ? 6 : 22,
        boxes: mode === "ltl" ? 40 : 0,
        weightKg: mode === "ltl" ? 1800 : 12000,
      },
    ],
    loadMethod: "forklift",
    vehicleType: mode === "ltl" ? "truck_12" : "trailer_90",
    bodyType: "curtain",
    attachments: [],
    notes: "",
    ftl: {
      ...defaultFtlDetails(),
      vehicleCapacityTons: mode === "ftl" ? 24 : 18,
      vehicleLengthM: mode === "ftl" ? 13.6 : 7.2,
      bodyCurtain: true,
      bodyClosed: false,
    },
    ltl: defaultLtlDetails(),
  };
}

export const FREIGHT_VEHICLES = [
  "van",
  "truck_7_5",
  "truck_12",
  "truck_18",
  "trailer_40",
  "trailer_90",
] as const;

export const FREIGHT_BODIES = [
  "closed",
  "curtain",
  "reefer",
  "open",
  "flatbed",
] as const;

export const FREIGHT_CARGO_TYPES = [
  "general",
  "palletized",
  "bulk",
  "fragile",
  "food",
  "hazardous",
] as const;

export const FREIGHT_LOAD_METHODS = [
  "forklift",
  "manual",
  "ramp",
  "crane",
  "dock",
] as const;

export const TIME_WINDOWS = [
  { start: "08:00", end: "12:00" },
  { start: "09:00", end: "12:00" },
  { start: "12:00", end: "16:00" },
  { start: "16:00", end: "20:00" },
] as const;
