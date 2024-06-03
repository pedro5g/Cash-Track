"use server";

import prisma from "@/lib/prisma";
import { updateUserCurrencySchema } from "@/schema/user-settings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function updateUserCurrency(currency: string) {
  const parse = updateUserCurrencySchema.safeParse({ currency });

  if (!parse.success) {
    throw parse.error.flatten().fieldErrors;
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.user.update({
    where: { userId: user.id },
    data: {
      currency,
    },
  });

  return userSettings;
}
