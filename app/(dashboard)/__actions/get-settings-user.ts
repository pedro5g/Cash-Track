"use server";

import prisma from "@/lib/prisma";

export async function getSettingsUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      userId,
    },
  });
}
