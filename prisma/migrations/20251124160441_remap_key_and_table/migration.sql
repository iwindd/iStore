/*
  Warnings:

  - You are about to drop the `creators` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderProductType" AS ENUM ('NORMAL', 'OFFER');

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "creators" DROP CONSTRAINT "creators_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "creators" DROP CONSTRAINT "creators_role_id_fkey";

-- DropForeignKey
ALTER TABLE "creators" DROP CONSTRAINT "creators_store_id_fkey";

-- DropForeignKey
ALTER TABLE "creators" DROP CONSTRAINT "creators_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_creator_id_fkey";

-- DropTable
DROP TABLE "creators";

-- CreateTable
CREATE TABLE "user_stores" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "store_id" TEXT NOT NULL,
    "creator_id" INTEGER,

    CONSTRAINT "user_stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_stores_user_id_store_id_key" ON "user_stores"("user_id", "store_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stores" ADD CONSTRAINT "user_stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stores" ADD CONSTRAINT "user_stores_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stores" ADD CONSTRAINT "user_stores_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stores" ADD CONSTRAINT "user_stores_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
