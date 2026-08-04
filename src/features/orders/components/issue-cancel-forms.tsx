"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppTextarea } from "@/components/shared/app-textarea";
import {
  useCancelOrderMutation,
  useReportIssueMutation,
} from "@/features/orders/hooks/use-orders";
import type { OrderIssueCategory } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

const CATEGORIES: OrderIssueCategory[] = [
  "delay",
  "damage",
  "missing",
  "address",
  "other",
];

export function ReportIssueForm({
  orderId,
  onDone,
  className,
}: {
  orderId: string;
  onDone?: () => void;
  className?: string;
}) {
  const t = useTranslations("orders.issue");
  const mutation = useReportIssueMutation();
  const [category, setCategory] = React.useState<OrderIssueCategory>("delay");
  const [description, setDescription] = React.useState("");
  const [severity, setSeverity] = React.useState<"warning" | "critical">("warning");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    await mutation.mutateAsync({
      orderId,
      category,
      description: description.trim(),
      severity,
    });
    setDescription("");
    onDone?.();
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium",
              category === c
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {(["warning", "critical"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeverity(s)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium",
              severity === s
                ? s === "critical"
                  ? "border-error bg-error-bg text-error-fg"
                  : "border-warning bg-warning-bg text-warning-fg"
                : "border-border text-muted-foreground",
            )}
          >
            {t(`severity.${s}`)}
          </button>
        ))}
      </div>
      <AppTextarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("placeholder")}
        rows={3}
      />
      <AppButton type="submit" size="sm" disabled={mutation.isPending || !description.trim()}>
        {mutation.isPending ? t("submitting") : t("submit")}
      </AppButton>
      {mutation.isError ? (
        <p className="text-sm text-error-fg">{t("error")}</p>
      ) : null}
    </form>
  );
}

export function CancelOrderForm({
  orderId,
  onDone,
  className,
}: {
  orderId: string;
  onDone?: () => void;
  className?: string;
}) {
  const t = useTranslations("orders.cancel");
  const mutation = useCancelOrderMutation();
  const [reason, setReason] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    await mutation.mutateAsync({ orderId, reason: reason.trim() });
    setReason("");
    onDone?.();
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      <AppTextarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={t("placeholder")}
        rows={3}
      />
      <AppButton
        type="submit"
        variant="destructive"
        size="sm"
        disabled={mutation.isPending || !reason.trim()}
      >
        {mutation.isPending ? t("submitting") : t("submit")}
      </AppButton>
      {mutation.isError ? (
        <p className="text-sm text-error-fg">{t("error")}</p>
      ) : null}
    </form>
  );
}
