import type {
  AgentRepository,
  ConfirmDraftResult,
  SendMessageInput,
  StartConversationInput,
  UpdateDraftInput,
} from "@/lib/api/agent-repository";
import {
  createEmptyDraft,
  mergeExtraction,
  nextMissingPrompt,
} from "@/features/agent/lib/extraction";
import { createWhatsAppHandoffConversation } from "@/mocks/data/agent-conversations";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import type {
  AgentPhase,
  Conversation,
  Message,
  Participant,
} from "@/types/conversation";
import { AuthError } from "@/types/auth";

type AgentDb = {
  conversations: Record<string, Conversation>;
};

const memory: AgentDb = {
  conversations: {
    "wa-handoff-001": createWhatsAppHandoffConversation(),
  },
};

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

function getAgentParticipant(conversation: Conversation): Participant {
  return (
    conversation.participants.find((p) => p.role === "agent") ?? {
      id: createId("part"),
      role: "agent",
      displayName: "Gönder AI",
      channel: conversation.channel,
    }
  );
}

function getUserParticipant(conversation: Conversation): Participant {
  return (
    conversation.participants.find((p) => p.role === "user") ?? {
      id: createId("part"),
      role: "user",
      displayName: "Kullanıcı",
      channel: conversation.channel,
    }
  );
}

function buildAssistantReply(conversation: Conversation): {
  text: string;
  phase: AgentPhase;
  quickReplies?: string[];
} {
  const { draft } = conversation;

  if (draft.validationIssues.some((i) => i.severity === "error")) {
    return {
      text: "Bazı bilgiler çelişkili görünüyor. Lütfen hizmet türü veya ölçü bilgisini doğrulayın.",
      phase: "awaiting_missing_info",
      quickReplies: ["Gönder XL yap", "Desiyi düzelt", "Detaylı forma geç"],
    };
  }

  if (draft.missingFields.length > 0) {
    const field = draft.missingFields[0];
    return {
      text: nextMissingPrompt(field),
      phase: "awaiting_missing_info",
      quickReplies: quickRepliesFor(field),
    };
  }

  if (draft.overallConfidence === "low") {
    return {
      text: "Taslak hazır görünüyor ancak bazı alanlarda güvenim düşük. Lütfen çıkarılan bilgileri onaylayın veya düzeltin.",
      phase: "awaiting_confirmation",
      quickReplies: ["Onaylıyorum", "Düzenle", "Detaylı forma geç"],
    };
  }

  return {
    text: "Taşıma talebi taslağı hazır. Onaylamadan önce sağ paneldeki bilgileri kontrol edin. Onayınız olmadan sipariş oluşturmam.",
    phase: "awaiting_confirmation",
    quickReplies: ["Talebi onayla", "Düzenle", "Detaylı forma geç"],
  };
}

function quickRepliesFor(field: string): string[] | undefined {
  switch (field) {
    case "serviceType":
      return ["Kurye", "Kargo", "Gönder XL", "FTL", "LTL", "Spot"];
    case "pickupDate":
      return ["Bugün", "Yarın"];
    case "vehicleType":
      return ["Kapalı kasa", "Tenteli", "Frigo"];
    case "cargoType":
      return ["Evrak", "Koli", "Paletli ürün"];
    default:
      return undefined;
  }
}

function requireConversation(id: string): Conversation {
  const conversation = memory.conversations[id];
  if (!conversation) throw new AuthError("not_found", "Conversation not found");
  return structuredClone(conversation);
}

function save(conversation: Conversation): Conversation {
  memory.conversations[conversation.id] = structuredClone(conversation);
  return structuredClone(conversation);
}

