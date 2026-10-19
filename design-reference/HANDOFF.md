# luisribeiro.dev redesign: implementation handoff

Direction: **Specification** (chosen 19 Oct 2026). A Swiss, grid-driven, single-page portfolio that reads like a well-made technical document, with a keyboard command menu and a toggleable grid overlay as its signature details.

This file is written for Claude Code (or any engineer) building the production site. The visual source of truth is the working prototype:

- Live prototype: https://claude.ai/artifact/CkAEFSVwRUKMTDBTa3RbRg
- Prototype source: [prototype.html](/mnt/project-files/portfolio-redesign/prototype.html) (self-contained HTML, CSS and JS)
- Audit and the three directions: https://claude.ai/artifact/4GHkrn5NdeWLZqDDqMWhAt

When this document and the prototype disagree, this document wins.

---

## 1. Ground rules

1. **Never invent content.** Every project, metric, date, title and claim comes from Luís. Anything marked † in the prototype is pending confirmation (see §12). Ship with † items removed or confirmed, never with the marker.
2. **Start a new project.** Don't build on `LuisLeandro94/luisribeiro.dev` (an unfinished Create React App build) or the live Astro site (source not public). Copy nothing from them except the email address and links.
3. **Content is readable without JavaScript and without motion.** JS adds the command menu, grid overlay, clock, copy button and reveals. Nothing visible may depend on it.
4. **No skill bars, logo walls, typewriters, custom cursors, gradient blobs or glow.** These were specifically ruled out.

## 2. Stack

Recommended: **Astro 5 + TypeScript, plain CSS (custom properties), no UI framework.** Static output, zero JS by default, small vanilla `<script>` islands for interactivity. Deploy on Vercel or Netlify.

Why: the site is content-first and static. Astro ships near-zero JS, which keeps Lighthouse at 100 and is the honest choice a senior reviewer will respect. Luís already used Astro for the live site.

Alternative if Luís wants the codebase itself to show React/Next.js skills: Next.js App Router with static export, React Server Components for all sections, and two client components (`CommandMenu`, `GridOverlay`). Keep the same CSS; don't add Tailwind just to add it.

Fonts: self-host **Geist** and **Geist Mono** (variable, `woff2`, OFL) via `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` or the `geist` package. Preload the Geist Variable file. `font-display: swap`. Fallback stack: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` / `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

Suggested structure:

```
src/
  content/            # typed content (projects.ts, experience.ts, stack.ts, site.ts)
  styles/tokens.css   # §3
  styles/base.css     # reset, type primitives, grid, link pattern
  components/         # one .astro file per component in §7
  scripts/            # command-menu.ts, grid-overlay.ts, clock.ts, reveal.ts, sim.ts, copy.ts
  pages/index.astro
  pages/work/wedding-app.astro   # case study, only once content exists
public/
  cv/luis-ribeiro-cv.pdf   # copy from /mnt/project-files/portfolio-redesign/luis-ribeiro-cv.pdf
  og.png              # 1200x630, see §10
```

Keep all copy in `src/content/*.ts` with types, so Luís can edit text without touching layout.

## 3. Design tokens

Copy verbatim into `tokens.css`. Light is the default; dark follows `prefers-color-scheme`, and an explicit `data-theme` on `<html>` overrides both ways.

