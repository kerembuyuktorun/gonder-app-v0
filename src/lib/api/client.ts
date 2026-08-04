import type {
  QuoteRepository,
  ServiceRepository,
  ShipmentRepository,
} from "@/lib/api/repositories";
import type { AuthRepository } from "@/lib/api/auth-repository";
import type { DashboardRepository } from "@/lib/api/dashboard-repository";
import type { AgentRepository } from "@/lib/api/agent-repository";
import {
  mockQuoteRepository,
  mockServiceRepository,
  mockShipmentRepository,
} from "@/mocks/repositories/mock-repositories";
import { mockAuthRepository } from "@/mocks/repositories/mock-auth-repository";
import { mockDashboardRepository } from "@/mocks/repositories/mock-dashboard-repository";
import { mockAgentRepository } from "@/mocks/repositories/mock-agent-repository";

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
