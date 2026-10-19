import {
  computeSegments,
  computeTicks,
  type MonthString,
  type TimelineEntry,
} from "../utils/timeline";

/**
 * The server/build render already shows a real, proportional timeline (as of
 * build time). This refines it client-side using the viewer's actual "now",
 * so a long-unrebuilt deploy doesn't quietly drift stale.
 */
export function initExperienceTrack(): void {
  const segEls = document.querySelectorAll<HTMLElement>("#track .seg");
  const tickEls = document.querySelectorAll<HTMLElement>("#ticks span");
  if (!segEls.length) return;

  const entries: TimelineEntry[] = Array.from(segEls).map((el) => ({
    id: el.dataset.from ?? "",
    label: el.textContent ?? "",
    from: el.dataset.from as MonthString,
    to: el.dataset.to as MonthString,
    current: el.classList.contains("now"),
  }));

  const now = new Date();
  const segments = computeSegments(entries, now);
  segEls.forEach((el, i) => {
    el.style.flex = `${segments[i].months} 0 0`;
  });

  const years = Array.from(tickEls).map((el) => Number(el.textContent));
  const ticks = computeTicks(years, entries, now);
  tickEls.forEach((el, i) => {
    el.style.left = `${ticks[i].position * 100}%`;
  });
}
