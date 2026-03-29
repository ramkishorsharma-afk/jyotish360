require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

// 🔮 Real astrology API
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

// ===============================
// 🔮 GENERATE ASTROLOGY READING
// ===============================
app.post('/generate', async (req, res) => {
    try {
        const { name, dob, time, place } = req.body;

        // ❗ Basic validation
        if (!dob || !time || !place) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // 👉 Temporary fixed coordinates (later we make dynamic)
        const lat = 29.5;
        const lon = 75.0;

        // 🔮 Call Prokerala API
        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali || !kundali.planet_position) {
            return res.json({
                success: false,
                message: "Astrology API failed"
            });
        }

        const planets = kundali.planet_position;

        // 🌙 Find planets
        const moon = planets.find(p => p.name === "Moon");
        const sun = planets.find(p => p.name === "Sun");

        // ===============================
        // 🔮 REAL ASTROLOGY TEXT
        // ===============================
        let pastLife = "";

if (moon) {
    pastLife += `Your Moon in ${moon.sign_name || "unknown"} shows deep emotional karmic patterns. `;
}

if (sun) {
    pastLife += `Your Sun in ${sun.sign_name || "unknown"} indicates your soul carried responsibilities in past life. `;
}

if (!pastLife) {
    pastLife = "Astrological insight could not be generated.";
}

        // ⏳ Last 2 hours logic
        let last2Hours = "You felt mentally stable with slight emotional fluctuations.";

        if (moon && moon.sign === "Scorpio") {
            last2Hours = "Recently you felt intense emotions and overthinking.";
        }

        res.json({
            success: true,
            data: {
                pastLife,
                last2Hours,
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


// ===============================
// 💰 PAYMENT ORDER
// ===============================
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: 900, // ₹9
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


// ===============================
// 🚀 SERVER START
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
