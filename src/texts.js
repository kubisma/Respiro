export const TEXTS = [
  "Spokojny oddech to spokojny umysł.",
  "Wystarczyło kilka minut, by zrobić coś dobrego.",
  "Twój układ nerwowy Ci dziękuje.",
  "Kilka spokojnych oddechów ma znaczenie.",
  "Zrobiłeś coś dobrego dla siebie.",
  "Zadbałeś o siebie.",
  "Dałeś sobie oddech.",
  "Zrobiłeś coś wspierającego.",
  "Zadanie zostało wykonane.",
  "Małe kroki tworzą wielkie zmiany.",
  "Wdech. Wydech. Spokój.",
  "Jesteś tu i teraz.",
  "Dobrze, że dbasz o siebie.",
  "Spokój zaczyna się od Ciebie.",
  "Pięknie wykonane ćwiczenie.",
  "Sesja zakończona sukcesem. Brawo.",
];

export function getRandomText() {
  return TEXTS[Math.floor(Math.random() * TEXTS.length)];
}