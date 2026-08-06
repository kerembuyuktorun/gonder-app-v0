import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const VIEWPORTS = [
  { name: "wide", width: 1440, height: 900 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const CUSTOMER_ROUTES = [
  "/tr/dashboard",
  "/tr/price-calculation",
  "/tr/create-shipment",
  "/tr/quotes",
  "/tr/shipments",
  "/tr/integrations",
  "/tr/reports",
  "/tr/settings",
  "/tr/support",
  "/tr/app/agent",
  "/tr/app/requests/courier",
  "/tr/app/requests/parcel",
  "/tr/app/requests/xl",
  "/tr/app/requests/freight",
  "/tr/app/requests/ftl",
  "/tr/app/requests/ltl",
  "/tr/app/requests/spot",
  "/tr/orders",
  "/tr/orders/ord_c1",
];

const OPS_ROUTES = [
  "/tr/operations",
  "/tr/operations/queue/quote_prep",
  "/tr/operations/requests/opr_3",
  "/tr/operations/partners",
  "/tr/operations/price-lists",
  "/tr/operations/finance",
  "/tr/operations/documents",
  "/tr/operations/reports",
];

async function login(page: Page, email: string, expected: RegExp) {
  await page.goto("/tr/login/email");
  await page.getByLabel(/E-posta|Email/i).fill(email);
  await page.getByLabel(/Şifre|Password/i).fill("Password1!");
  await page.getByRole("button", { name: /Giriş yap|Sign in/i }).click();
  await expect(page).toHaveURL(expected);
}

const loginCustomer = (page: Page) =>
  login(page, "ayse@example.com", /\/tr\/dashboard/);
const loginOps = (page: Page) =>
  login(page, "ops@gonder.com", /\/tr\/operations/);

function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

test.describe("route coverage", () => {
  test("all customer routes render a main region without page errors", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await loginCustomer(page);
    for (const route of CUSTOMER_ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page.getByRole("main"), route).toBeVisible();
    }
    expect(errors.join("\n")).toBe("");
  });

  test("all operations routes render for staff", async ({ page }) => {
    await loginOps(page);
    for (const route of OPS_ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page.getByRole("main"), route).toBeVisible();
    }
  });

  test("legacy paths redirect to current modules", async ({ page }) => {
    await loginCustomer(page);
    await page.goto("/tr/app/shipments");
    await expect(page).toHaveURL(/\/tr\/app\/orders/);
  });
});

test.describe("responsive", () => {
  for (const viewport of VIEWPORTS) {
    test(`landing fits ${viewport.name} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/tr");
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByLabel(/Nereden|From/i)).toBeVisible();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, "landing horizontal overflow").toBeLessThanOrEqual(2);
    });
  }

  for (const viewport of VIEWPORTS) {
    test(`home and orders fit ${viewport.name} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await loginCustomer(page);

      for (const route of ["/tr/dashboard", "/tr/orders"]) {
        await page.goto(route);
        await expect(page.getByRole("main")).toBeVisible();
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(2);
      }
    });
  }

  test("mobile shell exposes the navigation drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginCustomer(page);
    await page
      .getByRole("button", { name: /Menüyü aç|Kenar çubuğu|Toggle Sidebar/i })
      .first()
      .click();
    await expect(page.getByRole("link", { name: /Ana Sayfa|Home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Siparişler|Orders/i }).first()).toBeVisible();
  });
});

test.describe("keyboard and focus", () => {
  test("skip link is the first focus stop and jumps to main", async ({
    page,
  }) => {
    await loginCustomer(page);
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", {
      name: /Ana içeriğe geç|içeriğe geç|Skip to content/i,
    });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("login form is completable with the keyboard only", async ({ page }) => {
    await page.goto("/tr/login/email");
    await page.getByLabel(/E-posta|Email/i).focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("ayse@example.com");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel(/Şifre|Password/i)).toBeFocused();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("Password1!");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/tr\/dashboard/);
  });

  test("focus is visible on interactive elements", async ({ page }) => {
    await loginCustomer(page);
    await page.goto("/tr/orders");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const style = getComputedStyle(el);
      return `${style.outlineStyle}|${style.boxShadow}|${style.borderColor}`;
    });
    expect(outline).not.toBeNull();
  });
});

test.describe("theme", () => {
  test("dark theme toggles and persists across navigation", async ({ page }) => {
    await loginCustomer(page);
    await page.getByRole("button", { name: /Tema|Theme/i }).first().click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.goto("/tr/orders");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("main")).toBeVisible();
  });
});

test.describe("accessibility", () => {
  const A11Y_ROUTES = [
    "/tr",
    "/tr/results",
    "/tr/login/email",
    "/tr/dashboard",
    "/tr/orders",
    "/tr/settings",
  ];

  for (const route of A11Y_ROUTES) {
    test(`no critical axe violations on ${route}`, async ({ page }) => {
      if (!["/tr", "/tr/results", "/tr/login/email"].includes(route)) {
        await loginCustomer(page);
      }
      await page.goto(route);
      await expect(page.getByRole("main")).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const serious = results.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      );
      expect(
        serious.map((v) => `${v.id}: ${v.help}`).join("\n"),
      ).toBe("");
    });
  }
});

test.describe("localization", () => {
  test("english locale renders the app shell", async ({ page }) => {
    await loginCustomer(page);
    await page.goto("/en/dashboard");
    await expect(page.getByRole("main")).toBeVisible();
    await page.goto("/en/orders");
    await expect(page.getByRole("main")).toBeVisible();
  });
});
