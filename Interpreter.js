const { OpenAI } = require("openai");
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * HYBRID INTERPRETER (OpenAI + Local Fallback)
 * Works perfectly with Prokerala planet data structures.
 */
async function interpretKarmicSymptoms(planets) {
    try {
        // 1. Extract data from Prokerala Structure
        const moon = planets.find(p => p.name.toLowerCase() === "moon");
        const sun = planets.find(p => p.name.toLowerCase() === "sun");
        const ketu = planets.find(p => p.name.toLowerCase() === "ketu");

        const context = {
            moonSign: moon?.rasi?.name || "Unknown",
            sunSign: sun?.rasi?.name || "Unknown",
            ketuSign: ketu?.rasi?.name || "Unknown"
        };

        // 2. Try the OpenAI Path
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast and cost-effective for 2026
            messages: [
                { role: "system", content: "You are an ancient Vedic Astrologer. Use the provided planet data to give a 1-sentence mystical past-life explanation." },
                { role: "user", content: `Moon: ${context.moonSign}, Sun: ${context.sunSign}, Ketu: ${context.ketuSign}.` }
            ],
            max_tokens: 60,
        });

        return completion.choices[0].message.content.trim();

    } catch (error) {
        console.error("OpenAI failed, falling back to Local Logic:", error.message);
        
        // 3. Fallback Path (The "Bulletproof" Engine)
        return generateLocalReading(planets);
    }
}

/**
 * LOCAL LOGIC ENGINE
 * Pre-coded readings to ensure the app ALWAYS works.
 */
function generateLocalReading(planets) {
    const moon = planets.find(p => p.name.toLowerCase() === "moon");
    const sign = moon?.rasi?.name || "Aries";

    const readings = {
        "Aries": "Your soul was a pioneer or a warrior in a past life, learning the balance between courage and patience.",
        "Taurus": "You come from a lineage of builders; your karma is tied to the value of inner peace over earthly wealth.",
        "Gemini": "A past life as a scholar has left you with an insatiable thirst for truth in this incarnation.",
        "Cancer": "You were a guardian of the home; your heart still carries the echoes of ancient family bonds.",
        "Leo": "The sun in your past shone on leadership; you are now learning the grace of humble service.",
        "Virgo": "A life of healing and service has gifted you with the power to fix what is broken.",
        "Libra": "You were a diplomat seeking harmony; your current path is to find balance within.",
        "Scorpio": "You have walked through the fires of transformation before; your soul carries deep secrets.",
        "Sagittarius": "As a philosopher in a previous life, your spirit remains restless for divine wisdom.",
        "Capricorn": "You climbed mountains of responsibility; now you learn the view is for the soul, not the ego.",
        "Aquarius": "A visionary ahead of your time; you are here to anchor revolutionary ideas into reality.",
        "Pisces": "Your soul was a mystic in the deep oceans of the past; you are finishing a grand karmic cycle."
    };

    return readings[sign] || "Your chart reflects a soul entering a fresh cycle of growth.";
}

module.exports = { interpretKarmicSymptoms };
