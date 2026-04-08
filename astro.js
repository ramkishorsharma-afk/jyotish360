const path = require('path');
const swisseph = require('@swisseph/node');

// 1. Direct Numeric Constants (Bypasses "undefined" property errors)
const SE_GREG_CAL = 1;
const SEFLG_SWIEPH = 2;
const SEFLG_SIDEREAL = 65536;
const SE_SIDM_LAHIRI = 1;
const SE_HSYS_WHOLE_SIGN = 87; // 'W' in numeric form

// 2. Set Path to BINARY ephemeris files
const ephePath = path.join(__dirname, 'ephe');
swisseph.swe_set_ephe_path(ephePath);
swisseph.swe_set_sid_mode(SE_SIDM_LAHIRI);

async function getKundali(dob, time, lat, lon) {
    try {
        // Force strict numeric parsing
        const [year, month, day] = dob.split('-').map(num => parseInt(num, 10));
        const [hour, min] = time.split(':').map(num => parseInt(num, 10));
        const ut = parseFloat((hour + (min / 60)).toFixed(4));

        // 3. Julian Day with strict number types
        const jd = swisseph.swe_julday(year, month, day, ut, SE_GREG_CAL);
        
        // 4. House calculation
        const houses = swisseph.swe_houses(Number(jd), parseFloat(lat), parseFloat(lon), SE_HSYS_WHOLE_SIGN);

        const planetIds = [
            { id: 0, name: "Sun" },
            { id: 1, name: "Moon" },
            { id: 4, name: "Mars" },
            { id: 2, name: "Mercury" },
            { id: 5, name: "Jupiter" },
            { id: 3, name: "Venus" },
            { id: 6, name: "Saturn" },
            { id: 11, name: "Rahu" }
        ];

        const planets = planetIds.map(p => {
            // Use direct numbers to satisfy the C++ engine
            const result = swisseph.swe_calc_ut(
                Number(jd), 
                Number(p.id), 
                Number(SEFLG_SWIEPH | SEFLG_SIDEREAL)
            );

            // Coordinates are usually in result.data[0]
            const longitude = result.data ? result.data[0] : result.longitude;
            const housePos = Math.floor(((longitude - houses.ascendant + 360) % 360) / 30) + 1;

            return { name: p.name, house: housePos };
        });

        return { planets, ascendant: houses.ascendant };
    } catch (error) {
        console.error("❌ Fatal Engine Error:", error.message);
        throw new Error("Calculation Failed: " + error.message);
    }
}

module.exports = { getKundali };
