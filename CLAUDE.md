# HARDCORE: Legend of Onion Head

A browser beat 'em up by Ben (visual artist). One self-contained HTML file when built. English and Hebrew.

## Sources of truth
- `gamedesign.md` describes every mechanic and system. Any gameplay change updates it in the same piece of work.
- `CHANGELOG.md` gets an entry for every version.
- `refs/` holds the reference images; `refs/README.md` says what each one is for.
- `versions/` is the frozen archive of every earlier build (v1.0–v5.0). Never edit those files.

## Layout
- `src/index.html` page shell, `src/style.css`, `src/game.js` (all game code; still one big file — splitting it into modules is an open task).
- `build.js` inlines src into `dist/hardcore.html` (publish this). `node build.js --test` adds `tests/hooks.js` → `dist/hardcore.test.html`.
- `tests/` Playwright tests. `.claude/agents/` project subagents.
- `.github/workflows/pages.yml`: every push to `main` runs the quick tests, builds, and publishes to https://yeledpele.github.io/hardcore-legend-of-onion-head/ (public repo).

## Commands
- `npm run build` → `dist/hardcore.html`
- `npm test` → full suite (about 11 minutes, includes a scripted run through the whole 8-level campaign)
- `npm run test:quick` → everything except the campaign run (about a minute; includes a scripted fight against each new boss)

## Rules
- After every change: `npm test` (or `npm run test:quick` while iterating, full suite before finishing). Fix failures before saying it's done.
- Keep Onion Head's core design (square shell, ring eye, sprout with a magenta tip, side nubs) unless Ben asks otherwise.
- Controls are A (jump) and B (attack); A+B pressed together is the special; Start climbs in or ejects. Never add buttons that crowd the touch pad: it must fit a 390px-wide phone.
- Every new player-facing string gets a Hebrew translation in the `HE` dictionary.
- Guard browser APIs that previews may block (gamepads, storage) with try/catch.
- New art directions or big mechanics start on their own branch.

## Branches
- `main`: v4.1, the v1.13 pixel look with all current gameplay (published).
- The v5.0 flat colour-shape style (`style-flat`) was dropped; its build stays in `versions/hardcore_v5.0.html`.

## Working with Ben
- Ben gives direction with reference images; propose a short plan first, then build.
- Small, checkable steps. Say plainly what changed and how it was tested.
