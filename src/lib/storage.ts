import type { HistoryEntry } from '@/types';

const STORAGE_KEY = 'sola-didact-history';
const MAX_ENTRIES = 50;
const MAX_STORAGE_BYTES = 4 * 1024 * 1024; // 4MB

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): void {
  const history = getHistory();
  history.unshift(entry);

  // Limit to MAX_ENTRIES
  if (history.length > MAX_ENTRIES) {
    history.splice(MAX_ENTRIES);
  }

  // Purge if localStorage too large
  let serialized = JSON.stringify(history);
  while (new Blob([serialized]).size > MAX_STORAGE_BYTES && history.length > 1) {
    history.pop();
    serialized = JSON.stringify(history);
  }

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // If still too large, clear oldest entries aggressively
    history.splice(Math.floor(history.length / 2));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

export function deleteFromHistory(id: string): void {
  const history = getHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function createThumbnail(dataUrl: string, maxWidth = 300): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
