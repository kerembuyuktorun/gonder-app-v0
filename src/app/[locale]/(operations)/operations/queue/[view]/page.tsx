"use client";

import { use } from "react";
import { OpsRequestQueue } from "@/features/operations/components/ops-request-queue";
import type { OpsQueueView } from "@/types/operations";

const ALLOWED: OpsQueueView[] = [
  "new",
  "missing_info",
  "quote_prep",
  "awaiting_approval",
  "awaiting_payment",
  "active",
  "delayed",
  "problematic",
  "completed",
];

export default function OperationsQueuePage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view: raw } = use(params);
  const view = (ALLOWED.includes(raw as OpsQueueView) ? raw : "new") as OpsQueueView;
  return <OpsRequestQueue view={view} />;
}
