const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

const { getKundali } = require('./astro');
const { interpretKarmicSymptoms } = require('./Interpreter');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ RAZORPAY SETUP
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔮 MAIN API
app.post('/generate', async (req, res) => {
    try {
        let { dob, time, place } = req.body;

        // DATE FIXER: Converts DD-MM-YYYY → YYYY-MM-DD
        if (dob.includes('-') && dob.split('-')[0].length === 2) {
            const [d, m, y] = dob.split('-');
            dob = `${y}-${m}-${d}`;
            const kundliDiv = document.getElementById("kundli");

data.data.kundali.planets.forEach(p => {
    kundliDiv.innerHTML += `
        <p>${p.name} → ${p.sign}</p>
    `;
});
        }

        // Default coordinates (Tohana)
        const lat = 29.71;
        const lon = 75.83;

        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali || !kundali.planet_position) {
            return res.json({
                success: false,
                message: "Astrology API failed"
            });
        }

        const planets = kundali.planet_position;

        // ✅ FIXED: pass dob + use correct variable
        const karma = await interpretKarmicSymptoms(planets, dob);

        const moon = planets.find(
            p => p.name.toLowerCase() === "moon"
        );

        res.json({
            success: true,
            data: {
                kundali: {
                    moonSign: moon?.rasi?.name || "Unknown",
                    planets: planets.map(p => ({
                        name: p.name,
                        sign: p.rasi?.name
                    }))
                },
                karmaScore: karma.karmaScore,
                shockLine: karma.shockLine,
                lifeEvents: karma.lifeEvents,
                symptoms: karma.symptoms,
                last2Hours: karma.last2Hours,
                remedies: karma.remedies,
                next2Hours: "LOCKED"
            }
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
});

// 💰 CREATE ORDER
app.post('/create-order', async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: 9900, // ₹99
            currency: "INR"
        });

        res.json(order);
    } catch (error) {
        console.error("❌ Payment Error:", error);
        res.json({ success: false });
    }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server running on " + PORT);
});
