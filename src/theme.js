import { state } from "./state.js";

const THEME_KEY = "theme";

// Pobieranie motywu aplikacji
export function initTheme() {
  let saved = null;

  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (err) {
    console.warn("Nie można wczytać motywu", err);
  }

  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    const prefersLight =
      window.matchMedia("(prefers-color-scheme: light)").matches;

    applyTheme(prefersLight ? "light" : "dark");
  }
}

// Zmiana motywu aplikacji
export function toggleTheme() {
  const next = state.theme === "dark" ? "light" : "dark";
  applyTheme(next);
}

// Ustawienie motywu i zapis do pamięci
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn("Nie można zapisać motywu", err);
  }
}
