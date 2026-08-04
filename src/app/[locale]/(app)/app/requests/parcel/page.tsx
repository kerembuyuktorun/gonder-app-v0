"use client";

import { PermissionGuard } from "@/lib/auth/guards";
import { ParcelWizard } from "@/features/parcel/components/parcel-wizard";

export default function ParcelRequestPage() {
  return (
    <PermissionGuard permission="requests:create">
      <ParcelWizard />
    </PermissionGuard>
  );
}
