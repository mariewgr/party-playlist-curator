const axios = require('axios');

let accessToken = null;
let refreshToken = null;
let tokenExpiresAt = 0;

function setTokens({ access_token, refresh_token, expires_in }) {
  accessToken = access_token;
  if (refresh_token) refreshToken = refresh_token;
  tokenExpiresAt = Date.now() + expires_in * 1000;
}

function getAccessToken() {
  return accessToken;
}

function hasToken() {
  return !!accessToken;
}

async function ensureFreshToken() {
  if (!accessToken) throw new Error('Not authenticated');
  if (Date.now() > tokenExpiresAt - 60000) {
    await refreshAccessToken();
  }
}

async function refreshAccessToken() {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post('https://accounts.spotify.com/api/token', params, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  setTokens(data);
}

async function searchTracks(query) {
  await ensureFreshToken();
  const { data } = await axios.get('https://api.spotify.com/v1/search', {
    params: { q: query, type: 'track', limit: 8 },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data.tracks.items;
}

async function addToQueue(trackUri) {
  await ensureFreshToken();
  await axios.post(
    `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}`,
    null,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}

async function getCurrentTrack() {
  await ensureFreshToken();
  const { data, status } = await axios.get(
    'https://api.spotify.com/v1/me/player/currently-playing',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (status === 204 || !data?.item) return null;
  return data.item;
}

async function skipTrack() {
  await ensureFreshToken();
  await axios.post('https://api.spotify.com/v1/me/player/next', null, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

module.exports = {
  setTokens,
  getAccessToken,
  hasToken,
  searchTracks,
  addToQueue,
  getCurrentTrack,
  skipTrack,
};
