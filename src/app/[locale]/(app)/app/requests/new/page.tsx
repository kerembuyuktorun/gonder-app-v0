"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PermissionGuard } from "@/lib/auth/guards";
import { AppButton } from "@/components/shared/app-button";

export default function NewRequestPage() {
  const t = useTranslations();

  return (
    <PermissionGuard permission="requests:create">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader
          title={t("shell.newRequest")}
          description={t("home.subtitle")}
        />
        <EmptyState
          title={t("shell.newRequest")}
          description={t("customer.emptyDescription")}
          action={<AppButton disabled>{t("common.continue")}</AppButton>}
        />
      </div>
    </PermissionGuard>
  );
}
