import { PiggyBank } from "lucide-react";

export const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <PiggyBank
        className=" stroke size-11 stroke-amber-500
            stroke-[1.5]"
      />
      <p
        className="bg-gradient-to-r from-amber-400 
      to-orange-500 bg-clip-text text-3xl font-extrabold
      leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </a>
  );
};
