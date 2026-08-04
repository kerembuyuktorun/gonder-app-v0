import type { SpotOffer, SpotQuoteSort, SpotSupplier } from "@/types/spot";

export function sortOffers(
  offers: SpotOffer[],
  sort: SpotQuoteSort,
): SpotOffer[] {
  const list = [...offers];
  switch (sort) {
    case "price_desc":
      return list.sort((a, b) => b.total.amount - a.total.amount);
    case "eta_asc":
      return list.sort(
        (a, b) => a.etaDaysMax - b.etaDaysMax || a.total.amount - b.total.amount,
      );
    case "score_desc":
      return list.sort(
        (a, b) =>
          b.performanceScore - a.performanceScore ||
          a.total.amount - b.total.amount,
      );
    default:
      return list.sort((a, b) => a.total.amount - b.total.amount);
  }
}

export function lowestPriceId(offers: SpotOffer[]): string | null {
  if (!offers.length) return null;
  return sortOffers(offers, "price_asc")[0]?.id ?? null;
}

export function fastestId(offers: SpotOffer[]): string | null {
  if (!offers.length) return null;
  return sortOffers(offers, "eta_asc")[0]?.id ?? null;
}

export function recommendedId(offers: SpotOffer[]): string | null {
  return offers.find((o) => o.recommended)?.id ?? null;
}

export function supplierStatusCounts(suppliers: SpotSupplier[]) {
  return suppliers.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      acc.total += 1;
      return acc;
    },
    {
      invited: 0,
      waiting: 0,
      quoted: 0,
      declined: 0,
      expired: 0,
      total: 0,
    } as Record<string, number>,
  );
}

export function createIdempotencyKey(prefix = "pay"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
