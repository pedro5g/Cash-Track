import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
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
  const user = await currentUser();

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

  const categories = await getCategories(user.id, type);

  return Response.json(categories);
}
