const OpenAI = require("openai");
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function interpretKarmicSymptoms(symptoms, planetData) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("FULL ERROR:", error);
    return "AI Error: " + error.message;
}
}

module.exports = { interpretKarmicSymptoms };
