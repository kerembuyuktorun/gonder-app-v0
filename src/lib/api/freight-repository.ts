import type {
  FreightDraft,
  FreightMessage,
  FreightRequest,
} from "@/types/freight";

export type FreightSubmitResult = {
  request: FreightRequest;
};

export interface FreightRepository {
  submit(draft: FreightDraft): Promise<FreightSubmitResult>;
  getRequest(id: string): Promise<FreightRequest>;
  advanceStatus(id: string): Promise<FreightRequest>;
  requestRevision(id: string, note: string): Promise<FreightRequest>;
  acceptQuote(id: string): Promise<FreightRequest>;
  sendMessage(
    id: string,
    body: string,
    author?: "customer" | "ops",
  ): Promise<FreightMessage[]>;
  /** Mock ops auto-reply when customer asks for missing info */
  replyAsOps(id: string, body: string): Promise<FreightMessage[]>;
}
