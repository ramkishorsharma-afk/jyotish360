const express = require("express");
const bodyParser = require("body-parser");
const { getKundali } = require("./astro");
const { generateReport } = require("./interpreter");

const app = express();
app.use(bodyParser.json());

// 🔥 MAIN API
app.post("/kundali", async (req, res) => {
    try {
        console.log("REQUEST BODY:", req.body);

        const { dob, time, lat, lon } = req.body;

        const kundali = await getKundali(dob, time, lat, lon);

        if (!kundali.success) {
            return res.json(kundali);
        }

        const report = await generateReport(kundali);

        res.send(report); // HTML output

    } catch (err) {
        console.error("SERVER ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// HEALTH CHECK
app.get("/", (req, res) => {
    res.send("Jyotish API Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
