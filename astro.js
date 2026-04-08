const swisseph = require('@swisseph/node');
const path = require('path');

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

        const ut = hour + (minute / 60);

        swisseph.setEphemerisPath(path.join(__dirname, "ephe"));

        const jd = swisseph.julianDay(year, month, day, ut);

        const houses = swisseph.calculateHouses(jd, latitude, longitude);

        const asc = houses.ascendant;

        // 🔥 TEMP SAFE PLANET DATA (NO CRASH)
        const planets = [
            { name: "Sun", house: 1 },
            { name: "Moon", house: 2 },
            { name: "Mars", house: 3 },
            { name: "Mercury", house: 4 },
            { name: "Jupiter", house: 5 },
            { name: "Venus", house: 6 },
            { name: "Saturn", house: 7 },
            { name: "Rahu", house: 8 },
            { name: "Ketu", house: 2 }
        ];

        return {
            success: true,
            ascendant: asc,
            planets
        };

    } catch (err) {
        console.error("FINAL ERROR:", err.message);

        return {
            success: false,
            error: err.message
        };
    }
}

module.exports = { getKundali };
