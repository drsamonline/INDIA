# Roadmap: bringing the other twenty-three up to the Taj

## What the comparison actually showed

I put the Taj page and an engine page side by side before deciding anything.
The result was not what I expected.

**The Taj's renderer is already at parity.** It has ACES filmic tone mapping,
2048² PCF-soft shadow maps with a 124 m frustum, a key light, a rim light and
an UnrealBloom pass. It is not a flat scene that needs the engine's light.

**The engine's sky is better than the Taj's.** The engine draws a physical
sky — Rayleigh and Mie scattering, a real sun with a halo, a horizon that
shifts with the hour. The Taj uses a gradient dome. That is the one place the
Taj is behind.

**What the Taj has that the others do not is geometry.** Look at its page: the
great pishtaq with its recessed calligraphic band, the marble jali screens, the
pietra-dura inlay, four working minarets with balconies, the red sandstone
mosque and jawab, the charbagh parterres, the reflecting pool, the river. The
other twenty-three are recognisable massing with suggested detail.

So "make every monument like the Taj" means one thing: **give each page the
Taj's depth of modelled detail**. It does not mean porting the Taj into the
engine, and it does not mean changing the light — except on the Taj, where the
sky should come from the engine.

---

## Part 1 — the Taj (six items, in order)

| # | Item | Why | Size |
|---|---|---|---|
| 1 | ~~Fog reduced and cooled~~ | done — 0.0016 tan to 0.0009 grey | ✅ |
| 2 | ~~Grade aligned with the site~~ | done — exposure 0.62, glow 0.24, bloom 0.90 | ✅ |
| 3 | **Port the engine's physical sky** | the Taj's gradient dome is the only place its light is behind the other pages | 1 session |
| 4 | ~~Night floodlights~~ | done — five spots at 130, angle 0.70, aimed at y 19; `?shot=` finally moves the clock | ✅ |
| 5 | ~~Tone the charbagh~~ | done — 300 random flowers became 48 beds, each edged with its own low hedge and planted in rows of one colour (§53) | ✅ |
| 6 | **Water and reflection** | the pool reflects a flat colour; the engine's water shader has distortion and a fresnel term | half session |

Items 3–6 are all edits to `tools/build_taj.py` as string replacements. The
source scene at `tools/source/taj-mahal.original.html` stays untouched, so
nothing can break the geometry.

---

## Part 2 — the shared detail vocabulary

Most of what makes the Taj read as itself is five techniques that every
monument on the site could use. Build them once, as engine helpers, and every
page can call them.

| Helper | What it does | First users |
|---|---|---|
| `jali(width, height, pattern)` | a pierced screen with a real repeating pattern — hexagon, star, lattice — cut as geometry, not a decal | Taj, Hawa Mahal, Charminar, Mehrangarh, Jantar Mantar |
| `inlay(band, motif)` | pietra-dura banding on a surface: a colour field with a repeating geometric motif in a second stone | Taj, Basilica, Mysore, Victoria |
| `carvedBand(y, height, motif)` | a recessed band carrying repeated carving — calligraphy, lotus, rosette — as instanced relief | Taj, Qutb, Konark, Khajuraho |
| `parterre(plan, hedge)` | an ordered garden bed with a hedge line and a path edge, replacing scattered flower dots | Taj, Golden Temple, Amber, Mysore |
| `waterBody(plan, depth)` | the engine's water shader as a callable, with banks and steps | Taj, Golden Temple, Rani ki Vav, Meenakshi, Victoria |

These five are the difference between "recognisable massing" and "the building".
Nothing else in this roadmap matters until they exist.

---

## Part 3 — per monument

Ranked by how much detail work each needs, judged from the renders rather than
from the code.

### Tier 1 — needs a modelled surface, not tuned primitives (1)

| Monument | The problem | The fix |
|---|---|---|
| ~~**Meenakshi**~~ | **done** — the fourteen gopurams were tiered blocks with window rows. One gopuram generator now builds them: a concave taper, chamfered corners, three-moulding cornices, kudu rows, figure registers merged per face, a barrel-vault crest with kalashas, granite bases with gateways. 688k → 373k triangles and the boot got faster | — |
| ~~**Lotus**~~ | **done** — the petals were bent sheets with a knife edge. Each is now a doubly-curved shell: a keel up the centre, the flanks cupping toward the axis, the rim turning out, two surfaces offset along the true normal and joined by a rim. The entrance leaves arc over and droop; the rings are wide enough to nearly touch | — |
| **Statue of Unity** | arms fuse to the torso at the armpit; a single closed loft cannot make two arm loops. The costume now follows the reference (shawl over both shoulders, dhoti wrapped to the ankles, sandals) | separate arm shells that meet a shoulder cap, or quad topology on the torso. The portrait is a separate problem: it needs sculpted mesh, not more passes over this code |

### Tier 2 — good massing, missing the detail that identifies it (9)

