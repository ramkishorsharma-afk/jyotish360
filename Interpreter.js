const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 AGE CALCULATOR
function getAge(dob) {
    const birth = new Date(dob);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
}

// 🪐 FIND PLANET
function findPlanet(planets, name) {
    return planets.find(p => p.name.toLowerCase() === name.toLowerCase());
}

// ⚡ SHOCK LINE ENGINE
function generateShockLine(planets) {
    const saturn = findPlanet(planets, "saturn");
    const rahu = findPlanet(planets, "rahu");

    if (saturn && rahu) {
        return "Aapki life me jo rukawat chal rahi hai, woh sirf external nahi hai... yeh karmic cycle repeat ho raha hai";
    }

    if (saturn) {
        return "Aap jitni mehnat karte ho utna result nahi milta... yeh Shani ka strong effect hai";
    }

    if (rahu) {
        return "Aapka dimag kabhi kabhi itna overthink karta hai ki aap khud confuse ho jate ho";
    }

    return "Aapki life me kuch patterns repeat ho rahe hain jo ignore nahi karne chahiye";
}

// 🧩 LAL KITAB SYMPTOMS (ADVANCED)
function getLalKitabSymptoms(planets) {
    let symptoms = [];

    const saturn = findPlanet(planets, "saturn");
    const rahu = findPlanet(planets, "rahu");
    const moon = findPlanet(planets, "moon");

    if (saturn) {
        symptoms.push("Kaam me delay aur rukawat baar baar aati hai");
        if (saturn.rasi?.name === "Leo") {
            symptoms.push("Authority ya boss ke sath issue aata hai");
        }
    }

    if (rahu) {
        symptoms.push("Dimag me overthinking aur confusion rehti hai");
        if (rahu.rasi?.name === "Gemini") {
            symptoms.push("Decision lene me confusion zyada hota hai");
        }
    }

    if (moon) {
        symptoms.push("Mood swings fast hote hain");
        if (moon.rasi?.name === "Scorpio") {
            symptoms.push("Emotions deep aur kabhi kabhi heavy feel hote hain");
        }
    }

    return symptoms.slice(0, 6);
}

// 🪔 REMEDIES
function getRemedies(planets) {
    let remedies = [];

    if (findPlanet(planets, "saturn")) {
        remedies.push("Shanivaar ko tel daan karein");
    }

    if (findPlanet(planets, "rahu")) {
        remedies.push("Nariyal ko behte paani me flow karein");
    }

    if (findPlanet(planets, "moon")) {
        remedies.push("Doodh ya chawal daan karein");
    }

    return remedies;
}

// 📊 KARMA SCORE
function calculateKarmaScore(planets) {
    let score = 70;

    if (findPlanet(planets, "saturn")) score -= 10;
    if (findPlanet(planets, "rahu")) score -= 10;
    if (findPlanet(planets, "ketu")) score -= 5;

    return Math.max(score, 30);
}

// 🔮 MAIN FUNCTION
async function interpretKarmicSymptoms(planets, dob) {
    try {

        const age = getAge(dob);

        const planetSummary = planets.map(p =>
            `${p.name} in ${p.rasi?.name}`
        ).join(", ");

        const shockLine = generateShockLine(planets);
        const symptoms = getLalKitabSymptoms(planets);
        const remedies = getRemedies(planets);
        const karmaScore = calculateKarmaScore(planets);

        // 🧠 AGE-BASED EVENTS
        let ageEvents = [];

        if (age > 40) {
            ageEvents.push("Life me responsibility aur pressure zyada raha hai");
        }
        if (age > 30) {
            ageEvents.push("Career aur paisa stable karne me time laga");
        }
        if (age > 20) {
            ageEvents.push("Early life me struggle aur learning phase strong raha");
        }

        // 🤖 AI FOR HUMAN TOUCH
        const prompt = `
You are a Lal Kitab astrologer.

Planet Positions:
${planetSummary}

Generate JSON:
{
  "lifeEvents": [],
  "last2Hours": []
}

Rules:
- Hinglish
- Emotional + realistic
- Avoid generic lines
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.9
        });

        let parsed = {};
        try {
            parsed = JSON.parse(response.choices[0].message.content);
        } catch {
            parsed = {};
        }

        return {
            shockLine,
            karmaScore,
            lifeEvents: [...ageEvents, ...(parsed.lifeEvents || [])].slice(0, 5),
            symptoms,
            last2Hours: parsed.last2Hours || [],
            remedies
        };

    } catch (error) {
        console.error("❌ Error:", error.message);
        return null;
    }
}

// 🔮 FUTURE (PAID)
async function generateFuturePredictions(planets, type) {
    const prompt = `
Generate ${type} prediction in Hinglish JSON:
{
 "prediction": [],
 "advice": [],
 "warning": []
}
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
    });

    return JSON.parse(response.choices[0].message.content);
}

module.exports = {
    interpretKarmicSymptoms,
    generateFuturePredictions
};
