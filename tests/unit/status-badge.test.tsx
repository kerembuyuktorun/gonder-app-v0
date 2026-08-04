import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/shared/status-badge";
import { NextIntlClientProvider } from "next-intl";
import tr from "../../messages/tr.json";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="tr" messages={tr}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("StatusBadge", () => {
  it("renders localized shipment status", () => {
    renderWithIntl(<StatusBadge status="delivered" />);
    expect(screen.getByText("Teslim edildi")).toBeInTheDocument();
  });
});
