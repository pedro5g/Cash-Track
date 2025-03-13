import { z } from "zod";

const nameSchema = z.string().trim().min(3).max(255);
const emailSchema = z.string().trim().email().min(3).max(255);
const passwordSchema = z.string().trim().min(6).max(30);

export const registerUserSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((val) => val.confirmPassword === val.password, {
    message: "password does not match",
    path: ["confirmPassword"],
  });

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
