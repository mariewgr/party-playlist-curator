const store = new Map();

function addSong(track) {
  if (!store.has(track.id)) {
    store.set(track.id, { track, votes: 0 });
  }
}

function vote(trackId) {
  const entry = store.get(trackId);
  if (!entry) return false;
  entry.votes += 1;
  return true;
}

function getQueue() {
  return Array.from(store.values()).sort((a, b) => b.votes - a.votes);
}

function remove(trackId) {
  store.delete(trackId);
}

function clear() {
  store.clear();
}

module.exports = { addSong, vote, getQueue, remove, clear };
