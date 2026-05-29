import { useState, useEffect } from 'react';
import axios from 'axios';

const SERVER = import.meta.env.VITE_SERVER_URL;

export default function NowPlaying({ onSkip }) {
  const [track, setTrack] = useState(null);

  const fetchNowPlaying = async () => {
    try {
      const { data } = await axios.get(`${SERVER}/api/now-playing`);
      setTrack(data);
    } catch {
      setTrack(null);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!track) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-400">
        Nothing playing right now.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-xl">
      {track.album?.images?.[0]?.url && (
        <img
          src={track.album.images[0].url}
          alt={track.album.name}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Now Playing</p>
        <p className="font-bold text-gray-900 truncate">{track.name}</p>
        <p className="text-sm text-gray-500 truncate">{track.artists?.map((a) => a.name).join(', ')}</p>
      </div>
      <button
        onClick={onSkip}
        className="flex-shrink-0 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
