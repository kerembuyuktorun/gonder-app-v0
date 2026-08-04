function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withMockLatency<T>(
  value: T,
  ms = 250,
): Promise<T> {
  await delay(ms);
  return value;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): { items: T[]; total: number; page: number; pageSize: number } {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}
