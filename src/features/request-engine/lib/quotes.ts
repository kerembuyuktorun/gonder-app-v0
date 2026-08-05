import type {
  RequestDraft,
  SearchQuote,
} from "@/types/request-engine";

const TRY = "TRY";

export function calculateDesi(draft: RequestDraft): number {
  return Math.max(
    draft.weight,
    (draft.width * draft.length * draft.height) / 3000,
  );
}

export function getRequestQuotes(draft: RequestDraft): SearchQuote[] {
  if (draft.operationType === "parcel") {
    const desi = Math.ceil(calculateDesi(draft)) * draft.quantity;
    return [
      {
        id: "quote-parcel-1",
        provider: "Gönder Seçili",
        serviceName: "Standart Kargo",
        price: { amount: 119 + desi * 8, currency: TRY },
        eta: "1–2 iş günü",
        pickup: "Bugün 16:00–18:00",
        insurance: "₺2.500 dahil",
        score: 4.9,
        recommended: true,
        terms: ["Adresten alım", "SMS bilgilendirme", "Canlı takip"],
      },
      {
        id: "quote-parcel-2",
        provider: "Anadolu Kargo",
        serviceName: "Ekonomik",
        price: { amount: 98 + desi * 7, currency: TRY },
        eta: "2–3 iş günü",
        pickup: "Yarın 09:00–12:00",
        insurance: "₺1.000 dahil",
        score: 4.6,
        terms: ["Şubeden teslim seçeneği", "Temel takip"],
      },
      {
        id: "quote-parcel-3",
        provider: "Rota Express",
        serviceName: "Ertesi Gün",
        price: { amount: 179 + desi * 10, currency: TRY },
        eta: "Ertesi iş günü",
        pickup: "90 dakika içinde",
        insurance: "₺5.000 dahil",
        score: 4.8,
        fastest: true,
        terms: ["Öncelikli ayrıştırma", "Adresten alım", "Canlı takip"],
      },
    ];
  }

  if (draft.operationType === "courier") {
    return [
      {
        id: "quote-courier-1",
        provider: "Gönder Kurye",
        serviceName:
          draft.courierService === "express" ? "Moto Express" : "Aynı Gün",
        price: { amount: draft.courierService === "express" ? 385 : 245, currency: TRY },
        eta: draft.courierService === "express" ? "60–90 dakika" : "Bugün 18:00'e kadar",
        pickup: "20 dakika içinde",
        insurance: "₺3.000 dahil",
        score: 4.9,
        recommended: true,
        fastest: true,
        terms: ["Canlı kurye takibi", "Teslimat kodu", "Fotoğraflı kanıt"],
      },
      {
        id: "quote-courier-2",
        provider: "Şehir Rota",
        serviceName: "Planlı Teslimat",
        price: { amount: 198, currency: TRY },
        eta: "Seçilen zaman aralığı",
        pickup: "Planlı",
        insurance: "₺1.500 dahil",
        score: 4.5,
        terms: ["2 saatlik teslimat penceresi", "SMS bilgilendirme"],
      },
    ];
  }

  return [
    {
      id: "quote-logistics-estimate",
      provider: "Gönder Lojistik Ağı",
      serviceName:
        draft.logisticsMode === "ftl" ? "FTL · Komple Araç" : "LTL · Parsiyel",
      price: {
        amount: draft.logisticsMode === "ftl" ? 18_900 : 6_450,
        currency: TRY,
      },
      eta: "1–2 gün",
      pickup: "Teklif onayı sonrası",
      insurance: "CMR kapsamı",
      score: 4.8,
      recommended: true,
      terms: ["Tahmini fiyat", "Operasyon doğrulaması gerekir", "7/24 takip"],
    },
    {
      id: "quote-logistics-preparing",
      provider: "3 doğrulanmış tedarikçi",
      serviceName: "Özel Teklif Toplama",
      price: null,
      eta: "İlk teklif yaklaşık 45 dakika",
      pickup: "Teklif sonrasında",
      insurance: "Teklife göre",
      score: 4.7,
      preparing: true,
      terms: ["Tedarikçi karşılaştırma", "Revizyon isteme", "Ödeme koşulu seçimi"],
    },
  ];
}
