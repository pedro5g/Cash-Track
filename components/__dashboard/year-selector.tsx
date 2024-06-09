import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import { Period } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface YearSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}

export const YearSelector = ({
  period,
  setPeriod,
  years,
}: YearSelectorProps) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({ month: period.month, year: Number(value) });
      }}>
      <SelectTrigger className="w-[11.25rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
