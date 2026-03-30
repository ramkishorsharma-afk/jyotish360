// 1. Import at the top
const { interpretKarmicReading } = require('./interpreter');

// 2. Inside your app.post('/generate')
const kundali = await getKundali(dob, time, lat, lon);
app.post('/generate', async (req, res) => {
    try {
        let { dob, time, place } = req.body;

        // If the date is 31-07-1979, convert it to 1979-07-31
        if (dob.includes('-') && dob.split('-')[0].length === 2) {
            const [d, m, y] = dob.split('-');
            dob = `${y}-${m}-${d}`;
        }
        
        // Now call the astro service with the corrected date
        const kundali = await getKundali(dob, time, 28.61, 77.20);
        // ... rest of your code

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
