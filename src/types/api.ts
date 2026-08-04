import type {
  QuoteSummary,
  ServiceCatalogItem,
  ShipmentSummary,
} from "@/types/domain";

/** API DTO shapes — may differ from domain models over time */

export type ServiceCatalogDto = ServiceCatalogItem;

export type QuoteSummaryDto = QuoteSummary;

export type ShipmentSummaryDto = ShipmentSummary;

export type ApiErrorDto = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};

export type ApiListResponseDto<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};
