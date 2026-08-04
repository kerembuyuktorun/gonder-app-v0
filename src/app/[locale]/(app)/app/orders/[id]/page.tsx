"use client";

import { use } from "react";
import { PermissionGuard } from "@/lib/auth/guards";
import { OrderDetailPage } from "@/features/orders/components/order-detail-page";

export default function AppOrderDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <PermissionGuard permission="shipments:read">
      <OrderDetailPage orderId={id} />
    </PermissionGuard>
  );
}
