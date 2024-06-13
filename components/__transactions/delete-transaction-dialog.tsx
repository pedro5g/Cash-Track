"use client";

import { deleteTransaction } from "@/app/(dashboard)/__actions/transactions";
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
  transactionId: string;
}

export const DeleteTransactionDialog = ({
  open,
  setOpen,
  transactionId,
}: DeleteTransactionDialogProps) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      toast.success(`Transaction deleted successfully`, {
        id: transactionId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
    },
    onError: () => {
      toast.error(`Something went wrong`, {
        id: transactionId,
      });
    },
  });

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
          <AlertDialogCancel>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading(`Deleting transaction...`, {
                id: transactionId,
              });
              mutate({ transactionId });
            }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
