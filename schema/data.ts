import { z } from "zod";

export const historyDataSchema = z.object({
  timeFrame: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000),
});
