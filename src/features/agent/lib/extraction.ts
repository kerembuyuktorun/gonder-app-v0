import type {
  ConfidenceLevel,
  ExtractedField,
  ExtractedFieldKey,
  ShipmentRequestDraft,
  ValidationIssue,
} from "@/types/conversation";
import type { ServiceType } from "@/types/domain";

const CITY_ALIASES: Record<string, string> = {
  istanbul: "İstanbul",
  ankara: "Ankara",
  izmir: "İzmir",
  bursa: "Bursa",
  antalya: "Antalya",
  gaziantep: "Gaziantep",
  mersin: "Mersin",
  kadikoy: "Kadıköy",
  "kadıköy": "Kadıköy",
  maslak: "Maslak",
  kocaeli: "Kocaeli",
};

const FIELD_ORDER: ExtractedFieldKey[] = [
  "serviceType",
  "origin",
  "destination",
  "pickupDate",
  "cargoType",
  "weightDesi",
  "palletCount",
  "vehicleType",
];

const LABEL_KEYS: Record<ExtractedFieldKey, string> = {
  serviceType: "agent.fields.serviceType",
  origin: "agent.fields.origin",
  destination: "agent.fields.destination",
  pickupDate: "agent.fields.pickupDate",
  vehicleType: "agent.fields.vehicleType",
  cargoType: "agent.fields.cargoType",
  weightDesi: "agent.fields.weightDesi",
  palletCount: "agent.fields.palletCount",
  notes: "agent.fields.notes",
};

function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findCities(text: string): string[] {
  const n = normalize(text);
  const found: string[] = [];
  for (const [alias, city] of Object.entries(CITY_ALIASES)) {
    if (n.includes(normalize(alias)) && !found.includes(city)) {
      found.push(city);
    }
  }
  return found;
}

export function classifyServiceType(
  text: string,
  hint?: ServiceType,
): { serviceType: ServiceType; confidence: ConfidenceLevel } {
  if (hint) return { serviceType: hint, confidence: "high" };
  const n = normalize(text);

  if (
    n.includes("komple yuk") ||
    n.includes("komple yük") ||
    n.includes("kapali kasa") ||
    n.includes("kapalı kasa") ||
    n.includes("ftl") ||
    n.includes("tir") ||
    n.includes("tır")
  ) {
    return { serviceType: "ftl", confidence: "high" };
  }
  if (n.includes("palet") || n.includes("parsiyel") || n.includes("ltl")) {
    return { serviceType: "ltl", confidence: "high" };
  }
  if (n.includes("evrak") || n.includes("kurye") || n.includes("ayni gun") || n.includes("aynı gün")) {
    return { serviceType: "courier", confidence: "high" };
  }
  if (n.includes("spot") || n.includes("teklif topla")) {
    return { serviceType: "spot", confidence: "medium" };
  }
  const desiMatch = n.match(/(\d+)\s*desi/);
  if (desiMatch) {
    const desi = Number(desiMatch[1]);
    if (desi > 30) return { serviceType: "gonder_xl", confidence: "high" };
    return { serviceType: "parcel_1_30", confidence: "high" };
  }
  if (n.includes("koli") || n.includes("paket") || n.includes("kargo")) {
    return { serviceType: "parcel_1_30", confidence: "medium" };
  }
  return { serviceType: "spot", confidence: "low" };
}

export function extractPickupDate(text: string): {
  value?: string;
  confidence: ConfidenceLevel;
} {
  const n = normalize(text);
  const today = new Date();
  if (n.includes("bugun") || n.includes("bugün")) {
    return { value: today.toISOString().slice(0, 10), confidence: "high" };
  }
  if (n.includes("yarin") || n.includes("yarın")) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return { value: d.toISOString().slice(0, 10), confidence: "high" };
  }
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return { value: iso[1], confidence: "high" };
  return { confidence: "low" };
}

function field(
  key: ExtractedFieldKey,
  value: string,
  confidence: ConfidenceLevel,
  source: ExtractedField["source"] = "ai",
): ExtractedField {
  return {
    key,
    labelKey: LABEL_KEYS[key],
    value,
    confidence,
    source,
    editable: true,
  };
}

