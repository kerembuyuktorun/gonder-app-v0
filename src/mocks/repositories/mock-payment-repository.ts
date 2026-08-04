import type { PaymentRepository } from "@/lib/api/payment-repository";
import {
  MOCK_SAVED_CARDS,
  MOCK_WALLET_BALANCE,
} from "@/mocks/data/spot";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import { AuthError } from "@/types/auth";
import type { PaymentIntent } from "@/types/payment";

const intents = new Map<string, PaymentIntent>();
/** Idempotency key → intent id to prevent duplicate charges */
const idempotencyIndex = new Map<string, string>();

function stamp() {
  return Date.now().toString().slice(-7);
}

export const mockPaymentRepository: PaymentRepository = {
  async listSavedCards() {
    return runWithMockLatency(() => [...MOCK_SAVED_CARDS], 100);
  },

  async getWalletBalance() {
    return runWithMockLatency(() => ({ ...MOCK_WALLET_BALANCE }), 80);
  },

  async validateDiscount(code) {
    return runWithMockLatency(() => {
      const normalized = code.trim().toUpperCase();
      if (normalized === "GONDER10") {
        return { percent: 10, label: "Gönder %10" };
      }
      if (normalized === "SPOT5") {
        return { percent: 5, label: "Spot %5" };
      }
      return null;
    }, 150);
  },

  async getDefaultInvoice() {
    return runWithMockLatency(
      () => ({
        companyName: "Arf Lojistik Demo A.Ş.",
        taxOffice: "Kadıköy",
        taxNumber: "1234567890",
        address: "Caferağa Mah. Moda Cad. No:12 Kadıköy / İstanbul",
        email: "fatura@example.com",
      }),
      80,
    );
  },

  async checkout(input) {
    return runWithMockLatency(() => {
      if (!input.contractAccepted) {
        throw new AuthError("unauthorized", "Contract required");
      }
      if (!input.invoice.taxNumber || !input.invoice.companyName) {
        throw new AuthError("incomplete_onboarding", "Invoice incomplete");
      }

      // Idempotency: return existing intent for same key
      const existingId = idempotencyIndex.get(input.idempotencyKey);
      if (existingId) {
        const existing = intents.get(existingId);
        if (existing) return structuredClone(existing);
      }

      if (
        input.method === "wallet" &&
        input.amount.amount > MOCK_WALLET_BALANCE.amount
      ) {
        throw new AuthError("unauthorized", "Insufficient wallet balance");
      }

      const id = `pi_${stamp()}`;
      const now = new Date().toISOString();

      let status: PaymentIntent["status"] = "processing";
      let threeDsUrl: string | undefined;
      let failureReasonKey: string | undefined;
      let orderId: string | undefined;

      const outcome = input.simulateOutcome;
      const needs3ds =
        input.require3ds ||
        input.method === "new_card" ||
        (input.method === "saved_card" && input.savedCardId?.endsWith("4444"));

      if (outcome === "failed") {
        status = "failed";
        failureReasonKey = "payment.failures.declined";
      } else if (outcome === "uncertain") {
        status = "uncertain";
      } else if (needs3ds && !outcome) {
        status = "requires_3ds";
        threeDsUrl = `/mock-3ds/${id}`;
      } else {
        status = "succeeded";
        orderId = `ord_spot_${stamp()}`;
      }

      const intent: PaymentIntent = {
        id,
        status,
        amount: input.amount,
        method: input.method,
        timing: input.timing,
        discountApplied: undefined,
        threeDsUrl,
        orderId,
        failureReasonKey,
        idempotencyKey: input.idempotencyKey,
        createdAt: now,
      };

      intents.set(id, intent);
      idempotencyIndex.set(input.idempotencyKey, id);
      return structuredClone(intent);
    }, 500);
  },

  async confirm3ds(intentId) {
    return runWithMockLatency(() => {
      const intent = intents.get(intentId);
      if (!intent) throw new AuthError("unauthorized", "Intent not found");
      if (intent.status === "succeeded") return structuredClone(intent);
      if (intent.status !== "requires_3ds") {
        throw new AuthError("unauthorized", "3DS not required");
      }
      const updated: PaymentIntent = {
        ...intent,
        status: "succeeded",
        orderId: intent.orderId ?? `ord_spot_${stamp()}`,
        threeDsUrl: undefined,
      };
      intents.set(intentId, updated);
      return structuredClone(updated);
    }, 400);
  },

  async getIntentStatus(intentId) {
    return runWithMockLatency(() => {
      const intent = intents.get(intentId);
      if (!intent) throw new AuthError("unauthorized", "Intent not found");
      // Resolve uncertain → succeeded on poll (no double charge)
      if (intent.status === "uncertain") {
        const resolved: PaymentIntent = {
          ...intent,
          status: "succeeded",
          orderId: intent.orderId ?? `ord_spot_${stamp()}`,
        };
        intents.set(intentId, resolved);
        return structuredClone(resolved);
      }
      return structuredClone(intent);
    }, 300);
  },
};
