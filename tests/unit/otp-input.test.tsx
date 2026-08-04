import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { OtpInput } from "@/features/auth/components/otp-input";
import * as React from "react";
import tr from "../../messages/tr.json";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="tr" messages={tr}>
      {children}
    </NextIntlClientProvider>
  );
}

function OtpHarness() {
  const [value, setValue] = React.useState("");
  return <OtpInput value={value} onChange={setValue} />;
}

describe("OtpInput", () => {
  it("accepts typed digits", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <OtpHarness />
      </Wrapper>,
    );
    const first = screen.getByLabelText("OTP 1");
    await user.type(first, "1");
    expect((screen.getByLabelText("OTP 1") as HTMLInputElement).value).toBe("1");
  });
});
