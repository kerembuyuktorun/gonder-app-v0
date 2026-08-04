import { describe, expect, it } from "vitest";
import {
  createIdempotencyKey,
  fastestId,
  lowestPriceId,
  recommendedId,
  sortOffers,
} from "@/features/spot/lib/comparison";
import { buildPaymentBreakdown } from "@/types/payment";
import { createDefaultSpotDraft } from "@/mocks/data/spot";
import { mockSpotRepository } from "@/mocks/repositories/mock-spot-repository";
import { mockPaymentRepository } from "@/mocks/repositories/mock-payment-repository";

describe("spot comparison helpers", () => {
  it("sorts and flags lowest / fastest / recommended", async () => {
    const request = await mockSpotRepository.openRequest(
      createDefaultSpotDraft(),
    );
    const sorted = sortOffers(request.offers, "price_asc");
    expect(sorted[0].total.amount).toBeLessThanOrEqual(sorted[1].total.amount);
    expect(lowestPriceId(request.offers)).toBeTruthy();
    expect(fastestId(request.offers)).toBeTruthy();
    expect(recommendedId(request.offers)).toBeTruthy();
  });
});

describe("payment breakdown", () => {
  it("includes tax surcharges and deposit option", async () => {
    const request = await mockSpotRepository.openRequest(
      createDefaultSpotDraft(),
    );
    const offer = request.offers[0];
    const full = buildPaymentBreakdown(offer, "full", 10);
    expect(full.discount.amount).toBeGreaterThan(0);
    expect(full.totalDue.amount).toBe(
      offer.total.amount - full.discount.amount,
    );
    const deposit = buildPaymentBreakdown(offer, "deposit", 0);
    expect(deposit.depositAmount?.amount).toBe(
      Math.round(offer.total.amount * 0.3),
    );
  });
});

describe("mock spot + payment repositories", () => {
  it("opens spot request with suppliers and offers", async () => {
    const request = await mockSpotRepository.openRequest(
      createDefaultSpotDraft(),
    );
    expect(request.reference).toMatch(/^GNDS/);
    expect(request.suppliers.length).toBeGreaterThan(3);
    expect(request.offers.length).toBeGreaterThan(2);
    expect(request.suppliers.some((s) => s.status === "declined")).toBe(true);
  });

  it("sends counter-offer and selects for checkout", async () => {
    const request = await mockSpotRepository.openRequest(
      createDefaultSpotDraft(),
    );
    const offer = request.offers[0];
    const updated = await mockSpotRepository.sendCounterOffer({
      requestId: request.id,
      offerId: offer.id,
      amount: 20000,
      note: "Lütfen güncelleyin",
    });
    expect(updated.counterOfferSent).toBe(true);
    const selected = await mockSpotRepository.selectOffer(
      request.id,
      offer.id,
    );
    expect(selected.selectedOfferId).toBe(offer.id);
  });

  it("prevents duplicate charges via idempotency key", async () => {
    const request = await mockSpotRepository.openRequest(
      createDefaultSpotDraft(),
    );
    const offer = request.offers[0];
    await mockSpotRepository.selectOffer(request.id, offer.id);
    const invoice = await mockPaymentRepository.getDefaultInvoice();
    const key = createIdempotencyKey();
    const input = {
      idempotencyKey: key,
      requestId: request.id,
      offerId: offer.id,
      method: "saved_card" as const,
      timing: "full" as const,
      savedCardId: "card_visa_4242",
      invoice,
      contractAccepted: true,
      amount: offer.total,
    };
    const first = await mockPaymentRepository.checkout(input);
    const second = await mockPaymentRepository.checkout(input);
    expect(second.id).toBe(first.id);
    expect(first.status).toBe("succeeded");
  });

  it("supports 3ds confirm and uncertain poll without double pay", async () => {
    const request = await mockSpotRepository.openRequest(
      createDefaultSpotDraft(),
    );
    const offer = request.offers[0];
    const invoice = await mockPaymentRepository.getDefaultInvoice();

    const threeDs = await mockPaymentRepository.checkout({
      idempotencyKey: createIdempotencyKey(),
      requestId: request.id,
      offerId: offer.id,
      method: "new_card",
      timing: "full",
      invoice,
      contractAccepted: true,
      amount: offer.total,
      require3ds: true,
    });
    expect(threeDs.status).toBe("requires_3ds");
    const confirmed = await mockPaymentRepository.confirm3ds(threeDs.id);
    expect(confirmed.status).toBe("succeeded");

    const uncertain = await mockPaymentRepository.checkout({
      idempotencyKey: createIdempotencyKey(),
      requestId: request.id,
      offerId: offer.id,
      method: "saved_card",
      timing: "full",
      savedCardId: "card_visa_4242",
      invoice,
      contractAccepted: true,
      amount: offer.total,
      simulateOutcome: "uncertain",
    });
    expect(uncertain.status).toBe("uncertain");
    const polled = await mockPaymentRepository.getIntentStatus(uncertain.id);
    expect(polled.status).toBe("succeeded");
  });
});
