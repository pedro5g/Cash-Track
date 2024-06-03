import { CategoryType } from "@/lib/types";

interface CategoryRowProps {
  category: CategoryType;
}

export const CategoryRow = ({ category }: CategoryRowProps) => {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category?.icon}</span>
      <span>{category?.name}</span>
    </div>
  );
};
