"use client";

import { Calculator } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/lib/auth/guards";
import { RequestForm } from "@/features/request-engine/components/request-form";
import { RequestSummaryPanel } from "@/features/request-engine/components/request-summary-panel";

export default function PriceCalculationPage() {
  const t = useTranslations("redesign.pricePage");

  return (
    <PermissionGuard permission="requests:create">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader title={t("title")} description={t("description")} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-2xl border border-border bg-card p-4 md:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Calculator className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">{t("formTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("formHint")}</p>
              </div>
            </div>
            <RequestForm mode="price" />
          </section>
          <RequestSummaryPanel />
        </div>
      </div>
    </PermissionGuard>
  );
}
