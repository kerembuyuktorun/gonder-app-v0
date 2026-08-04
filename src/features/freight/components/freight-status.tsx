"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppTextarea } from "@/components/shared/app-textarea";
import { MoneyDisplay } from "@/components/shared/money-display";
import { cn } from "@/lib/utils/cn";
import { QUOTE_STATUS_ORDER } from "@/features/freight/lib/status";
import type { FreightMessage, FreightRequest } from "@/types/freight";

export function FreightMessaging({
  messages,
  draft,
  onDraftChange,
  onSend,
}: {
  messages: FreightMessage[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
}) {
  const t = useTranslations("freight");
  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
      <h2 className="text-base font-semibold">{t("messagingTitle")}</h2>
      <p className="text-sm text-muted-foreground">{t("messagingHint")}</p>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              msg.author === "customer"
                ? "ml-6 bg-primary/10"
                : "mr-6 bg-card border border-border",
            )}
          >
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{msg.authorName}</span>
              <span>
                {new Date(msg.createdAt).toLocaleString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            <p className="mt-1">{msg.body}</p>
          </div>
        ))}
      </div>
      <AppTextarea
        label={t("messageLabel")}
        rows={2}
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
      />
      <AppButton type="button" size="sm" onClick={onSend} disabled={!draft.trim()}>
        {t("sendMessage")}
      </AppButton>
    </section>
  );
}

export function FreightQuoteStatusPanel({
  request,
  submitting,
  revisionNote,
  onRevisionNote,
  onAdvance,
  onAccept,
  onRequestRevision,
}: {
  request: FreightRequest;
  submitting: boolean;
  revisionNote: string;
  onRevisionNote: (v: string) => void;
  onAdvance: () => void;
  onAccept: () => void;
  onRequestRevision: () => void;
}) {
  const t = useTranslations("freight");
  const { quote } = request;

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{t("statusTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {request.reference} · {t(`modes.${request.mode}`)}
          </p>
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {t(`statuses.${quote.status}`)}
        </span>
      </div>

      <ol className="flex flex-wrap gap-2">
        {QUOTE_STATUS_ORDER.filter((s) => s !== "needs_info" || quote.status === "needs_info").map(
          (status) => {
            const active = quote.status === status;
            return (
              <li
                key={status}
                className={cn(
                  "rounded-md px-2 py-1 text-xs",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {t(`statuses.${status}`)}
              </li>
            );
          },
        )}
      </ol>

      <div className="rounded-lg bg-muted/40 px-3 py-3 text-sm">
        <p className="font-medium">{t("processLabel")}</p>
        <p className="mt-1 text-muted-foreground">
          {t(quote.processKey.replace("freight.", "") as "process.submitted")}
        </p>
        <p className="mt-2 font-medium">{t("nextLabel")}</p>
        <p className="mt-1 text-muted-foreground">
          {t(quote.nextStepKey.replace("freight.", "") as "next.submitted")}
        </p>
      </div>

      {quote.missingFields.length > 0 ? (
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          {quote.missingFields.map((f) => (
            <li key={f}>{t(`missing.${f}`)}</li>
          ))}
        </ul>
      ) : null}

      {quote.total ? (
        <div>
          <p className="text-xs text-muted-foreground">{t("quoteAmount")}</p>
          <MoneyDisplay value={quote.total} size="lg" />
          {quote.etaDaysMin != null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {t("etaDays", {
                min: quote.etaDaysMin,
                max: quote.etaDaysMax ?? quote.etaDaysMin,
              })}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {quote.status !== "accepted" &&
        quote.status !== "quote_ready" &&
        quote.status !== "revision_requested" ? (
          <AppButton
            type="button"
            onClick={onAdvance}
            loading={submitting}
          >
            {t("simulateAdvance")}
          </AppButton>
        ) : null}
        {quote.status === "revision_requested" ? (
          <AppButton type="button" onClick={onAdvance} loading={submitting}>
            {t("simulateAdvance")}
          </AppButton>
        ) : null}
        {quote.status === "quote_ready" ? (
          <>
            <AppButton type="button" onClick={onAccept} loading={submitting}>
              {t("acceptQuote")}
            </AppButton>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
              <AppTextarea
                label={t("revisionNote")}
                rows={2}
                value={revisionNote}
                onChange={(e) => onRevisionNote(e.target.value)}
              />
              <AppButton
                type="button"
                variant="secondary"
                onClick={onRequestRevision}
                loading={submitting}
              >
                {t("requestRevision")}
              </AppButton>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
