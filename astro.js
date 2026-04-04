const axios = require('axios');
require('dotenv').config();

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
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-astrologyapi-key': process.env.ASTROLOGY_ACCESS_TOKEN
                }
            }
        );

        console.log("✅ API SUCCESS:", response.data);

        const planets = response.data.map(p => ({
            name: p.name,
            rasi: { name: p.sign }
        }));

        return { planet_position: planets };

    } catch (error) {
        console.error("❌ ERROR:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { getKundali };
