# HARDCORE: Legend of Onion Head — changelog

Each version is a complete, standalone HTML file in this folder. The live artifact always runs the newest one.

## v4.2 (in progress)
Built on v4.1.
- **Nested bodies hide their legs**: a body nested on another (a Scrapper on a Brute, a frame on a frame) rides on its shoulders with only the torso showing, in the beat 'em up, Classic, and battle prep.
- **Nesting is won from the Matryoshka**: before it falls, climbing into a bigger body swaps bodies and leaves the old one standing; beating it shows "NESTING UNLOCKED".
- **The Flyer has a jetpack**: hold A in the air for an upward boost with flames from both thrusters; fuel for about 1.2 s, refilled on the ground.
- **Civilians**: small people stroll each section, panic and flee when fights come close, and get squished flat (cartoon-style, then dizzy) by big bodies, landings, thrown robots and blasts.
- **Destructible props**: each level has its own breakable props (car wrecks, bins, barrels; pines, fences, lamps; tanks, barrels, lamps) that crack, burst into debris and rubble, and sometimes drop pickups; barrels explode and chain; walker-size bodies smash props by walking through them.
- **Five new levels** (proposed by the new level-designer agent, picked from 14), between the Pine Forest and the Foundry, each with its own backdrop, floor, props, story lines and boss:
  - **The Toy Works / The Wind-Up Knight**: hit the key on its back; lance charge and spin; conveyor belts. Drops a Walker frame.
  - **Hermit Harbour / The Hermit Crab**: wears empty bodies as shells and steals new ones off the street; claw grab, sideways scuttle. Drops the Titan frame.
  - **The Magnet Yard / The Crane**: magnet slam, lift-and-drop of bodies, heads and you (the bare core is too light); the cab topples. Drops a Brute robot body.
  - **The Gullet Bog / The Toad King**: swallows you and digests your outer body unless you burst out; belly flop, croaks up Scrappers; mud. Drops a Brute frame.
  - **The Giant's Kitchen / The Cook**: two giant hands; jump on the slammed pan to hit the face; knife chops, pepper. Drops a Walker frame.
