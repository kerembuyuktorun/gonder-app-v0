import { describe, expect, it, beforeEach } from "vitest";
import { mockOperationsRepository } from "@/mocks/repositories/mock-operations-repository";
import { STAFF_ROLE_PERMISSIONS, isOpsStaff } from "@/lib/auth/staff";

describe("ops staff permissions", () => {
  it("gates operations access by staff role", () => {
    expect(isOpsStaff("ops_admin")).toBe(true);
    expect(isOpsStaff(undefined)).toBe(false);
    expect(STAFF_ROLE_PERMISSIONS.ops_admin).toContain("ops:access");
    expect(STAFF_ROLE_PERMISSIONS.ops_viewer).not.toContain("ops:quotes:write");
    expect(STAFF_ROLE_PERMISSIONS.ops_finance).toContain("ops:finance:read");
  });
});

describe("mock operations repository", () => {
  beforeEach(() => {
    mockOperationsRepository._reset();
  });

  it("returns dashboard metrics and finance", async () => {
    const metrics = await mockOperationsRepository.getMetrics();
    expect(metrics.newRequests).toBeGreaterThan(0);
    expect(metrics.estimatedGrossProfit.currency).toBe("TRY");
    const finance = await mockOperationsRepository.getFinance();
    expect(finance.receivables.amount).toBeGreaterThan(0);
  });

  it("filters queue views with SLA and assignee", async () => {
    const delayed = await mockOperationsRepository.listRequests({
      view: "delayed",
      pageSize: 50,
    });
    expect(delayed.items.every((i) => i.status === "delayed")).toBe(true);

    const assigned = await mockOperationsRepository.listRequests({
      view: "new",
      assigneeId: "staff_1",
      pageSize: 50,
    });
    expect(assigned.items.every((i) => i.assigneeId === "staff_1")).toBe(true);
  });

  it("creates manual quote with margin tax and audit", async () => {
    const detail = await mockOperationsRepository.createManualQuote({
      requestId: "opr_3",
      reason: "Hat teklifi hazır",
      lines: [
        {
          id: "1",
          label: "Taşıma",
          amount: { amount: 10000, currency: "TRY" },
        },
      ],
      partnerCost: { amount: 7000, currency: "TRY" },
      taxRate: 10,
      validHours: 24,
    });
    expect(detail.status).toBe("awaiting_approval");
    expect(detail.quote?.total.amount).toBe(11000);
    expect(detail.quote?.margin.amount).toBe(3000);
    expect(detail.audit[0]?.reason).toBe("Hat teklifi hazır");
    expect(detail.audit[0]?.before).toBeDefined();
    expect(detail.audit[0]?.after).toBe("11000");
  });

  it("assigns partner vehicle and resolves exceptions with reasons", async () => {
    const partnered = await mockOperationsRepository.assignPartner({
      requestId: "opr_1",
      partnerId: "prt_1",
      reason: "Kapasite uygun",
    });
    expect(partnered.partnerName).toBe("Arf Line");

    const veh = await mockOperationsRepository.assignVehicle({
      requestId: "opr_1",
      reason: "Şoför müsait",
      assignment: {
        vehicleId: "vx",
        vehicleLabel: "TIR",
        driverName: "Ali",
        driverPhone: "+90",
      },
    });
    expect(veh.assignment?.driverName).toBe("Ali");

    const resolved = await mockOperationsRepository.resolveException(
      "opr_8",
      "Hasar kapandı",
      "Müşteri onayladı",
    );
    expect(resolved.status).toBe("active");
    expect(resolved.hasIssue).toBe(false);
  });

  it("bulk assigns and lists partners", async () => {
    const n = await mockOperationsRepository.bulkAssign({
      requestIds: ["opr_1", "opr_2"],
      assigneeId: "staff_3",
      assigneeName: "Ece Finans",
      reason: "Yük dengeleme",
    });
    expect(n).toBe(2);
    const partners = await mockOperationsRepository.listPartners();
    expect(partners.some((p) => p.saasStatus === "connected")).toBe(true);
  });
});
