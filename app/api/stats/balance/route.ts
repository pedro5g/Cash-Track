import prisma from "@/lib/prisma";
import { overviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;
async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const _from = searchParams.get("from");
  const _to = searchParams.get("to");

  const queryParams = overviewQuerySchema.safeParse({ from: _from, to: _to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }

  const { from, to } = queryParams.data;

  const stats = await getBalanceStats(user.id, from, to);

  return Response.json(stats);
}
