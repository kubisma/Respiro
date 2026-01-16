import { dom } from "./dom.js";

// Przełączanie ekranów aplikacji
export function showView(name) {
  document.querySelectorAll(".view")
    .forEach(v => v.classList.remove("active"));

  document
    .getElementById(`view-${name}`)
    ?.classList.add("active");
}

// Lista ćwiczeń
export function renderExerciseList(exercises, onSelect) {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${ex.title}</h3>
      <p>${ex.desc}</p>
    `;
    card.addEventListener("click", () => onSelect(ex));
    list.appendChild(card);
  });
}

// Szczegóły ćwiczenia
export function renderDetails(exercise) {
  if (!dom.detailsTitle) return;

  dom.detailsTitle.textContent = exercise.title;
  dom.detailsDesc.textContent = exercise.desc;

  dom.detailsParams.innerHTML = exercise.phases
    .map(p => `<p>${p.label}: ${p.duration}s</p>`)
    .join("");
}

// Aktualizacja interfejsu podczas trwania sesji
export function updateSessionUI({ phase, remaining, scale }) {
  if (!dom.circle) return;

  dom.phase.textContent = phase;
  dom.timer.textContent = `${remaining}s`;
  dom.circle.style.transform = `scale(${scale})`;
}

// Przycisk pełnego ekranu
export function updateFullscreenButton(isFullscreen) {
  if (!dom.fsBtn) return;

  dom.fsBtn.textContent = isFullscreen
    ? "Wyłącz pełny ekran"
    : "Pełny ekran";

  dom.fsBtn.classList.toggle("active", isFullscreen);
}

// Przycisk blokady ekranu
export function updateWakeLockButton(isActive) {
  if (!dom.wakeBtn) return;

  dom.wakeBtn.textContent = isActive
    ? "Blokada ekranu (Tak)"
    : "Blokada ekranu (Nie)";

  dom.wakeBtn.classList.toggle("active", isActive);
}

// Przycisk dźwięków
export function updateSoundButton(isActive) {
  if (!dom.soundBtn) return;

  dom.soundBtn.textContent = isActive
    ? "Dźwięki włączone"
    : "Dźwięki wyłączone";

  dom.soundBtn.classList.toggle("active", isActive);
}

// Przycisk zmiany motywu
export function updateThemeButton(theme) {
  if (!dom.themeBtn) return;

  dom.themeBtn.textContent =
    theme === "dark" ? "Motyw jasny" : "Motyw ciemny";
}

