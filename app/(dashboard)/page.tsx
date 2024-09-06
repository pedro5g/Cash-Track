import { CreateTransactionDialog } from "@/components/__dashboard/create-transaction-dialog";
import { History } from "@/components/__dashboard/history";
import { Overview } from "@/components/__dashboard/overview";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getSettingsUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      userId,
    },
  });
}

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await getSettingsUser(user.id);

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <main className=" w-full bg-background mb-8">
      <div className=" border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className=" text-3xl font-bold">
            Hello <span className=" capitalize">{user.firstName}</span> ! 👋
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
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </main>
  );
}
