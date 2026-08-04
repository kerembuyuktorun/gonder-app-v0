import { describe, expect, it } from "vitest";
import { hasPermission, hasAnyPermission } from "@/lib/auth/permissions";
import { ALL_PERMISSIONS, VIEWER_PERMISSIONS } from "@/mocks/data/auth";
import type { Membership } from "@/types/auth";

const membership: Membership = {
  id: "m1",
  userId: "u1",
  organizationId: "o1",
  role: "viewer",
  permissions: VIEWER_PERMISSIONS,
};

describe("permissions", () => {
  it("checks single and any permissions", () => {
    expect(hasPermission(membership, "shipments:read")).toBe(true);
    expect(hasPermission(membership, "integrations:manage")).toBe(false);
    expect(hasAnyPermission(membership, ["integrations:manage", "quotes:read"])).toBe(
      true,
    );
  });

  it("owner permissions include manage rights", () => {
    expect(ALL_PERMISSIONS).toContain("org:manage");
    expect(ALL_PERMISSIONS).toContain("requests:create");
  });
});
