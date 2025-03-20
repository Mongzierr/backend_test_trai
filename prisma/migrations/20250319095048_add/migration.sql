/*
  Warnings:

  - You are about to drop the column `created_at` on the `BuyOrder` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SellOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BuyOrder" DROP COLUMN "created_at",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "SellOrder" DROP COLUMN "created_at",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'open';
