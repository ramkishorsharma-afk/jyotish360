const axios = require("axios");

const API_URL = "https://json.astrologyapi.com/v1/planets";

async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split("-");
        const [hour, min] = time.split(":");

        const response = await axios.post(
            API_URL,
            {
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                hour: parseInt(hour),
                min: parseInt(min),
                lat: lat,
                lon: lon,
                tzone: 5.5
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-astrologyapi-key": process.env.ASTROLOGY_API_TOKEN
                }
            }
        );

        console.log("✅ ASTRO SUCCESS:", response.data);

        return response.data;

    } catch (error) {
        console.error("❌ ASTRO ERROR:");

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }

        return null;
    }
}

module.exports = { getKundali };
