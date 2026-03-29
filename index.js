require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

// ✅ Use Prokerala API
const { getKundali } = require('./astro');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 💰 Razorpay setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔮 Generate Astrology Reading
app.post('/generate', async (req, res) => {
    try {
        const { name, dob, time, place } = req.body;

        if (!dob || !time) {
            return res.json({
                success: false,
                message: "Date and Time of Birth are required"
            });
        }

        // 📍 Temporary fixed coordinates (we improve later)
        const lat = 29.39;
        const lon = 76.96;

        // 🔮 Get real kundali data
        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali) {
            return res.json({
                success: false,
                message: "Astrology API failed"
            });
        }

        // 🌙 Extract planets
        const moon = kundali.find(p => p.name === "Moon");
        const sun = kundali.find(p => p.name === "Sun");

        let pastLife = "";

        if (moon) {
            pastLife += `Your Moon in ${moon.sign} reflects emotional karmic patterns. `;
        }

        if (sun) {
            pastLife += `Your Sun in ${sun.sign} shows your soul’s past responsibilities.`;
        }

        res.json({
            success: true,
            data: {
                pastLife,
                last2Hours: "Based on Moon transit, your mind was slightly restless recently.",
                next2Hours: "LOCKED"
            }
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.json({
            success: false,
            message: "Server error"
        });
    }
});

// 💰 Create Payment Order
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: 900,
            currency: "INR",
            receipt: "order_rcptid_11"
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error(error);
        res.status(500).send("Payment error");
    }
});

// 🚀 Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
