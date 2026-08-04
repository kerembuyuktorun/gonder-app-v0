"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PermissionGuard } from "@/lib/auth/guards";

export default function SupportPage() {
  const t = useTranslations();

  return (
    <PermissionGuard permission="support:access">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader title={t("shell.support")} />
        <EmptyState
          title={t("shell.support")}
          description={t("empty.defaultDescription")}
        />
      </div>
    </PermissionGuard>
  );
}
