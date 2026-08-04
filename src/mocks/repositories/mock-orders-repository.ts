import type {
  CancelOrderInput,
  OrderDetail,
  OrderLifecycleStatus,
  OrderListParams,
  OrderListResult,
  OrderMessage,
  OrderNotification,
  OrderSortField,
  OrderSummary,
  ReportIssueInput,
  SavedOrderView,
} from "@/types/orders";
import type { OrdersRepository } from "@/lib/api/orders-repository";
import {
  DEFAULT_SAVED_VIEWS,
  MOCK_NOTIFICATIONS,
  MOCK_ORDERS,
  toSummary,
} from "@/mocks/data/orders";
import { STATUS_BY_VIEW } from "@/features/orders/lib/status";
import { paginate, withMockLatency } from "@/mocks/repositories/helpers";

let idSeq = 1000;
function nextId(prefix: string) {
  idSeq += 1;
  return `${prefix}_${idSeq}`;
}

function matchesSearch(order: OrderDetail, q: string): boolean {
  const hay = [
    order.reference,
    order.trackingNumber,
    order.originCity,
    order.destinationCity,
    order.providerName ?? "",
    order.serviceType,
    order.sender.name,
    order.recipient.name,
  ]
    .join(" ")
    .toLocaleLowerCase("tr-TR");
  return hay.includes(q.toLocaleLowerCase("tr-TR"));
}

function matchesFilters(order: OrderDetail, params: OrderListParams): boolean {
  const view = params.view ?? "all";
  const viewStatuses = STATUS_BY_VIEW[view];
  if (viewStatuses !== "all" && !viewStatuses.includes(order.status)) return false;

  if (params.serviceType && params.serviceType !== "all") {
    if (order.serviceType !== params.serviceType) return false;
  }
  if (params.serviceTypes?.length && !params.serviceTypes.includes(order.serviceType)) {
    return false;
  }
  if (params.statuses?.length && !params.statuses.includes(order.status)) return false;
  if (params.providers?.length) {
    const name = order.providerName ?? "";
    if (!params.providers.includes(name)) return false;
  }
  if (params.cities?.length) {
    const cities = [order.originCity, order.destinationCity];
    if (!params.cities.some((c) => cities.includes(c))) return false;
  }
  if (params.dateFrom && new Date(order.createdAt) < new Date(params.dateFrom)) {
    return false;
  }
  if (params.dateTo && new Date(order.createdAt) > new Date(params.dateTo)) {
    return false;
  }
  if (params.criticalOnly && !order.critical && !order.hasIssue) return false;
  if (params.search && !matchesSearch(order, params.search)) return false;
  return true;
}

function sortOrders(
  items: OrderSummary[],
  sortBy: OrderSortField,
  sortDir: "asc" | "desc",
) {
  const dir = sortDir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (sortBy === "total") {
      return (a.total.amount - b.total.amount) * dir;
    }
    const av = a[sortBy];
    const bv = b[sortBy];
    return String(av ?? "").localeCompare(String(bv ?? ""), "tr") * dir;
  });
}

export class MockOrdersRepository implements OrdersRepository {
  private orders = structuredClone(MOCK_ORDERS);
  private notifications = structuredClone(MOCK_NOTIFICATIONS);
  private savedViews = structuredClone(DEFAULT_SAVED_VIEWS);

  async list(params: OrderListParams = {}): Promise<OrderListResult> {
    const filtered = this.orders.filter((o) => matchesFilters(o, params));
    let summaries = filtered.map(toSummary);
    summaries = sortOrders(
      summaries,
      params.sort ?? "updatedAt",
      params.sortDir ?? "desc",
    );
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.max(1, params.pageSize ?? 10);
    const sliced = paginate(summaries, page, pageSize);
    return withMockLatency(sliced);
  }

  async getById(id: string): Promise<OrderDetail | null> {
    return withMockLatency(this.orders.find((o) => o.id === id) ?? null);
  }

