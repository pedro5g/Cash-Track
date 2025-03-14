import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currencies } from "./currencies";
import { PrismaUserType, UserDTOType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

export function getFormatterCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}

export function bindCurrency(currency: string): string {
  const binders = {
    USD: "$ Dollar",
    BRL: "R$ Real",
    EUR: "€ Euro",
    JPY: "¥ Yen",
    GBP: "£ Pound",
  };

  return binders[currency as keyof typeof binders] || "$";
}

export const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(" ")
    .map((c) => c.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return initials || "NA";
};

export function userDTO(input: PrismaUserType): UserDTOType {
  const [{ profileUrl }] = input.account;
  return {
    userId: input.userId,
    name: input.name,
    email: input.email,
    profileUrl: profileUrl,
    currency: input.currency,
  };
}
