import { openSessionToken } from "@/lib/session";
import { COOKIE_KEYS } from "@/constants";
import prisma from "@/lib/prisma";
import { getCookie, setCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { cache } from "react";

export type User = {
  userId: string;
  name: string;
  email: string;
  profileUrl: string | null;
  currency: string;
};

export function GetCurrentUser() {
  async function getUserInfo() {
    const token = await getCookie(COOKIE_KEYS.TOKEN, { cookies });

    if (token) {
      const { id, provider } = await openSessionToken(token);

      const user = await prisma.user
        .findUnique({
          where: { userId: id },
          select: {
            userId: true,
            name: true,
            email: true,
            currency: true,
            account: {
              where: {
                userId: id,
                provider,
              },
              select: {
                profileUrl: true,
              },
            },
          },
        })
        .then((res) => {
          if (!res) return null;
          const [{ profileUrl }] = res.account;
          return {
            userId: res.userId,
            name: res.name,
            email: res.email,
            profileUrl: profileUrl,
            currency: res.currency,
          };
        });

      setCookie(COOKIE_KEYS.USER, JSON.stringify(user), { cookies });
      return user;
    }

    return null;
  }
  const getUser = async () => {
    const token = (await cookies()).get(COOKIE_KEYS.TOKEN)?.value;
    const user = (await cookies()).get(COOKIE_KEYS.USER)?.value;

    if (token && user) {
      return JSON.parse(user) as User;
    }

    if (token) {
      return await getUserInfo();
    }
    return null;
  };

  return {
    getUserInfo,
    getUser,
  };
}
