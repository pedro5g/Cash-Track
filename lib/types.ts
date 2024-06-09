export type TransactionType = "income" | "expense";
export type TimeFrame = "month" | "year";
export type Period = { year: number; month: number };
export type CategoryType = {
  createdAt: Date;
  name: string;
  userId: string;
  icon: string;
  type: TransactionType;
};

export type UserSettingsType = {
  userId: string;
  currency: string;
};
