import { describe, expect, it } from "vitest";
import {
  breakpoints,
  isMobileWidth,
  isTabletWidth,
  isDesktopWidth,
} from "@/lib/utils/responsive";

describe("responsive breakpoints", () => {
  it("defines design breakpoints used for QA", () => {
    expect(breakpoints).toEqual({
      mobile: 390,
      tablet: 768,
      laptop: 1024,
      desktop: 1280,
      wide: 1440,
    });
  });

  it("classifies widths for shell layouts", () => {
    expect(isMobileWidth(390)).toBe(true);
    expect(isTabletWidth(800)).toBe(true);
    expect(isDesktopWidth(1280)).toBe(true);
  });
});
