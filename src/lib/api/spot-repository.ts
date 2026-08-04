import type { CounterOfferInput, SpotOffer, SpotRequest, SpotRequestDraft } from "@/types/spot";

export interface SpotRepository {
  openRequest(draft: SpotRequestDraft): Promise<SpotRequest>;
  getRequest(id: string): Promise<SpotRequest>;
  refreshOffers(id: string): Promise<SpotRequest>;
  sendCounterOffer(input: CounterOfferInput): Promise<SpotOffer>;
  selectOffer(requestId: string, offerId: string): Promise<SpotRequest>;
  /** Marks request accepted after successful payment — not auto from AI */
  markAccepted(requestId: string, offerId: string): Promise<SpotRequest>;
}
