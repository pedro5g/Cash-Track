"use client";

import { deleteCategory } from "@/app/(dashboard)/__actions/categories";
import { CategoryType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";

interface DeleteCategoryDialogProps {
  category: CategoryType;
  children: React.ReactNode;
}

export const DeleteCategoryDialog = ({
  category,
  children,
}: DeleteCategoryDialogProps) => {
  const categoryId = `${category.name}-${category.type}`;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      toast.success(`Category deleted successfully`, {
        id: categoryId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error(`Something went wrong`, {
        id: categoryId,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading(`Deleting category...`, {
                id: categoryId,
              });
              mutate({ name: category.name, type: category.type });
            }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
