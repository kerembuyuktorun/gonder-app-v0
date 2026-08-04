"use client";

import * as React from "react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
};

export type DataTableProps<T extends { id: string }> = {
  data: T[];
  columns: DataTableColumn<T>[];
  className?: string;
  emptyMessage?: string;
};

type RowShape = { id: string; cells: React.ReactNode[] };

const features = tableFeatures({});
const helper = createColumnHelper<typeof features, RowShape>();

export function DataTable<T extends { id: string }>({
  data,
  columns,
  className,
  emptyMessage,
}: DataTableProps<T>) {
  const t = useTranslations("table");
  const mapped = React.useMemo<RowShape[]>(
    () =>
      data.map((row) => ({
        id: row.id,
        cells: columns.map((col) => col.accessor(row)),
      })),
    [columns, data],
  );

  const tableColumns = React.useMemo(
    () =>
      helper.columns(
        columns.map((col, index) =>
          helper.display({
            id: col.id,
            header: col.header,
            cell: ({ row }) => row.original.cells[index],
          }),
        ),
      ),
    [columns],
  );

  const table = useTable({
    features,
    columns: tableColumns,
    data: mapped,
    getRowId: (row) => row.id,
  });

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage ?? t("noResults")}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border bg-card",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="border-b border-border bg-muted/60">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground",
                    columns[index]?.className,
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border last:border-0 hover:bg-accent/40"
            >
              {row.getAllCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={cn("px-4 py-3 align-middle", columns[index]?.className)}
                >
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
