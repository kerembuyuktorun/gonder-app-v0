import { describe, expect, it } from "vitest";
import {
  estimateCourierQuote,
  haversineKm,
  isMotoSuitable,
  validateCourierDraft,
} from "@/features/courier/lib/pricing";
import { createDefaultCourierDraft } from "@/mocks/data/courier";
import { mockCourierRepository } from "@/mocks/repositories/mock-courier-repository";

describe("courier pricing & validation", () => {
  it("marks Kadıköy → Maslak as adjacent zone", () => {
    const draft = createDefaultCourierDraft();
    const result = validateCourierDraft(draft);
    expect(result.zoneStatus).toBe("adjacent_zone");
    expect(result.messages.some((m) => m.id === "adjacent-zone")).toBe(true);
  });

  it("suggests van when moto is unsuitable for heavy packages", () => {
    const draft = createDefaultCourierDraft();
    draft.vehicleType = "moto";
    draft.package = {
      ...draft.package,
      type: "large_box",
      weightKg: 35,
      lengthCm: 80,
      widthCm: 60,
      heightCm: 50,
    };
    expect(isMotoSuitable(draft)).toBe(false);
    const result = validateCourierDraft(draft);
    expect(result.suggestedVehicle).toBe("van");
    expect(result.messages.some((m) => m.id === "moto-unsuitable")).toBe(true);
  });

  it("includes multi-stop info when stops are present", () => {
    const draft = createDefaultCourierDraft();
    draft.stops = [
      {
        id: "s1",
        label: "Ofis",
        addressLine: "Levent",
        district: "Beşiktaş",
        city: "İstanbul",
        contactName: "Ali",
        phone: "+905551110000",
      },
    ];
    const result = validateCourierDraft(draft);
    expect(result.messages.some((m) => m.id === "multi-stop")).toBe(true);
  });

  it("estimates a ready quote with base and extras", () => {
    const draft = createDefaultCourierDraft();
    draft.recipient = { name: "Can", phone: "+905559998877" };
    draft.extras = ["signature", "sms_notify"];
    const validation = validateCourierDraft(draft);
    const quote = estimateCourierQuote(draft, validation);
    expect(quote.status).toBe("ready");
    expect(quote.lines.length).toBeGreaterThanOrEqual(2);
    expect(quote.total.amount).toBeGreaterThan(0);
    expect(quote.etaMinutes).toBeDefined();
  });

  it("returns preparing when pickup date is missing", () => {
    const draft = createDefaultCourierDraft();
    draft.recipient = { name: "Can", phone: "+905559998877" };
    draft.schedule.pickupDate = "";
    const validation = validateCourierDraft(draft);
    const quote = estimateCourierQuote(draft, validation);
    expect(quote.status).toBe("preparing");
  });

  it("computes haversine distance for Istanbul points", () => {
    const draft = createDefaultCourierDraft();
    const km = haversineKm(draft.pickup, draft.delivery);
    expect(km).toBeGreaterThan(5);
    expect(km).toBeLessThan(40);
  });
});

describe("mock courier repository", () => {
  it("returns quote with validation", async () => {
    const draft = createDefaultCourierDraft();
    draft.recipient = { name: "Zeynep", phone: "+905551234567" };
    const result = await mockCourierRepository.getQuote(draft);
    expect(result.validation.zoneStatus).toBe("adjacent_zone");
    expect(["ready", "preparing", "unavailable"]).toContain(result.quote.status);
  });

  it("submits a valid draft and returns tracking", async () => {
    const draft = createDefaultCourierDraft();
    draft.recipient = { name: "Zeynep", phone: "+905551234567" };
    const result = await mockCourierRepository.submit(draft);
    expect(result.requestId).toMatch(/^req_courier_/);
    expect(result.trackingNumber).toMatch(/^GNDC/);
  });

  it("rejects submit without recipient", async () => {
    const draft = createDefaultCourierDraft();
    await expect(mockCourierRepository.submit(draft)).rejects.toThrow();
  });
});
