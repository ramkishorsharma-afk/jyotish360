const swisseph = require('@swisseph/node');

// Numeric flag for Sidereal (Lahiri) calculations
const SEFLG_SIDEREAL = 65536;

async function getKundali(dob, time, lat, lon) {
    try {
        // Ensure all inputs are strictly numbers for the C++ engine
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);
        const nLat = parseFloat(lat);
        const nLon = parseFloat(lon);
        const ut = hour + (min / 60);

        // Calculate Julian Day
        const jd = swisseph.julianDay(year, month, day, ut);
        
        // Calculate Houses (Whole Sign)
        const houses = swisseph.calculateHouses(jd, nLat, nLon, swisseph.HouseSystem.WholeSign);

        const planetIds = [
            { id: swisseph.Planet.Sun, name: "Sun" },
            { id: swisseph.Planet.Moon, name: "Moon" },
            { id: swisseph.Planet.Mars, name: "Mars" },
            { id: swisseph.Planet.Mercury, name: "Mercury" },
            { id: swisseph.Planet.Jupiter, name: "Jupiter" },
            { id: swisseph.Planet.Venus, name: "Venus" },
            { id: swisseph.Planet.Saturn, name: "Saturn" },
            { id: swisseph.Planet.MeanNode, name: "Rahu" }
        ];

        const planets = planetIds.map(p => {
            // Use the numeric flag to avoid initialization undefined errors
            const pos = swisseph.calculatePosition(jd, p.id, SEFLG_SIDEREAL);
            const housePos = Math.floor(((pos.longitude - houses.ascendant + 360) % 360) / 30) + 1;
            return { name: p.name, house: housePos };
        });

        const rahu = planets.find(p => p.name === "Rahu");
        planets.push({
            name: "Ketu",
            house: ((rahu.house + 6) % 12) || 12
        });

        return { planets, ascendant: houses.ascendant };
    } catch (error) {
        console.error("❌ Astro Engine Error:", error);
        throw error;
    }
}

module.exports = { getKundali };
