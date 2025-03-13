/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('PASSWORD_RECOVER');

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- AlterTable
ALTER TABLE "account" DROP CONSTRAINT "account_pkey",
ADD CONSTRAINT "account_pkey" PRIMARY KEY ("userId", "provider");

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "token" (
    "id" TEXT NOT NULL,
    "type" "token_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
