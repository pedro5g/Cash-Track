"use client";

import { TransactionType } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  createTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CategoryPicker } from "./category-picker";
import { useCallback, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/app/(dashboard)/__actions/transactions";
import { toast } from "sonner";
import { dateToUTCDate } from "@/lib/utils";
import { Dropzone } from "../dropzone";

import { handleFileUpload } from "@/lib/firebase";

interface CrateTransactionDialogProps {
  children: React.ReactNode;
  type: TransactionType;
}

export const CreateTransactionDialog = ({
  children,
  type,
}: CrateTransactionDialogProps) => {
  const [doc, setDoc] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type,
      description: "",
      date: new Date(),
      amount: 0,
    },
  });

  const handleFileChange = useCallback((value: File | null) => {
    setDoc(value);
    // console.log("file", value);
  }, []);

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully 🎉", {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
        doc: undefined,
      });
      setDoc(null);

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen((prev) => !prev);
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Something went wrong ", {
        id: "create-transaction",
      });
    },
  });

  const onSubmit = useCallback(
    async (value: CreateTransactionSchemaType) => {
      toast.loading("Creating a new transaction...", {
        id: "create-transaction",
      });
      let fileURL: string | null = null;
      let fileName: string | null = null;

      if (doc) {
        try {
          fileURL = await handleFileUpload(doc);
          fileName = doc.name;
        } catch (error) {
          toast.error("Failed to upload document.");
          return;
        }
      }

      mutate({
        ...value,
        doc: fileURL && fileName ? { fileName, filePath: fileURL } : undefined,
        date: dateToUTCDate(value.date),
      });
    },
    [doc, mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}>
              {type}
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
            <FormField
              control={form.control}
              name="doc"
              render={() => (
                <FormItem>
                  <FormLabel>Document</FormLabel>
                  <FormControl>
                    <Dropzone handleFileChange={handleFileChange} doc={doc} />
                  </FormControl>
                  <FormDescription>
                    Add some pdf for your transaction (optional)
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
                          type={type}
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
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
