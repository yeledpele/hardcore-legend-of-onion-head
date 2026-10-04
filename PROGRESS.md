# Progress

## Current state (2026-10-04)
v4.2 in progress on `main`, live on GitHub Pages. All 18 tests pass (`npm test`, ~11 min). The PLAY campaign is playable start to finish: 8 levels, 40 sections, 8 bosses, ending. Classic mode (top-down map and duels) still works. English and Hebrew.

## Done
- **v4.1 baseline** (pixel look, beat 'em up campaign, bodies, specials, heads, three bosses). Full history in `CHANGELOG.md`.
- **v4.2 so far:**
  - Nested bodies hide their legs (only the torso shows).
  - Nesting unlocks after beating the Matryoshka; before that, climbing in swaps bodies.
  - The Flyer's jetpack: hold A in the air.
  - Civilians who panic and can be squished (cartoon flat, then dizzy).
  - Destructible props per level; barrels explode and chain; big bodies smash props.
  - Five new levels and bosses: Toy Works (Wind-Up Knight), Hermit Harbour (Hermit Crab), Magnet Yard (Crane), Gullet Bog (Toad King), Giant's Kitchen (Cook). New bosses share one framework (`NB` table).
- **Project setup:** git + GitHub (public), GitHub Pages deploy on push to `main` (quick tests must pass), project agents including `level-designer`.

## Known bugs / issues noticed
- **Space doesn't jump in PLAY** (found by reading the code, not confirmed in play): the key legend says "Z / Space jump", but the campaign only reads A (Z/J); Space maps to a separate `jump` input that only Classic mode and the menus read. The jetpack also only listens to A.
- **"NESTING UNLOCKED" can be missed:** the level 3 title card hides banners, so if you walk on right after the Matryoshka the banner may not show (the text line above the arena still does).
- **Bomber and Shaman don't fight in PLAY:** they exist in `TYPES` but have no campaign behaviour, so no line-up uses them.
- **`<html lang="en">` never changes** to `he` when Hebrew is on (screen readers and browser translation see English).
- **Dead code:** the v3.0 vector renderer (~30 `v*` functions, `isVec()` always returns false) is still in `game.js`.
- **Slow full suite:** the campaign test takes ~10.5 min now that there are 8 levels.

## Needs a playtest (feel, can't be checked by tests)
- Difficulty across the 8 levels, and each new boss's HP and attack timing.
- The Toad King's swallow (3.5 s inside, 5 damage per B hit) and the Crab's grab (mash B).
- Jetpack fuel and height; civilians' panic radius and how often they get squished.
- Readability of the new backdrops behind the HUD (Toy Works shelves, Harbour lighthouse beam).

## Next steps
_(Waiting for Ben to pick from the conventions report.)_

## Open design questions
- Should Classic mode also lock nesting until a boss is beaten?
- Civilians: is the cartoon-flat-then-run-off right, or should squished civilians stay squished? Should squishing them ever cost you something?
- Which of the 9 unbuilt level proposals (in `docs/plans/level-proposals.md`) are worth building next? Market Street (the Collector) now fits, since civilians exist.
- Should the Bomber and Shaman get campaign behaviour so line-ups can use them?
