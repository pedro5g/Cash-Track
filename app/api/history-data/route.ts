import prisma from "@/lib/prisma";
import { historyDataSchema } from "@/schema/data";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";

export type GetHistoryDataResponse = Awaited<ReturnType<typeof getHistoryData>>;

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [{ month: "asc" }],
  });
  if (!result || result.length === 0) return [];

  const history = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      month: i,
      income: income,
      expense: expense,
      year: year,
    });
  }

  return history;
}
async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      month,
      year,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: [{ day: "asc" }],
  });

  if (!result || result.length === 0) return [];

  const history = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }

  return history;
}

async function getHistoryData(
  userId: string,
  timeFrame: "month" | "year",
  month: number,
  year: number
) {
  switch (timeFrame) {
    case "year":
      return await getYearHistoryData(userId, year);
    case "month":
      return await getMonthHistoryData(userId, year, month);
  }
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }

  const { searchParams } = new URL(request.url);

  const _timeFrame = searchParams.get("timeFrame");
  const _year = searchParams.get("year");
  const _month = searchParams.get("month");

  const params = historyDataSchema.safeParse({
    timeFrame: _timeFrame,
    month: _month,
    year: _year,
  });

  if (!params.success) {
    return Response.json(params.error.message, { status: 400 });
  }

  const { timeFrame, month, year } = params.data;

  const data = await getHistoryData(user.id, timeFrame, month, year);

  return Response.json(data);
}
