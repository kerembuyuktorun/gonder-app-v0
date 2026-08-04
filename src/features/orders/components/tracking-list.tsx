"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatDateTime } from "@/lib/utils/format";
import type { OrderTrackingEvent } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

const toneDot: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-neutral",
};

export function TrackingList({
  events,
  className,
}: {
  events: OrderTrackingEvent[];
  className?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">{t("orders.tracking.empty")}</p>
    );
  }

  return (
    <ol className={cn("space-y-3", className)}>
      {events.map((event) => (
        <li key={event.id} className="flex gap-3">
          <span
            className={cn(
              "mt-1 size-2.5 shrink-0 rounded-full",
              toneDot[event.tone ?? "neutral"],
            )}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium">{t(event.titleKey)}</p>
            {event.locationLabel ? (
              <p className="text-xs text-muted-foreground">{event.locationLabel}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {formatDateTime(event.occurredAt, intlLocale)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
