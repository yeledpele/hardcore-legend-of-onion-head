# HARDCORE v1.8 plan: size-based hit boxes, harder-to-hit core, bosses and mini-bosses back

Base: `hardcore_v1.7.html`.
## 1. Hit boxes depend on size
- Every body (yours and the robots') gets a width, height and depth from its art: frames from their frame specs, robots from their robot specs.
- Robot attacks must overlap your body; small bodies are easier to slip past, big ones fill more of the street.
- Your attacks must overlap the robot's body: big robots are easier to hit, Hounds are long and low.
## 2. The bare core is harder to hit
- Core box: narrow (half-width 3), short (10), thin in depth (3). Jumping clears most low attacks.
## 3. Bosses back in the campaign (end of each level), mini-bosses mid-level
- L1 end: **Colossus**. Fist slam aimed at you (shadow on the floor), floor sweep (jump it). After a slam it kneels: its chest core can be hit; jump onto the fist to reach the head for double damage.
- L2 end: **The Warden**. Hovers with a searchlight; stay in the light and it fires a beam. It drops walking bombs: hit a bomb to kick it up at the Warden and knock it down, then beat it on the ground. Rockets reach it in the air.
- L3 end: **The Maker**. Colossus moves plus missile rain; at half health its shell cracks and its core ejects, finished as a duel (the Maker's core plus a Walker).
- Mini-bosses (section 3 of each level, "MINI BOSS" banner): L1 big Brute, L2 big Walker, L3 two big Brutes.
## Status
- [x] hit boxes  - [x] core  - [x] colossus  - [x] warden  - [x] maker  - [x] mini-bosses  - [x] Hebrew  - [x] test (full campaign, all three bosses beaten)  - [x] publish
