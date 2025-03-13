import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { bindCurrency, getInitials } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { GetCurrentUser } from "@/hooks/get-current-user";
import { logOut } from "@/app/(auth)/_actions/log-out";
import { Skeleton } from "./ui/skeleton";
import { LogOut } from "lucide-react";
import { Separator } from "./ui/separator";

export const Profile = async () => {
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    return <Skeleton className=" h-10 w-10 rounded-full" />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.profileUrl || ""} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[400px]">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Account infos</h4>
            <p className="text-sm text-muted-foreground">
              Management your info
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user?.profileUrl || ""} alt={user.name} />
                  <AvatarFallback className="size-8 rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>

              <div className="flex-1 text-left text-sm leading-tight">
                <span className="font-semibold">Currency: </span>
                {bindCurrency(user.currency)}
              </div>
            </div>{" "}
            <Separator />
            <div className="grid grid-cols-2">
              <form className="grid col-span-2" action={logOut}>
                <Button type="submit" variant="secondary" size="sm">
                  <LogOut className="size-4 mr-2" />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
