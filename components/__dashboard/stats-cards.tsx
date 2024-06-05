"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { dateToUTCDate, getFormatterCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SkeletonWrapper } from "../skeleton-wrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { StatsCard } from "./stats-card";
import { UserSettingsType } from "@/lib/types";

interface StatsCardsProps {
  userSettings: UserSettingsType;
  from: Date;
  to: Date;
}

async function getBalanceStats(from: Date, to: Date) {
  return await fetch(
    `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
  ).then((res) => res.json());
}

export const StatsCards = ({ userSettings, from, to }: StatsCardsProps) => {
  const { data, isLoading } = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => getBalanceStats(from, to),
  });

  const formatter = useMemo(() => {
    return getFormatterCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = data?.income || 0;
  const expense = data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading}>
        <StatsCard
          formatter={formatter}
          value={income}
          title="income"
          icon={
            <TrendingUp
              className="size-12 items-center rounded-lg 
                p-2 text-emerald-500 bg-emerald-400/10"
            />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <StatsCard
          formatter={formatter}
          value={expense}
          title="expense"
          icon={
            <TrendingDown
              className="size-12 items-center rounded-lg 
                p-2 text-red-500 bg-red-400/10"
            />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <StatsCard
          formatter={formatter}
          value={balance}
          title="balance"
          icon={
            <Wallet
              className="size-12 items-center rounded-lg 
                p-2 text-blue-500 bg-blue-400/10"
            />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};
