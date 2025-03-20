const express = require('express');
const { PrismaClient } = require('@prisma/client'); // import Prisma client
const prisma = new PrismaClient(); // import Prisma client if necessary
const router = express.Router();

router.post('/add', async (req, res) => {
    const { userId, cryptoId, amount } = req.body;
    try {
        const cryptocurrency = await prisma.cryptocurrency.findUnique({ where: { crypto_id: cryptoId } });
        if (!cryptocurrency) {
            return res.status(400).json({ message: 'Cryptocurrency not found' });
        }

        const wallet = await prisma.cryptoWallet.findFirst({ where: { user_id: userId, crypto_id: cryptoId } });
        if (wallet) {
            await prisma.cryptoWallet.update({ where: { wallet_id: wallet.wallet_id }, data: { balance: wallet.balance + amount } });
            res.status(200).json({ message: `Successfully added ${amount} to wallet`, wallet: { userId, cryptoId, balance: wallet.balance + amount } });
        } else {
            await prisma.cryptoWallet.create({ data: { user_id: userId, crypto_id: cryptoId, balance: amount } });
            res.status(200).json({ message: `Successfully added ${amount} to wallet`, wallet: { userId, cryptoId, balance: amount } });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error adding cryptocurrency to wallet', error: err });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const wallets = await prisma.cryptoWallet.findMany({
            where: { user_id: Number(userId) },
            include: { cryptocurrency: true }
        });
        res.status(200).json({ wallets });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
});


module.exports = router;
