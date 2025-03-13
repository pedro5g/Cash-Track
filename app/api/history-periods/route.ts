import { GetCurrentUser } from "@/hooks/get-current-user";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [{ year: "asc" }],
  });

  const years = result.map((item) => item.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
}

export async function GET(request: Request) {
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.userId);

  return Response.json(periods);
}