```css
:root{
  /* colour */
  --paper:#f1f2ee;   /* page */
  --paper-2:#e8eae5; /* placeholders, timeline track, hover fills */
  --ink:#0e0f10;     /* primary text, strong rules */
  --ink-2:#3a3d40;   /* secondary text (9.7:1 on paper) */
  --graphite:#646869;/* metadata, labels (5.0:1 on paper) */
  --rule:#d3d5d0;    /* hairlines */
  --signal:#2233d6;  /* the only accent: emphasis, active state, grid (7.4:1) */
  --on-signal:#f1f2ee;
  --grid-fill:rgba(34,51,214,.06); --grid-line:rgba(34,51,214,.22);

  /* type */
  --f-sans:"Geist",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  --f-mono:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --t-display:clamp(3.5rem,1.6rem + 8.4vw,10rem);
  --t-h2:clamp(2.25rem,1.4rem + 3.2vw,4.5rem);
  --t-lead:clamp(1.25rem,1rem + 1.1vw,2rem);
  --t-h3:clamp(1.25rem,1.1rem + .5vw,1.625rem);
  --t-body:1.0625rem; --t-small:.9375rem; --t-label:.75rem;

  /* space (4px base) */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px; --s-6:32px;
  --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px;
  --section:clamp(96px,12vw,176px);

  /* grid */
  --cols:4; --gutter:16px; --margin:16px; --max:1440px;

  /* motion */
  --ease:cubic-bezier(.2,.7,.1,1);
  --d-micro:120ms; --d-reveal:320ms; --d-rule:600ms;
}
@media (min-width:640px){:root{--cols:8;--gutter:20px;--margin:clamp(24px,4vw,40px)}}
@media (min-width:1024px){:root{--cols:12;--gutter:24px;--margin:clamp(32px,4vw,56px)}}

/* dark: same token names, redefined */
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){ /* values below */ }}
:root[data-theme="dark"]{
  --paper:#0d0e0f; --paper-2:#17191b; --ink:#ecede9; --ink-2:#bfc2be;
  --graphite:#8d9194; --rule:#2a2d30; --signal:#8c98ff; --on-signal:#0d0e0f;
  --grid-fill:rgba(140,152,255,.06); --grid-line:rgba(140,152,255,.22);
  color-scheme:dark;
}
```

### Colour rules

- One accent. `--signal` is used for: the emphasised phrase in the hero lead, section numbers, active nav state, hover colour on links and rows, the "now" timeline segment, the grid overlay, text selection and focus rings. Nowhere else, never as a large fill.
- `--ink` hairlines (1px) mark structure: header bottom, section starts, contact list top, footer. `--rule` hairlines separate rows inside a block.
- No shadows except the command menu. No border radius except 2px on buttons and the phone frame placeholder.

## 4. Typography

| Role | Token | Font | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| Display | `--t-display` (56–160px) | Geist | 600 | .86 | −0.05em | Name in hero only |
| Section title | `--t-h2` (36–72px) | Geist | 600 | .95 | −0.035em | One per section |
| Lead | `--t-lead` (20–32px) | Geist | 400 | 1.25 | −0.015em | Hero thesis, About opener |
| Title | `--t-h3` (20–26px) | Geist | 600 | 1.2 | −0.012em | Card and column titles |
| Company | clamp(24–36px) | Geist | 600 | 1.05 | −0.03em | Experience rows |
| Body | 17px | Geist | 400 | 1.55 | 0 | Running text, max 62ch |
| Small | 15px | Geist | 400 | 1.5 | 0 | Descriptions, intros |
| Label | 12px | Geist Mono | 500 | 1.4 | +0.06em, uppercase | Eyebrows, spec keys, nav |
| Data | 13px | Geist Mono | 400 | 1.5 | 0, tabular-nums | Dates, stack lists, metadata |

Rules: headings use `text-wrap: balance`. Mono is for facts (dates, stacks, counts, keys), sans is for sentences. Never set paragraphs in mono. Keep the accent in "Luís" everywhere (title, meta, OG image, JSON-LD).

## 5. Grid, breakpoints and spacing

| Breakpoint | Columns | Gutter | Outer margin |
|---|---|---|---|
| < 640px (mobile) | 4 | 16px | 16px |
| 640–1023px (tablet) | 8 | 20px | 24–40px |
| ≥ 1024px (desktop) | 12 | 24px | 32–56px, max width 1440px |

- `.wrap` sets max width and side padding as `max(var(--margin), env(safe-area-inset-left/right))`.
- `.g` is `display:grid; grid-template-columns:repeat(var(--cols),minmax(0,1fr)); column-gap:var(--gutter)`. Children default to `grid-column:1/-1`; components set their spans per breakpoint (spans listed in §7).
- Vertical rhythm: sections are separated by `--section` (96–176px). Inside a section: head → body `clamp(40px,6vw,80px)`; between sibling blocks `--s-7`; inside blocks `--s-4`/`--s-5`.
- The grid overlay (§7.15) must line up exactly with real content at every breakpoint. That alignment is the point of the direction, so test it.

