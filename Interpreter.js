const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function interpretKarmicSymptoms(symptoms, planetData) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-001"
        });

        const prompt = `
You are a mystical Vedic astrologer.

DOB: ${planetData.dob}
Place: ${planetData.place}

Write:
- Past life karma
- Emotional traits
- Current struggle

Keep it under 60 words and very personal.
`;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        return result.response.text();

    } catch (error) {
        console.error("Gemini Error:", error);
        return "AI Error: Please try again later.";
    }
}

module.exports = { interpretKarmicSymptoms };
