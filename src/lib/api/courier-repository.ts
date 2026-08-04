import type {
  CourierQuote,
  CourierRequestDraft,
  CourierValidationResult,
} from "@/types/courier";

export type CourierQuoteResult = {
  validation: CourierValidationResult;
  quote: CourierQuote;
};

export type CourierSubmitResult = {
  requestId: string;
  trackingNumber: string;
};

export interface CourierRepository {
  validate(draft: CourierRequestDraft): Promise<CourierValidationResult>;
  getQuote(draft: CourierRequestDraft): Promise<CourierQuoteResult>;
  submit(draft: CourierRequestDraft): Promise<CourierSubmitResult>;
}