## 6. Motion

| Moment | What | Duration / easing | Reduced motion |
|---|---|---|---|
| Section rules | 1px rule scales X 0→1 from the left when first scrolled into view | 600ms `--ease` | Drawn at rest |
| Section titles, project media | Fade up 8px | 320ms `--ease` | Static |
| Link hover | Underline grows left→right; arrow nudges 2px toward its direction | 320ms / 120ms | Instant |
| Experience row | `+` rotates into `−`; company name turns `--signal` on hover | 320ms | Instant |
| Project image hover | Grayscale → colour, scale 1.015 | 320ms / 800ms | Colour change only |
| Contact rows | Indent 8px and turn `--signal` on hover | 320ms | Colour only |
| Grid overlay | Fade | 250ms | Instant |
| Command menu | Native `<dialog>` open, no animation beyond backdrop | n/a | n/a |
| Projectile preview | Canvas loop, runs only while visible | real time | One static trajectory |

Rules: reveals apply **only to elements below the first screen at load** (anything visible at load stays visible; thumbnails and no-JS must see full content). No scroll hijacking, no smooth-scroll libraries, no parallax. `html{scroll-behavior:smooth}` is disabled under reduced motion.

## 7. Components

Each spec lists: purpose, anatomy, layout per breakpoint, states, accessibility.

### 7.1 SiteHeader
- Sticky (`top: env(safe-area-inset-top)`), translucent paper with 10px backdrop blur, 56px tall, `--ink` bottom rule inside `.wrap`.
- Anatomy: Brand (name 15px/600 + "SOFTWARE ENGINEER" label) · Nav (desktop only: `01 WORK` … `05 CONTACT`, label style, numbers in `--rule`, active in `--signal`) · Actions (`CV ↓` button, `MENU ⌘K` button on desktop, `INDEX` button below 1024px).
- Spans: brand 1–3 / nav 4–9 / actions 10–12 on desktop; brand left, actions right otherwise.
- Active section from IntersectionObserver with `rootMargin:'-45% 0px -50% 0px'`; set `aria-current="true"` on the link.
- Show `⌘K` on macOS and `Ctrl K` elsewhere (detect with `navigator.platform`/`userAgentData`).

### 7.2 CommandMenu (⌘K / Ctrl K)
- Native `<dialog>` opened with `showModal()` (gives focus trap and Esc for free). 560px wide, 1px `--ink` border, one shadow.
- Combobox pattern: `<input>` with `aria-controls`, `aria-activedescendant`; `<ul role="listbox">` with `role="option"` items grouped under "Go to", "Actions", "View" headings (`role="presentation"`).
- Items: Selected work, Experience, Stack, About, Contact · Copy email address, Download CV, Open LinkedIn, Open GitHub · Toggle grid overlay, Switch theme.
- Keys: ↑/↓ move (wraps), Enter runs, Esc closes, ⌘K/Ctrl K toggles from anywhere. Filtering is a case-insensitive substring match on label and group. Empty state: "Nothing matches “x”. Try “work” or “email”."
- Click on backdrop closes. Return focus to the trigger on close (dialog does this).

### 7.3 MobileIndex
- Full-screen `<dialog>` below 1024px, opened by `INDEX`. Header row (brand + `CLOSE`), then five 32px/600 links with mono numbers right-aligned, each ≥ 56px tall, then CV / LinkedIn / GitHub links. Selecting a link closes the dialog and scrolls.

### 7.4 Hero
- Kicker row (data style): "Frontend engineering · Portugal · HH:MM local time" (live clock, `Europe/Lisbon`, updates every 30s; render "—" server-side).
- `h1` name on two lines (`Luís` / `Ribeiro`), desktop span 1–8.
- Role line (small, first sentence 600): desktop span 9–12, bottom-aligned to the name's baseline area.
- Lead (thesis) span 1–8 desktop / 1–7 tablet, with the product phrase in `--signal`.
- CTAs: three text links with arrows (Selected work ↓, Get in touch ↗, Download CV (PDF) ↓). No filled buttons in the hero.
- MetaRow: `<dl>` of four facts under an `--ink` rule, 4 columns ≥ 640px, 2×2 on mobile.
- Height comes from content; never `100vh`.

