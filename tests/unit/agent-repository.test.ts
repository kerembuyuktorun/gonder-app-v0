import { describe, expect, it, beforeEach } from "vitest";
import { mockAgentRepository } from "@/mocks/repositories/mock-agent-repository";

describe("mock agent repository", () => {
  beforeEach(() => {
    // repository uses in-memory map; WhatsApp seed is recreated on continue
  });

  it("starts a conversation and asks for missing fields", async () => {
    const conversation = await mockAgentRepository.startConversation({
      channel: "web",
      initialPrompt: "Bir şey göndermek istiyorum",
    });
    expect(conversation.messages.length).toBeGreaterThan(1);
    expect(conversation.draft.missingFields.length).toBeGreaterThan(0);
    expect(["awaiting_missing_info", "awaiting_confirmation", "thinking"]).toContain(
      conversation.phase,
    );
  });

  it("builds a confirmable FTL draft from a rich prompt", async () => {
    const conversation = await mockAgentRepository.startConversation({
      initialPrompt:
        "İstanbul'dan Ankara'ya bugün kapalı kasa komple yük göndereceğim. Genel kargo.",
    });
    expect(conversation.draft.serviceType).toBe("ftl");
    expect(conversation.draft.origin).toBeTruthy();
    expect(conversation.draft.destination).toBeTruthy();
    expect(conversation.draft.vehicleType).toMatch(/kasa/i);
  });

  it("requires confirmDraft and never auto-creates", async () => {
    const started = await mockAgentRepository.startConversation({
      initialPrompt:
        "Kadıköy'den Maslak'a bugün bir evrak götüreceğim.",
    });
    // Fill remaining if any via follow-up
    let conversation = started;
    if (!conversation.draft.readyForConfirm) {
      const turn = await mockAgentRepository.sendMessage({
        conversationId: conversation.id,
        text: "Evrak, bugün yeterli",
      });
      conversation = turn.conversation;
    }

    if (conversation.draft.readyForConfirm) {
      const confirmed = await mockAgentRepository.confirmDraft(conversation.id);
      expect(confirmed.requestId).toMatch(/^req_/);
      expect(confirmed.conversation.phase).toBe("completed");
    } else {
      await expect(
        mockAgentRepository.confirmDraft(conversation.id),
      ).rejects.toBeTruthy();
    }
  });

  it("continues WhatsApp conversation on web with linked phone", async () => {
    const conversation = await mockAgentRepository.continueFromWhatsApp(
      "wa-handoff-001",
    );
    expect(conversation.originatedFrom).toBe("whatsapp");
    expect(conversation.channel).toBe("web");
    expect(conversation.phase).toBe("handoff_from_channel");
    expect(conversation.phoneMatch?.accountLinkStatus).toBe("linked");
    expect(conversation.messages.some((m) => m.channel === "whatsapp")).toBe(
      true,
    );
  });
});
