import { COOKIE_KEYS } from "@/constants";
import { cookies } from "next/headers";

export type User = {
  userId: string;
  name: string;
  email: string;
  profileUrl: string | null;
  currency: string;
};

export function GetCurrentUser() {
  const getUser = async () => {
    const token = (await cookies()).get(COOKIE_KEYS.TOKEN)?.value;
    const user = (await cookies()).get(COOKIE_KEYS.USER)?.value;

    if (token && user) {
      return JSON.parse(user) as User;
    }

    return null;
  };

  return {
    getUser,
  };
}
