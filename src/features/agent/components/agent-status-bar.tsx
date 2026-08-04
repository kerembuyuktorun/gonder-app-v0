"use client";

import { useTranslations } from "next-intl";
import type { AgentPhase } from "@/types/conversation";
import { cn } from "@/lib/utils/cn";

export function AgentStatusBar({ phase }: { phase: AgentPhase }) {
  const t = useTranslations("agent");
  const map: Record<AgentPhase, string> = {
    thinking: t("thinking"),
    awaiting_missing_info: t("awaitingMissing"),
    draft_ready: t("draftReady"),
    awaiting_confirmation: t("awaitingConfirm"),
    service_unavailable: t("unavailable"),
    retrying: t("retrying"),
    handoff_from_channel: t("handoff"),
    idle: t("idle"),
    completed: t("completed"),
  };

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground",
        phase === "thinking" && "text-info-fg",
        phase === "service_unavailable" && "border-error/30 bg-error-bg text-error-fg",
        phase === "awaiting_confirmation" && "text-success-fg",
        phase === "handoff_from_channel" && "text-warning-fg",
      )}
      aria-live="polite"
    >
      {map[phase]}
    </div>
  );
}
