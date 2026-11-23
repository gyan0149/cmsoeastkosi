// Demo storage in this browser's localStorage; swap for Firebase/Firestore to share data with everyone.
import { useCallback, useMemo, useSyncExternalStore } from "react";

const CHANGED = "school-local-changed";

function subscribe(cb: () => void) {
  window.addEventListener(CHANGED, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGED, cb);
    window.removeEventListener("storage", cb);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    alert("सेव नहीं हो पाया (स्टोरेज भर गया)। / Could not save (storage full).");
  }
  window.dispatchEvent(new Event(CHANGED));
}

// Live list stored under one key; every component using the key updates together.
export function useLocalList<T>(key: string): [T[], (items: T[]) => void] {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key));
  const items = useMemo<T[]>(() => {
    try {
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }, [raw]);
  const save = useCallback((next: T[]) => writeList(key, next), [key]);
  return [items, save];
}

export const newId = () => crypto.randomUUID();

// Shrinks a photo to a small JPEG data URL so it fits in browser storage.
export function photoToDataUrl(file: File, max = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Bad image"));
    };
    img.src = url;
  });
}
