import { ThemeSwitcher } from "../theme-switcher";
import { MobileLogo } from "../mobile-logo";
import { Profile } from "../profile";
import { MobileSidebar } from "./mobile-sidebar";

export const MobileNavBar = () => {
  return (
    <header className=" md:hidden block border-separate border-b bg-background">
      <nav
        className=" container flex items-center justify-between
        px-8">
        <MobileSidebar />
        <div className="flex h-20 min-h-[3.75rem] items-center gap-x-4">
          <MobileLogo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Profile />
        </div>
      </nav>
    </header>
  );
};
