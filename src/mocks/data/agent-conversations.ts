import type { Conversation, Message, Participant } from "@/types/conversation";
import { createEmptyDraft, mergeExtraction } from "@/features/agent/lib/extraction";

export function createWhatsAppHandoffConversation(): Conversation {
  const conversationId = "wa-handoff-001";
  const user: Participant = {
    id: "part-user-wa",
    role: "user",
    displayName: "Ayşe Yılmaz",
    channel: "whatsapp",
    phone: "+905551112233",
    accountLinkStatus: "linked",
  };
  const agent: Participant = {
    id: "part-agent",
    role: "agent",
    displayName: "Gönder AI",
    channel: "whatsapp",
  };

  let draft = createEmptyDraft(`draft_${conversationId}`);
  draft = mergeExtraction(
    draft,
    "Yarın Antalya'dan İstanbul'a üç palet ürün göndermem gerekiyor.",
  );

  const messages: Message[] = [
    {
      id: "m-wa-1",
      conversationId,
      participantId: user.id,
      contentType: "text",
      text: "Yarın Antalya'dan İstanbul'a üç palet ürün göndermem gerekiyor.",
      createdAt: "2026-08-04T08:10:00.000Z",
      channel: "whatsapp",
    },
    {
      id: "m-wa-2",
      conversationId,
      participantId: agent.id,
      contentType: "text",
      text: "Anladım — bunu LTL (parsiyel) olarak sınıflandırdım. Alım tarihi yarın, 3 palet. Araç tipi veya ek not var mı?",
      createdAt: "2026-08-04T08:10:08.000Z",
      channel: "whatsapp",
      meta: {
        confidence: "medium",
        quickReplies: ["Kapalı kasa", "Tenteli", "Yeterli, devam"],
      },
    },
    {
      id: "m-wa-3",
      conversationId,
      participantId: agent.id,
      contentType: "system",
      text: "Bu konuşma WhatsApp üzerinden başladı. Gönder web panelinde devam edebilirsiniz.",
      createdAt: "2026-08-04T08:11:00.000Z",
      channel: "whatsapp",
    },
  ];

  return {
    id: conversationId,
    channel: "web",
    originatedFrom: "whatsapp",
    title: "WhatsApp · Antalya → İstanbul",
    participants: [user, agent],
    messages,
    draft,
    phase: "handoff_from_channel",
    phoneMatch: {
      phone: "+905551112233",
      accountLinkStatus: "linked",
    },
    createdAt: "2026-08-04T08:10:00.000Z",
    updatedAt: "2026-08-04T08:11:00.000Z",
  };
}

export const examplePrompts = [
  "İstanbul'dan Ankara'ya bugün kapalı kasa komple yük göndereceğim.",
  "Yarın Antalya'dan İstanbul'a üç palet ürün göndermem gerekiyor.",
  "Kadıköy'den Maslak'a bugün bir evrak götüreceğim.",
  "İzmir'den Bursa'ya 12 desilik bir koli göndermek istiyorum.",
] as const;
