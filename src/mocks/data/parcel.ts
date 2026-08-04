import type {
  ParcelIntegrationOrder,
  ParcelPreviousShipment,
  ParcelShipmentDraft,
  ParcelTemplate,
} from "@/types/parcel";
import { createEmptyPackage } from "@/features/parcel/lib/desi";

function basePartiesAndAddresses(): Pick<
  ParcelShipmentDraft,
  "sender" | "recipient" | "pickup" | "delivery" | "returnAddress" | "useReturnAddress"
> {
  return {
    sender: {
      name: "Ayşe Yılmaz",
      company: "Arf Lojistik Demo",
      phone: "+905551112233",
      email: "ayse@example.com",
    },
    recipient: {
      name: "Mehmet Demir",
      company: "Demir Ticaret",
      phone: "+905559998877",
      email: "mehmet@example.com",
    },
    pickup: {
      line1: "Caferağa Mah. Moda Cad. No:12",
      district: "Kadıköy",
      city: "İstanbul",
      postalCode: "34710",
      country: "TR",
    },
    delivery: {
      line1: "Kızılay Mah. Atatürk Bulvarı No:45",
      district: "Çankaya",
      city: "Ankara",
      postalCode: "06420",
      country: "TR",
    },
    returnAddress: null,
    useReturnAddress: false,
  };
}

export function createDefaultParcelDraft(): ParcelShipmentDraft {
  return {
    method: "manual",
    templateId: null,
    previousShipmentId: null,
    integrationOrderId: null,
    excelFileName: null,
    ...basePartiesAndAddresses(),
    packages: [createEmptyPackage()],
    contentDescription: "Tekstil numuneleri",
    declaredValue: { amount: 750, currency: "TRY" },
    pickupFromAddress: true,
    extras: ["sms"],
  };
}

export const PARCEL_TEMPLATES: ParcelTemplate[] = [
  {
    id: "tpl-retail-ankara",
    name: "Perakende Ankara",
    draft: {
      ...basePartiesAndAddresses(),
      packages: [
        {
          id: "pkg_tpl_1",
          lengthCm: 40,
          widthCm: 30,
          heightCm: 20,
          weightKg: 3,
        },
      ],
      contentDescription: "Mağaza iade paketi",
      declaredValue: { amount: 1200, currency: "TRY" },
      pickupFromAddress: true,
      extras: ["insurance", "sms"],
      useReturnAddress: true,
      returnAddress: {
        line1: "Depo Cad. No:8",
        district: "Ümraniye",
        city: "İstanbul",
        postalCode: "34764",
        country: "TR",
      },
    },
  },
  {
    id: "tpl-docs-izmir",
    name: "Evrak İzmir",
    draft: {
      ...basePartiesAndAddresses(),
      recipient: {
        name: "Ege Ofis",
        phone: "+905553334455",
        company: "Ege Holding",
      },
      delivery: {
        line1: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:10",
        district: "Konak",
        city: "İzmir",
        postalCode: "35220",
        country: "TR",
      },
      packages: [
        {
          id: "pkg_tpl_2",
          lengthCm: 25,
          widthCm: 18,
          heightCm: 5,
          weightKg: 0.4,
        },
      ],
      contentDescription: "Sözleşme evrakları",
      declaredValue: { amount: 100, currency: "TRY" },
      pickupFromAddress: false,
      extras: ["sms"],
      useReturnAddress: false,
      returnAddress: null,
    },
  },
];

export const PREVIOUS_SHIPMENTS: ParcelPreviousShipment[] = [
  {
    id: "prev-1001",
    label: "İstanbul → Bursa · 12 desi",
    createdAt: "2026-07-28T10:00:00.000Z",
    draft: {
      ...basePartiesAndAddresses(),
      recipient: {
        name: "Bursa Depo",
        phone: "+905557778899",
        company: "Nilüfer Lojistik",
      },
      delivery: {
        line1: "Organize Sanayi Bölgesi 3. Cad. No:22",
        district: "Nilüfer",
        city: "Bursa",
        postalCode: "16140",
        country: "TR",
      },
      packages: [
        {
          id: "pkg_prev_1",
          lengthCm: 50,
          widthCm: 40,
          heightCm: 30,
          weightKg: 8,
        },
      ],
      contentDescription: "Yedek parça",
      declaredValue: { amount: 2500, currency: "TRY" },
      pickupFromAddress: true,
      extras: ["fragile", "insurance"],
      useReturnAddress: false,
      returnAddress: null,
    },
  },
];

export const INTEGRATION_ORDERS: ParcelIntegrationOrder[] = [
  {
    id: "int-shopify-8841",
    source: "Shopify",
    externalRef: "#8841",
    draft: {
      ...basePartiesAndAddresses(),
      recipient: {
        name: "Elif Kaya",
        phone: "+905551234567",
        email: "elif@example.com",
      },
      delivery: {
        line1: "Bahçelievler Mah. 7. Cad. No:3",
        district: "Çankaya",
        city: "Ankara",
        postalCode: "06490",
        country: "TR",
      },
      packages: [
        {
          id: "pkg_int_1",
          lengthCm: 35,
          widthCm: 25,
          heightCm: 15,
          weightKg: 1.8,
        },
      ],
      contentDescription: "Online sipariş · SKU-tee-m",
      declaredValue: { amount: 449, currency: "TRY" },
      pickupFromAddress: true,
      extras: ["sms"],
      useReturnAddress: false,
      returnAddress: null,
    },
  },
  {
    id: "int-trendyol-2201",
    source: "Trendyol",
    externalRef: "TY-2201",
    draft: {
      ...basePartiesAndAddresses(),
      recipient: {
        name: "Can Öztürk",
        phone: "+905559876543",
      },
      delivery: {
        line1: "Karşıyaka Mah. Sahil Yolu No:18",
        district: "Karşıyaka",
        city: "İzmir",
        postalCode: "35560",
        country: "TR",
      },
      packages: [
        {
          id: "pkg_int_2",
          lengthCm: 45,
          widthCm: 35,
          heightCm: 25,
          weightKg: 4.2,
        },
        {
          id: "pkg_int_3",
          lengthCm: 30,
          widthCm: 20,
          heightCm: 10,
          weightKg: 1.1,
        },
      ],
      contentDescription: "Trendyol siparişi · 2 koli",
      declaredValue: { amount: 1890, currency: "TRY" },
      pickupFromAddress: true,
      extras: ["insurance", "sms"],
      useReturnAddress: false,
      returnAddress: null,
    },
  },
];

export const MOCK_WALLET_BALANCE = { amount: 2500, currency: "TRY" };
