"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PermissionGuard } from "@/lib/auth/guards";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceBadge } from "@/components/shared/service-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import { useShipmentsQuery } from "@/features/services/hooks";
import type { ShipmentSummary } from "@/types/domain";

export default function AppShipmentsPage() {
  const t = useTranslations();
  const { data, isLoading } = useShipmentsQuery();

  return (
    <PermissionGuard permission="shipments:read">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader
          title={t("shell.shipments")}
          description={t("customer.subtitle")}
        />
        {isLoading ? <LoadingSkeleton rows={3} /> : null}
        {data && data.items.length === 0 ? (
          <EmptyState
            title={t("customer.emptyTitle")}
            description={t("customer.emptyDescription")}
          />
        ) : null}
        {data && data.items.length > 0 ? (
          <DataTable<ShipmentSummary>
            data={data.items}
            columns={[
              {
                id: "tracking",
                header: t("table.tracking"),
                accessor: (row) => row.trackingNumber,
              },
              {
                id: "service",
                header: t("table.service"),
                accessor: (row) => <ServiceBadge type={row.serviceType} />,
              },
              {
                id: "status",
                header: t("table.status"),
                accessor: (row) => <StatusBadge status={row.status} />,
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
