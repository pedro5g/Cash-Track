"use server";

import prisma from "@/lib/prisma";
import { signInSchema, SignInSchemaType } from "@/schema/account";
import { createSessionToken } from "@/lib/session";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/encrypter";

export async function signIn(form: SignInSchemaType) {
  const parsedBody = signInSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Bad request");
  }
  const data = parsedBody.data;

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Credentials invalid.");
  }

  if (!user.password) {
    throw new Error("Please use social login.");
  }

  const isMatch = await decrypt(data.password, user.password);

  if (!isMatch) {
    throw new Error("Credentials invalid.");
  }

  await createSessionToken({
    id: user.userId,
    provider: "EMAIL",
  });

  return redirect("/wizard");
}
