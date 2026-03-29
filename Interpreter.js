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
                messages: [
                    {
                        role: "user",
                        content: `
You are a mystical Vedic astrologer.

DOB: ${planetData.dob}
Place: ${planetData.place}

Write:
- Past life karma
- Emotional traits
- Current struggle

Keep it under 60 words and very personal.
`
                    }
                ]
            })
        });

        const data = await response.json();
        console.log("API RESPONSE:", data);

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            return "AI is busy. Try again in a moment.";
        }

    } catch (error) {
        console.error(error);
        return "AI Error: Try again later";
    }
}

module.exports = { interpretKarmicSymptoms };
