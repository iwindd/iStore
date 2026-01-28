-- CreateIndex
CREATE INDEX "districts_province_id_idx" ON "districts"("province_id");

-- CreateIndex
CREATE INDEX "geography_country_id_idx" ON "geography"("country_id");

-- CreateIndex
CREATE INDEX "provinces_geography_id_idx" ON "provinces"("geography_id");

-- CreateIndex
CREATE INDEX "sub_districts_district_id_idx" ON "sub_districts"("district_id");

-- CreateIndex
CREATE INDEX "zipcodes_sub_district_id_idx" ON "zipcodes"("sub_district_id");
