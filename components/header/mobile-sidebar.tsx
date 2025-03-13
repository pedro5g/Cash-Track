"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Logo } from "../logo";
import { NAV_LINKS } from "@/constants";
import { NavBarLink } from "./nav-bar-link";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[25rem] sm:w-[33.75rem]" side="left">
        <Logo />
        <div className="flex flex-col gap-1 pt-4">
          {NAV_LINKS.map((item) => (
            <NavBarLink
              key={item.label}
              callBack={() => setIsOpen(!isOpen)}
              {...item}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
