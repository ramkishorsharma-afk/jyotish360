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
        console.log("INPUT:", { dob, time, lat, lon });

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

        // ✅ ONLY SAFE FUNCTIONS
        swisseph.setEphemerisPath(path.join(__dirname, "ephe"));

        const jd = swisseph.julianDay(year, month, day, ut);

        if (!Number.isFinite(jd)) throw new Error("JD failed");

        const houses = swisseph.calculateHouses(jd, latitude, longitude);

        if (!houses || !Number.isFinite(houses.ascendant)) {
            throw new Error("House calc failed");
        }

        const asc = houses.ascendant;

        // ❌ NO calculatePosition (REMOVED COMPLETELY)

        return {
            success: true,
            ascendant: asc,
            message: "Engine running (planets temporarily disabled)"
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
