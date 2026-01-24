import { dom } from "./dom.js";

// Banner offline
function updateStatus(isOnline) {
  if (!dom.offlineBanner) return;

  dom.offlineBanner.style.display = isOnline ? 'none' : 'block';
}

export function enableOfflineBanner() {
  window.addEventListener('online', () => updateStatus(true));
  window.addEventListener('offline', () => updateStatus(false));

  updateStatus(navigator.onLine);
}
