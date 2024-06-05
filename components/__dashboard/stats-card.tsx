import { useCallback } from "react";
import CountUp from "react-countup";
import { Card } from "../ui/card";

interface StatsCardProps {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}

export const StatsCard = ({
  formatter,
  value,
  title,
  icon,
}: StatsCardProps) => {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start">
        <p className="text-muted-foreground capitalize">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          decimals={2}
          formattingFn={formatFn}
          end={value}
          className="text-2xl"
        />
      </div>
    </Card>
  );
};
