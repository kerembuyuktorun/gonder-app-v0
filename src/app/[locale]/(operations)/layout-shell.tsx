"use client";

import { OperationsShell } from "@/features/operations/components/operations-shell";

export function OperationsLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OperationsShell>{children}</OperationsShell>;
}
