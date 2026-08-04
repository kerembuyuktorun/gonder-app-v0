import type {
  QuoteRepository,
  ServiceRepository,
  ShipmentRepository,
} from "@/lib/api/repositories";
import {
  mockQuoteRepository,
  mockServiceRepository,
  mockShipmentRepository,
} from "@/mocks/repositories/mock-repositories";

/**
 * Switch DATA_SOURCE to "api" when real backends are ready.
 * Keep interfaces stable so feature code does not change.
 */
export type DataSource = "mock" | "api";

export const dataSource: DataSource =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as DataSource | undefined) ?? "mock";

function notImplemented(name: string): never {
  throw new Error(
    `API repository "${name}" is not implemented yet. Set NEXT_PUBLIC_DATA_SOURCE=mock.`,
  );
}

const apiServiceRepository: ServiceRepository = {
  listServices: () => notImplemented("ServiceRepository.listServices"),
  getServiceById: () => notImplemented("ServiceRepository.getServiceById"),
};

const apiQuoteRepository: QuoteRepository = {
  listQuotes: () => notImplemented("QuoteRepository.listQuotes"),
  getQuoteById: () => notImplemented("QuoteRepository.getQuoteById"),
};

const apiShipmentRepository: ShipmentRepository = {
  listShipments: () => notImplemented("ShipmentRepository.listShipments"),
  getShipmentById: () => notImplemented("ShipmentRepository.getShipmentById"),
};

export const serviceRepository: ServiceRepository =
  dataSource === "mock" ? mockServiceRepository : apiServiceRepository;

export const quoteRepository: QuoteRepository =
  dataSource === "mock" ? mockQuoteRepository : apiQuoteRepository;

export const shipmentRepository: ShipmentRepository =
  dataSource === "mock" ? mockShipmentRepository : apiShipmentRepository;
