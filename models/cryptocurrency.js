const prismaClient = require('@prisma/client').PrismaClient;
const prisma = new prismaClient();

const getCryptocurrencies = async () => {
  return await prisma.cryptocurrency.findMany();
};

module.exports = {
  getCryptocurrencies,
};