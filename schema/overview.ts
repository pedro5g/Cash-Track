import { MAX_DATE_RANGE_DAYS } from "@/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const overviewQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);

    return days >= 0 && days < MAX_DATE_RANGE_DAYS;
  });

export type OverviewType = z.infer<typeof overviewQuerySchema>;
