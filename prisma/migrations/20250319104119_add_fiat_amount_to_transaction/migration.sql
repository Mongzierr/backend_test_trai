/*
  Warnings:

  - Added the required column `fiat_amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fiat_amount" DOUBLE PRECISION NOT NULL;
