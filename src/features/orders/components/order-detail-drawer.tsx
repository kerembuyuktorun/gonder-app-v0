"use client";

import { useTranslations } from "next-intl";
import { DetailDrawer } from "@/components/shared/detail-drawer";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderDetailSections } from "@/features/orders/components/order-detail-sections";
import { useOrderDetailQuery } from "@/features/orders/hooks/use-orders";

export function OrderDetailDrawer({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("orders");
  const { data, isLoading } = useOrderDetailQuery(orderId);

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={data?.reference ?? t("drawerTitle")}
      description={data ? data.trackingNumber : undefined}
      className="sm:max-w-xl"
    >
      {isLoading ? <LoadingSkeleton rows={4} /> : null}
      {!isLoading && !data ? (
        <EmptyState title={t("notFoundTitle")} description={t("notFoundDescription")} />
      ) : null}
      {data ? <OrderDetailSections order={data} compact /> : null}
    </DetailDrawer>
  );
}
