import type {
  QuoteRepository,
  ServiceRepository,
  ShipmentRepository,
} from "@/lib/api/repositories";
import type { AuthRepository } from "@/lib/api/auth-repository";
import type { DashboardRepository } from "@/lib/api/dashboard-repository";
import type { AgentRepository } from "@/lib/api/agent-repository";
import type { CourierRepository } from "@/lib/api/courier-repository";
import type { ParcelRepository } from "@/lib/api/parcel-repository";
import type { XlRepository } from "@/lib/api/xl-repository";
import type { FreightRepository } from "@/lib/api/freight-repository";
import type { SpotRepository } from "@/lib/api/spot-repository";
import type { PaymentRepository } from "@/lib/api/payment-repository";
import type { OrdersRepository } from "@/lib/api/orders-repository";
import type { IntegrationsRepository } from "@/lib/api/integrations-repository";
import type { SettingsRepository } from "@/lib/api/settings-repository";
import {
  mockQuoteRepository,
  mockServiceRepository,
  mockShipmentRepository,
} from "@/mocks/repositories/mock-repositories";
import { mockAuthRepository } from "@/mocks/repositories/mock-auth-repository";
import { mockDashboardRepository } from "@/mocks/repositories/mock-dashboard-repository";
import { mockAgentRepository } from "@/mocks/repositories/mock-agent-repository";
import { mockCourierRepository } from "@/mocks/repositories/mock-courier-repository";
import { mockParcelRepository } from "@/mocks/repositories/mock-parcel-repository";
import { mockXlRepository } from "@/mocks/repositories/mock-xl-repository";
import { mockFreightRepository } from "@/mocks/repositories/mock-freight-repository";
import { mockSpotRepository } from "@/mocks/repositories/mock-spot-repository";
import { mockPaymentRepository } from "@/mocks/repositories/mock-payment-repository";
import type { OperationsRepository } from "@/lib/api/operations-repository";
import { mockOrdersRepository } from "@/mocks/repositories/mock-orders-repository";
import { mockIntegrationsRepository } from "@/mocks/repositories/mock-integrations-repository";
import { mockSettingsRepository } from "@/mocks/repositories/mock-settings-repository";
import { mockOperationsRepository } from "@/mocks/repositories/mock-operations-repository";

/**
 * Switch DATA_SOURCE to "api" when real backends are ready.
 * Keep interfaces stable so feature code does not change.
 */
export type DataSource = "mock" | "api";

export const dataSource: DataSource =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as DataSource | undefined) ?? "mock";

function notImplemented(name: string): never {
  throw new Error(
    `API repository "${name}" is not implemented yet. Set NEXT_PUBLIC_DATA_SOURCE=mock.`,
  );
}

const apiServiceRepository: ServiceRepository = {
  listServices: () => notImplemented("ServiceRepository.listServices"),
  getServiceById: () => notImplemented("ServiceRepository.getServiceById"),
};

const apiQuoteRepository: QuoteRepository = {
  listQuotes: () => notImplemented("QuoteRepository.listQuotes"),
  getQuoteById: () => notImplemented("QuoteRepository.getQuoteById"),
};

const apiShipmentRepository: ShipmentRepository = {
  listShipments: () => notImplemented("ShipmentRepository.listShipments"),
  getShipmentById: () => notImplemented("ShipmentRepository.getShipmentById"),
};

const apiAuthRepository: AuthRepository = {
  getSession: () => notImplemented("AuthRepository.getSession"),
  signOut: () => notImplemented("AuthRepository.signOut"),
  requestPhoneOtp: () => notImplemented("AuthRepository.requestPhoneOtp"),
  verifyPhoneOtp: () => notImplemented("AuthRepository.verifyPhoneOtp"),
  signInWithEmail: () => notImplemented("AuthRepository.signInWithEmail"),
  requestPasswordReset: () =>
    notImplemented("AuthRepository.requestPasswordReset"),
  resetPassword: () => notImplemented("AuthRepository.resetPassword"),
  signInWithGoogle: () => notImplemented("AuthRepository.signInWithGoogle"),
  signInWithApple: () => notImplemented("AuthRepository.signInWithApple"),
  setAccountType: () => notImplemented("AuthRepository.setAccountType"),
  updatePersonalInfo: () => notImplemented("AuthRepository.updatePersonalInfo"),
  createOrganization: () => notImplemented("AuthRepository.createOrganization"),
  updateCompanyTax: () => notImplemented("AuthRepository.updateCompanyTax"),
  setDefaultSenderAddress: () =>
    notImplemented("AuthRepository.setDefaultSenderAddress"),
  completeOnboarding: () => notImplemented("AuthRepository.completeOnboarding"),
  setActiveContext: () => notImplemented("AuthRepository.setActiveContext"),
  getOnboardingStep: () => notImplemented("AuthRepository.getOnboardingStep"),
};

