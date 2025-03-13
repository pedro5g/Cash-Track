import { GetCurrentUser } from "@/hooks/get-current-user";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { getUser } = GetCurrentUser();
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.user.findUnique({
    where: {
      userId: user.userId,
    },
    select: {
      userId: true,
      currency: true,
    },
  });

  revalidatePath("/");
  return Response.json(userSettings);
}
