"use client";

import { useTranslations } from "next-intl";
import type { CourierWizardStepId } from "@/types/courier";
import { COURIER_STEPS } from "@/features/courier/hooks/use-courier-wizard";
import { cn } from "@/lib/utils/cn";

export function CourierStepNav({
  current,
  onSelect,
}: {
  current: CourierWizardStepId;
  onSelect: (step: CourierWizardStepId) => void;
}) {
  const t = useTranslations("courier.steps");
  const currentIndex = COURIER_STEPS.indexOf(current);

  return (
    <ol className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
      {COURIER_STEPS.map((step, index) => {
        const active = step === current;
        const done = index < currentIndex;
        return (
          <li key={step} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(step)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm touch-target",
                active && "bg-primary text-primary-foreground",
                done && !active && "bg-success-bg text-success-fg",
                !active && !done && "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-black/10 text-xs font-semibold dark:bg-white/10">
                {index + 1}
              </span>
              {t(step)}
            </button>
            {index < COURIER_STEPS.length - 1 ? (
              <span className="hidden text-muted-foreground sm:inline">/</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