- Difficulty now rises evenly over eight levels, ending where the old level 3 was.
- New bosses share one framework (`NB` table): one entry per boss for hits, topple, ticking heads, Flyer bombs and the Chain Hook.
- **Feel file** (`src/feel.js`, branch `dev-tools`): ~80 tuning numbers for the PLAY campaign moved out of the code into one commented file (movement, weight, jump, jetpack, combat timing and damage, POWER, robots, difficulty, bosses, civilians, barrels, hazards). Same values, same game.
- **Controller support** (branch `controller`): any connected pad; B / Circle and Space now jump in the campaign (they did nothing before); Y, LB or RB fire the special; Back switches language; "CONTROLLER CONNECTED" message; rumble on big hits, slams and explosions (strength in the feel file); controller line in the key legend (English and Hebrew).
- **Boss revisions** (branch `boss-revisions`, after Ben's notes):
  - **The Toad King is a jelly cube you beat from the inside:** outside hits barely hurt; it slides over you and engulfs you; inside, hit its nucleus while it digests your bodies one by one; at the bare core it spits you out; A+B bursts out. No more tongue.
  - **The Crane's pull and freeze:** stronger pull along visible field lines; what it catches is frozen to the magnet, including you (mash A/B to break free, or get slammed down).
  - **The Crane drops the MAGNET power:** special = MAGNET PUSH (area blast), every 3rd combo hit = PULL.
- **The Giant's Kitchen cat:** the dark "face" in the backdrop is now a proper cat (ears, slit eyes, nose, whiskers) that blinks, twitches an ear and flicks its tail.
- **Slower overall:** a master game speed (`FEEL.game.speed`, now 0.85) slows everything evenly, about 15% calmer than before.

## v4.1
Built on v4.0 (the v1.13 pixel look), as a branch beside v5.0.
- **The v1 knife is back**: a jab, a low slash and an overhead chop, each with its own pose, a little lunge and a slash trail; v1's walking feet with toes, and tucked legs in the air.
- **Squarer, sharper shapes**: Onion Head's core is a square 8×8 shell with a square ring eye (magenta when angry) and square side nubs; robots have square heads with square eyes and pupils; the Hound has a square head; popped heads are square.
- **Better animation**:
  - a crouch before every jump, a stretch on the way up, a squash on landing (core and bodies);
  - dust on take-off, landing (more for big bodies), running, skidding when you turn, and when robots hit the floor;
  - speed lines behind frame punches (an upward smear on the launcher);
  - idle breathing on robots, frames and the bare core;
  - the deck's "\ | /" ticks for wind-ups (robots and Hound) instead of "!";
  - a burst where a robot's head pops off.
- Play-tested: full campaign to the ending, all 15 specials, touch A/B/A+B on a phone-width screen, Hebrew, Classic, blocked gamepad access.

Files: `hardcore_v4.1.html`

## v5.0
A new design language: flat colour shapes, after Ben's deck silhouettes and flat comics ("Worm RPG").
- **Flat only**: no outlines, shading or gradients; six colours: plum-black, mint (Onion Head and frames), pale mint core, soft pink robots, white marks, magenta UI, a touch of yellow.
- **Deck silhouettes**: frames as flat mint blocks with the lid, finger pegs and white triangle or pentagon cut-outs; the core as on the deck (square box, ring eye, three-line sprout with a magenta tip, side sticks).
- **Robots** in soft pink with stripe segments and a white dot eye, like the worm; empty bodies flat grey-plum.
- **Bosses**: the hexagonal Matryoshka in flat hex pieces, the Warden as a striped pink eye-orb with a searchlight, the Maker as a flat pink giant with a white pentagon.
- **Animation**: squash and stretch on jumps and landings, idle breathing, worm-style curved motion strokes behind moving bodies, the deck's "\ | /" ticks for wind-ups and surprise, ring-and-tick hit bursts, blinking eyes, swaying sprout, flapping Flyer wings.
- **Screens**: black panels like the comic: big pink HARD / CORE title with "▸ PLAY ◂", a "FOUND BURIED" story panel, GAME OVER, and an ending with the King silhouette, "KING OF ROBOTS / MONSTER KILLER".
- **HUD**: flat mini-cores, mint shell bar, magenta label box for the special with a power bar, level and section in a magenta label ("2-3"), pink boss bar, magenta item-card labels.
- **Levels**: flat silhouette strips: giant swords and slabs (Burial Waste), flat pines and a moon (Pine Forest), stacks and smoke (Foundry), all on the mint ground slab.
- All gameplay kept; Classic keeps the v1.13 pixel look. Draws in about 0.6 ms per frame.

Files: `hardcore_v5.0.html`

## v4.0
The v1.13 look, with everything the game gained since.
- **Art**: the v1.13 pixel style is back: deck-style flat teal frames with the lid, finger pegs and chest triangle; magenta robots; the neon city, forest and foundry backdrops; the pixel HUD and fonts. The v3.0 vector renderer is switched off (its code stays dormant).
- **Gameplay**: everything in `gamedesign.md` is kept: the beat 'em up campaign, eject at any time, climbing into beaten robots and nesting, A/B controls with A+B specials, size-based hit boxes, the POWER meter and 15 specials and weapons, kickable and ticking heads, mini-bosses, the Matryoshka, the Warden, the Maker, topple and the Chain Hook, the Flyer and the Doll.
- **The Matryoshka Zombie is hexagonal**: hex head, hex body with a seam where the halves split, hex face and hex apron. Its three nested shells, lightning and lurch are unchanged.
- **Item cards** (weapon pickups, climbing into a body) are drawn as pixel panels.
- Play-tested: full scripted campaign to the ending, every special against a dummy, the Matryoshka beaten with no jumping, touch A/B/A+B on a phone-width screen, Hebrew, Classic, and blocked gamepad access.

Files: `hardcore_v4.0.html`

## v3.0
A new design language, in the manner of The Binding of Isaac (Edmund McMillen's Flash-era vector art), replacing the v2.0 pixel look.
- **Vector at 4x**: smooth shapes in game units, heavy near-black outlines, rounded chubby forms, one cel-shade band on the bottom-right of every shape and a white highlight blob.
- **Onion Head's core** keeps its design: cyan shell, yellow eye with moods, sprout with a pink bud, side nubs; side domes appear when it rides a body.
- **Frames** in bone-coloured metal with rivets, stitched seams, stripes and chunky fists; **robots** fleshy pink with one big staring eye, stitched mouths and antennae; Hounds with teeth; Shieldbots carry a heart shield; empty bodies grey.
- **Bosses**: the Matryoshka zombie doll (X eye, stitched mouth, flowered apron), the Warden as a veiny eyeball with a searchlight, the gold Maker with a stitched mouth and glowing core plate.
- **Isaac touches**: round bombs with fuses, cartoon explosions, item icons for every special and weapon, crates with bolts.
- **UI**: torn paper notes with push pins (title, story, level cards, game over, ending, item cards when you pick up a weapon or climb into a body); active item box with a charge bar for your special; core pips as little cores; red-and-black boss bar with a skull at the bottom.
- **Levels** as basement rooms: brick wall with gravestones (Burial Waste), mossy cave with pines (Pine Forest), red brick foundry with pipes and furnaces (Foundry); stones, cracks, shadows and a dark vignette.
- **Text**: chunky bold Silkscreen; Hebrew in Secular One with true right-to-left layout.
- Title, story intro, PLAY, game over and ending are vector; CLASSIC keeps the pixel renderer. About 58 fps, 1-3 ms per frame.

Files: `hardcore_v3.0.html`

## v2.0
New pixel art, after the green mech reference. Onion Head's core (cyan shell, sprout, eye moods) is unchanged.
- **One part style everywhere**: navy outlines with rounded corners, flat fills with a light top row and a shaded bottom row, blue-steel plus-bolts, slits, yellow warning stripes, and the white-and-maroon chest detail.
- **Rigs rebuilt from parts** for every frame and robot: back leg and arm in shade, pelvis with bolts, torso with collar and chest panel, front shoulder, segmented arm with blocky forearm and fist, and legs as thigh, knee joint, shin and wide foot.
  - Brute: tall back slab, big fists, stripes. Walker: backward knees, stripes. Titan and King: tall slab with a vent window, chest stripe.
  - Longer legs on the frames and on Scrappers and Brutes.
- **Palettes**: your frames olive green (the reference), robots rust-magenta, the Maker gold, empty bodies grey, white hit flash, yellow wind-up flash.
- **Robot heads** like the reference's: rounded box, yellow band, white eye.
- **Flyer** redrawn as an armoured hover pod with engine nacelles. The core's side domes take the colour of the body it rides; map and battle-prep sprites switched to the new green.

Files: `hardcore_v2.0.html`

## v1.13
Level 1 boss replaced: the **MATRYOSHKA ZOMBIE** (instead of the Colossus).
- Walking size, not a giant: a nested-doll robot with a zombie face (stitched eye and mouth), headscarf and painted apron.
- **Three shells**: break one and it splits in half; a smaller, faster, angrier doll climbs out ("ANOTHER ONE INSIDE", "THE LAST DOLL").
- **Zombie moves**: shambles toward you, winds up and lurches forward into a ground slam, then lies dazed (hits do 1.5x).
- **Lightning**: calls strikes on glowing rings marked on the floor around you; more strikes with each smaller doll. Keep moving.
- No jumping needed. The Chain Hook, bomb heads and the Flyer's bombs knock it down.
- **Drops the DOLL frame** (size 2, not a Titan): its special, LIGHTNING CALL, strikes the three nearest robots (or the boss).

Files: `hardcore_v1.13.html`

## v1.12
- **The Warden drops the FLYER**, a hovering frame built from its shell (it replaces the Walker it used to leave).
  - Floats above the street: low attacks like the Hounds' lunges pass underneath. Light and floaty to steer.
  - Special (A+B): **BOMB DROP**, a run of three bombs dropped ahead as it glides forward. Blasts launch robots, pop heads into the air and topple the Colossus or Maker when they land at its feet.
  - Size 3: climb in from the core or any smaller body; your current body nests inside.
- English and Hebrew.

Files: `hardcore_v1.12.html`

## v1.11.1
Back to the A/B convention.
- **A** jump, **B** attack, **A + B pressed together** special (a forgiving window for two thumbs). START climbs in or ejects.
- Removed the SP touch button: it pushed the A button off the edge of narrow phone screens, so there was no jump.
- Touch controls scale to fit any phone width. A hint teaches A+B the first time you have enough power.
- (C/Shift on a keyboard and Y on a gamepad still fire the special as extras.)

Files: `hardcore_v1.11.1.html`

## v1.11
- **Ticking heads**: about one beaten robot in three drops a bomb head (lit fuse, flashing face, countdown, faster ticking near the end). The blast hurts robots, bosses and you. A kicked ticking head explodes on contact.
- **Beat bosses without jumping: topple.** A blast at a giant's legs, or a Chain Hook pull, topples the Colossus or Maker; its head lies on the floor in front and ground hits on it do 1.5x damage. After getting up it braces itself for about 7 seconds.
- **Chain Hook** (new weapon/special): fires a chain down your lane. Topples giants, pulls the Warden out of the air, drags robots to you dazed. Every boss arena has a crate that holds one; other crates can drop it too.
- Hints and all new text in English and Hebrew.

Files: `hardcore_v1.11.html`

## v1.10
Kickable heads, like the Warden's bombs.
- A beaten robot's head pops off and lands on the street. Any hit kicks it: punches, air attacks, dives and specials.
- A kicked head flies, bounces and can be kicked again. It knocks down the robot it hits ("HEADSHOT") and breaks crates.
- Against the Colossus and Maker it clangs off unless they kneel; at the Warden it homes up like the bombs and knocks it out of the air.
- A hint shows the first time a head lies on the ground. English and Hebrew.

Files: `hardcore_v1.10.html`

## v1.9
- **Heads off**: a beaten robot's head pops off as it falls; the body it leaves behind is headless.
- **Onion Head is the new head**: when the core climbs into a robot body it sits where the head was (at the front on a Hound).
- **Jump fix** (boss fights were unplayable): holding or mashing attack no longer turns a jump into the A+B special; both buttons must be pressed together. Jumping also cancels a punch combo.

Files: `hardcore_v1.9.html`

## v1.8
- **Hit boxes depend on size.** Every body, yours and the robots', has a width, height and depth taken from its art. Robot attacks have to overlap your body; big robots are easier to hit and big bodies fill more of the street.
- **The bare core is harder to hit**: narrow, short and thin in depth, and jumping clears most low attacks.
- **Bosses are back** at the end of each level:
  - **Colossus**: a fist slam aimed at you (shadow on the floor) and a floor sweep you jump. After a slam it kneels and its core can be hit; jump onto the fist and strike from the air for double damage. It leaves a Titan frame behind.
  - **The Warden**: hovers with a searchlight and fires a beam if you stay in it; drops walking bombs you hit to kick up at it, which knocks it down. Rockets reach it in the air. It leaves a Walker frame.
  - **The Maker**: the Colossus's moves plus missile rain; at half health its shell cracks and its core ejects, finished as a duel with a Walker beside it.
- **Mini-bosses** mid-level: a big Brute, a big Walker, then two big Brutes.

Files: `hardcore_v1.8.html`

## v1.7
The frames' powers and weapons are back, in the campaign.
- **Special button**: C or Shift (gamepad Y, touch SP, or A and B together). It replaces the generic burst.
- **POWER meter**: starts half full, fills by landing hits and beating robots. A special costs half the bar (knife throw a quarter).
- **Every body has its own power**:
  - Core: knife throw. Basic: power glove rocket punch. Brute: hammer of might ground slam. Walker: shoulder laser beam across the screen. Titan: giant sword.
  - Robot bodies: Scrapper spin, Lancer spear thrust, Hound pounce, Shieldbot shield bash (blocks while charging), Brute ground pound, Walker rocket launch (rockets drop on the nearest robots).
- **Weapons**: crates can drop Sword of Justice, Hammer of Might, Shoulder Laser or Rocket Launch. Walk over one to mount it on your body; it replaces that body's power and stays with the body if you eject.
- HUD shows the POWER bar, the cost mark and the current special's name. English and Hebrew.

Files: `hardcore_v1.7.html`

## v1.6
The beat 'em up becomes the main game.
- **PLAY** (default on the title screen): story intro, then one continuous street through The Burial Waste, The Pine Forest and The Foundry, 5 sections each. Levels join seamlessly; each opens with its banner and story lines. Bosses: Brute, Walker, and the Maker's core with a Walker; beating it plays the ending.
- **Start as the bare core** with its knife. An empty Basic lies near the start.
- **Eject at any time** with Enter. The body you leave stays on the street with its shell, and you can climb back in.
- **Beaten robots leave their empty bodies.** Enter climbs into any body bigger than the one you are in; if you are already in one, it nests inside (layers break outer-first). Each body plays differently: Lancer reach, Hound lunge, Shieldbot blocks from the front, Walker hits hardest.
- Death retries the current section as the bare core with half the score.
- **CLASSIC** keeps the map game; its eject now also works at any time.
- English and Hebrew.

Files: `hardcore_v1.6.html`

## v1.5
BRAWL: a beat 'em up mode, chosen on the title screen (Up/Down: Story or Brawl).
- Pick any frame (Core, Basic, Brute, Walker, Titan) and fight down a street in four sections; the camera locks until each section is cleared, then GO.
- Walk in depth as well as left and right; several robots at once. Only two press the attack at a time, the rest circle and wait.
- Combo (B B B) with a launcher, air attacks and juggles, dive (Down+B in the air) with pogo bounce.
- Grab and throw: walk into a dazed robot to pick it up, B throws it into the others.
- A+B core burst clears the space around you and costs a little shell.
- Shieldbots block from the front, Hounds lunge, a Walker boss closes the street.
- Crates break open for repairs and core cells. Shell break drops you to the knife; score, hit counter and the last robot's health bar.
- English and Hebrew.

Files: `hardcore_v1.5.html`

## v1.4.1
Nesting fix after play-testing.
- The NEST row accepts any second frame you own; the bigger one always goes outside (wearing the Basic and picking the Brute swaps them).
- With only one frame, the row reads "NEEDS A 2ND FRAME" instead of silently refusing.
- The salvage screen announces "NEW: NEST A FRAME IN BATTLE PREP" the first time you own two frames.

Files: `hardcore_v1.4.1.html`

## v1.4
Nesting frames, from the "NESTING" note on the deck's Tools and Skills slide.
- Battle prep has a new **NEST** row: pick a smaller frame to ride inside your frame (Basic in a Brute, a Walker in a Titan, and so on).
- The nested frame stands on the bigger frame's lid with the core on top, like the slide.
- Layers peel off: a shell break or an eject drops you to the nested frame first, then to the bare core. Ejected frames come back after a win; broken ones are lost.
- Prep shows the combined shell (for example SHELL 140+40); the fight HUD shows a thin second bar for the nested layer.
- The map sprite shows the nest. New text in English and Hebrew.

Files: `hardcore_v1.4.html`

## v1.3
Frames redrawn to match the deck's "Game Progression" and "Tools and Skills" slides.
- Flat teal blocks instead of outlined boxes; a wide lid plate that the core sits on (stepped on the Brute, Titan and King).
- Arm blocks hanging past the torso with finger pegs; the Brute and Titan get fists and shoulder pads.
- Separate legs with feet: stubby on Basic and Brute, knees on the Walker, splayed and stepped on the Titan and King, like the giant silhouette.
- White chest triangle; a pentagon on the Titan and King.
- The nested core shows its side domes, the "additions" from the character sheet.
- Map, parked-rig and battle prep sprites match.

Files: `hardcore_v1.3.html`

## v1.2
Lessons from Blaster Master: the core and its frames decide where you can go.
- **Park the frame:** on the map, B (X key) steps out. The frame waits where you left it; walk back into it or press B beside it.
- **The bare core** is quicker and fits through vents, but any fight you start without your frame is fought as the core.
- **Gated pockets** on every map, each with a hint when you bump into it: vents (core only), cracked walls (Hammer of Might), glyph doors (Shoulder Laser), deep water (Walker or Titan), chasms (Jet Booster).
- **Caches** behind the gates: core cells (+1 core pip), parts, and three chalk-storyboard memories of Shelly.
- **Momentum:** heavy frames build speed slowly, slide and skid when turning; the core stops on a dime. On the map and in fights.
- **Rig panel:** Start on the map shows core cells and memories found.
- All new text in English and Hebrew.

Files: `hardcore_v1.2.html`

## v1.1
- Rolled back to the side-scroller line; the Hyper Light Drifter top-down test is set aside as a separate experiment.
- **Jump:** press buffering, coyote time, variable height (tap for a hop, hold for a full jump), heavier fall, a jump height for each frame, more air control.
- **Landing:** squash on landing; heavy frames (Brute, Walker, Titan) stomp nearby robots.
- **Combo:** the third hit launches robots into the air; juggle them with air attacks; they land knocked down.
- **Dive:** Down + B in the air. Bounces off robots, bombs and boss armor (pogo), shockwave on landing.
- **Charge:** keep holding B after an attack for a heavy strike that breaks shields.
- Jumping cancels a punch; hit counter on screen.
- **Hebrew:** full translation with a right-to-left pixel font. Switch with the L key, the title screen or the page button; the choice is remembered.
- Version number on the title screen.

Files: `hardcore_v1.1.html`

## v1.0
- Three levels: The Burial Waste, The Pine Forest, The Foundry. Level intros, checkpoints.
- Bosses: The Warden (kick its bombs back up at it), The Maker (climbable, missile rain, ejects its own core at half health).
- Robots: Shieldbot, Bomber, Hound. Parts: Giant Sword, Heart Shield, Spare Core, Jet Booster. Frame 04 Titan.

Files: `hardcore_v1.0.html` (the rollback point, before the Hyper Light Drifter experiment)

## v0.3 (pre-release)
- Climbable Colossus with head crits; guard and parry; eject tumble with "HI"; shell break debris.
- Shaman and Rocket Launch; nesting boot-up animation; eye moods.

## v0.2 (pre-release)
- A = jump, B = attack. Walk cycles for Onion Head, frames and robots.

## v0.1 (pre-release)
- First playable: title, story, map, battle prep, fights, eject, shell break, the Colossus.
