"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { IntegrationMarketplace } from "@/features/integrations/components/integration-marketplace";
import { ExcelImportWizard } from "@/features/integrations/components/excel-import-wizard";
import { ShipmentTemplatesPanel } from "@/features/integrations/components/shipment-templates-panel";
import type { IntegrationsTab } from "@/features/integrations/lib/constants";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

export function IntegrationsWorkspace() {
  const t = useTranslations("integrations");
  const params = useSearchParams();
  const initial = (params.get("tab") as IntegrationsTab | null) ?? "marketplace";
  const [tab, setTab] = React.useState<IntegrationsTab>(
    ["marketplace", "excel", "templates"].includes(initial)
      ? initial
      : "marketplace",
  );

  const tabs: IntegrationsTab[] = ["marketplace", "excel", "templates"];

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {tabs.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t(`tabs.${id}`)}
          </button>
        ))}
      </div>
      {tab === "marketplace" ? <IntegrationMarketplace /> : null}
      {tab === "excel" ? <ExcelImportWizard /> : null}
      {tab === "templates" ? <ShipmentTemplatesPanel /> : null}
    </div>
  );
}
