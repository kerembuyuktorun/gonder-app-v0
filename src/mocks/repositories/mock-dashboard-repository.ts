import type { DashboardRepository } from "@/lib/api/dashboard-repository";
import {
  mockDashboardSnapshot,
  mockEmptyDashboardSnapshot,
} from "@/mocks/data/dashboard";
import { withMockLatency } from "@/mocks/repositories/helpers";

export const mockDashboardRepository: DashboardRepository = {
  async getDashboard(context) {
    const base =
      context?.organizationId === "empty"
        ? structuredClone(mockEmptyDashboardSnapshot)
        : structuredClone(mockDashboardSnapshot);

    if (context?.userName) {
      base.greetingName = context.userName;
    }
    if (context?.organizationName) {
      base.contextLabel = context.organizationName;
    } else if (!context?.organizationId) {
      base.contextLabel = "";
    }

    return withMockLatency(base, 280);
  },
};
