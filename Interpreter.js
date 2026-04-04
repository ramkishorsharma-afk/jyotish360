function interpretKarmicSymptoms(planets, dob) {

    let karmaScore = 80;
    let symptoms = [];
    let lifeEvents = [];
    let remedies = [];

    const getPlanet = (name) => planets.find(p => p.name === name);

    const saturn = getPlanet("Saturn");
    const rahu = getPlanet("Rahu");
    const ketu = getPlanet("Ketu");
    const moon = getPlanet("Moon");
    const sun = getPlanet("Sun");
    const venus = getPlanet("Venus");
    const jupiter = getPlanet("Jupiter");

    // 🔮 SHANI
    if (saturn?.house === 12) {
        symptoms.push("Aapko akelapan aur delay feel hota hai");
        lifeEvents.push("Life me success late milta hai");
        remedies.push("Shanivar ko tel daan karein");
        karmaScore -= 10;
    }

    if (saturn?.house === 10) {
        lifeEvents.push("Career me slow growth but stable success milega");
        remedies.push("Kaale kapde daan karein");
    }

    // 🔮 RAHU
    if (rahu?.house === 12) {
        symptoms.push("Anxiety aur unknown fear rehta hai");
        lifeEvents.push("Sleep ya stress issues aaye hain");
        remedies.push("Nariyal bahaayein");
        karmaScore -= 10;
    }

    if (rahu?.house === 10) {
        lifeEvents.push("Career me sudden rise ya unexpected changes aate hain");
    }

    // 🔮 KETU
    if (ketu?.house === 1) {
        symptoms.push("Self doubt aur confusion rehta hai");
        remedies.push("Kutte ko roti khilayein");
        karmaScore -= 7;
    }

    // 🌙 MOON
    if (moon?.house === 6) {
        symptoms.push("Stress aur overthinking zyada hoti hai");
        remedies.push("Doodh daan karein");
        karmaScore -= 5;
    }

    if (moon?.house === 8) {
        symptoms.push("Mood swings aur emotional instability");
        remedies.push("Shiv ji ko jal chadhayein");
        karmaScore -= 6;
    }

    // ☀️ SUN
    if (sun?.house === 12) {
        lifeEvents.push("Respect ya recognition ki kami feel hoti hai");
        remedies.push("Surya ko jal chadhayein");
        karmaScore -= 6;
    }

    // 💰 MONEY (VERY IMPORTANT)
    if (jupiter?.house === 2 || jupiter?.house === 11) {
        lifeEvents.push("Aapke paas paisa aata hai par rukta nahi");
    }

    if (venus?.house === 2) {
        lifeEvents.push("Luxury aur comfort ki strong desire hai");
    }

    // ❤️ RELATIONSHIP (HIGH IMPACT)
    if (venus?.house === 7) {
        lifeEvents.push("Love marriage ya strong attraction life me aata hai");
    }

    if (ketu?.house === 7) {
        symptoms.push("Relationship me distance ya misunderstanding");
        lifeEvents.push("Trust issues ya delay in marriage");
        remedies.push("Ganesh ji ki pooja karein");
    }

    // 🔥 POWERFUL COMBINATIONS

    // Shani + Rahu combo
    if (saturn && rahu && saturn.house === rahu.house) {
        symptoms.push("Aapko lagta hai life me sab kuch ruk gaya hai");
        lifeEvents.push("Hard work zyada, result late milta hai");
        remedies.push("Shani mantra jaap karein");
        karmaScore -= 12;
    }

    // Moon + Rahu combo
    if (moon && rahu && moon.house === rahu.house) {
        symptoms.push("Dimag me negative thoughts aur overthinking");
        lifeEvents.push("Mental stress zyada raha hai");
        remedies.push("Chandi ka chhota tukda rakhein");
        karmaScore -= 10;
    }

    // 🔥 DEFAULT (if nothing matched)
    if (symptoms.length === 0) {
        symptoms.push("Aap sensitive aur deep thinker hain");
        lifeEvents.push("Aapne life me ups & downs dekhe hain");
    }

    // 🧠 PSYCHO HOOK LINE
    const shockLine = "Aapki life me jo ho raha hai woh random nahi hai... ye sab aapke karmon ka result hai";

    // ⏱ LAST 2 HOURS (CONVERSION HOOK)
    const last2Hours = [
        "Aapne last 2 ghante me kisi baat ko leke stress feel kiya",
        "Ek decision ko lekar confusion ya doubt raha"
    ];

    return {
        karmaScore,
        shockLine,
        lifeEvents,
        symptoms,
        last2Hours,
        remedies
    };
}

module.exports = { interpretKarmicSymptoms };
