const swisseph = require('@swisseph/node');

// Set the path to ephemeris files (Standard for this library)
swisseph.setSiderealMode(swisseph.SiderealMode.Lahiri);

async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);
        const ut = hour + min / 60;

        // Calculate Julian Day
        const jd = swisseph.julianDay(year, month, day, ut);
        
        // Calculate Houses
        const houses = swisseph.calculateHouses(jd, lat, lon, swisseph.HouseSystem.WholeSign);

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
            // Using swisseph.OutputFlag.Sidereal correctly
            const pos = swisseph.calculatePosition(jd, p.id, 65536); // 65536 is the numeric flag for Sidereal
            const housePos = Math.floor(((pos.longitude - houses.ascendant + 360) % 360) / 30) + 1;
            return { name: p.name, house: housePos };
        });

        const rahu = planets.find(p => p.name === "Rahu");
        planets.push({
            name: "Ketu",
            house: ((rahu.house + 6) % 12) || 12
        });

        return { planets };
    } catch (error) {
        console.error("❌ Calculation Error:", error);
        throw error;
    }
}

module.exports = { getKundali };
