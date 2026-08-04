import type {
  CourierAddress,
  CourierExtraService,
  CourierPackageType,
  CourierRequestDraft,
  CourierServiceLevel,
  CourierVehicleType,
} from "@/types/courier";

export const ISTANBUL_ZONES: Record<
  string,
  { id: string; label: string; districts: string[] }
> = {
  european_south: {
    id: "european_south",
    label: "Avrupa Güney",
    districts: ["Kadıköy", "Üsküdar", "Beşiktaş", "Şişli", "Beyoğlu", "Fatih"],
  },
  european_north: {
    id: "european_north",
    label: "Avrupa Kuzey",
    districts: ["Sarıyer", "Maslak", "Kağıthane", "Eyüpsultan"],
  },
  asian: {
    id: "asian",
    label: "Anadolu",
    districts: ["Ataşehir", "Maltepe", "Kartal", "Pendik", "Ümraniye"],
  },
};

/** Approximate mock coordinates for demo districts */
export const DISTRICT_COORDS: Record<string, { lat: number; lng: number; zoneId: string }> = {
  Kadıköy: { lat: 40.9901, lng: 29.0292, zoneId: "european_south" },
  Üsküdar: { lat: 41.0255, lng: 29.0155, zoneId: "european_south" },
  Beşiktaş: { lat: 41.0422, lng: 29.0067, zoneId: "european_south" },
  Şişli: { lat: 41.0602, lng: 28.9877, zoneId: "european_south" },
  Beyoğlu: { lat: 41.037, lng: 28.985, zoneId: "european_south" },
  Fatih: { lat: 41.0186, lng: 28.9397, zoneId: "european_south" },
  Sarıyer: { lat: 41.166, lng: 29.05, zoneId: "european_north" },
  Maslak: { lat: 41.1082, lng: 29.0202, zoneId: "european_north" },
  Kağıthane: { lat: 41.079, lng: 28.978, zoneId: "european_north" },
  Eyüpsultan: { lat: 41.055, lng: 28.934, zoneId: "european_north" },
  Ataşehir: { lat: 40.9833, lng: 29.1167, zoneId: "asian" },
  Maltepe: { lat: 40.935, lng: 29.155, zoneId: "asian" },
  Kartal: { lat: 40.888, lng: 29.187, zoneId: "asian" },
  Pendik: { lat: 40.877, lng: 29.233, zoneId: "asian" },
  Ümraniye: { lat: 41.016, lng: 29.12, zoneId: "asian" },
};

export const PACKAGE_TYPES: CourierPackageType[] = [
  "document",
  "small_box",
  "medium_box",
  "large_box",
  "other",
];

export const SERVICE_LEVELS: CourierServiceLevel[] = [
  "express",
  "same_day",
  "scheduled",
];

export const VEHICLE_TYPES: CourierVehicleType[] = ["moto", "van"];

export const EXTRA_SERVICES: CourierExtraService[] = [
  "fragile",
  "signature",
  "return_document",
  "sms_notify",
  "wait_and_return",
];

export const TIME_WINDOWS = [
  { start: "09:00", end: "12:00" },
  { start: "12:00", end: "15:00" },
  { start: "15:00", end: "18:00" },
  { start: "18:00", end: "21:00" },
] as const;

export function createDefaultCourierDraft(): CourierRequestDraft {
  const today = new Date().toISOString().slice(0, 10);
  const kadikoy = DISTRICT_COORDS.Kadıköy;
  const maslak = DISTRICT_COORDS.Maslak;

  return {
    pickup: {
      line1: "Caferağa Mah. Moda Cad. No:12",
      district: "Kadıköy",
      city: "İstanbul",
      postalCode: "34710",
      lat: kadikoy.lat,
      lng: kadikoy.lng,
      zoneId: kadikoy.zoneId,
    },
    delivery: {
      line1: "Maslak Mah. Büyükdere Cad. No:255",
      district: "Maslak",
      city: "İstanbul",
      postalCode: "34485",
      lat: maslak.lat,
      lng: maslak.lng,
      zoneId: maslak.zoneId,
    },
    stops: [],
    sender: {
      name: "Ayşe Yılmaz",
      phone: "+905551112233",
      company: "Arf Lojistik Demo",
      email: "ayse@example.com",
    },
    recipient: {
      name: "",
      phone: "",
    },
    package: {
      type: "document",
      quantity: 1,
      weightKg: 0.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 5,
    },
    vehicleType: "moto",
    serviceLevel: "same_day",
    schedule: {
      pickupDate: today,
      windowStart: "12:00",
      windowEnd: "15:00",
    },
    notes: "",
    extras: ["sms_notify"],
  };
}

export function addressFromDistrict(
  district: string,
  line1: string,
): CourierAddress {
  const coords = DISTRICT_COORDS[district] ?? DISTRICT_COORDS.Kadıköy;
  return {
    line1,
    district,
    city: "İstanbul",
    lat: coords.lat,
    lng: coords.lng,
    zoneId: coords.zoneId,
  };
}
