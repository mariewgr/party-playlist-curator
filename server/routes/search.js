const express = require('express');
const spotify = require('../spotify');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const tracks = await spotify.searchTracks(q);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
