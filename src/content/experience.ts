/** Professional experience — experience.ts. Source: design-reference/HANDOFF.md §8. */
import type { MonthString } from "../utils/timeline";

export interface Role {
  id: string;
  company: string;
  title: string;
  from: MonthString;
  to: MonthString;
  dateLabel: string;
  location: string;
  focus: string;
  current: boolean;
  summary: string;
  bullets: string[];
  /** Split into two display lines to match the approved layout (HANDOFF §8). */
  stack: { primary: string[]; secondary: string[] };
}

export const roles: Role[] = [
  {
    id: "vfx-financial",
    company: "VFX Financial",
    title: "Software Engineer / Frontend Developer",
    from: "2024-05",
    to: "now",
    dateLabel: "May 2024 – Now",
    location: "Remote",
    focus: "Broker platform for payments and FX · Remote",
    current: true,
    summary:
      "Core frontend engineer on a centralised broker platform for payments, deposits, FX trading, swaps and routing rules, building complex financial workflows in Blazor.",
    bullets: [
      "Work with backend engineers across the Payments, Deposits and Trading teams, alongside QA and UI/UX designers, to ship integrated features.",
      "Implement security-related functionality in a regulated environment: permissions, role-based access control and input validation.",
      "Find dependencies, edge cases and implementation risks during refinement, and propose solutions before development starts.",
      "Ship across development, pre-production and production, with xUnit tests and GitHub Actions in the pipeline.",
      "Adopted Claude Code in feature work, and refine the prompts and reusable skills that improve delivery, reinforce security practice and reduce AI-generated errors.",
    ],
    stack: { primary: ["Blazor", "C#", "xUnit"], secondary: ["GitHub Actions", "Claude Code"] },
  },
  {
    id: "prozis",
    company: "Prozis",
    title: "Frontend Developer",
    from: "2023-04",
    to: "2024-05",
    dateLabel: "Apr 2023 – May 2024",
    location: "Maia",
    focus: "Email marketing tooling · Maia",
    current: false,
    summary:
      "Led frontend development in a small email marketing team, maintaining and extending the internal campaign management app.",
    bullets: [
      "Maintained and extended a Vue 2 campaign management application.",
      "Initiated the migration from Vue 2 to Vue 3 to modernise the codebase.",
      "Built reusable HTML email components that render consistently across email clients.",
    ],
    stack: { primary: ["Vue 2", "Vue 3"], secondary: ["HTML email"] },
  },
  {
    id: "codepoint",
    company: "Codepoint",
    title: "Junior Software Developer",
    from: "2021-09",
    to: "2023-03",
    dateLabel: "Sept 2021 – Mar 2023",
    location: "Braga",
    focus: "React and full-stack .NET · Braga",
    current: false,
    summary:
      "Where I started: client web apps in React, then full-stack work across the Microsoft stack.",
    bullets: [
      "Built and maintained responsive React interfaces with designers, from UI/UX specs to production.",
      "Developed and integrated APIs in full-stack applications with C#, Blazor, Azure Functions and MySQL.",
      "Delivered in an Agile team, with a focus on maintainable, production-ready code.",
    ],
    stack: { primary: ["React", "C#", "Blazor"], secondary: ["Azure Functions", "MySQL"] },
  },
];

export const timelineTickYears = [2022, 2023, 2024, 2025, 2026];
