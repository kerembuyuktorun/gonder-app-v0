"use client";

import { Suspense } from "react";
import { OrganizationGuard, PermissionGuard } from "@/lib/auth/guards";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { IntegrationsWorkspace } from "@/features/integrations/components/integrations-workspace";

export default function IntegrationsPage() {
  return (
    <PermissionGuard permission="integrations:manage">
      <OrganizationGuard>
        <Suspense fallback={<LoadingSkeleton rows={4} />}>
          <IntegrationsWorkspace />
        </Suspense>
      </OrganizationGuard>
    </PermissionGuard>
  );
}
