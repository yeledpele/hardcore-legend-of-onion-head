# HARDCORE: new level proposals

Level designer pass, October 2026. Fourteen proposals for new levels (biome + four fight sections + boss), checked against the engine as it is in `src/game.js` (pixel renderer live, `isVec()` returns false). Ranked best first. Nothing in the game has been changed.

## Decision (2026-10-04)

**Built (v4.2), in campaign order between the Pine Forest and the Foundry:** 3. The Toy Works (Wind-Up Knight), 4. Hermit Harbour (Hermit Crab), 5. The Magnet Yard (Crane), 6. The Gullet Bog (Toad King), 7. The Giant's Kitchen (Cook).
Chosen for the five most different boss mechanics: facing (Knight), husk theft (Crab), pull on bodies with a bare-core advantage (Crane), swallow-and-digest your layer (Toad), climb the boss's weapon (Cook). The Surgeon tied with the Knight on score but overlaps the Crab (both revolve around husks); the Knight is cheaper and adds a mechanic no boss had. Built as described, with these cuts: no Bomber/Shaman campaign behaviour (line-ups use the listed fallbacks), no Crab bubble spit, no Toad "kick a head into its mouth" special case (a blast near it still makes it BURP), no Cook sneeze stun (pepper is crosshair strikes).

**Revisions after Ben's notes (2026-10-04):**
- **The Gullet Bog / Toad King** — Ben loves it; it becomes the boss where you lose all your bodies. Now a **jelly cube**: it slides over you and engulfs you; outside hits barely hurt; you kill it **from the inside** by hitting its nucleus while it digests your extra bodies one by one; at the bare core it spits you out.
- **The Magnet Yard / Crane** — keep, improve the pull and freeze: a stronger, visible pull, and what it catches is frozen to the magnet (you too: mash to break free). It now drops a **MAGNET** power: the special is an area **push**, every 3rd normal hit is a **pull**.
- **The Giant's Kitchen** — players ask about the "face" in the backdrop: it's the cat's eyes under a cupboard, and it doesn't read as a cat. To decide: make it read as a cat, or remove it.

**Not built (kept for later):** The Repair Ward (Surgeon), Market Street (Collector — a good fit now that civilians exist), The Big Top (Juggler), The Frost Works (Yeti), The Flooded Line (Carriage Worm), The Server Farm (Puppeteer), The Giant's Graveyard (Colossus Reborn), The Deep Quarry (Drill Mole), The Bell Tower (Bellringer).

Scores are 1–5. **Fun**: how good the fights and boss feel to play. **Theme**: fit with "a core that climbs into bodies; robots, monsters and humans of every size". **Variety**: how different it plays from Burial Waste / Pine Forest / Foundry. **Cost**: 5 = cheapest to build. Total out of 20.

## Ranked summary

| # | Level | Boss | Hook | Fun | Theme | Variety | Cost | Total | Size |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hermit Harbour | The Hermit Crab | Boss wears robot husks as its shell and steals new ones (yours too) | 5 | 5 | 5 | 3 | **18** | M |
| 2 | The Gullet Bog | The Toad King | Boss swallows your outer body; you fight from inside its belly | 5 | 5 | 5 | 3 | **18** | M |
| 3 | The Giant's Kitchen | The Cook | Scale flip: you are tiny on a giant's floor; Maker-style hands with a knife and a pan | 4 | 4 | 5 | 4 | **17** | M |
| 4 | The Magnet Yard | The Crane | Magnet lifts husks, robots and you; drops them as bombs; cab topples down | 4 | 5 | 4 | 3 | **16** | M |
| 5 | The Repair Ward | The Surgeon | Boss sews heads back onto husks to revive robots; kick heads away | 4 | 5 | 4 | 3 | **16** | M |
| 6 | The Toy Works | The Wind-Up Knight | Hit the key on its back to unwind it; positioning behind a boss | 4 | 3 | 4 | 4 | **15** | S–M |
| 7 | The Big Top | The Juggler | Boss juggles ticking heads and throws them; kick them back | 4 | 3 | 4 | 4 | **15** | S–M |
| 8 | The Frost Works | The Yeti | Slippery ice floor; monster coat bursts to reveal a robot inside | 4 | 4 | 4 | 3 | **15** | M |
| 9 | Market Street | The Collector | Civilians: boss scoops them into a cage; free them to weaken it | 4 | 4 | 4 | 3 | **15** | M |
| 10 | The Flooded Line | The Carriage Worm | Segmented train-worm charges along lanes; each segment is a layer | 4 | 4 | 4 | 3 | **15** | M |
| 11 | The Server Farm | The Puppeteer | Strings animate empty husks against you; cut strings, climb in first | 3 | 5 | 3 | 3 | **14** | M |
| 12 | The Giant's Graveyard | The Colossus Reborn | Reuses the Colossus that is still in code; finally drops the Titan | 3 | 4 | 2 | 5 | **14** | S |
| 13 | The Deep Quarry | The Drill Mole | Burrowing boss and minecart lanes that cross the street | 4 | 3 | 4 | 2 | **13** | L |
| 14 | The Bell Tower | The Bellringer | Bell rings send shock rings across the floor; jump the rings | 3 | 2 | 3 | 4 | **12** | S–M |

