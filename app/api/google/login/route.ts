import { COOKIE_KEYS, USER_INFO_SELECT } from "@/constants";
import prisma from "@/lib/prisma";
import { createSessionToken } from "@/lib/session";
import { userDTO } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type GoogleTypeResponse = {
  access_token: string;
  scope: string;
  token_type: string;
  id_token: string;
};

type GoogleUserTypeResponse = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: true;
  local: string;
};

type RegisterFlow = "not-skip" | "skip";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");

  const res = await fetch(process.env.GOOGLE_AOUTH2_TOKEN_URL!, {
    method: "POST",
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }),
    headers: { Accept: "application/x-www-form-urlencoded" },
  });
  const tokenResponse = (await res.json()) as GoogleTypeResponse;

  const { access_token } = tokenResponse;

  const userResponse = await fetch(process.env.GOOGLE_AOUTH2_USERINFO_URL!, {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const userData = (await userResponse.json()) as GoogleUserTypeResponse;

  const { sub, name, email, picture, email_verified } = userData;

  /**
   * this flag
   */
  let registerFlow: RegisterFlow = "not-skip";

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      ...USER_INFO_SELECT,
    },
  });

  if (!user) {
    // if user don't exists, register user and google account on database
    user = await prisma.$transaction(async (ctx) => {
      const _user = await ctx.user.create({
        data: {
          name,
          email,

          currency: "BRL",
          isEmailVerified: email_verified,
        },
        select: {
          ...USER_INFO_SELECT,
        },
      });
      await ctx.account.create({
        data: {
          provider: "GOOGLE",
          providerIdOrEmail: sub,
          profileUrl: picture,
          userId: _user.userId,
        },
      });
      registerFlow = "skip";
      return _user;
    });
  }

  const alreadyGoogleAccount = user.account.some(
    ({ provider }) => provider === "GOOGLE"
  );

  if (registerFlow === "not-skip" && !alreadyGoogleAccount) {
    await prisma.account.create({
      data: {
        provider: "GOOGLE",
        providerIdOrEmail: sub,
        userId: user.userId,
        profileUrl: picture,
      },
    });
  }

  const { session, exp } = await createSessionToken({
    id: user.userId,
    provider: "GOOGLE",
  });
  (await cookies()).set(COOKIE_KEYS.TOKEN, session, {
    maxAge: exp! * 1000,
    path: "/",
    httpOnly: true,
  });
  (await cookies()).set(
    COOKIE_KEYS.USER,
    JSON.stringify({
      userId: user.userId,
      name: user.name,
      email: user.email,
      profileUrl: picture,
      currency: user.currency,
    })
  );

  redirect("/wizard");
}
