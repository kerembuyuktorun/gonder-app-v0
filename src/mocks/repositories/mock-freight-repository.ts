import type { FreightRepository } from "@/lib/api/freight-repository";
import {
  advanceQuoteStatus,
  initialQuoteAfterSubmit,
} from "@/features/freight/lib/status";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import { AuthError } from "@/types/auth";
import type {
  FreightMessage,
  FreightQuote,
  FreightRequest,
} from "@/types/freight";

const store = new Map<string, FreightRequest>();

function stamp() {
  return Date.now().toString().slice(-6);
}

function ensureMode(draft: FreightRequest["draft"]) {
  if (!draft.mode) throw new AuthError("incomplete_onboarding", "Mode required");
}

export const mockFreightRepository: FreightRepository = {
  async submit(draft) {
    return runWithMockLatency(() => {
      ensureMode(draft);
      const id = `fr_${stamp()}`;
      const now = new Date().toISOString();
      const quote = initialQuoteAfterSubmit(draft);
      const messages: FreightMessage[] = [
        {
          id: `msg_${stamp()}_0`,
          author: "ops",
          authorName: "Gönder Operasyon",
          body:
            quote.status === "needs_info"
              ? "Talebiniz alındı. Eksik bilgileri mesaj alanından tamamlayabilirsiniz."
              : "Talebiniz alındı. Operasyon ekibi incelemeye aldı.",
          createdAt: now,
        },
      ];
      const request: FreightRequest = {
        id,
        reference: `GNDF${stamp()}`,
        mode: draft.mode!,
        draft: { ...draft },
        quote,
        messages,
        createdAt: now,
        updatedAt: now,
      };
      store.set(id, request);
      return { request };
    }, 450);
  },

  async getRequest(id) {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Request not found");
      return { ...req, messages: [...req.messages] };
    }, 150);
  },

  async advanceStatus(id) {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Request not found");
      if (req.quote.status === "accepted") return req;
      const next = advanceQuoteStatus(req.quote.status, req.draft);
      // Preserve total when advancing from quote_ready to accepted
      let quote: FreightQuote = next;
      if (req.quote.status === "quote_ready" && next.status === "accepted") {
        quote = { ...next, total: req.quote.total };
      }
      const updated: FreightRequest = {
        ...req,
        quote,
        updatedAt: new Date().toISOString(),
        messages: [
          ...req.messages,
          {
            id: `msg_${stamp()}_adv`,
            author: "ops",
            authorName: "Gönder Operasyon",
            body: `Durum güncellendi: ${quote.status}`,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      store.set(id, updated);
      return updated;
    }, 400);
  },

  async requestRevision(id, note) {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Request not found");
      const updated: FreightRequest = {
        ...req,
        quote: {
          status: "revision_requested",
          total: req.quote.total,
          missingFields: [],
          processKey: "freight.process.revisionRequested",
          nextStepKey: "freight.next.revisionRequested",
        },
        updatedAt: new Date().toISOString(),
        messages: [
          ...req.messages,
          {
            id: `msg_${stamp()}_rev`,
            author: "customer",
            authorName: "Siz",
            body: note || "Teklif revizyonu talep edildi.",
            createdAt: new Date().toISOString(),
          },
        ],
      };
      store.set(id, updated);
      return updated;
    }, 350);
  },

  async acceptQuote(id) {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Request not found");
      if (req.quote.status !== "quote_ready") {
        throw new AuthError("unauthorized", "Quote not ready");
      }
      const updated: FreightRequest = {
        ...req,
        quote: {
          ...req.quote,
          status: "accepted",
          processKey: "freight.process.accepted",
          nextStepKey: "freight.next.accepted",
        },
        updatedAt: new Date().toISOString(),
        messages: [
          ...req.messages,
          {
            id: `msg_${stamp()}_acc`,
            author: "customer",
            authorName: "Siz",
            body: "Teklif kabul edildi.",
            createdAt: new Date().toISOString(),
          },
        ],
      };
      store.set(id, updated);
      return updated;
    }, 400);
  },

  async sendMessage(id, body, author = "customer") {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Request not found");
      const msg: FreightMessage = {
        id: `msg_${stamp()}_c`,
        author,
        authorName: author === "customer" ? "Siz" : "Gönder Operasyon",
        body,
        createdAt: new Date().toISOString(),
      };
      const updated = {
        ...req,
        messages: [...req.messages, msg],
        updatedAt: new Date().toISOString(),
      };
      // If needs_info and customer sent details, clear toward ops_reviewing
      if (
        author === "customer" &&
        req.quote.status === "needs_info" &&
        body.trim().length > 10
      ) {
        updated.quote = {
          status: "ops_reviewing",
          missingFields: [],
          processKey: "freight.process.opsReviewing",
          nextStepKey: "freight.next.opsReviewing",
        };
      }
      store.set(id, updated);
      return updated.messages;
    }, 250);
  },

  async replyAsOps(id, body) {
    return this.sendMessage(id, body, "ops");
  },
};
