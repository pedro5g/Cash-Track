import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
  doc: z
    .object({
      fileName: z.string(),
      filePath: z.string().url(),
    })
    .optional(),
});
export const createTransactionFormSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
  doc: z.instanceof(File).nullable(),
});

export type CreateTransactionFormSchemaType = z.infer<
  typeof createTransactionFormSchema
>;

export type CreateTransactionSchemaType = z.infer<
  typeof createTransactionSchema
>;

export const updateTransactionIdSchema = z.object({
  transactionId: z.string().uuid(),
});
export type UpdateTransactionSchemaType = z.infer<
  typeof deleteTransactionSchema
>;

export const deleteTransactionSchema = z.object({
  transactionId: z.string().uuid(),
});

export type DeleteTransactionSchemaType = z.infer<
  typeof deleteTransactionSchema
>;
