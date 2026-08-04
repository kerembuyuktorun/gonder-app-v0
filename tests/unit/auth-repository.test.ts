import { describe, expect, it, beforeEach } from "vitest";
import { mockAuthRepository } from "@/mocks/repositories/mock-auth-repository";
import { resetAuthPersistence } from "@/lib/auth/session-storage";
import { MOCK_EXPIRED_OTP, MOCK_VALID_OTP } from "@/mocks/data/auth";
import { AuthError } from "@/types/auth";
import { pathForOnboardingStep } from "@/lib/auth/onboarding-paths";

describe("mock auth repository", () => {
  beforeEach(() => {
    resetAuthPersistence();
  });

  it("signs in with email and persists session", async () => {
    const snapshot = await mockAuthRepository.signInWithEmail(
      "ayse@example.com",
      "Password1!",
    );
    expect(snapshot.user.email).toBe("ayse@example.com");
    expect(snapshot.user.onboarding.status).toBe("completed");

    const restored = await mockAuthRepository.getSession();
    expect(restored?.user.id).toBe(snapshot.user.id);
  });

  it("rejects invalid otp and expired otp", async () => {
    const challenge = await mockAuthRepository.requestPhoneOtp("+905551234567");
    await expect(
      mockAuthRepository.verifyPhoneOtp(challenge.challengeId, "111111"),
    ).rejects.toMatchObject({ code: "invalid_otp" } satisfies Partial<AuthError>);

    const challenge2 = await mockAuthRepository.requestPhoneOtp("+905551234567");
    await expect(
      mockAuthRepository.verifyPhoneOtp(challenge2.challengeId, MOCK_EXPIRED_OTP),
    ).rejects.toMatchObject({ code: "expired_otp" });
  });

  it("accepts valid otp and starts onboarding for new users", async () => {
    const challenge = await mockAuthRepository.requestPhoneOtp("+905557776655");
    const snapshot = await mockAuthRepository.verifyPhoneOtp(
      challenge.challengeId,
      MOCK_VALID_OTP,
    );
    expect(snapshot.user.onboarding.status).toBe("not_started");
    expect(pathForOnboardingStep(snapshot.user.onboarding.step)).toBe(
      "/onboarding/account-type",
    );
  });

  it("blocks suspended accounts", async () => {
    await expect(
      mockAuthRepository.signInWithEmail("suspended@example.com", "Password1!"),
    ).rejects.toMatchObject({ code: "account_suspended" });
  });

  it("resumes incomplete onboarding step", async () => {
    const snapshot = await mockAuthRepository.signInWithEmail(
      "mehmet@example.com",
      "Password1!",
    );
    expect(snapshot.user.onboarding.status).toBe("in_progress");
    expect(pathForOnboardingStep(snapshot.user.onboarding.step)).toBe(
      "/onboarding/company-tax",
    );
  });
});
