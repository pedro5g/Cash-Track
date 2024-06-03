"use client";
import { CategoryType, TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CategoryRow } from "./category-row";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CreateCategoryDialog } from "./create-category-dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryPickerProps {
  type: TransactionType;
  onChange: (value: string) => void;
}

async function getCategories(type: TransactionType) {
  return await fetch(`/api/categories?type=${type}`).then((res) => res.json());
}

export const CategoryPicker = ({ type, onChange }: CategoryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { data } = useQuery<CategoryType[]>({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
  });

  const selectedCategory = data?.find((category) => category.name === value);

  const successCallback = useCallback((category: CategoryType) => {
    setValue(category.name);
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-[12.5rem]  "
          variant="outline"
          role="combobox"
          aria-expanded={open}>
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Selected category"
          )}
          <ChevronsUpDown className=" ml-auto size-4 shrink-0 opacity-80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[12.5rem] p-0">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog
            type={type}
            onSuccessCallback={successCallback}
          />
          <CommandEmpty>
            <strong>Category not found</strong>
            <p className=" text-sm text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {data &&
                data.map((category, i) => (
                  <CommandItem
                    key={category.name + i}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}>
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "ml-2 size-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
