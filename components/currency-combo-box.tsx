"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies, Currency } from "@/lib/currencies";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "./skeleton-wrapper";
import { User } from "@prisma/client";
import { updateUserCurrency } from "@/app/wizard/__actions/user-settings";
import { toast } from "sonner";

async function getUserSettings() {
  return fetch("/api/user-settings").then((res) => res.json());
}

export const CurrencyComboBox = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null);

  const { data, isLoading } = useQuery<User>({
    queryKey: ["userSettings"],
    queryFn: getUserSettings,
  });

  useEffect(() => {
    if (!data) return;
    const userCurrency = Currencies.find((currency) => {
      return currency.value === data.currency;
    });

    if (userCurrency) setSelectedOption(userCurrency);
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data: User) => {
      toast.success("Currency updated successfully 🎉", {
        id: "update-currency",
      });
      setSelectedOption(
        Currencies.find((currency) => {
          return currency.value === data.currency;
        }) || null
      );
    },
    onError: (error) => {
      toast.error("Something went wrong", {
        id: "update-currency",
      });
    },
  });

  const selectOption = useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }

      toast.loading("Update currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}>
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[12.5rem] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}>
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
};

const OptionList = ({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (option: Currency | null) => void;
}) => {
  return (
    <Command>
      <CommandInput placeholder="Filter option..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find(
                    (priority) =>
                      priority.value.toLowerCase() === value.toLowerCase()
                  ) || null
                );
                setOpen(false);
              }}>
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
