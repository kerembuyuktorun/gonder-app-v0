import type { OpsPriority, OpsQueueView, SlaState } from "@/types/operations";
import type { StatusTone } from "@/types/domain";

export const OPS_NAV: { href: string; view: OpsQueueView; labelKey: string }[] = [
  { href: "/operations", view: "summary", labelKey: "operations.nav.summary" },
  { href: "/operations/queue/new", view: "new", labelKey: "operations.nav.new" },
  {
    href: "/operations/queue/missing_info",
    view: "missing_info",
    labelKey: "operations.nav.missing_info",
  },
  {
    href: "/operations/queue/quote_prep",
    view: "quote_prep",
    labelKey: "operations.nav.quote_prep",
  },
  {
    href: "/operations/queue/awaiting_approval",
    view: "awaiting_approval",
    labelKey: "operations.nav.awaiting_approval",
  },
  {
    href: "/operations/queue/awaiting_payment",
    view: "awaiting_payment",
    labelKey: "operations.nav.awaiting_payment",
  },
  {
    href: "/operations/queue/active",
    view: "active",
    labelKey: "operations.nav.active",
  },
  {
    href: "/operations/queue/delayed",
    view: "delayed",
    labelKey: "operations.nav.delayed",
  },
  {
    href: "/operations/queue/problematic",
    view: "problematic",
    labelKey: "operations.nav.problematic",
  },
  {
    href: "/operations/queue/completed",
    view: "completed",
    labelKey: "operations.nav.completed",
  },
  {
    href: "/operations/partners",
    view: "partners",
    labelKey: "operations.nav.partners",
  },
  {
    href: "/operations/price-lists",
    view: "price_lists",
    labelKey: "operations.nav.price_lists",
  },
  {
    href: "/operations/finance",
    view: "finance",
    labelKey: "operations.nav.finance",
  },
  {
    href: "/operations/documents",
    view: "documents",
    labelKey: "operations.nav.documents",
  },
  {
    href: "/operations/reports",
    view: "reports",
    labelKey: "operations.nav.reports",
  },
];

export const slaTone: Record<SlaState, StatusTone> = {
  ok: "success",
  warning: "warning",
  breached: "error",
};

export const priorityTone: Record<OpsPriority, StatusTone> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  critical: "error",
};

export const DEFAULT_OPS_COLUMNS = [
  "reference",
  "service",
  "status",
  "customer",
  "route",
  "priority",
  "assignee",
  "sla",
  "updatedAt",
] as const;
