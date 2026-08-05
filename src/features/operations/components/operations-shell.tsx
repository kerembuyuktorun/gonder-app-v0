"use client";

import {
  LayoutDashboard,
  Inbox,
  AlertCircle,
  FileText,
  UserCheck,
  CreditCard,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Tags,
  Wallet,
  FolderOpen,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/app-shell";
import { OPS_NAV } from "@/features/operations/lib/nav";
import { useAuthStore } from "@/stores/auth-store";
import { AppButton } from "@/components/shared/app-button";
import { OpsStaffGuard } from "@/lib/auth/guards";
import { Link } from "@/lib/i18n/navigation";

const icons: Record<string, React.ReactNode> = {
  summary: <LayoutDashboard className="size-4" />,
  new: <Inbox className="size-4" />,
  missing_info: <AlertCircle className="size-4" />,
  quote_prep: <FileText className="size-4" />,
  awaiting_approval: <UserCheck className="size-4" />,
  awaiting_payment: <CreditCard className="size-4" />,
  active: <Truck className="size-4" />,
  delayed: <Clock className="size-4" />,
  problematic: <AlertTriangle className="size-4" />,
  completed: <CheckCircle2 className="size-4" />,
  partners: <Users className="size-4" />,
  price_lists: <Tags className="size-4" />,
  finance: <Wallet className="size-4" />,
  documents: <FolderOpen className="size-4" />,
  reports: <BarChart3 className="size-4" />,
};

export function OperationsShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const navItems = OPS_NAV.map((item) => ({
    href: item.href,
    labelKey: item.labelKey,
    icon: icons[item.view],
  }));

  return (
    <OpsStaffGuard>
      <AppShell navItems={navItems} panelTitle={t("operations.panelTitle")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">
            {user?.firstName} {user?.lastName}
            {user?.staffRole ? ` · ${t(`operations.staffRoles.${user.staffRole}`)}` : ""}
          </p>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <AppButton size="sm" variant="ghost">
                {t("operations.customerApp")}
              </AppButton>
            </Link>
            <AppButton
              size="sm"
              variant="secondary"
              onClick={() => void signOut()}
            >
              <LogOut className="size-4" />
              {t("auth.signOut")}
            </AppButton>
          </div>
        </div>
        {children}
      </AppShell>
    </OpsStaffGuard>
  );
}
