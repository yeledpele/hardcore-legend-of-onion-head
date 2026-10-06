# Progress

## Current state (2026-10-04)
v4.2 in progress. `main` is live on GitHub Pages; the dev tools are being built on branch **`dev-tools`** (not merged, not live). All 44 tests pass on `main`, 47 on `dev-tools` (`npm test`, ~11 min). The PLAY campaign is playable start to finish: 8 levels, 40 sections, 8 bosses, ending. Classic mode (top-down map and duels) still works. English and Hebrew.

## Done
- **v4.1 baseline** (pixel look, beat 'em up campaign, bodies, specials, heads, three bosses). Full history in `CHANGELOG.md`.
- **v4.2 so far:**
  - Nested bodies hide their legs (only the torso shows).
  - Nesting unlocks after beating the Matryoshka; before that, climbing in swaps bodies.
  - The Flyer's jetpack: hold A in the air.
  - Civilians who panic and can be squished (cartoon flat, then dizzy).
  - Destructible props per level; barrels explode and chain; big bodies smash props.
  - Five new levels and bosses: Toy Works (Wind-Up Knight), Hermit Harbour (Hermit Crab), Magnet Yard (Crane), Gullet Bog (Toad King), Giant's Kitchen (Cook). New bosses share one framework (`NB` table).
- **Dev tools, step 1 of 6 — the feel file** (branch `dev-tools`): `src/feel.js` holds ~80 tuning numbers for the PLAY campaign, grouped and commented, one `name: number,` per line; the game reads `FEEL` live. Same values as before; tests check the file format and that the game follows it.
- **Controller support**: any pad, A/B jump, X attack, Y/LB/RB special, Start, Back = language, connect message, rumble. Also fixed: Space (and pad B) now jump in the campaign. Tested with a simulated pad; needs a real controller to confirm rumble and button layout.
- **Boss revisions**: the Toad King is a jelly cube you beat from the inside (it digests your bodies, spits out the bare core); the Crane's pull is stronger and visible and it freezes what it catches (mash to break free); the Crane drops the MAGNET power (push special, pull on every 3rd hit).
- **Tweaks:** glitch only on damage and fail screens; full-width belts in Toy Works sections 2-4 that drag everything; beaten robots leave a body by per-type chance; the Hermit Crab starts in a spiral sea-snail shell.
- **Block, two specials, Matryoshka legs**: pad B / V blocks (guard meter, breaks and stuns); nested bodies: RT/C outer special, LT/F inner special; the Matryoshka has little legs.
- **Options menu + SYNTHWAVE MINT palette**: title and pause menus; palette, language, sound, rumble; remembered. Mint recolours every frame (key colours by role, the rest snapped to the nearest swatch).
- **Controller layout:** LT/RT special; Y, LB or RB climb in / eject; Start (or P) pauses. Ben has a working Xbox pad in Chrome.
- **Game speed:** master `FEEL.game.speed` = 0.85 (was effectively 1.0), slows everything evenly. Needs a playtest.
- **Project setup:** git + GitHub (public), GitHub Pages deploy on push to `main` (quick tests must pass), project agents including `level-designer`.

## Known bugs / issues noticed
- **"NESTING UNLOCKED" can be missed:** the level 3 title card hides banners, so if you walk on right after the Matryoshka the banner may not show (the text line above the arena still does).
- **Bomber and Shaman don't fight in PLAY:** they exist in `TYPES` but have no campaign behaviour, so no line-up uses them.
- **`<html lang="en">` never changes** to `he` when Hebrew is on (screen readers and browser translation see English).
- **Dead code:** the v3.0 vector renderer (~30 `v*` functions, `isVec()` always returns false) is still in `game.js`.
- **gamedesign.md §17 is out of date:** it still describes the v5.0 flat vector renderer as the PLAY renderer.
- **Slow full suite:** the campaign test takes ~10.5 min now that there are 8 levels.

## Needs a playtest (feel, can't be checked by tests)
- The new game speed (0.85): still too fast, or now too slow?
- A real controller: button layout, stick dead zone, and whether the rumble is too strong or too often.
- Difficulty across the 8 levels, and each new boss's HP and attack timing.
- The jelly Toad King: digest speed (one body per ~3 s), inside damage, how often it engulfs you. The Crane's freeze (8 presses to break free) and the MAGNET push/pull strength. The Crab's grab (mash B).
- The block: guard meter size (100, 5 per damage point), stun length, and whether turning while blocking feels right. The two specials when nested.
- SYNTHWAVE MINT: does every level read well (contrast between you, robots, props and backdrops)? Any colour that should be mapped by hand?
- The tweak panel: slider ranges (0 to 3x each value) and whether the panel layout works for you.
- Body drop chances: are there enough bodies to climb into, especially before the Matryoshka? And the glitch strength on hits.
- Jetpack fuel and height; civilians' panic radius and how often they get squished.
- Readability of the new backdrops behind the HUD (Toy Works shelves, Harbour lighthouse beam).

## Next steps
Dev tools plan (agreed 2026-10-04; tools ship in the live game too, hidden behind `?dev=1`; saving writes project files through a local dev server):
Controller support and the boss revisions are merged; next: dev tools step 2.
1. ~~Feel file~~ (done, merged to main)
2. ~~Dev mode + tiny local server~~ (done, branch `dev-tools`) (`npm run dev`, serves `src/` without a build, saves files; `?dev=1` / Backquote)
3. ~~Live tweak panel with a DEV button~~ (done, branch `dev-tools`) (sliders for every `FEEL` value, save to `src/feel.js`, reset, export)
**On hold (Ben, 2026-10-06): step 4 (debug layer) is pinned for later** (see `docs/FUTURE.md`).
4. Debug layer (hit boxes, depth lanes, entity states, boss timers, hazard zones, FPS, slow-mo/pause/step)
5. ~~Jump to scene~~ (done, branch `dev-tools`) (any level/section/boss, starting body, god mode, nesting unlocked, full POWER)
6. ~~Level editor~~ (done, branch `dev-tools`) (place/drag robots, crates, props, civilians, hazards; pick the boss; play-test; save to a new `src/levels.js`)

Still not in the feel file: Classic mode's numbers, the robot and body stat tables (`TYPES`, `FR`, `PROPS`), special-move timings (`SPTIME`), and the Maker/Warden/Matryoshka attack timings.

## Open design questions
- Should Classic mode also lock nesting until a boss is beaten?
- Civilians: is the cartoon-flat-then-run-off right, or should squished civilians stay squished? Should squishing them ever cost you something?
- Which of the 9 unbuilt level proposals (in `docs/plans/level-proposals.md`) are worth building next? Market Street (the Collector) now fits, since civilians exist.
- Should the Bomber and Shaman get campaign behaviour so line-ups can use them?
