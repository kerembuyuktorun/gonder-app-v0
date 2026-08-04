"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils/cn";
import type { FreightMode, FreightModeRecommendation } from "@/types/freight";

export function FreightModeSelect({
  recommendation,
  selected,
  onSelect,
}: {
  recommendation: FreightModeRecommendation;
  selected: FreightMode | null;
  onSelect: (mode: FreightMode) => void;
}) {
  const t = useTranslations("freight");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-base font-semibold">{t("selectTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("selectIntro")}</p>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>· {t("ftlExplain")}</li>
          <li>· {t("ltlExplain")}</li>
        </ul>
        <p className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-sm">
          {t(recommendation.reasonKey.replace("freight.", "") as "recommend.ftl")}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {(["ftl", "ltl"] as const).map((mode) => {
          const active = selected === mode;
          const suggested = recommendation.suggested === mode;
          const warned =
            recommendation.warnIfSelected === mode && Boolean(selected);
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onSelect(mode)}
              className={cn(
                "rounded-xl border p-5 text-left transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-semibold">{t(`modes.${mode}`)}</p>
                {suggested ? (
                  <span className="rounded-md bg-success-bg px-2 py-0.5 text-xs font-medium text-success-fg">
                    {t("suggested")}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`modeHints.${mode}`)}
              </p>
              {warned && recommendation.warningKey ? (
                <p className="mt-3 rounded-md bg-warning-bg px-2 py-1.5 text-xs text-warning-fg">
                  {t(
                    recommendation.warningKey.replace("freight.", "") as
                      | "recommend.warnLtlForHeavy"
                      | "recommend.warnFtlForLight",
                  )}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="flex justify-end">
          <AppButton type="button" onClick={() => onSelect(selected)}>
            {t("continueWith", { mode: t(`modes.${selected}`) })}
          </AppButton>
        </div>
      ) : null}
    </div>
  );
}
