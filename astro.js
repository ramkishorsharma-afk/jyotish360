const axios = require("axios");

const API_KEY = process.env.ASTROLOGY_API_TOKEN;

async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split("-");
        const [hour, min] = time.split(":");

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

        // 🔥 1. GET PLANETS
        const planetsRes = await axios.post(
            "https://json.astrologyapi.com/v1/planets",
            payload,
            {
                headers: {
                    "x-astrologyapi-key": API_KEY
                }
            }
        );

        // 🔥 2. GET ASCENDANT
        const birthRes = await axios.post(
            "https://json.astrologyapi.com/v1/birth_details",
            payload,
            {
                headers: {
                    "x-astrologyapi-key": API_KEY
                }
            }
        );

        const planets = planetsRes.data;
        const ascendant = birthRes.data.ascendant;

        if (!Array.isArray(planets)) return null;

        // 🔥 REAL HOUSE CALCULATION (BASED ON ASC SIGN)
        const SIGN_ORDER = [
            "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
            "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
        ];

        const ascIndex = SIGN_ORDER.indexOf(ascendant);

        const mapped = planets.map(p => {
            const signIndex = SIGN_ORDER.indexOf(p.sign);

            let house = signIndex - ascIndex + 1;
            if (house <= 0) house += 12;

            return {
                name: p.name,
                sign: p.sign,
                degree: p.normDegree,
                house
            };
        });

        return {
            planet_position: mapped,
            ascendant
        };

    } catch (err) {
        console.error("❌ ASTRO ERROR:", err.response?.data || err.message);
        return null;
    }
}

module.exports = { getKundali };
