const prismaClient = require('@prisma/client').PrismaClient;
const prisma = new prismaClient();

const createUser = async (username, email, phone_number, password) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      phone_number,
      password,
    },
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

module.exports = {
  createUser,
  getUserByEmail,
};