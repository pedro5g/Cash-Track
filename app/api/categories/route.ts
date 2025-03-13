import { GetCurrentUser } from "@/hooks/get-current-user";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";

import { redirect } from "next/navigation";
import { z } from "zod";

export type GetCategoriesResponseType = Awaited<
  ReturnType<typeof getCategories>
>;

async function getCategories(userId: string, type: TransactionType) {
  const data = await prisma.category.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return data;
}

export async function GET(request: Request) {
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const queryParams = z.enum(["expense", "income"]).safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const type = queryParams.data;

  const categories = await getCategories(user.userId, type);

  return Response.json(categories);
}
