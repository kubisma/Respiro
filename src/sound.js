let enabled = false;

const audio = new Audio();
audio.volume = 0.5;

// Dźwięki faz ćwiczenia
const PHASE_SOUNDS = {
  Wdech: "sounds/inhale.mp3",
  Wydech: "sounds/exhale.mp3",
  Wstrzymanie: "sounds/hold.mp3"
};

// Odtwarzanie dźwięku dla aktualnej fazy ćwiczenia
export function playPhaseSound(phase) {
  if (!enabled) return;

  const src = PHASE_SOUNDS[phase];
  if (!src) return;

  audio.src = src;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Włączanie / wyłączanie dźwięków
export function toggleSound() {
  enabled = !enabled;
  return enabled;
}

// Sprawdzanie, czy dźwięki są włączone
export function isSoundEnabled() {
  return enabled;
}
