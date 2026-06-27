/*
  Warnings:

  - You are about to drop the column `sub_title` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "sub_title",
ADD COLUMN     "subtitle" TEXT;
