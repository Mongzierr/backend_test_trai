const prismaClient = require('@prisma/client').PrismaClient;
const prisma = new prismaClient();

const createTransaction = async (fromUserId, toUserId, cryptoId, amount, fiatAmount, transactionType) => {
  return await prisma.transaction.create({
    data: {
      from_user_id: fromUserId,
      to_user_id: toUserId,
      crypto_id: cryptoId,
      amount: amount,
      fiat_amount: fiatAmount,
      transaction_type: transactionType,
    },
  });
};

module.exports = {
  createTransaction,
};