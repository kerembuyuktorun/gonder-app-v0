import type {
  AuthRepository,
  CompanyTaxInput,
  DefaultAddressInput,
  OrganizationInput,
  PersonalInfoInput,
} from "@/lib/api/auth-repository";
import {
  clearSessionToken,
  readAuthDb,
  readSessionToken,
  writeAuthDb,
  writeSessionToken,
} from "@/lib/auth/session-storage";
import {
  ALL_PERMISSIONS,
  MOCK_EXPIRED_OTP,
  MOCK_VALID_OTP,
  mockAddresses,
  mockMemberships,
  mockOrganizations,
  mockPasswords,
  mockUsers,
} from "@/mocks/data/auth";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import type { Address } from "@/types/domain";
import {
  AuthError,
  type AccountType,
  type ActiveContext,
  type AuthSession,
  type Membership,
  type OrganizationProfile,
  type SessionSnapshot,
  type UserProfile,
} from "@/types/auth";

type AuthDb = {
  users: UserProfile[];
  organizations: OrganizationProfile[];
  memberships: Membership[];
  addresses: Address[];
  passwords: Record<string, string>;
  otpChallenges: Record<
    string,
    { phone: string; expiresAt: string; consumed?: boolean }
  >;
  resetChallenges: Record<
    string,
    { email: string; expiresAt: string; consumed?: boolean }
  >;
  sessions: Record<string, AuthSession>;
};

const seedDb = (): AuthDb => ({
  users: structuredClone(mockUsers),
  organizations: structuredClone(mockOrganizations),
  memberships: structuredClone(mockMemberships),
  addresses: structuredClone(mockAddresses),
  passwords: { ...mockPasswords },
  otpChallenges: {},
  resetChallenges: {},
  sessions: {},
});

function loadDb(): AuthDb {
  const fallback = seedDb();
  const stored = readAuthDb(fallback);
  return {
    ...fallback,
    ...stored,
    users: (stored.users as UserProfile[]) ?? fallback.users,
    organizations:
      (stored.organizations as OrganizationProfile[]) ?? fallback.organizations,
    memberships: (stored.memberships as Membership[]) ?? fallback.memberships,
    addresses: (stored.addresses as Address[]) ?? fallback.addresses,
    passwords: stored.passwords ?? fallback.passwords,
    otpChallenges: stored.otpChallenges ?? {},
    resetChallenges: stored.resetChallenges ?? {},
    sessions: (stored as AuthDb).sessions ?? {},
  };
}

function saveDb(db: AuthDb): void {
  writeAuthDb(db);
}

