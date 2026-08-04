"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { AppButton } from "@/components/shared/app-button";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useAgentConversation } from "@/features/agent/hooks/use-agent-conversation";
import { MessageList } from "@/features/agent/components/message-list";
import { MessageComposer } from "@/features/agent/components/message-composer";
import { QuickReplies } from "@/features/agent/components/quick-replies";
import { DraftPanel } from "@/features/agent/components/draft-panel";
import { AgentStatusBar } from "@/features/agent/components/agent-status-bar";
import { examplePrompts } from "@/mocks/data/agent-conversations";
import type { ServiceType } from "@/types/domain";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "@/lib/i18n/navigation";

export function AgentWorkspace({
  initialPrompt,
  serviceHint,
  conversationId,
  fromWhatsApp,
}: {
  initialPrompt?: string | null;
  serviceHint?: ServiceType | null;
  conversationId?: string | null;
  fromWhatsApp?: boolean;
}) {
  const t = useTranslations("agent");
  const router = useRouter();
  const {
    conversation,
    loading,
    sending,
    error,
    createdRequestId,
    sendMessage,
    updateDraft,
    confirmDraft,
  } = useAgentConversation({
    initialPrompt,
    serviceHint,
    conversationId,
    fromWhatsApp,
  });

  const [mobileTab, setMobileTab] = React.useState<"chat" | "draft">("chat");
  const [panelWidth, setPanelWidth] = React.useState(420);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      const next = Math.min(560, Math.max(320, window.innerWidth - e.clientX));
      setPanelWidth(next);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const latestQuickReplies =
    conversation?.messages
      .slice()
      .reverse()
      .find((m) => m.meta?.quickReplies?.length)?.meta?.quickReplies ?? [];

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton rows={2} variant="form" />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (error === "service_unavailable" && !conversation) {
    return (
      <ErrorState
        title={t("unavailable")}
        description={t("subtitle")}
        retryLabel={t("goToForm")}
        onRetry={() => router.push("/app/requests/new/form")}
      />
    );
  }

  if (!conversation) return null;

  const chatPane = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 border-b border-border p-4">
        <AgentStatusBar phase={sending ? "thinking" : conversation.phase} />
        {conversation.messages.length <= 2 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {t("examples")}
            </p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt) => (
                <AppButton
                  key={prompt}
                  size="sm"
                  variant="outline"
                  className="h-auto max-w-full whitespace-normal px-3 py-2 text-left text-xs"
                  disabled={sending}
                  onClick={() => void sendMessage(prompt)}
                >
                  {prompt}
                </AppButton>
              ))}
            </div>
          </div>
        ) : null}
        <Link href="/app/agent?from=whatsapp&conversationId=wa-handoff-001">
          <AppButton size="sm" variant="ghost" className="px-0">
            {t("whatsappContinue")}
          </AppButton>
        </Link>
      </div>

      <MessageList
        messages={conversation.messages}
        participants={conversation.participants}
      />
      <QuickReplies
        options={latestQuickReplies}
        disabled={sending}
        onSelect={(value) => void sendMessage(value)}
      />
      <MessageComposer
        disabled={sending || conversation.phase === "completed"}
        onSend={(text) => void sendMessage(text)}
      />
    </div>
  );

  const draftPane = (
    <DraftPanel
      conversation={conversation}
      onDraftChange={(patch) => void updateDraft(patch)}
      onConfirm={() => void confirmDraft()}
      confirming={sending}
      createdRequestId={createdRequestId}
    />
  );

  return (
    <div className="flex h-[calc(100dvh-var(--topbar-height)-2rem)] min-h-[32rem] flex-col gap-4">
      <PageHeader title={t("title")} description={t("subtitle")} />

      {/* Mobile tabs */}
      <div className="flex gap-2 lg:hidden">
        <AppButton
          size="sm"
          variant={mobileTab === "chat" ? "primary" : "secondary"}
          onClick={() => setMobileTab("chat")}
        >
          {t("chat")}
        </AppButton>
        <AppButton
          size="sm"
          variant={mobileTab === "draft" ? "primary" : "secondary"}
          onClick={() => setMobileTab("draft")}
        >
          {t("draft")}
        </AppButton>
      </div>

      <div className="min-h-0 flex-1 lg:hidden">
        <div className="h-full overflow-hidden rounded-xl border border-border bg-card">
          {mobileTab === "chat" ? chatPane : draftPane}
        </div>
      </div>

      {/* Desktop split */}
      <div className="hidden min-h-0 flex-1 lg:flex">
        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
          {chatPane}
        </div>
        <button
          type="button"
          aria-label={t("resizePanel")}
          className="mx-1 w-1.5 shrink-0 cursor-col-resize rounded-full bg-border hover:bg-brand-400"
          onMouseDown={() => {
            dragging.current = true;
          }}
        />
        <div
          className={cn("shrink-0 overflow-hidden rounded-xl border border-border bg-card")}
          style={{ width: panelWidth }}
        >
          {draftPane}
        </div>
      </div>
    </div>
  );
}
