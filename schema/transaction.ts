import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

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
