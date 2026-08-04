import { test, expect } from "@playwright/test";

async function loginCustomer(page: import("@playwright/test").Page) {
  await page.goto("/tr/login/email");
  await page.getByLabel(/E-posta|Email/i).fill("ayse@example.com");
  await page.getByLabel(/Şifre|Password/i).fill("Password1!");
  await page.getByRole("button", { name: /Giriş yap|Sign in/i }).click();
  await expect(page).toHaveURL(/\/tr\/app\/home/);
}

async function loginOps(page: import("@playwright/test").Page) {
  await page.goto("/tr/login/email");
  await page.getByLabel(/E-posta|Email/i).fill("ops@gonder.com");
  await page.getByLabel(/Şifre|Password/i).fill("Password1!");
  await page.getByRole("button", { name: /Giriş yap|Sign in/i }).click();
  await expect(page).toHaveURL(/\/tr\/operations/);
}

test.describe("Gönder demo scenarios", () => {
  test("customer home widgets deep-link to orders", async ({ page }) => {
    await loginCustomer(page);
    await page.getByRole("link", { name: /Tümünü gör|View all/i }).first().click();
    await expect(page).toHaveURL(/\/tr\/app\/orders/);
  });

  test("AI agent and courier request routes load", async ({ page }) => {
    await loginCustomer(page);
    await page.goto("/tr/app/agent");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/tr/app/requests/courier");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("parcel and XL routes load for comparison / redirect flow", async ({
    page,
  }) => {
    await loginCustomer(page);
    await page.goto("/tr/app/requests/parcel");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/tr/app/requests/xl");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("FTL LTL spot and orders tracking", async ({ page }) => {
    await loginCustomer(page);
    for (const path of [
      "/tr/app/requests/ftl",
      "/tr/app/requests/ltl",
      "/tr/app/requests/spot",
      "/tr/app/orders?view=active",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading").first()).toBeVisible();
    }
  });

  test("excel integrations tab and whatsapp handoff query", async ({ page }) => {
    await loginCustomer(page);
    await page.goto("/tr/app/integrations?tab=excel");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto(
      "/tr/app/agent?from=whatsapp&conversationId=wa-handoff-001",
    );
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("ops panel quote prep queue loads for staff", async ({ page }) => {
    await loginOps(page);
    await page.goto("/tr/operations/queue/quote_prep");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/tr/operations/requests/opr_3");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("responsive shell at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginCustomer(page);
    await expect(page.getByRole("main")).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("main")).toBeVisible();
  });
});
