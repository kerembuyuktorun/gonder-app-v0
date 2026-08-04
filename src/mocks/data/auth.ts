import type {
  Membership,
  OrganizationProfile,
  Permission,
  UserProfile,
} from "@/types/auth";
import type { Address } from "@/types/domain";

export const ALL_PERMISSIONS: Permission[] = [
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
];

export const MEMBER_PERMISSIONS: Permission[] = [
  "shipments:read",
  "shipments:write",
  "quotes:read",
  "quotes:write",
  "requests:create",
  "reports:read",
  "support:access",
];

export const VIEWER_PERMISSIONS: Permission[] = [
  "shipments:read",
  "quotes:read",
  "reports:read",
  "support:access",
];

export const mockUsers: UserProfile[] = [
  {
    id: "user-complete",
    firstName: "Ayşe",
    lastName: "Yılmaz",
    email: "ayse@example.com",
    phone: "+905551112233",
    accountStatus: "active",
    onboarding: {
      status: "completed",
      step: "complete",
      accountType: "organization",
    },
    identities: [
      {
        id: "id-phone-1",
        provider: "phone",
        identifier: "+905551112233",
        verifiedAt: "2026-07-01T10:00:00.000Z",
      },
      {
        id: "id-email-1",
        provider: "email",
        identifier: "ayse@example.com",
        verifiedAt: "2026-07-01T10:05:00.000Z",
      },
      {
        id: "id-google-1",
        provider: "google",
        identifier: "google-sub-ayse",
        verifiedAt: "2026-07-02T09:00:00.000Z",
      },
    ],
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "user-partial",
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet@example.com",
    phone: "+905559998877",
    accountStatus: "active",
    onboarding: {
      status: "in_progress",
      step: "company_tax",
      accountType: "organization",
    },
    identities: [
      {
        id: "id-phone-2",
        provider: "phone",
        identifier: "+905559998877",
        verifiedAt: "2026-08-01T08:00:00.000Z",
      },
    ],
    createdAt: "2026-08-01T08:00:00.000Z",
  },
  {
    id: "user-suspended",
    firstName: "Suspended",
    lastName: "User",
    email: "suspended@example.com",
    phone: "+905550000001",
    accountStatus: "suspended",
    onboarding: {
      status: "completed",
      step: "complete",
      accountType: "individual",
    },
    identities: [
      {
        id: "id-email-suspended",
        provider: "email",
        identifier: "suspended@example.com",
        verifiedAt: "2026-06-01T10:00:00.000Z",
      },
    ],
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "user-ops",
    firstName: "Selin",
    lastName: "Ops",
    email: "ops@gonder.com",
    phone: "+905551234567",
    accountStatus: "active",
    staffRole: "ops_admin",
    onboarding: {
      status: "completed",
      step: "complete",
      accountType: "individual",
    },
    identities: [
      {
        id: "id-email-ops",
        provider: "email",
        identifier: "ops@gonder.com",
        verifiedAt: "2026-01-01T10:00:00.000Z",
      },
    ],
    createdAt: "2026-01-01T10:00:00.000Z",
  },
];

export const mockOrganizations: OrganizationProfile[] = [
  {
    id: "org-arf-demo",
    name: "Arf Lojistik Demo",
    legalName: "Arf Lojistik A.Ş.",
    taxNumber: "1234567890",
    taxOffice: "Kadıköy",
    defaultSenderAddressId: "addr-default-1",
    createdAt: "2026-07-01T11:00:00.000Z",
  },
  {
    id: "org-partial",
    name: "Demir Ticaret",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
];

export const mockMemberships: Membership[] = [
  {
    id: "mem-1",
    userId: "user-complete",
    organizationId: "org-arf-demo",
    role: "owner",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "mem-2",
    userId: "user-partial",
    organizationId: "org-partial",
    role: "owner",
    permissions: ALL_PERMISSIONS,
  },
];

export const mockAddresses: Address[] = [
  {
    id: "addr-default-1",
    label: "Merkez depo",
    contactName: "Ayşe Yılmaz",
    phone: "+905551112233",
    line1: "Caferağa Mah. Moda Cad. No:12",
    district: "Kadıköy",
    city: "İstanbul",
    postalCode: "34710",
    country: "TR",
  },
];

/** Mock credentials for email/password login */
export const mockPasswords: Record<string, string> = {
  "ayse@example.com": "Password1!",
  "mehmet@example.com": "Password1!",
  "suspended@example.com": "Password1!",
  "ops@gonder.com": "Password1!",
};

/** Valid OTP for demos; 000000 simulates expiry */
export const MOCK_VALID_OTP = "123456";
export const MOCK_EXPIRED_OTP = "000000";
