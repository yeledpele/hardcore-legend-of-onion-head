# HARDCORE v3.0 plan: new design language, Binding of Isaac style vector art
Base: `hardcore_v2.0.html`. Ben rejected the v2.0 pixel mech look.
## Language (from Ben's samples + research on McMillen's Flash-era art)
- Smooth vector shapes, heavy near-black outline (#160e10), rounded chubby forms.
- Cel shading: one darker band on the bottom-right of every shape, plus a soft white highlight blob top-left.
- Muted palette: bone/khaki metal for Onion Head's frames, fleshy pink robots, gold Maker, grey empty bodies; Onion Head's core keeps its cyan shell, sprout and yellow eye.
- Creepy-cute details: big round eyes with pupils, stitched mouths and seams, rivets, the Warden as a veiny eyeball, Isaac-style round bombs with fuses.
- UI: torn paper notes with a push pin (level banners, item cards, menus), chunky bold lettering (Silkscreen bold; Secular One for Hebrew with real RTL), Isaac-style active item box with a charge bar (specials), red-and-black boss bar with a skull at the bottom.
- Backgrounds: basement-like rooms per level (dirt basement, mossy forest cave, burning foundry) with props and a dark vignette.
## Tech
- Vector canvas at 4x (1024x576) drawn with Path2D in game units; game logic unchanged.
- Vector mode for title, story intro, PLAY campaign, game over, ending. CLASSIC keeps the pixel renderer.
## Status
- [x] toolkit  - [x] core  - [x] frames + robots + heads  - [x] bosses  - [x] effects/pickups
- [x] stages  - [x] HUD, notes, cards, boss bar  - [x] title/intro/ending/game over  - [x] test (full campaign, Hebrew, classic, 58 fps)  - [x] publish

## Next candidates
- Bring CLASSIC (map, battle prep, duels) into the vector language too.
- Hand-tune character proportions (bigger heads, more grotesque detail) once Ben reacts.
- Item pedestals / paper notes for pickups on the floor.
