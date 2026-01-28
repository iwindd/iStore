-- CreateIndex
CREATE INDEX "categories_store_id_idx" ON "categories"("store_id");

-- CreateIndex
CREATE INDEX "consignment_products_consignment_id_idx" ON "consignment_products"("consignment_id");

-- CreateIndex
CREATE INDEX "consignment_products_product_id_idx" ON "consignment_products"("product_id");

-- CreateIndex
CREATE INDEX "consignments_store_id_idx" ON "consignments"("store_id");

-- CreateIndex
CREATE INDEX "consignments_store_id_status_idx" ON "consignments"("store_id", "status");

-- CreateIndex
CREATE INDEX "consignments_store_id_created_at_idx" ON "consignments"("store_id", "created_at");

-- CreateIndex
CREATE INDEX "consignments_creator_id_idx" ON "consignments"("creator_id");

-- CreateIndex
CREATE INDEX "consignments_completed_by_id_idx" ON "consignments"("completed_by_id");

-- CreateIndex
CREATE INDEX "consignments_cancelled_by_id_idx" ON "consignments"("cancelled_by_id");

-- CreateIndex
CREATE INDEX "districts_province_id_idx" ON "districts"("province_id");

-- CreateIndex
CREATE INDEX "employees_store_id_idx" ON "employees"("store_id");

-- CreateIndex
CREATE INDEX "employees_user_id_idx" ON "employees"("user_id");

-- CreateIndex
CREATE INDEX "employees_role_id_idx" ON "employees"("role_id");

-- CreateIndex
CREATE INDEX "employees_creator_id_idx" ON "employees"("creator_id");

-- CreateIndex
CREATE INDEX "events_store_id_idx" ON "events"("store_id");

-- CreateIndex
CREATE INDEX "events_creator_id_idx" ON "events"("creator_id");

-- CreateIndex
CREATE INDEX "events_store_id_disabled_at_idx" ON "events"("store_id", "disabled_at");

-- CreateIndex
CREATE INDEX "events_store_id_start_at_end_at_idx" ON "events"("store_id", "start_at", "end_at");

-- CreateIndex
CREATE INDEX "geography_country_id_idx" ON "geography"("country_id");

-- CreateIndex
CREATE INDEX "global_roles_creator_id_idx" ON "global_roles"("creator_id");

-- CreateIndex
CREATE INDEX "order_preorders_order_id_idx" ON "order_preorders"("order_id");

-- CreateIndex
CREATE INDEX "order_preorders_product_id_idx" ON "order_preorders"("product_id");

-- CreateIndex
CREATE INDEX "order_preorders_status_idx" ON "order_preorders"("status");

-- CreateIndex
CREATE INDEX "order_products_order_id_idx" ON "order_products"("order_id");

-- CreateIndex
CREATE INDEX "order_products_product_id_idx" ON "order_products"("product_id");

-- CreateIndex
CREATE INDEX "orders_store_id_idx" ON "orders"("store_id");

-- CreateIndex
CREATE INDEX "orders_store_id_created_at_idx" ON "orders"("store_id", "created_at");

-- CreateIndex
CREATE INDEX "orders_store_id_type_idx" ON "orders"("store_id", "type");

-- CreateIndex
CREATE INDEX "orders_creator_id_idx" ON "orders"("creator_id");

-- CreateIndex
CREATE INDEX "product_stock_movements_product_id_createdAt_idx" ON "product_stock_movements"("product_id", "createdAt");

-- CreateIndex
CREATE INDEX "products_store_id_idx" ON "products"("store_id");

-- CreateIndex
CREATE INDEX "products_store_id_deleted_at_idx" ON "products"("store_id", "deleted_at");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_store_id_category_id_idx" ON "products"("store_id", "category_id");

-- CreateIndex
CREATE INDEX "products_creator_id_idx" ON "products"("creator_id");

-- CreateIndex
CREATE INDEX "promotion_offer_buy_items_offer_id_idx" ON "promotion_offer_buy_items"("offer_id");

-- CreateIndex
CREATE INDEX "promotion_offer_buy_items_product_id_idx" ON "promotion_offer_buy_items"("product_id");

-- CreateIndex
CREATE INDEX "promotion_offer_get_items_offer_id_idx" ON "promotion_offer_get_items"("offer_id");

-- CreateIndex
CREATE INDEX "promotion_offer_get_items_product_id_idx" ON "promotion_offer_get_items"("product_id");

-- CreateIndex
CREATE INDEX "promotion_offers_event_id_idx" ON "promotion_offers"("event_id");

-- CreateIndex
CREATE INDEX "provinces_geography_id_idx" ON "provinces"("geography_id");

-- CreateIndex
CREATE INDEX "stock_receipt_products_stock_id_idx" ON "stock_receipt_products"("stock_id");

-- CreateIndex
CREATE INDEX "stock_receipt_products_product_id_idx" ON "stock_receipt_products"("product_id");

-- CreateIndex
CREATE INDEX "stock_recepts_store_id_idx" ON "stock_recepts"("store_id");

-- CreateIndex
CREATE INDEX "stock_recepts_store_id_status_idx" ON "stock_recepts"("store_id", "status");

-- CreateIndex
CREATE INDEX "stock_recepts_store_id_action_at_idx" ON "stock_recepts"("store_id", "action_at");

-- CreateIndex
CREATE INDEX "store_roles_store_id_idx" ON "store_roles"("store_id");

-- CreateIndex
CREATE INDEX "store_roles_creator_id_idx" ON "store_roles"("creator_id");

-- CreateIndex
CREATE INDEX "sub_districts_district_id_idx" ON "sub_districts"("district_id");

-- CreateIndex
CREATE INDEX "users_global_role_id_idx" ON "users"("global_role_id");

-- CreateIndex
CREATE INDEX "zipcodes_sub_district_id_idx" ON "zipcodes"("sub_district_id");
