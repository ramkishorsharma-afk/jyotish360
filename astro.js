require('dotenv').config();
const axios = require('axios');

const USER_ID = process.env.ASTRO_USER_ID;
const API_KEY = process.env.ASTRO_API_KEY;

function getAuthHeader() {
  const auth = Buffer.from(`${USER_ID}:${API_KEY}`).toString('base64');
  return { Authorization: `Basic ${auth}` };
}

async function getLalKitabHouses(dob, time, place) {
  try {
    const response = await axios.post(
      'https://json.astrologyapi.com/v1/lalkitab_houses',
      {
        day: dob.day,
        month: dob.month,
        year: dob.year,
        hour: time.hour,
        min: time.min,
        lat: place.lat,
        lon: place.lon
      },
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept-Language': 'hi'
        }
      }
    );
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : err.message;
  }
}

module.exports = { getLalKitabHouses };
