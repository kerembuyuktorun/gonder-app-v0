import type { Money } from "@/types/domain";

export type OperationType = "parcel" | "courier" | "logistics";
export type LogisticsMode = "ftl" | "ltl";
export type RequestMode = "price" | "shipment";

export type RequestDraft = {
  id: string;
  mode: RequestMode;
  operationType: OperationType;
  logisticsMode: LogisticsMode;
  origin: string;
  destination: string;
  date: string;
  packagePreset: string;
  width: number;
  length: number;
  height: number;
  weight: number;
  quantity: number;
  courierService: string;
  vehicleType: string;
  bodyType: string;
  loadType: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  notes: string;
  updatedAt: string;
};

export type SearchQuote = {
  id: string;
  provider: string;
  serviceName: string;
  price: Money | null;
  eta: string;
  pickup: string;
  insurance: string;
  score: number;
  recommended?: boolean;
  fastest?: boolean;
  preparing?: boolean;
  terms: string[];
};

export function createRequestDraft(): RequestDraft {
  return {
    id: `draft-${Date.now()}`,
    mode: "price",
    operationType: "parcel",
    logisticsMode: "ftl",
    origin: "",
    destination: "",
    date: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    packagePreset: "medium",
    width: 30,
    length: 40,
    height: 20,
    weight: 5,
    quantity: 1,
    courierService: "same_day",
    vehicleType: "truck",
    bodyType: "closed",
    loadType: "pallet",
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    notes: "",
    updatedAt: new Date().toISOString(),
  };
}
