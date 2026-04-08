function toNum(val, name) {
    const n = Number(val);
    if (!Number.isFinite(n)) {
        throw new Error(`${name} invalid`);
    }
    return n;
}

async function getKundali(dob, time, lat, lon) {
    try {
        const [y, m, d] = dob.split("-");
        const [h, min] = time.split(":");

        const year = toNum(y, "year");
        const month = toNum(m, "month");
        const day = toNum(d, "day");

        const hour = toNum(h, "hour");
        const minute = toNum(min, "minute");

        const latitude = toNum(lat, "latitude");
        const longitude = toNum(lon, "longitude");

        // 🔥 TEMP LOGIC (STABLE)
        const ascendant = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][day % 12];

        const planets = [
            { name: "Sun", house: (day % 12) + 1 },
            { name: "Moon", house: (month % 12) + 1 },
            { name: "Mars", house: (year % 12) + 1 },
            { name: "Mercury", house: (hour % 12) + 1 },
            { name: "Jupiter", house: (minute % 12) + 1 },
            { name: "Venus", house: 6 },
            { name: "Saturn", house: 8 },
            { name: "Rahu", house: 10 },
            { name: "Ketu", house: 4 }
        ];

        return {
            success: true,
            ascendant,
            planets
        };

    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

module.exports = { getKundali };
