"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, PackagePlus, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { OperationTypeSelector } from "./operation-type-selector";
import { useRequestDraftStore } from "@/stores/request-draft-store";
import { calculateDesi } from "@/features/request-engine/lib/quotes";
import type {
  LogisticsMode,
  OperationType,
  RequestMode,
} from "@/types/request-engine";

const PACKAGE_PRESETS: Record<
  string,
  { width: number; length: number; height: number; weight: number }
> = {
  document: { width: 24, length: 32, height: 2, weight: 0.5 },
  small: { width: 20, length: 25, height: 12, weight: 2 },
  medium: { width: 30, length: 40, height: 20, weight: 5 },
  large: { width: 45, length: 55, height: 35, weight: 15 },
};

export function RequestForm({
  mode,
  compact = false,
  submitTo = "/results",
}: {
  mode: RequestMode;
  compact?: boolean;
  submitTo?: string;
}) {
  const t = useTranslations("redesign.request");
  const router = useRouter();
  const draft = useRequestDraftStore((state) => state.draft);
  const lastSavedAt = useRequestDraftStore((state) => state.lastSavedAt);
  const updateDraft = useRequestDraftStore((state) => state.updateDraft);
  const setMode = useRequestDraftStore((state) => state.setMode);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  function changeOperation(operationType: OperationType) {
    updateDraft({ operationType });
    setErrors({});
  }

  function changePreset(packagePreset: string) {
    updateDraft({
      packagePreset,
      ...(PACKAGE_PRESETS[packagePreset] ?? {}),
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!draft.origin.trim()) nextErrors.origin = t("validation.origin");
    if (!draft.destination.trim()) {
      nextErrors.destination = t("validation.destination");
    }
    if (!draft.date) nextErrors.date = t("validation.date");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setMode(mode);
    router.push(submitTo);
  }

  const desi = Math.ceil(calculateDesi(draft));
  const isDetailed = mode === "shipment" && !compact;

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <OperationTypeSelector
        value={draft.operationType}
        onChange={changeOperation}
        compact={compact}
      />

      {draft.operationType === "logistics" ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">
            {t("logisticsMode")}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(["ftl", "ltl"] as LogisticsMode[]).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={draft.logisticsMode === value}
                onClick={() => updateDraft({ logisticsMode: value })}
                className={
                  draft.logisticsMode === value
                    ? "rounded-lg border border-primary bg-accent px-4 py-3 text-left text-sm font-semibold text-accent-foreground"
                    : "rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium hover:bg-accent/40"
                }
              >
                {t(`logistics.${value}.title`)}
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {t(`logistics.${value}.description`)}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <AppInput
          label={t("origin")}
          value={draft.origin}
          onChange={(event) => updateDraft({ origin: event.target.value })}
          placeholder={t("originPlaceholder")}
          autoComplete="address-level2"
          error={errors.origin}
          required
        />
        <AppInput
          label={t("destination")}
          value={draft.destination}
          onChange={(event) => updateDraft({ destination: event.target.value })}
          placeholder={t("destinationPlaceholder")}
          autoComplete="address-level2"
          error={errors.destination}
          required
        />
      </div>

      {draft.operationType === "parcel" ||
      draft.operationType === "courier" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <AppSelect
            label={t("packagePreset")}
            value={draft.packagePreset}
            onValueChange={changePreset}
            options={["document", "small", "medium", "large", "custom"].map(
              (value) => ({ value, label: t(`presets.${value}`) }),
            )}
          />
          {draft.operationType === "courier" ? (
            <AppSelect
              label={t("courierService")}
              value={draft.courierService}
              onValueChange={(courierService) =>
                updateDraft({ courierService })
              }
              options={["express", "same_day", "scheduled"].map((value) => ({
                value,
                label: t(`courier.${value}`),
              }))}
            />
          ) : (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                {t("calculatedDesi")}
              </p>
              <p className="mt-1 text-lg font-semibold">{desi} desi</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {draft.logisticsMode === "ftl" ? (
            <>
              <AppSelect
                label={t("vehicleType")}
                value={draft.vehicleType}
                onValueChange={(vehicleType) => updateDraft({ vehicleType })}
                options={["van", "truck", "semi", "other"].map((value) => ({
                  value,
                  label: t(`vehicles.${value}`),
                }))}
              />
              <AppSelect
                label={t("bodyType")}
                value={draft.bodyType}
                onValueChange={(bodyType) => updateDraft({ bodyType })}
                options={["closed", "curtain", "reefer", "open"].map(
                  (value) => ({ value, label: t(`bodies.${value}`) }),
                )}
              />
            </>
          ) : (
            <>
              <AppSelect
                label={t("loadType")}
                value={draft.loadType}
                onValueChange={(loadType) => updateDraft({ loadType })}
                options={["pallet", "box", "ibc", "barrel", "other"].map(
                  (value) => ({ value, label: t(`loads.${value}`) }),
                )}
              />
              <AppInput
                label={t("weight")}
                type="number"
                min={1}
                value={draft.weight}
                onChange={(event) =>
                  updateDraft({ weight: Number(event.target.value) })
                }
              />
            </>
          )}
        </div>
      )}

      {(draft.packagePreset === "custom" ||
        (isDetailed && draft.operationType !== "logistics")) ? (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/25 p-4 sm:grid-cols-5">
          {(["width", "length", "height", "weight", "quantity"] as const).map(
            (field) => (
              <AppInput
                key={field}
                label={t(field)}
                type="number"
                min={field === "quantity" ? 1 : 0.1}
                value={draft[field]}
                onChange={(event) =>
                  updateDraft({ [field]: Number(event.target.value) })
                }
              />
            ),
          )}
        </div>
      ) : null}

      {draft.operationType === "parcel" && desi > 30 ? (
        <div
          className="flex flex-col gap-3 rounded-xl border border-warning/35 bg-status-warning-bg p-4 text-status-warning-fg sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <div>
            <p className="text-sm font-semibold">{t("overLimitTitle")}</p>
            <p className="mt-1 text-xs">{t("overLimitDescription")}</p>
          </div>
          <AppButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => changeOperation("logistics")}
          >
            {t("switchToLogistics")}
          </AppButton>
        </div>
      ) : null}

      <AppInput
        label={t("date")}
        type="date"
        value={draft.date}
        onChange={(event) => updateDraft({ date: event.target.value })}
        error={errors.date}
        required
      />

      {isDetailed ? (
        <div className="space-y-4 border-t border-border pt-5">
          <div className="flex items-center gap-2">
            <PackagePlus className="size-5 text-primary" />
            <h3 className="font-semibold">{t("contactTitle")}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AppInput
              label={t("senderName")}
              value={draft.senderName}
              onChange={(event) =>
                updateDraft({ senderName: event.target.value })
              }
            />
            <AppInput
              label={t("senderPhone")}
              value={draft.senderPhone}
              onChange={(event) =>
                updateDraft({ senderPhone: event.target.value })
              }
            />
            <AppInput
              label={t("receiverName")}
              value={draft.receiverName}
              onChange={(event) =>
                updateDraft({ receiverName: event.target.value })
              }
            />
            <AppInput
              label={t("receiverPhone")}
              value={draft.receiverPhone}
              onChange={(event) =>
                updateDraft({ receiverPhone: event.target.value })
              }
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {lastSavedAt ? (
            <>
              <CheckCircle2 className="size-3.5 text-success" />
              {t("draftSaved")}
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              {t("autoSave")}
            </>
          )}
        </p>
        <AppButton type="submit" size={compact ? "md" : "lg"}>
          {mode === "price" ? t("showPrices") : t("continueShipment")}
          <ArrowRight className="size-4" />
        </AppButton>
      </div>
    </form>
  );
}
