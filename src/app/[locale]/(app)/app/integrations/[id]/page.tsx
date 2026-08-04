"use client";

import { use } from "react";
import { OrganizationGuard, PermissionGuard } from "@/lib/auth/guards";
import { IntegrationDetailView } from "@/features/integrations/components/integration-detail";

export default function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <PermissionGuard permission="integrations:manage">
      <OrganizationGuard>
        <IntegrationDetailView providerId={id} />
      </OrganizationGuard>
    </PermissionGuard>
  );
}
