const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function interpretKarmicSymptoms(planets) {
    try {
        const moon = planets.find(p => p.name.toLowerCase() === "moon");
        const sun = planets.find(p => p.name.toLowerCase() === "sun");

        // Attempt OpenAI Path
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a Vedic Astrologer. Provide a 1-sentence mystical past-life explanation." },
                { role: "user", content: `Moon in ${moon?.rasi?.name}, Sun in ${sun?.rasi?.name}.` }
            ],
            max_tokens: 50,
        });

        return completion.choices[0].message.content.trim();

    } catch (error) {
        // Fallback to Local Logic if OpenAI fails
        const moon = planets.find(p => p.name.toLowerCase() === "moon");
        const sign = moon?.rasi?.name || "Aries";

        const localReadings = {
            "Aries": "Your soul was a warrior in a past life, learning courage.",
            "Taurus": "You come from a lineage of builders and creators.",
            "Gemini": "A past life as a scholar has left you with an insatiable thirst for truth.",
            "Cancer": "You were a guardian of the home and ancient family bonds.",
            "Leo": "The sun in your past shone on leadership and authority.",
            "Virgo": "A life of healing and service has gifted you with wisdom.",
            "Libra": "You were a diplomat seeking harmony in a chaotic world.",
            "Scorpio": "You have walked through the fires of transformation before.",
            "Sagittarius": "As a philosopher or traveler, your spirit remains restless.",
            "Capricorn": "You climbed mountains of responsibility in the past.",
            "Aquarius": "A visionary who lived ahead of their time.",
            "Pisces": "Your soul was a mystic in the deep oceans of the past."
        };

        return localReadings[sign] || "Your soul is entering a fresh cycle of growth.";
    }
}

module.exports = { interpretKarmicSymptoms };
