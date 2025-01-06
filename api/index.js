const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
        amount: amount * 100, // amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