  async reportIssue(input: ReportIssueInput): Promise<OrderDetail> {
    const order = this.orders.find((o) => o.id === input.orderId);
    if (!order) throw new Error("Sipariş bulunamadı");
    order.hasIssue = true;
    order.critical = input.severity === "critical" || order.critical;
    order.status = "issue";
    order.issues.push({
      id: nextId("iss"),
      category: input.category,
      description: input.description,
      status: "open",
      createdAt: new Date().toISOString(),
    });
    order.timeline.push({
      id: nextId("tl"),
      titleKey: "orders.timeline.issue",
      descriptionKey: "orders.timeline.issueReported",
      occurredAt: new Date().toISOString(),
      tone: "error",
    });
    order.updatedAt = new Date().toISOString();
    this.notifications.unshift({
      id: nextId("ntf"),
      orderId: order.id,
      titleKey: "orders.notifications.issueTitle",
      bodyKey: "orders.notifications.issueBody",
      createdAt: new Date().toISOString(),
      read: false,
      severity: "error",
    });
    return withMockLatency(structuredClone(order), 400);
  }

  async cancelOrder(input: CancelOrderInput): Promise<OrderDetail> {
    const order = this.orders.find((o) => o.id === input.orderId);
    if (!order) throw new Error("Sipariş bulunamadı");
    if (order.status === "delivered" || order.status === "cancelled") {
      throw new Error("Bu sipariş iptal edilemez");
    }
    order.status = "cancelled";
    order.cancelReason = input.reason;
    if (order.paymentStatus === "paid") order.paymentStatus = "refunded";
    order.timeline.push({
      id: nextId("tl"),
      titleKey: "orders.timeline.cancelled",
      occurredAt: new Date().toISOString(),
      tone: "neutral",
    });
    order.updatedAt = new Date().toISOString();
    return withMockLatency(structuredClone(order), 400);
  }

  async sendMessage(orderId: string, body: string): Promise<OrderMessage> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Sipariş bulunamadı");
    const msg: OrderMessage = {
      id: nextId("msg"),
      author: "customer",
      authorName: "Siz",
      body,
      createdAt: new Date().toISOString(),
    };
    order.messages.push(msg);
    order.updatedAt = new Date().toISOString();
    return withMockLatency(msg, 300);
  }

  async listNotifications(): Promise<OrderNotification[]> {
    return withMockLatency(structuredClone(this.notifications), 200);
  }

  async markNotificationRead(id: string): Promise<void> {
    const n = this.notifications.find((x) => x.id === id);
    if (n) n.read = true;
    await withMockLatency(undefined, 100);
  }

  async markAllNotificationsRead(): Promise<void> {
    this.notifications.forEach((n) => {
      n.read = true;
    });
    await withMockLatency(undefined, 100);
  }

  async listSavedViews(): Promise<SavedOrderView[]> {
    return withMockLatency(structuredClone(this.savedViews), 100);
  }

  async saveView(view: Omit<SavedOrderView, "id">): Promise<SavedOrderView> {
    const saved: SavedOrderView = { ...view, id: nextId("view") };
    this.savedViews.push(saved);
    return withMockLatency(saved, 200);
  }

  async exportCsv(params: OrderListParams): Promise<string> {
    const all = await this.list({ ...params, page: 1, pageSize: 10_000 });
    const header = [
      "reference",
      "trackingNumber",
      "serviceType",
      "status",
      "originCity",
      "destinationCity",
      "providerName",
      "amount",
      "currency",
      "createdAt",
      "updatedAt",
    ].join(",");
    const rows = all.items.map((o) =>
      [
        o.reference,
        o.trackingNumber,
        o.serviceType,
        o.status,
        o.originCity,
        o.destinationCity,
        o.providerName ?? "",
        o.total.amount,
        o.total.currency,
        o.createdAt,
        o.updatedAt,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    return withMockLatency([header, ...rows].join("\n"), 300);
  }

  _reset() {
    this.orders = structuredClone(MOCK_ORDERS);
    this.notifications = structuredClone(MOCK_NOTIFICATIONS);
    this.savedViews = structuredClone(DEFAULT_SAVED_VIEWS);
  }

  _setStatus(id: string, status: OrderLifecycleStatus) {
    const o = this.orders.find((x) => x.id === id);
    if (o) o.status = status;
  }
}

export const mockOrdersRepository = new MockOrdersRepository();
