// spotifyClient.js
const axios = require('axios');
require('dotenv').config();

let accessToken = null;
let tokenExpiresAt = 0;

// Get a new access token using Client Credentials Flow
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization:
      'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
  };

  const data = new URLSearchParams({ grant_type: 'client_credentials' }).toString();

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000; // Refresh 1 min before expiry
    return accessToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching Spotify access token:', (error.response && error.response.data) ? error.response.data : error.message);
    throw error;
  }
}

// Helper to call Spotify API endpoints with auth
async function spotifyGet(endpoint, params = {}) {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`https://api.spotify.com/v1/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Spotify API error on ${endpoint}:`, (error.response && error.response.data) ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  getAccessToken,
  spotifyGet
};
