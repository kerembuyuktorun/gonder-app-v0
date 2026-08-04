import type { ParcelRepository } from "@/lib/api/parcel-repository";
import { summarizeDesi } from "@/features/parcel/lib/desi";
import { buildCarrierOffers } from "@/features/parcel/lib/quoting";
import {
  INTEGRATION_ORDERS,
  MOCK_WALLET_BALANCE,
  PARCEL_TEMPLATES,
  PREVIOUS_SHIPMENTS,
  createDefaultParcelDraft,
} from "@/mocks/data/parcel";
import { runWithMockLatency } from "@/mocks/repositories/helpers";
import { AuthError } from "@/types/auth";
import type { ParcelLabel, ParcelShipmentDraft } from "@/types/parcel";

function buildLabel(
  carrierId: string,
  carrierNameKey: string,
  trackingNumber: string,
  draft: ParcelShipmentDraft,
): ParcelLabel {
  return {
    trackingNumber,
    barcode: trackingNumber.replace(/\D/g, "").padStart(16, "0").slice(0, 16),
    carrierId: carrierId as ParcelLabel["carrierId"],
    carrierNameKey,
    createdAt: new Date().toISOString(),
    labelHtmlPreview: [
      trackingNumber,
      draft.recipient.name,
      `${draft.delivery.city} / ${draft.delivery.district}`,
      draft.delivery.line1,
    ].join(" · "),
  };
}

export const mockParcelRepository: ParcelRepository = {
  async listTemplates() {
    return runWithMockLatency(() => PARCEL_TEMPLATES, 150);
  },

  async listPreviousShipments() {
    return runWithMockLatency(() => PREVIOUS_SHIPMENTS, 150);
  },

  async listIntegrationOrders() {
    return runWithMockLatency(() => INTEGRATION_ORDERS, 180);
  },

  async getWalletBalance() {
    return runWithMockLatency(() => ({ ...MOCK_WALLET_BALANCE }), 100);
  },

  async parseExcelUpload(fileName) {
    return runWithMockLatency(() => {
      const draft = createDefaultParcelDraft();
      draft.method = "excel_bulk";
      draft.excelFileName = fileName;
      draft.contentDescription = `Excel toplu yükleme · ${fileName}`;
      draft.packages = [
        {
          id: "pkg_xls_1",
          lengthCm: 40,
          widthCm: 30,
          heightCm: 25,
          weightKg: 5,
        },
        {
          id: "pkg_xls_2",
          lengthCm: 30,
          widthCm: 20,
          heightCm: 15,
          weightKg: 2,
        },
      ];
      return draft;
    }, 400);
  },

  async getQuotes(draft) {
    return runWithMockLatency(() => {
      const desi = summarizeDesi(draft.packages);
      if (desi.suggestGonderXl) {
        return { desi, offers: [], suggestGonderXl: true };
      }
      return {
        desi,
        offers: buildCarrierOffers(draft, desi),
        suggestGonderXl: false,
      };
    }, 450);
  },

  async checkout({ draft, offerId, paymentMethod }) {
    return runWithMockLatency(() => {
      const desi = summarizeDesi(draft.packages);
      if (desi.suggestGonderXl) {
        throw new AuthError("unauthorized", "Desi exceeds parcel limit");
      }
      if (!draft.recipient.name || !draft.recipient.phone) {
        throw new AuthError("incomplete_onboarding", "Recipient required");
      }
      const offers = buildCarrierOffers(draft, desi);
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) {
        throw new AuthError("unauthorized", "Offer not found");
      }
      if (
        paymentMethod === "balance" &&
        offer.total.amount > MOCK_WALLET_BALANCE.amount
      ) {
        throw new AuthError("unauthorized", "Insufficient balance");
      }
      const stamp = Date.now().toString().slice(-7);
      const trackingNumber = `GNDP${stamp}`;
      return {
        orderId: `ord_parcel_${stamp}`,
        trackingNumber,
        paidWith: paymentMethod,
        total: offer.total,
        offer,
        label: buildLabel(
          offer.carrierId,
          offer.carrierNameKey,
          trackingNumber,
          draft,
        ),
      };
    }, 600);
  },
};
