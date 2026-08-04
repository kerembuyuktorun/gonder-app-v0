export type MoneyValue = {
  amount: number;
  currency: string;
};

export function formatMoney(
  value: MoneyValue,
  locale = "tr-TR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value.amount);
}

export function formatDate(
  value: string | Date,
  locale = "tr-TR",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateTime(
  value: string | Date,
  locale = "tr-TR",
): string {
  return formatDate(value, locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
