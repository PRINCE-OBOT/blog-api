/*
  Warnings:

  - Added the required column `hero_img_url` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "hero_img_url" TEXT NOT NULL;
