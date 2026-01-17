-- CreateTable
CREATE TABLE "line_applications" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "channelAccessToken" TEXT NOT NULL,
    "channelSecret" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "useAsChatbot" BOOLEAN NOT NULL DEFAULT false,
    "useAsBroadcast" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_id" TEXT NOT NULL,

    CONSTRAINT "line_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "line_applications_key_key" ON "line_applications"("key");

-- AddForeignKey
ALTER TABLE "line_applications" ADD CONSTRAINT "line_applications_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
