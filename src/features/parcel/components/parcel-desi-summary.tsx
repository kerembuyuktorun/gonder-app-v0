"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import type { ParcelDesiSummary } from "@/types/parcel";
import { PARCEL_MAX_DESI } from "@/features/parcel/lib/desi";
import { cn } from "@/lib/utils/cn";

export function ParcelDesiSummaryCard({ desi }: { desi: ParcelDesiSummary }) {
  const t = useTranslations("parcel");
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">{t("desiTitle")}</h3>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">{t("volumetricDesi")}</dt>
          <dd className="font-semibold">{desi.volumetricDesi.toFixed(1)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("chargeableDesi")}</dt>
          <dd
            className={cn(
              "font-semibold",
              desi.exceedsParcelLimit && "text-warning-fg",
            )}
          >
            {desi.chargeableDesi.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("totalWeight")}</dt>
          <dd className="font-semibold">{desi.totalWeightKg.toFixed(1)} kg</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("packageCount")}</dt>
          <dd className="font-semibold">{desi.packageCount}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        {t("desiLimit", { max: PARCEL_MAX_DESI })}
      </p>
    </div>
  );
}

export function ParcelXlNudge({ show }: { show: boolean }) {
  const t = useTranslations("parcel");
  if (!show) return null;
  return (
    <div className="rounded-xl border border-warning/40 bg-warning-bg px-4 py-3">
      <p className="text-sm font-semibold text-warning-fg">{t("xlTitle")}</p>
      <p className="mt-1 text-sm text-warning-fg/90">{t("xlBody")}</p>
      <div className="mt-3">
        <Link href="/app/requests/xl">
          <AppButton type="button" size="sm" variant="secondary">
            {t("xlCta")}
          </AppButton>
        </Link>
      </div>
    </div>
  );
}
