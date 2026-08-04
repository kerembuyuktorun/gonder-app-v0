import type { SpotRepository } from "@/lib/api/spot-repository";
import {
  buildInvitedSuppliers,
  buildMockOffers,
} from "@/mocks/data/spot";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import { AuthError } from "@/types/auth";
import type { SpotOffer, SpotRequest } from "@/types/spot";

const store = new Map<string, SpotRequest>();

function stamp() {
  return Date.now().toString().slice(-6);
}

export const mockSpotRepository: SpotRepository = {
  async openRequest(draft) {
    return runWithMockLatency(() => {
      const id = `spot_${stamp()}`;
      const request: SpotRequest = {
        id,
        reference: `GNDS${stamp()}`,
        draft: { ...draft },
        suppliers: buildInvitedSuppliers(),
        offers: buildMockOffers(id),
        selectedOfferId: null,
        status: "open",
        createdAt: new Date().toISOString(),
      };
      store.set(id, request);
      return request;
    }, 400);
  },

  async getRequest(id) {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Spot request not found");
      return structuredClone(req);
    }, 120);
  },

  async refreshOffers(id) {
    return runWithMockLatency(() => {
      const req = store.get(id);
      if (!req) throw new AuthError("unauthorized", "Spot request not found");
      // Promote waiting → quoted for demo
      const suppliers = req.suppliers.map((s) =>
        s.status === "waiting"
          ? { ...s, status: "quoted" as const }
          : s,
      );
      let offers = req.offers;
      if (!offers.some((o) => o.supplierId === "sup_marmara")) {
        offers = [
          ...offers,
          {
            id: `${id}_offer_late`,
            supplierId: "sup_marmara",
            supplierName: "Marmara Express",
            serviceKind: "xl",
            vehicleFit: "Özel ekipman",
            price: { amount: 21000, currency: "TRY" },
            tax: { amount: 4200, currency: "TRY" },
            surcharges: { amount: 800, currency: "TRY" },
            total: { amount: 26000, currency: "TRY" },
            etaDaysMin: 2,
            etaDaysMax: 4,
            insuranceCoverage: "600.000 TRY",
            paymentTerms: "Peşin",
            validUntil: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            performanceScore: 4.3,
            completedShipments: 120,
            opsNotes: "Geç gelen teklif",
          },
        ];
      }
      const updated = {
        ...req,
        suppliers,
        offers,
        status: "comparing" as const,
      };
      store.set(id, updated);
      return structuredClone(updated);
    }, 350);
  },

  async sendCounterOffer({ requestId, offerId, amount, note }) {
    return runWithMockLatency(() => {
      const req = store.get(requestId);
      if (!req) throw new AuthError("unauthorized", "Spot request not found");
      const offer = req.offers.find((o) => o.id === offerId);
      if (!offer) throw new AuthError("unauthorized", "Offer not found");
      const updatedOffer: SpotOffer = {
        ...offer,
        counterOfferSent: true,
        counterOfferAmount: { amount, currency: offer.total.currency },
        opsNotes: `${offer.opsNotes} · Karşı teklif: ${amount} TRY${note ? ` — ${note}` : ""}`,
      };
      req.offers = req.offers.map((o) => (o.id === offerId ? updatedOffer : o));
      store.set(requestId, req);
      return structuredClone(updatedOffer);
    }, 300);
  },

  async selectOffer(requestId, offerId) {
    return runWithMockLatency(() => {
      const req = store.get(requestId);
      if (!req) throw new AuthError("unauthorized", "Spot request not found");
      if (!req.offers.some((o) => o.id === offerId)) {
        throw new AuthError("unauthorized", "Offer not found");
      }
      const updated = {
        ...req,
        selectedOfferId: offerId,
        status: "comparing" as const,
      };
      store.set(requestId, updated);
      return structuredClone(updated);
    }, 150);
  },

  async markAccepted(requestId, offerId) {
    return runWithMockLatency(() => {
      const req = store.get(requestId);
      if (!req) throw new AuthError("unauthorized", "Spot request not found");
      if (req.selectedOfferId !== offerId) {
        throw new AuthError("unauthorized", "Offer not selected");
      }
      const updated = {
        ...req,
        status: "accepted" as const,
      };
      store.set(requestId, updated);
      return structuredClone(updated);
    }, 200);
  },
};
