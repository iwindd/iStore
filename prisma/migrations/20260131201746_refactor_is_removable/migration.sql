/*
  Warnings:

  - You are about to drop the column `is_removable` on the `global_roles` table. All the data in the column will be lost.
  - You are about to drop the column `is_removable` on the `store_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "global_roles" DROP COLUMN "is_removable",
ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "store_roles" DROP COLUMN "is_removable",
ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false;