### 7.5 SectionHead
- `--ink` rule, then label `NN  TITLE` (number in `--signal`), then `h2` (span 1–8) and an intro paragraph (span 9–12, bottom-aligned, max 44ch). Stacks on tablet and mobile.
- Numbers are real section order, matching the nav.

### 7.6 ProjectSheet (featured project)
- Desktop: media span 1–7 (16:10), info span 8–12. Tablet/mobile: stacked, media first.
- Info: label ("Featured · Personal project"), title (28–44px/600), 2–3 sentence description, a `<dl class="spec">` (Role, Year, Stack, Status: mono keys, `--rule` row lines), then text links (Case study →, Live site ↗).
- Media: real screenshot(s) only. Until they exist, render the placeholder (12×8 hairline grid with outlined desktop and phone frames and a mono note). Never fake a UI.
- Recommended media treatment once screenshots arrive: desktop screenshot in a borderless frame with the mobile screenshot overlapping bottom-right at ~22% width, both with 1px `--rule` borders, no device chrome.

### 7.7 ProjectCard (secondary projects)
- Two per row on tablet (span 1–4 / 5–8) and desktop (1–6 / 7–12); stacked on mobile.
- Anatomy: top line (label left, year right in data), media (16:10), title (22–30px), description (small, max 52ch), links.
- Images are grayscale at rest and turn to colour on hover/focus-within, so third-party colours never fight the palette.
- Projectile Movement uses a live canvas re-creation (see `sim` in prototype): 12-column hairlines, ink baseline, ink ball, dashed `--signal` trail; g = 9.81 m/s² at 24 px/m, −10% vₓ on wall hits. Pause when off-screen; static frame under reduced motion; `aria-hidden` on the canvas and a figure label.

### 7.8 ExperienceTrack
- A real-scale timeline: one flex row, each segment's `flex-grow` equals its months (Codepoint Sep 2021–Mar 2023, Prozis Apr 2023–May 2024, VFX May 2024–now, computed at build/run time). 2px top border (`--ink`, current role `--signal`), mono uppercase company label inside. Year ticks positioned by month offset underneath. Decorative (`aria-hidden`), the list below carries the same facts.

### 7.9 RoleRow
- `<details>`/`<summary>` (accessible, works without JS). First (current) role open by default.
- Summary, desktop: dates 1–2 · company 3–5 · title 6–8 · focus 9–11 · toggle 12. Tablet: dates 1–2, company/title 3–6, toggle 8. Mobile: dates + toggle on row 1, company row 2, title row 3, focus hidden.
- Detail: one-sentence summary paragraph (body, max 60ch), then a list with "—" markers (small, `--ink-2`), and a Stack block (label + data) in span 9–11 (desktop).
- Toggle is a 24px plus drawn with two 1px lines; the vertical one rotates to 0 when open.

### 7.10 StackColumns
- Three columns (A In production · B In my own projects · C Practice): 4/4/4 on desktop, 4/4 then full-width C on tablet, stacked on mobile.
- Each item is a row: technology (500) left, where it was used (data, right). This replaces badges and makes "professional vs personal" explicit.

### 7.11 About
- Portrait (4:5, optional) span 1–3, text span 5–11 desktop; 1–3 / 4–8 tablet; stacked mobile.
- First paragraph in lead size, then two body paragraphs in `--ink-2`, max 40em.

### 7.12 Contact
- SectionHead with "Write to me." Then the email address as display text (26–88px/600, `user-select:all`, `overflow-wrap:anywhere`) plus a solid `COPY ADDRESS` button.
- Copy uses `navigator.clipboard.writeText` inside the click handler; on failure, select the address text and show "Address selected, press Ctrl C to copy". Success toast: "Email address copied".
- Link list (span 1–8): LinkedIn, GitHub, CV, each a full-width row (name 20–32px/600 left, handle in data right), `--ink` top rule, `--rule` separators. Note column (span 9–12) with location and live time.
- Also keep a real `mailto:` on the address.

