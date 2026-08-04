"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useOrderNotificationsQuery,
} from "@/features/orders/hooks/use-orders";
import { formatDateTime } from "@/lib/utils/format";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export function NotificationCenter() {
  const t = useTranslations("orders.notifications");
  const tRoot = useTranslations();
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const { data } = useOrderNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();
  const [open, setOpen] = React.useState(false);
  const unread = data?.filter((n) => !n.read).length ?? 0;
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <AppButton
        variant="ghost"
        size="icon"
        aria-label={t("title")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell className="size-4" />
        {unread > 0 ? (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-error" />
        ) : null}
      </AppButton>
      {open ? (
        <div className="absolute right-0 top-full z-[var(--z-popover)] mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-sm font-semibold">{t("title")}</p>
            {unread > 0 ? (
              <AppButton
                variant="ghost"
                size="sm"
                onClick={() => markAll.mutate()}
              >
                {t("markAll")}
              </AppButton>
            ) : null}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {!data?.length ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                {t("empty")}
              </li>
            ) : (
              data.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/app/orders/${n.orderId}`}
                    onClick={() => {
                      if (!n.read) markRead.mutate(n.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "block border-b border-border px-3 py-2.5 hover:bg-muted/60",
                      !n.read && "bg-info-bg/30",
                    )}
                  >
                    <p className="text-sm font-medium">{tRoot(n.titleKey)}</p>
                    <p className="text-xs text-muted-foreground">
                      {tRoot(n.bodyKey)}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatDateTime(n.createdAt, intlLocale)}
                    </p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
