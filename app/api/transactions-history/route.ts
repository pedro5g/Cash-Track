import prisma from "@/lib/prisma";
import { getFormatterCurrency } from "@/lib/utils";
import { overviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type GetTransactionHistoryResponse = Awaited<
  ReturnType<typeof getTransactionHistory>
>;
async function getTransactionHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formatter = getFormatterCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((transaction) => {
    return {
      ...transaction,
      formattedAmount: formatter.format(transaction.amount),
    };
  });
}

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const _from = searchParams.get("from");
  const _to = searchParams.get("to");
  const parse = overviewQuerySchema.safeParse({ from: _from, to: _to });

  if (!parse.success) {
    return Response.json(parse.error.message, { status: 400 });
  }

  const { from, to } = parse.data;

  try {
    const transactions = await getTransactionHistory(user.id, from, to);

    return Response.json(transactions);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(error.message, { status: 400 });
    }
  }
}
