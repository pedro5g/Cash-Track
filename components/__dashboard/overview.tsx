"use client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRangePicker } from "../ui/date-range-picker";
import { toast } from "sonner";
import { OverviewType } from "@/schema/overview";
import { StatsCards } from "./stats-cards";
import { CategoriesStats } from "./categories-stats";
import { MAX_DATE_RANGE_DAYS } from "@/constants";
import { UserSettingsType } from "@/lib/types";

interface OverviewProps {
  userSettings: UserSettingsType;
}

export const Overview = ({ userSettings }: OverviewProps) => {
  const [dateRange, setDateRange] = useState<OverviewType>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className=" container flex flex-wrap items-center justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
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
      <div className=" container flex w-full flex-col gap-2">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
};
