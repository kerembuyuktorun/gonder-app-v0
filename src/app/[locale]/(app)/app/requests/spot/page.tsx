"use client";

import { PermissionGuard } from "@/lib/auth/guards";
import { SpotWorkspace } from "@/features/spot/components/spot-workspace";

export default function SpotRequestPage() {
  return (
    <PermissionGuard permission="requests:create">
      <SpotWorkspace />
    </PermissionGuard>
  );
}
