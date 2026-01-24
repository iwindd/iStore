/*
  Warnings:

  - You are about to drop the column `address` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `postalcode` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `stores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stores" DROP COLUMN "address",
DROP COLUMN "area",
DROP COLUMN "district",
DROP COLUMN "postalcode",
DROP COLUMN "province";

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "address_line" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sub_district_id" INTEGER NOT NULL,
    "zipcode_snapshot" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" SERIAL NOT NULL,
    "label" TEXT,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_addresses" (
    "id" SERIAL NOT NULL,
    "store_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "store_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geography" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "geography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "geography_id" INTEGER NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_districts" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,

    CONSTRAINT "sub_districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zipcodes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "sub_district_id" INTEGER NOT NULL,

    CONSTRAINT "zipcodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_addresses_user_id_is_main_key" ON "user_addresses"("user_id", "is_main");

-- CreateIndex
CREATE UNIQUE INDEX "store_addresses_store_id_is_main_key" ON "store_addresses"("store_id", "is_main");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "geography_code_country_id_key" ON "geography"("code", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_code_geography_id_key" ON "provinces"("code", "geography_id");

-- CreateIndex
CREATE UNIQUE INDEX "districts_code_province_id_key" ON "districts"("code", "province_id");

-- CreateIndex
CREATE UNIQUE INDEX "sub_districts_code_district_id_key" ON "sub_districts"("code", "district_id");

-- CreateIndex
CREATE UNIQUE INDEX "zipcodes_code_sub_district_id_key" ON "zipcodes"("code", "sub_district_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_sub_district_id_fkey" FOREIGN KEY ("sub_district_id") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_addresses" ADD CONSTRAINT "store_addresses_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_addresses" ADD CONSTRAINT "store_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geography" ADD CONSTRAINT "geography_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_geography_id_fkey" FOREIGN KEY ("geography_id") REFERENCES "geography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_districts" ADD CONSTRAINT "sub_districts_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zipcodes" ADD CONSTRAINT "zipcodes_sub_district_id_fkey" FOREIGN KEY ("sub_district_id") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
