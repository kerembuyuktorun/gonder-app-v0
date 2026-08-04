"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceBadge } from "@/components/shared/service-badge";
import { ChannelBadge } from "@/components/shared/channel-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import { SidePanel } from "@/components/shared/side-panel";
import { Timeline } from "@/components/shared/timeline";
import { useQuotesQuery } from "@/features/services/hooks";
import { mockTimeline } from "@/mocks/data/catalog";
import { formatDate } from "@/lib/utils/format";
import type { QuoteSummary } from "@/types/domain";

export default function OpsDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const { data, isLoading, isError, refetch } = useQuotesQuery();

  return (
    <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 xl:flex-row">
      <div className="min-w-0 flex-1 space-y-6">
        <PageHeader
          title={t("ops.title")}
          description={t("ops.subtitle")}
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

        {data ? (
          <DataTable<QuoteSummary>
            data={data.items}
            columns={[
              {
                id: "reference",
                header: t("table.reference"),
                accessor: (row) => (
                  <span className="font-medium">{row.reference}</span>
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
                accessor: (row) => (
                  <StatusBadge status={row.status} kind="quote" />
                ),
              },
              {
                id: "channel",
                header: t("table.channel"),
                accessor: (row) => <ChannelBadge channel={row.channel} />,
              },
              {
                id: "route",
                header: `${t("table.origin")} → ${t("table.destination")}`,
                accessor: (row) =>
                  `${row.originCity} → ${row.destinationCity}`,
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

      <div className="hidden w-full max-w-[22rem] shrink-0 xl:block">
        <SidePanel title={t("timeline.title")}>
          <Timeline events={mockTimeline} />
        </SidePanel>
      </div>
    </div>
  );
}
