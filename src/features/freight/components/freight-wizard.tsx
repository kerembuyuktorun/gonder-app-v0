"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { useFreightWizard } from "@/features/freight/hooks/use-freight-wizard";
import { FreightModeSelect } from "@/features/freight/components/freight-mode-select";
import { FreightSharedForm } from "@/features/freight/components/freight-shared-form";
import { FreightSidebar } from "@/features/freight/components/freight-sidebar";
import {
  FreightMessaging,
  FreightQuoteStatusPanel,
} from "@/features/freight/components/freight-status";
import type { FreightMode, FreightWizardStepId } from "@/types/freight";

function StepNav({
  current,
  modeLocked,
  onSelect,
}: {
  current: FreightWizardStepId;
  modeLocked: boolean;
  onSelect: (s: FreightWizardStepId) => void;
}) {
  const t = useTranslations("freight.steps");
  const steps: FreightWizardStepId[] = modeLocked
    ? ["form", "status"]
    : ["select", "form", "status"];
  const currentIndex = steps.indexOf(current === "success" ? "status" : current);

  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const active = step === current || (current === "success" && step === "status");
        const done = index < currentIndex;
        return (
          <li key={step}>
            <button
              type="button"
              onClick={() => onSelect(step)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm touch-target",
                active && "bg-primary text-primary-foreground",
                done && !active && "bg-success-bg text-success-fg",
                !active && !done && "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-black/10 text-xs font-semibold dark:bg-white/10">
                {index + 1}
              </span>
              {t(step)}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function FreightWizard({
  initialMode = null,
}: {
  initialMode?: FreightMode | null;
}) {
  const t = useTranslations("freight");
  const w = useFreightWizard(initialMode);
  const [pendingMode, setPendingMode] = React.useState<FreightMode | null>(
    initialMode,
  );

  if (w.step === "success" && w.request) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-bg text-2xl text-success-fg">
          ✓
        </div>
        <h1 className="font-display text-2xl font-semibold">{t("successTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("successBody")}</p>
        <p className="text-sm font-medium">{w.request.reference}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/app/home">
            <AppButton type="button">{t("backHome")}</AppButton>
          </Link>
          <AppButton type="button" variant="secondary" onClick={w.reset}>
            {t("newRequest")}
          </AppButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          initialMode
            ? t(`modes.${initialMode}`) + " — " + t("title")
            : t("title")
        }
        description={t("subtitle")}
      />
      <StepNav
        current={w.step}
        modeLocked={Boolean(initialMode)}
        onSelect={(s) => {
          if (s === "select" && !initialMode) w.goTo("select");
          if (s === "form" && w.draft.mode) w.goTo("form");
          if (s === "status" && w.request) w.goTo("status");
        }}
      />

      {w.step === "select" ? (
        <FreightModeSelect
          recommendation={w.recommendation}
          selected={pendingMode}
          onSelect={(mode) => {
            setPendingMode(mode);
            w.selectMode(mode);
          }}
        />
      ) : null}

      {w.step === "form" && w.draft.mode ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <FreightSharedForm
            draft={w.draft}
            mismatch={w.mismatch}
            patchDraft={w.patchDraft}
            updateLoading={w.updateLoading}
            updateDelivery={w.updateDelivery}
            updateLine={w.updateLine}
            addLine={w.addLine}
            removeLine={w.removeLine}
            patchFtl={w.patchFtl}
            patchLtl={w.patchLtl}
            addAttachments={w.addAttachments}
            removeAttachment={w.removeAttachment}
          />
          <FreightSidebar draft={w.draft} request={w.request} />
        </div>
      ) : null}

      {w.step === "status" && w.request ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <FreightQuoteStatusPanel
              request={w.request}
              submitting={w.submitting}
              revisionNote={w.revisionNote}
              onRevisionNote={w.setRevisionNote}
              onAdvance={() => void w.advance()}
              onAccept={() => void w.accept()}
              onRequestRevision={() => void w.requestRevision()}
            />
            <FreightMessaging
              messages={w.request.messages}
              draft={w.messageDraft}
              onDraftChange={w.setMessageDraft}
              onSend={() => void w.sendMessage()}
            />
          </div>
          <FreightSidebar draft={w.draft} request={w.request} />
        </div>
      ) : null}

      {w.error ? (
        <p className="text-sm text-error-fg">{t("errorGeneric")}</p>
      ) : null}

      {w.step === "form" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <AppButton
            type="button"
            variant="ghost"
            onClick={() => {
              if (initialMode) return;
              w.goTo("select");
            }}
            disabled={Boolean(initialMode)}
          >
            {t("back")}
          </AppButton>
          <AppButton
            type="button"
            onClick={() => void w.submit()}
            loading={w.submitting}
          >
            {t("submitRequest")}
          </AppButton>
        </div>
      ) : null}
    </div>
  );
}
