import type {
  InvoiceDetails,
  PaymentCheckoutInput,
  PaymentIntent,
  SavedCard,
} from "@/types/payment";
import type { Money } from "@/types/domain";

export interface PaymentRepository {
  listSavedCards(): Promise<SavedCard[]>;
  getWalletBalance(): Promise<Money>;
  validateDiscount(code: string): Promise<{ percent: number; label: string } | null>;
  getDefaultInvoice(): Promise<InvoiceDetails>;
  checkout(input: PaymentCheckoutInput): Promise<PaymentIntent>;
  /** Complete 3DS challenge */
  confirm3ds(intentId: string): Promise<PaymentIntent>;
  /** Poll when status is uncertain — never double-charge */
  getIntentStatus(intentId: string): Promise<PaymentIntent>;
}
