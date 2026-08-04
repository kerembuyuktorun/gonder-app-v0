"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  useApplyExcelMappingMutation,
  useBulkQuotesMutation,
  useFixExcelRowMutation,
  useImportHistoryQuery,
  useImportJobQuery,
  useImportSheetsQuery,
  useImportValidRowsMutation,
  useStartExcelImportMutation,
} from "@/features/integrations/hooks/use-integrations";
import { EXCEL_COLUMN_KEYS } from "@/features/integrations/lib/constants";
import type { ExcelColumnKey, ExcelColumnMapping } from "@/types/integrations";
import { cn } from "@/lib/utils/cn";
import { StepIndicator } from "@/components/shared/step-indicator";
import { integrationsRepository } from "@/lib/api/client";

const STEPS = [
  "file",
  "sheet",
  "mapping",
  "preview",
  "validate",
  "fix",
  "import",
  "quotes",
  "report",
] as const;

type Step = (typeof STEPS)[number];

export function ExcelImportWizard() {
  const t = useTranslations("integrations.excel");
  const start = useStartExcelImportMutation();
  const applyMapping = useApplyExcelMappingMutation();
  const fixRow = useFixExcelRowMutation();
  const importValid = useImportValidRowsMutation();
  const bulkQuotes = useBulkQuotesMutation();
  const history = useImportHistoryQuery();

  const [jobId, setJobId] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<Step>("file");
  const [fileName, setFileName] = React.useState("toplu-gonderi.xlsx");
  const [sheetName, setSheetName] = React.useState("");
  const [mapping, setMapping] = React.useState<ExcelColumnMapping>({});

  const jobQuery = useImportJobQuery(jobId);
  const sheetsQuery = useImportSheetsQuery(jobId);
  const job = jobQuery.data;


  async function onPickFile() {
    const created = await start.mutateAsync(fileName || "import.xlsx");
    setJobId(created.id);
    const sheets = await integrationsRepository.listSheets(created.id);
    const first = sheets[0];
    if (first) {
      setSheetName(first.name);
      const initial: ExcelColumnMapping = {};
      first.headers.forEach((h) => {
        const guess = (
          {
            "Alıcı Adı": "recipientName",
            Telefon: "recipientPhone",
            Adres: "address",
            İlçe: "district",
            İl: "city",
            Desi: "desi",
            Kg: "weightKg",
            Referans: "reference",
            Not: "notes",
          } as Record<string, ExcelColumnKey>
        )[h];
        initial[h] = guess ?? "ignore";
      });
      setMapping(initial);
    }
    setStep("sheet");
  }

  async function onApplyMapping() {
    if (!jobId) return;
    await applyMapping.mutateAsync({ jobId, sheetName, mapping });
    setStep("validate");
  }

  const selectedSheet = sheetsQuery.data?.find((s) => s.name === sheetName);

  return (
    <div className="space-y-6">
      <StepIndicator
        steps={STEPS.map((s) => ({ id: s, label: t(`steps.${s}`) }))}
        currentStepId={step}
      />

      {step === "file" ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <h3 className="font-display font-semibold">{t("pickTitle")}</h3>
          <AppInput
            label={t("fileName")}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <AppButton
              size="sm"
              onClick={() => void onPickFile()}
              disabled={start.isPending}
            >
              {t("selectFile")}
            </AppButton>
            <AppButton
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                const csv =
                  "Alıcı Adı,Telefon,Adres,İlçe,İl,Desi,Kg,Referans,Not\nCan Demir,05551112233,Moda Cad. 12,Kadıköy,İstanbul,3,2,ORD-1,\n";
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "gonder-toplu-sablon.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              {t("downloadTemplate")}
            </AppButton>
          </div>
        </section>
      ) : null}

      {jobId && (step === "sheet" || step === "mapping") ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          {sheetsQuery.isLoading ? <LoadingSkeleton rows={2} /> : null}
          <h3 className="font-display font-semibold">{t("sheetTitle")}</h3>
          <div className="flex flex-wrap gap-2">
            {(sheetsQuery.data ?? []).map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  setSheetName(s.name);
                  setStep("mapping");
                }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm",
                  sheetName === s.name
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border",
                )}
              >
                {s.name} ({s.rowCount})
              </button>
            ))}
          </div>

          {selectedSheet ? (
            <>
              <h3 className="pt-2 font-display font-semibold">{t("mappingTitle")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-2 py-2">{t("excelColumn")}</th>
                      <th className="px-2 py-2">{t("gonderField")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSheet.headers.map((h) => (
                      <tr key={h} className="border-b border-border">
                        <td className="px-2 py-2 font-medium">{h}</td>
                        <td className="px-2 py-2">
                          <select
                            className="h-9 w-full rounded-lg border border-border bg-background px-2"
                            value={mapping[h] ?? "ignore"}
                            onChange={(e) =>
                              setMapping((m) => ({
                                ...m,
                                [h]: e.target.value as ExcelColumnKey,
                              }))
                            }
                          >
                            {EXCEL_COLUMN_KEYS.map((k) => (
                              <option key={k} value={k}>
                                {t(`fields.${k}`)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AppButton
                size="sm"
                onClick={() => void onApplyMapping()}
                disabled={applyMapping.isPending}
              >
                {t("previewValidate")}
              </AppButton>
            </>
          ) : null}
        </section>
      ) : null}

      {job && (step === "validate" || step === "fix" || step === "preview") ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap gap-3 text-sm">
            <span>
              {t("valid")}: <strong>{job.validRows}</strong>
            </span>
            <span>
              {t("errors")}: <strong className="text-error-fg">{job.errorRows}</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">{t("fields.recipientName")}</th>
                  <th className="px-2 py-2">{t("fields.city")}</th>
                  <th className="px-2 py-2">{t("fields.address")}</th>
                  <th className="px-2 py-2">{t("fields.desi")}</th>
                  <th className="px-2 py-2">{t("rowStatus")}</th>
                  <th className="px-2 py-2">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {job.rows.map((row) => (
                  <tr
                    key={row.rowIndex}
                    className={cn(
                      "border-b border-border",
                      row.errors.length > 0 && "bg-error-bg/30",
                    )}
                  >
                    <td className="px-2 py-2">{row.rowIndex}</td>
                    <td className="px-2 py-2">
                      <input
                        className="h-8 w-full rounded border border-border bg-background px-1"
                        defaultValue={row.values.recipientName ?? ""}
                        id={`name-${row.rowIndex}`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="h-8 w-full rounded border border-border bg-background px-1"
                        defaultValue={row.values.city ?? ""}
                        id={`city-${row.rowIndex}`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="h-8 w-full rounded border border-border bg-background px-1"
                        defaultValue={row.values.address ?? ""}
                        id={`addr-${row.rowIndex}`}
                      />
                    </td>
                    <td className="px-2 py-2">{row.values.desi ?? "—"}</td>
                    <td className="px-2 py-2">
                      {row.errors.length
                        ? row.errors.map((e) => t(`fields.${e as ExcelColumnKey}`)).join(", ")
                        : t("ok")}
                    </td>
                    <td className="px-2 py-2">
                      {row.errors.length ? (
                        <AppButton
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const name = (
                              document.getElementById(
                                `name-${row.rowIndex}`,
                              ) as HTMLInputElement
                            )?.value;
                            const city = (
                              document.getElementById(
                                `city-${row.rowIndex}`,
                              ) as HTMLInputElement
                            )?.value;
                            const address = (
                              document.getElementById(
                                `addr-${row.rowIndex}`,
                              ) as HTMLInputElement
                            )?.value;
                            void fixRow.mutateAsync({
                              jobId: job.id,
                              rowIndex: row.rowIndex,
                              values: { recipientName: name, city, address },
                            });
                            setStep("fix");
                          }}
                        >
                          {t("fix")}
                        </AppButton>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AppButton
            size="sm"
            disabled={importValid.isPending || job.validRows === 0}
            onClick={async () => {
              await importValid.mutateAsync(job.id);
              setStep("import");
            }}
          >
            {t("importValid")}
          </AppButton>
        </section>
      ) : null}

      {job && (step === "import" || step === "quotes" || step === "report") ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <h3 className="font-display font-semibold">{t("reportTitle")}</h3>
          <p className="text-sm text-muted-foreground">
            {job.reportSummary ?? t("importDone", { count: job.importedCount })}
          </p>
          <div className="flex flex-wrap gap-2">
            <AppButton
              size="sm"
              variant="secondary"
              disabled={bulkQuotes.isPending || job.importedCount === 0}
              onClick={async () => {
                await bulkQuotes.mutateAsync(job.id);
                setStep("quotes");
              }}
            >
              {t("bulkQuotes")}
            </AppButton>
            <AppButton size="sm" variant="ghost" onClick={() => setStep("report")}>
              {t("viewReport")}
            </AppButton>
            <AppButton
              size="sm"
              variant="ghost"
              onClick={() => {
                setJobId(null);
                setStep("file");
                setSheetName("");
              }}
            >
              {t("newImport")}
            </AppButton>
          </div>
        </section>
      ) : null}

      <section className="space-y-2">
        <h3 className="font-display text-base font-semibold">{t("historyTitle")}</h3>
        {history.isLoading ? <LoadingSkeleton rows={2} /> : null}
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {(history.data ?? []).map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
            >
              <div>
                <p className="font-medium">{item.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {t(`jobStatus.${item.status}`)} · {item.importedCount}/{item.totalRows}
                </p>
              </div>
              <AppButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  setJobId(item.id);
                  setStep(item.status === "completed" ? "report" : "validate");
                }}
              >
                {t("openJob")}
              </AppButton>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
