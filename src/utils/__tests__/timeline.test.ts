import { describe, expect, it } from "vitest";
import { computeSegments, computeTicks, monthIndex } from "../timeline";
import type { TimelineEntry } from "../timeline";

describe("monthIndex", () => {
  it("converts a YYYY-MM string to an absolute month index", () => {
    expect(monthIndex("2021-09")).toBe(2021 * 12 + 8);
    expect(monthIndex("2024-05")).toBe(2024 * 12 + 4);
  });

  it("resolves 'now' against the provided reference date", () => {
    const now = new Date(2026, 9, 19); // October 2026 (month is 0-indexed)
    expect(monthIndex("now", now)).toBe(2026 * 12 + 9);
  });
});

const roles: TimelineEntry[] = [
  { id: "vfx", label: "VFX Financial", from: "2024-05", to: "now", current: true },
  { id: "prozis", label: "Prozis", from: "2023-04", to: "2024-05", current: false },
  { id: "codepoint", label: "Codepoint", from: "2021-09", to: "2023-03", current: false },
];

describe("computeSegments", () => {
  it("gives each role a positive month span matching its real tenure", () => {
    const now = new Date(2026, 9, 19);
    const segments = computeSegments(roles, now);

    const codepoint = segments.find((s) => s.id === "codepoint")!;
    const prozis = segments.find((s) => s.id === "prozis")!;
    const vfx = segments.find((s) => s.id === "vfx")!;

    // Sept 2021 -> Mar 2023 inclusive = 19 months
    expect(codepoint.months).toBe(19);
    // Apr 2023 -> May 2024 inclusive = 14 months
    expect(prozis.months).toBe(14);
    // May 2024 -> Oct 2026 inclusive = 30 months
    expect(vfx.months).toBe(30);
  });

  it("never returns a span below 1 month, even for a same-month entry", () => {
    const [segment] = computeSegments([
      { id: "x", label: "X", from: "2026-01", to: "2026-01", current: false },
    ]);
    expect(segment.months).toBeGreaterThanOrEqual(1);
  });
});

describe("computeTicks", () => {
  it("positions year ticks proportionally within the real start/end span", () => {
    const now = new Date(2026, 9, 19);
    const ticks = computeTicks([2022, 2024, 2026], roles, now);

    // The timeline starts Sept 2021 and runs through "now" (Oct 2026).
    for (const tick of ticks) {
      expect(tick.position).toBeGreaterThanOrEqual(0);
      expect(tick.position).toBeLessThanOrEqual(1);
    }
    // Ticks must be in ascending order left-to-right for ascending years.
    expect(ticks[0].position).toBeLessThan(ticks[1].position);
    expect(ticks[1].position).toBeLessThan(ticks[2].position);
  });

  it("clamps a year before the timeline start to position 0", () => {
    const [tick] = computeTicks([2000], roles, new Date(2026, 9, 19));
    expect(tick.position).toBe(0);
  });
});
