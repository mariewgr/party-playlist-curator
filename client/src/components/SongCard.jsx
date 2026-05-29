export default function SongCard({ track, action, actionLabel, disabled }) {
  const minutes = Math.floor(track.duration_ms / 60000);
  const seconds = String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0');

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      {track.album?.images?.[0]?.url && (
        <img
          src={track.album.images[0].url}
          alt={track.album.name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0 text-left">
        <p className="font-semibold text-gray-900 truncate">{track.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {track.artists?.map((a) => a.name).join(', ')} · {minutes}:{seconds}
        </p>
      </div>
      {action && (
        <button
          onClick={() => action(track)}
          disabled={disabled}
          className="flex-shrink-0 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