### 7.13 Buttons and links
- **Text link** (`.lnk`): 500 weight, no underline at rest, 1px underline grows on hover, arrow glyph in mono (`↗` external, `→` internal page, `↓` download or in-page down).
- **Button** (`.btn`): 40px tall (32px in header), 1px `--ink` border, 2px radius, label style. Hover inverts. `.solid` variant is ink-filled and turns `--signal` on hover. Minimum touch target 40×40 (44 on mobile where possible).
- External links: `target="_blank" rel="noopener"`.

### 7.14 Footer / Colophon
- `--ink` rule, three columns: © + role · Colophon ("Set in Geist and Geist Mono. 12 / 8 / 4 column grid." plus Show the grid and Theme: system/light/dark text buttons) · Back to top.
- Add the handwritten signature from the current site here as a small SVG sign-off (≤ 120px wide, `currentColor`) if Luís has the vector.

### 7.15 GridOverlay
- Fixed, full viewport, `pointer-events:none`, uses the same `.wrap` + `.g` as content so columns align exactly. Columns are `--grid-fill` with `--grid-line` edges; a small badge bottom-right shows "12 col · 24 gutter" (or 8/20, 4/16).
- Toggles with `G` (ignored while typing or with modifier keys), the footer button and the command menu. Persist in `localStorage` inside try/catch.

### 7.16 Toast
- Fixed bottom-centre, ink background, mono 12px, `role="status" aria-live="polite"`, 1.8s.

## 8. Content (final copy)

Copy comes from Luís's brief, his CV ([luis-ribeiro-cv.pdf](/mnt/project-files/portfolio-redesign/luis-ribeiro-cv.pdf)) and his answers on 19 Oct 2026. † = still pending (§12).

**Meta**
- `<title>`: `Luís Ribeiro · Software Engineer, Frontend`
- Description: `Luís Ribeiro is a software engineer in Portugal specialising in frontend. He builds interfaces for financial operations at VFX Financial.`

**Hero**
- Kicker: `Frontend engineering · Portugal · {time} local time`
- Name: `Luís Ribeiro`
- Role: `Software engineer, specialising in frontend. Currently at VFX Financial.`
- Lead: `I build the interfaces brokers use to run payments, FX trades and swaps, and the permissions and validation that keep them correct.`
- Meta: Experience `Since Sept 2021 / Production frontend` · At work `Blazor · C# / Before: Vue, React` · Own projects `Next.js · TypeScript / React, MongoDB` · Availability `Open to talk / Roles and freelance`

**01 Selected work**: "Things I built on my own time." Intro: "My professional work lives in private codebases, so it's described under Experience. These are personal and study projects, chosen over completeness."
- *Wedding Management App* (featured): "The app that ran my own wedding: invitations, RSVPs, guest seating, administration and photo uploads. A full-stack Next.js and React build, with MongoDB for data, NextAuth for sign-in and Resend for transactional email." Spec: Role `Full-stack development` · Scope `Invitations, RSVPs, seating, admin, photo uploads` · Stack `Next.js, React, MongoDB, NextAuth, Resend` · Sign-in `Google, through NextAuth` · Used `For my own wedding`. Media: [wed-home.webp](/mnt/project-files/portfolio-redesign/wed-home.webp) as the main frame (68% width, top-left) with [wed-tables.webp](/mnt/project-files/portfolio-redesign/wed-tables.webp) overlapping bottom-right (44%). Also available: wed-login.webp, wed-info.webp (the info screen shows real venue addresses; use only in the case study, and only if Luís agrees). The UI is in Portuguese; keep screenshots as they are. Case study page†.
- *Petaway* (2022, Team project · Frontend): "A web app for finding pet-sitters and dog walkers nearby. React, styled-components, Ant Design and the Google Maps API on the frontend. I built the frontend; a teammate built the Node, Express and PostgreSQL API behind it." Links: github.com/LuisLeandro94/petaway_frontend, github.com/LuisLeandro94/petaway-backend. Image: [petaway.webp](/mnt/project-files/portfolio-redesign/petaway.webp).
- *Projectile Movement* (2023): "A small physics simulation in React: a ball thrown with a random direction and speed, pulled down by real gravity, losing 10% of its horizontal speed on every wall it hits." Links: projectile-movement.vercel.app, github.com/LuisLeandro94/projectile-movement.
- Footer link: "Everything else is on GitHub ↗". Simpleflix Slider, Supermarket Management CLI and "Old Portfolio" are intentionally dropped.

