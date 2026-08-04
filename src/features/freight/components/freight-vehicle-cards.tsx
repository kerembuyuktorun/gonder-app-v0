"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { FREIGHT_BODIES, FREIGHT_VEHICLES } from "@/mocks/data/freight";
import type { FreightBodyType, FreightVehicleType } from "@/types/freight";

const VEHICLE_LABEL: Record<FreightVehicleType, string> = {
  van: "VN",
  truck_7_5: "7.5",
  truck_12: "12t",
  truck_18: "18t",
  trailer_40: "40'",
  trailer_90: "13m",
};

const BODY_LABEL: Record<FreightBodyType, string> = {
  closed: "KP",
  curtain: "TN",
  reefer: "FR",
  open: "AÇ",
  flatbed: "PL",
};

export function FreightVehicleCards({
  value,
  onChange,
}: {
  value: FreightVehicleType;
  onChange: (v: FreightVehicleType) => void;
}) {
  const t = useTranslations("freight");
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {FREIGHT_VEHICLES.map((vehicle) => (
        <button
          key={vehicle}
          type="button"
          onClick={() => onChange(vehicle)}
          className={cn(
            "flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
            value === vehicle
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-accent/40",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold">
            {VEHICLE_LABEL[vehicle]}
          </span>
          <span>
            <span className="block text-sm font-semibold">
              {t(`vehicles.${vehicle}`)}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {t(`vehicleHints.${vehicle}`)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function FreightBodyCards({
  value,
  onChange,
}: {
  value: FreightBodyType;
  onChange: (v: FreightBodyType) => void;
}) {
  const t = useTranslations("freight");
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {FREIGHT_BODIES.map((body) => (
        <button
          key={body}
          type="button"
          onClick={() => onChange(body)}
          className={cn(
            "flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
            value === body
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-accent/40",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold">
            {BODY_LABEL[body]}
          </span>
          <span>
            <span className="block text-sm font-semibold">
              {t(`bodies.${body}`)}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {t(`bodyHints.${body}`)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
