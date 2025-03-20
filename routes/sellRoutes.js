const express = require('express');
const sellOrderModel = require('../models/sellOrder');
const { PrismaClient } = require('@prisma/client'); // import Prisma client
const prisma = new PrismaClient(); 
const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, cryptoId, amount, fiatAmount } = req.body;
    if (!userId || !cryptoId || !amount || !fiatAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const sellOrder = await sellOrderModel.createSellOrder(userId, cryptoId, amount, fiatAmount);
        res.status(201).json({ message: "Sell order created successfully", sellOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
});

router.get('/', async (req, res) => {
    try {
        const openOrders = await sellOrderModel.getOpenSellOrders();
        res.status(200).json(openOrders);
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
});

router.get('/:id', async (req, res) => {
    const sellOrderId = parseInt(req.params.id);
    try {
        const sellOrder = await prisma.sellOrder.findUnique({
            where: { sell_order_id: sellOrderId },
            include: { cryptocurrency: true, user: true }
        });
        if (!sellOrder) {
            return res.status(404).json({ message: 'Sell Order not found' });
        }
        res.status(200).json(sellOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sell order', error: error.message });
        console.log(err)
    }
});

module.exports = router;
