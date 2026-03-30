app.post('/generate', async (req, res) => {
    try {
        const { dob, time, place } = req.body;
        
        // Use fixed lat/lon for now or integrate a Geo-coding API
        const lat = 28.61; 
        const lon = 77.20;

        const kundali = await getKundali(dob, time, lat, lon);

        // FIX: Check if data exists correctly
        if (!kundali || !kundali.planet_position) {
            return res.json({
                success: false,
                message: "Astrology API failed to return data"
            });
        }

        const planets = kundali.planet_position;
        const moon = planets.find(p => p.name.toLowerCase() === "moon");

        // Simple logic for Past Life since we aren't using AI
        let pastLife = "Your chart suggests a soul with deep ancient wisdom.";
        if (moon) {
            pastLife = `Your Moon in ${moon.rasi.name} suggests your past life was focused on ${moon.rasi.name === 'Cancer' ? 'family and home' : 'discovery and growth'}.`;
        }

        res.json({
            success: true,
            data: {
                kundali: {
                    moonSign: moon?.rasi.name || "Unknown",
                    planets: planets.map(p => ({ name: p.name, sign: p.rasi.name }))
                },
                pastLife: pastLife
            }
        });

    } catch (error) {
        res.json({ success: false, message: "Server error" });
    }
});