function createToken(): string {
  return `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function snapshotFor(db: AuthDb, session: AuthSession): SessionSnapshot {
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) throw new AuthError("not_found");
  const memberships = db.memberships.filter((m) => m.userId === user.id);
  const orgIds = new Set(memberships.map((m) => m.organizationId));
  const organizations = db.organizations.filter((o) => orgIds.has(o.id));
  return { session, user, memberships, organizations };
}

function ensureActive(user: UserProfile): void {
  if (user.accountStatus === "suspended") {
    throw new AuthError("account_suspended");
  }
}

function createSession(
  db: AuthDb,
  user: UserProfile,
  context?: ActiveContext,
): AuthSession {
  const memberships = db.memberships.filter((m) => m.userId === user.id);
  const activeContext: ActiveContext =
    context ??
    (memberships[0]
      ? { type: "organization", organizationId: memberships[0].organizationId }
      : { type: "individual" });

  const session: AuthSession = {
    accessToken: createToken(),
    userId: user.id,
    activeContext,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  };
  db.sessions[session.accessToken] = session;
  writeSessionToken(session.accessToken);
  saveDb(db);
  return session;
}

function findOrCreateByPhone(db: AuthDb, phone: string): UserProfile {
  const existing = db.users.find(
    (u) =>
      u.phone === phone ||
      u.identities.some((i) => i.provider === "phone" && i.identifier === phone),
  );
  if (existing) return existing;

  const user: UserProfile = {
    id: createId("user"),
    phone,
    accountStatus: "active",
    onboarding: { status: "not_started", step: "account_type" },
    identities: [
      {
        id: createId("id"),
        provider: "phone",
        identifier: phone,
        verifiedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDb(db);
  return user;
}

function findOrCreateSocial(
  db: AuthDb,
  provider: "google" | "apple",
  identifier: string,
  email: string,
  firstName: string,
  lastName: string,
): UserProfile {
  const existing = db.users.find((u) =>
    u.identities.some(
      (i) => i.provider === provider && i.identifier === identifier,
    ),
  );
  if (existing) return existing;

  const byEmail = db.users.find((u) => u.email === email);
  if (byEmail) {
    byEmail.identities.push({
      id: createId("id"),
      provider,
      identifier,
      verifiedAt: new Date().toISOString(),
    });
    saveDb(db);
    return byEmail;
  }

  const user: UserProfile = {
    id: createId("user"),
    firstName,
    lastName,
    email,
    accountStatus: "active",
    onboarding: { status: "not_started", step: "account_type" },
    identities: [
      {
        id: createId("id"),
        provider,
        identifier,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: createId("id"),
        provider: "email",
        identifier: email,
        verifiedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDb(db);
  return user;
}

function advanceOnboarding(
  user: UserProfile,
  step: UserProfile["onboarding"]["step"],
) {
  user.onboarding.status = "in_progress";
  user.onboarding.step = step;
}

export const mockAuthRepository: AuthRepository = {
  async getSession() {
    return runWithMockLatency(() => {
      const token = readSessionToken();
      if (!token) return null;
      const db = loadDb();
      const session = db.sessions[token];
      if (!session) {
        clearSessionToken();
        return null;
      }
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        delete db.sessions[token];
        saveDb(db);
        clearSessionToken();
        return null;
      }
      return snapshotFor(db, session);
    }, 150);
  },

  async signOut() {
    return runWithMockLatency(() => {
      const token = readSessionToken();
      const db = loadDb();
      if (token) delete db.sessions[token];
      saveDb(db);
      clearSessionToken();
    }, 100);
  },

  async requestPhoneOtp(phone) {
    return runWithMockLatency(() => {
      if (!phone || phone.length < 10) {
        throw new AuthError("invalid_credentials");
      }
      const db = loadDb();
      const challengeId = createId("otp");
      db.otpChallenges[challengeId] = {
        phone,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      };
      saveDb(db);
      return {
        challengeId,
        phone,
        expiresAt: db.otpChallenges[challengeId].expiresAt,
      };
    });
  },

  async verifyPhoneOtp(challengeId, code) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const challenge = db.otpChallenges[challengeId];
      if (!challenge || challenge.consumed) {
        throw new AuthError("expired_otp");
      }
      if (code === MOCK_EXPIRED_OTP) {
        throw new AuthError("expired_otp");
      }
      if (code !== MOCK_VALID_OTP) {
        throw new AuthError("invalid_otp");
      }
      challenge.consumed = true;
      const user = findOrCreateByPhone(db, challenge.phone);
      ensureActive(user);
      const session = createSession(db, user);
      return snapshotFor(db, session);
    });
  },

  async signInWithEmail(email, password) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const normalized = email.trim().toLowerCase();
      const user = db.users.find(
        (u) => u.email?.toLowerCase() === normalized,
      );
      if (!user || db.passwords[normalized] !== password) {
        throw new AuthError("invalid_credentials");
      }
      ensureActive(user);
      const session = createSession(db, user);
      return snapshotFor(db, session);
    });
  },

  async requestPasswordReset(email) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const normalized = email.trim().toLowerCase();
      const user = db.users.find((u) => u.email?.toLowerCase() === normalized);
      if (!user) {
        // Do not leak existence in real apps; for mock we still return a challenge
      }
      const challengeId = createId("reset");
      db.resetChallenges[challengeId] = {
        email: normalized,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      };
      saveDb(db);
      return {
        challengeId,
        email: normalized,
        expiresAt: db.resetChallenges[challengeId].expiresAt,
      };
    });
  },

  async resetPassword(challengeId, code, newPassword) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const challenge = db.resetChallenges[challengeId];
      if (!challenge || challenge.consumed) {
        throw new AuthError("expired_otp");
      }
      if (code === MOCK_EXPIRED_OTP) throw new AuthError("expired_otp");
      if (code !== MOCK_VALID_OTP) throw new AuthError("invalid_otp");
      challenge.consumed = true;
      db.passwords[challenge.email] = newPassword;
      saveDb(db);
    });
  },

  async signInWithGoogle() {
    return runWithMockLatency(() => {
      const db = loadDb();
      const user = findOrCreateSocial(
        db,
        "google",
        "google-sub-demo",
        "ayse@example.com",
        "Ayşe",
        "Yılmaz",
      );
      ensureActive(user);
      const session = createSession(db, user);
      return snapshotFor(db, session);
    });
  },

  async signInWithApple() {
    return runWithMockLatency(() => {
      const db = loadDb();
      const user = findOrCreateSocial(
        db,
        "apple",
        "apple-sub-demo",
        "apple.user@example.com",
        "Apple",
        "User",
      );
      ensureActive(user);
      const session = createSession(db, user);
      return snapshotFor(db, session);
    });
  },

  async setAccountType(accountType: AccountType) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      const user = snap.user;
      user.onboarding.accountType = accountType;
      advanceOnboarding(user, "personal_info");
      const idx = db.users.findIndex((u) => u.id === user.id);
      db.users[idx] = user;
      saveDb(db);
      return user;
    });
  },

  async updatePersonalInfo(input: PersonalInfoInput) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      const user = snap.user;
      user.firstName = input.firstName;
      user.lastName = input.lastName;
      if (input.email) user.email = input.email;
      if (input.phone) user.phone = input.phone;
      const next =
        user.onboarding.accountType === "organization"
          ? "organization"
          : "default_address";
      advanceOnboarding(user, next);
      const idx = db.users.findIndex((u) => u.id === user.id);
      db.users[idx] = user;
      saveDb(db);
      return user;
    });
  },

  async createOrganization(input: OrganizationInput) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      const user = snap.user;
      const organization: OrganizationProfile = {
        id: createId("org"),
        name: input.name,
        createdAt: new Date().toISOString(),
      };
      const membership: Membership = {
        id: createId("mem"),
        userId: user.id,
        organizationId: organization.id,
        role: "owner",
        permissions: ALL_PERMISSIONS,
      };
      db.organizations.push(organization);
      db.memberships.push(membership);
      advanceOnboarding(user, "company_tax");
      const idx = db.users.findIndex((u) => u.id === user.id);
      db.users[idx] = user;
      const session = db.sessions[snap.session.accessToken];
      if (session) {
        session.activeContext = {
          type: "organization",
          organizationId: organization.id,
        };
      }
      saveDb(db);
      return { user, organization, membership };
    });
  },

  async updateCompanyTax(input: CompanyTaxInput) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      const orgId =
        snap.session.activeContext.type === "organization"
          ? snap.session.activeContext.organizationId
          : snap.memberships[0]?.organizationId;
      if (!orgId) throw new AuthError("organization_not_found");
      const org = db.organizations.find((o) => o.id === orgId);
      if (!org) throw new AuthError("organization_not_found");
      org.legalName = input.legalName;
      org.taxNumber = input.taxNumber;
      org.taxOffice = input.taxOffice;
      const user = snap.user;
      advanceOnboarding(user, "default_address");
      const idx = db.users.findIndex((u) => u.id === user.id);
      db.users[idx] = user;
      saveDb(db);
      return org;
    });
  },

  async setDefaultSenderAddress(input: DefaultAddressInput) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      const address: Address = { id: createId("addr"), ...input };
      db.addresses.push(address);
      if (snap.session.activeContext.type === "organization") {
        const organizationId = snap.session.activeContext.organizationId;
        const org = db.organizations.find((o) => o.id === organizationId);
        if (org) org.defaultSenderAddressId = address.id;
      }
      const user = snap.user;
      advanceOnboarding(user, "complete");
      const idx = db.users.findIndex((u) => u.id === user.id);
      db.users[idx] = user;
      saveDb(db);
      return address;
    });
  },

  async completeOnboarding() {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      const user = snap.user;
      user.onboarding.status = "completed";
      user.onboarding.step = "complete";
      const idx = db.users.findIndex((u) => u.id === user.id);
      db.users[idx] = user;
      saveDb(db);
      return user;
    });
  },

  async setActiveContext(context: ActiveContext) {
    return runWithMockLatency(() => {
      const db = loadDb();
      const snap = requireSession(db);
      if (context.type === "organization") {
        const allowed = snap.memberships.some(
          (m) => m.organizationId === context.organizationId,
        );
        if (!allowed) throw new AuthError("organization_not_found");
      }
      const session = db.sessions[snap.session.accessToken];
      session.activeContext = context;
      saveDb(db);
      return session;
    });
  },

  async getOnboardingStep() {
    return runWithMockLatency(() => {
      const db = loadDb();
      const token = readSessionToken();
      if (!token) return null;
      const session = db.sessions[token];
      if (!session) return null;
      const user = db.users.find((u) => u.id === session.userId);
      return user?.onboarding.step ?? null;
    }, 50);
  },
};

function requireSession(db: AuthDb): SessionSnapshot {
  const token = readSessionToken();
  if (!token) throw new AuthError("unauthorized");
  const session = db.sessions[token];
  if (!session) throw new AuthError("unauthorized");
  return snapshotFor(db, session);
}
