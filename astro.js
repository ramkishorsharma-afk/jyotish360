const swisseph = require('@swisseph/node');
const path = require('path');

// FORCE SAFE NUMBER
function toNum(val, name) {
    const n = Number(val);
    if (!Number.isFinite(n)) {
        throw new Error(`${name} invalid: ${val}`);
    }
    return n;
}

async function getKundali(dob, time, lat, lon) {
    try {
        console.log("INPUT:", { dob, time, lat, lon });

        // ✅ PARSE DATE
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

        console.log("PARSED:", { year, month, day, ut, latitude, longitude });

        // ✅ SET EPHE PATH
        swisseph.setEphemerisPath(path.join(__dirname, "ephe"));

        // ✅ JD
        const jd = swisseph.julianDay(year, month, day, ut);

        if (!Number.isFinite(jd)) throw new Error("JD failed");

        console.log("JD:", jd);

        // ✅ HOUSES
        const houses = swisseph.calculateHouses(jd, latitude, longitude);

        if (!houses || !Number.isFinite(houses.ascendant)) {
            throw new Error("House calc failed");
        }

        const asc = houses.ascendant;

        // ✅ PLANETS SAFE LIST
        const planetIds = [
            swisseph.Planet.Sun,
            swisseph.Planet.Moon,
            swisseph.Planet.Mars,
            swisseph.Planet.Mercury,
            swisseph.Planet.Jupiter,
            swisseph.Planet.Venus,
            swisseph.Planet.Saturn,
            swisseph.Planet.MeanNode
        ];

        const planets = [];

        for (let pid of planetIds) {
            let pos;

            try {
                // 🔥 FORCE NUMBERS ONLY
                pos = swisseph.calculatePosition(
                    Number(jd),
                    Number(pid)
                );
            } catch (err) {
                console.error("Planet failed:", pid, err.message);
                continue;
            }

            if (!pos || !Number.isFinite(pos.longitude)) {
                console.log("Skipped planet:", pid);
                continue;
            }

            const house =
                Math.floor(((pos.longitude - asc + 360) % 360) / 30) + 1;

            planets.push({
                planet: pid,
                longitude: pos.longitude,
                house
            });
        }

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
