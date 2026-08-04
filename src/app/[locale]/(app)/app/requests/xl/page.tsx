"use client";

import { PermissionGuard } from "@/lib/auth/guards";
import { XlWizard } from "@/features/xl/components/xl-wizard";

export default function GonderXlPage() {
  return (
    <PermissionGuard permission="requests:create">
      <XlWizard />
    </PermissionGuard>
  );
}
