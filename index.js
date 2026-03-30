// 1. Import at the top
const { interpretKarmicReading } = require('./interpreter');

// 2. Inside your app.post('/generate')
const kundali = await getKundali(dob, time, lat, lon);

if (kundali && kundali.planet_position) {
    // Generate the reading using the new logic
    const pastLifeText = interpretKarmicReading(kundali.planet_position);

    res.json({
        success: true,
        data: {
            kundali: {
                moonSign: kundali.planet_position.find(p => p.name.toLowerCase() === "moon")?.rasi.name || "Unknown",
                planets: kundali.planet_position.map(p => ({ name: p.name, sign: p.rasi.name }))
            },
            pastLife: pastLifeText // This is the final mystical sentence
        }
    });
}
