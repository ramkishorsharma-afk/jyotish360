/**
 * Jyotish360 - interpreter.js
 * Optimized for Prokerala API Planet Data
 */

function interpretKarmicReading(planets) {
    try {
        // Ensure planets is an array before processing
        if (!Array.isArray(planets)) {
            return "Your karmic map is currently being recalculated by the stars.";
        }

        // Find key planets using Prokerala's naming convention
        const moon = planets.find(p => p.name.toLowerCase() === "moon");
        const sun = planets.find(p => p.name.toLowerCase() === "sun");
        const saturn = planets.find(p => p.name.toLowerCase() === "saturn");
        const ketu = planets.find(p => p.name.toLowerCase() === "ketu");

        let reading = "";

        // 🌙 Moon Interpretation (Emotional Karma)
        if (moon && moon.rasi) {
            reading += `With your Moon in ${moon.rasi.name}, your previous incarnation was defined by deep emotional lessons and family ties. `;
        }

        // ☀️ Sun Interpretation (Soul Purpose)
        if (sun && sun.rasi) {
            reading += `Your Sun in ${sun.rasi.name} indicates you held a position of spiritual or social authority. `;
        }

        // 🪐 Saturn/Ketu (Past Life Debt)
        if (saturn && ketu) {
            reading += `The alignment of Saturn and Ketu suggests you are here to resolve specific ancestral patterns in this lifetime. `;
        }

        // Fallback if data is missing
        if (!reading) {
            reading = "Your chart reflects a soul that has recently entered a fresh cycle of karmic growth and discovery.";
        }

        return reading;

    } catch (error) {
        console.error("Interpreter Logic Error:", error);
        return "The Oracle is currently silent. Please check your birth details.";
    }
}

module.exports = { interpretKarmicReading };
