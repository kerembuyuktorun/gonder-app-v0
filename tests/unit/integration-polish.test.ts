import { describe, expect, it } from "vitest";
import { mockDashboardSnapshot } from "@/mocks/data/dashboard";
import { MOCK_ORDERS } from "@/mocks/data/orders";
import { staffPermissions, isOpsStaff } from "@/lib/auth/staff";
import { hasPermission } from "@/lib/auth/permissions";
import { ROLE_PERMISSIONS } from "@/lib/auth/permissions";
import { OPS_NAV } from "@/features/operations/lib/nav";
import { ORDER_LIST_VIEWS } from "@/features/orders/lib/status";

describe("mock data consistency", () => {
  it("dashboard active shipments reference real order ids", () => {
    const orderIds = new Set(MOCK_ORDERS.map((o) => o.id));
    for (const item of mockDashboardSnapshot.activeShipments) {
      expect(item.orderId).toBeTruthy();
      expect(orderIds.has(item.orderId!)).toBe(true);
      const order = MOCK_ORDERS.find((o) => o.id === item.orderId)!;
      expect(item.trackingNumber).toBe(order.trackingNumber);
    }
  });

  it("dashboard payment and approval widgets use order references", () => {
    for (const item of mockDashboardSnapshot.awaitingPayment) {
      const order = MOCK_ORDERS.find((o) => o.id === item.orderId);
      expect(order?.status).toBe("awaiting_payment");
      expect(item.reference).toBe(order?.reference);
    }
    for (const item of mockDashboardSnapshot.awaitingUserApproval) {
      const order = MOCK_ORDERS.find((o) => o.id === item.orderId);
      expect(order?.status).toBe("awaiting_approval");
    }
  });

  it("quick actions point at live routes", () => {
    const hrefs = mockDashboardSnapshot.quickActions.map((a) => a.href);
    expect(hrefs.some((h) => h.startsWith("/app/orders"))).toBe(true);
    expect(hrefs.some((h) => h.includes("integrations"))).toBe(true);
    expect(hrefs.every((h) => !h.includes("/app/shipments?"))).toBe(true);
  });
});

describe("permission matrix", () => {
  it("customer owner can manage integrations and settings", () => {
    const membership = {
      id: "m",
      userId: "u",
      organizationId: "o",
      role: "owner" as const,
      permissions: ROLE_PERMISSIONS.owner,
    };
    expect(hasPermission(membership, "integrations:manage")).toBe(true);
    expect(hasPermission(membership, "ops:access")).toBe(false);
  });

  it("ops staff has ops access but viewer cannot write quotes", () => {
    expect(isOpsStaff("ops_admin")).toBe(true);
    expect(staffPermissions("ops_admin")).toContain("ops:quotes:write");
    expect(staffPermissions("ops_viewer")).not.toContain("ops:quotes:write");
    expect(staffPermissions("ops_finance")).toContain("ops:finance:read");
  });
});

describe("route inventories", () => {
  it("exposes all operations nav views", () => {
    expect(OPS_NAV.map((n) => n.view)).toEqual(
      expect.arrayContaining([
        "summary",
        "new",
        "partners",
        "finance",
        "reports",
      ]),
    );
  });

  it("exposes all order list views", () => {
    expect(ORDER_LIST_VIEWS).toContain("problematic");
    expect(ORDER_LIST_VIEWS).toContain("awaiting_payment");
  });
});
