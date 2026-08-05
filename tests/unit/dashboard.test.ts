import { describe, expect, it } from "vitest";
import { mockDashboardRepository } from "@/mocks/repositories/mock-dashboard-repository";
import { mockDashboardSnapshot } from "@/mocks/data/dashboard";

describe("dashboard repository", () => {
  it("returns personalized greeting and service cards", async () => {
    const snapshot = await mockDashboardRepository.getDashboard({
      userName: "Ayşe",
      organizationId: "org-arf-demo",
      organizationName: "Arf Lojistik Demo",
    });

    expect(snapshot.greetingName).toBe("Ayşe");
    expect(snapshot.contextLabel).toBe("Arf Lojistik Demo");
    expect(snapshot.services).toHaveLength(6);
    expect(snapshot.services.map((s) => s.serviceType)).toEqual([
      "courier",
      "parcel_1_30",
      "gonder_xl",
      "ftl",
      "ltl",
      "spot",
    ]);
  });

  it("includes FTL/LTL help keys for service cards", () => {
    const ftl = mockDashboardSnapshot.services.find((s) => s.serviceType === "ftl");
    const ltl = mockDashboardSnapshot.services.find((s) => s.serviceType === "ltl");
    expect(ftl?.helpKey).toBeTruthy();
    expect(ltl?.helpKey).toBeTruthy();
  });

  it("exposes operational widgets and quick actions", async () => {
    const snapshot = await mockDashboardRepository.getDashboard();
    expect(snapshot.activeShipments.length).toBeGreaterThan(0);
    expect(snapshot.ordersNeedingShipment.length).toBeGreaterThan(0);
    expect(snapshot.pendingQuoteRequests.length).toBeGreaterThan(0);
    expect(snapshot.awaitingUserApproval.length).toBeGreaterThan(0);
    expect(snapshot.awaitingPayment.length).toBeGreaterThan(0);
    expect(snapshot.quickActions).toHaveLength(8);
    expect(snapshot.integrations.length).toBeGreaterThan(0);
    expect(snapshot.usage.shipmentCount).toBeGreaterThan(0);
  });

  it("supports empty dashboard variant", async () => {
    const snapshot = await mockDashboardRepository.getDashboard({
      organizationId: "empty",
    });
    expect(snapshot.activeShipments).toHaveLength(0);
    expect(snapshot.awaitingPayment).toHaveLength(0);
    expect(snapshot.usage.shipmentCount).toBe(0);
  });
});
