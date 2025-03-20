-- CreateTable
CREATE TABLE "SellOrder" (
    "sell_order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "crypto_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fiat_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellOrder_pkey" PRIMARY KEY ("sell_order_id")
);

-- CreateTable
CREATE TABLE "BuyOrder" (
    "buy_order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "crypto_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fiat_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyOrder_pkey" PRIMARY KEY ("buy_order_id")
);

-- AddForeignKey
ALTER TABLE "SellOrder" ADD CONSTRAINT "SellOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellOrder" ADD CONSTRAINT "SellOrder_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency"("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyOrder" ADD CONSTRAINT "BuyOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyOrder" ADD CONSTRAINT "BuyOrder_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency"("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE;
