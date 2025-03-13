"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { signInSchema, SignInSchemaType } from "@/schema/account";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "@/app/(auth)/_actions/sign-in";
import { GoogleLink } from "./google-link";

export const SignInForm = () => {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onError: (error) => {
      if (error.message === "NEXT_REDIRECT") {
        toast.success("Login successfully", {
          id: "sign-in-user",
        });
      } else {
        toast.error(error.message, {
          id: "sign-in-user",
        });
      }
    },
  });

  const onSubmit = (data: SignInSchemaType) => {
    if (isPending) return;
    toast.loading("Entering...", {
      id: "sign-in-user",
    });
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-[300px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign in account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Access your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>

                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      required
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <div
            className="relative text-center text-sm after:absolute after:inset-0 
          after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <GoogleLink />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};
