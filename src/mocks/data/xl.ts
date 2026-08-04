import { createEmptyPiece } from "@/features/xl/lib/totals";
import type { XlDraft } from "@/types/xl";

export function createDefaultXlDraft(): XlDraft {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  return {
    pickup: {
      line1: "Organize Sanayi 2. Cad. No:14",
      district: "Ümraniye",
      city: "İstanbul",
      postalCode: "34775",
      floor: "0",
      hasElevator: true,
    },
    delivery: {
      line1: "Bahçelievler Mah. 12. Sok. No:5",
      district: "Çankaya",
      city: "Ankara",
      postalCode: "06490",
      floor: "4",
      hasElevator: false,
    },
    category: "furniture",
    description: "Köşe koltuk takımı ve yemek masası",
    pieces: [
      {
        id: "xlp_demo_1",
        name: "Köşe koltuk",
        lengthCm: 100,
        widthCm: 70,
        heightCm: 80,
        weightKg: 42,
      },
      {
        id: "xlp_demo_2",
        name: "Yemek masası",
        lengthCm: 120,
        widthCm: 70,
        heightCm: 75,
        weightKg: 35,
      },
    ],
    photos: [],
    packaging: "blanket",
    extras: ["extra_crew", "insurance"],
    transportDate: today.toISOString().slice(0, 10),
    notes: "",
    declaredValue: { amount: 18000, currency: "TRY" },
  };
}

export const XL_CATEGORIES = [
  "furniture",
  "appliance",
  "electronics",
  "machinery",
  "palletized",
  "other",
] as const;

export const XL_PACKAGING = [
  "original",
  "pallet",
  "crate",
  "blanket",
  "none",
] as const;

export const XL_EXTRAS = [
  "extra_crew",
  "assembly",
  "disassembly",
  "insurance",
  "floor_protection",
  "weekend",
] as const;

export const MOCK_XL_WALLET = { amount: 15000, currency: "TRY" };

export { createEmptyPiece };
