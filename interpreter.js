const axios = require("axios");

async function generateReport(data) {
    try {
        const prompt = `
Generate a detailed Vedic astrology report.

Ascendant: ${data.ascendant}
Planets: ${JSON.stringify(data.planets)}

Include:
- Kundli summary
- Karma score (percentage)
- Luck score
- Past life insights
- Lal Kitab remedies
- 2 hour prediction

Language: Hinglish
`;

        // 🔥 FREE METHOD (NO API KEY)
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama3-70b-8192",
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                "Authorization": "Bearer YOUR_API_KEY"
            }
        });

        const text = response.data.choices[0].message.content;

        return `
        <html>
        <body style="font-family:sans-serif;padding:20px">
        <h1>Astro Report</h1>
        <pre>${text}</pre>
        </body>
        </html>
        `;

    } catch (err) {
        return `<h1>Error generating report</h1>`;
    }
}

module.exports = { generateReport };