const apiDashboardRepository: DashboardRepository = {
  getDashboard: () => notImplemented("DashboardRepository.getDashboard"),
};

const apiAgentRepository: AgentRepository = {
  listConversations: () => notImplemented("AgentRepository.listConversations"),
  getConversation: () => notImplemented("AgentRepository.getConversation"),
  startConversation: () => notImplemented("AgentRepository.startConversation"),
  sendMessage: () => notImplemented("AgentRepository.sendMessage"),
  updateDraft: () => notImplemented("AgentRepository.updateDraft"),
  confirmDraft: () => notImplemented("AgentRepository.confirmDraft"),
  continueFromWhatsApp: () =>
    notImplemented("AgentRepository.continueFromWhatsApp"),
  getMissingFieldPrompt: () =>
    notImplemented("AgentRepository.getMissingFieldPrompt"),
};

const apiCourierRepository: CourierRepository = {
  validate: () => notImplemented("CourierRepository.validate"),
  getQuote: () => notImplemented("CourierRepository.getQuote"),
  submit: () => notImplemented("CourierRepository.submit"),
};

const apiParcelRepository: ParcelRepository = {
  listTemplates: () => notImplemented("ParcelRepository.listTemplates"),
  listPreviousShipments: () =>
    notImplemented("ParcelRepository.listPreviousShipments"),
  listIntegrationOrders: () =>
    notImplemented("ParcelRepository.listIntegrationOrders"),
  getQuotes: () => notImplemented("ParcelRepository.getQuotes"),
  getWalletBalance: () => notImplemented("ParcelRepository.getWalletBalance"),
  checkout: () => notImplemented("ParcelRepository.checkout"),
  parseExcelUpload: () => notImplemented("ParcelRepository.parseExcelUpload"),
};

const apiXlRepository: XlRepository = {
  getQuote: () => notImplemented("XlRepository.getQuote"),
  getQuoteWithCalculating: () =>
    notImplemented("XlRepository.getQuoteWithCalculating"),
  getWalletBalance: () => notImplemented("XlRepository.getWalletBalance"),
  submitForOpsReview: () => notImplemented("XlRepository.submitForOpsReview"),
  checkout: () => notImplemented("XlRepository.checkout"),
};

const apiFreightRepository: FreightRepository = {
  submit: () => notImplemented("FreightRepository.submit"),
  getRequest: () => notImplemented("FreightRepository.getRequest"),
  advanceStatus: () => notImplemented("FreightRepository.advanceStatus"),
  requestRevision: () => notImplemented("FreightRepository.requestRevision"),
  acceptQuote: () => notImplemented("FreightRepository.acceptQuote"),
  sendMessage: () => notImplemented("FreightRepository.sendMessage"),
  replyAsOps: () => notImplemented("FreightRepository.replyAsOps"),
};

const apiSpotRepository: SpotRepository = {
  openRequest: () => notImplemented("SpotRepository.openRequest"),
  getRequest: () => notImplemented("SpotRepository.getRequest"),
  refreshOffers: () => notImplemented("SpotRepository.refreshOffers"),
  sendCounterOffer: () => notImplemented("SpotRepository.sendCounterOffer"),
  selectOffer: () => notImplemented("SpotRepository.selectOffer"),
  markAccepted: () => notImplemented("SpotRepository.markAccepted"),
};

