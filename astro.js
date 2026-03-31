const axios = require('axios');
require('dotenv').config();

const USER_ID = process.env.ASTROLOGY_API_USER_ID;
const API_KEY = process.env.ASTROLOGY_API_KEY;

const auth = {
    username: USER_ID,
    password: API_KEY
};

// 🔮 GET PLANET DATA
async function getKundali(dob, time, lat, lon) {
    try {
        // Convert date format YYYY-MM-DD → DD/MM/YYYY
        const [year, month, day] = dob.split('-');

        const [hour, min] = time.split(':');

        const payload = {
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year),
            hour: parseInt(hour),
            min: parseInt(min),
            lat: lat,
            lon: lon,
            tzone: 5.5
        };

        const response = await axios.post(
            'https://json.astrologyapi.com/v1/planets',
            payload,
            { auth }
        );

        // Convert response to your format
        const planets = response.data.map(p => ({
            name: p.name,
            rasi: { name: p.sign }
        }));

        return {
            success: true,
            planet_position: planets
        };

    } catch (error) {
        console.error("❌ ASTROLOGY API ERROR:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { getKundali };
