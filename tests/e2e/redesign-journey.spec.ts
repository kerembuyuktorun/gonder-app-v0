import { test, expect } from "@playwright/test";

test.describe("landing → quote → authenticated shipment", () => {
  test("preserves the guest draft through login and creates an order draft", async ({
    page,
  }) => {
    await page.goto("/tr");
    await expect(
      page.getByRole("heading", {
        name: /Tüm kargo ve lojistik ihtiyaçlarınız/i,
      }),
    ).toBeVisible();

    await page.getByLabel("Nereden").fill("İstanbul");
    await page.getByLabel("Nereye").fill("Ankara");
    await page.getByRole("button", { name: "Fiyatları Gör" }).click();

    await expect(page).toHaveURL(/\/tr\/results/);
    await expect(
      page.getByRole("heading", { name: "Uygun hizmetler" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: /Seç ve devam et/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/tr\/login\/email/);
    await page.getByLabel(/E-posta/i).fill("ayse@example.com");
    await page.getByLabel(/Şifre/i).fill("Password1!");
    await page.getByRole("button", { name: /Giriş yap/i }).click();

    await expect(page).toHaveURL(/\/tr\/create-shipment/);
    await expect(page.getByLabel("Nereden")).toHaveValue("İstanbul");
    await expect(page.getByLabel("Nereye")).toHaveValue("Ankara");
    await page.getByRole("button", { name: "Siparişi oluştur" }).click();

    await expect(page).toHaveURL(/\/tr\/orders\?created=true/);
    await expect(
      page.getByText("Sipariş taslağınız oluşturuldu"),
    ).toBeVisible();
  });

  test("shows dynamic FTL fields and asynchronous quote state", async ({
    page,
  }) => {
    await page.goto("/tr");
    await page.getByRole("button", { name: /Lojistik/i }).first().click();
    await expect(
      page.getByRole("button", { name: /FTL · Komple/i }),
    ).toBeVisible();
    await page.getByLabel("Nereden").fill("Bursa");
    await page.getByLabel("Nereye").fill("İzmir");
    await page.getByRole("button", { name: "Fiyatları Gör" }).click();

    await expect(page).toHaveURL(/\/tr\/results/);
    await expect(page.getByText("Teklif hazırlanıyor")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Teklif talebi oluştur" }),
    ).toBeVisible();
  });
});