**02 Experience**: "Five years, three teams, one direction." Intro: "From full-stack beginnings in React and C#, to frontend at Prozis, to a core frontend role on a financial platform."
- *VFX Financial*, Software Engineer / Frontend Developer, May 2024 – Now, Remote. Focus: Broker platform for payments and FX. **Do not name the platform (GSD) publicly.** "Core frontend engineer on a centralised broker platform for payments, deposits, FX trading, swaps and routing rules, building complex financial workflows in Blazor."
  - Work with backend engineers across the Payments, Deposits and Trading teams, alongside QA and UI/UX designers, to ship integrated features.
  - Implement security-related functionality in a regulated environment: permissions, role-based access control and input validation.
  - Find dependencies, edge cases and implementation risks during refinement, and propose solutions before development starts.
  - Ship across development, pre-production and production, with xUnit tests and GitHub Actions in the pipeline.
  - Adopted Claude Code in feature work, and refine the prompts and reusable skills that improve delivery, reinforce security practice and reduce AI-generated errors.
  - Stack: Blazor · C# · xUnit · GitHub Actions · Claude Code
- *Prozis*, Frontend Developer, Apr 2023 – May 2024, Maia. Focus: Email marketing tooling. "Led frontend development in a small email marketing team, maintaining and extending the internal campaign management app."
  - Maintained and extended a Vue 2 campaign management application. · Initiated the migration from Vue 2 to Vue 3 to modernise the codebase. · Built reusable HTML email components that render consistently across email clients.
  - Stack: Vue 2 · Vue 3 · HTML email
- *Codepoint*, Junior Software Developer, Sept 2021 – Mar 2023, Braga. Focus: React and full-stack .NET. "Where I started: client web apps in React, then full-stack work across the Microsoft stack."
  - Built and maintained responsive React interfaces with designers, from UI/UX specs to production. · Developed and integrated APIs in full-stack applications with C#, Blazor, Azure Functions and MySQL. · Delivered in an Agile team, with a focus on maintainable, production-ready code.
  - Stack: React · C# · Blazor · Azure Functions · MySQL

**03 Stack**: "What I use, and where I used it." Intro: "Split by context, because shipping Blazor to a production finance platform and using Next.js on a personal project are different kinds of experience."
- A In production: Blazor, C#, .NET (VFX, Codepoint) · Vue 2, Vue 3 (Prozis) · React (Codepoint) · xUnit (VFX) · GitHub Actions (VFX) · Azure Functions, MySQL (Codepoint) · HTML email (Prozis)
- B In my own projects: Next.js, React (Wedding app) · TypeScript (Personal work) · MongoDB (Wedding app) · NextAuth, Resend (Wedding app) · Ant Design, Google Maps API (Petaway)
- C Practice: Role-based access and permissions · Input validation · Refinement and risk spotting · Multi-environment delivery · AI-assisted development with Claude Code

**04 About** (portrait: [portrait.webp](/mnt/project-files/portfolio-redesign/portrait.webp), 4:5, grayscale at rest, colour on hover)
> I'm Luís, a software engineer in Portugal. I like the part of frontend that's easy to skip.
>
> The permission that hides a button from the wrong person. The validation message that tells you exactly what to fix. The state that's still right after a refresh. On a platform where people move money, those details are the product.
>
> I started in 2021 writing React and C# at Codepoint, spent a year on Vue at Prozis, and now work remotely on a broker platform at VFX Financial. Outside work I build things for real problems, like the app that ran my wedding.

Facts (`<dl class="spec">`): Education `CTeSP Web Development and Multimedia, IPCA, 2020–2022` · English `C2 Proficient (EF SET)` · Languages `TypeScript, JavaScript, C#, HTML, CSS`.

**05 Contact**: "Write to me." Intro: "Hiring for frontend, or need someone for a freelance project? Email is the fastest way to reach me." Email: luisribeirotech@gmail.com. Links: LinkedIn /in/luisleandro94, GitHub @LuisLeandro94, CV (PDF → `/cv/luis-ribeiro-cv.pdf`). Note: "Based in Portugal, {time} local time." Never show the phone number on the site.

