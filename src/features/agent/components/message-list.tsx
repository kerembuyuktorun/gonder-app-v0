"use client";

import { useTranslations } from "next-intl";
import type { Message, Participant } from "@/types/conversation";
import { ChannelBadge } from "@/features/agent/components/channel-badge";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/format";
import { useLocale } from "next-intl";

export function MessageList({
  messages,
  participants,
}: {
  messages: Message[];
  participants: Participant[];
}) {
  const t = useTranslations("agent");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const byId = Object.fromEntries(participants.map((p) => [p.id, p]));

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-2">
      {messages.map((message) => {
        const participant = byId[message.participantId];
        const isUser = participant?.role === "user";
        const isSystem =
          message.contentType === "system" || participant?.role === "system";

        if (isSystem) {
          return (
            <div
              key={message.id}
              className="mx-auto max-w-[90%] rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground"
            >
              {message.text}
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[85%] flex-col gap-1",
              isUser ? "ml-auto items-end" : "mr-auto items-start",
            )}
          >
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{participant?.displayName ?? t("title")}</span>
              <ChannelBadge channel={message.channel} />
            </div>
            <div
              className={cn(
                "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card",
              )}
            >
              {message.text}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {formatDateTime(message.createdAt, intlLocale)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
