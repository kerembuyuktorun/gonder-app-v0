import type {
  Paginated,
  QuoteSummary,
  ServiceCatalogItem,
  ShipmentSummary,
} from "@/types/domain";

export type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export interface ServiceRepository {
  listServices(): Promise<ServiceCatalogItem[]>;
  getServiceById(id: string): Promise<ServiceCatalogItem | null>;
}

export interface QuoteRepository {
  listQuotes(params?: ListParams): Promise<Paginated<QuoteSummary>>;
  getQuoteById(id: string): Promise<QuoteSummary | null>;
}

export interface ShipmentRepository {
  listShipments(params?: ListParams): Promise<Paginated<ShipmentSummary>>;
  getShipmentById(id: string): Promise<ShipmentSummary | null>;
}
