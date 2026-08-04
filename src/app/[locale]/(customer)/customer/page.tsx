"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceBadge } from "@/components/shared/service-badge";
import { ChannelBadge } from "@/components/shared/channel-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import { useShipmentsQuery } from "@/features/services/hooks";
import { formatDate } from "@/lib/utils/format";
import type { ShipmentSummary } from "@/types/domain";

export default function CustomerDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const { data, isLoading, isError, refetch } = useShipmentsQuery();

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      <PageHeader
        title={t("customer.title")}
        description={t("customer.subtitle")}
      />

      {isLoading ? <LoadingSkeleton rows={3} /> : null}
      {isError ? (
        <ErrorState
          title={t("error.defaultTitle")}
          description={t("error.defaultDescription")}
          onRetry={() => refetch()}
          retryLabel={t("common.retry")}
        />
      ) : null}

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
              accessor: (row) => (
                <span className="font-medium">{row.trackingNumber}</span>
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
              accessor: (row) => <StatusBadge status={row.status} />,
            },
            {
              id: "channel",
              header: t("table.channel"),
              accessor: (row) => <ChannelBadge channel={row.channel} />,
            },
            {
              id: "route",
              header: `${t("table.origin")} → ${t("table.destination")}`,
              accessor: (row) => `${row.originCity} → ${row.destinationCity}`,
            },
            {
              id: "amount",
              header: t("table.amount"),
              accessor: (row) => <MoneyDisplay value={row.total} size="sm" />,
            },
            {
              id: "created",
              header: t("table.createdAt"),
              accessor: (row) => formatDate(row.createdAt, intlLocale),
            },
          ]}
        />
      ) : null}
    </div>
  );
}
