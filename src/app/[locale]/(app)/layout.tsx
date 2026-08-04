"use client";

import { WebAppShell } from "@/components/layout/web-app-shell";
import { CompletedOnboardingGuard } from "@/lib/auth/guards";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompletedOnboardingGuard>
      <WebAppShell>{children}</WebAppShell>
    </CompletedOnboardingGuard>
  );
}
