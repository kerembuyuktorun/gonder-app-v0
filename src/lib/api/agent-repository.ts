import type {
  AgentTurnResult,
  Conversation,
  ExtractedFieldKey,
  ShipmentRequestDraft,
} from "@/types/conversation";
import type { ServiceType } from "@/types/domain";

export type StartConversationInput = {
  channel?: Conversation["channel"];
  initialPrompt?: string;
  serviceHint?: ServiceType;
  conversationId?: string;
};

export type SendMessageInput = {
  conversationId: string;
  text: string;
  channel?: Conversation["channel"];
};

export type UpdateDraftInput = {
  conversationId: string;
  patch: Partial<
    Pick<
      ShipmentRequestDraft,
      | "serviceType"
      | "origin"
      | "destination"
      | "pickupDate"
      | "vehicleType"
      | "cargoType"
      | "weightDesi"
      | "palletCount"
      | "notes"
    >
  >;
};

export type ConfirmDraftResult = {
  requestId: string;
  conversation: Conversation;
};

/**
 * Frontend-facing contract for a central AI Agent API.
 * Channel adapters (web, WhatsApp, mobile, API) should call the same backend.
 */
export interface AgentRepository {
  listConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  startConversation(input: StartConversationInput): Promise<Conversation>;
  sendMessage(input: SendMessageInput): Promise<AgentTurnResult>;
  updateDraft(input: UpdateDraftInput): Promise<Conversation>;
  confirmDraft(conversationId: string): Promise<ConfirmDraftResult>;
  /** Mock: load a WhatsApp-originated conversation continued on web */
  continueFromWhatsApp(conversationId: string): Promise<Conversation>;
  getMissingFieldPrompt(
    conversationId: string,
    field: ExtractedFieldKey,
  ): Promise<string>;
}
