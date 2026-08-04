export type IdentityProvider = "phone" | "email" | "google" | "apple" | "sso";

export type AccountStatus = "active" | "suspended" | "pending";

export type AccountType = "individual" | "organization";

export type OnboardingStep =
  | "account_type"
  | "personal_info"
  | "organization"
  | "company_tax"
  | "default_address"
  | "complete";

export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export type OrgRole = "owner" | "admin" | "member" | "viewer";

/** Internal Gönder employee role for /operations panel */
export type StaffRole = "ops_admin" | "ops_agent" | "ops_finance" | "ops_viewer";

export type Permission =
  | "shipments:read"
  | "shipments:write"
  | "quotes:read"
  | "quotes:write"
  | "requests:create"
  | "integrations:manage"
  | "reports:read"
  | "settings:manage"
  | "org:manage"
  | "support:access"
  | "ops:access"
  | "ops:requests:read"
  | "ops:requests:write"
  | "ops:quotes:write"
  | "ops:assign"
  | "ops:finance:read"
  | "ops:partners:manage"
  | "ops:audit:read";

export type UserIdentity = {
  id: string;
  provider: IdentityProvider;
  identifier: string;
  verifiedAt?: string;
};

export type OnboardingState = {
  status: OnboardingStatus;
  step: OnboardingStep;
  accountType?: AccountType;
};

export type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  accountStatus: AccountStatus;
  onboarding: OnboardingState;
  identities: UserIdentity[];
  createdAt: string;
  /** Present only for Gönder employees with /operations access */
  staffRole?: StaffRole;
};

export type OrganizationProfile = {
  id: string;
  name: string;
  legalName?: string;
  taxNumber?: string;
  taxOffice?: string;
  defaultSenderAddressId?: string;
  createdAt: string;
};

export type Membership = {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgRole;
  permissions: Permission[];
};

export type ActiveContext =
  | { type: "individual" }
  | { type: "organization"; organizationId: string };

export type AuthSession = {
  accessToken: string;
  userId: string;
  activeContext: ActiveContext;
  expiresAt: string;
};

export type AuthErrorCode =
  | "invalid_otp"
  | "expired_otp"
  | "network_error"
  | "account_exists"
  | "incomplete_onboarding"
  | "account_suspended"
  | "organization_not_found"
  | "unauthorized"
  | "invalid_credentials"
  | "not_found";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
    this.code = code;
  }
}

export type OtpChallenge = {
  challengeId: string;
  phone: string;
  expiresAt: string;
};

export type PasswordResetChallenge = {
  challengeId: string;
  email: string;
  expiresAt: string;
};

export type SessionSnapshot = {
  session: AuthSession;
  user: UserProfile;
  memberships: Membership[];
  organizations: OrganizationProfile[];
};
