-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "store_id" TEXT NOT NULL,
    "creator_id" INTEGER,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disabled_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_offers" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_offer_buy_items" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "offer_id" INTEGER NOT NULL,

    CONSTRAINT "promotion_offer_buy_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_offer_get_items" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "offer_id" INTEGER NOT NULL,

    CONSTRAINT "promotion_offer_get_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderProductToPromotionOffer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderProductToPromotionOffer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderProductToPromotionOffer_B_index" ON "_OrderProductToPromotionOffer"("B");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_offers" ADD CONSTRAINT "promotion_offers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_offer_buy_items" ADD CONSTRAINT "promotion_offer_buy_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_offer_buy_items" ADD CONSTRAINT "promotion_offer_buy_items_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "promotion_offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_offer_get_items" ADD CONSTRAINT "promotion_offer_get_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_offer_get_items" ADD CONSTRAINT "promotion_offer_get_items_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "promotion_offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductToPromotionOffer" ADD CONSTRAINT "_OrderProductToPromotionOffer_A_fkey" FOREIGN KEY ("A") REFERENCES "order_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductToPromotionOffer" ADD CONSTRAINT "_OrderProductToPromotionOffer_B_fkey" FOREIGN KEY ("B") REFERENCES "promotion_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
