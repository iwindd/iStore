/*
  Warnings:

  - You are about to drop the column `category` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `overstock` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `overstock_at` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `serial` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock_min` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `stock_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profit` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_id` on table `order_products` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `total` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsignmentStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PreOrderStatus" AS ENUM ('PENDING', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductStockMovementType" AS ENUM ('SOLD', 'STOCK_RECEIPT', 'ADJUST', 'CONSIGNMENT', 'CONSIGNMENT_SOLD', 'CONSIGNMENT_RETURNED', 'CONSIGNMENT_CANCELLED', 'PREORDER_SOLD');

-- CreateEnum
CREATE TYPE "StockReceiptStatus" AS ENUM ('CREATING', 'DRAFT', 'PROCESSING', 'COMPLETED', 'CANCEL');

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_products" DROP CONSTRAINT "stock_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_products" DROP CONSTRAINT "stock_products_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_store_id_fkey";

-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "category",
DROP COLUMN "creator_id",
DROP COLUMN "label",
DROP COLUMN "overstock",
DROP COLUMN "overstock_at",
DROP COLUMN "price",
DROP COLUMN "serial",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "profit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "product_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "price",
DROP COLUMN "text",
ADD COLUMN     "consignment_id" INTEGER,
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "stock",
DROP COLUMN "stock_min",
ADD COLUMN     "usePreorder" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "stock_products";

-- DropTable
DROP TABLE "stocks";

-- DropEnum
DROP TYPE "StockState";

-- CreateTable
CREATE TABLE "consignments" (
    "id" SERIAL NOT NULL,
    "status" "ConsignmentStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "store_id" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "completed_by_id" INTEGER,
    "cancelled_by_id" INTEGER,

    CONSTRAINT "consignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consignment_products" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "consignment_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantityOut" INTEGER NOT NULL,
    "quantitySold" INTEGER,
    "quantityReturned" INTEGER,

    CONSTRAINT "consignment_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_preorders" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "note" TEXT,
    "count" INTEGER NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "profit" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "status" "PreOrderStatus" NOT NULL DEFAULT 'PENDING',
    "returned_at" TIMESTAMP(3),
    "returned_by_id" INTEGER,
    "cancelled_at" TIMESTAMP(3),
    "cancelled_by_id" INTEGER,

    CONSTRAINT "order_preorders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stocks" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "useAlert" BOOLEAN NOT NULL DEFAULT false,
    "alertCount" INTEGER NOT NULL DEFAULT 30,
    "product_id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stock_movements" (
    "id" TEXT NOT NULL,
    "type" "ProductStockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantity_before" INTEGER NOT NULL,
    "quantity_after" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "stock_receipt_id" INTEGER,
    "order_id" INTEGER,
    "consignment_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_recepts" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "status" "StockReceiptStatus" NOT NULL DEFAULT 'DRAFT',
    "action_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_id" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "stock_recepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_receipt_products" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "stock_receipt_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_stocks_product_id_key" ON "product_stocks"("product_id");

-- CreateIndex
CREATE INDEX "product_stock_movements_product_id_idx" ON "product_stock_movements"("product_id");

-- AddForeignKey
ALTER TABLE "consignments" ADD CONSTRAINT "consignments_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consignments" ADD CONSTRAINT "consignments_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consignments" ADD CONSTRAINT "consignments_completed_by_id_fkey" FOREIGN KEY ("completed_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consignments" ADD CONSTRAINT "consignments_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consignment_products" ADD CONSTRAINT "consignment_products_consignment_id_fkey" FOREIGN KEY ("consignment_id") REFERENCES "consignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consignment_products" ADD CONSTRAINT "consignment_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_consignment_id_fkey" FOREIGN KEY ("consignment_id") REFERENCES "consignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_preorders" ADD CONSTRAINT "order_preorders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_preorders" ADD CONSTRAINT "order_preorders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_preorders" ADD CONSTRAINT "order_preorders_returned_by_id_fkey" FOREIGN KEY ("returned_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_preorders" ADD CONSTRAINT "order_preorders_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stocks" ADD CONSTRAINT "product_stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stock_movements" ADD CONSTRAINT "product_stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stock_movements" ADD CONSTRAINT "product_stock_movements_stock_receipt_id_fkey" FOREIGN KEY ("stock_receipt_id") REFERENCES "stock_recepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stock_movements" ADD CONSTRAINT "product_stock_movements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stock_movements" ADD CONSTRAINT "product_stock_movements_consignment_id_fkey" FOREIGN KEY ("consignment_id") REFERENCES "consignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_recepts" ADD CONSTRAINT "stock_recepts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_recepts" ADD CONSTRAINT "stock_recepts_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_receipt_products" ADD CONSTRAINT "stock_receipt_products_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock_recepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_receipt_products" ADD CONSTRAINT "stock_receipt_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
