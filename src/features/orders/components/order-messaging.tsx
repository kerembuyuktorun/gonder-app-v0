"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppTextarea } from "@/components/shared/app-textarea";
import { useSendOrderMessageMutation } from "@/features/orders/hooks/use-orders";
import { formatDateTime } from "@/lib/utils/format";
import type { OrderMessage } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

export function OrderMessaging({
  orderId,
  messages,
  className,
}: {
  orderId: string;
  messages: OrderMessage[];
  className?: string;
}) {
  const t = useTranslations("orders.messages");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const mutation = useSendOrderMessageMutation(orderId);
  const [body, setBody] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    await mutation.mutateAsync(body.trim());
    setBody("");
  }

  return (
    <div className={cn("space-y-3", className)}>
      <ul className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border bg-muted/30 p-3">
        {messages.length === 0 ? (
          <li className="text-sm text-muted-foreground">{t("empty")}</li>
        ) : (
          messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                m.author === "customer"
                  ? "ml-6 bg-primary/10"
                  : "mr-6 bg-card border border-border",
              )}
            >
              <p className="text-xs font-medium text-muted-foreground">
                {m.authorName} · {formatDateTime(m.createdAt, intlLocale)}
              </p>
              <p className="mt-0.5">{m.body}</p>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <AppTextarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t("placeholder")}
          rows={2}
          className="flex-1"
        />
        <AppButton
          type="submit"
          size="sm"
          className="sm:self-end"
          disabled={mutation.isPending || !body.trim()}
        >
          {t("send")}
        </AppButton>
      </form>
    </div>
  );
}
