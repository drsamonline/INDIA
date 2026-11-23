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
| 5 | **Tone the charbagh** | the flower beds read as confetti dots; real parterres are ordered beds with a low hedge line | half session |
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

### Tier 1 — needs a modelled surface, not tuned primitives (3)

| Monument | The problem | The fix |
|---|---|---|
| **Meenakshi** | fourteen gopurams read as tiered blocks with window rows. Three cosmetic passes failed | model one gopuram properly — tier walls, projecting cornices, figure registers as instanced relief — then instance it fourteen times at the documented sizes |
| **Lotus** | petals read as leaves; the ring parameterisation is right, the section is not | a folded double-curved shell with a keel and a thin edge, traced from the elevation, as the head and the petals eventually were |
| **Statue of Unity** | arms fuse to the torso at the armpit; a single closed loft cannot make two arm loops. The costume now follows the reference (shawl over both shoulders, dhoti wrapped to the ankles, sandals) | separate arm shells that meet a shoulder cap, or quad topology on the torso. The portrait is a separate problem: it needs sculpted mesh, not more passes over this code |

### Tier 2 — good massing, missing the detail that identifies it (9)

| Monument | Missing |
|---|---|
| **Qutb Minar** | carved Kufic bands; the marble is colour, not inscription. Needs `carvedBand` |
| **Charminar** | stucco ornament reduced to frames and discs; needs `jali` and `carvedBand` |
| **Hawa Mahal** | the jharokhas are one casement per bay against 953 real ones; needs `jali` at density |
| **Konark** | wheels have flat spokes; the 24 need carved rims and hubs |
| **Kandariya** | 870 sculptures suggested by two registers of blocks; needs instanced relief |
| **CSMT** | the carved menagerie — peacocks, monkeys, lions, snakes — is absent |
| **Mahabodhi** | the seated Buddha in each niche is a recess; the railing lacks coping and medallions |
| **Basilica** | the altars, the casket chapel and the painted ceiling do not exist; the tour admits it |
| **Rani ki Vav** | 292 pillars built, 226 survive, 216 modelled — but the wall figures are flat |

### Tier 3 — close to right, needs polish (8)

| Monument | Polish |
|---|---|
| **Golden Temple** | the gold reads matte; needs an anisotropic or env-mapped gold, not a flat key |
| **Sanchi** | vedika posts and rails simplified; no coping stones or medallions |
| **Shore Temple** | the second shrine's tier count is disputed; the porch is a barrel vault without carving |
| **Victoria Memorial** | the Angel is a silhouette; the allegorical panels are plain |
| **Mysore** | the verandah arches are pointed, not the cusped multifoil of the real building |
| **India Gate** | the 74,187 names are suggested by fine bands, not legible |
| **Amber Fort** | the hill and lake are compressed; the 12 km wall network is 490 m of representative runs |
| **Jantar Mantar** | the quadrant arcs are a vertical projection of an equatorial plane, not the true tilted geometry |

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
