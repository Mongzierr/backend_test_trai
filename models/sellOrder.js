const prismaClient = require('@prisma/client').PrismaClient;
const prisma = new prismaClient();

const createSellOrder = async (userId, cryptoId, amount, fiatAmount) => {
  return await prisma.sellOrder.create({
    data: {
      user_id: userId,
      crypto_id: cryptoId,
      amount: amount,
      fiat_amount: fiatAmount,
      status: 'open',
    },
  });
};

const getOpenSellOrders = async () => {
  return await prisma.sellOrder.findMany({
    where: { status: 'open' },
    include: {
      cryptocurrency: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

const getSellOrderById = async (sellOrderId) => {
  return await prisma.sellOrder.findUnique({
    where: { sell_order_id: sellOrderId },
  });
};

const updateSellOrder = async (sellOrderId, amountBought) => {
  const sellOrder = await prisma.sellOrder.findUnique({ where: { sell_order_id: sellOrderId } });

  if (!sellOrder) throw new Error('Sell Order not found');

  const remainingAmount = sellOrder.amount - amountBought;

  if (remainingAmount <= 0) {

     await prisma.sellOrder.delete({
       where: { sell_order_id: sellOrderId }
     });

  } else {
    await prisma.sellOrder.update({
      where: { sell_order_id: sellOrderId },
      data: { amount: remainingAmount }
    });
  }
};

module.exports = {
  createSellOrder,
  getOpenSellOrders,
  getSellOrderById, updateSellOrder,
};
