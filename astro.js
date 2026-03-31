const axios = require('axios');
require('dotenv').config();

const auth = {
    username: process.env.ASTROLOGY_API_USER_ID,
    password: process.env.ASTROLOGY_API_KEY
};

async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split('-');
        const [hour, min] = time.split(':');

        const payload = {
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year),
            hour: parseInt(hour),
            min: parseInt(min),
            lat,
            lon,
            tzone: 5.5
        };

        const response = await axios.post(
            'https://json.astrologyapi.com/v1/planets/extended',
            payload,
            { auth }
        );

        console.log("🔍 RAW API:", response.data); // DEBUG

        // ✅ FIX HERE
        const planetsArray = response.data?.planets || response.data;

        if (!Array.isArray(planetsArray)) {
            throw new Error("Invalid API response format");
        }

        const planets = planetsArray.map(p => ({
            name: p.name,
            rasi: { name: p.sign }
        }));

        return {
            planet_position: planets
        };

    } catch (error) {
        console.error("❌ ASTRO ERROR:");
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
        console.error("Message:", error.message);
        return null;
    }
}

module.exports = { getKundali };
