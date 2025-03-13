"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { registerUserSchema, RegisterUserSchemaType } from "@/schema/account";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/app/(auth)/_actions/register";
import { toast } from "sonner";
import Link from "next/link";
import { GoogleLink } from "./google-link";

export const SignUpForm = () => {
  const form = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      if (error.message === "NEXT_REDIRECT") {
        toast.success("Registered successfully", {
          id: "registration-user",
        });
      } else {
        toast.error("Error to registered", {
          id: "registration-user",
        });
      }
    },
  });

  const onSubmit = (data: RegisterUserSchemaType) => {
    if (isPending) return;
    toast.loading("Registering...", {
      id: "registration-user",
    });
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-[300px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Register account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Create your account on our platform
          </p>
        </div>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="name..."
                      required
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
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
                  <FormLabel htmlFor="password">Password</FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="confirmPassword"
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
            Register
          </Button>
          <div
            className="relative text-center text-sm after:absolute after:inset-0 
            after:top-1/2 after:z-0 after:flex after:items-center after:border-t 
            after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <GoogleLink />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};
