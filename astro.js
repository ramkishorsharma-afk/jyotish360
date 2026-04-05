const swisseph = require('@swisseph/node');

// Set Sidereal mode for Indian Astrology (Lahiri)
swisseph.setSiderealMode(swisseph.SiderealMode.Lahiri);

async function getKundali(dob, time, lat, lon) {
    try {
        // Force conversion to numbers to prevent "A number was expected" error
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);
        const nLat = parseFloat(lat);
        const nLon = parseFloat(lon);
        const ut = hour + (min / 60);

        // Calculate Julian Day
        const jd = swisseph.julianDay(year, month, day, ut);
        
        // Calculate Houses (Whole Sign System)
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
            // Use 65536 as the flag for Sidereal calculations
            const pos = swisseph.calculatePosition(jd, p.id, 65536);
            // Determine house position based on Ascendant
            const housePos = Math.floor(((pos.longitude - houses.ascendant + 360) % 360) / 30) + 1;
            return { name: p.name, house: housePos };
        });

        // Add Ketu (always opposite Rahu)
        const rahu = planets.find(p => p.name === "Rahu");
        planets.push({
            name: "Ketu",
            house: ((rahu.house + 6) % 12) || 12
        });

        return { planets, ascendant: houses.ascendant };
    } catch (error) {
        console.error("❌ Engine Error:", error);
        throw error;
    }
}

module.exports = { getKundali };
