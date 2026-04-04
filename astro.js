const axios = require('axios');

const SIGN_ORDER = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getHouse(sign, ascendant) {
    if (!sign || !ascendant) return null;

    sign = sign.trim();
    ascendant = ascendant.trim();

    const signIndex = SIGN_ORDER.indexOf(sign);
    const ascIndex = SIGN_ORDER.indexOf(ascendant);

    if (signIndex === -1 || ascIndex === -1) return null;

    let house = signIndex - ascIndex + 1;
    if (house <= 0) house += 12;

    return house;
}

async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split("-");
        const [hour, min] = time.split(":");

        const response = await axios.post(
            "https://json.astrologyapi.com/v1/planets",
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
                    "x-astrologyapi-key": process.env.ASTROLOGY_API_KEY
                }
            }
        );

        const data = response.data;

        if (!Array.isArray(data)) return null;

        // ✅ Find Ascendant
        const asc = data.find(p => p.name === "Ascendant");
        const ascSign = asc?.sign;

        if (!ascSign) return null;

        // ✅ Map planets with house
        const planets = data.map(p => ({
            name: p.name,
            sign: p.sign,
            house: getHouse(p.sign, ascSign)
        }));

        return {
            planet_position: planets
        };

    } catch (error) {
        console.log("ASTRO ERROR:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { getKundali };
