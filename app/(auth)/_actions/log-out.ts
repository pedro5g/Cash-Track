"use server";

import { COOKIE_KEYS } from "@/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOut() {
  (await cookies()).delete(COOKIE_KEYS.TOKEN);
  (await cookies()).delete(COOKIE_KEYS.USER);
  redirect("/sign-in");
}
