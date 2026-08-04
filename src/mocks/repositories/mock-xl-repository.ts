import type { XlRepository } from "@/lib/api/xl-repository";
import {
  estimateXlQuote,
  resolvePreparingQuote,
} from "@/features/xl/lib/pricing";
import { MOCK_XL_WALLET } from "@/mocks/data/xl";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import { AuthError } from "@/types/auth";

export const mockXlRepository: XlRepository = {
  async getWalletBalance() {
    return runWithMockLatency(() => ({ ...MOCK_XL_WALLET }), 100);
  },

  async getQuote({ draft, resolvePreparing }) {
    return runWithMockLatency(() => {
      const quote = estimateXlQuote(draft);
      if (resolvePreparing && quote.state === "quote_preparing") {
        return resolvePreparingQuote(draft);
      }
      return quote;
    }, 400);
  },

  async getQuoteWithCalculating(draft) {
    // Caller shows calculating; we just delay then return
    return runWithMockLatency(() => estimateXlQuote(draft), 900);
  },

  async submitForOpsReview(draft) {
    return runWithMockLatency(() => {
      if (!draft.pickup.line1 || !draft.delivery.line1) {
        throw new AuthError("incomplete_onboarding", "Addresses required");
      }
      const stamp = Date.now().toString().slice(-6);
      return {
        requestId: `xl_ops_${stamp}`,
        etaHours: 4,
      };
    }, 500);
  },

  async checkout({ draft, quote, paymentMethod }) {
    return runWithMockLatency(() => {
      if (!quote.total) {
        throw new AuthError("unauthorized", "Quote not ready for payment");
      }
      if (
        !["instant_ready", "quote_ready"].includes(quote.state)
      ) {
        throw new AuthError("unauthorized", "Quote not payable");
      }
      if (
        paymentMethod === "balance" &&
        quote.total.amount > MOCK_XL_WALLET.amount
      ) {
        throw new AuthError("unauthorized", "Insufficient balance");
      }
      if (!draft.transportDate) {
        throw new AuthError("incomplete_onboarding", "Transport date required");
      }
      const stamp = Date.now().toString().slice(-7);
      return {
        orderId: `ord_xl_${stamp}`,
        reference: `GNDX${stamp}`,
        quote,
        paidWith: paymentMethod,
        total: quote.total,
      };
    }, 600);
  },
};
