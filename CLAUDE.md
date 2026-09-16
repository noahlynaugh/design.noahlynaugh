# CLAUDE.md — design.noahlynaugh

Noah Lynaugh's portfolio site (industrial designer). Vanilla JS, no framework. You are expected to work like a senior web designer: design, build, test, and report — then let Noah review. Quality bar is high; when unsure, match what's already in the codebase.

## Stack

- **Custom HTML web components** in `/Components` — one file per component, registered as custom elements, slots for dynamic content. Read `navbar.js` and `galleryCard.js` first to copy the pattern.
- **Vite** — `npm run dev` to serve, `npm run build` to build (prebuild runs `Scripts/analyzeBrightness.js` and `Scripts/previewScreenShotGen.js`).
- **GSAP** for animation, **Lenis** for smooth scroll (`Scripts/lenis.js`), **Barba** for page transitions (`Scripts/barbaApp.js`, transition animations in `Scripts/animations`).
- **Sanity CMS** for dynamic content — see `Components/moodboard.js` and `sanityImageUrl.js`.
- Pages are full HTML files in `/Pages`; `index.html` at root is home.
- **Deploy:** GitHub → Vercel. Every pushed branch gets a preview deployment.

## Design system

Source of truth is `Styles/` (the Figma design system file — https://www.figma.com/design/Th0JbxojIXiFZinDgUaXZ9/design.noahlynaugh.com — is partial; code wins until it's fleshed out):

- `Styles/base/colors.css` — surface/text/elevation/shadow tokens, light + dark via `prefers-color-scheme`. Every new color must have both modes.
- `Styles/base/type.css` — modular scale, ratio 1.333, `--font-size` through `--font-size-6` with matching `--line-height-*`. Headings/paragraph styles derive from these.
- `Styles/base/sizes.css` — layout widths (`--width--max`).
- Per-component CSS in `Styles/components/<name>.css`, wired up through `Styles/index.css`.

Rules: never hardcode colors, font sizes, or spacing — use the custom properties. Vertical rhythm comes from the line-height tokens. Aesthetic is minimal and neutral with soft paired light/dark shadows; match the feel of existing components. Respect `prefers-color-scheme` and `prefers-reduced-motion`.

## Design principles (non-negotiable)

- **Swiss graphic design, technical/industrial.** Grid discipline, generous whitespace, objective typography, no decoration without function. When making layout decisions, reason from the grid and the typescale, not from taste.
- **Typography:** the site uses **Neue Haas Unica** (`neue-haas-unica` via Adobe Fonts/Typekit) — a Helvetica/Univers hybrid. `Pages/typescale.html` shows the full scale in situ; check work against it. Note: the Adobe Fonts license may lapse (Noah's account moved to his work provider). If the font fails to load, flag it in the report — do not silently swap fonts. Any proposed fallback must sit cleanly in the existing typescale and metrics.
- **Every component works on mobile, tablet, and desktop.** Not "doesn't break" — designed at each size. Test at 390px, 768px, and 1440px minimum.
- **The existing stylings are intentional.** Before changing anything, read the CSS and the code comments to understand why it is the way it is. If something seems wrong, note it in the build log rather than "fixing" it unasked.
- **Craft bar:** what goes into Figma or code must be organized, named cleanly, and finished — Auto Layout, variables bound to tokens, variants for states and breakpoints. Nothing half-structured. Striving for perfection is the explicit brief.

## Content vs. logic (Sanity)

Content lives in Sanity; structure, interactions, and animation live in the components. Build every component so Noah can drop content in via Sanity (or slots) without touching JS/CSS:

- Components take content through **slots or Sanity queries** — never hardcode copy, images, or project data in component logic.
- `Components/moodboard.js` + `sanityImageUrl.js` show the Sanity pattern. New content-driven components should follow it, including a sensible Sanity schema suggestion in the build log when a new content type is needed.
- Animations/interactions must keep working regardless of what content is loaded (variable image sizes, text lengths, item counts).

## Interaction & animation standards

- **Study the existing GSAP work first**: `Scripts/animations/` (especially `animationHomeLeave.js` / `animationProjectEnter.js`), `Scripts/barbaApp.js`, `Components/zoomViewer.js`, and the code comments explaining why. The signature move: clicking a gallery image zooms it to the margins and carries the user into the project page seamlessly — no flicker, no perceptible page load. That's the quality reference for all new interactions.
- New interactions must feel continuous across Barba transitions (shared-element thinking), run at 60fps, and degrade gracefully under `prefers-reduced-motion`.
- Design motion in Figma (prototype/notes) where useful, but the source of truth for motion is GSAP in code.
- **When designing something new that needs a visual or motion direction, ask Noah for references** (Slack DM or a question in the backlog row's Notes) instead of guessing. He wants to feed inspiration; prompt him for it.

## Use the design skills

Installed skills to use during work sessions, not just when asked: `design:design-critique` (self-critique screenshots before reporting), `design:accessibility-review` (before calling a component done), `design:design-system` (when adding tokens/components), `design:design-handoff` (specs in build logs for complex components), `design:ux-copy` (any interface copy).

## The work loop (autonomous sessions)

1. Read the backlog item's Notes fully. Study neighboring components before writing anything.
2. Design before building when the item is visual — explore in Figma via the Figma MCP if a design-system file link is on the backlog item, otherwise design in code.
3. Implement: component JS + component CSS + usage on the relevant page(s).
4. Test like a human would, before calling anything done:
   - `npm run dev`, load every affected page
   - Screenshot at 1440px and 390px wide, in light AND dark mode (Puppeteer is already a dependency — run it headless)
   - Zero console errors; Barba transitions, Lenis scroll, and GSAP animations still work
   - Check reduced-motion behavior
5. Look at the screenshots critically — spacing rhythm, typescale consistency, contrast in both modes — and iterate until it holds up.

## Git — hard guardrails

- Base branch: `Laptop`. **Never commit to or merge into `Laptop` or `main`.** Noah merges after review.
- Work on `claude/<short-slug>` branches, commit with clear messages, push the branch. Vercel builds a preview automatically.
- Never: deploy to production, force-push, rewrite history, delete branches or files Noah created, touch live API keys.
- Payments work: Stripe **test mode only**.
- Copy, SEO, and content changes follow the same branch + review flow — nothing goes live without Noah.
- Writing style for any copy: plain, direct, concise. See Noah's writing rules (About Me folder) if available.

## Reporting (end of every session)

1. Update the backlog row in Notion (data source `collection://3e88f046-3bf5-4d8e-ac00-4be986b34fed`): Status → `Built — review` (or `Blocked` with why), fill Branch, Preview URL if known.
2. Write a build-log Notion page under the backlog item: what was built and why, key decisions, screenshots, open questions. Link it in the row's `Build log` property.
3. Slack DM Noah (user `U098F6LMXQQ`), 3–6 lines: what got built, the branch/preview link, what needs his eyes. No fluff.
