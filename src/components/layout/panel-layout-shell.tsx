"use client";

import * as React from "react";
import { Package } from "lucide-react";
import { DashboardLayout } from "@/layout-kit";
import { panelNavGroups } from "@/features/panel/nav";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/lib/i18n/navigation";

export function PanelLayoutShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Kullanıcı";
  const email = user?.email ?? user?.phone ?? "";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "G";

  const handleLogout = React.useCallback(async () => {
    await signOut();
    router.replace("/welcome");
  }, [router, signOut]);

  return (
    <DashboardLayout
      brand={{
        title: "Gönder",
        subtitle: "Panel",
        url: "/dashboard",
        icon: Package,
      }}
      user={{
        name: displayName,
        email,
        avatar: "",
        role: initials,
      }}
      navGroups={panelNavGroups}
      onLogout={handleLogout}
      searchPlaceholder="Ara..."
      skipToContentLabel="Ana içeriğe geç"
    >
      {children}
    </DashboardLayout>
  );
}
