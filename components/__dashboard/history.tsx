"use client";

import { Period, TimeFrame, UserSettingsType } from "@/lib/types";
import { getFormatterCurrency } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { HistoryPeriodSelector } from "./history-period-selector";
import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "../skeleton-wrapper";
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "./custom-tooltip";

import { GetHistoryDataResponse } from "@/app/api/history-data/route";

interface HistoryProps {
  userSettings: UserSettingsType;
}

async function getHistory(timeFreme: TimeFrame, month: string, year: string) {
  return await fetch(
    `/api/history-data?timeFrame=${timeFreme}&month=${month}&year=${year}`
  ).then((res) => res.json());
}

export const History = ({ userSettings }: HistoryProps) => {
  const [timeFrame, setTimeFrama] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return getFormatterCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const { data, isLoading } = useQuery<GetHistoryDataResponse>({
    queryKey: ["overview", "history", timeFrame, period],
    queryFn: () =>
      getHistory(timeFrame, period.month.toString(), period.year.toString()),
  });

  return (
    <div className="container">
      <h2 className="mt-12 text-2xl font-bold">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className=" grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              timerFrame={timeFrame}
              setPeriod={setPeriod}
              setTimerFrame={setTimeFrama}
            />
            <div className=" flex h-10 gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={isLoading}>
            {data && (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart height={300} data={data} barCategoryGap={5}>
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset={"0"}
                        stopColor="#10b981"
                        stopOpacity={"1"}
                      />
                      <stop
                        offset={"1"}
                        stopColor="#10b981"
                        stopOpacity={"0"}
                      />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset={"0"}
                        stopColor="#ef4444"
                        stopOpacity={"1"}
                      />
                      <stop
                        offset={"1"}
                        stopColor="#ef4444"
                        stopOpacity={"0"}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity="0.2"
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeFrame === "year") {
                        return date.toLocaleString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleString("default", {
                        month: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={"income"}
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={"expense"}
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => {
                      const { payload, active } = props;
                      return (
                        <CustomTooltip
                          formatter={formatter}
                          payload={payload}
                          active={active}
                        />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!data && (
              <Card className="flex h-[18.75rem] flex-col items-center justify-center bg-background">
                No data for the selected period
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};
