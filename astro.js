const swisseph = require('@swisseph/node');

swisseph.setSiderealMode(swisseph.SiderealMode.Lahiri);

async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);
        const ut = hour + min / 60;

        const jd = swisseph.julianDay(year, month, day, ut);
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
            const pos = swisseph.calculatePosition(jd, p.id, swisseph.OutputFlag.Sidereal);
            const housePos = Math.floor(((pos.longitude - houses.ascendant + 360) % 360) / 30) + 1;
            return { name: p.name, house: housePos };
        });

        // Add Ketu (Always opposite Rahu)
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
