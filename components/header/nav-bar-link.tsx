"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

interface NavBarLinkProps {
  href: string;
  label: string;
  callBack?: () => void;
}

export const NavBarLink = ({ href, label, callBack }: NavBarLinkProps) => {
  const pathName = usePathname();
  const isActive = pathName.startsWith(href);

  return (
    <div className="relative flex items-center">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        href={href}
        onClick={() => {
          if (callBack) {
            callBack();
          }
        }}>
        {label}
      </Link>
      {isActive && (
        <div
          className=" absolute -bottom-0.5 left-1/2 h-0.5 
      w-4/5 -translate-x-1/2 rounded-xl bg-foreground hidden md:block "
        />
      )}
    </div>
  );
};
