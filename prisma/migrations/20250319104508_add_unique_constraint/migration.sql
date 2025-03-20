/*
  Warnings:

  - A unique constraint covering the columns `[user_id,crypto_id]` on the table `CryptoWallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CryptoWallet_user_id_crypto_id_key" ON "CryptoWallet"("user_id", "crypto_id");
