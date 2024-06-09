"use server";

import prisma from "@/lib/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
  deleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCategory(form: CreateCategorySchemaType) {
  const parseBody = createCategorySchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error("Bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parseBody.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

export async function deleteCategory(form: DeleteCategorySchemaType) {
  const parseBody = deleteCategorySchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error("Bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, type } = parseBody.data;

  const category = await prisma.category.delete({
    where: {
      name_userId_type: {
        name,
        type,
        userId: user.id,
      },
    },
  });

  return category;
}