export function mergeExtraction(
  draft: ShipmentRequestDraft,
  text: string,
  serviceHint?: ServiceType,
): ShipmentRequestDraft {
  const next: ShipmentRequestDraft = {
    ...draft,
    extractedFields: [...draft.extractedFields],
    missingFields: [...draft.missingFields],
    validationIssues: [...draft.validationIssues],
  };

  const { serviceType, confidence: serviceConfidence } = classifyServiceType(
    text,
    serviceHint ?? draft.serviceType,
  );
  if (!draft.serviceType || serviceHint || serviceConfidence !== "low") {
    next.serviceType = serviceType;
    upsertField(next, field("serviceType", serviceType, serviceConfidence));
  }

  const cities = findCities(text);
  const fromMatch = text.match(
    /(?:from|from:|nereden|çıkış|cikis)\s*[:\-]?\s*([A-Za-zÇĞİÖŞÜçğıöşü\s]+)/i,
  );
  const toMatch = text.match(
    /(?:to|to:|nereye|varış|varis)\s*[:\-]?\s*([A-Za-zÇĞİÖŞÜçğıöşü\s]+)/i,
  );
  const routeMatch = text.match(
    /([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*['’]?dan\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*['’]?a/i,
  ) || text.match(
    /([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*['’]?den\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*['’]?e/i,
  );

  if (fromMatch?.[1]) {
    next.origin = fromMatch[1].trim();
    upsertField(next, field("origin", next.origin, "high"));
  }
  if (toMatch?.[1]) {
    next.destination = toMatch[1].trim();
    upsertField(next, field("destination", next.destination, "high"));
  }
  if (routeMatch) {
    next.origin = capitalizeCity(routeMatch[1]);
    next.destination = capitalizeCity(routeMatch[2]);
    upsertField(next, field("origin", next.origin, "high"));
    upsertField(next, field("destination", next.destination, "high"));
  } else if (cities.length >= 2 && (!next.origin || !next.destination)) {
    next.origin = next.origin ?? cities[0];
    next.destination = next.destination ?? cities[1];
    upsertField(next, field("origin", next.origin, "medium"));
    upsertField(next, field("destination", next.destination, "medium"));
  } else if (cities.length === 1) {
    if (!next.origin) {
      next.origin = cities[0];
      upsertField(next, field("origin", next.origin, "low"));
    } else if (!next.destination) {
      next.destination = cities[0];
      upsertField(next, field("destination", next.destination, "medium"));
    }
  }

  // Intra-city courier: Kadıköy'den Maslak'a
  if (
    (normalize(text).includes("kadikoy") || normalize(text).includes("kadıköy")) &&
    normalize(text).includes("maslak")
  ) {
    next.origin = "Kadıköy, İstanbul";
    next.destination = "Maslak, İstanbul";
    next.serviceType = "courier";
    upsertField(next, field("origin", next.origin, "high"));
    upsertField(next, field("destination", next.destination, "high"));
    upsertField(next, field("serviceType", "courier", "high"));
  }

  const date = extractPickupDate(text);
  if (date.value) {
    next.pickupDate = date.value;
    upsertField(next, field("pickupDate", date.value, date.confidence));
  }

  const desi = text.match(/(\d+)\s*desi/i);
  if (desi) {
    next.weightDesi = desi[1];
    upsertField(next, field("weightDesi", desi[1], "high"));
  }

  const pallets = text.match(/(\d+)\s*palet/i);
  if (pallets) {
    next.palletCount = pallets[1];
    upsertField(next, field("palletCount", pallets[1], "high"));
  }

  if (/kapal[ıi]\s*kasa|tenteli|frigo/i.test(text)) {
    const vehicle = /frigo/i.test(text)
      ? "frigo"
      : /tenteli/i.test(text)
        ? "tenteli"
        : "kapalı kasa";
    next.vehicleType = vehicle;
    upsertField(next, field("vehicleType", vehicle, "high"));
  }

  if (/evrak|koli|ürün|urun|yük|yuk/i.test(text)) {
    const cargo = /evrak/i.test(text)
      ? "evrak"
      : /palet/i.test(text)
        ? "paletli ürün"
        : /koli/i.test(text)
          ? "koli"
          : "genel kargo";
    next.cargoType = cargo;
    upsertField(next, field("cargoType", cargo, "medium"));
  }

  next.validationIssues = detectConflicts(next);
  next.missingFields = computeMissing(next);
  next.overallConfidence = computeOverallConfidence(next);
  next.readyForConfirm =
    next.missingFields.length === 0 &&
    next.validationIssues.filter((i) => i.severity === "error").length === 0 &&
    next.overallConfidence !== "low";

  return next;
}

function capitalizeCity(value: string): string {
  const key = normalize(value.trim());
  return CITY_ALIASES[key] ?? value.trim();
}

function upsertField(draft: ShipmentRequestDraft, nextField: ExtractedField) {
  const index = draft.extractedFields.findIndex((f) => f.key === nextField.key);
  if (index >= 0) draft.extractedFields[index] = nextField;
  else draft.extractedFields.push(nextField);
}

function computeMissing(draft: ShipmentRequestDraft): ExtractedFieldKey[] {
  const required: ExtractedFieldKey[] = ["serviceType", "origin", "destination", "pickupDate"];
  if (draft.serviceType === "ftl") required.push("vehicleType", "cargoType");
  if (draft.serviceType === "ltl") required.push("palletCount");
  if (draft.serviceType === "parcel_1_30" || draft.serviceType === "gonder_xl") {
    required.push("weightDesi");
  }
  if (draft.serviceType === "courier") required.push("cargoType");

  return required.filter((key) => {
    const value = draft[key as keyof ShipmentRequestDraft];
    return !value || (typeof value === "string" && value.trim() === "");
  });
}

function detectConflicts(draft: ShipmentRequestDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (
    draft.origin &&
    draft.destination &&
    normalize(draft.origin) === normalize(draft.destination) &&
    draft.serviceType !== "courier"
  ) {
    issues.push({
      id: "same-city",
      fieldKey: "destination",
      severity: "warning",
      messageKey: "agent.issues.sameCity",
    });
  }
  if (draft.weightDesi && Number(draft.weightDesi) > 30 && draft.serviceType === "parcel_1_30") {
    issues.push({
      id: "desi-mismatch",
      fieldKey: "serviceType",
      severity: "error",
      messageKey: "agent.issues.desiMismatch",
    });
  }
  return issues;
}

function computeOverallConfidence(draft: ShipmentRequestDraft): ConfidenceLevel {
  if (draft.extractedFields.length === 0) return "low";
  if (draft.extractedFields.some((f) => f.confidence === "low")) return "low";
  if (draft.extractedFields.some((f) => f.confidence === "medium")) return "medium";
  return "high";
}

export function nextMissingPrompt(field: ExtractedFieldKey): string {
  const prompts: Record<ExtractedFieldKey, string> = {
    serviceType: "Bu taşıma için hangi hizmeti kullanmak istersiniz? (Kurye, Kargo, XL, FTL, LTL, Spot)",
    origin: "Çıkış noktası neresi olmalı?",
    destination: "Varış noktası neresi olmalı?",
    pickupDate: "Alım tarihi ne zaman? (bugün, yarın veya YYYY-MM-DD)",
    vehicleType: "Araç / kasa tipi nedir? (kapalı kasa, tenteli, frigo)",
    cargoType: "Yük veya gönderi türü nedir?",
    weightDesi: "Desi veya ölçü bilgisi nedir?",
    palletCount: "Kaç palet gönderileceğini paylaşır mısınız?",
    notes: "Eklemek istediğiniz bir not var mı?",
  };
  return prompts[field];
}

export function createEmptyDraft(id: string): ShipmentRequestDraft {
  return {
    id,
    extractedFields: [],
    missingFields: ["serviceType", "origin", "destination", "pickupDate"],
    validationIssues: [],
    overallConfidence: "low",
    readyForConfirm: false,
  };
}

export { FIELD_ORDER, LABEL_KEYS };
