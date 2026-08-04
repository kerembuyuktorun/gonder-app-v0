"use client";

import * as React from "react";
import { agentRepository } from "@/lib/api/client";
import type { Conversation, ShipmentRequestDraft } from "@/types/conversation";
import type { ServiceType } from "@/types/domain";

type UseAgentOptions = {
  initialPrompt?: string | null;
  serviceHint?: ServiceType | null;
  conversationId?: string | null;
  fromWhatsApp?: boolean;
};

export function useAgentConversation(options: UseAgentOptions) {
  const [conversation, setConversation] = React.useState<Conversation | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdRequestId, setCreatedRequestId] = React.useState<string | null>(
    null,
  );
  const bootstrapped = React.useRef(false);

  React.useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        if (options.fromWhatsApp || options.conversationId === "wa-handoff-001") {
          const conv = await agentRepository.continueFromWhatsApp(
            options.conversationId ?? "wa-handoff-001",
          );
          setConversation(conv);
          return;
        }
        const conv = await agentRepository.startConversation({
          channel: "web",
          initialPrompt: options.initialPrompt ?? undefined,
          serviceHint: options.serviceHint ?? undefined,
          conversationId: options.conversationId ?? undefined,
        });
        setConversation(conv);
      } catch {
        setError("service_unavailable");
      } finally {
        setLoading(false);
      }
    })();
  }, [
    options.conversationId,
    options.fromWhatsApp,
    options.initialPrompt,
    options.serviceHint,
  ]);

  const sendMessage = React.useCallback(async (text: string) => {
    if (!conversation || !text.trim()) return;
    setSending(true);
    setError(null);
    try {
      const result = await agentRepository.sendMessage({
        conversationId: conversation.id,
        text: text.trim(),
        channel: "web",
      });
      setConversation(result.conversation);
    } catch {
      setError("service_unavailable");
      setConversation((prev) =>
        prev ? { ...prev, phase: "service_unavailable" } : prev,
      );
    } finally {
      setSending(false);
    }
  }, [conversation]);

  const updateDraft = React.useCallback(
    async (patch: Partial<ShipmentRequestDraft>) => {
      if (!conversation) return;
      const updated = await agentRepository.updateDraft({
        conversationId: conversation.id,
        patch,
      });
      setConversation(updated);
    },
    [conversation],
  );

  const confirmDraft = React.useCallback(async () => {
    if (!conversation) return;
    setSending(true);
    try {
      const result = await agentRepository.confirmDraft(conversation.id);
      setConversation(result.conversation);
      setCreatedRequestId(result.requestId);
    } catch {
      setError("not_ready");
    } finally {
      setSending(false);
    }
  }, [conversation]);

  return {
    conversation,
    loading,
    sending,
    error,
    createdRequestId,
    sendMessage,
    updateDraft,
    confirmDraft,
    setConversation,
  };
}
