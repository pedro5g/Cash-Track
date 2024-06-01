import { NAV_LINKS } from "@/constants";
import { Logo } from "../logo";
import { NavBarLink } from "./nav-bar-link";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "../theme-switcher";

export const DesktopNavBar = () => {
  return (
    <header
      className=" hidden md:block border-separate 
    border-b bg-background">
      <nav
        className=" container flex items-center justify-between
        px-8">
        <div
          className="flex h-20 min-h-[3.75rem] 
        items-center gap-x-4 ">
          <Logo />
          <div className=" flex h-full">
            {NAV_LINKS.map((item) => (
              <NavBarLink key={item.label} {...item} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </header>
  );
};
