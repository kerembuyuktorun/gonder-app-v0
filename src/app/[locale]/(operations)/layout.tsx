"use client";

import { OperationsShell } from "@/features/operations/components/operations-shell";

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OperationsShell>{children}</OperationsShell>;
}