**Recommendation:** build **Hermit Harbour** and **The Gullet Bog** first. Both turn the game's own idea (bodies as layers you take and lose) back on the player, which none of the three current bosses do, and both reuse husks, the layer stack and the strike/marker systems. If one cheap level is wanted fast, **The Giant's Graveyard** (Colossus already exists) also fixes the "Titan can't be obtained" gap in gamedesign.md §18; Hermit Harbour can fix it too (see below).

---

## Engine notes that apply to every proposal

What I checked in `src/game.js`, so the proposals stay inside it:

- **Canvas and street:** 256x144, floor band z 110–138 (`BZ0`/`BZ1`), backdrop strip is 256x104 drawn at 0.35 parallax (`drawStreet`, `bgs[]`), floor colours from `BFLOOR[theme]`.
- **Sections:** `STAGES[i].secs` = five arrays of `[type,x,z,miniBoss]`, `['C',x,z]` for a crate, `['BOSS',type]` for the boss. Negative x spawns behind the player. Mini-boss flag `1` = HP x1.7, resists launch. Robot HP/damage scale automatically with level index (`mult=1+.3*stage`).
- **Robot types that work in the campaign today** (`stepBrawlFoe`): `scrap`, `lancer`, `brute`, `walker`, `guard` (Shieldbot), `hound`. `bomber` and `shaman` exist in `TYPES` but have **no campaign behaviour** (they would just walk up and melee). Several proposals use them; turning them on is a small shared job:
  - **Bomber** (campaign): on its attack, push two walking bombs into `bw.bombs` (the Warden's bombs already run every frame via `stepBombsB`). Kicked bombs without a Warden fly and blow up on landing, hurting robots: a free "kick it back" fight. About 10 lines plus an `ESIZE` entry so its body is pilotable.
  - **Shaman** (campaign): floats, keeps its distance, casts lightning rings using `bw.strikes` with `bolt:true` (the Matryoshka's lightning). `drawShaman` already exists. About 15 lines. Closes gamedesign §18 "Shaman and Bomber appear only in Classic".
- **Bodies a boss can drop** without new art: `basic`, `brute`, `walker`, `titan` (frames), `doll`, `flyer`, any `e:<robot>`. The **Titan** frame has no source in the campaign since the Colossus was cut; a new boss dropping it is a gift.
- **Boss hook checklist.** A new boss touches the same places the Warden does: `TYPES` entry, `makeBoss` (HP + start state), `stepCampBoss` dispatch, `drawCampBoss` dispatch, `bossHit` branch, and the reaction branches in `toppleBoss`, `headBoom`, `fireHook` (the arena always gives a Chain Hook), `stepDrops` (Flyer bombs) and `kickHeads` (homing). Plus Hebrew strings, a `gamedesign.md` section, and a boss strategy in `tests/campaign.spec.js` (it scripts each boss by type and asserts the boss list). Budget this as roughly +40 lines on top of the step and draw functions. (Worth considering once: a per-boss table of these reactions, so each new boss is one object rather than ten `if(b.type===...)` edits.)
- **A new biome** = one `withCtx(bgs[n]...)` block (~15 lines like the Pine Forest), one `BFLOOR` entry, one `STAGES` entry. **Caution:** the level intro text is read from `LEVELS[stage].intro`, and adding a `LEVELS` entry crashes the Classic map setup unless `POCKETS` is extended too. Cheapest fix: let `STAGES[i].intro` override it for campaign-only levels.
- **Placement:** the Matryoshka must stay level 1 (it unlocks nesting) and the Maker must stay last (it plays the ending). New levels slot between Pine Forest and Foundry, or between Burial Waste and Pine Forest.
- **Parallel work:** proposals mark where they use **civilians** (small humans to squish) and **destructible props** (breakable street things that may drop items). Where a proposal depends on them it says so; none of the top three needs them to work.

---

## 1. Hermit Harbour — The Hermit Crab

**Score:** Fun 5 · Theme 5 · Variety 5 · Cost 3 · **Total 18** · Size **M**

**Biome.** A night fishing harbour. Backdrop: a low moon over black water, a pier on stilts, cranes and moored boat hulls in silhouette, a lighthouse beam sweeping slowly (one rotating wedge drawn into the strip, or a cheap alpha band). Ground: wet planks (the floor perspective lines read naturally as boards). Palette: `#06121c` sky, `#0c2a3a` water, `#1d4a5a` hulls, `#c9a46a` planks highlight, `#ffd84a` lighthouse.
Hazard (optional, cheap): a puddle strip at the back lane (z 110–114) where bodies slide (friction x0.95 while in it).
Props (if the parallel work lands): crab pots and fish crates that break and drop scrap.

**Sections.**
1. `scrap` x2, `lancer` (pier workers waking up).
2. `hound` x2 from both sides, crate.
3. **Mini-boss:** big `guard` (Shieldbot) + `scrap` behind. A shield you must get around foreshadows the boss's shell.
4. `brute`, `bomber`, `lancer`, crate. (Bomber needs its campaign behaviour, see engine notes; swap for `walker` if not built.)

**Boss: The Hermit Crab** (240 HP).
- **Silhouette:** a low, wide pink crab (two big claws, eye stalks) wearing a stolen robot husk on its back as a shell. It starts in an oversized **Walker husk** drawn with the existing `drawBody`, bolted on upside-down.
- **Shell phase:** the shell takes front hits at half damage like the Shieldbot (reuse the `guard` front-block idea). Hits from behind or from the air land fully.
- **Attacks:**
  1. **Claw pinch:** claws open wide (tell: claws spread, "!" and the wind-up beep, ~30 frames), then a short lunge. On hit it **grabs** you, shakes for ~40 frames and throws you. Mash B to escape early.
  2. **Sideways scuttle:** turns sideways (tell: legs blur, dust, yellow lane dashes like the Maker's sweep warning), then crosses the whole screen in your lane. Jump it or change depth.
  3. **Bubble spit:** three slow bubbles drift along the floor toward you; a hit pops them. Cheap "something to punch" between big moves.
- **Shell break and steal (the hook):** when the shell's HP runs out it cracks off ("SHELL BREAK") and the naked crab is fast and takes x1.5 damage, but it **scuttles to the nearest empty husk on the street and climbs in** (any `bw.ents` husk: robot bodies from earlier, or a body you ejected). Each new shell gives it that body's shell HP. If no husk is near, it digs a new shell out of the sand after ~6 seconds (a Basic-size shell). So the player's job is husk denial: smash husks, or climb into them first. Ejecting a body mid-fight becomes a risk.
- **Nesting / topple / heads:** a Chain Hook rips the current shell off at once. A ticking head blast or a Flyer bomb flips the crab on its back for 2.5 s (the topple: belly up, ×1.5). Kicked heads hit it normally.
- **Drops:** its last stolen shell, unbroken: a **Titan** frame it was saving ("ITS DREAM SHELL: TITAN"). This closes the Titan gap in gamedesign §18.

**Plays differently because:** the boss interacts with husks, the one system no boss touches today. Bodies on the floor become a resource you fight over, and ejecting has a real cost.

**Build (M):** `stepCrab` (states: walk, pinch-wind, pinch, hold, scuttle-wind, scuttle, spit, naked-run, climb, flipped, dead) about Warden size plus the husk search; `drawCrab` (box/px body, claws, stalks) that calls `drawBody` for the worn shell; bubbles as a tiny array (or reuse `bw.bombs` with a different draw). Backdrop block. Hook-checklist edits. Optional: bomber behaviour.

---

## 2. The Gullet Bog — The Toad King

**Score:** Fun 5 · Theme 5 · Variety 5 · Cost 3 · **Total 18** · Size **M**

**Biome.** A swamp of rotting machines: drowned cars, a sunk tank, reeds, fireflies (reuse the Pine Forest's yellow dots), hanging moss. Ground: dark mud with lily pads painted on the floor band. Palette: `#0b140c` sky, `#16281a` far trees, `#2c4a2a` reeds, `#4a5a2a` mud highlight, `#c6ff4a` fireflies / toad eyes.
Hazard: **mud patches** drawn on the floor (fixed x ranges per section) that slow you (speed x0.6) and stop jumps from being full height. Robots are slowed too, so you can lure them in.

**Sections.**
1. `scrap` x3 in and out of mud.
2. `hound` x2 (their dash dies in mud: a lesson), crate.
3. **Mini-boss:** big `brute` + `shaman` floating above the mud (shaman needs campaign behaviour; fall back to `lancer`).
4. `guard`, `walker`, `hound`, crate.

**Boss: The Toad King** (230 HP).
- **Silhouette:** a huge squat robot toad (about Matryoshka-largest size, 48 high, 44 wide), riveted plates, throat sac, a crown of pipes. Sits in the middle of the arena.
- **Attacks:**
  1. **Tongue lash:** sac inflates, eyes flash (tell, ~28 frames, yellow line along your lane). Tongue shoots across the lane. If it connects it **pulls you in and swallows you** (see below). Jump or change depth to dodge.
  2. **Belly flop:** crouches, leaps off screen, a shadow marker follows you (the Maker's red slam marker, `slamwind` logic) and it lands with a shockwave. Afterwards it lies dazed (×1.5), like the Matryoshka's lurch-down.
  3. **Spawn croak:** croaks and spits out two `scrap` robots (with heads that can pop off as usual, so they also feed ticking heads into the fight). Once per 15 s, at most 2 alive.
- **Swallow (the hook):** being swallowed puts you "inside" the boss for up to 3 s. The screen shows the toad with you as a bulge; B presses hit its **inside** for x2 damage; A+B bursts out at once. What it costs you: if you are in a body, the toad **digests your outer layer**: when you burst out, that body is spat out as an empty husk with half its remaining shell (you can climb back in). The bare core loses one core pip instead. It's the nesting system run backwards: the boss climbs *you* in.
- **Topple / heads / hook:** a ticking head kicked into its open mouth during the tongue tell makes it swallow the bomb: a big hit and a long daze ("BURP"). Chain Hook: pulls its tongue out and stuns it. Flyer bombs on its back: damage plus daze.
- **Drops:** a **Brute frame** stained green, or a new "Toad" body if Ben wants one later (Pounce-like hop special). Cheapest: Brute frame or `e:hound`.

**Plays differently because:** the first boss whose main threat is a grab-and-swallow rather than damage, and the first to mess with your layer stack directly. The mud makes positioning matter for both you and the robots.

**Build (M):** `stepToad` (idle, tongue-wind, tongue, swallowed, flop-wind, flop-air, flop-land, dazed, croak, dead) and `drawToad` (box helpers; mouth open/closed; bulge frame). The swallowed state needs a small player flag (`p.inside`) that hides the player, disables movement and routes B / A+B to the boss: about 15 lines in `stepBrawl`. Mud: a per-stage list of x ranges checked in the player and foe speed lines. Backdrop block.

---

## 3. The Giant's Kitchen — The Cook

**Score:** Fun 4 · Theme 4 · Variety 5 · Cost 4 · **Total 17** · Size **M**

**Biome.** Scale flip: the street runs across a giant's kitchen floor and you are tiny. Backdrop: huge table legs and chair legs as pillars, the underside of a counter with a dangling tea towel, a giant cat's eye in the dark under a cupboard (blinks now and then). Ground: chequered tiles (alternate the floor band in two colours). Palette: `#1a0f08` shadow, `#3a2414` wood legs, `#e8dcc0` / `#b8ac90` tiles, `#ff6a3d` stove glow, `#ffe600` cat's eye.
Props: giant sugar cubes and cans that break into scrap and power (parallel prop work fits perfectly here).
Civilians: tiny kitchen helpers (if the civilians feature lands they read well here as "the giant's mice").

**Sections.**
1. `scrap` x2, `lancer` (cutlery robots: the Lancer reads as a fork).
2. `hound` x2, crate.
3. **Mini-boss:** big `walker` (a whisk on legs) with `scrap`.
4. `brute` x2, `lancer`, crate.

**Boss: The Cook** (300 HP, a hands-only giant).
- **Silhouette:** you never see the whole giant: only two huge robot hands come down from above the screen (re-skinned Maker fists drawn bigger, with a chef's sleeve), and its face peers in from the top edge between attacks, eyes only.
- **Attacks:**
  1. **Pan slam:** the left hand brings a frying pan down on your spot with the red marker (`slamwind`/`slam` logic as-is). The pan stays on the floor for a moment as a **platform** (`bw.plats`, like "JUMP ON THE FIST").
  2. **Knife chop:** the right hand chops three times walking along your lane (three slam markers in a row, faster).
  3. **Pepper shake:** a shaker sprinkles pepper over a third of the screen (a field of `strikes`); standing in it makes the core sneeze (a short stun).
- **Topple / heads:** from the pan platform you can jump and air-hit the giant's face when it peers in (counts as a head hit, x2, like hitting the Maker's head when it kneels). Chain Hook: yanks a hand down to the floor (a "topple" with the hand as the head to hit). Ticking heads: kick one onto the pan; it launches up into the face.
- **Drops:** the chef's sleeve hides a **Walker frame** ("ITS SPARE HAND"), or the Titan if Hermit Harbour isn't built.

**Plays differently because:** the scale flip is a visual surprise, and the fight is vertical: you climb onto its weapon to reach a target above, which only the old Colossus fist did. Props and civilians fit the theme better here than anywhere else.

**Build (M, but mostly reuse):** `stepCook` is the Maker's state machine with a second fist and a "peer" state; `drawCook` draws two hands + sleeve + peering face. Floor checker needs a small branch in `drawStreet` (alternate fill per tile). Backdrop block (vertical legs are cheap rectangles).

---

## 4. The Magnet Yard — The Crane

**Score:** Fun 4 · Theme 5 · Variety 4 · Cost 3 · **Total 16** · Size **M**

**Biome.** A scrapyard of crushed robots: stacked car cubes, a crusher, piles of heads, sodium lamps. Ground: oily gravel. Palette: `#140e06` sky, `#2a2010` stacks, `#5a4a2a` rust, `#ff9a2a` lamps, `#7affd0` magnet arcs.
Hazard: falling junk at section 4 (crosshair `strikes`, slow and rare).
Props: car cubes and oil drums (barrel explodes like a ticking head).

**Sections.**
1. `scrap` x3.
2. `lancer`, `bomber`, crate.
3. **Mini-boss:** big `brute` + `hound`.
4. `walker`, `guard`, `scrap`, crate, falling junk.

**Boss: The Crane** (260 HP).
- **Silhouette:** a gantry crane at the back of the street (like the Maker, a giant on the back line): two legs, a cross beam, an operator cab with a robot face, and an electromagnet on a cable.
- **Attacks:**
  1. **Magnet drop:** the magnet slams down on a red marker (slam logic).
  2. **Lift:** the magnet hums (tell: green arcs, rising tone, ~40 frames) and pulls things in a radius toward it: **husks, robots, heads, and you** (in a body; the bare core is too light: a reason to eject). It then lifts what it caught and drops it on you as a projectile. A caught ticking head is dropped on you: or on itself, if you knock the magnet with a hit while it carries one.
  3. **Beam roll:** the cab rolls along the beam and dumps a load of scrap (a line of three strikes).
- **Topple:** Chain Hook on the magnet cable, or a ticking head on a leg, brings the **cab** crashing to the floor for 2.5 s: hit its face (×1.5). Same rule as the Maker topple.
- **Drops:** the crane's cab robot climbs out as a **Brute robot** husk, or the Titan (pick one per campaign).

**Plays differently because:** pull mechanics on bodies and heads; the bare core has an advantage here (magnets can't grab it), which makes the eject decision interesting.

**Build (M):** `stepCrane` built on Maker states (slamwind, slam, kneel) plus `lift` (pull nearby `bw.ents` / heads / player toward the magnet), `carry`, `drop`. `drawCrane`: gantry rectangles, cab, cable line, magnet. Backdrop block.

---

## 5. The Repair Ward — The Surgeon

**Score:** Fun 4 · Theme 5 · Variety 4 · Cost 3 · **Total 16** · Size **M**

**Biome.** An abandoned robot hospital: green-white tiles, operating lamps, rows of stretchers with robots lying under sheets, a heart monitor line running along the backdrop (an animated zigzag is cheap). It echoes Shelly's "FIX FIX": the story line can be about her tools found here. Palette: `#061410` dark, `#0e2a24` tiles, `#5affc0` monitor line, `#e8f4ee` lamps, `#ff2a6d` red cross.
Hazard: none; the fight itself is the hazard.

**Sections.**
1. `scrap` x2 that get up again once (they "revive" with half HP if you leave their heads near them: a lesson for the boss).
2. `lancer`, `hound`, crate.
3. **Mini-boss:** big `walker` + `scrap`.
4. `guard` x2, `shaman` (a nurse that heals? optional), crate.

**Boss: The Surgeon** (220 HP).
- **Silhouette:** a ceiling-mounted machine: a round lamp head with one eye and four long jointed arms (scalpel, needle-and-thread, claw, drill) hanging into the screen. It slides along a ceiling rail.
- **Attacks:**
  1. **Scalpel jab:** an arm draws back (tell: glint, beep), then stabs down at your spot (a slam-like marker but narrow and fast).
  2. **Drill sweep:** the drill arm drops low and sweeps across the lane (Maker sweep: jump it).
  3. **Sew-up (the hook):** the claw picks up a **head** lying on the floor and the needle sews it onto the nearest **husk**: that robot gets up again at half HP with a stitched look. Kicking heads away, kicking them *at* the Surgeon, and climbing into husks before it reaches them all deny it. It also tries to sew a head onto *your* body if you stand still in a husk (it grabs you; mash out).
- **Topple / heads:** kicked heads that hit its lamp knock it down to the floor (like the Warden's DOWNED) where you can beat it. Chain Hook pulls it off its rail.
- **Drops:** its last patient: a **Walker frame** with stitches ("ITS LAST PATIENT").

**Plays differently because:** robots come back unless you manage heads and husks; the battlefield fills up with your own leftovers. It makes the head-kicking system central rather than optional.

**Build (M):** `stepSurgeon` (Warden-style hovering on a rail, plus jab/sweep/sew states; sew finds the nearest head + husk and turns the husk back into a `bw.ents` robot with `type` from `husk.id`). `drawSurgeon`: lamp head + four line arms (`pline`). Backdrop block. Shares husk-search code with Hermit Harbour if both are built.

---

## 6. The Toy Works — The Wind-Up Knight

**Score:** Fun 4 · Theme 3 · Variety 4 · Cost 4 · **Total 15** · Size **S–M**

**Biome.** A toy factory at night: conveyor belts, shelves of tin soldiers, a giant rocking horse, a mobile turning slowly. Ground: wooden floor with painted hopscotch numbers. Palette: `#140a1e` dark, `#2e1a3a` shelves, `#ff5a7a` / `#5ac8ff` toy paint, `#ffd84a` brass.
Hazard: a **conveyor** floor stretch in sections 2 and 4 that pushes everyone left (add -0.4 to x each frame while standing on it).

**Sections.**
1. `scrap` x2, `lancer` (tin soldiers).
2. `hound` x2 on the conveyor, crate.
3. **Mini-boss:** big `guard` + `lancer`.
4. `brute`, `walker`, `scrap`, crate.

**Boss: The Wind-Up Knight** (240 HP).
- **Silhouette:** a tall tin knight (Walker scale) with a lance, a plume, and a big brass **key** turning in its back.
- **Attacks:**
  1. **Lance charge:** lowers the lance (tell: key spins fast, ticking), then charges across the screen.
  2. **Spin:** spins like a top with the lance out (circle danger for 2 s), then gets dizzy.
  3. **March:** steps toward you in stiff marching steps, each stomp a small shockwave.
- **The hook:** the key **unwinds** over time and as you hit it from **behind**: hits on its back hit the key (x1.5 and slow it down). At zero it stops dead, slumps forward (the topple, 3 s, ×1.5 to its head), and then winds itself up again. A Chain Hook yanks the key out for a long slump. Ticking heads and Flyer bombs cause a slump as usual.
- **Drops:** the knight's empty armour: a **Walker frame** painted like a toy, or `e:lancer`.

**Plays differently because:** the first boss built around facing: get behind it. Simple to read, needs no new systems beyond "hit from behind".

**Build (S–M):** `stepKnight`/`drawKnight` (Walker-like drawing via box; key as a small rotating cross). Conveyor: a per-stage x range in the movement code. Backdrop block.

---

## 7. The Big Top — The Juggler

**Score:** Fun 4 · Theme 3 · Variety 4 · Cost 4 · **Total 15** · Size **S–M**

**Biome.** An abandoned circus: striped tent canvas, a dead Ferris wheel, bunting, a strongman bell. Ground: sawdust ring. Palette: `#1a0612` dark, `#8a1a3a` / `#e8d8c0` tent stripes, `#ffcf3a` bulbs, `#3a1020` seats.
Props: popcorn carts, target boards. Civilians: an audience that runs away.

**Sections.**
1. `scrap` x2, `hound` (circus dogs).
2. `bomber` x2 (clowns with bombs; needs campaign behaviour, else `lancer`), crate.
3. **Mini-boss:** big `brute` (the strongman).
4. `walker`, `lancer`, `guard`, crate.

**Boss: The Juggler** (220 HP).
- **Silhouette:** a tall thin clown robot on a unicycle with four arms.
- **Attacks:**
  1. **Juggle and throw:** juggles 3 **ticking heads** (the existing head system with `bomb:true`), throws them one by one at your spot. Each has a landing marker. You can **kick them back** (it already works: `kickHeads`); a head that hits it while juggling makes it drop all of them (they explode around it: a big hit).
  2. **Unicycle charge:** rings its bell (tell) and rides across your lane.
  3. **Pie in the face:** a short-range throw that blinds you (screen goes half dark, 1 s). Use sparingly.
- **Topple:** a head explosion or Chain Hook knocks it off the unicycle (down for 2.5 s, ×1.5).
- **Drops:** its performing dog: a **Hound** body ("THE CIRCUS DOG").

**Plays differently because:** the ticking-head system becomes the boss's main weapon: a fight of hot potato. Cheap since heads already fly, bounce and explode.

**Build (S–M):** `stepJuggler`/`drawJuggler`; spawning heads into `bw.heads` with set velocities; one `headBoom` branch for "hits the Juggler". Backdrop block.

---

## 8. The Frost Works — The Yeti

**Score:** Fun 4 · Theme 4 · Variety 4 · Cost 3 · **Total 15** · Size **M**

**Biome.** A frozen pumping station in the mountains: snow falling (a few white pixels drifting, drawn per frame), icicles, frozen pipes, a blizzard band. Ground: ice. Palette: `#0a1424` sky, `#1e3450` mountains, `#9ad0ff` ice, `#e8f4ff` snow, `#ff6a3d` warning lights.
Hazard: **ice floor**: every body's friction goes up (x1.08 toward 1, capped), so heavy bodies slide far. This reuses the weight-and-momentum system and makes body choice matter: the bare core still stops on a dime.

**Sections.**
1. `scrap` x2, `hound` (hounds slide past you after a dash: a free punish).
2. `brute`, `lancer`, crate.
3. **Mini-boss:** big `walker` + `scrap`.
4. `guard`, `hound` x2, crate.

**Boss: The Yeti** (260 HP, two phases).
- **Silhouette:** a huge white-furred monster (box shapes with jagged fur edges), small horns, blue face. A monster, not a robot: until the second phase.
- **Phase 1 attacks:**
  1. **Snowball roll:** packs and rolls a snowball along your lane that **grows** as it rolls; punch it to send it back (like kicked bombs), it knocks the Yeti down.
  2. **Roar:** beats its chest (tell), roar shakes icicles loose: a field of crosshair strikes.
  3. **Grab and toss:** like the Matryoshka lurch but it throws you if it connects.
- **Phase 2 (the hook):** at half HP the fur coat bursts off ("IT WAS A COSTUME") and a skinny **robot** inside keeps fighting: faster, ice-breath line attack along the lane. This is the Maker's eject told in reverse: monster outside, robot inside.
- **Topple:** snowball hits, ticking heads and Chain Hook knock it down (head on the floor, ×1.5).
- **Drops:** the robot inside's body: a **Walker frame** with frost on it, or a **Brute** frame with a fur trim.

**Plays differently because:** the floor itself changes how bodies handle, and the boss's own projectile is the weapon to beat it.

**Build (M):** `stepYeti`/`drawYeti` (two draw looks), snowball as a small object (or reuse `bw.bombs` with a growing radius). Ice: one friction multiplier read from the stage in the momentum code. Snow: a few particles per frame.

---

## 9. Market Street — The Collector

**Score:** Fun 4 · Theme 4 · Variety 4 · Cost 3 · **Total 15** · Size **M** (needs civilians)

**Biome.** A town market street, Shelly's kind of place: shuttered stalls, awnings, hanging lanterns, a clock tower, a tram line. Ground: cobbles. Palette: `#120a14` dark, `#3a2030` stalls, `#ffb04a` lanterns, `#4ac0a0` awnings, `#d8c8b0` cobble highlight.
This is the showcase level for the parallel work: **civilians** running around (squishable, which should cost score or power so players avoid it) and **destructible stalls** (fruit carts, crates) dropping scrap and cells.

**Sections.**
1. `scrap` x3 among fleeing civilians.
2. `lancer`, `hound`, crate.
3. **Mini-boss:** big `brute` herding civilians.
4. `guard`, `walker`, `bomber`, crate.

**Boss: The Collector** (240 HP).
- **Silhouette:** a tall robot with a birdcage for a torso and long grabber arms (Walker scale).
- **Attacks:**
  1. **Scoop:** reaches along a lane (tell: arms fold back) and grabs any civilian in reach, putting them in its cage. Each caged civilian gives it +10 shell and makes it faster.
  2. **Net throw:** throws a net at your spot (marker); caught = slowed for 2 s.
  3. **Stomp:** a small slam with a marker.
- **The hook:** hitting the **cage** (from the air, or while it's stunned) frees one civilian per hit and costs it the bonus. Freeing all of them makes it break down for a while (big ×1.5 window). The Chain Hook rips the cage door open (frees everyone).
- **Drops:** its empty cage body: a **Walker** frame, or `e:walker`.

**Plays differently because:** your target isn't only the boss's HP; it's the people it's taking. Gives the civilian feature a reason to exist beyond squishing.

**Build (M):** depends on the civilians system (a civilian list with positions). `stepCollector`/`drawCollector`, cage contents drawn as small figures. Without civilians it can collect **heads** instead (a weaker but buildable fallback).

---

## 10. The Flooded Line — The Carriage Worm

**Score:** Fun 4 · Theme 4 · Variety 4 · Cost 3 · **Total 15** · Size **M**

**Biome.** A flooded subway station: tiled walls with a station name sign, flickering strip lights, a tunnel mouth at each end, water at ankle height with ripples. Palette: `#060a10` dark, `#1a2a2a` tiles, `#5ac8c8` water glints, `#ffe600` platform edge line, `#ff2a6d` tunnel signal.
Hazard: a **train** passes through the back lane (z 110–116) now and then in sections 2 and 4: signal turns red, horn, then a full-width hit in that lane. It hits robots too: lure them there.

**Sections.**
1. `scrap` x2, `lancer`.
2. `hound` x2, crate, train lane.
3. **Mini-boss:** big `guard` + `hound`.
4. `walker`, `brute`, `scrap`, crate, train lane.

**Boss: The Carriage Worm** (250 HP).
- **Silhouette:** a worm made of 4 subway carriages with a robot head (headlights for eyes) at the front. It enters from one tunnel and leaves through the other. Only part of it is on screen at once.
- **Attacks:**
  1. **Lane charge:** headlights flash on a lane (tell: a bright beam band along that lane for ~40 frames), then it charges across. Change lanes.
  2. **Coil:** circles the arena edge, then rears its head up and slams (marker).
  3. **Shed:** spits out robots from a carriage door (`scrap` or `lancer`).
- **Nesting (the hook):** each carriage is a layer: break the rear carriage's HP and it uncouples and becomes a big **crate** (2 hits, drops items) or an empty husk; the worm gets shorter and faster. The head is the core: once only the head is left it's a small fast duel (Maker core style).
- **Topple / heads:** a ticking head on the track derails it (topple: the head carriage lies on its side, ×1.5). The Chain Hook grabs the last carriage and stops it.
- **Drops:** the head carriage: a **Hound** body (it's long and low), or `e:hound`.

**Plays differently because:** a boss that crosses the full width of the street along depth lanes, and gets smaller as you break it.

**Build (M):** `stepWorm` with a segment array following a path (positions trail the head by fixed delays), `drawWorm` boxes per carriage. Train lane hazard: a timed strike across one lane. Backdrop block.

---

## 11. The Server Farm — The Puppeteer

**Score:** Fun 3 · Theme 5 · Variety 3 · Cost 3 · **Total 14** · Size **M**

**Biome.** A cold data hall: server racks with blinking lights, cable trays overhead, a cooling fan wall. Palette: `#04080e` dark, `#0e1a28` racks, `#3aff8a` / `#ff3a5a` LEDs, `#5ab0ff` cable glow.

**Sections.**
1. `scrap` x2, `shaman` (needs campaign behaviour).
2. `lancer` x2, crate.
3. **Mini-boss:** big `walker`.
4. `guard`, `hound`, `bomber`, crate.

**Boss: The Puppeteer** (200 HP).
- **Silhouette:** a floating server with a single eye-lens and dozens of cables hanging down like strings (Warden-like hover).
- **Attacks:** (1) **Strings:** it drops cables onto **empty husks** and walks them at you as puppet robots (they take a few hits and drop again). (2) **Static:** lightning rings (`bolt` strikes). (3) **Plug-in:** if you stand near a husk it plugs into *your* body: your controls reverse for 2 s unless you eject.
- **The hook:** husks are its army; climbing into them first or breaking them weakens it. Kicked heads cut strings and knock it down (Warden DOWNED rules). Chain Hook pulls it down.
- **Drops:** a wired-up **Walker frame**, or `e:walker`.

**Plays differently because:** the husk floor becomes enemy space. **Overlaps** with the Hermit Crab and the Surgeon; build at most one of the three husk bosses unless they're far apart in the campaign.

**Build (M):** Warden-like `stepPuppet`; puppet husks temporarily become `bw.ents` robots with low HP; string lines with `pline`.

---

## 12. The Giant's Graveyard — The Colossus Reborn

**Score:** Fun 3 · Theme 4 · Variety 2 · Cost 5 · **Total 14** · Size **S**

**Biome.** A valley full of dead giant robots: half-buried heads, ribcage-like hulls, swords stuck in the ground (the v5 Burial Waste had swords; this pushes that look into its own level). Dust storm haze. Palette: `#1a1008` sky, `#3a2a18` far wrecks, `#6a5a3a` dunes, `#c8a060` sun, `#ff2a6d` one red eye in the distance.

**Sections.**
1. `scrap` x2, `hound`.
2. `lancer` x2, `brute`, crate.
3. **Mini-boss:** two big `walker`s (a step up from the Foundry's two Brutes).
4. `guard`, `hound`, `walker`, crate.

**Boss: The Colossus Reborn** (260 HP).
- **Silhouette:** the existing Colossus (`drawBoss` without the Maker's antennae), rusted, with a cracked plate.
- **Attacks:** the existing fist slam (with "JUMP ON THE FIST"), floor sweep, and one new move: **wreck throw**, it pulls a dead robot out of the sand and throws it (a big crosshair strike that leaves a husk behind where it lands, so the arena fills with bodies to climb into).
- **Topple / heads:** all existing rules (hook, ticking heads, Flyer bombs, brace).
- **Drops:** the **Titan** frame: the Colossus code already does exactly this (`id:'titan'`). This fixes gamedesign §18's first gap.

**Plays differently because:** mostly it doesn't: it's a giant-on-the-back-line fight like the Maker. Its value is cost and the Titan.

**Build (S):** a STAGES entry with `['BOSS','colossus']`, `makeBoss` already falls through to 240 HP for it, the shared Maker code runs it. Add the wreck-throw state (~10 lines) and a backdrop block. Campaign test needs the colossus added to its boss list.

---

## 13. The Deep Quarry — The Drill Mole

**Score:** Fun 4 · Theme 3 · Variety 4 · Cost 2 · **Total 13** · Size **L**

**Biome.** An open-pit mine at dusk: terraced cliffs, a conveyor tower, dynamite crates, lamps on poles. Ground: packed dirt with rails crossing it diagonally. Palette: `#1a0c06` dark, `#5a2a14` cliffs, `#a85a2a` terraces, `#ffd84a` lamps, `#c0c0c0` rails.
Hazard: **minecarts** run along rails that cross the street at fixed x positions (a cart enters from the back and rolls toward the front). Carts hurt everything they hit, and a hit on a cart sends it the other way.

**Sections.**
1. `scrap` x3, carts.
2. `brute`, `lancer`, crate.
3. **Mini-boss:** big `brute` + `bomber`.
4. `walker`, `hound`, `guard`, crate, carts.

**Boss: The Drill Mole** (240 HP).
- **Silhouette:** a stubby robot mole with a nose drill and big digging claws.
- **Attacks:** (1) **Burrow:** dives under; a dirt mound follows you (invulnerable), then it bursts up under you (marker for the last 20 frames). (2) **Drill charge** along a lane. (3) **Rock throw** (strikes).
- **The hook:** while burrowed, its mound can be hit by a cart or a ticking head dropped on it: it pops up stunned (×1.5). Chain Hook pulls it out of the ground.
- **Drops:** a **Brute frame** with a drill (cosmetic) or `e:brute`.

**Plays differently because:** a boss you mostly can't hit until you set something up; carts are a new environmental weapon.

**Build (L):** carts are a new system (diagonal movement across depth, collisions with everything, reversing); burrow state needs an untargetable flag in `bossHit`. Highest cost here for moderate gain.

---

## 14. The Bell Tower — The Bellringer

**Score:** Fun 3 · Theme 2 · Variety 3 · Cost 4 · **Total 12** · Size **S–M**

**Biome.** A storm-lashed old town square at the foot of a bell tower: rain streaks, lightning silhouettes, gargoyles. Palette: `#06060e` dark, `#1a1a2a` stone, `#5a5a7a` rain, `#e8e8ff` lightning, `#c8a040` bronze.

**Sections.**
1. `scrap` x2, `lancer`.
2. `guard`, `hound`, crate.
3. **Mini-boss:** big `walker`.
4. `brute`, `shaman`, `scrap`, crate.

**Boss: The Bellringer** (220 HP).
- **Silhouette:** a hunched robot hanging from a huge bronze bell at the top of the screen.
- **Attacks:** (1) **Toll:** each ring sends a **shock ring** out across the floor from the centre (a growing ellipse; jump it). (2) **Drop:** lets go and falls onto you (marker), then climbs back up. (3) **Lightning rod:** storm strikes hit whoever is **tallest**: big bodies are punished, the core is safe.
- **The hook:** kicked heads hitting the bell make it ring itself and stun the ringer (Warden-style DOWNED).
- **Drops:** `e:guard` or a **Basic** frame.

**Plays differently because:** jump-timing rings are new, and "tallest gets struck" plays with body size. But it's thin on theme and close to the Warden.

**Build (S–M):** `stepBell`/`drawBell` plus a ring hazard (an expanding ellipse checked against player z/x and height).

---

## Suggested order if building several

1. Shared groundwork (S): campaign behaviour for **Bomber** and **Shaman**, `STAGES[i].intro` override, and optionally a per-boss reaction table.
2. **Hermit Harbour** (drops the Titan) between Pine Forest and Foundry.
3. **The Gullet Bog** between Burial Waste and Pine Forest.
4. **The Giant's Kitchen** once props and civilians from the parallel work are in, since they suit it best.

Each new level adds about 1,280 units of street and roughly 4–6 minutes of play, and adds a boss strategy plus time to the campaign test run (currently ~4 minutes).
