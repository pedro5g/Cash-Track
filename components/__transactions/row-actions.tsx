"use client";
import { GetTransactionHistoryResponse } from "@/app/api/transactions-history/route";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ArrowDownUp, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { UpdateTransaction } from "./update-transaction";

interface RowActionsProps {
  transaction: GetTransactionHistoryResponse[0];
}

export const RowActions = ({ transaction }: RowActionsProps) => {
  const [open, setOpen] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);

  return (
    <>
      <DeleteTransactionDialog
        open={open}
        setOpen={setOpen}
        transactionId={transaction.id}
      />
      <UpdateTransaction
        open={openUpdateModel}
        setOpen={setOpenUpdateModel}
        transaction={transaction}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className=" p-4">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Separator />
          <DropdownMenuItem
            className=" w-full cursor-pointer inline-flex leading-none gap-2 text-muted-foreground"
            onSelect={() => {
              setOpen((prev) => !prev);
            }}>
            <Trash className="size-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" w-full cursor-pointer inline-flex leading-none gap-2 text-muted-foreground"
            onSelect={() => setOpenUpdateModel((prev) => !prev)}>
            <ArrowDownUp className="size-4" />
            Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
