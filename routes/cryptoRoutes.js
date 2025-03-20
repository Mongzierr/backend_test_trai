const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const router = express.Router();

router.get('/transactions/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cryptoTransactions = await prisma.transaction.findMany({
            where: { OR: [{ from_user_id: Number(userId) }, { to_user_id: Number(userId) }] }
        });
        res.status(200).json(cryptoTransactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching crypto transactions', error: err });
    }
});

module.exports = router;
