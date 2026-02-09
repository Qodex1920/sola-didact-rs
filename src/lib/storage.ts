import type { HistoryEntry } from "@/types";
import { deleteMediaBlob, clearAllMediaBlobs } from "./videoStorage";

const STORAGE_KEY = "sola-didact-history";
const MAX_ENTRIES = 50;

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

  // Limit entries — oldest ones get purged
  const removed = history.splice(MAX_ENTRIES);
  for (const old of removed) {
    deleteMediaBlob(old.id).catch(() => {});
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // If localStorage is full (shouldn't happen with thumbnails only), trim
    history.splice(Math.floor(history.length / 2));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

export function deleteFromHistory(id: string): void {
  deleteMediaBlob(id).catch(() => {});
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  clearAllMediaBlobs().catch(() => {});
  localStorage.removeItem(STORAGE_KEY);
}

export async function createThumbnail(
  dataUrl: string,
  maxWidth = 300,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function createVideoThumbnail(
  videoUrl: string,
  maxWidth = 300,
): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, video.duration || 0.5);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const ratio = maxWidth / video.videoWidth;
      canvas.width = maxWidth;
      canvas.height = video.videoHeight * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    video.onerror = () => resolve("");
    video.src = videoUrl;
    video.load();
  });
}
