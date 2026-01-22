import { exercises } from "./data.js";
import {
  renderExerciseList,
  renderDetails,
  showView,
  updateSessionUI,
  updateFullscreenButton,
  updateWakeLockButton,
  updateSoundButton,
  updateThemeButton
} from "./ui.js";

import { startSession, stopSession } from "./session.js";
import { playPhaseSound, toggleSound } from "./sound.js";
import {
  toggleFullscreen,
  exitFullscreenIfActive,
  toggleWakeLock
} from "./features.js";

import { dom } from "./dom.js";
import { state } from "./state.js";
import { initTheme, toggleTheme } from "./theme.js";
import { enableOfflineBanner } from "./offline.js";

const SESSION_PRESETS = {
  short: 3,
  medium: 5,
  long: 10
};

document.addEventListener("DOMContentLoaded", init);

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

function registerSystemEventHandlers() {
  document.addEventListener("fullscreenchange", () => {
    updateFullscreenButton(!!document.fullscreenElement);
  });
}

function registerUIEventHandlers() {
  
  dom.backBtn?.addEventListener("click", () => goHome("home"));
  dom.sessionBackBtn?.addEventListener("click", () => goHome("details"));
  dom.stopBtn?.addEventListener("click", () => goHome("home"));

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
  dom.aboutBackBtn?.addEventListener("click", () => goHome("home"));

  dom.themeBtn?.addEventListener("click", () => {
    toggleTheme();
    updateThemeButton(state.theme);
  });

  document.querySelectorAll("[data-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sessionPreset = btn.dataset.preset;

      document
        .querySelectorAll("[data-preset]")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
    });
  });
}

function goHome(view = "home") {
  stopSession();
  exitFullscreenIfActive();
  showView(view);
}

function goAbout() {
  stopSession();
  exitFullscreenIfActive();
  showView("about");
}

function selectExercise(exercise) {
  state.currentExercise = exercise;
  renderDetails(exercise);
  showView("details");
}

function startSessionHandler() {
  if (!state.currentExercise) return;

  showView("session");
  dom.sessionTitle.textContent =
    state.currentExercise.title;

  const targetMinutes =
    SESSION_PRESETS[state.sessionPreset] ?? 5;

  startSession(
    state.currentExercise,
    onSessionUpdate,
    targetMinutes
  );
}

function onSessionUpdate(data) {
  updateSessionUI(data);

  if (data.phaseChanged) {
    playPhaseSound(data.phase);
  }
}
