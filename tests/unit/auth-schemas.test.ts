import { describe, expect, it } from "vitest";
import { phoneSchema, emailLoginSchema } from "@/features/auth/schemas/auth-schemas";

describe("auth schemas", () => {
  it("validates phone numbers", () => {
    expect(phoneSchema.safeParse({ phone: "+905551112233" }).success).toBe(true);
    expect(phoneSchema.safeParse({ phone: "123" }).success).toBe(false);
  });

  it("validates email login payload", () => {
    expect(
      emailLoginSchema.safeParse({
        email: "ayse@example.com",
        password: "Password1!",
      }).success,
    ).toBe(true);
    expect(
      emailLoginSchema.safeParse({ email: "bad", password: "short" }).success,
    ).toBe(false);
  });
});
