/**
 * 🔮 Interpreter.js - Logic Engine for Jyotish360
 * Optimized for Lal Kitab Remedies, Vastu, and Time-Specific Predictions
 */

function interpretKarmicSymptoms(planets, dob) {
    let karmaScore = 80;
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

    // 🔮 SHANI (Saturn)
    if (saturn?.house === 12) {
        symptoms.push("Aapko akelapan aur delay feel hota hai.");
        lifeEvents.push({ year: birthYear + 36, event: "Career me bada transformation ya foreign settlement ka yoga bana tha." });
        remedies.push("Shanivar ko tel daan karein.");
        vastuTips.push("Ghar ki South wall ko hamesha heavy rakhein.");
        karmaScore -= 10;
    }
    if (saturn?.house === 10) {
        lifeEvents.push({ year: birthYear + 28, event: "Career me mehnat ke baad pehli badi stability mili." });
        remedies.push("Kaale kapde ya chhatri daan karein.");
        vastuTips.push("West direction me kachra ya kabaad na rakhein.");
    }

    // 🔮 RAHU
    if (rahu?.house === 12) {
        symptoms.push("Anxiety aur unknown fear rehta hai.");
        lifeEvents.push({ year: birthYear + 21, event: "Mental stress ya sleep patterns me bada badlav aaya tha." });
        remedies.push("Behte paani me nariyal bahaayein (Lal Kitab).");
        vastuTips.push("South-West corner me toilet hamesha saaf rakhein.");
        karmaScore -= 10;
    }

    // 🔮 KETU
    if (ketu?.house === 1) {
        symptoms.push("Self-doubt aur confusion rehta hai.");
        remedies.push("Kutte ko roti khilayein aur multi-color kambal daan karein.");
        vastuTips.push("Main entrance par Ganesh ji ki murti andar ki taraf muh karke lagayein.");
        karmaScore -= 7;
    }

    // 🌙 MOON
    if (moon?.house === 6 || moon?.house === 8) {
        symptoms.push("Stress aur overthinking zyada hoti hai.");
        remedies.push("Shiv ji ko kachha doodh aur jal chadhayein.");
        vastuTips.push("North-East corner me hamesha pani ka matti ka matka rakhein.");
        karmaScore -= 6;
    }

    // ☀️ SUN
    if (sun?.house === 12) {
        lifeEvents.push({ year: birthYear + 22, event: "Social respect ya father ki health ko leke chinta rahi hogi." });
        remedies.push("Surya ko tamre (copper) lote se jal chadhayein.");
        vastuTips.push("East direction me bhari furniture bilkul na rakhein.");
        karmaScore -= 6;
    }

    // 💰 JUPITER (Money & Wisdom)
    if (jupiter?.house === 2 || jupiter?.house === 11) {
        lifeEvents.push({ year: birthYear + 16, event: "Education ya family wealth me sudden growth/change." });
        remedies.push("Chane ki daal aur haldi mandir me daan karein.");
        vastuTips.push("Ghar ke center (Brahmasthan) ko hamesha khali rakhein.");
    }

    // 🔥 MARS (Energy & Vastu)
    if (mars?.house === 4) {
        symptoms.push("Ghar me choti choti baaton par kalesh ya property stress.");
        remedies.push("Mithai ya shehad (honey) matti ke bartan me bhar ke sunsaan jagah dabayein.");
        vastuTips.push("South direction me hamesha red color ka bulb ya element rakhein.");
    }

    // 🧠 PSYCHO HOOK LINE
    const shockLine = "Aapki life me jo ho raha hai woh random nahi hai... ye planets ka khel hai.";

    // ⏱ REAL-TIME 2-HOUR LOGIC
    const currentHour = new Date().getHours();
    let next2Prediction = "";
    
    if (currentHour >= 9 && currentHour < 12) next2Prediction = "Financial discussions ya planning ke liye shubh samay hai.";
    else if (currentHour >= 12 && currentHour < 15) next2Prediction = "Travel ya communication me delay ho sakta hai, dhairya rakhein.";
    else if (currentHour >= 18 && currentHour < 21) next2Prediction = "Family matters me solution milne ke chances hain.";
    else next2Prediction = "Mental peace aur meditation ke liye best samay shuru ho raha hai.";

    const last2Hours = [
        "Aapne last 2 ghante me kisi purani baat ko leke stress feel kiya.",
        "Mobile ya laptop par kisi message ko dekh kar thoda doubt raha."
    ];

    return {
        karmaScore: Math.max(20, karmaScore), // Ensure score doesn't go below 20
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
