import { startOfMonth } from "date-fns";
import { useQueryState, parseAsIsoDate } from "nuqs";
import { useCallback } from "react";

export const useDateQuery = () => {
  const [from, setFrom] = useQueryState(
    "from",
    parseAsIsoDate.withDefault(startOfMonth(new Date()))
  );
  const [to, setTo] = useQueryState(
    "to",
    parseAsIsoDate.withDefault(new Date())
  );

  const setDate = useCallback(
    (from: Date, to: Date) => {
      setFrom(from);
      setTo(to);
    },
    [setFrom, setTo]
  );

  const date = {
    from,
    to,
  };

  return { date, setDate };
};
