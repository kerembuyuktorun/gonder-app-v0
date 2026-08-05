import { test, type Page } from "@playwright/test";
import path from "node:path";

/**
 * Visual capture helper — skipped unless CAPTURE_SCREENSHOTS is set:
 *   CAPTURE_SCREENSHOTS=1 pnpm exec playwright test tests/e2e/screenshots.spec.ts
 * Output: artifacts/screenshots/
 */
const OUT = process.env.SCREENSHOT_DIR ?? "artifacts/screenshots";

test.skip(
  !process.env.CAPTURE_SCREENSHOTS,
  "Set CAPTURE_SCREENSHOTS=1 to capture visual artifacts.",
);

const SHOTS = [
  { name: "home", route: "/tr/dashboard" },
  { name: "orders", route: "/tr/orders" },
  { name: "agent", route: "/tr/app/agent" },
  { name: "operations", route: "/tr/operations" },
] as const;

const SIZES = [
  { name: "1440", width: 1440, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
] as const;

async function login(page: Page, email: string) {
  await page.goto("/tr/login/email");
  await page.getByLabel(/E-posta|Email/i).fill(email);
  await page.getByLabel(/Şifre|Password/i).fill("Password1!");
  await page.getByRole("button", { name: /Giriş yap|Sign in/i }).click();
  await page.waitForURL(/\/tr\/(dashboard|operations)/);
}

test.describe.configure({ mode: "serial" });

test("capture public landing", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/tr");
    if (theme === "dark") {
      await page
        .getByRole("button", { name: /Temayı değiştir|Change theme/i })
        .click();
    }
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(OUT, `landing-1440-${theme}.png`),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(OUT, `landing-390-${theme}.png`),
      fullPage: false,
    });
  }
});

test("capture light and dark screenshots", async ({ page }) => {
  test.slow();
  await login(page, "ayse@example.com");

  for (const theme of ["light", "dark"] as const) {
    if (theme === "dark") {
      await page.getByRole("button", { name: /Tema|Theme/i }).first().click();
    }
    for (const shot of SHOTS.filter((s) => !s.route.includes("operations"))) {
      for (const size of SIZES) {
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(shot.route);
        await page.waitForLoadState("networkidle");
        await page.screenshot({
          path: path.join(OUT, `${shot.name}-${size.name}-${theme}.png`),
          fullPage: false,
        });
      }
    }
  }
});

test("capture operations panel", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page, "ops@gonder.com");
  await page.goto("/tr/operations");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(OUT, "operations-1440-light.png") });
});
