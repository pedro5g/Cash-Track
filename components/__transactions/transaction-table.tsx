"use client";

import { GetTransactionHistoryResponse } from "@/app/api/transactions-history/route";
import { cn, dateToUTCDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { ColumnHeader } from "./column-header";
import { useMemo, useState } from "react";
import { FacetedFilter } from "./faceted-filter";
import { ColumnToggle } from "./column-toggle";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { DownloadIcon } from "lucide-react";
import { RowActions } from "./row-actions";
import { Button } from "../ui/button";

interface TransactionTableProps {
  from: Date;
  to: Date;
}

async function getTransactionHistory(from: Date, to: Date) {
  return await fetch(
    `/api/transactions-history?from=${dateToUTCDate(from)}&to=${dateToUTCDate(
      to
    )}`
  ).then((res) => res.json());
}

type TransactionHistoryRow = GetTransactionHistoryResponse[0];
const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => <ColumnHeader column={column} title="Category" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryIcon}
        <div className="capitalize">{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.description}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <ColumnHeader column={column} title="Type" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "capitalize rounded-full text-center p-1 ",
          row.original.type === "income"
            ? "text-emerald-500 bg-emerald-500/10"
            : "text-red-500 bg-red-500/10"
        )}>
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => (
      <p className=" text-md text-center rounded-full bg-gray-400/10 p-1 font-medium">
        {row.original.formattedAmount}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original} />,
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export const TransactionTable = ({ from, to }: TransactionTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnsFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useQuery<GetTransactionHistoryResponse>({
    queryKey: ["transaction", "history", from, to],
    queryFn: () => getTransactionHistory(from, to),
  });

  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: data || [],
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnsFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    data?.forEach((transaction) => {
      categoriesMap.set(transaction.category, {
        value: transaction.category,
        label: `${transaction.categoryIcon} ${transaction.category}`,
      });
    });

    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
  }, [data]);

  return (
    <div className=" w-full">
      <div className=" flex flex-wrap items-end justify-between gap-2 py-4">
        <div className=" flex gap-2 ">
          {table.getColumn("category") && (
            <FacetedFilter
              title="Category"
              column={table.getColumn("category")}
              options={categoriesOptions}
            />
          )}
          {table.getColumn("type") && (
            <FacetedFilter
              title="Type"
              column={table.getColumn("type")}
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
            />
          )}
        </div>
        <div className=" flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto lg:flex"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => {
                return {
                  category: row.original.category,
                  categoryIcon: row.original.categoryIcon,
                  description: row.original.description,
                  type: row.original.type,
                  amount: row.original.amount,
                  formattedAmount: row.original.formattedAmount,
                  date: row.original.date,
                };
              });
              handleExportCSV(data);
            }}>
            <DownloadIcon className="mr-2 size-4" />
            Export CSV
          </Button>
          <ColumnToggle table={table} />
        </div>
      </div>
      <SkeletonWrapper isLoading={isLoading}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
};
