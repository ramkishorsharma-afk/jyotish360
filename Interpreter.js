const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function interpretKarmicSymptoms(symptoms, planetData) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-pro"
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

        const result = await model.generateContent(prompt);
        return result.response.text();

    } catch (error) {
        console.error(error);
        return "Error: " + error.message;
    }
}

module.exports = { interpretKarmicSymptoms };
