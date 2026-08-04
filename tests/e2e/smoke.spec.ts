import { test, expect } from "@playwright/test";

test.describe("Gönder auth foundation", () => {
  test("loads Turkish home", async ({ page }) => {
    await page.goto("/tr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("opens welcome auth screen", async ({ page }) => {
    await page.goto("/tr/welcome");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("email login reaches app home for completed user", async ({ page }) => {
    await page.goto("/tr/login/email");
    await page.getByLabel(/E-posta|Email/i).fill("ayse@example.com");
    await page.getByLabel(/Şifre|Password/i).fill("Password1!");
    await page.getByRole("button", { name: /Giriş yap|Sign in/i }).click();
    await expect(page).toHaveURL(/\/tr\/app\/home/);
  });
});
