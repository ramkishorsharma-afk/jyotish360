const swisseph = require('@swisseph/node');

// Strictly numeric flag for Sidereal (Lahiri) calculations
const SEFLG_SIDEREAL = 65536;

async function getKundali(dob, time, lat, lon) {
    try {
        // 1. Force strict numeric conversion for all inputs
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);
        const nLat = Number(parseFloat(lat));
        const nLon = Number(parseFloat(lon));
        
        // Ensure UT is a valid number
        const ut = Number(hour + (min / 60));

        // 2. Calculate Julian Day and force to Number type
        const jd = Number(swisseph.julianDay(year, month, day, ut));
        
        // 3. Calculate Houses
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
            // FIX: Explicitly wrap inputs in Number() to satisfy the C++ wrapper
            const pos = swisseph.calculatePosition(Number(jd), Number(p.id), Number(SEFLG_SIDEREAL));
            
            // Calculate House Position
            const housePos = Math.floor(((pos.longitude - houses.ascendant + 360) % 360) / 30) + 1;
            return { name: p.name, house: housePos };
        });

        // Add Ketu (180 degrees from Rahu)
        const rahu = planets.find(p => p.name === "Rahu");
        planets.push({
            name: "Ketu",
            house: ((rahu.house + 6) % 12) || 12
        });

        return { planets, ascendant: houses.ascendant };
    } catch (error) {
        console.error("❌ Engine Error Details:", error);
        throw error;
    }
}

module.exports = { getKundali };
