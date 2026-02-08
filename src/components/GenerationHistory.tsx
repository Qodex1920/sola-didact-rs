import React, { useState, useEffect } from 'react';
import type { HistoryEntry, GeneratedAsset } from '@/types';
import { getHistory, deleteFromHistory, clearHistory } from '@/lib/storage';

interface GenerationHistoryProps {
  onSelect: (asset: GeneratedAsset) => void;
  refreshKey: number;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "A l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

const MODE_LABELS: Record<string, string> = {
  EDIT: 'Mise en situation',
  GENERATE: 'Création Pro',
  VIDEO: 'Vidéo',
  ANALYZE: 'Analyse',
};

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({ onSelect, refreshKey }) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, [refreshKey]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromHistory(id);
    setEntries(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setEntries([]);
  };

  if (entries.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Historique</h2>
        <button
          onClick={handleClearAll}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Tout effacer
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelect(entry.asset)}
            className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-sola-primary/50 transition-all cursor-pointer"
          >
            {entry.thumbnail ? (
              <img
                src={entry.thumbnail}
                alt={entry.contextLabel}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                {entry.asset.type === 'video' ? '🎬' : '🖼'}
              </div>
            )}
            <div className="p-1.5">
              <p className="text-[10px] font-medium text-gray-700 truncate">
                {entry.contextLabel}
              </p>
              <p className="text-[9px] text-gray-400">
                {MODE_LABELS[entry.mode] || entry.mode} · {timeAgo(entry.createdAt)}
              </p>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => handleDelete(entry.id, e)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
