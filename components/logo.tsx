import { CircleDollarSign } from "lucide-react";

export const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <CircleDollarSign
        className=" stroke size-11 stroke-amber-500
            stroke-2"
      />
      <p
        className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-400 bg-clip-text text-3xl font-extrabold
      leading-tight tracking-tighter text-transparent">
        CashTrack
      </p>
    </a>
  );
};
