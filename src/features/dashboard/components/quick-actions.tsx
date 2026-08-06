"use client";

import {
  Copy,
  FileText,
  PackageSearch,
  Plus,
  Plug,
  Sparkles,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { DashboardQuickAction } from "@/types/dashboard";
import { cn } from "@/lib/utils/cn";

const iconMap = {
  plus: Plus,
  sparkles: Sparkles,
  upload: Upload,
  copy: Copy,
  quotes: FileText,
  track: PackageSearch,
  plug: Plug,
} as const;

export function QuickActions({
  actions,
}: {
  actions: DashboardQuickAction[];
}) {
  const t = useTranslations();

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">
        {t("dashboard.widgets.quickActions")}
      </h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <Link
              key={action.id}
              href={action.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border/80 bg-card px-3.5 py-3 text-sm font-medium shadow-xs transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm touch-target",
              )}
            >
              <Icon className="size-4 shrink-0 text-brand-600 dark:text-brand-300" />
              <span className="truncate">{t(action.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
