/** Technical stack, split by context — stack.ts. Source: design-reference/HANDOFF.md §8. */

export interface TechItem {
  name: string;
  context?: string;
}

export interface StackColumn {
  key: "A" | "B" | "C";
  title: string;
  subtitle: string;
  items: TechItem[];
}

export const stackColumns: StackColumn[] = [
  {
    key: "A",
    title: "In production",
    subtitle: "Used at work, with a team, shipped to users.",
    items: [
      { name: "Blazor, C#, .NET", context: "VFX, Codepoint" },
      { name: "Vue 2, Vue 3", context: "Prozis" },
      { name: "React", context: "Codepoint" },
      { name: "xUnit", context: "VFX" },
      { name: "GitHub Actions", context: "VFX" },
      { name: "Azure Functions, MySQL", context: "Codepoint" },
      { name: "HTML email", context: "Prozis" },
    ],
  },
  {
    key: "B",
    title: "In my own projects",
    subtitle: "Chosen by me, built end to end.",
    items: [
      { name: "Next.js, React", context: "Wedding app" },
      { name: "TypeScript", context: "Personal work" },
      { name: "MongoDB", context: "Wedding app" },
      { name: "NextAuth, Resend", context: "Wedding app" },
      { name: "Ant Design, Google Maps API", context: "Petaway" },
    ],
  },
  {
    key: "C",
    title: "Practice",
    subtitle: "The parts of the job that aren't a framework.",
    items: [
      { name: "Role-based access and permissions" },
      { name: "Input validation" },
      { name: "Refinement and risk spotting" },
      { name: "Multi-environment delivery" },
      { name: "AI-assisted development with Claude Code" },
    ],
  },
];
