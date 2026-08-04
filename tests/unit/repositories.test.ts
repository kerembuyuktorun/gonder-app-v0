import { describe, expect, it } from "vitest";
import { mockServiceRepository } from "@/mocks/repositories/mock-repositories";
import { dataSource, serviceRepository } from "@/lib/api/client";

describe("mock repositories", () => {
  it("lists service catalog items", async () => {
    const services = await mockServiceRepository.listServices();
    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty("type");
  });

  it("uses mock data source by default", () => {
    expect(dataSource).toBe("mock");
    expect(serviceRepository).toBeDefined();
  });
});
