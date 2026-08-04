"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";
import type { SpotRequestDraft, SpotServiceKind } from "@/types/spot";

const KINDS: SpotServiceKind[] = ["ftl", "ltl", "xl", "parcel", "courier"];

export function SpotRequestForm({
  draft,
  onChange,
  onSubmit,
  submitting,
}: {
  draft: SpotRequestDraft;
  onChange: (p: Partial<SpotRequestDraft>) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const t = useTranslations("spot");

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
      <div>
        <h2 className="text-base font-semibold">{t("requestTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("requestHint")}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <AppInput
          containerClassName="sm:col-span-2"
          label={t("titleField")}
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <AppInput
          label={t("origin")}
          value={draft.originCity}
          onChange={(e) => onChange({ originCity: e.target.value })}
        />
        <AppInput
          label={t("destination")}
          value={draft.destinationCity}
          onChange={(e) => onChange({ destinationCity: e.target.value })}
        />
        <AppSelect
          label={t("serviceKind")}
          options={KINDS.map((k) => ({
            value: k,
            label: t(`kinds.${k}`),
          }))}
          value={draft.serviceKind}
          onValueChange={(v) =>
            onChange({ serviceKind: v as SpotServiceKind })
          }
        />
        <AppInput
          label={t("weight")}
          type="number"
          value={draft.weightKg}
          onChange={(e) => onChange({ weightKg: Number(e.target.value) || 0 })}
        />
        <AppInput
          label={t("pickupDate")}
          type="date"
          value={draft.pickupDate}
          onChange={(e) => onChange({ pickupDate: e.target.value })}
        />
        <div className="sm:col-span-2">
          <AppTextarea
            label={t("cargoSummary")}
            rows={2}
            value={draft.cargoSummary}
            onChange={(e) => onChange({ cargoSummary: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <AppTextarea
            label={t("notes")}
            rows={2}
            value={draft.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      </div>
      <AppButton type="button" onClick={onSubmit} loading={submitting}>
        {t("openSpot")}
      </AppButton>
    </section>
  );
}
