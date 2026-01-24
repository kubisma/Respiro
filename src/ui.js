import { dom } from "./dom.js";
import { getRandomText } from "./texts.js";

// Ekrany aplikacji
export function showView(name) {
  document
    .querySelectorAll(".view")
    .forEach(v => v.classList.remove("active"));

  document
    .getElementById(`view-${name}`)
    ?.classList.add("active");
}

// Lista ćwiczeń
export function renderExerciseList(exercises, onSelect) {
  const list = document.getElementById("exerciseList");
  if (!list) return;

  list.textContent = "";

  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = ex.title;

    const desc = document.createElement("p");
    desc.textContent = ex.desc;

    card.append(title, desc);

    card.addEventListener("click", () => onSelect(ex));

    list.appendChild(card);
  });
}

// Szczegóły ćwiczenia
export function renderDetails(exercise) {
  if (
    !dom.detailsTitle ||
    !dom.detailsDesc ||
    !dom.detailsParams
  ) return;

  dom.detailsTitle.textContent = exercise.title;
  dom.detailsDesc.textContent = exercise.desc;

  dom.detailsParams.textContent = "";

  exercise.phases.forEach(p => {
    const row = document.createElement("p");
    row.textContent = `${p.label}: ${p.duration}s`;
    dom.detailsParams.appendChild(row);
  });
}

// Wizualizacja oddechu
export function updateSessionUI({
  phase,
  remaining,
  duration,
  scale,
  phaseChanged,
  totalRemaining
}) {
  if (!dom.circle || !dom.phase || !dom.timer) return;

  if (phase === "Koniec") {
    dom.phase.textContent = getRandomText();
    dom.timer.textContent = "Koniec ćwiczenia";

    dom.circle.style.transition = "none";
    dom.circle.style.transform = "scale(1)";
    return;
  }

  // Sesja ćwczenia
  dom.phase.textContent = phase;

  const min = Math.floor(totalRemaining / 60);
  const sec = totalRemaining % 60;

  dom.timer.textContent =
    `${remaining}s • ${min}:${sec
      .toString()
      .padStart(2, "0")}`;

  if (!phaseChanged) return;

  if (phase === "Wstrzymanie") {
    dom.circle.style.transition = "none";
    return;
  }

  /* Animacja powiększania / zmniejszania koła */
  dom.circle.style.transition =
    `transform ${duration}s linear`;

  dom.circle.style.transform = `scale(${scale})`;
}

// Reset wizualizacji oddechu
export function resetBreathingCircle() {
  if (!dom.circle) return;

  dom.circle.style.transition = "none";
  dom.circle.style.transform = "scale(1)";
}

// Przycisk trybu pełnoekranowego
export function updateFullscreenButton(isFullscreen) {
  if (!dom.fsBtn) return;

  dom.fsBtn.textContent = isFullscreen
    ? "Wyłącz pełny ekran"
    : "Pełny ekran";

  dom.fsBtn.classList.toggle(
    "active",
    isFullscreen
  );
}

// Przycisk blokady wygaszania ekranu
export function updateWakeLockButton(isActive) {
  if (!dom.wakeBtn) return;

  dom.wakeBtn.textContent = isActive
    ? "Blokada ekranu (Tak)"
    : "Blokada ekranu (Nie)";

  dom.wakeBtn.classList.toggle(
    "active",
    isActive
  );
}

 // Przycisk dźwięku
export function updateSoundButton(isActive) {
  if (!dom.soundBtn) return;

  dom.soundBtn.textContent = isActive
    ? "Dźwięki włączone"
    : "Dźwięki wyłączone";

  dom.soundBtn.classList.toggle(
    "active",
    isActive
  );
}

// Przycisk zmiany motywu
export function updateThemeButton(theme) {
  if (!dom.themeBtn) return;

  dom.themeBtn.textContent =
    theme === "dark"
      ? "Motyw jasny"
      : "Motyw ciemny";
}