export const mockAgentRepository: AgentRepository = {
  async listConversations() {
    return runWithMockLatency(
      () => Object.values(memory.conversations).map((c) => structuredClone(c)),
      120,
    );
  },

  async getConversation(id) {
    return runWithMockLatency(() => {
      const conversation = memory.conversations[id];
      return conversation ? structuredClone(conversation) : null;
    }, 100);
  },

  async startConversation(input: StartConversationInput) {
    return runWithMockLatency(() => {
      if (input.conversationId === "wa-handoff-001") {
        const existing = createWhatsAppHandoffConversation();
        existing.channel = "web";
        existing.phase = "handoff_from_channel";
        return save(existing);
      }

      const conversationId = createId("conv");
      const user: Participant = {
        id: createId("part"),
        role: "user",
        displayName: "Kullanıcı",
        channel: input.channel ?? "web",
        accountLinkStatus: "linked",
      };
      const agent: Participant = {
        id: createId("part"),
        role: "agent",
        displayName: "Gönder AI",
        channel: input.channel ?? "web",
      };

      let draft = createEmptyDraft(createId("draft"));
      const messages: Message[] = [];

      if (input.initialPrompt?.trim()) {
        draft = mergeExtraction(draft, input.initialPrompt, input.serviceHint);
        messages.push({
          id: createId("msg"),
          conversationId,
          participantId: user.id,
          contentType: "text",
          text: input.initialPrompt.trim(),
          createdAt: now(),
          channel: input.channel ?? "web",
        });
      } else if (input.serviceHint) {
        draft = mergeExtraction(draft, "", input.serviceHint);
      }

      const conversation: Conversation = {
        id: conversationId,
        channel: input.channel ?? "web",
        originatedFrom: input.channel ?? "web",
        title: "Yeni taşıma talebi",
        participants: [user, agent],
        messages,
        draft,
        phase: input.initialPrompt ? "thinking" : "idle",
        createdAt: now(),
        updatedAt: now(),
      };

      if (input.initialPrompt?.trim()) {
        const reply = buildAssistantReply(conversation);
        conversation.phase = reply.phase;
        conversation.messages.push({
          id: createId("msg"),
          conversationId,
          participantId: agent.id,
          contentType: "text",
          text: reply.text,
          createdAt: now(),
          channel: conversation.channel,
          meta: {
            confidence: draft.overallConfidence,
            quickReplies: reply.quickReplies,
          },
        });
      } else {
        conversation.messages.push({
          id: createId("msg"),
          conversationId,
          participantId: agent.id,
          contentType: "text",
          text: "Merhaba, Gönder AI Logistics Agent. Doğal dilde taşıma ihtiyacınızı yazın veya örneklerden birini seçin.",
          createdAt: now(),
          channel: conversation.channel,
          meta: {
            quickReplies: [
              "İstanbul'dan Ankara'ya bugün kapalı kasa komple yük",
              "Kadıköy'den Maslak'a evrak",
              "12 desi koli İzmir → Bursa",
            ],
          },
        });
      }

      return save(conversation);
    }, 350);
  },

  async sendMessage(input: SendMessageInput) {
    return runWithMockLatency(() => {
      const conversation = requireConversation(input.conversationId);
      const user = getUserParticipant(conversation);
      const agent = getAgentParticipant(conversation);

      conversation.phase = "thinking";
      const userMessage: Message = {
        id: createId("msg"),
        conversationId: conversation.id,
        participantId: user.id,
        contentType: "text",
        text: input.text,
        createdAt: now(),
        channel: input.channel ?? conversation.channel,
      };
      conversation.messages.push(userMessage);

      // Simulate unavailable keyword
      if (/servis yok|unavailable/i.test(input.text)) {
        conversation.phase = "service_unavailable";
        const assistantMessage: Message = {
          id: createId("msg"),
          conversationId: conversation.id,
          participantId: agent.id,
          contentType: "system",
          text: "AI Agent servisi şu an kullanılamıyor. Detaylı forma geçebilir veya tekrar deneyebilirsiniz.",
          createdAt: now(),
          channel: conversation.channel,
        };
        conversation.messages.push(assistantMessage);
        conversation.updatedAt = now();
        save(conversation);
        return { conversation, assistantMessage, phase: conversation.phase };
      }

      conversation.draft = mergeExtraction(conversation.draft, input.text);
      const reply = buildAssistantReply(conversation);
      conversation.phase = reply.phase;
      if (conversation.draft.readyForConfirm) {
        conversation.phase = "draft_ready";
        // then move to awaiting confirmation messaging
        conversation.phase = "awaiting_confirmation";
      }

      const assistantMessage: Message = {
        id: createId("msg"),
        conversationId: conversation.id,
        participantId: agent.id,
        contentType: "text",
        text: reply.text,
        createdAt: now(),
        channel: conversation.channel,
        meta: {
          confidence: conversation.draft.overallConfidence,
          quickReplies: reply.quickReplies,
        },
      };
      conversation.messages.push(assistantMessage);
      conversation.updatedAt = now();
      save(conversation);
      return { conversation, assistantMessage, phase: conversation.phase };
    }, 450);
  },

  async updateDraft(input: UpdateDraftInput) {
    return runWithMockLatency(() => {
      const conversation = requireConversation(input.conversationId);
      conversation.draft = {
        ...conversation.draft,
        ...input.patch,
      };
      // Recompute missing via merge with empty text using patched values
      const synthetic = [
        conversation.draft.origin && `nereden ${conversation.draft.origin}`,
        conversation.draft.destination && `nereye ${conversation.draft.destination}`,
        conversation.draft.pickupDate && `tarih ${conversation.draft.pickupDate}`,
        conversation.draft.weightDesi && `${conversation.draft.weightDesi} desi`,
        conversation.draft.palletCount && `${conversation.draft.palletCount} palet`,
        conversation.draft.vehicleType,
        conversation.draft.cargoType,
      ]
        .filter(Boolean)
        .join(" ");
      conversation.draft = mergeExtraction(
        {
          ...createEmptyDraft(conversation.draft.id),
          ...conversation.draft,
          extractedFields: [],
        },
        synthetic,
        conversation.draft.serviceType,
      );
      conversation.phase = conversation.draft.readyForConfirm
        ? "awaiting_confirmation"
        : "awaiting_missing_info";
      conversation.updatedAt = now();
      return save(conversation);
    }, 150);
  },

  async confirmDraft(conversationId: string): Promise<ConfirmDraftResult> {
    return runWithMockLatency(() => {
      const conversation = requireConversation(conversationId);
      if (!conversation.draft.readyForConfirm) {
        throw new AuthError("incomplete_onboarding", "Draft is not ready");
      }
      // Safety: require explicit confirm API — never auto-create
      conversation.phase = "completed";
      const agent = getAgentParticipant(conversation);
      conversation.messages.push({
        id: createId("msg"),
        conversationId: conversation.id,
        participantId: agent.id,
        contentType: "system",
        text: "Talebiniz oluşturuldu. Ödeme veya teklif kabulü için ayrıca onayınız gerekir.",
        createdAt: now(),
        channel: conversation.channel,
      });
      conversation.updatedAt = now();
      save(conversation);
      return {
        requestId: createId("req"),
        conversation: structuredClone(conversation),
      };
    }, 400);
  },

  async continueFromWhatsApp(conversationId: string) {
    return runWithMockLatency(() => {
      const base =
        memory.conversations[conversationId] ??
        createWhatsAppHandoffConversation();
      base.channel = "web";
      base.phase = "handoff_from_channel";
      base.updatedAt = now();
      const agent = getAgentParticipant(base);
      base.messages.push({
        id: createId("msg"),
        conversationId: base.id,
        participantId: agent.id,
        contentType: "system",
        text: "WhatsApp konuşması web paneline aktarıldı. Telefon numaranız hesapla eşleşti. Kaldığınız yerden devam edebilirsiniz.",
        createdAt: now(),
        channel: "web",
      });
      return save(base);
    }, 250);
  },

  async getMissingFieldPrompt(conversationId, field) {
    return runWithMockLatency(() => {
      requireConversation(conversationId);
      return nextMissingPrompt(field);
    }, 50);
  },
};
