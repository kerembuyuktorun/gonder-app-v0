"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { OrganizationGuard, PermissionGuard } from "@/lib/auth/guards";

export default function IntegrationsPage() {
  const t = useTranslations();

  return (
    <PermissionGuard permission="integrations:manage">
      <OrganizationGuard>
        <div className="mx-auto w-full max-w-[90rem] space-y-6">
          <PageHeader title={t("shell.integrations")} />
          <EmptyState
            title={t("empty.defaultTitle")}
            description={t("empty.defaultDescription")}
          />
        </div>
      </OrganizationGuard>
    </PermissionGuard>
  );
}
