import { describe, expect, it } from "vitest";
import { formatMoney, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { isDesktopWidth, isMobileWidth } from "@/lib/utils/responsive";
import { paginate } from "@/mocks/repositories/helpers";

describe("formatMoney", () => {
  it("formats TRY amounts for tr-TR", () => {
    const result = formatMoney({ amount: 189.5, currency: "TRY" }, "tr-TR");
    expect(result).toContain("189");
    expect(result).toMatch(/₺|TRY/);
  });
});

describe("formatDate", () => {
  it("formats ISO dates", () => {
    const result = formatDate("2026-08-01T09:12:00.000Z", "en-US");
    expect(result).toContain("2026");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("responsive helpers", () => {
  it("detects mobile and desktop breakpoints", () => {
    expect(isMobileWidth(390)).toBe(true);
    expect(isDesktopWidth(1280)).toBe(true);
  });
});

describe("paginate", () => {
  it("returns the requested page slice", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginate(items, 2, 2)).toEqual({
      items: [3, 4],
      total: 5,
      page: 2,
      pageSize: 2,
    });
  });
});
