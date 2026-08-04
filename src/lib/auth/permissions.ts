import type { Membership, Permission } from "@/types/auth";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    "shipments:read",
    "shipments:write",
    "quotes:read",
    "quotes:write",
    "requests:create",
    "integrations:manage",
    "reports:read",
    "settings:manage",
    "org:manage",
    "support:access",
  ],
  admin: [
    "shipments:read",
    "shipments:write",
    "quotes:read",
    "quotes:write",
    "requests:create",
    "integrations:manage",
    "reports:read",
    "settings:manage",
    "support:access",
  ],
  member: [
    "shipments:read",
    "shipments:write",
    "quotes:read",
    "quotes:write",
    "requests:create",
    "reports:read",
    "support:access",
  ],
  viewer: ["shipments:read", "quotes:read", "reports:read", "support:access"],
};

export function hasPermission(
  membership: Membership | null | undefined,
  permission: Permission,
): boolean {
  if (!membership) return false;
  return membership.permissions.includes(permission);
}

export function hasAnyPermission(
  membership: Membership | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => hasPermission(membership, p));
}

export function hasAllPermissions(
  membership: Membership | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.every((p) => hasPermission(membership, p));
}
