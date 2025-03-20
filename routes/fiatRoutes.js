const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const router = express.Router();
const axios = require('axios');

router.post('/deposit', async (req, res) => {
    const { userId, amount, fiatType } = req.body;
    if (!userId || !amount || !fiatType) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        let convertedAmount = amount;
        if (fiatType === 'THB') {
            const exchangeRate = await getExchangeRate('THB', 'USD');
            convertedAmount = amount * exchangeRate;
        }
        await prisma.fiatTransaction.create({
            data: { user_id: userId, amount, fiat_type: fiatType, transaction_type: "Deposit" }
        });
        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: { fiat_balance: { increment: convertedAmount } }
        });
        res.status(201).json({
            message: fiatType === 'THB' 
                ? `Successfully deposited ${amount} THB (${convertedAmount.toFixed(2)} USD)` 
                : `Successfully deposited ${amount} ${fiatType}`,
            fiat_balance: updatedUser.fiat_balance
        });
    } catch (err) {
        res.status(500).json({ message: 'Error depositing funds', error: err });
    }
});

async function getExchangeRate(fromCurrency, toCurrency) {
    const url = `https://v6.exchangerate-api.com/v6/4d0da7f3eda6b60e7af60f75/latest/${fromCurrency}`;
    try {
        const response = await axios.get(url);
        if (!response.data || !response.data.conversion_rates || !response.data.conversion_rates[toCurrency]) {
            throw new Error(`Exchange rate for ${toCurrency} not found`);
        }
        return response.data.conversion_rates[toCurrency];
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        throw new Error('Error fetching exchange rate');
    }
}

router.post('/withdraw', async (req, res) => {
    const { userId, amount, fiatType } = req.body;
    if (!userId || !amount || !fiatType) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const totalDeposits = await prisma.fiatTransaction.aggregate({
            where: { user_id: userId, transaction_type: "Deposit", fiat_type: fiatType },
            _sum: { amount: true }
        });
        const totalWithdrawals = await prisma.fiatTransaction.aggregate({
            where: { user_id: userId, transaction_type: "Withdraw", fiat_type: fiatType },
            _sum: { amount: true }
        });
        const balance = (totalDeposits._sum.amount || 0) - (totalWithdrawals._sum.amount || 0);
        if (balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        const withdrawal = await prisma.fiatTransaction.create({
            data: { user_id: userId, amount, fiat_type: fiatType, transaction_type: "Withdraw" }
        });
        res.status(201).json({ message: "Withdraw successful", withdrawal });
    } catch (err) {
        res.status(500).json({ message: 'Error processing withdrawal', error: err });
    }
});

router.get('/transactions/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const fiatTransactions = await prisma.fiatTransaction.findMany({ where: { user_id: Number(userId) } });
        res.status(200).json(fiatTransactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching crypto transactions', error: err });
    }
});

module.exports = router;
