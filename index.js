require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const { getKundali } = require('./astro');
const { interpretKarmicSymptoms } = require('./Interpreter');

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/generate', async (req, res) => {
    try {
        let { dob, time, place } = req.body;

        // DATE FIXER: Converts DD-MM-YYYY to YYYY-MM-DD for Prokerala
        if (dob.includes('-') && dob.split('-')[0].length === 2) {
            const [d, m, y] = dob.split('-');
            dob = `${y}-${m}-${d}`;
        }

        // Default coordinates for Tohana, Haryana
        const lat = 29.71; 
        const lon = 75.83;

        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali || !kundali.planet_position) {
            return res.json({ success: false, message: "Astrology API failed to return data" });
        }

        const planets = kundali.planet_position;
        
        // Call the Hybrid OpenAI Interpreter
        const aiData = await interpretKarmicSymptoms(planets);

        const moon = planets.find(p => p.name.toLowerCase() === "moon");

        res.json({
            success: true,
            data: {
                kundali: {
                    moonSign: moon?.rasi?.name || "Unknown",
                    planets: planets.map(p => ({ name: p.name, sign: p.rasi?.name }))
                },
                pastLife: pastLife,
                next2Hours: "LOCKED"
            }
        });

    } catch (error) {
        res.json({ success: false, message: "Server error" });
    }
});

app.post('/create-order', async (req, res) => {
    const order = await razorpay.orders.create({
        amount: 9900, // ₹99
        currency: "INR"
    });
    res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
