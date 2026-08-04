"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { Link } from "@/lib/i18n/navigation";
import { ChannelBadge } from "@/features/agent/components/channel-badge";
import { ConfidenceIndicator } from "@/features/agent/components/confidence-indicator";
import {
  ExtractedFieldsCard,
  MissingFieldsList,
} from "@/features/agent/components/extracted-fields-card";
import { EditableDraftSummary } from "@/features/agent/components/editable-draft-summary";
import type { Conversation, ShipmentRequestDraft } from "@/types/conversation";
import { Separator } from "@/components/ui/separator";

export function DraftPanel({
  conversation,
  onDraftChange,
  onConfirm,
  confirming,
  createdRequestId,
}: {
  conversation: Conversation;
  onDraftChange: (patch: Partial<ShipmentRequestDraft>) => void;
  onConfirm: () => void;
  confirming?: boolean;
  createdRequestId?: string | null;
}) {
  const t = useTranslations("agent");
  const draft = conversation.draft;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <ChannelBadge channel={conversation.originatedFrom} />
          {conversation.originatedFrom !== conversation.channel ? (
            <ChannelBadge channel={conversation.channel} />
          ) : null}
          <ConfidenceIndicator level={draft.overallConfidence} />
        </div>
        {conversation.phoneMatch ? (
          <p className="text-xs text-muted-foreground">
            {t("phoneMatch", { phone: conversation.phoneMatch.phone })} ·{" "}
            {conversation.phoneMatch.accountLinkStatus === "linked"
              ? t("accountLinked")
              : conversation.phoneMatch.accountLinkStatus === "pending_verification"
                ? t("accountPending")
                : t("accountUnlinked")}
          </p>
        ) : null}
        <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          {t("safetyBanner")}
        </p>
        {draft.overallConfidence === "low" ? (
          <p className="rounded-md bg-error-bg px-3 py-2 text-xs text-error-fg">
            {t("lowConfidenceWarn")}
          </p>
        ) : null}
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">{t("extractedTitle")}</h3>
        <ExtractedFieldsCard fields={draft.extractedFields} />
      </section>

      {draft.missingFields.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{t("missingTitle")}</h3>
          <MissingFieldsList fields={draft.missingFields} />
        </section>
      ) : null}

      {draft.validationIssues.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{t("issuesTitle")}</h3>
          <ul className="space-y-1.5">
            {draft.validationIssues.map((issue) => (
              <li
                key={issue.id}
                className={
                  issue.severity === "error"
                    ? "rounded-md bg-error-bg px-3 py-2 text-xs text-error-fg"
                    : "rounded-md bg-warning-bg px-3 py-2 text-xs text-warning-fg"
                }
              >
                {issue.messageKey.endsWith("desiMismatch")
                  ? t("issues.desiMismatch")
                  : t("issues.sameCity")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Separator />

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">{t("editableSummary")}</h3>
        <EditableDraftSummary
          draft={draft}
          onChange={onDraftChange}
          disabled={conversation.phase === "completed"}
        />
      </section>

      <div className="mt-auto space-y-2 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">{t("confirmHint")}</p>
        {createdRequestId ? (
          <p className="rounded-md bg-success-bg px-3 py-2 text-sm text-success-fg">
            {t("createdSuccess", { id: createdRequestId })}
          </p>
        ) : null}
        <AppButton
          className="w-full"
          disabled={!draft.readyForConfirm || conversation.phase === "completed"}
          loading={confirming}
          onClick={onConfirm}
        >
          {t("confirm")}
        </AppButton>
        <Link href="/app/requests/new/form" className="block">
          <AppButton variant="secondary" className="w-full">
            {t("goToForm")}
          </AppButton>
        </Link>
      </div>
    </div>
  );
}
