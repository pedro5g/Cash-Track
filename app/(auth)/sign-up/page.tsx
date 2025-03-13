import { SignUpForm } from "@/components/__auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function Page() {
  return <SignUpForm />;
}
