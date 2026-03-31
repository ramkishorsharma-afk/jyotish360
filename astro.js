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
            'https://json.astrologyapi.com/v1/planets',
            payload,
            { auth }
        );

        return {
            planet_position: response.data.map(p => ({
                name: p.name,
                rasi: { name: p.sign }
            }))
        };

    } catch (error) {
        console.error("ASTRO ERROR:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { getKundali };
