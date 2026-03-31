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
            day: +day,
            month: +month,
            year: +year,
            hour: +hour,
            min: +min,
            lat,
            lon,
            tzone: 5.5
        };

        const response = await axios.post(
            'https://json.astrologyapi.com/v1/planets/extended',
            payload,
            { auth }
        );

        console.log("🔍 FULL RESPONSE:", JSON.stringify(response.data, null, 2));

        // 🔥 HANDLE ALL POSSIBLE STRUCTURES
        let planetsArray = null;

        if (Array.isArray(response.data)) {
            planetsArray = response.data;
        } else if (Array.isArray(response.data.planets)) {
            planetsArray = response.data.planets;
        } else if (Array.isArray(response.data.output)) {
            planetsArray = response.data.output;
        } else if (Array.isArray(response.data.data)) {
            planetsArray = response.data.data;
        }

        if (!planetsArray) {
            throw new Error("No planets array found in API response");
        }

        const planets = planetsArray.map(p => ({
            name: p.name || p.planet,
            rasi: { name: p.sign || p.rasi }
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
