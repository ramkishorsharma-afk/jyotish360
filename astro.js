const axios = require('axios');
const qs = require('qs');
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
    } catch (error) { return null; }
}

async function getKundali(dob, time, lat, lon) {
    try {
        const token = await getAccessToken();
        const datetime = `${dob}T${time}:00+05:30`;
        const response = await axios.get('https://api.prokerala.com/v2/astrology/planet-position', {
            params: { datetime, coordinates: `${lat},${lon}`, ayanamsa: 1 },
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return { success: true, planet_position: response.data.data.planet_positions };
    } catch (error) { return null; }
}

module.exports = { getKundali };
