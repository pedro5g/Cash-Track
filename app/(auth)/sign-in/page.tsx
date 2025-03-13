import { SignInForm } from "@/components/__auth/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Page() {
  return <SignInForm />;
}
