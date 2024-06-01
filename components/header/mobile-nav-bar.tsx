"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Logo } from "../logo";
import { NAV_LINKS } from "@/constants";
import { NavBarLink } from "./nav-bar-link";
import { ThemeSwitcher } from "../theme-switcher";
import { UserButton } from "@clerk/nextjs";
import { MobileLogo } from "../mobile-logo";

export const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className=" md:hidden block border-separate 
    border-b bg-background">
      <nav
        className=" container flex items-center justify-between
        px-8">
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
        <div className="flex h-20 min-h-[3.75rem] items-center gap-x-4">
          <MobileLogo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </header>
  );
};