const apiPaymentRepository: PaymentRepository = {
  listSavedCards: () => notImplemented("PaymentRepository.listSavedCards"),
  getWalletBalance: () => notImplemented("PaymentRepository.getWalletBalance"),
  validateDiscount: () => notImplemented("PaymentRepository.validateDiscount"),
  getDefaultInvoice: () => notImplemented("PaymentRepository.getDefaultInvoice"),
  checkout: () => notImplemented("PaymentRepository.checkout"),
  confirm3ds: () => notImplemented("PaymentRepository.confirm3ds"),
  getIntentStatus: () => notImplemented("PaymentRepository.getIntentStatus"),
};

const apiOrdersRepository: OrdersRepository = {
  list: () => notImplemented("OrdersRepository.list"),
  getById: () => notImplemented("OrdersRepository.getById"),
  reportIssue: () => notImplemented("OrdersRepository.reportIssue"),
  cancelOrder: () => notImplemented("OrdersRepository.cancelOrder"),
  sendMessage: () => notImplemented("OrdersRepository.sendMessage"),
  listNotifications: () => notImplemented("OrdersRepository.listNotifications"),
  markNotificationRead: () =>
    notImplemented("OrdersRepository.markNotificationRead"),
  markAllNotificationsRead: () =>
    notImplemented("OrdersRepository.markAllNotificationsRead"),
  listSavedViews: () => notImplemented("OrdersRepository.listSavedViews"),
  saveView: () => notImplemented("OrdersRepository.saveView"),
  exportCsv: () => notImplemented("OrdersRepository.exportCsv"),
};

const apiIntegrationsRepository: IntegrationsRepository = {
  listProviders: () => notImplemented("IntegrationsRepository.listProviders"),
  listConnections: () => notImplemented("IntegrationsRepository.listConnections"),
  getDetail: () => notImplemented("IntegrationsRepository.getDetail"),
  connect: () => notImplemented("IntegrationsRepository.connect"),
  disconnect: () => notImplemented("IntegrationsRepository.disconnect"),
  retrySync: () => notImplemented("IntegrationsRepository.retrySync"),
  disable: () => notImplemented("IntegrationsRepository.disable"),
  listImportHistory: () =>
    notImplemented("IntegrationsRepository.listImportHistory"),
  getImportJob: () => notImplemented("IntegrationsRepository.getImportJob"),
  startExcelImport: () =>
    notImplemented("IntegrationsRepository.startExcelImport"),
  listSheets: () => notImplemented("IntegrationsRepository.listSheets"),
  applyMapping: () => notImplemented("IntegrationsRepository.applyMapping"),
  fixRow: () => notImplemented("IntegrationsRepository.fixRow"),
  importValidRows: () =>
    notImplemented("IntegrationsRepository.importValidRows"),
  requestBulkQuotes: () =>
    notImplemented("IntegrationsRepository.requestBulkQuotes"),
  listTemplates: () => notImplemented("IntegrationsRepository.listTemplates"),
  saveTemplate: () => notImplemented("IntegrationsRepository.saveTemplate"),
  deleteTemplate: () => notImplemented("IntegrationsRepository.deleteTemplate"),
  listFavoriteAddresses: () =>
    notImplemented("IntegrationsRepository.listFavoriteAddresses"),
  listPackagePresets: () =>
    notImplemented("IntegrationsRepository.listPackagePresets"),
  listCarrierRules: () =>
    notImplemented("IntegrationsRepository.listCarrierRules"),
  copyPreviousShipment: () =>
    notImplemented("IntegrationsRepository.copyPreviousShipment"),
};

