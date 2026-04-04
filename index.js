const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

// Internal Modules
const { getKundali } = require('./astro');
const { interpretKarmicSymptoms } = require('./Interpreter');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔮 MAIN API: Astrology Generation
app.post('/generate', async (req, res) => {
    try {
        let { dob, time, place, isPaid } = req.body;

        // Date formatting logic (DD-MM-YYYY to YYYY-MM-DD)
        if (dob.includes('-') && dob.split('-')[0].length === 2) {
            const [d, m, y] = dob.split('-');
            dob = `${y}-${m}-${d}`;
        }

        // Hardcoded Rohtak coordinates for now (update to dynamic later)
        const lat = 28.89; 
        const lon = 76.61;

        // 1. Get raw data from our Swiss Ephemeris engine
        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali || !kundali.planets) {
            return res.status(500).json({
                success: false,
                message: "Swiss Ephemeris Calculation Failed"
            });
        }

        // 2. Interpret the raw math into human language
        const karma = interpretKarmicSymptoms(kundali.planets, dob);

        // 3. Construct the response with Lal Kitab & Vastu focus
        res.json({
            success: true,
            data: {
                kundali: {
                    planets: kundali.planets,
                    ascendant: kundali.ascendant
                },
                karmaScore: kundali.luckScore, // Directly from our new engine
                shockLine: karma.shockLine,
                lifeEvents: karma.lifeEvents, // Past life/major events with years
                symptoms: karma.symptoms, // "Symptom caused by X planet"
                remedies: karma.remedies, // Lal Kitab: Salt, Rituals, etc.
                vastuTips: karma.vastuTips, // Added Vastu logic based on directional inputs
                last2Hours: karma.last2Hours,
                // Only show prediction if payment is confirmed
                next2Hours: isPaid ? karma.next2Hours : "LOCKED_PAYMENT_REQUIRED",
                language: req.body.lang || "en" // Supports hi/en
            }
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Error: " + error.message
        });
    }
});

// 💰 Payment: Create Order
app.post('/create-order', async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: 19900, // Changed to ₹199.00 (standard for reports)
            currency: "INR",
            receipt: "receipt_jw_" + Date.now(),
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Jyotish360 Server running on http://localhost:${PORT}`));
