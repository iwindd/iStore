/*
  Warnings:

  - You are about to drop the column `description` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "note" TEXT;