const apiSettingsRepository: SettingsRepository = {
  getSnapshot: () => notImplemented("SettingsRepository.getSnapshot"),
  updateProfile: () => notImplemented("SettingsRepository.updateProfile"),
  updateOrganization: () =>
    notImplemented("SettingsRepository.updateOrganization"),
  inviteMember: () => notImplemented("SettingsRepository.inviteMember"),
  updateMemberRole: () => notImplemented("SettingsRepository.updateMemberRole"),
  removeMember: () => notImplemented("SettingsRepository.removeMember"),
  saveAddress: () => notImplemented("SettingsRepository.saveAddress"),
  deleteAddress: () => notImplemented("SettingsRepository.deleteAddress"),
  listPaymentMethods: () =>
    notImplemented("SettingsRepository.listPaymentMethods"),
  removePaymentMethod: () =>
    notImplemented("SettingsRepository.removePaymentMethod"),
  updateInvoice: () => notImplemented("SettingsRepository.updateInvoice"),
  updateNotifications: () =>
    notImplemented("SettingsRepository.updateNotifications"),
  updateLocaleTheme: () =>
    notImplemented("SettingsRepository.updateLocaleTheme"),
  revokeSession: () => notImplemented("SettingsRepository.revokeSession"),
};

export const serviceRepository: ServiceRepository =
  dataSource === "mock" ? mockServiceRepository : apiServiceRepository;

export const quoteRepository: QuoteRepository =
  dataSource === "mock" ? mockQuoteRepository : apiQuoteRepository;

export const shipmentRepository: ShipmentRepository =
  dataSource === "mock" ? mockShipmentRepository : apiShipmentRepository;

export const authRepository: AuthRepository =
  dataSource === "mock" ? mockAuthRepository : apiAuthRepository;

export const dashboardRepository: DashboardRepository =
  dataSource === "mock" ? mockDashboardRepository : apiDashboardRepository;

export const agentRepository: AgentRepository =
  dataSource === "mock" ? mockAgentRepository : apiAgentRepository;

export const courierRepository: CourierRepository =
  dataSource === "mock" ? mockCourierRepository : apiCourierRepository;

export const parcelRepository: ParcelRepository =
  dataSource === "mock" ? mockParcelRepository : apiParcelRepository;

export const xlRepository: XlRepository =
  dataSource === "mock" ? mockXlRepository : apiXlRepository;

export const freightRepository: FreightRepository =
  dataSource === "mock" ? mockFreightRepository : apiFreightRepository;

export const spotRepository: SpotRepository =
  dataSource === "mock" ? mockSpotRepository : apiSpotRepository;

export const paymentRepository: PaymentRepository =
  dataSource === "mock" ? mockPaymentRepository : apiPaymentRepository;

export const ordersRepository: OrdersRepository =
  dataSource === "mock" ? mockOrdersRepository : apiOrdersRepository;

export const integrationsRepository: IntegrationsRepository =
  dataSource === "mock"
    ? mockIntegrationsRepository
    : apiIntegrationsRepository;

export const settingsRepository: SettingsRepository =
  dataSource === "mock" ? mockSettingsRepository : apiSettingsRepository;

const apiOperationsRepository: OperationsRepository = {
  getMetrics: () => notImplemented("OperationsRepository.getMetrics"),
  getFinance: () => notImplemented("OperationsRepository.getFinance"),
  listRequests: () => notImplemented("OperationsRepository.listRequests"),
  getRequest: () => notImplemented("OperationsRepository.getRequest"),
  listPartners: () => notImplemented("OperationsRepository.listPartners"),
  listPriceLists: () => notImplemented("OperationsRepository.listPriceLists"),
  listStaff: () => notImplemented("OperationsRepository.listStaff"),
  createManualQuote: () =>
    notImplemented("OperationsRepository.createManualQuote"),
  assignPartner: () => notImplemented("OperationsRepository.assignPartner"),
  assignVehicle: () => notImplemented("OperationsRepository.assignVehicle"),
  changeStatus: () => notImplemented("OperationsRepository.changeStatus"),
  requestMissingInfo: () =>
    notImplemented("OperationsRepository.requestMissingInfo"),
  changeServiceType: () =>
    notImplemented("OperationsRepository.changeServiceType"),
  uploadDocument: () => notImplemented("OperationsRepository.uploadDocument"),
  addOpsNote: () => notImplemented("OperationsRepository.addOpsNote"),
  bulkAssign: () => notImplemented("OperationsRepository.bulkAssign"),
  resolveException: () =>
    notImplemented("OperationsRepository.resolveException"),
};

export const operationsRepository: OperationsRepository =
  dataSource === "mock" ? mockOperationsRepository : apiOperationsRepository;
