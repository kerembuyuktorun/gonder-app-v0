"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";
import type { ShipmentRequestDraft } from "@/types/conversation";
import type { ServiceType } from "@/types/domain";

const SERVICE_OPTIONS: { value: ServiceType; labelKey: string }[] = [
  { value: "courier", labelKey: "services.courier" },
  { value: "parcel_1_30", labelKey: "services.parcel_1_30" },
  { value: "gonder_xl", labelKey: "services.gonder_xl" },
  { value: "ftl", labelKey: "services.ftl" },
  { value: "ltl", labelKey: "services.ltl" },
  { value: "spot", labelKey: "services.spot" },
];

export function EditableDraftSummary({
  draft,
  onChange,
  disabled,
}: {
  draft: ShipmentRequestDraft;
  onChange: (patch: Partial<ShipmentRequestDraft>) => void;
  disabled?: boolean;
}) {
  const t = useTranslations();

  return (
    <div className="grid gap-3">
      <AppSelect
        label={t("agent.fields.serviceType")}
        value={draft.serviceType}
        disabled={disabled}
        onValueChange={(value) =>
          onChange({ serviceType: value as ServiceType })
        }
        options={SERVICE_OPTIONS.map((o) => ({
          value: o.value,
          label: t(o.labelKey),
        }))}
      />
      <AppInput
        label={t("agent.fields.origin")}
        value={draft.origin ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ origin: e.target.value })}
      />
      <AppInput
        label={t("agent.fields.destination")}
        value={draft.destination ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ destination: e.target.value })}
      />
      <AppInput
        label={t("agent.fields.pickupDate")}
        type="date"
        value={draft.pickupDate ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ pickupDate: e.target.value })}
      />
      <AppInput
        label={t("agent.fields.vehicleType")}
        value={draft.vehicleType ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ vehicleType: e.target.value })}
      />
      <AppInput
        label={t("agent.fields.cargoType")}
        value={draft.cargoType ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ cargoType: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label={t("agent.fields.weightDesi")}
          value={draft.weightDesi ?? ""}
          disabled={disabled}
          onChange={(e) => onChange({ weightDesi: e.target.value })}
        />
        <AppInput
          label={t("agent.fields.palletCount")}
          value={draft.palletCount ?? ""}
          disabled={disabled}
          onChange={(e) => onChange({ palletCount: e.target.value })}
        />
      </div>
      <AppTextarea
        label={t("agent.fields.notes")}
        value={draft.notes ?? ""}
        disabled={disabled}
        onChange={(e) => onChange({ notes: e.target.value })}
        rows={2}
      />
    </div>
  );
}
