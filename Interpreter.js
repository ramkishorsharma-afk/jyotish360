/**
 * 🔮 Interpreter.js - Logic Engine for Jyotish360
 * Optimized for Lal Kitab Remedies, Vastu, and Time-Specific Predictions
 */

function interpretKarmicSymptoms(planets, dob) {
    let karmaScore = 85; // Starting with a slightly higher baseline
    let symptoms = [];
    let lifeEvents = [];
    let remedies = [];
    let vastuTips = [];

    const birthYear = new Date(dob).getFullYear();
    const getPlanet = (name) => planets.find(p => p.name === name);

    const saturn = getPlanet("Saturn");
    const rahu = getPlanet("Rahu");
    const ketu = getPlanet("Ketu");
    const moon = getPlanet("Moon");
    const sun = getPlanet("Sun");
    const venus = getPlanet("Venus");
    const jupiter = getPlanet("Jupiter");
    const mars = getPlanet("Mars");
    const mercury = getPlanet("Mercury");

    // 🔮 SHANI (Saturn) - Career & Discipline
    if (saturn?.house === 12) {
        symptoms.push("Aapko aksar lagta hai ki mehnat zyada hai aur phal (result) kam.");
        lifeEvents.push({ year: birthYear + 36, event: "Career me bada transformation ya foreign settlement ka yoga bana tha." });
        remedies.push("Shanivar ko kisi gareeb ko tel ya kaale chane daan karein.");
        vastuTips.push("Ghar ki South wall ko hamesha bhari (heavy) rakhein.");
        karmaScore -= 12;
    }
    if (saturn?.house === 10) {
        lifeEvents.push({ year: birthYear + 28, event: "Professional life me pehli badi stability ya promotion mila." });
        remedies.push("Chhat ke upar kabaad ya purani lakdi na rakhein.");
        vastuTips.push("West direction me blue color ka element use karein.");
    }

    // 🔮 RAHU - Ambition & Illusion
    if (rahu?.house === 12 || rahu?.house === 8) {
        symptoms.push("Raat ko overthinking aur unknown fears pareshaan karte hain.");
        lifeEvents.push({ year: birthYear + 21, event: "Mental stress ya sleep patterns me bada badlav aaya tha." });
        remedies.push("Sone se pehle saunf (fennel) aur mishri khaayein.");
        vastuTips.push("South-West corner me toilet hamesha dry aur saaf rakhein.");
        karmaScore -= 15;
    }

    // 🔮 KETU - Detachment
    if (ketu?.house === 1 || ketu?.house === 7) {
        symptoms.push("Aapko log aksar misunderstanding ki wajah se galat samajh lete hain.");
        remedies.push("Multi-color kambal (blanket) kisi mandir ya gareeb ko daan karein.");
        vastuTips.push("Main door ke piche kude-daan (dustbin) kabhi na rakhein.");
        karmaScore -= 8;
    }

    // 🌙 MOON - Emotions
    if (moon?.house === 6 || moon?.house === 8 || moon?.house === 12) {
        symptoms.push("Mood swings aur pani se related health issues ho sakte hain.");
        remedies.push("Shivling par jal chadhayein aur chandi ka tukda apne paas rakhein.");
        vastuTips.push("North-East me underground water tank ya matti ka matka rakhein.");
        karmaScore -= 10;
    }

    // ☀️ SUN - Ego & Father
    if (sun?.house === 10 || sun?.house === 1) {
        lifeEvents.push({ year: birthYear + 22, event: "Leadership role ya government related works me success mili." });
        remedies.push("Aditya Hridaya Stotra ka paath karein.");
        vastuTips.push("East me badi window rakhein taaki natural light aaye.");
    }

    // 🧠 MERCURY (Budh) - Business & Speech
    if (mercury?.house === 3 || mercury?.house === 8) {
        symptoms.push("Communication me kabhi kabhi misunderstanding ho jati hai.");
        remedies.push("Choti kanyao (little girls) ko halwa ya meetha baantein.");
        vastuTips.push("North direction me hare (green) paudhe (plants) rakhein.");
        karmaScore -= 5;
    }

    // 💕 VENUS (Shukra) - Luxury & Love
    if (venus?.house === 12 || venus?.house === 6) {
        symptoms.push("Paisa kharch zyada hota hai, luxury maintain karne me.");
        remedies.push("Ghar me hamesha halki (light) fragrance ya camphor (kapur) jalayein.");
        vastuTips.push("South-East corner me kitchen hamesha vyavasthit rakhein.");
        karmaScore -= 7;
    }

    // 💰 JUPITER (Guru)
    if (jupiter?.house === 2 || jupiter?.house === 5 || jupiter?.house === 11) {
        lifeEvents.push({ year: birthYear + 16, event: "Education ya family respect me vridhi (growth) hui." });
        remedies.push("Peela tilak (Saffron/Turmeric) roz lagayein.");
        vastuTips.push("Brahmasthan (Center of House) ko hamesha saaf aur khali rakhein.");
    }

    // 🔥 MARS (Mangal)
    if (mars?.house === 4 || mars?.house === 8) {
        symptoms.push("Bhaiyo se matbhed ya property related chinta ho sakti hai.");
        remedies.push("Mangalvar ko mithi roti kutte ko khilayein.");
        vastuTips.push("South direction me red color ka element ya Hanuman ji ka chitra lagayein.");
        karmaScore -= 10;
    }

    // 🧠 PSYCHO HOOK LINE
    const shockLine = "Ye graph aapke karmon ka darpan hai... planets sirf rasta dikhate hain.";

    // ⏱ REAL-TIME 2-HOUR LOGIC
    const currentHour = new Date().getHours();
    let next2Prediction = "";
    
    if (currentHour >= 9 && currentHour < 12) next2Prediction = "Financial gains aur naye ideas execute karne ka samay hai.";
    else if (currentHour >= 12 && currentHour < 15) next2Prediction = "Thoda ruk kar sochein, communication me jaldbaazi na karein.";
    else if (currentHour >= 18 && currentHour < 21) next2Prediction = "Parivaar ke sath samay bitane aur man-mutav dur karne ka waqt hai.";
    else next2Prediction = "Antar-man (inner self) se judne aur vishram ka samay hai.";

    const last2Hours = [
        "Aapne pichle 2 ghanto me kisi purani yaadein ya decision par gaur kiya.",
        "Aapki nazar kisi aisi cheez par padi jo aapke future se judi hai."
    ];

    return {
        karmaScore: Math.max(15, Math.min(99, karmaScore)), 
        shockLine,
        lifeEvents,
        symptoms,
        last2Hours,
        next2Hours: next2Prediction,
        remedies,
        vastuTips
    };
}

module.exports = { interpretKarmicSymptoms };
