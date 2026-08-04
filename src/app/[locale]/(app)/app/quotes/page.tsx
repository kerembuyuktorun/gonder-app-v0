"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PermissionGuard } from "@/lib/auth/guards";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { DataTable } from "@/components/shared/data-table";
import { MoneyDisplay } from "@/components/shared/money-display";
import { ServiceBadge } from "@/components/shared/service-badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { useOrdersQuery } from "@/features/orders/hooks/use-orders";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import type { OrderSummary } from "@/types/orders";

export default function AppQuotesPage() {
  const t = useTranslations();
  const pending = useOrdersQuery({
    view: "awaiting_quote",
    pageSize: 50,
  });
  const approval = useOrdersQuery({
    view: "awaiting_approval",
    pageSize: 50,
  });
  const isLoading = pending.isLoading || approval.isLoading;
  const items = [
    ...(pending.data?.items ?? []),
    ...(approval.data?.items ?? []),
  ];

  return (
    <PermissionGuard permission="quotes:read">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader
          title={t("shell.quotes")}
          description={t("quotesPage.subtitle")}
          actions={
            <Link href="/app/orders?view=awaiting_approval">
              <AppButton size="sm" variant="secondary">
                {t("quotesPage.openOrders")}
              </AppButton>
            </Link>
          }
        />
        {isLoading ? <LoadingSkeleton rows={3} /> : null}
        {!isLoading && items.length === 0 ? (
          <EmptyState
            title={t("quotesPage.emptyTitle")}
            description={t("quotesPage.emptyDescription")}
            action={
              <Link href="/app/requests/new">
                <AppButton>{t("shell.newRequest")}</AppButton>
              </Link>
            }
          />
        ) : null}
        {!isLoading && items.length > 0 ? (
          <DataTable<OrderSummary>
            data={items}
            columns={[
              {
                id: "reference",
                header: t("table.reference"),
                accessor: (row) => (
                  <Link
                    href={`/app/orders/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.reference}
                  </Link>
                ),
              },
              {
                id: "service",
                header: t("table.service"),
                accessor: (row) => <ServiceBadge type={row.serviceType} />,
              },
              {
                id: "status",
                header: t("table.status"),
                accessor: (row) => <OrderStatusBadge status={row.status} />,
              },
              {
                id: "route",
                header: t("table.origin"),
                accessor: (row) =>
                  `${row.originCity} → ${row.destinationCity}`,
              },
              {
                id: "amount",
                header: t("table.amount"),
                accessor: (row) => <MoneyDisplay value={row.total} size="sm" />,
              },
            ]}
          />
        ) : null}
      </div>
    </PermissionGuard>
  );
}
