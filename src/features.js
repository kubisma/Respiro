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
let isRequestingWakeLock = false;

export async function toggleWakeLock() {
  if (!("wakeLock" in navigator)) {
    return false;
  }

  if (isRequestingWakeLock) {
    return wakeLock !== null;
  }
  isRequestingWakeLock = true;
  try {
    if (!wakeLock) {
      const lock = await navigator.wakeLock.request("screen");

      wakeLock = lock;

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
    return wakeLock !== null;
  } finally {

    isRequestingWakeLock = false;
  }
}
