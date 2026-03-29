require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

const { getKundali } = require('./astro');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

        if (!dob || !time || !place) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // 👉 TEMP location (we fix dynamic later)
        const lat = 29.5;
        const lon = 75.0;

        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali || !kundali.planet_position) {
            return res.json({
                success: false,
                message: "Astrology API failed"
            });
        }

        const planets = kundali.planet_position;
console.log("PLANETS DATA:", JSON.stringify(planets, null, 2));
        // 🌙 Moon + ☀️ Sun
       const moon = planets.find(p => p.name === "Moon");
       const sun = planets.find(p => p.name === "Sun");

const planetList = planets.map(p => ({
    name: p.name,
    sign: p.rasi || "Unknown"
}));

        // 🌟 Nakshatra
        const nakshatra = moon?.nakshatra || "Unknown";
const pada = moon?.pada || "";

   
        // 🔮 Prediction
        let pastLife = "";

        if (moon) {
            pastLife += `Your Moon in ${moon.rasi} and Nakshatra ${nakshatra} shows emotional karmic patterns. `;
        }

        if (sun) {
            pastLife += `Your Sun in ${sun.rasi} indicates your soul carried responsibilities in past life. `;
        }

        if (!pastLife) {
            pastLife = "Astrological insight could not be generated.";
        }

        res.json({
    success: true,
    data: {
        kundali: {
            moonSign: moon?.rasi || "Unknown",
            sunSign: sun?.rasi || "Unknown",
            nakshatra: nakshatra,
            pada: pada,
            lagna: "Coming Next Step 🔥",
            planets: planetList
        },
        pastLife,
        last2Hours: "Recent Moon transit shows slight mental fluctuations.",
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
// 💰 PAYMENT
// ===============================
app.post('/create-order', async (req, res) => {
    const order = await razorpay.orders.create({
        amount: 900,
        currency: "INR"
    });
    res.json(order);
});

// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
