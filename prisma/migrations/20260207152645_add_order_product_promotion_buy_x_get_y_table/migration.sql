/*
  Warnings:

  - You are about to drop the `_OrderProductToPromotionOffer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderProductToPromotionOffer" DROP CONSTRAINT "_OrderProductToPromotionOffer_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProductToPromotionOffer" DROP CONSTRAINT "_OrderProductToPromotionOffer_B_fkey";

-- DropTable
DROP TABLE "_OrderProductToPromotionOffer";

-- CreateTable
CREATE TABLE "order_product_promotion_buy_x_get_ys" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "free_count" INTEGER NOT NULL,
    "received_count" INTEGER NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "promotionBuyXGetY_id" INTEGER NOT NULL,

    CONSTRAINT "order_product_promotion_buy_x_get_ys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_product_promotion_buy_x_get_ys_order_id_idx" ON "order_product_promotion_buy_x_get_ys"("order_id");

-- CreateIndex
CREATE INDEX "order_product_promotion_buy_x_get_ys_product_id_idx" ON "order_product_promotion_buy_x_get_ys"("product_id");

-- CreateIndex
CREATE INDEX "order_product_promotion_buy_x_get_ys_promotionBuyXGetY_id_idx" ON "order_product_promotion_buy_x_get_ys"("promotionBuyXGetY_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_product_promotion_buy_x_get_ys_order_id_product_id_pr_key" ON "order_product_promotion_buy_x_get_ys"("order_id", "product_id", "promotionBuyXGetY_id");

-- AddForeignKey
ALTER TABLE "order_product_promotion_buy_x_get_ys" ADD CONSTRAINT "order_product_promotion_buy_x_get_ys_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_promotion_buy_x_get_ys" ADD CONSTRAINT "order_product_promotion_buy_x_get_ys_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_promotion_buy_x_get_ys" ADD CONSTRAINT "order_product_promotion_buy_x_get_ys_promotionBuyXGetY_id_fkey" FOREIGN KEY ("promotionBuyXGetY_id") REFERENCES "promotion_offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterEnum
ALTER TYPE "ProductStockMovementType" ADD VALUE 'SOLD_PROMOTION';
