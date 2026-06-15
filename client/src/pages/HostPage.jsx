import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import NowPlaying from '../components/NowPlaying';
import SearchBar from '../components/SearchBar';
import Queue from '../components/Queue';
import QRCode from '../components/QRCode';
import Toast from '../components/Toast';

const SERVER = `http://${window.location.hostname}:3001`;

export default function HostPage() {
  const [token, setToken] = useState(null);
  const [queue, setQueue] = useState([]);
  const [toast, setToast] = useState('');
  const [votedIds, setVotedIds] = useState(
    () => JSON.parse(localStorage.getItem('host-voted') || '[]')
  );

  // Check for token on mount and after OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      window.history.replaceState({}, '', '/');
    }
    axios.get(`${SERVER}/auth/token`)
      .then(({ data }) => setToken(data.accessToken))
      .catch(() => setToken(null));
  }, []);

  // Live queue updates via socket.io
  useEffect(() => {
    socket.on('queue:update', setQueue);
    // Fetch initial queue
    axios.get(`${SERVER}/api/queue`).then(({ data }) => setQueue(data)).catch(() => {});
    return () => socket.off('queue:update', setQueue);
  }, []);

  const showToast = (msg) => setToast(msg);

  const handleAdd = async (track) => {
    try {
      await axios.post(`${SERVER}/api/queue/add`, { track });
      showToast(`"${track.name}" added to queue`);
    } catch {
      showToast('Failed to add song');
    }
  };

  const handleSkip = async () => {
    try {
      await axios.post(`${SERVER}/api/queue/skip`);
      showToast('Skipped!');
    } catch {
      showToast('Could not skip — make sure Spotify is playing');
    }
  };

  const handleVote = async (trackId) => {
    if (votedIds.includes(trackId)) return;
    try {
      await axios.post(`${SERVER}/api/queue/vote/${trackId}`);
      const updated = [...votedIds, trackId];
      setVotedIds(updated);
      localStorage.setItem('host-voted', JSON.stringify(updated));
      showToast('Vote cast!');
    } catch {
      showToast('Could not vote');
    }
  };

  const handlePlayTop = async () => {
    try {
      await axios.post(`${SERVER}/api/queue/play`);
      showToast('Playing top-voted song!');
    } catch {
      showToast('Could not play — make sure Spotify is active');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Party Playlist Curator</h1>
          <p className="text-gray-500">Connect Spotify to start the party</p>
        </div>
        <a
          href={`${SERVER}/auth/login`}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-2xl transition-colors shadow-md"
        >
          Connect Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Party Playlist Curator</h1>

        <NowPlaying onSkip={handleSkip} />

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Add a song</h2>
          <SearchBar onAdd={handleAdd} actionLabel="Add" />
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Queue</h2>
            {queue.length > 0 && (
              <button
                onClick={handlePlayTop}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Play top song
              </button>
            )}
          </div>
          <Queue queue={queue} onVote={handleVote} votedIds={votedIds} />
        </section>

        <QRCode />
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
