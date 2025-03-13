"use client";
import { differenceInDays } from "date-fns";
import { DateRangePicker } from "../ui/date-range-picker";
import { toast } from "sonner";
import { StatsCards } from "./stats-cards";
import { CategoriesStats } from "./categories-stats";
import { MAX_DATE_RANGE_DAYS } from "@/constants";
import { UserSettingsType } from "@/lib/types";
import { useDateQuery } from "@/hooks/use-date-query";

interface OverviewProps {
  userSettings: UserSettingsType;
}

export const Overview = ({ userSettings }: OverviewProps) => {
  const { date, setDate } = useDateQuery();

  return (
    <>
      <div className=" container flex flex-wrap items-center justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={date.from}
            initialDateTo={date.to}
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
              setDate(from, to);
            }}
          />
        </div>
      </div>
      <div className=" container flex w-full flex-col gap-2">
        <StatsCards userSettings={userSettings} from={date.from} to={date.to} />
        <CategoriesStats
          userSettings={userSettings}
          from={date.from}
          to={date.to}
        />
      </div>
    </>
  );
};
