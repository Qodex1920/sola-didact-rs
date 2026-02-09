import React, { useState, useEffect, useRef } from "react";
import type { HistoryEntry, GeneratedAsset } from "@/types";
import { getHistory, deleteFromHistory, clearHistory } from "@/lib/storage";
import { getMediaBlob } from "@/lib/videoStorage";

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
  EDIT: "Mise en situation",
  GENERATE: "Création Pro",
  VIDEO: "Vidéo",
  ANALYZE: "Analyse",
};

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  onSelect,
  refreshKey,
}) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    // Revoke previous object URLs to free memory
    for (const url of objectUrlsRef.current) {
      URL.revokeObjectURL(url);
    }
    objectUrlsRef.current = [];

    const load = async () => {
      const raw = getHistory();
      const resolved = await Promise.all(
        raw.map(async (entry) => {
          // New format: blob stored in IndexedDB
          if (entry.asset.url === "idb:stored") {
            try {
              const blob = await getMediaBlob(entry.id);
              if (blob) {
                const objUrl = URL.createObjectURL(blob);
                objectUrlsRef.current.push(objUrl);
                return {
                  ...entry,
                  asset: { ...entry.asset, url: objUrl },
                };
              }
            } catch {}
            // Blob not found — show thumbnail as fallback
            return entry;
          }
          // Legacy: video with expired blob: URL — try IndexedDB
          if (
            entry.asset.type === "video" &&
            entry.asset.url.startsWith("blob:")
          ) {
            try {
              const blob = await getMediaBlob(entry.id);
              if (blob) {
                const objUrl = URL.createObjectURL(blob);
                objectUrlsRef.current.push(objUrl);
                return {
                  ...entry,
                  asset: { ...entry.asset, url: objUrl },
                };
              }
            } catch {}
          }
          // Legacy: inline data URL — still works as-is
          return entry;
        }),
      );
      if (!cancelled) setEntries(resolved);
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      for (const url of objectUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromHistory(id);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
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
                {entry.asset.type === "video" ? "🎬" : "🖼"}
              </div>
            )}
            <div className="p-1.5">
              <p className="text-[10px] font-medium text-gray-700 truncate">
                {entry.contextLabel}
              </p>
              <p className="text-[9px] text-gray-400">
                {MODE_LABELS[entry.mode] || entry.mode} ·{" "}
                {timeAgo(entry.createdAt)}
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
