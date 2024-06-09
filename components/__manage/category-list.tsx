"use client";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "../skeleton-wrapper";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import { CreateCategoryDialog } from "../__dashboard/create-category-dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import { GetCategoriesResponseType } from "@/app/api/categories/route";
import { cn } from "@/lib/utils";
import { CategoryCard } from "./category-card";

interface CategoryListProps {
  type: TransactionType;
}

async function getCategories(type: TransactionType) {
  return await fetch(`/api/categories?type=${type}`).then((res) => res.json());
}

export const CategoryList = ({ type }: CategoryListProps) => {
  const { data, isLoading, refetch } = useQuery<GetCategoriesResponseType>({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
  });

  const dataAvailable = data && data.length > 0;

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center justify-between gap-2">
            <div className=" flex items-center gap-4">
              {type === "expense" ? (
                <TrendingDown className="size-12 rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="size-12 rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}

              <span>
                {type === "income" ? "Incomes" : "Expenses"} categories
                <p className="text-sm text-muted-foreground">Sorted by name</p>
              </span>
            </div>
            <CreateCategoryDialog
              type={type}
              onSuccessCallback={() => refetch()}
              trigger={
                <Button className="gap-2 text-sm" variant="ghost">
                  <PlusSquare className="size-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-between">
            <p>
              No
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}>
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-card-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((category, i) => (
              <CategoryCard category={category} key={category.name + i} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};
