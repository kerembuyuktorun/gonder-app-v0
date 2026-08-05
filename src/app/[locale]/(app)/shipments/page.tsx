"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceBadge } from "@/components/shared/service-badge";
import { PermissionGuard } from "@/lib/auth/guards";
import { useOrdersQuery } from "@/features/orders/hooks/use-orders";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type { OrderSummary } from "@/types/orders";

export default function ShipmentsPage() {
  const t = useTranslations("redesign.shipments");
  const orders = useOrdersQuery({ view: "active", pageSize: 25 });
  const items = orders.data?.items ?? [];

  return (
    <PermissionGuard permission="shipments:read">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader title={t("title")} description={t("description")} />
        {orders.isLoading ? <LoadingSkeleton rows={5} /> : null}
        {!orders.isLoading && items.length === 0 ? (
          <EmptyState title={t("empty")} description={t("emptyDescription")} />
        ) : null}
        {items.length ? (
          <DataTable<OrderSummary>
            data={items}
            columns={[
              {
                id: "tracking",
                header: t("tracking"),
                accessor: (row) => (
                  <Link
                    href={`/orders/${row.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {row.trackingNumber}
                  </Link>
                ),
              },
              {
                id: "order",
                header: t("order"),
                accessor: (row) => row.reference,
              },
              {
                id: "service",
                header: t("service"),
                accessor: (row) => <ServiceBadge type={row.serviceType} />,
              },
              {
                id: "route",
                header: t("route"),
                accessor: (row) =>
                  `${row.originCity} → ${row.destinationCity}`,
              },
              {
                id: "status",
                header: t("status"),
                accessor: (row) => <OrderStatusBadge status={row.status} />,
              },
              {
                id: "eta",
                header: t("eta"),
                accessor: (row) =>
                  row.etaAt
                    ? new Intl.DateTimeFormat("tr-TR", {
                        dateStyle: "medium",
                      }).format(new Date(row.etaAt))
                    : "—",
              },
            ]}
          />
        ) : null}
      </div>
    </PermissionGuard>
  );
}
