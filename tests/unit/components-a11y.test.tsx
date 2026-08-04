import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { AppButton } from "@/components/shared/app-button";
import tr from "../../messages/tr.json";

function wrap(ui: React.ReactNode) {
  return (
    <NextIntlClientProvider locale="tr" messages={tr}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("shared UI accessibility", () => {
  it("Button exposes busy state when loading", () => {
    render(<Button loading>Kaydet</Button>);
    expect(screen.getByRole("button", { name: /Kaydet/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("EmptyState renders title and action", () => {
    render(
      wrap(
        <EmptyState
          title="Boş"
          description="Henüz veri yok"
          action={<AppButton type="button">Oluştur</AppButton>}
        />,
      ),
    );
    expect(screen.getByText("Boş")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Oluştur" })).toBeInTheDocument();
  });

  it("ErrorState exposes alert role", () => {
    render(wrap(<ErrorState title="Hata" description="Bir sorun oluştu" />));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("StatusBadge renders localized status text", () => {
    render(wrap(<StatusBadge status="delivered" />));
    expect(screen.getByText("Teslim edildi")).toBeInTheDocument();
  });
});
