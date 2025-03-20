/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `Cryptocurrency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cryptocurrency_symbol_key" ON "Cryptocurrency"("symbol");
