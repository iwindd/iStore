-- CreateTable
CREATE TABLE "line_bot_configs" (
    "id" TEXT NOT NULL,
    "lineUserId" TEXT NOT NULL,
    "lineChannelAccessToken" TEXT NOT NULL,
    "lineChannelSecret" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_bot_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "line_bot_configs_store_id_key" ON "line_bot_configs"("store_id");

-- AddForeignKey
ALTER TABLE "line_bot_configs" ADD CONSTRAINT "line_bot_configs_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
