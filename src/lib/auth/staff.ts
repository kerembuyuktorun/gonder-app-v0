import type { Permission, StaffRole } from "@/types/auth";

export const STAFF_ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  ops_admin: [
    "ops:access",
    "ops:requests:read",
    "ops:requests:write",
    "ops:quotes:write",
    "ops:assign",
    "ops:finance:read",
    "ops:partners:manage",
    "ops:audit:read",
    "support:access",
  ],
  ops_agent: [
    "ops:access",
    "ops:requests:read",
    "ops:requests:write",
    "ops:quotes:write",
    "ops:assign",
    "ops:audit:read",
    "support:access",
  ],
  ops_finance: [
    "ops:access",
    "ops:requests:read",
    "ops:finance:read",
    "ops:audit:read",
    "reports:read",
    "support:access",
  ],
  ops_viewer: [
    "ops:access",
    "ops:requests:read",
    "ops:finance:read",
    "ops:audit:read",
    "support:access",
  ],
};

export function staffPermissions(role: StaffRole | undefined): Permission[] {
  if (!role) return [];
  return STAFF_ROLE_PERMISSIONS[role];
}

export function isOpsStaff(role: StaffRole | undefined): boolean {
  return Boolean(role);
}
