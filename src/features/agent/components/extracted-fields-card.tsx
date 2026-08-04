"use client";

import { useTranslations } from "next-intl";
import type { ExtractedField, ExtractedFieldKey } from "@/types/conversation";
import { ConfidenceIndicator } from "@/features/agent/components/confidence-indicator";

export function ExtractedFieldsCard({ fields }: { fields: ExtractedField[] }) {
  const t = useTranslations();
  if (fields.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{t("empty.defaultDescription")}</p>
    );
  }

  return (
    <ul className="space-y-2">
      {fields.map((field) => (
        <li
          key={field.key}
          className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t(field.labelKey)}</p>
            <p className="truncate text-sm font-medium">{field.value}</p>
          </div>
          <ConfidenceIndicator level={field.confidence} />
        </li>
      ))}
    </ul>
  );
}

export function MissingFieldsList({ fields }: { fields: ExtractedFieldKey[] }) {
  const t = useTranslations("agent");
  if (fields.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {fields.map((field) => (
        <li
          key={field}
          className="rounded-md bg-warning-bg px-3 py-2 text-xs font-medium text-warning-fg"
        >
          {t(`fields.${field}`)}
        </li>
      ))}
    </ul>
  );
}
