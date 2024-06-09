import { CategoryType } from "@/lib/types";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { DeleteCategoryDialog } from "./delete-category-dialog";

interface CategoryCardProps {
  category: CategoryType;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div
      className=" flex flex-col justify-between rounded-md shadow-sm border-separate
  shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl">{category.icon}</span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog category={category}>
        <Button
          className=" group flex w-full border-separate items-center gap-2 
      rounded-t-none text-muted-foreground hover:text-red-500 "
          variant="secondary">
          <TrashIcon className="size-4" />
          Remove
        </Button>
      </DeleteCategoryDialog>
    </div>
  );
};