| Monument | Missing |
|---|---|
| ~~**Qutb Minar**~~ | **done** — the bands were a ring of identical blocks, which reads as a dashed line. Six on storey 1, two each on storeys 2 and 3, one on 4, each a projecting course carrying a connected row of raised letters (baseline, uneven stems, loops, dots), one geometry per band. **The script is naskh, not Kufic** — the roadmap had it wrong |
| ~~**Charminar**~~ | **done** — the stucco was frames and discs on bare plaster. Now a lotus-petal fringe under all three cornices and round every minaret balcony, rows of blind arches in the spandrels, and two concentric hood moulds round each great arch, whose edge was a raw cut through the pierced wall |
| ~~**Hawa Mahal**~~ | **done** — a bay was 1.4 m wide against the building's sub-metre, so the screen read as a row of shopfronts. Bays 13/11/9/6 → 19/16/12/8 (55 casements), each screen cut 3×5 instead of 3×4, and the base arcade 9 → 13 arches |
| ~~**Konark**~~ | **done** — the wheels were rebuilt in an earlier pass (tapered spokes, medallions, lotus hub, beaded rim); the gap was the **deul**, which was a stack of axis-aligned boxes that read as a concrete bunker. It now steps in on a taper, carries corner buttresses and carved registers of blind arches, and its broken crown is a continuous ragged mass |
| ~~**Kandariya**~~ | **done** — the figures were rebuilt as seven-piece sculpture in an earlier pass; what was wrong was the **shikhara**. Its urushringas were straight cones three times taller than wide, four overlapping up each corner, so the tower read as a string of beads down the edge. Each is now a miniature of the tower with the same curvilinear profile, five rows climbing each corner and one pair on each face of the lower three |
| ~~**CSMT**~~ | **done** — the menagerie existed but was 0.85 m on a 26 m skyline, four pixels at the home view, and the same cream as the wall behind it. Now 3× the size on a darker stone, so the gable apexes carry their animals as silhouettes against the sky |
| ~~**Mahabodhi**~~ | **done** — the niches were black boxes: a dash of shadow up the tower. Each now holds a seated Buddha (three tapered prisms, one geometry per row of three), and the vedika has a continuous coping instead of a fence of posts |
| ~~**Basilica**~~ | **done** — the nave was one solid block. It is hollow now: two walls, an east wall with a chancel arch, a boarded ceiling, the gilded retable, two side altars, the casket chapel with its silver casket under glass, and pews, with a named Interior view. The tour no longer apologises |
| **Rani ki Vav** | 292 pillars built, 226 survive, 216 modelled — but the wall figures are flat |

### Tier 3 — close to right, needs polish (8)

| Monument | Polish |
|---|---|
| ~~**Golden Temple**~~ | **done** — the gold carried a small emissive standing in for the sky it would reflect. **The engine now has a real sky environment** (§47), so the emissive can be dialled back whenever the gold is next touched |
| ~~**Sanchi**~~ | **done** — the vedika had posts and three rails and nothing over them, so it read as a fence of sticks. A continuous coping course now runs the top of both railings, with a lotus boss on every third post |
| ~~**Shore Temple**~~ | **done** (the porch) — the shala roof over the east porch was a bare half-cylinder. It now carries a row of seven kudu dormer faces down its front slope, a pilaster band at each end and three stupis along the ridge. The second shrine's tier count stays disputed — recorded in `DIMENSIONS.md`, not guessed |
| ~~**Victoria Memorial**~~ | **done** — the Angel was a cone, three cylinders and four flat slabs. It is now a lofted robe with folds, a torso, a head, one arm raised holding a gold wreath, and five overlapping feathers a side on a swept leading edge. The four allegorical groups are seated figures with their attributes — palette, set square and column, sword and scales, a child |
| ~~**Mysore**~~ | **done** — every bay carried a plain round head. A cusped multifoil shape now drives both the openings and their frames, five lobes on the big arches and three or four on the smaller ones |
| ~~**India Gate**~~ | **done** — the names were twenty-four ruled lines a face, which read as moulding. Each pier face now carries rows of short strokes of uneven width with word breaks, in one geometry a face: not legible, but a wall of names rather than a ruled panel |
| **Amber Fort** | the hill and lake are compressed; the 12 km wall network is 490 m of representative runs |
| ~~**Jantar Mantar**~~ | **partly done** — the quadrants were two half-discs standing in vertical planes. They are now arcs of radius 15.15 m **in the plane of the equator**, centred on D on the hypotenuse, 2.84 m thick along the plane's normal, the pair forming a semicircle, as the sources describe. The massing is still approximate: the real wall descends to the pit floor and this one does not |

### Tier 4 — done (4)

Mehrangarh, Somnath, Gateway of India, Taj (geometry).

---

## Order of work

1. **The five helpers** — nothing else is worth doing first, because every
   monument below needs them
2. **Taj items 3–6** — the physical sky is the one place the site's best page
   is behind its own siblings
3. **Tier 1** — Meenakshi, Lotus, Statue of Unity: each is a modelling job,
   not a tuning job, and each has already resisted tuning
4. **Tier 2** — apply the helpers, one monument at a time, verifying by render
5. **Tier 3** — polish, lowest risk, can be batched

## How to judge it

The bar does not change: **someone who knows the building must recognise it
across the room.** Beyond that, a page is finished when its detail survives
being looked at closely — when the jali is pierced rather than painted, the
carving is geometry rather than a colour, and the garden is planted rather than
sprinkled.

Every step is verified the same way: render at 1280×800, 900×600 and 390×844,
look at the image, and only then commit.
