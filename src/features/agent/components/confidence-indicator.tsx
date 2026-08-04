"use client";

import { useTranslations } from "next-intl";
import type { ConfidenceLevel } from "@/types/conversation";
import { cn } from "@/lib/utils/cn";

export function ConfidenceIndicator({
  level,
  className,
}: {
  level: ConfidenceLevel;
  className?: string;
}) {
  const t = useTranslations("agent");
  const label =
    level === "high"
      ? t("confidenceHigh")
      : level === "medium"
        ? t("confidenceMedium")
        : t("confidenceLow");

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <span className="text-muted-foreground">{t("confidence")}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium",
          level === "high" && "bg-success-bg text-success-fg",
          level === "medium" && "bg-warning-bg text-warning-fg",
          level === "low" && "bg-error-bg text-error-fg",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            level === "high" && "bg-success",
            level === "medium" && "bg-warning",
            level === "low" && "bg-error",
          )}
        />
        {label}
      </span>
    </div>
  );
}
