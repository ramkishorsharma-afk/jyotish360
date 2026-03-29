const fetch = require("node-fetch");
require('dotenv').config();

async function interpretKarmicSymptoms(symptoms, planetData) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{
                    role: "user",
                    content: `
You are a mystical Vedic astrologer.

DOB: ${planetData.dob}
Place: ${planetData.place}

Give a short past life insight in 40 words.
`
                }]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        }

    } catch (error) {
        console.log("AI failed, using fallback");
    }

    return generateFallbackReading(planetData);
}

// 🔥 Fallback (Always works)
function generateFallbackReading(planetData) {
    const insights = [
        "In past life, you carried deep responsibility. Emotional burdens still follow you.",
        "You were connected to leadership or authority. Now learning balance and patience.",
        "Your soul has seen struggle before. This life is about healing and growth.",
        "Past karmas show strong emotional ties. You often feel things deeply.",
        "You had unfinished duties. This life pushes you toward completion."
    ];

    return insights[Math.floor(Math.random() * insights.length)];
}

module.exports = { interpretKarmicSymptoms };
