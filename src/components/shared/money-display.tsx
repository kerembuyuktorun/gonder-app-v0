"use client";

import { useLocale } from "next-intl";
import { formatMoney } from "@/lib/utils/format";
import type { Money } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

export type MoneyDisplayProps = {
  value: Money;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function MoneyDisplay({
  value,
  className,
  size = "md",
}: MoneyDisplayProps) {
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-xl font-semibold",
        className,
      )}
    >
      {formatMoney(value, intlLocale)}
    </span>
  );
}
