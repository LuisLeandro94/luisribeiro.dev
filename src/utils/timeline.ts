/**
 * Pure date math for the experience timeline, shared between the Astro
 * component (build-time render) and the client script (live refinement).
 * No DOM access, so it is unit-testable in isolation.
 */

export type MonthString = `${number}-${number}` | "now";

/** Converts "YYYY-MM" (or "now") into an absolute month index (year * 12 + month). */
export function monthIndex(value: MonthString, now: Date = new Date()): number {
  if (value === "now") {
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
}

export interface TimelineEntry {
  id: string;
  label: string;
  from: MonthString;
  to: MonthString;
  current: boolean;
}

export interface TimelineSegment extends TimelineEntry {
  /** Inclusive month span used for flex-grow, always >= 1. */
  months: number;
}

/** Computes each segment's proportional width (in months) for a flex-grow timeline bar. */
export function computeSegments(
  entries: TimelineEntry[],
  now: Date = new Date(),
): TimelineSegment[] {
  return entries.map((entry) => {
    const from = monthIndex(entry.from, now);
    const to = monthIndex(entry.to, now) + 1;
    return { ...entry, months: Math.max(1, to - from) };
  });
}

export interface TimelineTick {
  year: number;
  /** 0–1 position along the full timeline span. */
  position: number;
}

/** Positions year labels along the timeline relative to its real start/end. */
export function computeTicks(
  years: number[],
  entries: TimelineEntry[],
  now: Date = new Date(),
): TimelineTick[] {
  const start = Math.min(...entries.map((e) => monthIndex(e.from, now)));
  const end = Math.max(...entries.map((e) => monthIndex(e.to, now))) + 1;
  const span = end - start;
  return years.map((year) => {
    const raw = (year * 12 - start) / span;
    return { year, position: Math.max(0, Math.min(1, raw)) };
  });
}
