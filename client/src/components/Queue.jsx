export default function Queue({ queue, onVote, votedIds = [] }) {
  if (queue.length === 0) {
    return <p className="text-gray-400 text-center py-8">No songs in the queue yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {queue.map(({ track, votes }, index) => {
        const hasVoted = votedIds.includes(track.id);
        const minutes = Math.floor(track.duration_ms / 60000);
        const seconds = String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0');

        return (
          <div
            key={track.id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <span className="text-lg font-bold text-gray-300 w-6 text-center">{index + 1}</span>
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-bold text-green-600">{votes} vote{votes !== 1 ? 's' : ''}</span>
              {onVote && (
                <button
                  onClick={() => onVote(track.id)}
                  disabled={hasVoted}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {hasVoted ? 'Voted' : 'Vote'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
