"use server";

import { USER_INFO_SELECT } from "@/constants";
import { textToHash } from "@/lib/encrypter";
import prisma from "@/lib/prisma";
import { registerUserSchema, RegisterUserSchemaType } from "@/schema/account";
import { redirect } from "next/navigation";

export async function registerUser(form: RegisterUserSchemaType) {
  const parsedBody = registerUserSchema.safeParse(form);

  if (!parsedBody.success) {
    return { message: "Bad request." };
  }

  const data = parsedBody.data;
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        ...USER_INFO_SELECT,
      },
    });

    if (userExists) {
      const alreadyEmailAccount = userExists.account.some(
        ({ provider }) => provider === "EMAIL"
      );
      if (alreadyEmailAccount) {
        return { message: "You already have an account, please login" };
      }
      const passwordHash = await textToHash(data.password);

      await prisma.$transaction(async (ctx) => {
        const user = await ctx.user.update({
          where: {
            userId: userExists.userId,
          },
          data: {
            password: passwordHash,
          },
        });
        await ctx.account.create({
          data: {
            provider: "EMAIL",
            providerIdOrEmail: data.email,
            userId: user.userId,
          },
        });
      });
      return redirect("/sign-in");
    }

    const passwordHash = await textToHash(data.password);

    await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: passwordHash,
          currency: "BRL",
        },
      });

      await ctx.account.create({
        data: {
          provider: "EMAIL",
          providerIdOrEmail: data.email,
          userId: user.userId,
        },
      });
    });

    return redirect("/sign-in");
  } catch (e: any) {
    return { message: e.message };
  }
}
