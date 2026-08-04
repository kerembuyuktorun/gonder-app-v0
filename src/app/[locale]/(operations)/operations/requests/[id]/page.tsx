"use client";

import { use } from "react";
import { OpsRequestWorkspace } from "@/features/operations/components/ops-request-workspace";
import { OpsPermissionGuard } from "@/lib/auth/guards";

export default function OperationsRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <OpsPermissionGuard permission="ops:requests:read">
      <OpsRequestWorkspace requestId={id} />
    </OpsPermissionGuard>
  );
}
