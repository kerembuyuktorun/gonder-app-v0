"use client";

import { useTranslations } from "next-intl";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";
import {
  FreightBodyCards,
  FreightVehicleCards,
} from "@/features/freight/components/freight-vehicle-cards";
import { FreightCargoTable } from "@/features/freight/components/freight-cargo-table";
import { FreightAttachments } from "@/features/freight/components/freight-attachments";
import {
  FREIGHT_CARGO_TYPES,
  FREIGHT_LOAD_METHODS,
  TIME_WINDOWS,
} from "@/mocks/data/freight";
import type {
  FreightAddress,
  FreightBodyType,
  FreightCargoLine,
  FreightCargoType,
  FreightDraft,
  FreightFtlDetails,
  FreightLoadMethod,
  FreightLtlDetails,
  FreightMode,
  FreightModeRecommendation,
  FreightVehicleType,
} from "@/types/freight";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function AddressFields({
  address,
  onChange,
}: {
  address: FreightAddress;
  onChange: (p: Partial<FreightAddress>) => void;
}) {
  const t = useTranslations();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        containerClassName="sm:col-span-2"
        label={t("fields.addressLine1")}
        value={address.line1}
        onChange={(e) => onChange({ line1: e.target.value })}
      />
      <AppInput
        label={t("fields.district")}
        value={address.district}
        onChange={(e) => onChange({ district: e.target.value })}
      />
      <AppInput
        label={t("fields.city")}
        value={address.city}
        onChange={(e) => onChange({ city: e.target.value })}
      />
    </div>
  );
}

