import { readStorage, writeStorage } from "./storage";

export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

let current: Theme = "system";
const listeners = new Set<(theme: Theme) => void>();

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

export function getTheme(): Theme {
  return current;
}

export function onThemeChange(listener: (theme: Theme) => void): void {
  listeners.add(listener);
}

export function applyTheme(theme: Theme): void {
  current = theme;
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  writeStorage("lr-theme", theme);
  listeners.forEach((listener) => listener(theme));
}

export function cycleTheme(): Theme {
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  applyTheme(next);
  return next;
}

export function initTheme(): void {
  const stored = readStorage("lr-theme");
  current = isTheme(stored) ? stored : "system";
  // The inline head script already set data-theme before paint; this just
  // syncs in-memory state and wires the footer control.
  const button = document.querySelector<HTMLButtonElement>("[data-theme-btn]");
  if (button) {
    button.textContent = `Theme: ${current}`;
    onThemeChange((theme) => {
      button.textContent = `Theme: ${theme}`;
    });
    button.addEventListener("click", () => cycleTheme());
  }
}
