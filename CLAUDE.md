# HARDCORE: Legend of Onion Head

## About
- **Pitch:** Onion Head, a small robot core, climbs into the bodies of the robots it beats and fights its way down one long street to the Maker. By Ben (visual artist).
- **Genre / core loop:** side-scrolling pixel beat 'em up with depth lanes. Fight a screen-locked section → beaten robots leave empty bodies → climb into a bigger body (after the Matryoshka, nest bodies inside bodies) → use that body's special (A+B) → beat the level's boss and take the body it drops. 8 levels, 40 sections. A second mode, **Classic**, is the older top-down map with duels.
- **Look & feel:** 256×144 pixel canvas, neon synthwave palette (cyan core, magenta robots, yellow UI), chunky pixel font, screen shake, sparks, cartoon squash and stretch. Touch pad on phones (must fit 390 px wide).
- **Language:** English and Hebrew (`?lang=he` or the L key). Hebrew is right-to-left: the HTML key legend gets `dir="rtl"`; canvas text goes through `tr()` (the `HE` dictionary) and `visual()` (bidi reorder) and is drawn with the Hebrew pixel font `HFONT`.
- **Design doc:** `gamedesign.md` describes every mechanic and system. History: `CHANGELOG.md`. Status: `PROGRESS.md`. Level ideas not built yet: `docs/plans/level-proposals.md`. Future feature notes: `docs/FUTURE.md`.
- **Live:** https://yeledpele.github.io/hardcore-legend-of-onion-head/ (public repo `yeledpele/hardcore-legend-of-onion-head`).

## Tech conventions
- Browser game, vanilla HTML/CSS/JS, no frameworks, no runtime dependencies. Node is only for the build script and the tests (Playwright).
- **One small build step:** `build.js` inlines `src/index.html` + `src/style.css` + `src/game.js` into one self-contained file, `dist/hardcore.html`. `src/index.html` does not run by itself (it has inline placeholders).
- **Keyboard input always uses `e.code`, never `e.key`** (a Hebrew keyboard layout changes `e.key`). Keys map through `KMAP`.
- Hebrew text in HTML uses `dir="rtl"`. Every new player-facing string gets a Hebrew entry in `HE`.
- Guard browser APIs that previews may block (gamepads, storage) with try/catch.

## Project structure
- `src/index.html` page shell, touch pad and legend markup · `src/style.css` · `src/feel.js` **the feel file**: tuning numbers for the PLAY campaign (`FEEL`), one `name: number,` per line · `src/game.js` (all other game code, one ~3,800-line file: data tables, Classic mode, the PLAY campaign, bosses, rendering, HUD).
- `src/dev.js` dev mode (`?dev=1`, the backquote key, or `npm run dev`): DEV button and panel; inserted into the game's scope at build time. `dev-server.js` the local dev server.
- `build.js` puts `feel.js` + `game.js` + `dev.js` together → `dist/hardcore.html` (publish this). `node build.js --test` also inlines `tests/hooks.js` → `dist/hardcore.test.html`.
- `tests/` Playwright tests + `hooks.js` (test-only `window.__t` helpers) + `helpers.js`.
- `.claude/agents/` project subagents (playtester, balancer, art-director, design-doc-keeper, hebrew-reviewer, level-designer).
- `.github/workflows/pages.yml`: every push to `main` runs the quick tests, builds, and publishes to GitHub Pages. Pushes to other branches don't publish.
- `refs/` reference images (`refs/README.md` says what each is for). `docs/plans/` plans and proposals.
- `versions/` frozen archive of every earlier build (v1.0–v5.0). Never edit those files.

## Commands
- `npm run dev` → local dev server at http://localhost:5173/ (serves `src/` with no build, reloads on changes, lets the dev tools save `src/feel.js` / `src/levels.js`; this computer only)
- `npm run build` → `dist/hardcore.html`
- `npm test` → full suite (about 11 minutes, includes a scripted run through the whole 8-level campaign)
- `npm run test:quick` → everything except the campaign run (about a minute; includes a scripted fight against each new boss)

## Rules
- **One task at a time.** No features or refactors that weren't asked for.
- **Plan before coding** and wait for an OK before building. (Ben gives direction with reference images.)
- **Content and data stay separate from logic.** New text, level layouts, enemy and prop definitions go in data tables, not inside functions.
- **All tuning numbers in one config file: `src/feel.js`.** New numbers (damage, HP, speeds, timings, costs) go there, never inline; keep one `name: number,` per line with a short comment. *(Classic mode and the robot/body stat tables in `game.js` haven't moved yet — see PROGRESS.md.)*
- **Tests for deterministic logic.** After every change: `npm run test:quick` while working, `npm test` before saying it's done. Fix failures first.
- **Git:** commit and push each finished, tested task. Small fixes go to `main` (which publishes); big work (new levels, big mechanics, art directions, multi-feature requests) goes on its own branch, pushed, and merged only when asked.
- **Update `PROGRESS.md` at the end of every task**; gameplay changes also update `gamedesign.md`, and each version gets a `CHANGELOG.md` entry.
- **I can't playtest.** Tests and screenshots check that things work, not how they feel: flag anything that depends on feel (timing, difficulty, readability, juice) for Ben to try.
- Keep Onion Head's core design (square shell, ring eye, sprout with a magenta tip, side nubs) unless Ben asks otherwise.
- Controls are A (jump) and B (attack); A+B together is the special; Start climbs in or ejects. Never add buttons that crowd the touch pad.
- Small, checkable steps. Say plainly what changed and how it was tested.
