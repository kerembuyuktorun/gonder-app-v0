import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { ServiceCards } from "@/features/dashboard/components/service-cards";
import { AiCommandBar } from "@/features/dashboard/components/ai-command-bar";
import { mockDashboardSnapshot } from "@/mocks/data/dashboard";
import tr from "../../messages/tr.json";
import * as React from "react";

const pushMock = vi.fn();

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.PropsWithChildren<
    { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
  >) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="tr" messages={tr}>
      {children}
    </NextIntlClientProvider>
  );
}

describe("dashboard UI", () => {
  it("renders functional service cards with FTL help", () => {
    render(
      <Wrapper>
        <ServiceCards services={mockDashboardSnapshot.services} />
      </Wrapper>,
    );

    expect(screen.getByText("Kurye")).toBeInTheDocument();
    expect(screen.getByText("FTL")).toBeInTheDocument();
    expect(
      screen.getByText(/Aracın tamamını siz kullanırsınız/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Kurye/i }),
    ).toHaveAttribute("href", "/app/requests/courier");
  });

  it("submits AI command to new request flow", async () => {
    const user = userEvent.setup();
    pushMock.mockClear();

    render(
      <Wrapper>
        <AiCommandBar />
      </Wrapper>,
    );

    await user.type(
      screen.getByLabelText(/AI ile taşıma talebi oluştur/i),
      "İstanbul Ankara 10 desi",
    );
    await user.click(screen.getByRole("button", { name: /Talep oluştur/i }));

    expect(pushMock).toHaveBeenCalled();
    const href = String(pushMock.mock.calls[0]?.[0] ?? "");
    expect(href).toContain("/app/requests/new");
    expect(href).toContain("mode=ai");
    expect(href).toContain("prompt=");
  });
});
