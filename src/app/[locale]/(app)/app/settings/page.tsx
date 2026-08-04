"use client";

import { PermissionGuard } from "@/lib/auth/guards";
import { SettingsWorkspace } from "@/features/settings/components/settings-workspace";

export default function SettingsPage() {
  return (
    <PermissionGuard permission="settings:manage">
      <SettingsWorkspace />
    </PermissionGuard>
  );
}
