let intervalId = null;

const PREP_TIME = 3;

// Przygotowanie sesji
export function startSession(
  exercise,
  onUpdate,
  targetMinutes = 5
) {
  stopSession();

  const phases = buildPhases(exercise);

  const cycleDuration = exercise.phases.reduce((sum, p) => sum + p.duration, 0);

  const cycles = Math.max(1, Math.round((targetMinutes * 60) / cycleDuration));

  let phaseIndex = 0;
  let remaining = phases[0].duration;
  let cyclesLeft = cycles;
  let totalRemaining = PREP_TIME + cycleDuration * cycles;

  function tickSession() {
    const phase = phases[phaseIndex];

    onUpdate({
      phase: phase.label,
      remaining,
      duration: phase.duration,
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
            totalRemaining: 0,
            phaseChanged: true
          });
          return;
        }

        phaseIndex = 1; 
      }
      remaining = phases[phaseIndex].duration;
    }
  }

  tickSession();              
  intervalId = setInterval(tickSession, 1000);
}

// Zatrzymanie sesji
export function stopSession() {
  if (!intervalId) return;

  clearInterval(intervalId);
  intervalId = null;
}

// Tworzenie cyklu 
function buildPhases(exercise) {
  return [
    {
      label: "Przygotowanie",
      duration: PREP_TIME
    },
    ...exercise.phases.map(p => ({
      label: p.label,
      duration: p.duration
    }))
  ];
}
