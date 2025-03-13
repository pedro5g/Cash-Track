"use server";

import { COOKIE_KEYS } from "@/constants";
import { GetCurrentUser } from "@/hooks/get-current-user";
import prisma from "@/lib/prisma";
import { updateUserCurrencySchema } from "@/schema/user-settings";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateUserCurrency(currency: string) {
  const parse = updateUserCurrencySchema.safeParse({ currency });

  if (!parse.success) {
    throw parse.error.flatten().fieldErrors;
  }
  const { getUser } = GetCurrentUser();
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.user.update({
    where: { userId: user.userId },
    data: {
      currency,
    },
  });

  (await cookies()).delete(COOKIE_KEYS.USER);
  revalidatePath("/dashboard");

  return userSettings;
}
