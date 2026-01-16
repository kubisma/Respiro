let intervalId = null;

const PREP_TIME = 3;

const PHASE_SCALE = {
  Wdech: 1.1,
  Wydech: 0.9,
  Wstrzymanie: 1
};

// Start sesji ćwiczenia
export function startSession(exercise, onUpdate) {
  stopSession();

  const phases = buildPhases(exercise);

  let phaseIndex = 0;
  let remaining = phases[0].duration;
  let lastTickTime = Date.now();

  function tick() {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastTickTime) / 1000);

    if (elapsedSeconds <= 0) return;

    lastTickTime += elapsedSeconds * 1000;

    for (let i = 0; i < elapsedSeconds; i++) {
      tickSession();
    }
  }

// Obsługa czasu sesji i zmiana faz
  function tickSession() {
    const phase = phases[phaseIndex];

    onUpdate({
      phase: phase.label,
      remaining,
      duration: phase.duration,
      scale: phase.scale,
      phaseChanged: remaining === phase.duration
    });

    remaining--;

    if (remaining === 0) {
      phaseIndex = phaseIndex < phases.length - 1 ? phaseIndex + 1 : 1;
      remaining = phases[phaseIndex].duration;
    }
  }

  tickSession();
  intervalId = setInterval(tick, 250);
}

// Zatrzymanie sesji
export function stopSession() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

// Tworzenie listy faz sesji
function buildPhases(exercise) {
  return [
    { label: "Przygotowanie", duration: PREP_TIME, scale: 1 },
    ...exercise.phases.map(p => ({
      label: p.label,
      duration: p.duration,
      scale: PHASE_SCALE[p.label] ?? 1
    }))
  ];
}
