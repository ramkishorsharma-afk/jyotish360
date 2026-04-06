const swisseph = require('@swisseph/node');

// FLAGS
const SEFLG_SWIEPH = 2;
const SEFLG_SIDEREAL = 65536;

// SAFE HOUSE SYSTEM (Whole Sign)
const HOUSE_SYSTEM = 87; // 'W'

// NAKSHATRA LIST
const NAKSHATRAS = [
"Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu",
"Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta",
"Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha",
"Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada",
"Uttara Bhadrapada","Revati"
];

// Lal Kitab basic rules
function getLalKitabRemedies(planets) {
    const remedies = [];

    planets.forEach(p => {
        if (p.name === "Saturn" && p.house === 1) {
            remedies.push("Donate mustard oil on Saturday");
        }
        if (p.name === "Rahu" && p.house === 8) {
            remedies.push("Keep coconut in flowing water");
        }
        if (p.name === "Mars" && p.house === 7) {
            remedies.push("Avoid anger, donate red lentils");
        }
    });

    return remedies;
}

// SAFE NUMBER CHECK
function safeNumber(val, name) {
    const num = Number(val);
    if (isNaN(num)) throw new Error(`${name} is invalid`);
    return num;
}

async function getKundali(dob, time, lat, lon) {
    try {
        // ✅ SAFE INPUT PARSE
        const [year, month, day] = dob.split('-').map(v => safeNumber(v, "DOB"));
        const [hour, min] = time.split(':').map(v => safeNumber(v, "TIME"));

        const nLat = safeNumber(lat, "Latitude");
        const nLon = safeNumber(lon, "Longitude");

        const ut = hour + (min / 60);

        // ✅ INIT ENGINE
        swisseph.swe_set_ephe_path(__dirname + '/ephe');
        swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI);

        // ✅ JD
        const jd = swisseph.swe_julday(year, month, day, ut, swisseph.SE_GREG_CAL);

        // ✅ HOUSES
        const houses = swisseph.swe_houses(jd, nLat, nLon, HOUSE_SYSTEM);

        const asc = houses.ascmc?.[0] || houses.ascendant;

        // PLANETS
        const planetIds = [
            { id: swisseph.SE_SUN, name: "Sun" },
            { id: swisseph.SE_MOON, name: "Moon" },
            { id: swisseph.SE_MARS, name: "Mars" },
            { id: swisseph.SE_MERCURY, name: "Mercury" },
            { id: swisseph.SE_JUPITER, name: "Jupiter" },
            { id: swisseph.SE_VENUS, name: "Venus" },
            { id: swisseph.SE_SATURN, name: "Saturn" },
            { id: swisseph.SE_MEAN_NODE, name: "Rahu" }
        ];

        const planets = [];

        for (let p of planetIds) {
            let result;

            try {
                result = swisseph.swe_calc_ut(
                    jd,
                    p.id,
                    SEFLG_SWIEPH | SEFLG_SIDEREAL
                );
            } catch (err) {
                console.error(`Planet calc failed: ${p.name}`);
                continue; // prevent crash
            }

            if (!result || isNaN(result.longitude)) continue;

            const lonDeg = result.longitude;

            // HOUSE
            const house = Math.floor(((lonDeg - asc + 360) % 360) / 30) + 1;

            // NAKSHATRA
            const nakIndex = Math.floor(lonDeg / (360 / 27));
            const nakshatra = NAKSHATRAS[nakIndex];

            planets.push({
                name: p.name,
                longitude: lonDeg,
                house,
                nakshatra
            });
        }

        // ✅ KETU
        const rahu = planets.find(p => p.name === "Rahu");

        if (rahu) {
            planets.push({
                name: "Ketu",
                longitude: (rahu.longitude + 180) % 360,
                house: ((rahu.house + 6) % 12) || 12,
                nakshatra: rahu.nakshatra
            });
        }

        // ✅ BASIC DASHA (MOON BASED)
        const moon = planets.find(p => p.name === "Moon");

        const dasha = moon
            ? {
                current: moon.nakshatra,
                note: "Basic dasha (full Vimshottari can be added next)"
            }
            : null;

        // ✅ LAL KITAB
        const remedies = getLalKitabRemedies(planets);

        return {
            ascendant: asc,
            planets,
            dasha,
            remedies
        };

    } catch (error) {
        console.error("❌ FINAL ENGINE ERROR:", error.message);

        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { getKundali };
