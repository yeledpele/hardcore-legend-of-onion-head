# HARDCORE: Legend of Onion Head — Game Design

Current build: **v5.0**. This document describes every mechanic and system in the build as it stands, from the main beat 'em up campaign to the older Classic mode kept alongside it.

---

## 1. Concept

A girl, Shelly, finds a broken robot head, Onion Head, buried in the dirt. She fixes it ("FIX FIX") and trains it ("TRAIN TRAIN TRAIN"). When a giant robot attacks, Onion Head reboots to avenge her and fights its way through a world of robots, climbing into bigger and bigger bodies as it goes. Shelly's fate is hinted at but never revealed; the ending finds a signal inside the Maker: S.H.E.L.L.Y.

**Design pillars**

- **Growth through layers.** Onion Head is a small core that nests inside bodies, and bodies can nest inside bigger bodies. Damage peels the layers off again.
- **Steal your enemy's body.** Beaten robots leave their empty shells behind. Anything bigger than you is a body you can take.
- **Every body plays differently.** Each body has its own size, speed, reach, weight and special power.
- **Readable brawling.** Many robots, but only two attack at a time; clear wind-ups and warnings before every hit.

---

## 2. Game modes

| Mode | What it is |
|---|---|
| **PLAY** (default) | A beat 'em up campaign: one continuous street through three levels, five sections each, with mini-bosses and bosses. |
| **CLASSIC** | The original prototype: an overhead map, battle prep, and one-on-one side-view duels. |

Choose on the title screen with Up and Down. PLAY plays the story intro first, then starts the campaign.

---

## 3. Controls

The game uses a two-button convention: **A** and **B**.

| Action | Keyboard | Touch | Gamepad |
|---|---|---|---|
| Move (left, right, and up/down in depth) | Arrows / WASD | D-pad | Stick / D-pad |
| Jump (A) | Z or Space | A | South / East button |
| Attack (B) | X | B | West button |
| Special (A and B together) | Z + X at the same time (also C or Shift) | A + B | Y |
| Climb into a body / Eject (Start) | Enter | START | Start |
| Language (English / Hebrew) | L | page button | — |

- Pressing A and B counts as a special only when both go down within a few frames of each other, so mashing attack and then jumping still jumps.
- Jumping cancels a punch combo.
- On touch screens the pad scales to fit narrow phones.

---

## 4. Onion Head, the core

- **The core:** a small cyan shell with one yellow eye, a sprout on top and two side nubs. Without a body it fights with a **knife**.
- **Lives:** 3 core pips to start, up to 5 with pickups. Losing all pips ends the run (SIGNAL LOST).
- **The bare core** is fast (speed 1.5) and stops instantly. It deals light damage (3), and its special is **Knife Throw**.
- **Hard to hit:** the core's hit box is narrow, short and thin in depth, so attacks miss it more often and a jump clears most low swings.
- **Eye moods:** curious, idle (half-lidded), angry (while attacking), hurt (X), and an occasional blink.
- **Side domes:** when the core rides a body, domes in that body's colour appear on its sides.

---

## 5. Bodies and nesting

### 5.1 The layer stack

The player is a stack of layers, listed from the inside out:

> core → body → body → …

- **Hits:** the outermost layer takes the damage. When its shell reaches 0 it breaks ("SHELL BREAK", or "LAYER LOST"), and you continue in the next layer down. With no layers left, hits cost core pips.
- **Eject:** press START to pop the outer layer off. It stays standing on the street as an empty body, keeping its remaining shell and any mounted weapon, and you hop out. You can eject at any time.
- **Climb in:** press START next to an empty body that is **bigger** than your current body to climb in. If you're already in a body, that body nests inside the new one.
- **Nesting is won from the Matryoshka.** Until the Matryoshka (the boss of level 1) is beaten, climbing in while in a body **swaps** bodies: the old one is left standing beside you as an empty body ("NESTING LOCKED: BEAT THE MATRYOSHKA", shown once). Beating it shows "NESTING UNLOCKED", and from then on climbing in nests. The unlock lasts for the rest of the campaign, continues included. (Classic mode is unchanged.)
- **Display:** the HUD shows the outer body's name and shell bar, plus the name of the layer inside it.
- **Look:** a nested body rides on the outer body's shoulders with its legs hidden inside, so only its torso shows (as in battle prep and Classic).

### 5.2 Size rule

You can climb only into a body bigger than the one you're in.

| Size | Bodies |
|---|---|
| 0 | Core |
| 1 | Basic frame, Scrapper, Lancer |
| 2 | Brute frame, Brute robot, Hound, Shieldbot, Maker's core, Doll |
| 3 | Walker frame, Walker robot, Flyer |
| 4 | Titan frame |

### 5.3 Where bodies come from

