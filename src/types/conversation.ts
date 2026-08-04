import type { ServiceType } from "@/types/domain";

export type ChannelType = "web" | "mobile" | "whatsapp" | "api" | "operator";

export type ParticipantRole = "user" | "agent" | "system" | "operator";

export type MessageContentType = "text" | "quick_reply" | "system" | "draft_update";

export type ConfidenceLevel = "high" | "medium" | "low";

export type AgentPhase =
  | "thinking"
  | "awaiting_missing_info"
  | "draft_ready"
  | "awaiting_confirmation"
  | "service_unavailable"
  | "retrying"
  | "handoff_from_channel"
  | "idle"
  | "completed";

export type AccountLinkStatus =
  | "linked"
  | "unlinked"
  | "pending_verification"
  | "mismatch";

export type Participant = {
  id: string;
  role: ParticipantRole;
  displayName: string;
  channel?: ChannelType;
  phone?: string;
  accountLinkStatus?: AccountLinkStatus;
};

export type Message = {
  id: string;
  conversationId: string;
  participantId: string;
  contentType: MessageContentType;
  text: string;
  createdAt: string;
  channel: ChannelType;
  meta?: {
    quickReplies?: string[];
    confidence?: ConfidenceLevel;
    retryOf?: string;
  };
};

export type ExtractedFieldKey =
  | "serviceType"
  | "origin"
  | "destination"
  | "pickupDate"
  | "vehicleType"
  | "cargoType"
  | "weightDesi"
  | "palletCount"
  | "notes";

export type ExtractedField = {
  key: ExtractedFieldKey;
  labelKey: string;
  value: string;
  confidence: ConfidenceLevel;
  source: "ai" | "user" | "channel";
  editable: boolean;
};

export type ValidationIssue = {
  id: string;
  fieldKey?: ExtractedFieldKey;
  severity: "warning" | "error";
  messageKey: string;
};

export type ShipmentRequestDraft = {
  id: string;
  serviceType?: ServiceType;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  vehicleType?: string;
  cargoType?: string;
  weightDesi?: string;
  palletCount?: string;
  notes?: string;
  extractedFields: ExtractedField[];
  missingFields: ExtractedFieldKey[];
  validationIssues: ValidationIssue[];
  overallConfidence: ConfidenceLevel;
  readyForConfirm: boolean;
};

export type Conversation = {
  id: string;
  channel: ChannelType;
  originatedFrom: ChannelType;
  title: string;
  participants: Participant[];
  messages: Message[];
  draft: ShipmentRequestDraft;
  phase: AgentPhase;
  phoneMatch?: {
    phone: string;
    accountLinkStatus: AccountLinkStatus;
  };
  createdAt: string;
  updatedAt: string;
};

export type AgentTurnResult = {
  conversation: Conversation;
  assistantMessage: Message;
  phase: AgentPhase;
};
