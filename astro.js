const swisseph = require('@swisseph/node');
const path = require('path');

// Safe number conversion
function safeNumber(val, name) {
    const num = Number(val);
    if (isNaN(num)) {
        throw new Error(`${name} is invalid`);
    }
    return num;
}

async function getKundali(dob, time, lat, lon) {
    try {
        console.log("INPUT:", { dob, time, lat, lon });

        // ✅ Parse input
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);

        const nLat = safeNumber(lat, "Latitude");
        const nLon = safeNumber(lon, "Longitude");

        const ut = hour + (min / 60);

        // ✅ Correct function for this package
        swisseph.setEphemerisPath(path.join(__dirname, 'ephe'));

        // ✅ Julian Day
        const jd = swisseph.julianDay(year, month, day, ut);

        if (isNaN(jd)) throw new Error("Invalid Julian Day");

        // ✅ Houses
        const houses = swisseph.calculateHouses(jd, nLat, nLon);

        const asc = houses.ascendant;
        if (isNaN(asc)) throw new Error("Ascendant error");

        // ✅ Planets
        const planetList = [
            { id: swisseph.Planet.Sun, name: "Sun" },
            { id: swisseph.Planet.Moon, name: "Moon" },
            { id: swisseph.Planet.Mars, name: "Mars" },
            { id: swisseph.Planet.Mercury, name: "Mercury" },
            { id: swisseph.Planet.Jupiter, name: "Jupiter" },
            { id: swisseph.Planet.Venus, name: "Venus" },
            { id: swisseph.Planet.Saturn, name: "Saturn" },
            { id: swisseph.Planet.MeanNode, name: "Rahu" }
        ];

        const planets = [];

        for (let p of planetList) {
            let pos;

            try {
                pos = swisseph.calculatePosition(jd, p.id);
            } catch (e) {
                console.error("Planet error:", p.name);
                continue;
            }

            if (!pos || isNaN(pos.longitude)) continue;

            const house = Math.floor(((pos.longitude - asc + 360) % 360) / 30) + 1;

            planets.push({
                name: p.name,
                longitude: pos.longitude,
                house
            });
        }

        // ✅ Add Ketu
        const rahu = planets.find(p => p.name === "Rahu");

        if (rahu) {
            planets.push({
                name: "Ketu",
                longitude: (rahu.longitude + 180) % 360,
                house: ((rahu.house + 6) % 12) || 12
            });
        }

        return {
            success: true,
            ascendant: asc,
            planets
        };

    } catch (error) {
        console.error("FINAL ERROR:", error.message);

        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { getKundali };
