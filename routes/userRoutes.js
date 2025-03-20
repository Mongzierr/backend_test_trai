const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, phone_number, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.createUser(username, email, phone_number, hashedPassword);
        res.status(201).json({ message: "User registered successfully", result });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        res.status(201).json({ message: "Login successful", userId: user.user_id });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
});

router.get('/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({ where: { user_id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
        console.log(err)
    }
});

module.exports = router;