export type Provider = "GOOGLE" | "EMAIL";

export type PrismaUserType =
  | {
      currency: string;
      userId: string;
      name: string;
      email: string;
      password?: string | null;
      isEmailVerified: boolean;
      account: {
        id: string;
        provider: Provider;
        profileUrl: string | null;
      }[];
    }
  | {
      userId: string;
      name: string;
      email: string;
      currency: string;
      account: {
        profileUrl: string | null;
      }[];
    };

export type UserDTOType = {
  userId: string;
  name: string;
  email: string;
  profileUrl: string | null;
  currency: string;
};
