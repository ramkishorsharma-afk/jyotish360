const express = require("express");
const bodyParser = require("body-parser");
const { getKundali } = require("./astro");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
    res.send("Astrology API running 🚀");
});

// Main API
app.post("/kundali", async (req, res) => {
    try {
        console.log("REQUEST BODY:", req.body); // ✅ DEBUG

        const { dob, time, lat, lon } = req.body;

        const result = await getKundali(dob, time, lat, lon);

        res.json(result);

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
