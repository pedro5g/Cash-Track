import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { TransactionType } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";

interface CategoriesCardProps {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
}

export const CategoriesCard = ({
  formatter,
  type,
  data,
}: CategoriesCardProps) => {
  const filteredData = data.filter((el) => el.type === type);

  const total = data.reduce((acc, element) => {
    return acc + (element._sum?.amount || 0);
  }, 0);

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle
          className="capitalize grid grid-flow-row justify-between gap-2
        text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>
      <div className=" flex items-center justify-between gap-2">
        {!filteredData.length && (
          <div className=" flex h-60 w-full flex-col items-center justify-center">
            <span>No data for the selected period </span>
            <p className="text-sm text-muted-foreground">
              Try a different period or try adding new{" "}
              {type === "income" ? "Incomes" : "Expenses"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className=" flex w-full flex-col gap-4 p-4">
              {filteredData.map((item, i) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.type + i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400 capitalize">
                        {item.categoryIcon} {item.category}{" "}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-100">
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500 "
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};
