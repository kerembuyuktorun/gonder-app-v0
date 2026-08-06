"use client";

import { PanelLayoutShell } from "@/components/layout/panel-layout-shell";
import { CompletedOnboardingGuard } from "@/lib/auth/guards";

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <CompletedOnboardingGuard>
      <PanelLayoutShell>{children}</PanelLayoutShell>
    </CompletedOnboardingGuard>
  );
}
