"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PermissionGuard } from "@/lib/auth/guards";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import { useQuotesQuery } from "@/features/services/hooks";
import type { QuoteSummary } from "@/types/domain";

export default function AppQuotesPage() {
  const t = useTranslations();
  const { data, isLoading } = useQuotesQuery();

  return (
    <PermissionGuard permission="quotes:read">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader title={t("shell.quotes")} />
        {isLoading ? <LoadingSkeleton rows={3} /> : null}
        {data && data.items.length === 0 ? (
          <EmptyState
            title={t("empty.defaultTitle")}
            description={t("empty.defaultDescription")}
          />
        ) : null}
        {data && data.items.length > 0 ? (
          <DataTable<QuoteSummary>
            data={data.items}
            columns={[
              {
                id: "reference",
                header: t("table.reference"),
                accessor: (row) => row.reference,
              },
              {
                id: "status",
                header: t("table.status"),
                accessor: (row) => (
                  <StatusBadge status={row.status} kind="quote" />
                ),
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
