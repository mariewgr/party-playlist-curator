const express = require('express');
const axios = require('axios');
const spotify = require('../spotify');

const router = express.Router();

const SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
].join(' ');

router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

router.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect(`${process.env.CLIENT_URL}?auth=error`);

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  try {
    const { data } = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    spotify.setTokens(data);
    res.redirect(`${process.env.CLIENT_URL}?auth=success`);
  } catch {
    res.redirect(`${process.env.CLIENT_URL}?auth=error`);
  }
});

router.get('/token', (req, res) => {
  if (!spotify.hasToken()) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ accessToken: spotify.getAccessToken() });
});

module.exports = router;
