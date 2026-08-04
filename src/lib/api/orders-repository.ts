import type {
  CancelOrderInput,
  OrderDetail,
  OrderListParams,
  OrderListResult,
  OrderMessage,
  OrderNotification,
  ReportIssueInput,
  SavedOrderView,
} from "@/types/orders";

export interface OrdersRepository {
  list(params: OrderListParams): Promise<OrderListResult>;
  getById(id: string): Promise<OrderDetail | null>;
  reportIssue(input: ReportIssueInput): Promise<OrderDetail>;
  cancelOrder(input: CancelOrderInput): Promise<OrderDetail>;
  sendMessage(orderId: string, body: string): Promise<OrderMessage>;
  listNotifications(): Promise<OrderNotification[]>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  listSavedViews(): Promise<SavedOrderView[]>;
  saveView(view: Omit<SavedOrderView, "id">): Promise<SavedOrderView>;
  exportCsv(params: OrderListParams): Promise<string>;
}
