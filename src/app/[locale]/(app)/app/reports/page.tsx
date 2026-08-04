"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { MoneyDisplay } from "@/components/shared/money-display";
import { OrganizationGuard, PermissionGuard } from "@/lib/auth/guards";
import { useDashboardQuery } from "@/features/dashboard/hooks/use-dashboard-query";
import { useOrdersQuery } from "@/features/orders/hooks/use-orders";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";

export default function ReportsPage() {
  const t = useTranslations("reportsPage");
  const dashboard = useDashboardQuery();
  const orders = useOrdersQuery({ view: "all", pageSize: 100 });

  return (
    <PermissionGuard permission="reports:read">
      <OrganizationGuard>
        <div className="mx-auto w-full max-w-[90rem] space-y-6">
          <PageHeader title={t("title")} description={t("subtitle")} />
          {dashboard.isLoading || orders.isLoading ? (
            <LoadingSkeleton rows={3} />
          ) : null}
          {dashboard.isError ? (
            <ErrorState
              title={t("errorTitle")}
              description={t("errorDescription")}
              onRetry={() => void dashboard.refetch()}
            />
          ) : null}
          {dashboard.data && orders.data ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label={t("shipments")} value={String(dashboard.data.usage.shipmentCount)} />
              <Stat
                label={t("spend")}
                value={<MoneyDisplay value={dashboard.data.usage.spend} size="lg" />}
              />
              <Stat label={t("quotes")} value={String(dashboard.data.usage.quoteCount)} />
              <Stat label={t("active")} value={String(dashboard.data.activeShipments.length)} />
            </div>
          ) : null}
          {dashboard.data && dashboard.data.usage.shipmentCount === 0 ? (
            <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
          ) : null}
          <Link href="/app/orders">
            <AppButton variant="secondary" size="sm">
              {t("openOrders")}
            </AppButton>
          </Link>
        </div>
      </OrganizationGuard>
    </PermissionGuard>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
