"use client";

import { deleteTransaction } from "@/app/(dashboard)/__actions/transactions";
import { GetTransactionHistoryResponse } from "@/app/api/transactions-history/route";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteTransactionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  transaction: GetTransactionHistoryResponse[0];
}

export const DeleteTransactionDialog = ({
  open,
  setOpen,
  transaction,
}: DeleteTransactionDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      toast.success(`Transaction deleted successfully`, {
        id: transaction.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
    },
    onError: () => {
      toast.error(`Something went wrong`, {
        id: transaction.id,
      });
    },
  });

  const handleDelete = async (
    transaction: GetTransactionHistoryResponse[0]
  ) => {
    toast.loading(`Deleting transaction...`, {
      id: transaction.id,
    });

    mutate({ transactionId: transaction.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            transaction
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(transaction)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
