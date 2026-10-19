# luisribeiro.dev

Personal software engineering portfolio for Luís Ribeiro. A Swiss, grid-driven, single-page
site built with Astro and TypeScript — static output, near-zero shipped JavaScript, no UI
framework.

Design source of truth: [`design-reference/HANDOFF.md`](design-reference/HANDOFF.md) and the
approved prototype in the same folder. When in doubt about a design decision, that file wins.

## Stack

- [Astro](https://astro.build) (static output) + TypeScript
- Plain CSS with custom-property design tokens — no Tailwind, no CSS-in-JS
- Self-hosted variable [Geist](https://vercel.com/font) / Geist Mono via `@fontsource-variable`
- Small, isolated vanilla `<script>` modules for interactivity (command menu, grid overlay,
  theme, clock, copy-to-clipboard, projectile simulation) — no client-side framework
- [Vitest](https://vitest.dev) for pure-logic unit tests, [Playwright](https://playwright.dev)
  for interaction/accessibility end-to-end tests

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command                | What it does                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`          | Local dev server with hot reload                                                     |
| `npm run build`        | Type-checks (`astro check`) then builds the static site                              |
| `npm run preview`      | Serves the production build locally                                                  |
| `npm run check`        | Astro + TypeScript diagnostics only                                                  |
| `npm run lint`         | ESLint (flat config) over `.ts` and `.astro` files                                   |
| `npm run format`       | Prettier, write mode                                                                 |
| `npm run format:check` | Prettier, check mode (used in CI)                                                    |
| `npm run test:unit`    | Vitest — pure logic (currently: the experience timeline math)                        |
| `npm run test:e2e`     | Playwright — builds, serves, and drives the site in Chromium                         |
| `npm run og:generate`  | Regenerates `public/favicon*.png`, `favicon.svg`, `public/og.png` from design tokens |

## Project structure

```
src/
  content/        typed content: site.ts, projects.ts, experience.ts, stack.ts
  styles/         tokens.css (design tokens), base.css (reset, grid, type/link/button primitives)
  components/     one .astro file per component (SiteHeader, Hero, ProjectSheet, RoleRow, …)
  scripts/        self-contained client modules (one concern each), wired by scripts/main.ts
  utils/          framework-free logic (timeline.ts — unit tested)
  layouts/        Layout.astro: document shell, metadata, theme/grid flash prevention
  pages/          index.astro — the whole site is one page
public/           static passthrough: robots.txt, sitemap (generated), favicons, og.png, CV
scripts/          generate-assets.mjs — build-time favicon/OG image generation (Satori + resvg)
e2e/              Playwright specs
design-reference/ the approved HANDOFF.md and prototype — reference only, not shipped
```

Content (copy, dates, links, stack) lives entirely in `src/content/*.ts` with types, so text can
be edited without touching any component markup.

## Known limitation: the CV

**`public/cv/luis-ribeiro-cv.pdf` is not in this repository.** Every CV link/button on the site
points at `/cv/luis-ribeiro-cv.pdf` and is wired correctly, but the file itself needs to be added
before that link will resolve — this was a deliberate choice: the handoff disallows a fake or
placeholder PDF, so nothing was fabricated to fill the gap.

The current CV PDF contains a phone number. Per the handoff, confirm you're comfortable making
that number public before dropping the file in — crop/redact it first if not, then:

```bash
mkdir -p public/cv
cp /path/to/your-cv.pdf public/cv/luis-ribeiro-cv.pdf
```

No code changes needed after that; the link starts working immediately.

## Design tokens and grid

All colour, type, spacing, and grid values live in `src/styles/tokens.css`, copied verbatim from
`HANDOFF.md` §3. The grid is 4 columns / 16px gutter below 640px, 8 / 20px from 640–1023px, and
12 / 24px from 1024px up. Toggle the on-page grid overlay (press `G`, or the footer "Show the
grid" button, or the `⌘K` command menu) to check any layout change against it — the overlay uses
the exact same `.wrap`/`.g` classes as real content, so misalignment is immediately obvious.

## Testing

- `npm run check` — Astro + TypeScript types, zero `any`-shaped surprises
- `npm run lint` / `npm run format:check` — static analysis and formatting
- `npm run test:unit` — the experience-timeline month/flex-grow math (the one piece of real
  logic in the codebase; everything else is markup and CSS, which unit tests don't usefully
  cover)
- `npm run test:e2e` — command menu (keyboard nav, filtering, empty state, backdrop dismiss),
  mobile index, grid overlay (toggle, persistence, "G" ignored while typing), theme (cycle,
  persistence), experience row expansion, copy-to-clipboard, CV link correctness, external link
  safety attributes, zero horizontal overflow at five breakpoints, skip-link focus, and a
  JavaScript-disabled pass confirming content and `<details>` still work without it

CI (`.github/workflows/ci.yml`) runs all of the above on every push and pull request.

## Accessibility

Built against WCAG 2.2 AA: semantic landmarks, one `h1`, a working skip link (focus is
programmatically moved, not just scrolled), visible focus rings, `<details>`/`<summary>` for
expandable role rows (functional with JavaScript off), a native `<dialog>` for the command menu
and mobile index (focus trap and Escape handling come from the browser, not reimplemented), and
`prefers-reduced-motion` support throughout. Automated checks (Playwright) cover the interactive
surface; a manual keyboard/screen-reader pass is still worth doing before a real launch — see
"Known limitations" in the implementation handoff notes.

## Deploying a preview

Any static host works (Vercel, Netlify, Cloudflare Pages). Build command `npm run build`, output
directory `dist/`. Nothing in this repo is wired to a specific provider yet — set one up and
point it at this branch to get a shareable preview without touching `main` or production.
