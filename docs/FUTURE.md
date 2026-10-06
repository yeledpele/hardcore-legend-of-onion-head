# Future features — notes

Ideas Ben wants to keep for later. Not planned or scheduled yet; each one gets a plan before any code.

## Humans and robots
- **Humans steal parts from dead robots.** Civilians (or scavengers) run to beaten robots and wrecks and carry off parts — maybe the body you wanted to climb into, or scrap and weapons.
- **Some human groups attack robots.** Armed humans who fight the robots (and maybe you, since you're a robot too): a third side in the street fights.

## Dev tools (pinned 2026-10-06)
Steps 1–3 are done (feel file, dev mode + `npm run dev`, tweak panel). Parked for later, in this order:
- **Debug layer:** hit boxes, attack boxes and depth lanes; entity labels (type, state, HP); boss state and timers; mud and belt zones; frame time and FPS; slow motion, pause and single-frame step.
- **Jump to scene:** any level, section or boss from a list; starting body (including nested), invincible, nesting unlocked, full POWER and cores.
- **Level editor:** place, drag and delete robots, crates, props, civilians and mini-bosses; draw mud and belt zones; pick the boss; play-test the section; save to a new `src/levels.js` (the level data moves out of `game.js`).

## Scale
- **Check the scenery's size against the humans.** Civilians are about 8–9 px tall; props, backdrops (doors, windows, lamps, cars, trees) and robots should read correctly next to them. Review every level and adjust where the scale feels off.
