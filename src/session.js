let intervalId = null;

const PREP_TIME = 3;

// Skala animacji oddechu
const PHASE_SCALE = {
  Wdech: 1.1,
  Wydech: 0.9,
  Wstrzymanie: 1
};

// Start sesji
export function startSession(
  exercise,
  onUpdate,
  targetMinutes = 5) {

  stopSession();
  const phases = buildPhases(exercise);

  const cycleDuration = exercise.phases.reduce((sum, p) => sum + p.duration, 0);

  const cycles = Math.max(1, Math.round((targetMinutes * 60) / cycleDuration));

  let phaseIndex = 0;
  let remaining = phases[0].duration;
  let cyclesLeft = cycles;
  let lastTickTime = Date.now();
  let totalRemaining = PREP_TIME + cycleDuration * cycles;

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
      phaseChanged: remaining === phase.duration,
      totalRemaining
    });

    remaining--;
    totalRemaining--;

    if (remaining === 0) {
      if (phaseIndex < phases.length - 1) {
        phaseIndex++;
      } else {

        cyclesLeft--;

        if (cyclesLeft === 0) {
          stopSession();
          onUpdate({
            phase: "Koniec",
            remaining: 0,
            totalRemaining: 0
          });
          return;
        }
        phaseIndex = 1;
      }

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

// Tworzenie sesji 
function buildPhases(exercise) {
  return [
    {
      label: "Przygotowanie",
      duration: PREP_TIME,
      scale: 1
    },
    ...exercise.phases.map(p => ({
      label: p.label,
      duration: p.duration,
      scale: PHASE_SCALE[p.label] ?? 1
    }))
  ];
}
