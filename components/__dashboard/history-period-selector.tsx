"use client";

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import { Period, TimeFrame } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "../skeleton-wrapper";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { YearSelector } from "./year-selector";
import { MonthSelector } from "./month-selector";

interface HistoryPeriodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  timerFrame: TimeFrame;
  setTimerFrame: (timerFrame: TimeFrame) => void;
}

async function getPeriod() {
  return fetch("/api/history-periods").then((res) => res.json());
}

export const HistoryPeriodSelector = ({
  period,
  timerFrame,
  setPeriod,
  setTimerFrame,
}: HistoryPeriodSelectorProps) => {
  const { data, isLoading } = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "periods", "history"],
    queryFn: getPeriod,
  });

  return (
    <div className="flex  flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
        <Tabs
          value={timerFrame}
          onValueChange={(value) => setTimerFrame(value as TimeFrame)}>
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isLoading={isLoading}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={data || []}
          />
        </SkeletonWrapper>
        {timerFrame === "month" && (
          <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};
