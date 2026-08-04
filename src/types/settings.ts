import type { Permission } from "@/types/auth";

/** Workspace roles shown in settings (mapped to permissions). */
export type WorkspaceRole =
  | "org_admin"
  | "ops"
  | "finance"
  | "requester"
  | "viewer";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  status: "active" | "invited" | "disabled";
  lastActiveAt?: string;
};

export type SavedPaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
};

export type InvoiceProfile = {
  legalName: string;
  taxNumber: string;
  taxOffice: string;
  address: string;
  email: string;
};

export type NotificationPrefs = {
  emailOrderUpdates: boolean;
  emailQuotes: boolean;
  emailBilling: boolean;
  pushCritical: boolean;
  smsDelivery: boolean;
  whatsappOps: boolean;
};

export type SecuritySession = {
  id: string;
  device: string;
  location: string;
  lastActiveAt: string;
  current?: boolean;
};

export type LocaleThemePrefs = {
  locale: "tr" | "en";
  theme: "light" | "dark" | "system";
};

export type OrganizationSettings = {
  id: string;
  name: string;
  legalName: string;
  taxNumber: string;
  taxOffice: string;
  website?: string;
};

export type PersonalProfileSettings = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle?: string;
};

export type SettingsSnapshot = {
  profile: PersonalProfileSettings;
  organization: OrganizationSettings;
  members: TeamMember[];
  addresses: import("@/types/integrations").FavoriteAddress[];
  paymentMethods: SavedPaymentMethod[];
  invoice: InvoiceProfile;
  notifications: NotificationPrefs;
  localeTheme: LocaleThemePrefs;
  sessions: SecuritySession[];
};

export const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  org_admin: [
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
  ops: [
    "shipments:read",
    "shipments:write",
    "quotes:read",
    "quotes:write",
    "requests:create",
    "reports:read",
    "support:access",
  ],
  finance: [
    "shipments:read",
    "quotes:read",
    "reports:read",
    "settings:manage",
    "support:access",
  ],
  requester: [
    "shipments:read",
    "shipments:write",
    "quotes:read",
    "quotes:write",
    "requests:create",
    "support:access",
  ],
  viewer: ["shipments:read", "quotes:read", "reports:read", "support:access"],
};
