import { exercises } from "./data.js";
import {
  renderExerciseList,
  renderDetails,
  showView,
  updateSessionUI,
  updateFullscreenButton,
  updateWakeLockButton,
  updateSoundButton,
  updateThemeButton,  
} from "./ui.js";

import { startSession, stopSession } from "./session.js";
import { playPhaseSound, toggleSound } from "./sound.js";
import { toggleFullscreen, exitFullscreenIfActive, toggleWakeLock } from "./features.js";

import { dom } from "./dom.js";
import { state } from "./state.js";
import { initTheme, toggleTheme } from "./theme.js";
import { enableOfflineBanner } from "./offline.js";

document.addEventListener("DOMContentLoaded", init);

// Inicjalizacja aplikacji
function init() {
  initTheme();
  updateThemeButton(state.theme);

  renderExerciseList(exercises, selectExercise);
  registerUIEventHandlers();
  registerSystemEventHandlers();

  updateSoundButton(false);
  updateWakeLockButton(false);
  updateFullscreenButton(false);

  enableOfflineBanner();
}

// Obsługa pełnego ekranu
function registerSystemEventHandlers() {
  document.addEventListener("fullscreenchange", () => {
    updateFullscreenButton(!!document.fullscreenElement);
  });
}

// Obsługa zdarzeń interfejsu
function registerUIEventHandlers() {
  dom.backBtn?.addEventListener("click", goHome);
  dom.stopBtn?.addEventListener("click", goHome);

  dom.startBtn?.addEventListener("click", startSessionHandler);

  dom.soundBtn?.addEventListener("click", () => {
    const active = toggleSound();
    updateSoundButton(active);
  });

  dom.wakeBtn?.addEventListener("click", async () => {
    const active = await toggleWakeLock();
    updateWakeLockButton(active);
  });

  dom.fsBtn?.addEventListener("click", () => toggleFullscreen());

  dom.aboutBtn?.addEventListener("click", goAbout);
  dom.aboutBackBtn?.addEventListener("click", goHome);

  dom.themeBtn?.addEventListener("click", () => {
    toggleTheme();
    updateThemeButton(state.theme);
  });
}

function goHome() {
  stopSession();
  exitFullscreenIfActive();
  showView("home");
}

function goAbout() {
  stopSession();
  exitFullscreenIfActive();
  showView("about");
}

// Wybór ćwiczenia z listy
function selectExercise(exercise) {
  state.currentExercise = exercise;
  renderDetails(exercise);
  showView("details");
}

// Obsługa rozpoczęcia sesji
function startSessionHandler() {
  if (!state.currentExercise) return;

  showView("session");
  dom.sessionTitle.textContent = state.currentExercise.title;

  startSession(state.currentExercise, onSessionUpdate);
}

// Obsługa aktualizacji sesji
function onSessionUpdate(data) {
  updateSessionUI(data);

  if (data.phaseChanged) {
    playPhaseSound(data.phase);
  }
}
