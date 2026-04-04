const swisseph = require('@swisseph/node');
const path = require('path');

// 1. Initialize Ephemeris (Points to the data files for planetary positions)
// The library handles this automatically, but we set the Sidereal mode to Lahiri
swisseph.setSiderealMode(swisseph.SiderealMode.Lahiri);

/**
 * Local Kundli Calculation (Free & Open Source)
 */
async function getKundali(dob, time, lat, lon) {
    try {
        const [year, month, day] = dob.split('-').map(Number);
        const [hour, min] = time.split(':').map(Number);

        // Convert to Julian Day (Standard astronomical time)
        // Note: Assumes input is already UTC or adjusted for TZone
        const jd = swisseph.julianDay(year, month, day, hour + (min / 60));

        // 2. Calculate Houses (Ascendant/Lagna)
        // HouseSystem.WholeSign is standard for many Vedic/Lal Kitab interpretations
        const houses = swisseph.calculateHouses(jd, lat, lon, swisseph.HouseSystem.WholeSign);

        // 3. Calculate Planets
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
            
            // Calculate House Position (Degree / 30)
            // Adjust based on Ascendant for more "Actual" accuracy
            const housePos = Math.floor(((pos.longitude - houses.ascendant + 360) % 360) / 30) + 1;

            return {
                name: p.name,
                longitude: pos.longitude,
                house: housePos,
                isRetrograde: pos.longitudeSpeed < 0
            };
        });

        // Add Ketu (Always 180 degrees from Rahu)
        const rahu = planets.find(p => p.name === "Rahu");
        planets.push({
            name: "Ketu",
            longitude: (rahu.longitude + 180) % 360,
            house: ((rahu.house + 6) % 12) || 12,
            isRetrograde: true
        });

        return {
            ascendant: houses.ascendant,
            planets: planets,
            luckScore: calculateLuckScore(planets) // Our custom logic
        };

    } catch (error) {
        console.error("Calculation Error:", error);
        throw error;
    }
}

/**
 * 4. Custom Luck/Karma Score Logic
 * This replaces "False Predictions" with mathematical dignity
 */
function calculateLuckScore(planets) {
    let score = 60; // Starting neutral score
    planets.forEach(p => {
        // Simple logic: Planets in 6, 8, 12 houses reduce the "Luck" score
        if ([6, 8, 12].includes(p.house)) score -= 5;
        // Exalted positions (simplified example)
        if (p.name === "Sun" && p.house === 1) score += 10; 
    });
    return Math.max(0, Math.min(100, score));
}

module.exports = { getKundali };
