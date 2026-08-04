import { test, expect } from "@playwright/test";

test.describe("Gönder foundation", () => {
  test("loads Turkish home by default locale", async ({ page }) => {
    await page.goto("/tr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("opens design system showcase", async ({ page }) => {
    await page.goto("/tr/design-system");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Tasarım sistemi|Design system/,
    );
  });
});
