# Future features — notes

Ideas Ben wants to keep for later. Not planned or scheduled yet; each one gets a plan before any code.

## Humans and robots
- **Humans steal parts from dead robots.** Civilians (or scavengers) run to beaten robots and wrecks and carry off parts — maybe the body you wanted to climb into, or scrap and weapons.
- **Some human groups attack robots.** Armed humans who fight the robots (and maybe you, since you're a robot too): a third side in the street fights.

## Dev tools (pinned 2026-10-06)
Steps 1–3, 5 and 6 are done (feel file, dev mode + `npm run dev`, tweak panel, jump to scene, level editor). Parked for later:
- **Debug layer:** hit boxes, attack boxes and depth lanes; entity labels (type, state, HP); boss state and timers; mud and belt zones; frame time and FPS; slow motion, pause and single-frame step.

- **Passcode for dev mode on the live site** (discussed 2026-10-06; hidden behind `?dev=1` is fine for now). Plan if wanted: ask for a passcode before dev mode turns on online; the code stores only its SHA-256 fingerprint; Ben sets it himself with `npm run set-dev-passcode` in a terminal (the passcode never goes into chat or git); remembered per browser; `npm run dev` never asks. It deters players but isn't bulletproof (the site has no server). The truly locked alternative: leave dev tools out of the published build.

## Scale
- **Check the scenery's size against the humans.** Civilians are about 8–9 px tall; props, backdrops (doors, windows, lamps, cars, trees) and robots should read correctly next to them. Review every level and adjust where the scale feels off.
