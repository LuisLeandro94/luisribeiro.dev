import { readStorage, writeStorage } from "./storage";

let on = false;
const listeners = new Set<(on: boolean) => void>();

export function isGridOn(): boolean {
  return on;
}

export function onGridChange(listener: (on: boolean) => void): void {
  listeners.add(listener);
}

function gridLabel(): string {
  const w = window.innerWidth;
  if (w >= 1024) return "12 col · 24 gutter";
  if (w >= 640) return "8 col · 20 gutter";
  return "4 col · 16 gutter";
}

export function setGrid(next: boolean): void {
  on = next;
  document.documentElement.classList.toggle("show-grid", on);
  writeStorage("lr-grid", on ? "1" : "0");
  const badge = document.getElementById("gridBadge");
  if (badge) badge.textContent = gridLabel();
  listeners.forEach((listener) => listener(on));
}

export function toggleGrid(): void {
  setGrid(!on);
}

export function initGridOverlay(): void {
  // The inline head script already applied the persisted class before paint;
  // this just syncs in-memory state and wires the footer control + resize.
  on = readStorage("lr-grid") === "1";
  const badge = document.getElementById("gridBadge");
  if (badge) badge.textContent = gridLabel();

  const button = document.querySelector<HTMLButtonElement>("[data-grid-btn]");
  if (button) {
    const sync = (next: boolean) => {
      button.setAttribute("aria-pressed", String(next));
      button.textContent = next ? "Hide the grid" : "Show the grid";
    };
    sync(on);
    onGridChange(sync);
    button.addEventListener("click", () => toggleGrid());
  }

  window.addEventListener("resize", () => {
    const current = document.getElementById("gridBadge");
    if (current) current.textContent = gridLabel();
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement;
    const typing =
      target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
    if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "g" || event.key === "G") toggleGrid();
  });
}
