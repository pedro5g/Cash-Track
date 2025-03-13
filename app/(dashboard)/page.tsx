import { CreateTransactionDialog } from "@/components/__dashboard/create-transaction-dialog";
import { History } from "@/components/__dashboard/history";
import { Overview } from "@/components/__dashboard/overview";
import { Button } from "@/components/ui/button";
import { GetCurrentUser } from "@/hooks/get-current-user";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.currency) {
    redirect("/wizard");
  }

  return (
    <main className=" w-full bg-background mb-8">
      <div className=" border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className=" text-3xl font-bold">
            Hello <span className=" capitalize">{user.name}</span> ! 👋
          </p>
          <div className=" flex items-center gap-3">
            <CreateTransactionDialog type="income">
              <Button
                variant="outline"
                className="border-emerald-500 
      bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white">
                New Income💲
              </Button>
            </CreateTransactionDialog>
            <CreateTransactionDialog type="expense">
              <Button
                variant="outline"
                className="border-rose-500 
      bg-rose-950 text-white hover:bg-rose-700 hover:text-white">
                New Expense 😪
              </Button>
            </CreateTransactionDialog>
          </div>
        </div>
      </div>
      <Overview userSettings={user} />
      <History userSettings={user} />
    </main>
  );
}
