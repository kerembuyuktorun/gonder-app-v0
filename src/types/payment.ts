import type { Money } from "@/types/domain";
import type { SpotOffer } from "@/types/spot";

export type PaymentMethod =
  | "saved_card"
  | "new_card"
  | "wallet"
  | "net_terms";

export type PaymentTiming = "full" | "deposit";

export type PaymentOutcome = "succeeded" | "failed" | "uncertain";

export type PaymentStatus =
  | "idle"
  | "processing"
  | "requires_3ds"
  | "succeeded"
  | "failed"
  | "uncertain";

export type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export type InvoiceDetails = {
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  address: string;
  email: string;
};

export type PaymentCheckoutInput = {
  idempotencyKey: string;
  requestId: string;
  offerId: string;
  method: PaymentMethod;
  timing: PaymentTiming;
  savedCardId?: string;
  newCard?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  /** Mock: force 3DS challenge when true */
  require3ds?: boolean;
  /** Mock: simulate failure / uncertain */
  simulateOutcome?: PaymentOutcome;
  discountCode?: string;
  invoice: InvoiceDetails;
  contractAccepted: boolean;
  amount: Money;
};

export type PaymentIntent = {
  id: string;
  status: PaymentStatus;
  amount: Money;
  method: PaymentMethod;
  timing: PaymentTiming;
  discountApplied?: Money;
  threeDsUrl?: string;
  orderId?: string;
  failureReasonKey?: string;
  idempotencyKey: string;
  createdAt: string;
};

export type PaymentBreakdown = {
  subtotal: Money;
  tax: Money;
  surcharges: Money;
  discount: Money;
  depositAmount?: Money;
  totalDue: Money;
  netTermsEligible: boolean;
};

export function buildPaymentBreakdown(
  offer: SpotOffer,
  timing: PaymentTiming,
  discountPercent = 0,
): PaymentBreakdown {
  const discountAmount = Math.round(
    offer.total.amount * (discountPercent / 100),
  );
  const afterDiscount = offer.total.amount - discountAmount;
  const depositAmount =
    timing === "deposit" ? Math.round(afterDiscount * 0.3) : undefined;
  return {
    subtotal: offer.price,
    tax: offer.tax,
    surcharges: offer.surcharges,
    discount: { amount: discountAmount, currency: offer.total.currency },
    depositAmount: depositAmount
      ? { amount: depositAmount, currency: offer.total.currency }
      : undefined,
    totalDue: {
      amount: timing === "deposit" ? depositAmount! : afterDiscount,
      currency: offer.total.currency,
    },
    netTermsEligible: offer.performanceScore >= 4.2,
  };
}
