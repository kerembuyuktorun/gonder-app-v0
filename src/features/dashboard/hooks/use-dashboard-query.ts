"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardRepository } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

export const dashboardQueryKeys = {
  dashboard: (organizationId?: string | null) =>
    ["dashboard", organizationId ?? "individual"] as const,
};

export function useDashboardQuery() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const activeOrganization = useAuthStore((s) => s.activeOrganization);
  const org = activeOrganization();
  const organizationId =
    session?.activeContext.type === "organization"
      ? session.activeContext.organizationId
      : null;

  return useQuery({
    queryKey: dashboardQueryKeys.dashboard(organizationId),
    queryFn: () =>
      dashboardRepository.getDashboard({
        organizationId,
        userName: user?.firstName ?? null,
        organizationName: org?.name ?? null,
      }),
    enabled: Boolean(user),
  });
}
