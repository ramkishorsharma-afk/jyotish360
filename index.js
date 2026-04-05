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

// ✅ Serve frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Razorpay Setup (Ensure these are in your Render Environment Variables)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔮 MAIN API: Astrology Generation
app.post('/generate', async (req, res) => {
    try {
        let { dob, time, place, isPaid } = req.body;

        if (!dob || !time) {
            return res.status(400).json({ success: false, message: "Date and Time are required" });
        }

        // Date formatting logic (Handles DD-MM-YYYY to YYYY-MM-DD for the engine)
        if (dob.includes('-') && dob.split('-')[0].length === 2) {
            const [d, m, y] = dob.split('-');
            dob = `${y}-${m}-${d}`;
        }

        // Hardcoded Rohtak coordinates (You are based here)
        const lat = 28.89; 
        const lon = 76.61;

        // 1. Get raw planetary positions from Swiss Ephemeris
        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali || !kundali.planets) {
            return res.status(500).json({
                success: false,
                message: "Swiss Ephemeris Calculation Failed"
            });
        }

        // 2. Interpret the raw math into Lal Kitab & Vastu insights
        const karma = interpretKarmicSymptoms(kundali.planets, dob);

        // 3. Construct the response
        res.json({
            success: true,
            data: {
                kundali: {
                    planets: kundali.planets,
                    ascendant: kundali.ascendant
                },
                // FIX: Use 'karma.karmaScore' from the interpreter, not 'kundali.luckScore'
                karmaScore: karma.karmaScore, 
                shockLine: karma.shockLine,
                lifeEvents: karma.lifeEvents, 
                symptoms: karma.symptoms, 
                remedies: karma.remedies, 
                vastuTips: karma.vastuTips, 
                last2Hours: karma.last2Hours,
                // Prediction locking logic
                next2Hours: isPaid ? karma.next2Hours : "LOCKED_PAYMENT_REQUIRED",
                language: req.body.lang || "en"
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
            amount: 19900, // ₹199.00
            currency: "INR",
            receipt: "receipt_jw_" + Date.now(),
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use Render's dynamic port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Jyotish360 Server running on port ${PORT}`));
