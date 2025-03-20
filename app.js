// app.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const sellOrderRoutes = require('./routes/sellRoutes');
const buyOrderRoutes = require('./routes/buyRoutes');
const walletRoutes = require('./routes/walletRoutes');
const fiatRoutes = require('./routes/fiatRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/sellOrders', sellOrderRoutes);
app.use('/buyOrders', buyOrderRoutes);
app.use('/wallet', walletRoutes);
app.use('/fiat', fiatRoutes);
app.use('/crypto', cryptoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
