import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SongCard from './SongCard';

const SERVER = import.meta.env.VITE_SERVER_URL;

export default function SearchBar({ onAdd, actionLabel = 'Add' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${SERVER}/api/search`, { params: { q: query } });
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const handleAdd = (track) => {
    onAdd(track);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a song..."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 bg-white"
      />
      {loading && <p className="text-sm text-gray-400 mt-2">Searching...</p>}
      {results.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {results.map((track) => (
            <SongCard
              key={track.id}
              track={track}
              action={handleAdd}
              actionLabel={actionLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