- **Beaten robots:** their heads pop off as they fall, and they leave **headless** empty bodies behind at about 70% shell. When Onion Head climbs in, the core takes the head's place.
- **A starter body:** an empty **Basic** frame lies near the start of the campaign.
- **Bosses** leave special frames behind:
  - the Matryoshka leaves the **Doll**,
  - the Warden leaves the **Flyer**.
- Empty bodies that scroll more than a screen behind you are cleaned up.

### 5.4 Body roster

| Body | Size | Shell | Damage | Speed | Special (A+B) | Notes |
|---|---|---|---|---|---|---|
| Core | 0 | — | 3 | 1.50 | Knife Throw | Small hit box; knife only |
| Basic frame | 1 | 40 | 4 | 1.25 | Power Glove | Light, responsive |
| Brute frame | 2 | 70 | 6 | 1.05 | Hammer of Might | Tall back slab, big fists |
| Walker frame | 3 | 100 | 8 | 1.15 | Shoulder Laser | Backward knees, long legs |
| Titan frame | 4 | 140 | 10 | 1.10 | Giant Sword | Heaviest; not dropped in the current campaign |
| Scrapper | 1 | ~39 | 4 | ~1.3 | Scrap Spin | |
| Lancer | 1 | 46 | 5 | ~1.5 | Spear Thrust | Long reach |
| Hound | 2 | 46 | 6 | ~1.7 | Pounce | Attack is a lunge; core rides at the front |
| Shieldbot | 2 | 60 | 6 | ~1.1 | Shield Bash | Takes half damage from the front |
| Brute robot | 2 | 64 | 7 | ~1.05 | Ground Pound | |
| Walker robot | 3 | 100 | 8 | ~1.14 | Rocket Launch | |
| Maker's core | 2 | 140 | 7 | ~1.7 | Scrap Spin | |
| Doll (from Matryoshka) | 2 | 70 | 6 | 1.15 | Lightning Call | |
| Flyer (from Warden) | 3 | 80 | 5 | 1.40 | Bomb Drop | Hovers; low attacks pass under it; hold A for a jetpack boost (5.5) |

Robot-body stats are worked out from the robot's own stats: damage is about 55% of the robot's damage, and speed is the robot's speed × 1.9, limited to between 0.95 and 1.7.

### 5.5 Weight and momentum

Each body speeds up and slows down at its own rate, both on the street and in Classic duels.

| Body | Acceleration | Friction (slide) |
|---|---|---|
| Core | 0.70 | 0.50 — stops instantly |
| Basic | 0.40 | 0.74 |
| Walker | 0.28 | 0.83 |
| Brute | 0.24 | 0.86 |
| Titan | 0.18 | 0.90 — long slides, skids when turning |
| Flyer | 0.18 | 0.95 — floaty |

Heavier bodies also jump slightly lower.

**The Flyer's jetpack:** tap A for a normal hop; keep holding A in the air to thrust upward (also to catch a fall), with flame puffs and an engine rumble. Fuel lasts about 70 frames (~1.2 s) of thrust and refills on the ground (1.5 per frame). The boost tops out at a height of 42, about 1.5× a normal jump, so the core stays clear of the HUD. Not during a dive or a special.

---

## 6. Combat (PLAY)

### 6.1 Space

- **The street:** a 2.5D street. You move left and right along it, and up and down within a strip of floor depth (z 110–138). Characters are drawn in depth order.
- **Jumps:** jumping adds height (h). Tapping jumps lower than holding; landing squashes the body briefly.
- **Floating platforms:** the Colossus's fist acts as a platform you can stand on. (This is legacy Colossus behaviour; the Matryoshka now replaces it as the level 1 boss.)

### 6.2 Attacks

| Move | Input | Effect |
|---|---|---|
| Combo | B, B, B | Jab, then cross (dazes), then a heavy launcher. Inputs are buffered, with a short window to chain. |
| Launcher | 3rd hit | Knocks the robot into the air (bosses resist) |
| Juggle | Air attacks on a launched robot | Keeps it in the air |
| Air attack | B in the air | Bigger hit box at height |
| Dive | Down + B in the air | Fast drop. A hit bounces you up ("POGO"); landing makes a shockwave. |
| Grab | Walk into a dazed robot | Picks it up |
| Throw | B while holding | The thrown robot knocks down every robot it hits |
| Lunge | B as a Hound | Dash forward; hits each robot once |

### 6.3 Hit boxes (size-based)

- Every body has a half-width, height and depth taken from its art.
- **Your attacks** must overlap the robot's body: big robots are easier to hit, and Hounds are long and low.
- **Robot attacks** must overlap your body and reach your height. Jumping or hovering clears low attacks.
- The bare core is the smallest target; big bodies fill more of the street.

### 6.4 Feedback

Hits use **hitstop** (a brief freeze, longer on heavy hits), screen shake, sparks, damage numbers, synthesized sound effects, and a white flash on the robot. Hit streaks show "N HITS", and score multiplies by streak length, up to ×10.

