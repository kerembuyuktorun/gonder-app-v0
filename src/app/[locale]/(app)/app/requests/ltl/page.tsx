"use client";

import { PermissionGuard } from "@/lib/auth/guards";
import { FreightWizard } from "@/features/freight/components/freight-wizard";

export default function LtlRequestPage() {
  return (
    <PermissionGuard permission="requests:create">
      <FreightWizard initialMode="ltl" />
    </PermissionGuard>
  );
}
