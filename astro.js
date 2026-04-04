const axios = require('axios');
require('dotenv').config();

const USER_ID = process.env.ASTROLOGY_API_USER_ID;
const API_KEY = process.env.ASTROLOGY_API_KEY;

const response = await axios.post(
  'https://json.astrologyapi.com/v1/planets/extended',
  payload,
  { headers: { ...getAuthHeader(), 'Content-Type':'application/json' } }
);


// 🌌 Kundali (planet positions)
async function getKundali(dob, time, lat, lon) {
  const [year, month, day] = dob.split('-');
  const [hour, min] = time.split(':');

  const payload = { day:+day, month:+month, year:+year, hour:+hour, min:+min, lat, lon, tzone:5.5 };

  try {
    const response = await axios.post(
      'https://json.astrologyapi.com/v1/planets/extended',
      payload,
      { headers: { ...getAuthHeader(), 'Content-Type':'application/json' } }
    );

    const planetsArray =
      response.data.planets ||
      response.data.output ||
      response.data.data ||
      (Array.isArray(response.data) ? response.data : null);

    if (!planetsArray) throw new Error("No planets array found in API response");

    const planets = planetsArray.map(p => ({
      name: p.name || p.planet,
      rasi: { name: p.sign || p.rasi || '' }
    }));

    return { planet_position: planets };
  } catch (error) {
    console.error("❌ Kundali Error:", error.response?.data || error.message);
    throw error;
  }
}

// 📜 Lal Kitab Houses
async function getLalKitabHouses(dob, time, lat, lon) {
  const [year, month, day] = dob.split('-');
  const [hour, min] = time.split(':');

  const payload = { day:+day, month:+month, year:+year, hour:+hour, min:+min, lat, lon, tzone:5.5 };

  try {
    const response = await axios.post(
      'https://json.astrologyapi.com/v1/lalkitab_houses',
      payload,
      { headers: { ...getAuthHeader(), 'Content-Type':'application/json', 'Accept-Language':'hi' } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lal Kitab Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getKundali, getLalKitabHouses };