---

## 7. Specials and the POWER meter

- **The meter:** POWER runs from 0 to 100 and starts at 50. Landing a hit adds 5; beating a robot adds 12.
- **Cost:** a special costs **50**, except the Knife Throw, which costs 25. Without enough power you get "NO POWER".
- **The active item box:** the HUD's box shows the current special's icon with a vertical charge bar and a red mark at the cost.
- **Hint:** the first time you have enough power, a hint shows "A+B TOGETHER: SPECIAL".

| Special | Comes from | Effect |
|---|---|---|
| Knife Throw | Core | Throws a knife that dazes the first robot it hits |
| Power Glove | Basic | Rocket punch dash; heavy hit and launch |
| Hammer of Might | Brute | Raise, then a ground slam in front: area damage, launch, shockwave |
| Shoulder Laser | Walker | Beam across the whole screen in your lane |
| Giant Sword | Titan | Huge sweeping slash in front, partly behind you too |
| Scrap Spin | Scrapper, Maker's core | Spin hitting both sides repeatedly; you can steer it |
| Spear Thrust | Lancer | Long piercing thrust with a short lunge |
| Pounce | Hound | Leap that hits on the way down and lands with a shockwave |
| Shield Bash | Shieldbot | Charge that shoves robots and blocks all hits from the front while charging |
| Ground Pound | Brute robot | Slam centred on yourself |
| Rocket Launch | Walker robot | Rockets drop on the 3 nearest robots, with crosshair warnings |
| Lightning Call | Doll | Bolts strike the 3 nearest robots (or the boss) |
| Bomb Drop | Flyer | Glides forward dropping 3 bombs. Blasts launch robots, pop heads into the air, and topple giants. |
| Sword of Justice | Weapon | Long slash |
| Chain Hook | Weapon | See 9.4 |

**Weapons:** walking over a weapon pickup **mounts** it on your outer body. It replaces that body's own special, stays with the body if you eject, and is lost if that body breaks. A paper item card announces the weapon. The core alone can't mount weapons ("NEEDS A BODY").

---

## 8. Heads

- **Heads off:** beaten robots' heads pop off and land on the street as objects.
- **Kicking:** any hit kicks a head (punches, air attacks, dives, specials). A kicked head flies, spins, bounces and can be kicked again; it disappears after about 25 seconds.
- **Headshots:** a kicked head knocks down the first robot it hits ("HEADSHOT") and breaks crates.
- **Against bosses:**
  - The Colossus and Maker: heads bounce off ("CLANG") unless the boss is kneeling or toppled.
  - The Warden: kicked heads fly up and home in on it, knocking it out of the air ("DOWNED").
- **Ticking heads:** about one head in three is a bomb.
  - It has a lit fuse and a flashing eye, ticks faster as it runs down, and shows a countdown for the last two seconds.
  - After about 6 seconds it explodes, damaging robots, bosses **and you**, and setting off nearby ticking heads.
  - A kicked ticking head explodes on contact. At a giant's legs it topples the giant; at the Warden it knocks it down; at the Matryoshka it hits directly.
- **Hints:** "HIT A HEAD TO KICK IT" the first time, and "TICKING HEAD! KICK IT AWAY" when one is close.

---

## 9. Enemies

### 9.1 Robots

| Robot | HP\* | Damage\* | Behaviour |
|---|---|---|---|
| Scrapper | 30 | 7 | Basic melee rusher |
| Lancer | 46 | 9 | Long spear reach |
| Shieldbot | 60 | 10 | Blocks non-heavy hits from the front ("BLOCKED"); turns slowly |
| Hound | 46 | 11 | Low and long; the attack is a dash across the floor |
| Brute | 64 | 12 | Slow, heavy fist |
| Walker | 100 | 14 | Tall, long legs, hits hardest |

\*Base values. In the campaign, robot HP is ×0.7 and damage ×0.8, and both scale up 30% (HP) and 15% (damage) per level.

### 9.2 How robots fight

- **Attack tokens:** at most **two robots attack at once**; the rest hang back about 60–80 px away, at varied depths, and wait their turn. Roles are reassigned about every 40 frames, starting with the nearest robots.
- **Attack cycle:** walk → **wind-up** (an "!" over the head, a blinking yellow flash and a warning beep) → attack → recover. After recovering, a robot sometimes gives up its attack slot.
- **States:** walk, wind-up, attack, recover, dazed (stars), in the air (launched or thrown), down, held, dead.
- **Staying in reach:** once a robot has walked on screen, it stays on screen.
- **Knockback:** robots knock you back, briefly protect you from further hits, and cancel your attack or grab.

### 9.3 Mini-bosses

Section 3 of each level brings a "MINI BOSS" banner and enlarged robots marked with a skull:

