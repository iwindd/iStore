/*
  Warnings:

  - You are about to alter the column `address_line` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `zipcode_snapshot` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `label` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `note` on the `consignments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(2)`.
  - You are about to alter the column `name` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `nameEn` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `nameEn` on the `districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `code` on the `districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - You are about to alter the column `note` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `code` on the `geography` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - You are about to alter the column `name` on the `geography` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `nameEn` on the `geography` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `name` on the `global_permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `label` on the `global_roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `note` on the `order_preorders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `total` on the `order_preorders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `profit` on the `order_preorders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `cost` on the `order_preorders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `cost` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `note` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `profit` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `total` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `cost` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `profit` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `note` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `total` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `serial` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `label` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `code` on the `provinces` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - You are about to alter the column `name` on the `provinces` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `nameEn` on the `provinces` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `note` on the `stock_recepts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `store_permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `store_roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `store_roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `slug` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `code` on the `sub_districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - You are about to alter the column `name` on the `sub_districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `nameEn` on the `sub_districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `label` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `code` on the `zipcodes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "address_line" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "zipcode_snapshot" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "label" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "consignments" ALTER COLUMN "note" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "countries" ALTER COLUMN "code" SET DATA TYPE CHAR(2),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "districts" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "code" SET DATA TYPE CHAR(10);

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "note" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "geography" ALTER COLUMN "code" SET DATA TYPE CHAR(10),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "global_permissions" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "global_roles" ALTER COLUMN "label" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "order_preorders" ALTER COLUMN "note" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "order_products" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "note" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "note" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "serial" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "label" SET DATA TYPE VARCHAR(60);

-- AlterTable
ALTER TABLE "provinces" ALTER COLUMN "code" SET DATA TYPE CHAR(10),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "stock_recepts" ALTER COLUMN "note" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "store_permissions" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "store_roles" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "sub_districts" ALTER COLUMN "code" SET DATA TYPE CHAR(10),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "nameEn" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "user_addresses" ALTER COLUMN "label" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "zipcodes" ALTER COLUMN "code" SET DATA TYPE CHAR(10);
