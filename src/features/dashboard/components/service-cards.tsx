"use client";

import { ArrowRight, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { DashboardServiceCard } from "@/types/dashboard";
import { cn } from "@/lib/utils/cn";

export function ServiceCards({
  services,
}: {
  services: DashboardServiceCard[];
}) {
  const t = useTranslations();

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold md:text-base">
          {t("dashboard.servicesTitle")}
        </h2>
        <p className="text-xs text-muted-foreground md:text-sm">
          {t("dashboard.servicesSubtitle")}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className={cn(
              "group flex min-h-[7.5rem] flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-400 hover:bg-accent/40 focus-visible:outline-none",
            )}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{t(service.nameKey)}</h3>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                {t(service.descriptionKey)}
              </p>
            </div>
            {service.helpKey ? (
              <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
                <HelpCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{t(service.helpKey)}</span>
              </p>
            ) : (
              <span className="mt-3 text-xs font-medium text-primary">
                {t("dashboard.startService")}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
