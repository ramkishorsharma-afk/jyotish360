const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { getKundali } = require('./astro');
const { interpretKarmicSymptoms } = require('./Interpreter');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔮 MAIN API
app.post('/generate', async (req, res) => {
    try {
        let { dob, time, place } = req.body;

        // Convert DD-MM-YYYY → YYYY-MM-DD
        if (dob.includes('-') && dob.split('-')[0].length === 2) {
            const [d, m, y] = dob.split('-');
            dob = `${y}-${m}-${d}`;
        }

        const lat = 29.71;
        const lon = 75.83;

        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali) {
            return res.json({ success: false, message: "Astrology API failed" });
        }

        const planets = kundali.planet_position;

        const karma = await interpretKarmicSymptoms(planets, dob);

        res.json({
            success: true,
            data: {
                kundali: {
                    planets: planets
                },
                karmaScore: karma.karmaScore,
                shockLine: karma.shockLine,
                lifeEvents: karma.lifeEvents,
                symptoms: karma.symptoms,
                last2Hours: karma.last2Hours
            }
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});

app.listen(3000, () => console.log("🚀 Server running"));
