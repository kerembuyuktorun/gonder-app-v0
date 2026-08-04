import type { Money } from "@/types/domain";
import type { XlDraft, XlOrderResult, XlQuote } from "@/types/xl";

export type XlQuoteRequest = {
  draft: XlDraft;
  /** When true, resolve preparing → ready if possible */
  resolvePreparing?: boolean;
};

export type XlCheckoutInput = {
  draft: XlDraft;
  quote: XlQuote;
  paymentMethod: "card" | "balance" | "invoice";
};

export interface XlRepository {
  getQuote(input: XlQuoteRequest): Promise<XlQuote>;
  /** Simulates calculating state then returns estimate */
  getQuoteWithCalculating(draft: XlDraft): Promise<XlQuote>;
  getWalletBalance(): Promise<Money>;
  submitForOpsReview(draft: XlDraft): Promise<{ requestId: string; etaHours: number }>;
  checkout(input: XlCheckoutInput): Promise<XlOrderResult>;
}
