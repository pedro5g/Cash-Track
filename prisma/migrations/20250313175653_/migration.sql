/*
  Warnings:

  - You are about to drop the column `profile_url` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "profile_url" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "profile_url";
