"use server";

import { handleDeleteFile } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import {
  createTransactionSchema,
  CreateTransactionSchemaType,
  deleteTransactionSchema,
  DeleteTransactionSchemaType,
} from "@/schema/transaction";
import { GetCurrentUser } from "@/hooks/get-current-user";
import { redirect } from "next/navigation";

export async function createTransaction(form: CreateTransactionSchemaType) {
  const parseBody = createTransactionSchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error(parseBody.error.message);
  }

  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, type, description, doc } = parseBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.userId,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error(`The category: ${category} it's not registered.`);
  }
  try {
    await prisma.$transaction([
      // Start prisma $transaction to create a user transaction
      prisma.transaction.create({
        data: {
          userId: user.userId,
          amount,
          date,
          description: description ?? "",
          type,
          category: categoryRow.name,
          categoryIcon: categoryRow.icon,
          fileName: doc?.fileName,
          filePath: doc?.filePath,
        },
      }),
      // then update moth aggregate table
      prisma.monthHistory.upsert({
        where: {
          day_month_year_userId: {
            userId: user.userId,
            day: date.getUTCDate(),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
          },
        },
        create: {
          userId: user.userId,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          expense: type === "expense" ? amount : 0,
          income: type === "income" ? amount : 0,
        },
        update: {
          expense: {
            increment: type === "expense" ? amount : 0,
          },
          income: {
            increment: type === "income" ? amount : 0,
          },
        },
      }),
      // end update year aggregate table
      prisma.yearHistory.upsert({
        where: {
          month_year_userId: {
            userId: user.userId,
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
          },
        },
        create: {
          userId: user.userId,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          expense: type === "expense" ? amount : 0,
          income: type === "income" ? amount : 0,
        },
        update: {
          expense: {
            increment: type === "expense" ? amount : 0,
          },
          income: {
            increment: type === "income" ? amount : 0,
          },
        },
      }),
    ]);
  } catch (error) {
    if (doc?.filePath) {
      await handleDeleteFile(doc.filePath);
      // console.log("File deleted to success !");
    }
    throw new Error(`Something went wrong to create transaction`);
  }
}

export async function updateTransaction(
  transactionId: string,
  form: CreateTransactionSchemaType
) {
  const parseBody = createTransactionSchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error(parseBody.error.message);
  }
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, type, description } = parseBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.userId,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error(`The category: ${category} it's not registered.`);
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.userId,
      id: transactionId,
    },
  });

  if (!transaction) {
    throw new Error("Bad request");
  }

  const difference = amount - transaction.amount;

  await prisma.$transaction([
    prisma.transaction.update({
      where: {
        id: transactionId,
        userId: user.userId,
      },
      data: {
        amount,
        description: description ?? "",
        type,
        date,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.userId,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense:
            difference < 0
              ? {
                  decrement: -difference, // (-) converts difference to positive number
                }
              : {
                  increment: difference,
                },
        }),
        ...(transaction.type === "income" && {
          income:
            difference < 0
              ? {
                  decrement: -difference,
                }
              : {
                  increment: difference,
                },
        }),
      },
    }),
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.userId,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense:
            difference < 0
              ? {
                  decrement: -difference,
                }
              : {
                  increment: difference,
                },
        }),
        ...(transaction.type === "income" && {
          income:
            difference < 0
              ? {
                  decrement: -difference,
                }
              : {
                  increment: difference,
                },
        }),
      },
    }),
  ]);
}

export async function deleteTransaction(form: DeleteTransactionSchemaType) {
  const parse = deleteTransactionSchema.safeParse(form);
  if (!parse.success) {
    throw new Error(parse.error.message);
  }
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const id = parse.data.transactionId;

  const transaction = await prisma.transaction.findFirst({
    where: {
      userId: user.userId,
      id,
    },
  });

  if (!transaction) {
    throw new Error("Bad request");
  }

  try {
    await prisma.$transaction([
      prisma.transaction.delete({
        where: {
          id,
          userId: user.userId,
        },
      }),
      prisma.monthHistory.update({
        where: {
          day_month_year_userId: {
            userId: user.userId,
            day: transaction.date.getUTCDate(),
            month: transaction.date.getUTCMonth(),
            year: transaction.date.getUTCFullYear(),
          },
        },
        data: {
          ...(transaction.type === "expense" && {
            expense: {
              decrement: transaction.amount,
            },
          }),
          ...(transaction.type === "income" && {
            income: {
              decrement: transaction.amount,
            },
          }),
        },
      }),
      prisma.yearHistory.update({
        where: {
          month_year_userId: {
            userId: user.userId,
            month: transaction.date.getUTCMonth(),
            year: transaction.date.getUTCFullYear(),
          },
        },
        data: {
          ...(transaction.type === "expense" && {
            expense: {
              decrement: transaction.amount,
            },
          }),
          ...(transaction.type === "income" && {
            income: {
              decrement: transaction.amount,
            },
          }),
        },
      }),
    ]);
    if (transaction.filePath) {
      await handleDeleteFile(transaction.filePath);
      // console.log("Transaction deleted with success!");
    }
  } catch (error) {
    throw new Error("Something went wrong to delete transaction");
  }
}
