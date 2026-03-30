const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 🔮 MAIN FUNCTION
async function interpretKarmicSymptoms(planets) {
    try {

        // Convert planet data into readable string
        const planetSummary = planets.map(p => {
            return `${p.name} in ${p.rasi?.name}`;
        }).join(", ");

        const prompt = `
You are a Lal Kitab astrologer and psychological reader.

Planet Positions:
${planetSummary}

Generate output in JSON format:

{
  "lifeEvents": [],
  "symptoms": [],
  "last2Hours": []
}

Rules:
- Write in simple Hinglish (Hindi + English mix)
- Make it highly relatable and emotional
- Avoid generic astrology language
- Sound like you understand user's real life
- Keep each point 1 line only

lifeEvents:
- Past patterns (trust, struggle, money, relationships)

symptoms:
- Lal Kitab style problems (nazar, rukawat, stress, delay, etc.)

last2Hours:
- Very recent relatable situations (stress, call, confusion, mood)

Make sure user feels: "yeh toh meri life hi hai"
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "You are an expert astrologer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.9
        });

        let text = response.choices[0].message.content;

        // Try parsing JSON safely
        try {
            return JSON.parse(text);
        } catch {
            console.log("⚠️ JSON parse failed, returning raw text");
            return { raw: text };
        }

    } catch (error) {
        console.error("❌ Interpreter Error:", error.message);
        return null;
    }
}

// 🔮 PAID PREDICTIONS FUNCTION
async function generateFuturePredictions(planets, type = "next2Hours") {
    try {

        const planetSummary = planets.map(p => {
            return `${p.name} in ${p.rasi?.name}`;
        }).join(", ");

        const prompt = `
You are a Lal Kitab astrologer.

Planet Positions:
${planetSummary}

Generate ${type} prediction in JSON:

{
  "prediction": [],
  "advice": [],
  "warning": []
}

Rules:
- Hinglish language
- Realistic + slightly mysterious
- Emotionally engaging
- Each point short

Types:
- next2Hours → very specific
- today → day overview
- week → opportunities + risks
- month → major trends
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "You are an expert astrologer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.9
        });

        let text = response.choices[0].message.content;

        try {
            return JSON.parse(text);
        } catch {
            return { raw: text };
        }

    } catch (error) {
        console.error("❌ Future Prediction Error:", error.message);
        return null;
    }
}

module.exports = {
    interpretKarmicSymptoms,
    generateFuturePredictions
};
