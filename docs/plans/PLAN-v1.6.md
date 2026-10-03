# HARDCORE v1.6 plan: beat 'em up campaign, eject anytime, hijack beaten robots

Base: `hardcore_v1.5.html`. Output: `hardcore_v1.6.html` + live artifact.

## 1. Beat 'em up is the main game
- Title menu: **PLAY** (default, beat 'em up campaign) and **CLASSIC** (the old map + duels). The v1.5 arcade "Brawl" select screen is folded into PLAY.
- PLAY: story intro, then one continuous street through all three levels.

## 2. Stages connect
- Level 1 Burial Waste, Level 2 Pine Forest, Level 3 Foundry: 5 sections each, laid end to end on one street (1280 px per level).
- Walking off the end of a level scrolls straight into the next; the background and floor split at the seam, then the next level's banner and story lines show.
- Last section of each level is a boss: Brute (L1), Walker (L2), the Maker's core with a Walker (L3). Beating the last one plays the ending.
- Death: retry the current section as the bare core, score halved.

## 3. Eject at any time
- **Start (Enter)**: if standing next to an empty body you can fit into, climb in; otherwise eject from your current body. The body you leave stays on the street as an empty husk (keeping its shell) and you can climb back in.
- Classic mode: eject is no longer limited to low shell.

## 4. Beaten robots leave empty bodies; smaller climbs into bigger
- Every beaten robot (except the final boss) leaves its empty body on the ground.
- You can climb into any body **bigger** than the one you are in. Sizes: core 0; Scrapper, Lancer, Basic 1; Hound, Shieldbot, Brute (robot), Maker core, Brute frame 2; Walker robot, Walker frame 3; Titan 4.
- Climbing in while already in a body **nests** it: layers stack (inner to outer). Damage breaks the outer layer first; eject peels the outer layer.
- Each body plays differently: Lancer long reach, Hound lunges, Shieldbot blocks hits from the front, Walker hits hardest.
- The campaign starts as the bare core ("found buried"), so the first beaten Scrapper is your first body.

## 5. HUD and text
- Layer stack shown top-left (names of nested bodies), shell bar for the outer layer, core pips, score, level and section.
- Hint near an empty body: "START: CLIMB IN"; while in a body: "START: EJECT".
- All new text in English and Hebrew.

## Status
- [x] campaign data + connected stages  - [x] layered bodies, eject, climb-in, husks  - [x] boss sections + ending
- [x] title menu, intro routing  - [x] classic eject anytime  - [x] Hebrew  - [x] scripted play-through (all 15 sections, 3 layers nested)  - [x] publish v1.6

## Next candidates
- Real boss fights in the campaign (Colossus climb, Warden, Maker) instead of strong robots.
- Parts from Classic (hammer, laser, rocket) as pickups in the campaign.
- Draw every nested layer, not just the outer two.
