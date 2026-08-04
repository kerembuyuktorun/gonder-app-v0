"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatDateTime } from "@/lib/utils/format";
import { ServiceBadge } from "@/components/shared/service-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import type {
  DashboardPaymentItem,
  DashboardQuoteItem,
  DashboardShipmentItem,
} from "@/types/dashboard";

function DenseTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, index) => (
            <tr
              key={index}
              className="border-b border-border last:border-0 hover:bg-accent/30"
            >
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2.5 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActiveShipmentsList({
  items,
}: {
  items: DashboardShipmentItem[];
}) {
  const t = useTranslations("dashboard.columns");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <DenseTable
      headers={[t("reference"), t("route"), t("status"), t("updated")]}
      rows={items.map((item) => [
        <span key="ref" className="font-medium">
          {item.trackingNumber}
        </span>,
        `${item.originCity} → ${item.destinationCity}`,
        <StatusBadge key="status" status={item.status} />,
        <span key="date" className="text-muted-foreground">
          {formatDateTime(item.updatedAt, intlLocale)}
        </span>,
      ])}
    />
  );
}

export function QuoteList({
  items,
  showAmount = true,
}: {
  items: DashboardQuoteItem[];
  showAmount?: boolean;
}) {
  const t = useTranslations("dashboard.columns");
  const headers = showAmount
    ? [t("reference"), t("route"), t("status"), t("amount")]
    : [t("reference"), t("route"), t("service"), t("status")];

  return (
    <DenseTable
      headers={headers}
      rows={items.map((item) => {
        const base = [
          <span key="ref" className="font-medium">
            {item.reference}
          </span>,
          `${item.originCity} → ${item.destinationCity}`,
        ];
        if (showAmount) {
          return [
            ...base,
            <StatusBadge key="status" status={item.status} kind="quote" />,
            <MoneyDisplay key="amount" value={item.total} size="sm" />,
          ];
        }
        return [
          ...base,
          <ServiceBadge key="service" type={item.serviceType} />,
          <StatusBadge key="status" status={item.status} kind="quote" />,
        ];
      })}
    />
  );
}

export function PaymentList({ items }: { items: DashboardPaymentItem[] }) {
  const t = useTranslations("dashboard.columns");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <DenseTable
      headers={[t("reference"), t("service"), t("amount"), t("due")]}
      rows={items.map((item) => [
        <span key="ref" className="font-medium">
          {item.reference}
        </span>,
        <ServiceBadge key="service" type={item.serviceType} />,
        <MoneyDisplay key="amount" value={item.amount} size="sm" />,
        <span key="due" className="text-warning-fg">
          {formatDateTime(item.dueAt, intlLocale)}
        </span>,
      ])}
    />
  );
}

export function CompletedShipmentsList({
  items,
}: {
  items: DashboardShipmentItem[];
}) {
  const t = useTranslations("dashboard.columns");

  return (
    <DenseTable
      headers={[t("reference"), t("route"), t("status"), t("amount")]}
      rows={items.map((item) => [
        <span key="ref" className="font-medium">
          {item.trackingNumber}
        </span>,
        `${item.originCity} → ${item.destinationCity}`,
        <StatusBadge key="status" status={item.status} />,
        item.total ? (
          <MoneyDisplay key="amount" value={item.total} size="sm" />
        ) : (
          "—"
        ),
      ])}
    />
  );
}
