"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { TransactionTable } from "@/components/__transactions/transaction-table";
import { toast } from "sonner";
import { useState } from "react";
import { OverviewType } from "@/schema/overview";

export default function Transactions() {
  const [dateRange, setDateRange] = useState<OverviewType>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="border-b bg-card">
        <div className=" container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Transactions history</p>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big: Max allow range is ${MAX_DATE_RANGE_DAYS}`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className=" container">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}
