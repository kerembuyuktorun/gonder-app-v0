"use client";

import { useLocale, useTranslations } from "next-intl";
import { MapPin, Radio } from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import type { OrderLocation } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

/** Mock map panel — no external map SDK; shows last known / live position. */
export function OrderMapPanel({
  location,
  origin,
  destination,
  className,
}: {
  location?: OrderLocation;
  origin: string;
  destination: string;
  className?: string;
}) {
  const t = useTranslations("orders.map");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border",
        className,
      )}
    >
      <div
        className="relative h-56 bg-[radial-gradient(ellipse_at_30%_40%,var(--color-info-bg),transparent_55%),radial-gradient(ellipse_at_70%_60%,var(--color-success-bg),transparent_50%),linear-gradient(160deg,var(--color-muted),var(--color-card))]"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px]" />
        <span className="absolute left-[18%] top-[62%] flex flex-col items-center gap-1">
          <MapPin className="size-5 text-primary" />
          <span className="rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-medium">
            {origin}
          </span>
        </span>
        <span className="absolute right-[16%] top-[28%] flex flex-col items-center gap-1">
          <MapPin className="size-5 text-success" />
          <span className="rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-medium">
            {destination}
          </span>
        </span>
        {location ? (
          <span
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{
              left: `${35 + ((location.lng + 30) % 40)}%`,
              top: `${30 + ((location.lat % 20) * 2)}%`,
            }}
          >
            <span
              className={cn(
                "relative flex size-4 items-center justify-center rounded-full bg-warning",
                location.live && "animate-pulse",
              )}
            >
              <span className="size-1.5 rounded-full bg-card" />
            </span>
            <span className="max-w-[8rem] truncate rounded bg-card/95 px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
              {location.label}
            </span>
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3 border-t border-border bg-card px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {location ? location.label : t("unknown")}
          </p>
          {location ? (
            <p className="text-xs text-muted-foreground">
              {formatDateTime(location.updatedAt, intlLocale)} ·{" "}
              {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{t("hint")}</p>
          )}
        </div>
        {location?.live ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-warning-fg">
            <Radio className="size-3.5" />
            {t("live")}
          </span>
        ) : (
          <span className="shrink-0 text-xs text-muted-foreground">{t("lastKnown")}</span>
        )}
      </div>
    </div>
  );
}
