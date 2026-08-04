"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { FileUploader } from "@/components/shared/file-uploader";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils/cn";
import type {
  ParcelCreationMethod,
  ParcelIntegrationOrder,
  ParcelPreviousShipment,
  ParcelTemplate,
} from "@/types/parcel";

const METHODS: ParcelCreationMethod[] = [
  "manual",
  "copy_previous",
  "template",
  "excel_bulk",
  "integration_order",
];

export function ParcelMethodPicker({
  templates,
  previousShipments,
  integrationOrders,
  onManual,
  onPrevious,
  onTemplate,
  onIntegration,
  onExcel,
}: {
  templates: ParcelTemplate[];
  previousShipments: ParcelPreviousShipment[];
  integrationOrders: ParcelIntegrationOrder[];
  onManual: () => void;
  onPrevious: (id: string) => void;
  onTemplate: (id: string) => void;
  onIntegration: (id: string) => void;
  onExcel: (fileName: string) => void;
}) {
  const t = useTranslations("parcel");
  const [active, setActive] = React.useState<ParcelCreationMethod>("manual");

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {METHODS.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setActive(method)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition-colors",
              active === method
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-accent/40",
            )}
          >
            <p className="text-sm font-semibold">{t(`methods.${method}`)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(`methodHints.${method}`)}
            </p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-5">
        {active === "manual" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("methodHints.manual")}
            </p>
            <AppButton type="button" onClick={onManual}>
              {t("startManual")}
            </AppButton>
          </div>
        ) : null}

        {active === "copy_previous" ? (
          <div className="space-y-3">
            {previousShipments.length === 0 ? (
              <LoadingSkeleton rows={2} />
            ) : (
              previousShipments.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPrevious(item.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-3 text-left hover:bg-accent/40"
                >
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {t("useThis")}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}

        {active === "template" ? (
          <div className="space-y-3">
            {templates.length === 0 ? (
              <LoadingSkeleton rows={2} />
            ) : (
              templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTemplate(item.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-3 text-left hover:bg-accent/40"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs font-medium text-primary">
                    {t("useThis")}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}

        {active === "excel_bulk" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("excelHint")}</p>
            <FileUploader
              accept=".xlsx,.xls,.csv"
              onFilesSelected={(files) => {
                const name = files[0]?.name;
                if (name) onExcel(name);
              }}
            />
          </div>
        ) : null}

        {active === "integration_order" ? (
          <div className="space-y-3">
            {integrationOrders.length === 0 ? (
              <LoadingSkeleton rows={2} />
            ) : (
              integrationOrders.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onIntegration(item.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-3 text-left hover:bg-accent/40"
                >
                  <span>
                    <span className="block text-sm font-medium">
                      {item.source} · {item.externalRef}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.draft.delivery.city} · {item.draft.recipient.name}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {t("useThis")}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