| Level | Mini-boss |
|---|---|
| 1 | Big Brute |
| 2 | Big Walker |
| 3 | Two big Brutes |

Mini-boss HP is ×1.7, and they resist launches and daze.

### 9.4 Bosses (end of each level)

Every boss arena starts with a crate that always holds a **Chain Hook**.

**Level 1 — The Matryoshka Zombie** (255 HP)

- **Shells:** three nested shells, 110 / 85 / 60 HP. Break one and it splits in half; a smaller, faster doll climbs out ("ANOTHER ONE INSIDE", then "THE LAST DOLL").
- **Shamble and lurch:** it shambles toward you, rears back, lurches forward into a ground slam, then lies dazed (your hits do ×1.5).
- **Lightning:** it calls strikes on glowing rings around you: 2, then 3, then 4 strikes for each smaller doll. Hint: "LIGHTNING! KEEP MOVING".
- **Knockdown:** the Chain Hook, ticking heads and Flyer bombs knock it down.
- **Drop:** leaves the **Doll** frame.

**Level 2 — The Warden** (200 HP)

- **Movement:** a veiny eyeball that hovers out of reach and drifts around the screen.
- **Searchlight:** it tracks you. Stay in the light long enough and it winds up and fires a beam.
- **Bombs:** it drops walking bombs that chase you and arm when close. Hit a bomb (or a head) to kick it up at the Warden: it gets knocked down ("DOWNED") and can be beaten on the ground (×1.5 damage). Rockets and lightning reach it in the air at reduced damage.
- **Hook:** the Chain Hook pulls it straight down.
- **Drop:** leaves the **Flyer**.

**Levels 3–7: the new street bosses.** They all stand on the street and share one set of rules: hits from a toppled/dazed boss do ×1.5; a ticking-head blast or Flyer bomb near them deals 15 (or 60% of the bomb) and knocks them down; the Chain Hook has a special effect per boss; when beaten they flash for about 2 s and leave a body.

**Level 3 — The Wind-Up Knight** (240 HP, The Toy Works)

- **Look:** a tall tin knight with a lance, a red plume and a brass **key** turning in its back; a key gauge under its feet.
- **Facing:** hits from the **front** do ×0.5 ("CLANG"); hits from **behind** do ×1.5 and unwind the key by 11. The key also runs down slowly by itself.
- **Moves:** marches at you; **Lance charge** (key spins fast, lance lowers, ~42 frames) then charges across the screen (14 damage, smashes props); **Spin** with the lance out for ~2 s (10 per hit), then **dizzy** (×1.5).
- **Unwound:** at 0 the knight slumps ("UNWOUND") for about 3 s, then rewinds ("REWOUND"). The Chain Hook pulls the key out (long slump).
- **Drop:** a **Walker** frame ("ITS EMPTY ARMOUR: WALKER").
- **Level hazard:** conveyor belts in sections 2 and 4 push everyone left.

**Level 4 — The Hermit Crab** (200 HP, Hermit Harbour)

- **Look:** a wide pink crab wearing an empty robot body on its back as a shell (it starts in a Walker robot body); a shell gauge under it. Two empty bodies lie in the arena.
- **Shell:** while it wears one, hits go to the **shell** (front hits halved), not its health. When the shell breaks ("SHELL BREAK") it is soft (×1.5) and **scuttles to the nearest empty body on screen and climbs in** ("IT STEALS A SHELL") — including bodies you ejected. With no body around it digs up a Basic-size shell after about 5.5 s. Deny it by climbing into the bodies first.
- **Moves:** **Claw pinch** (claws spread, then a lunge): it **grabs** you, shakes you and throws you (12); mash B to break free sooner. **Sideways scuttle** across your lane (yellow lane dashes as a tell; 12, smashes props).
- **Hook:** rips the shell off at once ("HOOKED: SHELL OFF"); a topple flips it on its back.
- **Drop:** its dream shell, a **Titan** frame — the only source of the Titan in the campaign.

**Level 5 — The Crane** (230 HP, The Magnet Yard)

- **Look:** a gantry over the arena with an operator cab on the beam and a magnet on a cable.
- **Moves:** **Magnet slam** on your spot (red marker; 16) — afterwards the magnet is **stuck** on the floor for ~2 s and is the only part you can hit ("HIT THE MAGNET"). **Pull:** the magnet hums and everything metal within ~80 px **slides in along green field lines**: empty bodies, robots (held stunned while they slide), heads — and you, if you're in a body; **the bare core is too light**. **Freeze:** whatever it catches is **frozen to the magnet**. If that's you, you hang from it ("FROZEN TO THE MAGNET"): **mash A or B** (8 presses) to break free, or after ~2 s it slams you down (14) — and then the magnet is stuck, so you can punish it. A caught body, robot or head is carried over you and dropped (12; a ticking head explodes). **Scrap roll:** three crosshair strikes down your lane.
- **Topple:** the Chain Hook or a blast brings the **cab crashing to the floor** ("THE CAB CRASHES") for ~2.5 s, where it can be hit (×1.5); it also lets go of whatever it held.
- **Drop:** its **MAGNET** power ("ITS MAGNET: PUSH AND PULL"), a weapon pickup that mounts on your body:
  - **Special (A+B) = MAGNET PUSH:** an area blast (~80 px) that throws robots away (body damage +4, launched or shoved back), pushes empty bodies and heads away, and kicks bombs.
  - **Every 3rd hit of your combo = PULL:** yanks the nearest robot in front of you (up to ~120 px) to you, stunned; with no robot in reach it pulls the nearest empty body or head.
