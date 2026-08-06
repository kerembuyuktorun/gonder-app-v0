import { describe, expect, it, beforeEach } from "vitest";
import { mockOrdersRepository } from "@/mocks/repositories/mock-orders-repository";
import { mapProviderStatus, statusesForView } from "@/features/orders/lib/status";

describe("order status mapping", () => {
  it("maps provider raw statuses to Gönder lifecycle", () => {
    expect(mapProviderStatus("parcel_1_30", "hub_scan")).toBe("in_transit");
    expect(mapProviderStatus("courier", "ofd")).toBe("out_for_delivery");
    expect(mapProviderStatus("parcel_1_30", "exception")).toBe("issue");
    expect(mapProviderStatus("spot", "quote_ready")).toBe("awaiting_approval");
  });

  it("resolves list view status sets", () => {
    expect(statusesForView("active")).toContain("in_transit");
    expect(statusesForView("problematic")).toEqual(["issue"]);
    expect(statusesForView("all")).toBe("all");
    expect(statusesForView("needs_shipment")).toBe("all");
  });
});

describe("mock orders repository", () => {
  beforeEach(() => {
    mockOrdersRepository._reset();
  });

  it("lists all orders with pagination", async () => {
    const result = await mockOrdersRepository.list({
      view: "all",
      page: 1,
      pageSize: 5,
    });
    expect(result.total).toBeGreaterThanOrEqual(9);
    expect(result.items).toHaveLength(5);
    expect(result.items[0]).toHaveProperty("reference");
    expect(result.items[0]).toHaveProperty("shipmentConversion");
    expect(result.items[0]).toHaveProperty("source");
  });

  it("filters by list view", async () => {
    const awaiting = await mockOrdersRepository.list({
      view: "awaiting_payment",
      page: 1,
      pageSize: 20,
    });
    expect(awaiting.items.every((o) => o.status === "awaiting_payment")).toBe(
      true,
    );

    const active = await mockOrdersRepository.list({
      view: "active",
      page: 1,
      pageSize: 50,
    });
    expect(
      active.items.every((o) =>
        ["confirmed", "picked_up", "in_transit", "out_for_delivery"].includes(
          o.status,
        ),
      ),
    ).toBe(true);
  });

  it("filters integration orders by shipment conversion", async () => {
    const needs = await mockOrdersRepository.list({
      view: "needs_shipment",
      page: 1,
      pageSize: 50,
    });
    expect(needs.total).toBeGreaterThan(0);
    expect(
      needs.items.every((o) => o.shipmentConversion === "not_converted"),
    ).toBe(true);

    const converted = await mockOrdersRepository.list({
      view: "converted",
      page: 1,
      pageSize: 50,
    });
    expect(converted.total).toBeGreaterThan(0);
    expect(
      converted.items.every((o) => o.shipmentConversion === "converted"),
    ).toBe(true);
  });

  it("searches by external integration reference", async () => {
    const search = await mockOrdersRepository.list({
      view: "all",
      search: "TY-44120",
      page: 1,
      pageSize: 20,
    });
    expect(search.items.length).toBeGreaterThan(0);
    expect(search.items[0]?.externalRef).toBe("TY-44120");
  });

  it("supports global search and critical filter", async () => {
    const search = await mockOrdersRepository.list({
      view: "all",
      search: "Yurtiçi",
      page: 1,
      pageSize: 20,
    });
    expect(search.items.length).toBeGreaterThan(0);
    expect(
      search.items.some((o) => o.providerName?.includes("Yurtiçi")),
    ).toBe(true);

    const critical = await mockOrdersRepository.list({
      view: "all",
      criticalOnly: true,
      page: 1,
      pageSize: 50,
    });
    expect(critical.items.every((o) => o.critical || o.hasIssue)).toBe(true);
  });

  it("returns detail with timeline documents and map location", async () => {
    const detail = await mockOrdersRepository.getById("ord_c1");
    expect(detail?.timeline.length).toBeGreaterThan(0);
    expect(detail?.documents.length).toBeGreaterThan(0);
    expect(detail?.location?.live).toBe(true);
    expect(detail?.provider.rawStatus).toBe("out_for_delivery");
  });

  it("reports issue and cancels with refund path", async () => {
    const issued = await mockOrdersRepository.reportIssue({
      orderId: "ord_p1",
      category: "delay",
      description: "Aktarma gecikti",
      severity: "critical",
    });
    expect(issued.status).toBe("issue");
    expect(issued.hasIssue).toBe(true);
    expect(issued.issues.at(-1)?.category).toBe("delay");

    const cancelled = await mockOrdersRepository.cancelOrder({
      orderId: "ord_x1",
      reason: "Müşteri vazgeçti",
    });
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.cancelReason).toBe("Müşteri vazgeçti");
  });

  it("exports CSV and lists notifications", async () => {
    const csv = await mockOrdersRepository.exportCsv({ view: "all" });
    expect(csv.split("\n")[0]).toContain("reference");
    expect(csv.split("\n").length).toBeGreaterThan(2);

    const notifications = await mockOrdersRepository.listNotifications();
    expect(notifications.length).toBeGreaterThan(0);
    await mockOrdersRepository.markAllNotificationsRead();
    const after = await mockOrdersRepository.listNotifications();
    expect(after.every((n) => n.read)).toBe(true);
  });

  it("sends messages and saves views", async () => {
    const msg = await mockOrdersRepository.sendMessage("ord_c1", "Merhaba");
    expect(msg.body).toBe("Merhaba");
    const detail = await mockOrdersRepository.getById("ord_c1");
    expect(detail?.messages.some((m) => m.body === "Merhaba")).toBe(true);

    const view = await mockOrdersRepository.saveView({
      name: "Test view",
      listView: "active",
      sort: "updatedAt",
      sortDir: "desc",
      columns: ["reference", "status"],
    });
    expect(view.id).toBeTruthy();
    const views = await mockOrdersRepository.listSavedViews();
    expect(views.some((v) => v.name === "Test view")).toBe(true);
  });
});
