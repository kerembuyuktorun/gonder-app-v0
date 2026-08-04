import type { DashboardSnapshot } from "@/types/dashboard";

export interface DashboardRepository {
  getDashboard(context?: {
    organizationId?: string | null;
    userName?: string | null;
    organizationName?: string | null;
  }): Promise<DashboardSnapshot>;
}