- Numbers in `FEEL.bosses` (crane…) and `FEEL.magnet`.

**Level 6 — The Toad King** (230 HP, The Gullet Bog) — a jelly cube you beat from the inside

- **Look:** a wobbling, see-through green **jelly cube** with the toad's face and crown floating inside it, and a pulsing magenta **nucleus**. Whatever it has swallowed shows inside it, dissolving.
- **Outside hits barely hurt it** ("BOING", 10%); blasts do 20%. This is the boss where you're meant to lose your bodies.
- **Engulf:** it **slides over you** and engulfs you ("IT ENGULFS YOU"); it also engulfs and digests robots it slides into, and smashes props. Its belly flop engulfs you if it lands on you.
- **Inside:** your **B hits on the nucleus** are the real way to kill it: your body's damage ×1.5 per hit, at most one every 10 frames — bigger bodies hit harder. Every ~3 s the jelly **digests your outermost body** ("DIGESTED", gone for good). When the last one dissolves it **spits out the bare core** ("SPAT OUT"). **A+B bursts out** early and keeps the bodies you still have.
- **Supply:** the arena starts with two empty bodies (a Brute robot and a Scrapper), and its **croak** spits out Scrappers you can beat for more — climb in and dive back in.
- **Other moves:** **belly flop** (leaps, marker follows you, shockwave 14, then lies dazed).
- **Hook / blasts:** knock it dazed ("BURP"); if you're inside, you pop out free.
- **Drop:** a **Brute** frame ("IT COUGHS UP A BRUTE FRAME").
- **Level hazard:** mud patches slow you and robots to about half speed.
- Numbers in `FEEL.bosses` (toad…).

