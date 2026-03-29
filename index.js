const axios = require('axios');

// 🔑 Get Access Token
async function getAccessToken() {
    try {
        const response = await axios.post(
            'https://api.prokerala.com/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.PROKERALA_CLIENT_ID,
                client_secret: process.env.PROKERALA_CLIENT_SECRET
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token;

    } catch (error) {
        console.log("TOKEN ERROR:", error.response?.data || error.message);
        return null;
    }
}

// 🔮 Get Planet Data
async function getKundali(dob, time, lat, lon) {
    try {
        const token = await getAccessToken();

        if (!token) return null;

        const formattedDateTime = formatDateTime(dob, time);

        const response = await axios.get(
            'https://api.prokerala.com/v2/astrology/planet-position',
            {
                params: {
                    ayanamsa: 1,
                    coordinates: `${lat},${lon}`,
                    datetime: formattedDateTime
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data.data;

    } catch (error) {
        console.log("API ERROR:", error.response?.data || error.message);
        return null;
    }
}

// 🛠️ Format Date
function formatDateTime(dob, time) {
    const [day, month, year] = dob.split('-');
    return `${year}-${month}-${day}T${time}:00+05:30`;
}

module.exports = { getKundali };
