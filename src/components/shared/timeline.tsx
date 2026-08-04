"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatDateTime } from "@/lib/utils/format";
import type { TimelineEvent } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

const toneDot: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  neutral: "bg-neutral",
};

export type TimelineProps = {
  events: TimelineEvent[];
  className?: string;
};

export function Timeline({ events, className }: TimelineProps) {
  const t = useTranslations();
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <ol className={cn("relative space-y-0", className)}>
      {events.map((event, index) => (
        <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
          {index < events.length - 1 ? (
            <span className="absolute left-[7px] top-4 h-[calc(100%-0.5rem)] w-px bg-border" />
          ) : null}
          <span
            className={cn(
              "relative z-10 mt-1 size-4 shrink-0 rounded-full border-2 border-card",
              toneDot[event.tone ?? "neutral"],
            )}
          />
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">{t(event.titleKey)}</p>
            {event.descriptionKey ? (
              <p className="text-sm text-muted-foreground">
                {t(event.descriptionKey)}
              </p>
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
