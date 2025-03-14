"use server";

import prisma from "@/lib/prisma";
import { signInSchema, SignInSchemaType } from "@/schema/account";
import { createSessionToken } from "@/lib/session";
import { decrypt } from "@/lib/encrypter";
import { COOKIE_KEYS, USER_INFO_SELECT } from "@/constants";
import { cookies } from "next/headers";
import { userDTO } from "@/lib/utils";

export async function signIn(form: SignInSchemaType) {
  const parsedBody = signInSchema.safeParse(form);

  if (!parsedBody.success) {
    return { message: "Bad request." };
  }
  const data = parsedBody.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        ...USER_INFO_SELECT,
        password: true,
      },
    });

    if (!user) {
      return { message: "Credentials invalid." };
    }

    if (!user.password) {
      return { message: "Please use social login." };
    }

    const isMatch = await decrypt(data.password, user.password);

    if (!isMatch) {
      return { message: "Credentials invalid." };
    }

    const { session, exp } = await createSessionToken({
      id: user.userId,
      provider: "EMAIL",
    });

    (await cookies()).set(COOKIE_KEYS.TOKEN, session, {
      maxAge: exp! * 1000,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    (await cookies()).set(COOKIE_KEYS.USER, JSON.stringify(userDTO(user)), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return { message: "Login Successfully" };
  } catch (e: any) {
    return { message: e.message };
  }
}
