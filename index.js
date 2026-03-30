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

app.post('/generate', async (req, res) => {
    try {
        const { name, dob, time, place } = req.body;

        if (!dob || !time || !place) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // TEMP location - suggest getting these from Google Places API later
        const lat = 28.6139; // Delhi
        const lon = 77.2090;

        const kundali = await getKundali(dob, time, lat, lon);

        // Debugging: This helps you see the actual API structure in your terminal
        console.log("FULL API RESPONSE:", JSON.stringify(kundali, null, 2));

        if (!kundali || (!kundali.planet_position && !kundali.output)) {
            return res.json({ success: false, message: "Astrology API failed to return data" });
        }

        // Handle different API structures (some use .planet_position, some use .output)
        const planets = kundali.planet_position || kundali.output;

        // Search for Sun and Moon (Case Insensitive)
        const moon = planets.find(p => p.name.toLowerCase() === "moon");
        const sun = planets.find(p => p.name.toLowerCase() === "sun");

        const planetList = planets.map(p => ({
            name: p.name,
            sign: p.rasi || p.sign || "Unknown", // Checks both common names
            house: p.house || "N/A"
        }));

        const nakshatra = moon?.nakshatra || "Unknown";
        const pada = moon?.pada || "";

        // 🔮 AI Interpretation Logic (Past Life)
        let pastLife = "";
        if (moon) {
            pastLife += `Your Moon in ${moon.rasi || moon.sign} and Nakshatra ${nakshatra} reveals deep emotional karmic imprints from your previous birth. `;
        }
        if (sun) {
            pastLife += `Your Sun position indicates a soul that held great spiritual authority. `;
        }

        res.json({
            success: true,
            data: {
                kundali: {
                    moonSign: moon?.rasi || moon?.sign || "Unknown",
                    sunSign: sun?.rasi || sun?.sign || "Unknown",
                    nakshatra: nakshatra,
                    pada: pada,
                    planets: planetList
                },
                pastLife: pastLife || "The stars are silent on your past today.",
                last2Hours: "Recent Moon transit shows mental fluctuations.",
                next2Hours: "LOCKED"
            }
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.json({ success: false, message: "Internal Server Error" });
    }
});

app.post('/create-order', async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: 9900, // ₹99.00 (9900 paise)
            currency: "INR",
            receipt: "receipt_" + Math.random()
        });
        res.json(order);
    } catch (e) {
        res.status(500).send(e);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🔮 Jyotish360 Backend running on port " + PORT);
});
