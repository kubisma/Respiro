// Pełny ekran
export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

export function exitFullscreenIfActive() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

// Blokada ekranu
let wakeLock = null;

export async function toggleWakeLock() {
  if (!("wakeLock" in navigator)) {
    return false;
  }

  try {
    if (!wakeLock) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
      return true;
    } else {
      await wakeLock.release();
      wakeLock = null;
      return false;
    }
  } catch {
    return false;
  }
}