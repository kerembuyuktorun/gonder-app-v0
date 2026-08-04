"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { OrderDetailSections } from "@/features/orders/components/order-detail-sections";
import { useOrderDetailQuery } from "@/features/orders/hooks/use-orders";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const t = useTranslations("orders");
  const { data, isLoading, isError, refetch } = useOrderDetailQuery(orderId);

  return (
    <div className="mx-auto w-full max-w-[56rem] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={data?.reference ?? t("detailTitle")}
          description={
            data
              ? `${data.trackingNumber} · ${data.originCity} → ${data.destinationCity}`
              : t("detailSubtitle")
          }
        />
        <Link href="/app/orders">
          <AppButton variant="secondary" size="sm">
            {t("backToList")}
          </AppButton>
        </Link>
      </div>
      {isLoading ? <LoadingSkeleton rows={5} /> : null}
      {isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          onRetry={() => void refetch()}
        />
      ) : null}
      {!isLoading && !isError && !data ? (
        <EmptyState title={t("notFoundTitle")} description={t("notFoundDescription")} />
      ) : null}
      {data ? <OrderDetailSections order={data} /> : null}
    </div>
  );
}
