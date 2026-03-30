const axios = require('axios');
const qs = require('qs'); // Install this: npm install qs
require('dotenv').config();

async function getAccessToken() {
    try {
        const response = await axios.post('https://api.prokerala.com/token', qs.stringify({
            grant_type: 'client_credentials',
            client_id: process.env.PROKERALA_CLIENT_ID,
            client_secret: process.env.PROKERALA_CLIENT_SECRET
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Token Error:", error.message);
        return null;
    }
}

async function getKundali(dob, time, lat, lon) {
    try {
        const token = await getAccessToken();
        if (!token) return null;

        // Prokerala needs ISO 8601 format: YYYY-MM-DDTHH:mm:ss+05:30
        const datetime = `${dob}T${time}:00+05:30`;

        const response = await axios.get('https://api.prokerala.com/v2/astrology/planet-position', {
            params: {
                datetime: datetime,
                coordinates: `${lat},${lon}`,
                ayanamsa: 1 // Lahiri
            },
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Prokerala returns data inside: data.planet_positions
        return {
            success: true,
            planet_position: response.data.data.planet_positions
        };
    } catch (error) {
        console.error("Prokerala API Error:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { getKundali };
