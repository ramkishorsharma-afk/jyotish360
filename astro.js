const axios = require('axios');

// 🔑 Step 1: Get Access Token
async function getAccessToken() {
    const response = await axios.post(
        'https://api.prokerala.com/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.PROKERALA_CLIENT_ID,
            client_secret: process.env.PROKERALA_CLIENT_SECRET
        })
    );

    return response.data.access_token;
}

// 🔮 Step 2: Get Kundali Data
async function getKundali(dob, time, lat, lon) {
    try {
        const token = await getAccessToken();

        console.log("TOKEN:", token); // 👈 ADD THIS LINE

        const formattedDateTime = formatDateTime(dob, time);

        const response = await axios.get(
            'https://api.prokerala.com/v2/astrology/planets',
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

        console.log("API SUCCESS:", response.data);

        return response.data.data;

    } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);
    return null;
}
}

// 🛠️ Format DOB + Time properly
function formatDateTime(dob, time) {
    // Expecting dob = DD-MM-YYYY
    const [day, month, year] = dob.split('-');

    // Expecting time = HH:MM (24hr format)
    return `${year}-${month}-${day}T${time}:00+05:30`;
}

module.exports = { getKundali };
