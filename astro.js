const axios = require('axios');
require('dotenv').config();

const USER_ID = process.env.ASTROLOGY_API_USER_ID;
const API_KEY = process.env.ASTROLOGY_API_KEY;

async function getKundali(dob, time, lat, lon) {
  try {
    const [year, month, day] = dob.split('-');
    const [hour, min] = time.split(':');

    const payload = {
      day: +day,
      month: +month,
      year: +year,
      hour: +hour,
      min: +min,
      lat,
      lon,
      tzone: 5.5
    };

    const authHeader = Buffer.from(`${USER_ID}:${API_KEY}`).toString('base64');

    const response = await axios.post(
      'https://json.astrologyapi.com/v1/planets/extended',
      payload,
      { headers: { Authorization: `Basic ${authHeader}` } }
    );

    let planetsArray =
      response.data.planets ||
      response.data.output ||
      response.data.data ||
      (Array.isArray(response.data) ? response.data : null);

    if (!planetsArray) {
      throw new Error("No planets array found in API response");
    }

    const planets = planetsArray.map(p => ({
      name: p.name || p.planet,
      rasi: { name: p.sign || p.rasi || '' }
    }));

    return { planet_position: planets };

  } catch (error) {
    console.error("❌ ASTRO ERROR:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getKundali };
