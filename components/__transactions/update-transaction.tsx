import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/app/(dashboard)/__actions/transactions";
import { toast } from "sonner";
import { dateToUTCDate } from "@/lib/utils";
import { CategoryPicker } from "../__dashboard/category-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTransactionSchemaType,
  createTransactionSchema,
} from "@/schema/transaction";
import { GetTransactionHistoryResponse } from "@/app/api/transactions-history/route";

interface UpdateTransactionProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  transaction: GetTransactionHistoryResponse[0];
}

export const UpdateTransaction = ({
  open,
  setOpen,
  transaction,
}: UpdateTransactionProps) => {
  const update = updateTransaction.bind(null, transaction.id);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: transaction.type as "income" | "expense",
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
    },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast.success("Transaction updated successfully 🎉", {
        id: "update-transaction",
      });

      queryClient.invalidateQueries({
        queryKey: ["transaction", "history"],
      });

      setOpen(!open);
    },
    onError: () => {
      toast.success("Something went wrong ", {
        id: "update-transaction",
      });
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const onSubmit = useCallback(
    (value: CreateTransactionSchemaType) => {
      toast.loading("Updating transaction...", {
        id: "update-transaction",
      });

      mutate({
        ...value,
        date: dateToUTCDate(value.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update your
            <span
              className={cn(
                "m-1",
                transaction.type === "income"
                  ? "text-emerald-500"
                  : "text-red-500"
              )}>
              {transaction.type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className=" flex items-center justify-between gap-1">
              <FormField
                control={form.control}
                name="category"
                render={() => (
                  <FormItem>
                    <div className=" flex flex-col space-y-2 item-start">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker
                          defaultValue={transaction.category}
                          type={transaction.type as "income" | "expense"}
                          onChange={handleCategoryChange}
                        />
                      </FormControl>
                    </div>

                    <FormDescription className=" text-xs tracking-tighter">
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className=" flex flex-col space-y-2 item-start">
                      <FormLabel>Transaction date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[12.5rem] pl-3 font-normal ",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="size-4 ml-auto" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              if (!value) return;
                              field.onChange(value);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <FormDescription className=" text-xs tracking-tighter">
                      Select a date for this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className=" gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Update"}
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
