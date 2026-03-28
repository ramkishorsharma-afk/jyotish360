require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

const { interpretKarmicSymptoms } = require('./Interpreter');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ FREE READING API
app.post('/generate', async (req, res) => {
    const { name, dob, place } = req.body;

    const symptoms = ["overthinking", "emotional burden"];
    const planetData = { dob, place };

    const pastLife = await interpretKarmicSymptoms(symptoms, planetData);

    res.json({
        success: true,
        data: {
            pastLife,
            last2Hours: "Recently you felt slightly distracted. A small thing may have irritated you.",
            next2Hours: "LOCKED"
        }
    });
});

// ✅ CREATE PAYMENT ORDER
app.post('/create-order', async (req, res) => {
    const options = {
        amount: 900, // ₹9
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