export function FreightFtlFields({
  ftl,
  onChange,
}: {
  ftl: FreightFtlDetails;
  onChange: (p: Partial<FreightFtlDetails>) => void;
}) {
  const t = useTranslations("freight");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        label={t("vehicleCapacity")}
        type="number"
        min={1}
        value={ftl.vehicleCapacityTons}
        onChange={(e) =>
          onChange({ vehicleCapacityTons: Number(e.target.value) || 0 })
        }
      />
      <AppInput
        label={t("vehicleLength")}
        type="number"
        min={1}
        step={0.1}
        value={ftl.vehicleLengthM}
        onChange={(e) =>
          onChange({ vehicleLengthM: Number(e.target.value) || 0 })
        }
      />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          checked={ftl.multiVehicle}
          onChange={(e) => onChange({ multiVehicle: e.target.checked })}
          className="size-4 rounded border-border"
        />
        {t("multiVehicle")}
      </label>
      {ftl.multiVehicle ? (
        <AppInput
          label={t("vehicleCount")}
          type="number"
          min={1}
          value={ftl.vehicleCount}
          onChange={(e) =>
            onChange({ vehicleCount: Number(e.target.value) || 1 })
          }
        />
      ) : null}
      <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
        {(
          [
            ["bodyClosed", "bodyClosed"],
            ["bodyCurtain", "bodyCurtain"],
            ["bodyReefer", "bodyReefer"],
            ["bodyOpen", "bodyOpen"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ftl[key]}
              onChange={(e) => onChange({ [key]: e.target.checked })}
              className="size-4 rounded border-border"
            />
            {t(label)}
          </label>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          checked={ftl.adrRequired}
          onChange={(e) => onChange({ adrRequired: e.target.checked })}
          className="size-4 rounded border-border"
        />
        {t("adrRequired")}
      </label>
      <div className="sm:col-span-2">
        <AppTextarea
          label={t("specialRequirements")}
          rows={2}
          value={ftl.specialRequirements}
          onChange={(e) => onChange({ specialRequirements: e.target.value })}
        />
      </div>
    </div>
  );
}

export function FreightLtlFields({
  ltl,
  onChange,
}: {
  ltl: FreightLtlDetails;
  onChange: (p: Partial<FreightLtlDetails>) => void;
}) {
  const t = useTranslations("freight");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        label={t("volumeM3")}
        type="number"
        min={0}
        step={0.1}
        value={ltl.volumeM3}
        onChange={(e) => onChange({ volumeM3: Number(e.target.value) || 0 })}
      />
      <AppInput
        label={t("loadingMeters")}
        type="number"
        min={0}
        step={0.1}
        value={ltl.loadingMeters}
        onChange={(e) =>
          onChange({ loadingMeters: Number(e.target.value) || 0 })
        }
      />
      {(
        [
          ["stackable", "stackable"],
          ["hubTransferOk", "hubTransferOk"],
          ["flexibleDelivery", "flexibleDelivery"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={ltl[key]}
            onChange={(e) => onChange({ [key]: e.target.checked })}
            className="size-4 rounded border-border"
          />
          {t(label)}
        </label>
      ))}
      <div className="sm:col-span-2">
        <AppTextarea
          label={t("constraints")}
          rows={2}
          value={ltl.constraints}
          onChange={(e) => onChange({ constraints: e.target.value })}
        />
      </div>
    </div>
  );
}

export function FreightSharedForm({
  draft,
  mismatch,
  patchDraft,
  updateLoading,
  updateDelivery,
  updateLine,
  addLine,
  removeLine,
  patchFtl,
  patchLtl,
  addAttachments,
  removeAttachment,
}: {
  draft: FreightDraft;
  mismatch: FreightModeRecommendation | null;
  patchDraft: (p: Partial<FreightDraft>) => void;
  updateLoading: (p: Partial<FreightAddress>) => void;
  updateDelivery: (p: Partial<FreightAddress>) => void;
  updateLine: (id: string, p: Partial<FreightCargoLine>) => void;
  addLine: () => void;
  removeLine: (id: string) => void;
  patchFtl: (p: Partial<FreightFtlDetails>) => void;
  patchLtl: (p: Partial<FreightLtlDetails>) => void;
  addAttachments: (files: FileList, kind: "photo" | "document") => void;
  removeAttachment: (id: string) => void;
}) {
  const t = useTranslations("freight");
  const mode = draft.mode as FreightMode;
  const windowValue = `${draft.loadingWindowStart}|${draft.loadingWindowEnd}`;

  return (
    <div className="space-y-4">
      {mismatch?.warningKey ? (
        <div className="rounded-xl border border-warning/40 bg-warning-bg px-4 py-3 text-sm text-warning-fg">
          <p className="font-semibold">{t("mismatchTitle")}</p>
          <p className="mt-1">
            {t(
              mismatch.warningKey.replace("freight.", "") as
                | "recommend.warnLtlForHeavy"
                | "recommend.warnFtlForLight",
            )}
          </p>
          <p className="mt-1 text-xs">
            {t("mismatchSuggest", {
              mode: t(`modes.${mismatch.suggested}`),
            })}
          </p>
        </div>
      ) : null}

      <Section title={t("addressesTitle")}>
        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t("loadingAddress")}</h3>
            <AddressFields address={draft.loading} onChange={updateLoading} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t("deliveryAddress")}</h3>
            <AddressFields address={draft.delivery} onChange={updateDelivery} />
          </div>
        </div>
      </Section>

      <Section title={t("scheduleTitle")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AppInput
            label={t("loadingDate")}
            type="date"
            value={draft.loadingDate}
            onChange={(e) => patchDraft({ loadingDate: e.target.value })}
          />
          <AppSelect
            label={t("loadingWindow")}
            options={TIME_WINDOWS.map((w) => ({
              value: `${w.start}|${w.end}`,
              label: `${w.start} – ${w.end}`,
            }))}
            value={windowValue}
            onValueChange={(v) => {
              const [loadingWindowStart, loadingWindowEnd] = v.split("|");
              patchDraft({ loadingWindowStart, loadingWindowEnd });
            }}
          />
          <AppInput
            containerClassName="sm:col-span-2"
            label={t("deliveryExpectation")}
            value={draft.deliveryExpectation}
            onChange={(e) =>
              patchDraft({ deliveryExpectation: e.target.value })
            }
          />
        </div>
      </Section>

      <Section title={t("cargoTitle")} description={t("cargoHint")}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <AppSelect
            label={t("cargoType")}
            options={FREIGHT_CARGO_TYPES.map((c) => ({
              value: c,
              label: t(`cargoTypes.${c}`),
            }))}
            value={draft.cargoType}
            onValueChange={(v) =>
              patchDraft({ cargoType: v as FreightCargoType })
            }
          />
          <AppSelect
            label={t("loadMethod")}
            options={FREIGHT_LOAD_METHODS.map((m) => ({
              value: m,
              label: t(`loadMethods.${m}`),
            }))}
            value={draft.loadMethod}
            onValueChange={(v) =>
              patchDraft({ loadMethod: v as FreightLoadMethod })
            }
          />
          <AppInput
            label={t("totalWeight")}
            type="number"
            value={draft.totalWeightKg}
            onChange={(e) =>
              patchDraft({ totalWeightKg: Number(e.target.value) || 0 })
            }
          />
        </div>
        <FreightCargoTable
          lines={draft.lines}
          onChange={updateLine}
          onAdd={addLine}
          onRemove={removeLine}
        />
      </Section>

      <Section title={t("vehicleTitle")}>
        <FreightVehicleCards
          value={draft.vehicleType}
          onChange={(vehicleType: FreightVehicleType) =>
            patchDraft({ vehicleType })
          }
        />
      </Section>

      <Section title={t("bodyTitle")}>
        <FreightBodyCards
          value={draft.bodyType}
          onChange={(bodyType: FreightBodyType) => patchDraft({ bodyType })}
        />
      </Section>

      {mode === "ftl" ? (
        <Section title={t("ftlDetailsTitle")} description={t("ftlDetailsHint")}>
          <FreightFtlFields ftl={draft.ftl} onChange={patchFtl} />
        </Section>
      ) : (
        <Section title={t("ltlDetailsTitle")} description={t("ltlDetailsHint")}>
          <FreightLtlFields ltl={draft.ltl} onChange={patchLtl} />
        </Section>
      )}

      <Section title={t("attachmentsTitle")} description={t("attachmentsHint")}>
        <FreightAttachments
          attachments={draft.attachments}
          onAdd={addAttachments}
          onRemove={removeAttachment}
        />
      </Section>

      <Section title={t("notesTitle")}>
        <AppTextarea
          label={t("opsNotes")}
          rows={3}
          value={draft.notes}
          onChange={(e) => patchDraft({ notes: e.target.value })}
        />
      </Section>
    </div>
  );
}