## 9. Responsive compositions

- **Desktop (≥1024)**: as the prototype at 1440. Name occupies the left two thirds; role sits right, bottom-aligned. Section heads split title/intro 8/4. Experience is a five-column table. Stack is three columns.
- **Tablet (640–1023)**: 8 columns. Header loses the nav and gains `INDEX`. Hero stacks role under name. Project cards 2-up. Experience rows: dates 1–2, company/title 3–6. Stack is 2-up with Practice full width.
- **Mobile (<640)**: 4 columns. Name stays huge (min 56px) and wraps to two lines by design. Meta row 2×2. All projects stack, media first. Experience rows stack with the toggle on the date line. Contact address scales down to ~26px and wraps on the `@` if needed. Tap targets ≥ 44px in the index and contact rows.
- Check 320px width: no horizontal scroll anywhere.

## 10. SEO, sharing, metadata

- `<html lang="en">`, canonical `https://www.luisribeiro.dev/` (also update the GitHub profile website field, which says luisribeirodev.com).
- Open Graph and Twitter card: title, description, `og:image` = `/og.png` 1200×630 rendered in the system (paper background, "Luís Ribeiro" in Geist 600 at ~140px, one line of lead text, mono footer "Software Engineer · Frontend · Portugal"). Generate it at build time (e.g. Satori) or export once.
- JSON-LD `Person`: name "Luís Ribeiro", jobTitle "Software Engineer", worksFor "VFX Financial", address Portugal, sameAs [GitHub, LinkedIn], url.
- Favicon: "LR" set in Geist 600 on ink, SVG + 32px PNG + apple-touch-icon.
- `robots.txt`, `sitemap.xml`.

## 11. Accessibility and performance acceptance

- WCAG 2.2 AA. All text pairs in §3 already pass (lowest is `--graphite` at 5.0:1 on paper).
- Skip link to `#main`. One `h1`. Every section has an `h2` (About's is visually hidden).
- Visible focus ring: 2px `--signal`, 3px offset, on every interactive element.
- `<details>` for roles, native `<dialog>` for menus, `<dl>` for spec data.
- Meaningful link text (no "click here"); image alt text describes the screen.
- Everything works by keyboard alone, including the command menu and grid toggle.
- `prefers-reduced-motion` honoured as per §6.
- Lighthouse ≥ 98 on all four categories, mobile. LCP < 1.5s on 4G, CLS < 0.02, total JS < 15 KB gzipped, fonts ≤ 2 files preloaded. Images AVIF/WebP with explicit `width`/`height`, lazy below the fold.

## 12. Open items (needs Luís)

Answered 19 Oct 2026: Prozis title is Frontend Developer; GSD must not be named; Petaway was a team project (API by a teammate); freelance yes; domain luisribeiro.dev; location "Portugal"; portrait supplied; no hobbies line.

Still pending:
1. Case study page for the Wedding app: optional. Build it only if Luís wants one; until then, drop the "Read the case study" link.
2. Signature mark as SVG for the footer (optional).
3. The CV PDF includes a phone number; confirm Luís is happy for it to be public once the CV is linked.
4. The screenshots show his partner's name (Carla) in the signature; confirm she's fine with it being public.

## 13. Build order

1. Scaffold Astro + TS, add fonts, `tokens.css`, `base.css` (reset, type primitives, `.wrap`, `.g`, `.lnk`, `.btn`, `.rule`).
2. Typed content files from §8, with † items as `null` and components that omit null fields.
3. Static sections in order: Header, Hero, Work, Experience, Stack, About, Contact, Footer. Match the prototype at 1440, 820 and 390.
4. Scripts: clock, copy, grid overlay, command menu, mobile index, active nav, reveal, projectile sim. Each self-contained, loaded with `type="module"`.
5. Metadata, OG image, JSON-LD, favicon, sitemap.
6. Accessibility and Lighthouse pass against §11; screen-reader check of the command menu with VoiceOver.
7. Remove all † markers and the prototype strip. Ship.
