import type {
  ParcelDesiSummary,
  ParcelOrderResult,
  ParcelQuoteOffer,
  ParcelShipmentDraft,
} from "@/types/parcel";
import type { Money } from "@/types/domain";

export type ParcelQuotesResult = {
  desi: ParcelDesiSummary;
  offers: ParcelQuoteOffer[];
  suggestGonderXl: boolean;
};

export type ParcelCheckoutInput = {
  draft: ParcelShipmentDraft;
  offerId: string;
  paymentMethod: "card" | "balance";
};

export interface ParcelRepository {
  listTemplates(): Promise<
    import("@/types/parcel").ParcelTemplate[]
  >;
  listPreviousShipments(): Promise<
    import("@/types/parcel").ParcelPreviousShipment[]
  >;
  listIntegrationOrders(): Promise<
    import("@/types/parcel").ParcelIntegrationOrder[]
  >;
  getQuotes(draft: ParcelShipmentDraft): Promise<ParcelQuotesResult>;
  getWalletBalance(): Promise<Money>;
  checkout(input: ParcelCheckoutInput): Promise<ParcelOrderResult>;
  /** Mock Excel parse — returns a draft seeded from filename. */
  parseExcelUpload(fileName: string): Promise<ParcelShipmentDraft>;
}
