"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGuard } from "@/lib/auth/guards";
import { OrdersWorkspace } from "@/features/orders/components/orders-workspace";

function OrdersContent() {
  const t = useTranslations("orders");
  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <OrdersWorkspace />
    </div>
  );
}

export default function AppOrdersPage() {
  return (
    <PermissionGuard permission="shipments:read">
      <Suspense fallback={<LoadingSkeleton rows={4} />}>
        <OrdersContent />
      </Suspense>
    </PermissionGuard>
  );
}
