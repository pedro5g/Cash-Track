export const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Manage", href: "/manage" },
];

export const MAX_DATE_RANGE_DAYS = 90;

export const COOKIE_KEYS = {
  TOKEN: "cash-track-session",
  USER: "cash-track-user",
} as const;

export const USER_INFO_SELECT = {
  userId: true,
  name: true,
  email: true,
  currency: true,
  isEmailVerified: true,
  account: {
    select: {
      id: true,
      provider: true,
      profileUrl: true,
    },
  },
};
