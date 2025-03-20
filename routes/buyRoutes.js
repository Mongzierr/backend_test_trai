const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { buyCrypto } = require('../models/buyOrder');
const prisma = new PrismaClient(); 
const router = express.Router();

router.post('/', async (req, res) => {
    const { buyerId, sellOrderId, fiatAmount } = req.body;
    if (!buyerId || !sellOrderId || !fiatAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const result = await buyCrypto(buyerId, sellOrderId, fiatAmount);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const buyOrders = await prisma.buyOrder.findMany({ where: { user_id: userId } });
        res.status(200).json(buyOrders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching buy orders', error: err });
        console.log(err)
    }
});

module.exports = router;
