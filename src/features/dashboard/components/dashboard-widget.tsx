"use client";

import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export type DashboardWidgetProps = {
  title: string;
  href?: string;
  count?: number;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
  dense?: boolean;
};

export function DashboardWidget({
  title,
  href,
  count,
  isLoading,
  isError,
  isEmpty,
  emptyTitle,
  onRetry,
  children,
  className,
  dense,
}: DashboardWidgetProps) {
  const t = useTranslations();

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/35 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {typeof count === "number" ? (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              {count}
            </span>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="shrink-0 text-xs font-medium text-primary hover:underline"
          >
            {t("common.viewAll")}
          </Link>
        ) : null}
      </div>
      <div className={cn("flex-1 p-4", dense && "p-0")}>
        {isLoading ? <LoadingSkeleton rows={3} /> : null}
        {isError ? (
          <ErrorState
            title={t("dashboard.errorTitle")}
            description={t("dashboard.errorDescription")}
            onRetry={onRetry}
            retryLabel={t("common.retry")}
            className="border-0 bg-transparent py-6"
          />
        ) : null}
        {!isLoading && !isError && isEmpty ? (
          <EmptyState
            title={emptyTitle ?? t("empty.defaultTitle")}
            className="border-0 bg-transparent py-8"
          />
        ) : null}
        {!isLoading && !isError && !isEmpty ? children : null}
      </div>
    </section>
  );
}
