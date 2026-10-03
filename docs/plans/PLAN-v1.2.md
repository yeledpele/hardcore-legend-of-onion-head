# HARDCORE v1.2 plan: lessons from Blaster Master

Goal: the core and its frames should matter for *where you can go*, not only for how you fight.
Base file: `hardcore_v1.1.html`. Output: `hardcore_v1.2.html` + live artifact.

## 1. Step out of the frame on the map (core = access, frame = strength)
- On the map, **B** steps out: the frame stays parked where you left it (grey, slumped).
- As a bare core you are faster and fit through **vents**, but every fight you start is fought as the bare core.
- Walk back into the parked frame (or press B next to it) to climb in. Battle prep shows "your frame is parked".

## 2. Parts and frames open the world (gates)
Gate types, each drawn on the map, each with a hint when you bump into it:
| gate | opens with | look |
|---|---|---|
| vent | bare core only | dark grille in a ruin wall |
| cracked wall | Hammer of Might equipped, press A | stone block with cracks |
| glyph door | Shoulder Laser equipped, press A | teal monolith, red glyph |
| deep water | Walker or Titan frame (heavy enough to wade) | dark pool, splashes |
| chasm | Jet Booster equipped, press A to jet across | dark gap with edges |
- Gates guard **optional caches**; the path to each boss never needs a missing item (no soft-locks).
- Opened gates and taken caches are remembered for the run.

## 3. Caches (rewards behind gates)
- **Memory fragment**: a chalk-storyboard memory of Shelly (deck style: teal chalk on maroon). 5 total.
- **Shell plating**: +10 shell on every frame.
- **Spare core cell**: +1 core pip.

## 4. Momentum (weight you can feel)
- Acceleration / friction / top speed per body: core snappy, Basic medium, Brute/Walker/Titan slide and skid when turning (dust).
- Applies in fights and on the map.

## 5. Layout per level
- L1 Burial Waste: vent (memory 1, near start, teaches stepping out), cracked wall (shell plating), glyph door (memory 2).
- L2 Pine Forest: deep water (memory 3, Shelly's house side), vent (core cell), glyph door (shell plating).
- L3 Foundry: chasm (memory 4), cracked wall + vent combo (memory 5), deep water (core cell).

## 6. Text
- All new strings in English and Hebrew.

## Status
- [x] momentum  - [x] parking  - [x] gates  - [x] caches + memories  - [x] layouts (3 pockets per level, 3 memories)  - [x] Hebrew  - [x] test  - [x] publish v1.2

Shipped as v1.2. Deviation from the plan: 3 memories instead of 5, and fenced pockets instead of free-standing gates, so every gate guards one clear reward.

## Next candidates (v1.3)
- A boss fought as the bare core (Blaster Master's on-foot bosses).
- Parts that lose a level when hit hard, instead of breaking all at once.
- Top-down interiors for the core, using Hardcore's own rules.
- A small map screen once levels grow.
