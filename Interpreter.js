const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini (Ensure GEMINI_API_KEY is in your Render Env Vars)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * HYBRID INTERPRETER
 * Attempts AI interpretation, falls back to Local Logic on failure.
 */
async function interpretKarmicSymptoms(planets) {
    try {
        // 1. Prepare data for the AI
        const moon = planets.find(p => p.name.toLowerCase() === "moon");
        const sun = planets.find(p => p.name.toLowerCase() === "sun");
        const ketu = planets.find(p => p.name.toLowerCase() === "ketu");

        const context = {
            moonSign: moon?.rasi?.name || "Unknown",
            sunSign: sun?.rasi?.name || "Unknown",
            ketuSign: ketu?.rasi?.name || "Unknown"
        };

        // 2. Try the AI Path (The "Pro" Experience)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
        
        const prompt = `
            You are a Vedic Astrologer. 
            Data: Moon in ${context.moonSign}, Sun in ${context.sunSign}, Ketu in ${context.ketuSign}.
            Task: Write a 1-sentence mystical past-life root cause for their current karma.
            Style: Ancient, wise, and slightly mysterious.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();

    } catch (error) {
        console.log("AI Path failed, switching to Local Logic...");
        
        // 3. Fallback Path (The "Reliable" Experience)
        return generateLocalReading(planets);
    }
}

/**
 * LOCAL LOGIC ENGINE
 * Pre-written mystical strings based on Zodiac Signs
 */
function generateLocalReading(planets) {
    const moon = planets.find(p => p.name.toLowerCase() === "moon");
    const sign = moon?.rasi?.name || "Aries";

    const readings = {
        "Aries": "Your soul was a pioneer or a warrior in a past life, learning the balance between courage and patience.",
        "Taurus": "You come from a lineage of builders and creators; your karma is tied to the value of inner peace over earthly wealth.",
        "Gemini": "A past life as a messenger or scholar has left you with an insatiable thirst for truth in this incarnation.",
        "Cancer": "You were a guardian of the home and hearth; your heart still carries the echoes of ancient family bonds.",
        "Leo": "The sun in your past shone on leadership; you are now learning the grace of humble service.",
        "Virgo": "A life of healing and meticulous service has gifted you with the power to fix what is broken.",
        "Libra": "You were a diplomat or an artist seeking harmony; your current path is to find balance within yourself.",
        "Scorpio": "You have walked through the fires of transformation before; your soul carries deep occult secrets.",
        "Sagittarius": "As a philosopher or traveler in a previous life, your spirit remains restless for divine wisdom.",
        "Capricorn": "You climbed mountains of responsibility in the past; now you learn that the view from the top is for the soul, not just the ego.",
        "Aquarius": "A visionary who lived ahead of their time; you are here to anchor those revolutionary ideas into reality.",
        "Pisces": "Your soul was a mystic or a dreamer in the deep oceans of the past; you are finishing a grand karmic cycle."
    };

    return readings[sign] || "Your chart reflects a soul that has recently entered a fresh cycle of karmic growth.";
}

module.exports = { interpretKarmicSymptoms };
