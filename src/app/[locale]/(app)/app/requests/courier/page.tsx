"use client";

import { PermissionGuard } from "@/lib/auth/guards";
import { CourierWizard } from "@/features/courier/components/courier-wizard";

export default function CourierRequestPage() {
  return (
    <PermissionGuard permission="requests:create">
      <CourierWizard />
    </PermissionGuard>
  );
}
