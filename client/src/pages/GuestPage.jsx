import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import SearchBar from '../components/SearchBar';
import Queue from '../components/Queue';
import Toast from '../components/Toast';

const SERVER = `http://${window.location.hostname}:3001`;

export default function GuestPage() {
  const [queue, setQueue] = useState([]);
  const [votedIds, setVotedIds] = useState(
    () => JSON.parse(localStorage.getItem('voted') || '[]')
  );
  const [toast, setToast] = useState('');

  useEffect(() => {
    socket.on('queue:update', setQueue);
    axios.get(`${SERVER}/api/queue`).then(({ data }) => setQueue(data)).catch(() => {});
    return () => socket.off('queue:update', setQueue);
  }, []);

  const showToast = (msg) => setToast(msg);

  const handleVote = async (trackId) => {
    if (votedIds.includes(trackId)) return;
    try {
      await axios.post(`${SERVER}/api/queue/vote/${trackId}`);
      const updated = [...votedIds, trackId];
      setVotedIds(updated);
      localStorage.setItem('voted', JSON.stringify(updated));
      showToast('Vote cast!');
    } catch {
      showToast('Could not vote, try again');
    }
  };

  const handleSuggest = async (track) => {
    try {
      await axios.post(`${SERVER}/api/queue/add`, { track });
      showToast(`"${track.name}" suggested!`);
    } catch {
      showToast('Could not suggest song');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="text-center pt-4">
          <h1 className="text-3xl font-bold text-gray-900">Party Queue</h1>
          <p className="text-gray-500 mt-1">Vote for the next song</p>
        </div>

        <section>
          <h2 className="text-base font-semibold text-gray-600 mb-2">Suggest a song</h2>
          <SearchBar onAdd={handleSuggest} actionLabel="Suggest" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-600 mb-2">Up next</h2>
          <Queue queue={queue} onVote={handleVote} votedIds={votedIds} />
        </section>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
