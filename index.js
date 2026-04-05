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
app.use(express.static(path.join(__dirname, 'public')));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/generate', async (req, res) => {
    try {
        let { dob, time, isPaid } = req.body;

        // Default to Rohtak coordinates
        const lat = 28.89; 
        const lon = 76.61;

        const kundali = await getKundali(dob, time, lat, lon);
        const karma = interpretKarmicSymptoms(kundali.planets, dob);

        res.json({
            success: true,
            data: {
                kundali: {
                    planets: kundali.planets,
                    ascendant: kundali.ascendant
                },
                karmaScore: karma.karmaScore, 
                shockLine: karma.shockLine,
                lifeEvents: karma.lifeEvents, 
                symptoms: karma.symptoms, 
                remedies: karma.remedies, 
                vastuTips: karma.vastuTips, 
                last2Hours: karma.last2Hours,
                next2Hours: isPaid ? karma.next2Hours : "LOCKED_PAYMENT_REQUIRED"
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
