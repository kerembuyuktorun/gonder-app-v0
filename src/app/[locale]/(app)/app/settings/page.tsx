"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { useAuthStore } from "@/stores/auth-store";
import { PermissionGuard } from "@/lib/auth/guards";

export default function SettingsPage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const org = useAuthStore((s) => s.activeOrganization)();

  return (
    <PermissionGuard permission="settings:manage">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader title={t("shell.settings")} />
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p>
            <span className="text-muted-foreground">{t("auth.profile")}: </span>
            {user?.firstName} {user?.lastName}
          </p>
          <p className="mt-2">
            <span className="text-muted-foreground">
              {t("auth.organization")}:{" "}
            </span>
            {org?.name ?? t("auth.individualProfile")}
          </p>
        </div>
      </div>
    </PermissionGuard>
  );
}
