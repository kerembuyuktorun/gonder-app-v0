import type {
  ListParams,
  QuoteRepository,
  ServiceRepository,
  ShipmentRepository,
} from "@/lib/api/repositories";
import {
  mockQuotes,
  mockServices,
  mockShipments,
} from "@/mocks/data/catalog";
import { paginate, withMockLatency } from "@/mocks/repositories/helpers";

export const mockServiceRepository: ServiceRepository = {
  async listServices() {
    return withMockLatency(mockServices);
  },
  async getServiceById(id) {
    return withMockLatency(mockServices.find((s) => s.id === id) ?? null);
  },
};

export const mockQuoteRepository: QuoteRepository = {
  async listQuotes(params: ListParams = {}) {
    const search = params.search?.toLowerCase().trim();
    const filtered = search
      ? mockQuotes.filter(
          (q) =>
            q.reference.toLowerCase().includes(search) ||
            q.originCity.toLowerCase().includes(search) ||
            q.destinationCity.toLowerCase().includes(search),
        )
      : mockQuotes;
    return withMockLatency(
      paginate(filtered, params.page ?? 1, params.pageSize ?? 10),
    );
  },
  async getQuoteById(id) {
    return withMockLatency(mockQuotes.find((q) => q.id === id) ?? null);
  },
};

export const mockShipmentRepository: ShipmentRepository = {
  async listShipments(params: ListParams = {}) {
    const search = params.search?.toLowerCase().trim();
    const filtered = search
      ? mockShipments.filter(
          (s) =>
            s.trackingNumber.toLowerCase().includes(search) ||
            s.originCity.toLowerCase().includes(search) ||
            s.destinationCity.toLowerCase().includes(search),
        )
      : mockShipments;
    return withMockLatency(
      paginate(filtered, params.page ?? 1, params.pageSize ?? 10),
    );
  },
  async getShipmentById(id) {
    return withMockLatency(mockShipments.find((s) => s.id === id) ?? null);
  },
};