**Level 7 — The Cook** (280 HP, The Giant's Kitchen)

- **Look:** you're tiny on a giant's kitchen floor; only two huge gloved hands come down from above (one holding a pan, one a knife), and its face peers in over the top when the pan is down.
- **Moves:** **Pan slam** on your spot (red marker; 16): the pan stays on the floor for ~3 s as a **platform** ("JUMP ON THE PAN") while the face peers in — from the pan your hits reach the **face for ×2**. The pan hand on the floor can also be hit. **Knife chops:** three chops walking along your lane (12 each); the knife hand is hittable for a moment after each chop. **Pepper:** crosshair strikes around you ("PEPPER").
- **Topple / hook:** knocks the pan hand flat ("THE HAND IS DOWN"), hittable at ×1.5.
- **Drop:** a **Walker** frame ("IN ITS SLEEVE: A WALKER FRAME").

**Level 8 — The Maker** (300 HP)

- **Moves:** a giant at the back of the street.
  - **Fist slam:** aimed at your spot, with a red floor marker. After a slam it **kneels** with its core plate glowing, and can be hit.
  - **Floor sweep:** jump over it.
  - **Missile rain:** crosshair strikes around you ("INCOMING").
- **Head hits:** while it kneels, air hits count as head hits (×2).
- **Second phase:** at half health its shell cracks and **its core ejects** ("IT EJECTED"); you finish it as a duel against the Maker's core with a Walker beside it. Beating the core plays the ending.

**The topple (bosses without jumping)**

- **What it does:** knocks the Colossus or Maker over. Its head lies on the floor in front of it for 2.5 s, and ground hits on the head do ×1.5 damage ("ITS HEAD IS DOWN: HIT IT").
- **What causes it:** a Chain Hook pull, a ticking-head blast, or a Flyer bomb at its feet.
- **Brace:** after getting up it **braces** for about 7 s ("IT BRACES ITSELF") and can't be toppled again during that time.
- **On the Matryoshka:** a topple knocks it down instead.

**Chain Hook**

Fires a chain down your lane (reach about 130). It topples the Colossus or Maker, pulls the Warden down, or drags the nearest robot to you, dazed and ready to grab.

*(The Colossus, the original level 1 giant, still exists in code and shares the Maker's moves. It used to leave a Titan frame.)*

---

## 10. Pickups and crates

- **Crates:** take 3 hits (2 in boss arenas). Each drop is either:
  - a **weapon** (40%): Sword of Justice, Hammer of Might, Shoulder Laser, Rocket Launch or Chain Hook,
  - a **core cell** (about 25%),
  - or **scrap** (about 35%).
- **Core cell:** +1 core pip (up to 5).
- **Scrap:** +20 shell on your outer body, or +1 core pip if you have no body.
- **Robot drops:** beaten robots sometimes drop scrap (25%).
- **Collecting:** walk over a pickup while on the ground.

### 10.1 Destructible props

Every fight section (not boss arenas) has 2–3 props for its level, placed the same way on every retry. Any attack, special, bomb, rocket or thrown robot can break them; walker-size bodies and bigger smash them just by walking into them. A prop flashes when hit, shows damage at half health, and breaks into debris that leaves rubble on the floor.

| Prop | Levels | Hits | Drop chance | Score | Notes |
|---|---|---|---|---|---|
| Car wreck | Burial Waste | 6 | 60% | 80 | Window cracks when damaged |
| Bin | Burial Waste | 2 | 35% | 30 | Lid flies off |
| Barrel | Burial Waste, Foundry | 2 | – | 40 | **Explodes**: 14 damage to robots and 9 to props within ~26 px (chain reactions), 8 to you if you're close, flattens civilians |
| Pine | Pine Forest | 3 | 15% | 40 | Leans when damaged |
| Fence | Pine Forest | 1 | – | 20 | |
| Lamp post | Pine Forest, Foundry | 2 | 10% | 30 | Flickers when damaged |
| Tank | Foundry, Magnet Yard | 4 | 40% | 60 | Leaks steam when damaged |
| Toy blocks | Toy Works | 2 | 30% | 30 | Top block falls off |
| Crab pot | Hermit Harbour | 2 | 40% | 30 | |
| Car cube | Magnet Yard | 4 | 50% | 50 | Cracks |
| Soup can | Giant's Kitchen | 3 | 40% | 40 | Dents |
| Sugar cube | Giant's Kitchen | 2 | 50% | 30 | A corner breaks off |

Per level: Toy Works blocks, bins, lamps; Hermit Harbour pots, barrels, fences; Magnet Yard cubes, barrels, tanks; Gullet Bog pines, fences, barrels; Giant's Kitchen cans, sugar cubes, bins.

Drops are scrap (70%) or a core cell (30%).

### 10.2 Civilians

Small people walk around every section (2–3; one in boss arenas), and more run across the street now and then (up to 4 at a time).
- **Panic:** when you or a robot gets close (or a fight is on), they scream ("AAH!", "HELP!") and run away from the nearest danger, and leave the screen.
- **Squish:** bodies of Brute size or bigger flatten them by walking over them; any body flattens them by landing on them; the bare core is too small. Thrown or falling robots, big robots walking, and barrel blasts flatten them too. Attacks pass over them.
- **Cartoon flat:** a squished civilian lies flat for about 2 seconds, then peels up, wobbles dizzy, and runs off. "SQUISH" scores 25 and adds 3 POWER.

---

## 11. Campaign structure (PLAY)

- **One street:** eight levels laid end to end, each 1,280 units long and made of five 256-unit sections. The Matryoshka stays first (it unlocks nesting) and the Maker last (it plays the ending).

| Level | Theme | Sections 1–5 |
|---|---|---|
| 1 The Burial Waste | Brick basement with gravestones | Scrappers → Scrapper/Lancer + crate → **mini-boss Brute** → mixed + crate → **Matryoshka** |
| 2 The Pine Forest | Mossy cave with pines | Shieldbot/Scrapper → Hounds + crate → **mini-boss Walker** → mixed + crate → **Warden** |
| 3 The Toy Works | Toy shelves, a mobile, a rocking horse; conveyor belts (sections 2, 4) | Scrappers/Lancer → Hounds + crate → **mini-boss Shieldbot** → Brute/Walker/Scrapper + crate → **Wind-Up Knight** |
| 4 Hermit Harbour | Night harbour, moon over the water, pier, lighthouse | Scrappers/Lancer → Hounds + crate → **mini-boss Shieldbot** → Brute/Walker/Lancer + crate → **Hermit Crab** |
| 5 The Magnet Yard | Stacks of crushed car cubes, sodium lamps | Scrappers → Lancer/Walker + crate → **mini-boss Brute** → Walker/Shieldbot/Scrapper + crate → **Crane** |
| 6 The Gullet Bog | Swamp of drowned machines, reeds, fireflies; mud patches | Scrappers → Hounds + crate → **mini-boss Brute** → Shieldbot/Walker/Hound + crate → **Toad King** |
| 7 The Giant's Kitchen | Table and chair legs as pillars, a cat's eye, tiled floor | Scrappers/Lancer → Hounds + crate → **mini-boss Walker** → Brutes/Lancer + crate → **Cook** |
| 8 The Foundry | Red brick foundry, pipes, furnaces | Hound/Brute → Shieldbots/Lancer + crate → **two mini-boss Brutes** → Walker/Hound + crate → **Maker** |

- **Difficulty:** robot health and damage scale with a difficulty tier: levels 1–2 as before (tier 0, 1), then rising evenly to tier 2 at the Foundry (health ×(1 + 0.3 × tier), damage ×(1 + 0.15 × tier)).
- **Story:** each level's banner has its own four lines, chaining from the boss before.

- **Section locks:** the camera locks until a section is clear, then "GO" lets you walk on. The camera follows you to the next lock.
- **Seamless levels:** walking off the end of a level leads straight into the next; the backdrop changes at the seam. Each level opens with a paper banner: level number, name, and its story lines.
- **Retry:** losing all cores shows SIGNAL LOST. A retries the current section as the bare core with **half your score**; B returns to the title.
- **Ending:** beating the Maker's core plays the ending: "King of Robots", with the S.H.E.L.L.Y signal.
- **Score:** hits score 10 × streak (up to ×10); robots 150; bosses 1,000 as they fall plus 3,000 when they finish dying; crates 50.

---

## 12. HUD and interface

**Top left**

- **Special:** a magenta label box with the special's icon, a power bar beneath it (with a cost mark, flashing when ready), and the special's name.
- **Cores:** flat mini-cores show your core pips.
- **Body:** the outer body's name and a mint shell bar (pink when low), plus "+ inner body".

**Top right:** the score, and a magenta label with level and section (e.g. "2-3").

**Bottom of the screen**

- **Boss bar:** a flat pink bar with the boss's name. A slimmer bar shows the last robot you hit.
- **Hints:** plain white text, chosen by context.

**Panels and banners**

- **Level banner:** a black band with a magenta number label, the level name in big pink letters, and its story line.
- **Item cards:** a magenta-outlined label with an icon, name and special, shown when you mount a weapon or climb into a body.
- **Screen messages:** banners (FIGHT, BOSS, MINI BOSS, EJECT, SHELL BREAK) in big chunky letters, and floating words for hits and events.

**Markers:** yellow "\ | /" ticks mark the empty body you can climb into. Empty bodies show their remaining shell, and mini-bosses wear a magenta badge.

## 13. Localization

- **Languages:** full English and Hebrew. Switch with L, the page button, or `?lang=he` in the address; the choice is remembered in localStorage.
- **Hebrew text:** uses a custom Hebrew pixel font with right-to-left reordering.
- **Translation:** a dictionary covers the story, menus, robots, bodies, specials, levels, hints and banners.

---

## 14. Art direction (v5.0)

- **Language:** flat colour shapes, after the deck's silhouettes and simple flat comics. No outlines, shading or gradients.
- **Rendering:** vector at 4× resolution (1024 × 576) on the 256 × 144 game grid.
- **Palette (six colours):**

| Colour | Used for |
|---|---|
| Plum-black | Backgrounds |
| Mint | Onion Head's frames, the ground slab |
| Pale mint | The core |
| Soft pink | Robots and bosses |
| White | Cut-out marks, eyes, motion strokes |
| Magenta | UI label boxes |

  A touch of yellow appears for power, lightning and warnings.
- **Characters:**
  - **Frames:** deck silhouettes built from flat blocks: a lid, arm blocks with finger pegs, separate legs, and white triangle or pentagon chest cut-outs.
  - **The core:** as drawn on the deck: square box, ring eye, three-line sprout with a magenta tip, side sticks.
  - **Robots:** soft pink with stripe segments and a white dot eye, like the worm.
- **Bosses:**
  - **The Matryoshka Zombie** is **hexagonal**, in flat hex pieces.
  - The Warden is a striped pink eye-orb with a searchlight.
  - The Maker is a flat pink giant with a white pentagon.
- **Animation:**
  - squash and stretch on jumps and landings,
  - idle breathing,
  - curved motion strokes behind moving bodies, like the wriggling worm,
  - the deck's "\ | /" ticks for wind-ups and surprise,
  - ring-and-tick hit bursts,
  - blinking eyes, a swaying sprout, and flapping Flyer wings.
- **Screens:** black panels like the comic:
  - a big pink HARD / CORE title with "▸ PLAY ◂",
  - a "FOUND BURIED" story panel,
  - GAME OVER,
  - the ending with the King silhouette: "KING OF ROBOTS / MONSTER KILLER".
- **Levels:** flat silhouette strips on a mint ground slab:
  - giant swords and slabs (Burial Waste),
  - pines and a moon (Pine Forest),
  - stacks and smoke (Foundry).
- **Type:** chunky Silkscreen; Hebrew in Secular One with true right-to-left text.
- **Classic mode** keeps the v1.13 pixel look. Earlier styles are archived: v2.0 (green mech pixel art), v3.0 (Isaac-style vector art) and v4.0 (v1.13 pixel art).

## 15. Audio

- **Synthesis:** all sound is generated with the Web Audio API, with no audio files. Audio starts on the first input.
- **Sounds:** beeps for UI, jumps, hits, wind-ups and pickups; noise "crunches" for impacts; falling and rising sweeps for specials, explosions and bosses.
- **Ticking heads** tick faster as the fuse runs out.

---

## 16. Classic mode systems

**Overworld map** (overhead, per level)

- Walk into a robot to fight it.
- **Parking:** press B (X) to step out and **park** your frame. The bare core is faster and fits through vents, but any fight it starts is fought as the core. Walk back into the frame to climb in again.
- **Gated pockets**, each with a reward inside:

| Gate | Opens with |
|---|---|
| Vent | Bare core only |
| Cracked wall | Hammer of Might |
| Glyph door | Shoulder Laser |
| Deep water | Walker or Titan |
| Chasm | Jet Booster |

- **Rewards:** core cells, parts, and three chalk-storyboard memories of Shelly.
- **Rig panel:** opened with Start; shows core cells and memories found.

**Battle prep**

- Choose your frame, a **nested** frame, and parts for the frame's slots.
- Any second frame can be nested; the bigger one always goes outside.

**Frames (Classic)**

| Frame | Shell | Damage | Slots |
|---|---|---|---|
| Basic | 40 | 4 | 1 |
| Brute | 70 | 6 | 2 |
| Walker | 100 | 8 | 3 |
| Titan | 140 | 10 | 4 |

**Parts**

| Part | Type | Effect |
|---|---|---|
| Power Glove | Passive | +3 punch |
| Armor Plate | Passive | +30 shell |
| Heart Shield | Passive | Easier parry |
| Spare Core | Passive | +1 core |
| Jet Booster | Passive | Double jump |
| Sword of Justice | Special | Long reach |
| Hammer of Might | Special | Heavy smash |
| Shoulder Laser | Special | Ranged shot |
| Rocket Launch | Special | Sky strike |
| Giant Sword | Special | Colossal slash |

**Duels** (side view)

- **Attacking:** B B B combo with a launcher and juggles; hold B to charge a heavy strike; Down + B in the air to dive and pogo; air attacks; Up for the special.
- **Defending:** hold Down to guard, with a parry.
- **Ejecting:** double-tap Down to eject at any time. The eject peels the nested layer first; the frame you leave behind is recovered after a win.
- **Shell break:** scatters the frame into debris and loses a part.
- **Jumping:** buffered presses, coyote time, and variable height.

**Classic enemies:** the campaign robots plus the Shaman (floating orbs, blinks) and the Bomber (drops walking bombs you kick back).

**Classic bosses**

- Colossus and Maker: climbable, with ledges created by their slams; the Maker adds missile rain and ejects its core.
- Warden: searchlight and dropped bombs.
- Frame 04 Titan reward.

**Classic progression:** three levels with checkpoints and a salvage screen after each fight (frames, parts, memories). Rewards include:

- the Brute frame, from the Brute,
- the Jet Booster, from the Warden,
- the Titan frame and Giant Sword, from the Colossus.

---

## 17. Technical architecture

- **One self-contained HTML file.** All art is procedural (flat vector in PLAY, pixel in Classic) and all sound is synthesized. Nothing is loaded except Google Fonts.
- **Fixed-step loop** at 60 × `FEEL.game.speed` updates per second (0.85 → 51 a second), at most 4 updates per frame. The game speed slows everything evenly, in both modes.
- **Feel file:** `src/feel.js` (`FEEL`) holds the PLAY tuning numbers; the game reads it live.
- **State machine:** `title, intro, brawl, bover, ending` (PLAY) and `map, prep, memory, fight, result, dead` (Classic).
- **Rendering:**
  - PLAY: a flat vector renderer on a 1024 × 576 canvas with pre-drawn level strips, about 0.6 ms per frame.
  - Classic: the 256 × 144 pixel buffer with an RGB-split glitch effect and scanlines.
  - The v3.0 Isaac-style renderer is still in the file but switched off.
- **Input:** keyboard, touch pad (multi-touch, so A+B works) and gamepad polling. Single presses and held buttons are tracked separately.
- **Saving:** none between sessions. Only the language choice is remembered.
- **Versions:** every build is archived in `versions/` (v1.0 to v5.0), with `CHANGELOG.md` and a `PLAN-vX.md` file for each major change.

---

## 18. Known gaps and next candidates

- The Titan frame can't be obtained in the campaign since the Colossus was replaced by the Matryoshka.
- Only the outer two layers of a stack are drawn.
- The Shaman and Bomber appear only in Classic.
- There is no save system and no difficulty setting; bosses haven't been tuned by human play-testing.
- Shelly's fate is left open after the S.H.E.L.L.Y signal.
