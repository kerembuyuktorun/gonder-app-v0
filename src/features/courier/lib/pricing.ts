import type {
  CourierQuote,
  CourierRequestDraft,
  CourierValidationResult,
  CourierVehicleType,
  CourierZoneStatus,
} from "@/types/courier";
import { ISTANBUL_ZONES } from "@/mocks/data/courier";

const MOTO_MAX_WEIGHT_KG = 20;
const MOTO_MAX_DIM_CM = 60;

export function validateCourierDraft(
  draft: CourierRequestDraft,
): CourierValidationResult {
  const messages: CourierValidationResult["messages"] = [];
  const zoneStatus = resolveZoneStatus(draft.pickup.zoneId, draft.delivery.zoneId);

  if (zoneStatus === "out_of_zone") {
    messages.push({
      id: "out-of-zone",
      tone: "error",
      messageKey: "courier.rules.outOfZone",
    });
  } else if (zoneStatus === "adjacent_zone") {
    messages.push({
      id: "adjacent-zone",
      tone: "warning",
      messageKey: "courier.rules.adjacentZone",
    });
  } else {
    messages.push({
      id: "same-zone",
      tone: "info",
      messageKey: "courier.rules.sameZone",
    });
  }

  const motoSuitable = isMotoSuitable(draft);
  let suggestedVehicle: CourierVehicleType | undefined;

  if (draft.vehicleType === "moto" && !motoSuitable) {
    suggestedVehicle = "van";
    messages.push({
      id: "moto-unsuitable",
      tone: "warning",
      messageKey: "courier.rules.motoUnsuitable",
    });
  }

  if (draft.stops.length > 0) {
    messages.push({
      id: "multi-stop",
      tone: "info",
      messageKey: "courier.rules.multiStop",
    });
  }

  if (!draft.recipient.name || !draft.recipient.phone) {
    messages.push({
      id: "recipient-required",
      tone: "error",
      messageKey: "courier.rules.recipientRequired",
    });
  }

  return {
    zoneStatus,
    motoSuitable,
    suggestedVehicle,
    messages,
  };
}

export function isMotoSuitable(draft: CourierRequestDraft): boolean {
  const { weightKg, lengthCm = 0, widthCm = 0, heightCm = 0, quantity } =
    draft.package;
  const maxDim = Math.max(lengthCm, widthCm, heightCm);
  if (weightKg > MOTO_MAX_WEIGHT_KG) return false;
  if (maxDim > MOTO_MAX_DIM_CM) return false;
  if (quantity > 3) return false;
  if (draft.package.type === "large_box") return false;
  return true;
}

function resolveZoneStatus(
  pickupZone: string,
  deliveryZone: string,
): CourierZoneStatus {
  if (!ISTANBUL_ZONES[pickupZone] || !ISTANBUL_ZONES[deliveryZone]) {
    return "out_of_zone";
  }
  if (pickupZone === deliveryZone) return "same_zone";
  // European south/north are adjacent; asian vs european = adjacent for demo
  const european = new Set(["european_south", "european_north"]);
  if (european.has(pickupZone) && european.has(deliveryZone)) {
    return "adjacent_zone";
  }
  if (pickupZone !== deliveryZone) return "adjacent_zone";
  return "out_of_zone";
}

export function estimateCourierQuote(
  draft: CourierRequestDraft,
  validation: CourierValidationResult,
): CourierQuote {
  if (validation.zoneStatus === "out_of_zone") {
    return {
      status: "unavailable",
      currency: "TRY",
      lines: [],
      total: { amount: 0, currency: "TRY" },
      warnings: ["courier.rules.outOfZone"],
    };
  }

  // Simulate "preparing" for scheduled far-future feel when date missing
  if (!draft.schedule.pickupDate) {
    return {
      status: "preparing",
      currency: "TRY",
      lines: [],
      total: { amount: 0, currency: "TRY" },
      warnings: [],
    };
  }

  const vehicle = validation.suggestedVehicle ?? draft.vehicleType;
  let base = vehicle === "moto" ? 149 : 279;

  if (draft.serviceLevel === "express") base += 80;
  if (draft.serviceLevel === "same_day") base += 40;
  if (draft.serviceLevel === "scheduled") base += 20;

  if (validation.zoneStatus === "adjacent_zone") base += 45;
  base += draft.stops.length * 55;
  base += Math.max(0, draft.package.weightKg - 5) * 8;
  base += Math.max(0, draft.package.quantity - 1) * 25;

  const extrasTotal = draft.extras.reduce((sum, extra) => {
    const prices: Record<string, number> = {
      fragile: 25,
      signature: 15,
      return_document: 35,
      sms_notify: 5,
      wait_and_return: 60,
    };
    return sum + (prices[extra] ?? 0);
  }, 0);

  const lines = [
    {
      id: "base",
      labelKey: "courier.price.base",
      amount: { amount: base, currency: "TRY" },
    },
  ];
  if (extrasTotal > 0) {
    lines.push({
      id: "extras",
      labelKey: "courier.price.extras",
      amount: { amount: extrasTotal, currency: "TRY" },
    });
  }

  const totalAmount = base + extrasTotal;
  const eta =
    draft.serviceLevel === "express"
      ? 45
      : draft.serviceLevel === "same_day"
        ? 180
        : 360;

  return {
    status: "ready",
    currency: "TRY",
    lines,
    total: { amount: totalAmount, currency: "TRY" },
    etaMinutes: eta,
    vehicleSuggestion: validation.suggestedVehicle,
    warnings: validation.messages
      .filter((m) => m.tone === "warning")
      .map((m) => m.messageKey),
  };
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
