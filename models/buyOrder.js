const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function buyCrypto(buyerId, sellOrderId, fiatAmount) {
    try {
        const sellOrder = await prisma.sellOrder.findUniqueOrThrow({
            where: { sell_order_id: sellOrderId }
        });

        const buyer = await prisma.user.findUniqueOrThrow({
            where: { user_id: buyerId }
        });

        if (buyer.fiat_balance < fiatAmount) {
            throw new Error('Insufficient balance');
        }

        const cryptoAmountToBuy = (fiatAmount / sellOrder.fiat_amount) * sellOrder.amount;

        if (cryptoAmountToBuy > sellOrder.amount) {
            throw new Error('Not enough crypto in sell order');
        }

        const updatedWallet = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { user_id: buyerId },
                data: { fiat_balance: { decrement: fiatAmount } }
            });

            await tx.user.update({
                where: { user_id: sellOrder.user_id },
                data: { fiat_balance: { increment: fiatAmount } }
            });

            const wallet = await tx.cryptoWallet.upsert({
                where: {
                    user_id_crypto_id: {
                        user_id: buyerId,
                        crypto_id: sellOrder.crypto_id
                    }
                },
                update: {
                    balance: { increment: cryptoAmountToBuy }
                },
                create: {
                    user_id: buyerId,
                    crypto_id: sellOrder.crypto_id,
                    balance: cryptoAmountToBuy
                },
                select: { balance: true }
            });

            if (cryptoAmountToBuy === sellOrder.amount) {
                await tx.sellOrder.delete({
                    where: { sell_order_id: sellOrderId }
                });
            } else {
                await tx.sellOrder.update({
                    where: { sell_order_id: sellOrderId },
                    data: { amount: { decrement: cryptoAmountToBuy } }
                });
            }

            await tx.transaction.create({
                data: {
                    fiat_amount: fiatAmount,
                    amount: cryptoAmountToBuy,
                    transaction_type: "purchase",
                    from_user: { connect: { user_id: sellOrder.user_id } },
                    to_user: { connect: { user_id: buyerId } },
                    cryptocurrency: { connect: { crypto_id: sellOrder.crypto_id } }
                }
            });

            await tx.buyOrder.create({
                data: {
                    amount: cryptoAmountToBuy,
                    fiat_amount: fiatAmount,
                    status: 'completed',
                    user: { connect: { user_id: buyerId } },
                    cryptocurrency: { connect: { crypto_id: sellOrder.crypto_id } }
                }
            });

            return wallet;
        });

        return {
            message: `Successfully purchased ${cryptoAmountToBuy} crypto for ${fiatAmount} fiat`,
            newBalance: updatedWallet.balance
        };

    } catch (err) {
        throw new Error(`Error processing purchase: ${err.message}`);
    }
}

module.exports = { buyCrypto };
