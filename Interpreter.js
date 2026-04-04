function interpretKarmicSymptoms(planets, dob) {

    let karmaScore = 80;
    let symptoms = [];
    let lifeEvents = [];

    const hasSaturn = planets.some(p => p.name === "Saturn");
    const hasRahu = planets.some(p => p.name === "Rahu");

    if (hasSaturn) {
        karmaScore -= 15;
        symptoms.push("Kaam me delay aur rukawat aati hai");
        lifeEvents.push("Mehnat zyada, result late mila");
    }

    if (hasRahu) {
        karmaScore -= 10;
        symptoms.push("Overthinking aur confusion rehta hai");
        lifeEvents.push("Decision lene me doubt hota hai");
    }

    return {
        karmaScore,
        shockLine: "Aapki life me jo ho raha hai woh random nahi hai",
        lifeEvents,
        symptoms,
        last2Hours: [
            "Aapne recently stress feel kiya",
            "Kisi baat ka confusion raha"
        ]
    };
}

module.exports = { interpretKarmicSymptoms };
function getLalKitabHouses(planets) {
    // Simple logic (can upgrade later)

    return planets.map((p, index) => ({
        name: p.name,
        house: (index % 12) + 1 // temporary house mapping
    }));
}
