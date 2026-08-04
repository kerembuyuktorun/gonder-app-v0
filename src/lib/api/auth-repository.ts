import type {
  AuthSession,
  Membership,
  OnboardingStep,
  OrganizationProfile,
  OtpChallenge,
  PasswordResetChallenge,
  SessionSnapshot,
  UserProfile,
  AccountType,
  ActiveContext,
} from "@/types/auth";
import type { Address } from "@/types/domain";

export type PersonalInfoInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

export type OrganizationInput = {
  name: string;
};

export type CompanyTaxInput = {
  legalName: string;
  taxNumber: string;
  taxOffice: string;
};

export type DefaultAddressInput = Omit<Address, "id">;

export interface AuthRepository {
  getSession(): Promise<SessionSnapshot | null>;
  signOut(): Promise<void>;

  requestPhoneOtp(phone: string): Promise<OtpChallenge>;
  verifyPhoneOtp(challengeId: string, code: string): Promise<SessionSnapshot>;

  signInWithEmail(email: string, password: string): Promise<SessionSnapshot>;
  requestPasswordReset(email: string): Promise<PasswordResetChallenge>;
  resetPassword(
    challengeId: string,
    code: string,
    newPassword: string,
  ): Promise<void>;

  signInWithGoogle(): Promise<SessionSnapshot>;
  signInWithApple(): Promise<SessionSnapshot>;

  setAccountType(accountType: AccountType): Promise<UserProfile>;
  updatePersonalInfo(input: PersonalInfoInput): Promise<UserProfile>;
  createOrganization(input: OrganizationInput): Promise<{
    user: UserProfile;
    organization: OrganizationProfile;
    membership: Membership;
  }>;
  updateCompanyTax(input: CompanyTaxInput): Promise<OrganizationProfile>;
  setDefaultSenderAddress(input: DefaultAddressInput): Promise<Address>;
  completeOnboarding(): Promise<UserProfile>;

  setActiveContext(context: ActiveContext): Promise<AuthSession>;
  getOnboardingStep(): Promise<OnboardingStep | null>;
}
