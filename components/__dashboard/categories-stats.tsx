import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { dateToUTCDate, getFormatterCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SkeletonWrapper } from "../skeleton-wrapper";
import { CategoriesCard } from "./categories-card";
import { UserSettingsType } from "@/lib/types";

interface CategoriesStatsProps {
  userSettings: UserSettingsType;
  from: Date;
  to: Date;
}

async function getCategoriesStats(from: Date, to: Date) {
  return await fetch(
    `/api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
  ).then((res) => res.json());
}

export const CategoriesStats = ({
  userSettings,
  from,
  to,
}: CategoriesStatsProps) => {
  const { data, isLoading } = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () => getCategoriesStats(from, to),
  });

  // console.log("Response", data);

  const formatter = useMemo(() => {
    return getFormatterCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading}>
        <CategoriesCard formatter={formatter} type="income" data={data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};
