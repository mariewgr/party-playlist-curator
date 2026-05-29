const express = require('express');
const spotify = require('../spotify');
const voteStore = require('../voteStore');

const router = express.Router();

// Injected by index.js so routes can emit socket events
let io;
router.setIO = (socketIO) => { io = socketIO; };

router.get('/', (req, res) => {
  res.json(voteStore.getQueue());
});

router.post('/add', (req, res) => {
  const { track } = req.body;
  if (!track?.id) return res.status(400).json({ error: 'track required' });
  voteStore.addSong(track);
  io.emit('queue:update', voteStore.getQueue());
  res.json({ ok: true });
});

router.post('/vote/:trackId', (req, res) => {
  const { trackId } = req.params;
  const ok = voteStore.vote(trackId);
  if (!ok) return res.status(404).json({ error: 'Song not in queue' });
  io.emit('queue:update', voteStore.getQueue());
  res.json({ ok: true });
});

router.post('/play', async (req, res) => {
  const queue = voteStore.getQueue();
  if (queue.length === 0) return res.status(400).json({ error: 'Queue is empty' });
  const { track } = queue[0];
  try {
    await spotify.addToQueue(track.uri);
    await spotify.skipTrack();
    voteStore.remove(track.id);
    io.emit('queue:update', voteStore.getQueue());
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/skip', async (req, res) => {
  try {
    await spotify.skipTrack();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
