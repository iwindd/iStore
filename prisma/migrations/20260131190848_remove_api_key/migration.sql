/*
  Warnings:

  - You are about to drop the column `api_key` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the `line_bot_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "line_bot_configs" DROP CONSTRAINT "line_bot_configs_store_id_fkey";

-- DropIndex
DROP INDEX "stores_api_key_key";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "api_key";

-- DropTable
DROP TABLE "line_bot_configs";
