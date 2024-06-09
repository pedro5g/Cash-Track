import { Period } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MonthSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
}

export const MonthSelector = ({ period, setPeriod }: MonthSelectorProps) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  function monthFormat(month: number) {
    return new Date(period.year, month, 1).toLocaleString("default", {
      month: "long",
    });
  }

  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: Number(value),
        });
      }}>
      <SelectTrigger className="w-[11.25rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => {
          return (
            <SelectItem value={month.toString()} key={month}>
              {monthFormat(month)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
