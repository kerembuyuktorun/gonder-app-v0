"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import {
  packageChargeableDesi,
  packageVolumetricDesi,
} from "@/features/parcel/lib/desi";
import type { ParcelPackage } from "@/types/parcel";

export function ParcelPackagesEditor({
  packages,
  onChange,
  onAdd,
  onRemove,
}: {
  packages: ParcelPackage[];
  onChange: (id: string, patch: Partial<ParcelPackage>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("parcel");

  return (
    <div className="space-y-3">
      {packages.map((pkg, index) => {
        const vol = packageVolumetricDesi(pkg);
        const chargeable = packageChargeableDesi(pkg);
        return (
          <div
            key={pkg.id}
            className="space-y-3 rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {t("packageN", { n: index + 1 })}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t("packageDesi", {
                    volumetric: vol.toFixed(1),
                    chargeable: chargeable.toFixed(1),
                  })}
                </span>
                {packages.length > 1 ? (
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(pkg.id)}
                  >
                    {t("removePackage")}
                  </AppButton>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <AppInput
                label={t("length")}
                type="number"
                min={1}
                value={pkg.lengthCm}
                onChange={(e) =>
                  onChange(pkg.id, { lengthCm: Number(e.target.value) || 0 })
                }
              />
              <AppInput
                label={t("width")}
                type="number"
                min={1}
                value={pkg.widthCm}
                onChange={(e) =>
                  onChange(pkg.id, { widthCm: Number(e.target.value) || 0 })
                }
              />
              <AppInput
                label={t("height")}
                type="number"
                min={1}
                value={pkg.heightCm}
                onChange={(e) =>
                  onChange(pkg.id, { heightCm: Number(e.target.value) || 0 })
                }
              />
              <AppInput
                label={t("weight")}
                type="number"
                min={0.1}
                step={0.1}
                value={pkg.weightKg}
                onChange={(e) =>
                  onChange(pkg.id, { weightKg: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        );
      })}
      <AppButton type="button" variant="secondary" onClick={onAdd}>
        {t("addPackage")}
      </AppButton>
    </div>
  );
}
