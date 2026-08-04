import type { CourierRepository } from "@/lib/api/courier-repository";
import {
  estimateCourierQuote,
  validateCourierDraft,
} from "@/features/courier/lib/pricing";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import { AuthError } from "@/types/auth";

export const mockCourierRepository: CourierRepository = {
  async validate(draft) {
    return runWithMockLatency(() => validateCourierDraft(draft), 120);
  },

  async getQuote(draft) {
    return runWithMockLatency(() => {
      const validation = validateCourierDraft(draft);
      // Simulate delayed pricing occasionally when express + many stops
      if (draft.stops.length >= 3 && draft.serviceLevel === "express") {
        return {
          validation,
          quote: {
            status: "preparing",
            currency: "TRY",
            lines: [],
            total: { amount: 0, currency: "TRY" },
            warnings: [],
          },
        };
      }
      return {
        validation,
        quote: estimateCourierQuote(draft, validation),
      };
    }, 350);
  },

  async submit(draft) {
    return runWithMockLatency(() => {
      const validation = validateCourierDraft(draft);
      if (validation.zoneStatus === "out_of_zone") {
        throw new AuthError("unauthorized", "Out of service zone");
      }
      if (!draft.recipient.name || !draft.recipient.phone) {
        throw new AuthError("incomplete_onboarding", "Recipient required");
      }
      const stamp = Date.now().toString().slice(-6);
      return {
        requestId: `req_courier_${stamp}`,
        trackingNumber: `GNDC${stamp}`,
      };
    }, 500);
  },
};
