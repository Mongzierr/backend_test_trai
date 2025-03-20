const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // เพิ่มผู้ใช้ตัวอย่าง
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      username: 'user1',
      email: 'user1@example.com',
      phone_number: '1234567890',
      password: 'hashedpassword1',
      fiat_balance: 1000,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      username: 'user2',
      email: 'user2@example.com',
      phone_number: '0987654321',
      password: 'hashedpassword2',
      fiat_balance: 2000,
    },
  });

 const btc = await prisma.cryptocurrency.upsert({
    where: { symbol: 'BTC' },
    update: {},
    create: {
      name: 'Bitcoin',
      symbol: 'BTC',
      price_usd: 45000,
      crypto_id: 1,
    },
  });

  const eth = await prisma.cryptocurrency.upsert({
    where: { symbol: 'ETH' },
    update: {},
    create: {
      name: 'Ethereum',
      symbol: 'ETH',
      price_usd: 3000,
      crypto_id: 2,
    },
  });

  
  await prisma.cryptoWallet.createMany({
    data: [
      { user_id: user1.user_id, crypto_id: btc.crypto_id, balance: 0.5 },
      { user_id: user2.user_id, crypto_id: eth.crypto_id, balance: 2 },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
