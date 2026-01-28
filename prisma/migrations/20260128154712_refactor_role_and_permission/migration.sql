/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RolePermission" DROP CONSTRAINT "_RolePermission_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermission" DROP CONSTRAINT "_RolePermission_B_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_role_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_store_id_fkey";

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "global_role_id" INTEGER,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_RolePermission";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "global_roles" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_removable" BOOLEAN NOT NULL DEFAULT false,
    "creator_id" INTEGER,

    CONSTRAINT "global_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "global_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_id" TEXT NOT NULL,
    "is_removable" BOOLEAN NOT NULL DEFAULT false,
    "creator_id" INTEGER,

    CONSTRAINT "store_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "store_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GlobalRolePermission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalRolePermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StoreRolePermission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StoreRolePermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_roles_label_key" ON "global_roles"("label");

-- CreateIndex
CREATE UNIQUE INDEX "global_permissions_name_key" ON "global_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "store_roles_store_id_name_key" ON "store_roles"("store_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "store_permissions_name_key" ON "store_permissions"("name");

-- CreateIndex
CREATE INDEX "_GlobalRolePermission_B_index" ON "_GlobalRolePermission"("B");

-- CreateIndex
CREATE INDEX "_StoreRolePermission_B_index" ON "_StoreRolePermission"("B");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- AddForeignKey
ALTER TABLE "global_roles" ADD CONSTRAINT "global_roles_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_roles" ADD CONSTRAINT "store_roles_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_roles" ADD CONSTRAINT "store_roles_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_global_role_id_fkey" FOREIGN KEY ("global_role_id") REFERENCES "global_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "store_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalRolePermission" ADD CONSTRAINT "_GlobalRolePermission_A_fkey" FOREIGN KEY ("A") REFERENCES "global_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalRolePermission" ADD CONSTRAINT "_GlobalRolePermission_B_fkey" FOREIGN KEY ("B") REFERENCES "global_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoreRolePermission" ADD CONSTRAINT "_StoreRolePermission_A_fkey" FOREIGN KEY ("A") REFERENCES "store_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoreRolePermission" ADD CONSTRAINT "_StoreRolePermission_B_fkey" FOREIGN KEY ("B") REFERENCES "store_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
