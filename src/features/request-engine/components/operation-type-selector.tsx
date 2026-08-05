"use client";

import { Bike, Box, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { OperationType } from "@/types/request-engine";

const OPTIONS = [
  { value: "parcel" as const, icon: Box },
  { value: "courier" as const, icon: Bike },
  { value: "logistics" as const, icon: Truck },
];

export function OperationTypeSelector({
  value,
  onChange,
  compact = false,
}: {
  value: OperationType;
  onChange: (value: OperationType) => void;
  compact?: boolean;
}) {
  const t = useTranslations("redesign.operationTypes");

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{t("label")}</legend>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-20 min-w-0 flex-col items-start justify-between rounded-xl border p-2.5 text-left transition-colors focus-visible:outline-none sm:p-3",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-brand-400 hover:bg-accent/40",
              )}
            >
              <Icon className="size-5" aria-hidden />
              <span>
                <span className="block break-words text-xs font-semibold sm:text-sm">
                  {t(`${option.value}.title`)}
                </span>
                {!compact ? (
                  <span
                    className={cn(
                      "mt-1 hidden text-xs leading-snug lg:block",
                      selected
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground",
                    )}
                  >
                    {t(`${option.value}.short`)}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
