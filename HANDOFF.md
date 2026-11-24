# Session handoff — INDIA, monuments in code

Paste this whole file into a new session to continue.

---

## The project

A static site of **24 Indian monuments modelled procedurally in three.js**, one
page per monument plus a landing page that links them all.

- **Repo:** `https://github.com/drsamonline/INDIA` (public, branch `main`)
- **Live:** `https://drsamonline.github.io/INDIA/` (GitHub Pages)
- **Licence:** CC BY-NC 4.0, author **Dr Sohil Momin**
- **Head of main:** `d137cad`
- **Working tree:** clean
- **CI:** green on every push (`site` + `pages-build-deployment`). **Not**
  `Build + deploy` (`build-apps.yml`): it has failed with `startup_failure`
  since the `deliver:` push of 2026-11-23 15:48 — zero jobs, no logs. The call
  is well formed (`drsamonline/app-builder/.github/workflows/build.yml@main`,
  which is public and declares `workflow_call` with exactly these inputs), so
  the refusal is at resolution: check the repo's Actions permission for
  reusable workflows in Settings, or the annotation in the Actions tab. Not
  caused by any change in this repo's pages.

The user is Dr Sohil Momin. He works fast, says "go" to mean "continue the
queue", and wants tables and bullets, not paragraphs. He checks the live site,
so **deploys must be cache-busted** (they are — see below).

---

## State of play

Read this before anything else. Everything below it is a log.

**Verified across this run:** all 24 pages have booted clean with no console
errors and been framed by eye;
`audit_data` 0 errors; `linkcheck` 26 pages resolve; `check_a11y` 0 failing;
`tintcheck --ci` 0 new; keyboard shortcuts and the history drawer exercised;
mobile (390x844) checked on two pages; landing page, credits and README checked
against `data/monuments.json`; a full rebuild produces no diff.

**Open work — one item:**

| Item | Why it is open |
|---|---|
| Statue of Unity is not a portrait | The costume and the proportions now follow the supplied turnaround (§29), but the face is still a displacement carved into a loft, not a likeness of Patel. More passes over the same code will not close that; it needs sculpted mesh data, which this pipeline does not do. The Taj is the only page with that depth and it is a 159 KB single scene. |

**Latest run (§42):** Victoria Memorial — the Angel of Victory rebuilt (lofted
robe with folds, raised arm with a wreath, five feathers a side), and the four
allegorical groups as seated figures with attributes. 69k → 74k triangles, boot
43 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§41):** Mysore's arches — a cusped multifoil shape now drives both
the openings and their frames (five lobes on the big arches, three or four on
the smaller ones). 85k → 166k triangles, boot 79 s, `audit_data` 0, `linkcheck`
26 pages, `tintcheck --ci` clean.

**Previous run (§40):** Sanchi's vedika — a continuous coping course over both
railings, and a lotus boss on every third post. 51k → 63k triangles, boot 51 s,
`audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§39):** the Basilica's interior — the nave hollowed, a boarded
ceiling, the gilded retable, two side altars, the casket chapel and pews, plus
an Interior view and a rewritten tour stop. 28k triangles, boot 45 s,
`audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§38):** Mahabodhi's niches — a seated Buddha in each recess, three
to a row as one geometry; and a continuous coping on the vedika railing. 52k →
60k triangles, boot 40 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci`
clean.

**Previous run (§37):** CSMT's menagerie — the beasts were 0.85 m on a 26 m
skyline and the same cream as the wall, so they vanished. Now 3× the size on a
darker stone, and the spandrel pair at 2.2×. 67k triangles, boot 37 s,
`audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§36):** Kandariya's shikhara — the urushringas rebuilt as
miniatures of the tower on its own profile, five rows up each corner instead of
four overlapping cones; the courses are the tower's own stone instead of warm
trim. 62k → 67k triangles, boot 40 s, `audit_data` 0, `linkcheck` 26 pages,
`tintcheck --ci` clean.

**Previous run (§35):** Konark's deul — the ruined tower stump rebuilt on a
taper, with corner buttresses, carved registers of blind arches on each face and
a continuous ragged crown. 96k → 101k triangles, boot 45 s, `audit_data` 0,
`linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§34):** Hawa Mahal's facade — bays 13/11/9/6 → 19/16/12/8 (55
casements, each screen cut 3×5), base arcade 9 → 13 arches. 78k → 105k
triangles, boot 45 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci`
clean.

**Previous run (§33):** Charminar's stucco ornament — a lotus-petal fringe under
the three cornices and round every minaret balcony, blind-arch rows in the
spandrels, and two hood moulds round each great arch. 80k → 87k triangles, boot
50 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§32):** Qutb Minar's inscription bands — six on the first storey,
two each on the second and third, one on the fourth — rebuilt as projecting
courses carrying a connected row of raised letters, one geometry per band. The
script is **naskh, not Kufic**; the roadmap had it wrong. 91k → 102k triangles,
boot 54 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` 0 new.

**Previous run (§31):** the Lotus petals rebuilt as doubly-curved shells with a
keel, a cupping flank, a turned-out rim and a thin edge; the entrance leaves arc
over and droop. 56k → 71k triangles, boot 67 s, `audit_data` 0, `linkcheck`
26 pages, `tintcheck --ci` 0 new.

**Previous run (§30):** Meenakshi's fourteen gopurams rebuilt from one generator —
concave taper, chamfered corners, layered cornices, kudu rows, figure registers
as one merged geometry per face, barrel-vault crest with kalashas. 688k → 373k
triangles, boot 87 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci`
0 new.

**Previous run (§29):** the Statue of Unity figure rebuilt against the turnaround
the user supplied — shawl over both shoulders, dhoti wrapped to the ankles,
sandals, hair rim, buttons, cuffs; then a drapery and face pass (diagonal folds,
a pinch under the shoulder, a shoulder-riding top edge, stronger features).
41k → 51k triangles, boot 65 s, 0 errors, `audit_data` 0, `linkcheck` 26 pages,
`tintcheck --ci` 0 new, `check_a11y` ok.

**Known soft spots, judged acceptable:** India Gate's attic is squat (block
width is unpublished, the model's 37 m is photo-derived); Shore Temple and
Konark read dark, which is what granite and weathered khondalite do.

**Do not re-chase:** **the flock of dark specks in the sky is the engine's
birds** (they cost two renders at Konark, §35); the Lotus's grey band (engine
ambient by design), the
`framecheck` flags on detail views (a "Carving" view is meant to be close), and
any "broken image" count taken from a browser (see §24).

---

## Where the code lives

```
data/monuments.json            the single source of truth, 24 entries
assets/js/monument-engine.js   the shared engine (~1700 lines)
assets/js/monuments/*.js       23 modules, one per monument (Taj is separate)
assets/css/monument.css
monuments/*.html               24 generated pages — never edit by hand
index.html, credits.html       generated from tools/templates/
tools/                         build + QA scripts (see below)
DIMENSIONS.md                  every model's figures with a source per row
ROADMAP.md                     what each monument still needs, ranked
docs/gallery.jpg               contact sheet of all 24 (tools/build_gallery.py)
LICENSE, NOTICE                CC BY-NC 4.0 with a licence history
```

The Taj Mahal page is different: it is a **single 158 KB self-contained scene**
generated by `tools/build_taj.py` from `tools/source/taj-mahal.original.html`.
It does not use the engine. Leave its geometry alone — it is deeper than
anything rebuilt from primitives.

---

## Build and verify

```bash
python3 tools/build_site.py          # regenerate all 24 pages + index + credits
python3 tools/build_taj.py           # regenerate the Taj page
python3 tools/build_extras.py        # robots.txt, sitemap.xml, 404.html
python3 tools/audit_data.py          # data + copy lint — must be 0 errors 0 warnings
python3 tools/linkcheck.py           # every internal reference resolves
python3 tools/check_all.py --only <id> --size 900x600 --out shots
python3 tools/check_a11y.py --only <id>
python3 tools/volumes.py <id> --column x,z    # what occupies a vertical column
python3 tools/volumes.py <id> --at x,y,z      # what contains a point
python3 tools/tintcheck.py --ci      # no NEW tint taken from a textured base
python3 tools/framecheck.py          # do views and tour stops frame their subject
python3 tools/check_ui.py --only <id> # the documented keyboard shortcuts
python3 tools/build_gallery.py       # rebuild docs/gallery.jpg from shots/audit
```

CI runs the rebuild, the staleness check, `linkcheck`, `audit_data --strict` and
`tintcheck --ci` on every push; the PR job also boots two pages, runs `check_a11y`
and `check_ui`. Reproduce those locally before pushing.

Rendering needs `pip install playwright`; Chromium is at `/usr/local/bin/chromium`.
The Taj takes 90–140 s to boot under software rendering — allow for it.

**Inspection parameters** (engine pages only): `?shot=21.5` sets the hour,
`?view=3` picks a named viewpoint, `?look=x,y,z&dist=&az=&el=` points the camera
at any coordinate.

---

## What was completed last session

**23 modules rebuilt to researched dimensions.** Each agent was required to
research the building's real dimensions, write a dimension table, and build to
it. Every table is in `DIMENSIONS.md` with a source per row.

**Five engine helpers**, exposed on `ctx`:
`jali()` pierced screens (cached) · `carvedBand()` recessed relief ·
`inlay()` pietra-dura banding · `parterre()` hedged beds · `waterBody()` the
water shader as a callable.

**Detail applied:** Hawa Mahal's 953 pierced screens · Konark's plinth friezes ·
Charminar's medallions · Qutb Minar's Kufic inscription bands · Rani ki Vav's
tank · Meenakshi's four-piece figures.

**Taj brought to parity:** fog reduced, grade aligned, sky matched to the
engine's atmosphere, floodlights added, three.js vendored (it was the only page
on a CDN), slider attributes fixed so the grade actually applies.

**Site infrastructure:** portrait dolly fixed (was cropping 100 m buildings at
390 px) · per-monument `floodScale`, `hemiScale`, `hemiGround` · cache-busting
`?v=<hash>` on every asset · automated accessibility contract · merge guard for
geometry arriving without UVs.

---

## Three corrections to the briefs that the research forced

These matter — the original figures were wrong:

| Monument | Wrong figure | Right figure |
|---|---|---|
| Gateway of India | arch 15 m | **arch 8.6 m**; 15 m is the dome diameter |
| Golden Temple | 40 m sanctum on a 67 m platform | **40.5 ft on 67 ft** — feet, not metres |
| Jantar Mantar | site 187 × 160 m | **1.8652 ha** (UNESCO); 187 × 160 would be 60% too big |

Two figures remain genuinely disputed in the literature and are listed in
`DIMENSIONS.md`: Hawa Mahal's façade width (15 m vs 30 m) and Charminar's arch
height (20 m published vs ~14 m in the photograph).

---

## Work log — what was done, and why

Most items below are closed; the heading they sit under used to say "open work",
which stopped being true around item 4. Skim the titles, read the ones you need.

> **Statue of Unity — the other model's page was reviewed and rejected.** It
> arrived as a self-contained Taj-style scene (142 KB, three.js from a CDN). Its
> figure is a blocky robot: a faceless blob head, panel shoulders, no readable
> shawl, and in the postcard preset the statue **floats above its plinth**. Its
> scene has nothing the engine module lacks (dam, river, gardens, tour, weather
> are all already there). What was worth taking — a better-written tour and a
> close face view — has been ported. The engine module stays.

### 1. ~~Taj night floodlights~~ — done and seen

Nothing was resetting the clock. `?shot=` was read into `DEFAULTS.time`, but
`bindRange('time', …)` **syncs `state.time` from the `#time` input**, and that
input carries `value="17.35"` in the markup — trap 5, exactly. The tour preset
was never involved, and `window.__taj` already existed.

The fix in `build_taj.py` writes the parsed hour into the slider before
`bindRange` runs. `?shot=21.6` now boots at 21:36, slider, readout and sky
agreeing, and the five floods are visible at 130 / angle 0.70 / aimed at y 19
(the original 2600 blew the marble to pure white — that was the first thing
anyone saw of them).

The time-of-day chip was hard-set to Dusk at boot; it now highlights the
nearest preset.

### 2. ~~Amber Fort's court~~ — carved open, charbagh restored

The court was never roofed by the mesh the commit blamed. What covered it was
the **palace terrace itself**: the rock mass `block('stone', 190, 4.0, 68, 0,
38, -47)` and the marble capping `add(trim, box(191, 0.45, 69), 0, 42.0, -47)`
both span the whole platform, so the court was a 40 cm slot between the floor
at 41.4 and the capping at 41.78. The "x −112..−12" mass was the Jaleb Chowk
paving, a different court.

Both slabs are now laid as a frame around the court (x −11..11, z −49..−15),
which makes it an open sunken court ~0.8 m below the terrace, walled in stone.
The four beds are back at y 41.36 and were seen from two vantages: four green
quarters, marble cross-paths, the basin at the centre.

### 3. The Lotus's grey band — explained, not a defect

The entrance canopies render grey because the engine keeps ambient at
0.02–0.17 by design. The canopy mesh is `MeshStandardMaterial`, DoubleSide,
colour `f0e5d1`, emissive `000000` — the material is fine. Nine fixes were
tried and none moved it; the answer was in the light readings.

**Do not chase this again.** If it must be fixed, the honest route is a global
ambient/grade decision, not a per-page hack.

### 4. Detail shortfalls — all closed

| Monument | Was missing | Now |
|---|---|---|
| Kandariya | ~870 sculptures as two registers of flat boxes | seven-piece figures in warm-shadowed niches |
| CSMT | the carved menagerie | lions, peacocks, monkeys, elephants and snakes on the gable apexes and in the great arch's spandrels |
| Golden Temple | gold read matte | gold at metalness 0.72 reads as leaf |
| Konark | flat spokes | tapered beams with medallions |
| Meenakshi | four boxes per figure | seven-piece figures in a recessed register |

---

### 5. Meenakshi's figures — done

A figure is seven pieces now (ledge, dhoti flared at the feet, torso widening
to the shoulders, two arms, head, gold crown), standing on a cream ledge in a
warm shadowed recess, painted from a red/yellow/blue/pink/teal palette, at 1.10 m
spacing. The recess is **one dark band per face per storey**, not a niche box per
figure — same read, a fraction of the geometry.

The first attempt (nine pieces, a niche box each, 1.12 m spacing) **did not boot
at all**: no error, just a page that never reached `dataset.boot`. That is trap 2.
The numbers: 265k triangles before, 666k after, boot 85 s under software
rendering against `check_all.py`'s 200 s wait. Do not push past ~700k without
re-measuring.

---

### 6. Statue of Unity — done

Four faults, four fixes:

- **Head cropped.** Home and the Full view were at pos [188,104,312] target
  y 120; the crown at 240 m sat just above the top edge. Now [206,118,358]
  → y 128, and the tour's opening stop matches.
- **Bronze very dark.** The engine's bronze is metalness 0.9, and a metal with
  only a weak environment map renders near black. The module clones its own:
  colour b08a52, metalness 0.62, roughness 0.46, so the panels catch the key
  light. The shawl takes a slightly lighter tone (c49b62) so it reads as cloth.
- **Legs thin.** Radius 7.1−2.1v → 8.6−2.3v with a stronger calf, stance 7.6 → 8.1.
- **Shawl falls read as flaps.** They *were* flat 1 m boards: the two closing
  quads ran straight down at constant thickness. The fold now thins to 18 % and
  curls in at the hem, the ripple deepens as the cloth hangs, and the front
  opening was narrowed from ±33° to ±19° — at an 11 m chest radius the old gap
  was 7 m of bare chest, which is why it read as an open coat.

Numbers: 41k triangles, boot 37 s. The scene dump (`tools/` has no equivalent;
see the session notes) confirmed the figure is one merged mesh and the shawl a
second — worth knowing before hunting for a stray mesh.

---

### 7. Konark's wheels — done

The wheels were eight flat 0.17 m bars inside a thin hoop: a bicycle wheel, not
three metres of carved stone. Now each spoke is a tapered beam (0.09 at the rim,
0.15 at the hub), each half-spoke carries a medallion at mid-span, the hub is a
twelve-petal lotus rosette on a boss, the rim is 0.22 thick with a second ring
inside it, and the beaded rim went from sixteen blocks to twenty-four.

One false start: spandrel rosettes in the spaces between the spokes filled the
openings and the wheel read as a solid gold disc. They were cut. A wheel needs
its holes.

61k triangles before, 96k after, boot 46 s. Judge a wheel from about 6 m — the
named 'Wheels' view is far enough back that the medallions are three pixels.

---

### 8. The full repass — every page against the real building

Rendered all 24 at 560x350 into `shots/audit/` and compared each against the
building. Ranked by how far it is from reading as itself:

| # | Monument | What is wrong | State |
|---|---|---|---|
| 1 | CSMT | cream plaster and a **red tile roof** on a Kurla-stone Gothic terminus | **done** — Kurla buff, grey roof, grey forecourt |
| 2 | Basilica of Bom Jesus | **symmetric** facade with the bell tower hidden at the rear | **done** — one tall tower at the front right, as the church actually stands |
| 3 | Golden Temple | **done** — the fault was the tank, not the shrine: distortion 0.9 made it a mirror of a pale sky | done |
| 4 | Somnath | **done** — pale sandstone, sea visible again; shikhara still reads stepped | done |
| 5 | Hawa Mahal | **done** — domed skyline on the top tier; Jaipur pink | done |
| 6 | Mahabodhi | **done** — the tower was 24.5 m wide on a 52 m height; it is 15.5 m | done |
| 7 | India Gate / Gateway of India | **done** — Gateway warm basalt + dome raised; India Gate's INDIA is letterforms | done |
| 8 | Meenakshi | towers read as striped office blocks at distance | todo |
| 9 | Statue of Unity | **rebuilt this pass** — face sculpted into the head, one-shoulder shawl, legs and dhoti; still stylised in the body | partly |

Clean: Taj, Qutub Minar, Charminar, Mysore Palace, Victoria Memorial,
Mehrangarh, Rani ki Vav, Sanchi, Lotus, Shore, Konark, Amber, Jantar Mantar,
Kandariya.

---

### 9. Statue of Unity — the figure rebuilt

The user called this the worst model on the site, and was right: it read as a
smooth bronze mannequin.

| Fault | What was actually wrong |
|---|---|
| a blank egg for a face | every feature was placed at a **fixed z** while the head loft's front sits at z 6.4–7.7 by height, so the jaw and chin were buried inside the head and the eyes floated off it |
| a mask of blobs (first fix) | a 21 m head is too big for stuck-on spheres — bulging cheeks, a bar across the brow, a slab of moustache |
| rivets down the chest | five 1 m spheres standing 0.9 m proud: a jacket placket that read as buttons |
| an open coat | the shawl wrapped **both** shoulders |
| stick legs | 8.6 − 2.3v with no calf |
| flat cloth | dhoti pleats 0.085 deep at the hem |

Now: the face is **carved into the head surface** as a smooth displacement —
nose ridge, brow, sunken sockets, cheeks, moustache, mouth line, chin — at 44×30
resolution. The shawl is an uttariya over the left shoulder only, with folds that
deepen as it hangs. Legs 9.6 − 2.4v with a calf, stance 8.5. Dhoti folds 0.15
deep with a rolled hem band. Bronze is patinated (metalness 0.56), not brass.

**Drapery and anatomy pass (same session):**

- the arms are separate swept tubes, and their spine had been pushed out to
  x 22 — the arm's outer edge sat **8 m beyond the shoulder line**, which is
  what made the shoulder read as a cape. The spine now keeps `x + r` on the
  shoulder line down to the wrist, so the arms hang close as they do on the
  statue
- a deltoid sphere over the joint was tried and **cut again**: it read as a
  shoulder pad. The shoulder is rounded by the torso's own profile, which
  dropped 4.2 m in 2.9 m and stepped
- six soft vertical folds down the kurta (0.62 m proud, tapering at both ends)
- the hands were a ball with four loose cylinders beside it; now a palm, heel,
  four jointed fingers and a thumb
- the waist knot was three cubes, now one folded mass

**Still not right:** the head sits slightly small on a long neck, and the
shoulder-to-arm junction is a union of two surfaces rather than one blend — it
holds at the site's viewing distances but not at 6 m. A single field that fuses
torso and arms (the `smin` in the module is currently dead code) is the honest
fix if this page is revisited.

---

### 10. Golden Temple — the tank, not the shrine

The audit note said "shrine too small for the tank". That was wrong. The plan
is 12.25 m on a 20.4 m platform in a 148 m tank — a 1:7.3 ratio, which is what
the building actually is, and `DIMENSIONS.md` has it right.

What was wrong was the **water**: `distortion: 0.9` on the engine's Water
shader left the tank a near-perfect mirror of a bright sky, so the tank read as
a pale marble floor continuous with the deck. With the tank invisible there was
no island, and the shrine looked lost on a plaza. Distortion 4.2 and a darker
water colour restore the pool, and `fogScale: 0.34` clears a courtyard that was
sitting in open-country haze.

Still soft: the parikrama wings are 9.2 m blocks where the real arcades are
taller and much more ornate, and the dome is the documented 5.9 m rather than
the larger mass photographs suggest.

---

### 11. Somnath — pale stone, and a sea that was never drawn

Two faults, and one of them is a trap worth keeping:

- **The stone.** The module named its materials `basalt` and `basaltDark`, which
  are pale tans in this engine — but the render came out dark grey-brown. The
  temple is light stone; the masses are now tinted 0xd9cfb4 / 0xc2b598 and the
  carved trim reads.
- **The sea was invisible.** `water.y` was -0.5 and the engine's ground plane
  sits at -0.02, so the whole Arabian Sea was **under an opaque plane** and
  never drew. That is why the site read as a desert plain. The water is at
  +0.08 now, running from behind the sea wall at z -36 to the horizon.
  **Any module whose water y is below `groundY` (default -0.02) has no water.**
- The ground was a brown checkerboard from the paving texture at a 12 m tile;
  it is a stone precinct at a 30 m tile now.

The shikhara read as a **pinecone**, not a stepped pyramid. The fault was three
rings of sixteen miniature spires across its faces: at four segments each, half
of every cone is in shadow, so a hundred of them speckled the tower dark. The
face rings are gone; the spires sit at the corners only, where they step the
silhouette, and the vertical ribs and horizontal bands carry the surface. The
spires were also `ST2`, the darker tone — they are the tower's own stone now.

---

### 12. Hawa Mahal — a domed skyline, and a colour that would not change

Two faults:

- **A flat top.** The screen ended in a plain parapet. Five domed chhatris now
  stand along the parapet of the top tier, which is what gives Hawa Mahal its
  stepped, domed skyline. A fifth full jali tier was tried first and **broke the
  boot** — 953 pierced screens is already near the limit, another tier's worth
  never reached `dataset.boot`.
- **Brick red, not Jaipur pink.** Two passes at the tint changed nothing, and
  the reason is worth keeping: the tint was cloned from `sandstonePink`, whose
  **texture map multiplies the colour down by about half**. The clone is taken
  from `cream`, which has no map, so the hex is the colour you see.
  **Tinting a textured engine material will not give you the swatch.**

---

### 13. Mahabodhi — the tower was twice its real width

The audit said "curved shikhara; the real spire is a straight tapering brick
tower". The profile was already straight; the width was not. `S0` — the sikhara
at its base — was **24.5 m**, which on a 52 m tower is a 1:2.1 ratio. The
literature gives a 15 m base on 52 m, about 1:3.5, and the photographs agree:
the tower springs at roughly half the width of the frieze storey below it.
`DIMENSIONS.md` had 30 m marked "(photo)" against a literature figure of 15 m —
the photo reading was of the *plinth*, not the shaft.

At 15.5 m it reads as the slim brick tower it is. The horizontal bands had to
come in with it: at w + 0.07 they jutted like shelves once the faces were
narrower, so they are w + 0.02 and the bhumi-amalaka bands w + 0.11.

---

### 14. India Gate and the Gateway of India

**Gateway of India.** Two faults, one shared with Hawa Mahal: the masonry was
cloned from `basaltDark`, a **textured** material, so the hex multiplied down by
half and the gateway rendered grey instead of warm buff-brown basalt. Cloned
from `cream` at 0xc9a878. And the 15 m dome's crown cleared the front parapet by
1 m, so from the plaza the monument was a flat-topped block with four turrets
and no dome — raised 3 m, apex ~25 m against 25.3 m in the sources.

**India Gate.** The "INDIA" inscription was **fifteen vertical bars**, which
read as a barcode across the attic. It is letterforms now — I, N, D, I, A built
from boxes, in the recess colour so they read as incised. Verified from the home
camera: it reads INDIA left to right there. Do not judge it from an arbitrary
camera angle; two of my checks looked reversed because of where the camera was.

---

### 15. The tint audit, and two more that read wrong

`tools/tintcheck.py` scans every module for `ctx.mat('<name>')` used as a clone
base and flags the ones whose material carries a **texture map** — the map
multiplies the colour, so the hex you write is roughly twice what you get. Eight
clones are on textured bases; most are deliberate (a dark niche, a grey). The
check is there so the next one is caught before it ships.

Two more pages read wrong on the fresh contact sheet:

- **Sanchi** — the great stupa's plaster dome was yellow-green. It was `plaster`
  (textured, warm) under a huge `foliage` mound that bounced green into it. The
  dome is a pale untextured tint now.
- **Jantar Mantar** — the instruments were saturated pink-red, because the
  materials were literally named `sandstonePink` and `sandstoneRed`. They are
  lime plaster over rubble: pale warm ochre. Both are tinted off `cream` now.

**Meenakshi's gopurams** — done. They read as striped office blocks because the
figures were 2.24 m tall and 1.06 m apart: **pencils on a shelf**. Every
cross-section is widened about 1.5x (dhoti, torso, arms, head, crown, ledge) so
a figure has a body, spacing came in to 1.06 m, and the cornice went from 22 %
of each storey to 16 %. The cornices were also `cream` (0xe6d6b8) against ochre
walls, so every storey was capped by a bright white band — they are a shade
darker than the wall now and read as shadowed mouldings.

688k triangles, boot 80-120 s. That is close to the ceiling: the page takes
three attempts' worth of waiting under software rendering, and another tier's
worth of jali would not boot at all.

---

### 16. Kandariya and the Golden Temple's gold

**Kandariya.** Each "sculpture" was one flat box, two rows of them — a dashed
line across the wall at any distance. A figure is seven pieces now (niche,
pedestal, dhoti, torso, two arms, head). The niche was `dark` (0x0f0c09), so
every register read as a black stripe on a cream wall; it is a warm shadow now.
37k -> 62k triangles.

**Golden Temple.** The gold was the engine's `gold`, metalness 1.0 — and a metal
with only a weak environment map to reflect renders dark and flat. Cloned at
metalness 0.72, roughness 0.30, brighter hex. The shrine reads as gold leaf now,
with its reflection in the tank.

Trap worth remembering: a blanket `s.replace("'gold'", "GD")` also rewrote the
arguments of the helper that defined GD, producing `const GD = gilt(GD, …)` —
a self-reference that throws at module evaluation and shows up as **a page that
never boots**, not as a syntax error. Check the definition site after a
repo-wide key rename.

---

### 17. Golden Temple wings, and the tint trap's fourth and fifth victims

**Parikrama.** The wings were 9.2 m blocks with square-headed slots. They are two
full storeys of white marble arcade now, 12.4 m to the cornice, with **arched**
openings (arch + archFrame) on both storeys, a string course, a parapet and the
chhatris riding up with it. 74k -> 151k triangles: arches cost more than boxes.

**Somnath and CSMT** were both still tinted off **textured** bases, so their
stone kept rendering darker than the hex however the hex was set. Both are
cloned from `cream` now. That is the trap's fourth and fifth victim — Hawa Mahal
and the Gateway were the first two. Somnath's default hour also moved 10.6 ->
15.4; at 10.6 the pale stone read grey-brown from the home camera.

`tools/tintcheck.py` still reports 7 clones on textured bases, all deliberate
(a dark niche, a grey roof, Konark's stone). Run it after any colour work.

---

### 18. The contact sheet, and two last things it found

`shots/audit/` holds all 24 at 560x350 and `sheet_a.jpg` / `sheet_b.jpg` are the
contact sheets — regenerate them with the throwaway script in the session notes
(4x3 grid, labels, 2280x1160). Two things only a sheet shows:

- **Rani ki Vav was orange.** `sandstoneBuff` is a warm tan under a warm sun;
  the stepwell is pale grey-beige sandstone. Cloned from `cream` at 0xcfc2a6.
  Sixth victim of the texture-map trap.
- **The Taj tile was a loading screen.** `check_all.py` screenshots 1.8 s after
  `is-ready`, and the Taj's first frames are heavy enough that the intro overlay
  is still fading. It needs ~12 s after `__tajReady`; use a raw Playwright
  script for that page rather than `check_all.py`.

---

### 19. Konark's stone

The temple is **khondalite**, a warm brown-ochre that weathers grey-green, with
chlorite for the carved detail. The module had it as `granite` tinted 0x8b8878
and `sandstoneBuff` tinted 0x9d9a86 — grey hexes off textured bases, so it was
halved twice over and the temple rendered cold grey.

Both are tinted off `cream` now: 0xa8815c for the mass, 0xc6a274 for the carved
detail and the wheels.

Shore Temple was checked at the same time and left alone: Pallava granite really
is a dark grey-brown, and the page reads correctly for what it is.

---

### 20. The repo's gallery was three sessions stale

`docs/gallery.jpg` is the repo's own record of the 24, and it still showed every
model from before the repass: Jantar Mantar orange, Somnath dark, Konark cold
grey, Hawa Mahal brick red, the Gateway grey, Meenakshi's office blocks.

`tools/build_gallery.py` rebuilds it from `shots/audit/` — 4 columns, name and
place/era under each tile, 1550x1710. Run it after any pass that changes a page.

The Taj tile needs `taj_tile.py`-style handling (12 s after `__tajReady`, with
`#info`, `#panel` and `#cluster` hidden) or it catches the intro overlay and the
demo page's credit block.

`docs/preview.jpg` is the README hero and is a *photograph*, not a render — it
does not go stale with the models.

---

### 21. The other model's statue page — what was taken, what was rejected

Reviewed the 142 KB self-contained page produced elsewhere. Rendered it at its
own presets (`postcard`, `face`, `profile`, `aerial`).

**Rejected:** the figure. It is a blocky humanoid — faceless rounded head with a
single nose bump, shoulders as separate panels, a segmented lower body, and in
`postcard` the statue floats clear of its plinth. The scene is no richer than
the engine module's: dam, river, gardens, tour, weather and floodlights all
already exist here.

**Taken:**

- the **tour**, rewritten from 6 stops to 7 with better copy: the Iron Man
  history, the walking pose with the 565 panels and 1,700 t of bronze, Sadhu
  Bet, the gallery at 153 m, the dam, and the light of unity
- one **corrected fact**: their dam height of 138 m is the head above the
  riverbed; the figure that matters is **163 m from the deepest foundation**,
  with the dam 1,210 m long (SSNNL, NCA)
- a **'The face' view** at [0, 221, 122] → [0, 213, 0], so the sculpted face can
  actually be looked at — the page had no way to see it

**Found while checking the new stops:** the tour cameras stood 120-180 m from a
182 m figure, and at fov 40 that frames 90-130 m vertically — so every stop was
a bronze wall with the head cut off. All the figure stops now sit ~330 m out,
centred on y 148 (the figure spans 58-240), which is the distance that fits 182 m
in the frame. Render a tour stop before believing it.

Two things to keep in mind for the next file that arrives: it is worth rendering
someone else's page at *its own* presets before judging it, and a pasted page
dropped into `monuments/` for a look must be deleted again — `linkcheck.py`
counted 27 pages until the probe was removed.

---

### 22. Statue of Unity: the stride

The tour text now says he was modelled mid-stride — which he was not. The figure
stood square, and the walking pose is the statue's signature. The legs and feet
carry a `zoff` of ±7.5 m now, so one leg is stepping through and the weight is
on the other, and the feet travel with their legs.

Worth knowing: the dhoti hem at t 0.295 leaves 45 m of bare leg on a 182 m
figure, which is 25 % of the height — that is what the photographs show, so it
is right, but it reads as a short tunic until the stride is in.

---

### 23. Frame check — the statue's bug was not unique

`tools/framecheck.py` measures every named view and tour stop: the distance to
its target, the vertical extent that distance covers at the camera's fov, and
whether that is enough for the building's published height. It is a report, not
a verdict — most flags are deliberate detail views ("Portal", "Carving", "Flag",
"The face"), and the ones worth acting on are those *named for the whole
subject*.

Fixed from it: Mahabodhi's "The tower" (framed 24 m of 52) and "From the east"
(34 of 52), CSMT's "The Clock Tower" (32 of 48.8), Somnath's "Fifty Metres"
(35 of 50), and the statue's "Light of Unity" (184 of 240).

Two more of the same class: Kandariya's "From the north" (22 m of 31) and
Charminar's "Fifty-Six Metres" (35 of 56).

Three things learned:

- a 5 % margin is not enough when the camera looks up at the subject — the tower
  was still clipped at 51.7 m of 52 until the frame was 64 m tall
- the **model is often taller than the published figure**: Kandariya's 31 m
  temple sits on a jagati platform, so framing to 31 m still cut the finial.
  Pull back until the render says so, not until the arithmetic does
- a "The tower" view that shows half the tower is a defect, while a "Carving"
  view that shows a metre of wall is not

Of the 122 flags, these seven were the whole-subject ones. The rest are
deliberate close-ups and should be left alone.

---

### 24. The front page, and a false diagnosis I had to undo

**Real:** the lede opened "No photographs, no downloaded models" directly above a
credited photograph of the Taj. Reworded to "No downloaded models…" — the claim
is about the gallery, which is true. The photograph keeps its credit line.

**Not real: "two cards had no thumbnail."** I generated thumbs for
`sanchi-stupa` and `victoria-memorial` on the strength of a broken-image count,
committed them, and wrote it up as a finding. It was wrong. The card builder
takes its stem from the **image filename**, not the monument id, so the cards
asked for `thumb/sanchi-900.jpg` and `thumb/victoria-memorial-kolkata-900.jpg`,
both of which existed all along. The four generated files were unused and have
been deleted.

What made the false reading possible, and how to avoid it:

- `loading="lazy"` leaves offscreen images unrequested, so `naturalWidth === 0`
  means "never asked for", not "broken"
- a single-threaded `TCPServer` drops requests when 24 images load at once — the
  same page gave **0, then 9, then 15** "broken" across runs with no code change
- **`linkcheck.py` already covers this**: it parses `src` and `srcset` in the
  generated HTML, and it reports the file when one is removed (verified by
  removing `amber-fort-900.jpg` and watching it name it twice)

The lesson is the one already in the traps list and which I ignored: when a
measurement disagrees with the files on disk, doubt the measurement.

---

### 25. Mobile, verified

Every render in this session was landscape until now. Checked 390x844 on
Charminar and Konark: the header collapses to a bar, the monument frames
correctly, the control panel collapses below the fold and there is no horizontal
overflow, and the tour card sits above the bottom edge with its controls
reachable. The README's claims about phones hold.

Two notes for whoever repeats this: `#panel` sits at y 852 in an 844-high
viewport when closed, so "below the viewport" is correct, not a bug; and the tour
card's id is not `#tour-card` on the engine pages, so select it by its visible
text or class rather than assuming the Taj's id.

---

### 26. The Taj carried a debug FPS chip

The page is generated from the original three.js demo, and that demo mounts an
FPS/MS/MB monitor unconditionally at `top:0;left:0;z-index:10000`. Every visitor
saw **"0 FPS (0-1)"** in the corner of the flagship page; the only rule that hid
it was `body.cinematic .stats-root`.

The code is still there and still works — `build_taj.py` now mounts it only when
the URL carries `?stats`, and the two `stats.begin()/end()` calls in the render
loop are guarded on the panel being attached. The engine pages never had one.

Worth looking at the Taj's own UI rather than only its geometry: the tour and
views frame correctly (checked stops 1 and 2), and this chip was the one thing
on screen that said "unfinished".

---

### 27. The shortcuts and the drawer — tested, and they work

`H T A C R 1-9 Esc` are documented in the README and had never been exercised.
They all work, and so does the history drawer (history, facts table, UNESCO ref).
No fix was needed.

Getting to that answer took three attempts, all of them my own error:

- the first test read `document.body.classList.contains('cinematic')` — the
  **Taj** page uses `cinematic`, engine pages use **`cinema`**
- the second selected `aside` for the drawer, which matched the control panel
- only after checking the handler did the page turn out to be fine all along

`tools/check_ui.py` now asserts all six behaviours against a real page, so the
selectors live in one place instead of in my head. That is the point of it: I
got them wrong twice, and a test that encodes them cannot.

---

### 28. CI was green; now it also guards the tint trap

`gh run list` on the last eight pushes: every `site` run and every
`pages-build-deployment` succeeded. The workflow already rebuilds and fails on
stale generated pages, runs `linkcheck.py` and `audit_data.py --strict`.

It did not run `tintcheck.py`, which is the guard for the trap that has now cost
six monuments. Added, in a form that can pass:

- `tools/tintcheck.allow` lists the five deliberate textured-base tints
  (amber's sandstone, lotus's two marbles, meenakshi's wall and niche)
- `--ci` fails only on tints **not** in that list, and names the file, line, base
  and hex
- verified by injecting `ctx.mat('granite').clone()` into Konark: exit 1, naming
  `konark-sun-temple.js:86`; removed, exit 0

The rest of the workflow is unchanged. Reproduced every CI step locally before
committing: rebuild produces no diff, 0 errors, 26 pages resolve, 0 new tints.

---

### 29. Statue of Unity — the figure rebuilt against the turnaround

The user sent five 3D-model listings (Sketchfab store, FAB, Meshy) and two
renders of a sculpted figure, and chose the procedural route: rebuild the figure
with the turnaround as modelling reference, no imported mesh, so the site's
"No downloaded models" claim and its CC BY-NC licence both stand. What the
reference showed the model getting wrong:

| Fault | What was wrong |
|---|---|
| shawl | a one-shoulder uttariya. The reference is a chaddar over **both** shoulders — hem at 0.53 of height in front, 0.44 at the back, the opening widening downwards |
| legs | bare bronze below a hem at t 0.295, 25 % of the figure. The dhoti is wrapped round the legs to just above the ankle — "Patel's dhoti-clad legs and sandalled feet" — which is also why the base is narrower than the shoulders |
| skirt | hem at 0.295 and 41 m across; the reference is 51 m across with its hem at 0.39, turning in at the edge |
| feet | three spheres and three boxes: boulders beside a skateboard. A lofted foot now, flat sole, five toes, instep strap, heel strap |
| head | 14.6 m across on a 21.5 m height read as a narrow head on a long neck; the reference is 17 m. The crown was an open ring and there was no hair |
| face | a 0.95 m moustache bump. Patel is clean-shaven |
| placket | no buttons. Five discs now, and sleeve cuffs at the wrists |

Technique worth keeping:

- **Two shells whose thickness fades to nothing at the edge** is what makes cloth
  read as a garment. The old shawl closed its front edges with flat quads standing
  beside the arm, which is exactly what read as "flaps". The thickness now falls
  to zero at the hem, the collar and the two front falls, so the shawl is one
  closed lens, and a tube swept along each edge gives the rolled seam.
- **A loft that runs along z winds its rings the opposite way to a vertical
  loft.** The foot came out inside-out — dark, and invisible from the front —
  until the index order was reversed. A surface that renders dark with a sane
  material is a winding bug, not a lighting bug.
- **A hard `cap()` window cuts a feature off with a step**: the brow read as a bar
  and the nose ridge as a fin. `exp(-(v/w)^4)` is flat in the middle and dies
  smoothly.
- **Folds have to be metres deep to read.** 0.6 m of ripple on a 182 m figure is
  invisible; the gathers are 1 m and up.

**Second pass, same session — drapery and face.** Folds that only vary with the
bearing stand up as vertical ribs and the shawl reads as a corrugated cone; they
now shift phase as they fall, so they run on the diagonal. The cloth pinches in
under the shoulder where it takes its own weight, swells over the shoulder bone,
and its top edge rides the shoulder line (t 0.856 at the collar down to 0.80 at
the shoulder point) — at one constant t it cut across the shoulders and showed
as a flat plate round the neck. Rows are bunched at the top for the same reason.
The face's big forms were pushed (nose 1.95, sockets −0.85, brow 0.95) because
at the page's own face view — 122 m — the shallow version read as a blank head;
the fine detail stays for the close look.

Still not right: the shawl's front falls hang as two panels rather than falling
in folds, the skirt reads a little like a tutu at the front, and the face is a
displacement, not a portrait — the eyes have no lids and the mouth is a groove.
51k triangles, boot 65 s under software rendering.

---

### 30. Meenakshi's gopurams — one generator, and the cost is items not triangles

The roadmap's first Tier 1 item, after three cosmetic passes had failed. The
towers read as office blocks with window rows because the silhouette was a
straight stair: every storey stepped in by the same factor, with a square corner
at each tier. What changed:

| Fault | Fix |
|---|---|
| straight-stair taper | storey width = 1 − K·u^1.45, so the sides lean in on a shallow concave curve; K is still derived from the documented base and top widths |
| square corners | the four corners are chamfered with a 45° block, so the plan reads octagonal |
| one-slab cornice | three mouldings, each standing further out, plus a terracotta fillet and a row of kudu faces |
| no vertical rhythm | corner pilasters the height of the storey, over the horizontal cornice rhythm |
| confetti registers | the palette is mixed a third of the way to the wall's ochre, and the recess behind the figures is a warm shadow rather than near-black |
| a plain base | granite plinth, pilasters flanking the gateway, a threshold and a deep cornice over it |
| a white tube for a crest | a stepped upapitha under the barrel vault, a decorated screen at each end and a ridge of kalashas |

**The finding that matters: boot time is spent on the number of geometry items,
not on their size.** Ninety-odd figures a face, built as five separate pieces
each, was 460 items a storey — 25,000 items on the four rajagopurams — and the
page took 217 s to boot at 595k triangles. The same rows emitted as three merged
strips per face (one per colour) is 12 items a storey, and the page boots in
87 s at 373k triangles, with the figures *denser* than before (1.0 m spacing)
and now carrying arms. Anything that adds a piece per figure, per bay or per
kuduhas to be paid for in seconds of boot, not in triangles.

`tools/check_a11y.py` on this page could not be run in the sandbox this session:
the page's boot plus the check exceeded the 300 s per-command budget twice. The
change is geometry only and the page markup is regenerated by the same template,
so the DOM the check reads is unchanged apart from the asset hash.

---

### 31. The Lotus — a petal is not a leaf

The roadmap's last Tier 1 item. The ring parameterisation was right and the
petals still read as leaves, because a lotus petal is doubly curved and the old
one was a bent sheet: one shallow arc across the width, open edges, a knife edge
for a silhouette.

| Fault | Fix |
|---|---|
| one arc across the width | three: a keel up the centre (`keel·(1−v²)^1.5`), the flanks cupping back toward the flower's axis (`−wrap·v²`), and the rim turning out again near the edge |
| an open sheet | two surfaces offset along the **true normal** (finite differences, not the radial direction) and joined by a rim strip down each side, so the edge is a thin lip |
| petals narrower than their neighbours | each ring's petals are now wide enough to almost touch: a ring of nine at radius r has 0.70 r between centres, and the width follows from that |
| entrance leaves like flat blades | a `droop` term, so the height falls again after its maximum and the leaf arcs over its own tip — a monotonic u^yPow cannot do that |
| the bud closed to a garlic point | the inner ring's tip radius went 4.0 → 6.5 m |

Still soft: the entrance leaves' tips come out blunt rather than pointed, and
the inner ring's petals close a little too evenly — no two petals on the real
building are quite the same.

`tools/check_a11y.py` on this page was not re-run (the sandbox's per-command
budget); the change is geometry only.

---

### 32. Qutb Minar — an inscription band, and a correction to the brief

The roadmap's first Tier 2 item, and it carried a factual error: the bands are
**naskh**, a cursive hand, not the angular Kufic the roadmap named. Wikipedia
("inscribed in naskh"), Archnet ("Nakshi inscriptions") and the six Quranic
bands on storey 1 all agree. `DIMENSIONS.md` now records the count and the
script with a source per row.

What was there was a ring of identical 0.30 m blocks at 0.62 m spacing: a dashed
line round the shaft, which is what "the marble is colour, not inscription"
meant. What is there now:

| Was | Now |
|---|---|
| a ring of identical blocks | a connected row of letters: a baseline stroke running into the next glyph, a stem of varying height, a loop or a dot above, an occasional descender |
| an even grid | an advance that varies per glyph, seeded per band so no two bands repeat round the tower |
| nine bands in the wrong places | six on storey 1, two each on storeys 2 and 3, one on storey 4 |
| one geometry item per block (hundreds per band) | one geometry item per band |

**Two things learned the hard way here.** An even row of separate stems is a
picket fence whatever colour you make it — writing has to be connected, so the
baseline stroke between glyphs is what turns the row into a script. And the
first attempt put light letters on a dark ground; carved lettering is dark
lettering in a light course, so the ink and the ground were the wrong way round.

**And the trap bit a seventh time.** The ink was first cloned off
`sandstoneBuff` — a textured base — so it rendered at half the hex and
`tintcheck --ci` failed on it, after the commit was written. It is off `cream`
now, at 0x4a3a2c. The check did its job; the lesson is to run it before
committing, not after.

Still soft: the bands stand a little proud of the fluting, where the real ones
are flush, and the letters are a rhythm rather than a text.

---

### 33. Charminar — the stucco, and an offset measured from the wrong place

The ornament was frames and discs on bare plaster. What the building is actually
made of, at the scale the site is viewed from, is the lotus-petal fringe: a row
of pointed petals under every cornice and round every balcony.

| Added | Where |
|---|---|
| lotus-petal fringe | under the cornices of all three storeys, and a ring of 24 round every minaret balcony — the detail that makes a minaret read as a minaret rather than as a pipe with rings on it |
| blind-arch rows | the spandrels either side of each great arch (`carvedBand`, motif `arch`); bare plaster beside the arch was the plainest thing on the building |
| two hood moulds | round each great arch, whose edge was a raw cut through the pierced wall — the portal read as a hole in a cardboard box |

A petal is a four-sided pyramid, six triangles, and a whole row is one geometry
(§30 again). The fringe rows cost 1.7k triangles each and 12 geometry items
between them.

**The mistake worth recording:** `fringeFace` took an offset and added it to the
face's own coordinate, which already sits on the face — so every fringe was
placed a half-width out in mid-air, and the home view showed rows of dark dashes
floating beside the tower. When a row of detail appears detached from the thing
it belongs to, check whether its offset is measured from the face or from the
centre.

Still soft: the archivolt has no petal fringe of its own (the real ones do), the
spandrel rows are three niches where the building has many, and the plaster
itself is still one flat colour.

---

### 34. Hawa Mahal — the bay was twice as wide as the building's

The roadmap's complaint was "one casement per bay against 953 real ones". The
count was not the fault; the bay width was. A 1.4 m bay gave each jharokha a
shopfront, and no amount of lattice inside it makes a row of shopfronts read as
a honeycomb.

| Was | Now |
|---|---|
| bays 13 / 11 / 9 / 6 (1.4 m each) | 19 / 16 / 12 / 8 (0.95 m each), 55 casements |
| each screen cut 3 × 4 | 3 × 5 — fifteen cells a screen, 825 across the facade |
| base arcade 9 arches | 13, at the same spacing as the tiers above |

The screens are `ctx.jali` extrusions cached by shape, so the extra bays cost
geometry items, not new geometries: 78k → 105k triangles and the boot *did not*
get slower (45 s). That is the same lesson as §30 in the other direction — the
cheap thing to add here was density, because the panel was already one item.

Not modelled: the 953 count is for the whole facade's latticework, and this is
one face with 825 cells; the side and rear wings are plain walls.

---

### 35. Konark — the deul, and two hours lost to the birds

The roadmap asked for the wheels. The wheels were already right: an earlier pass
gave them tapered spokes, mid-span medallions, a twelve-petal lotus hub and a
beaded rim, and they read correctly at 6 m. What was wrong was the **deul**, the
collapsed main tower, which was a stack of axis-aligned boxes with a few
scattered blocks on top — a concrete bunker beside a fine jagamohana.

| Was | Now |
|---|---|
| boxes of the same width, stepping in abruptly | six courses that step in on a taper (30 m → 11 m), each with a string course at the step |
| nothing at the corners | a buttress on each corner of every course |
| fourteen small relief boxes on two faces | a register of eleven blind arches on each long face of the four lower courses |
| scattered blocks for the broken crown | a continuous ragged crown — spaced apart, the blocks read as specks against the sky |

**`carvedBand` puts its motifs on local +z.** Called without `ry`, the band on a
−z face buries its arches inside the wall and leaves only the dark field showing
— which is why the first attempt at the registers rendered as black slots. Pass
the face's own rotation.

**And the specks I chased through two renders were the engine's birds.** They
have been in every Konark render since the first, they are not mine, and they
are supposed to be there. Added to the do-not-re-chase list at the top of this
file.

Still soft: the deul's registers sit in a deep shadow so the field reads almost
black, and its plan is still square where the real one is star-shaped.

---

### 36. Kandariya — the shikhara was a string of beads

The roadmap asked for the 870 sculptures. Those had already been rebuilt as
seven-piece figures in warm-shadowed niches, and they read correctly. What was
wrong was the tower they sit on.

| Was | Now |
|---|---|
| each urushringa a straight cone, 1 : 3 wide to tall | a miniature of the tower: the same curvilinear profile, an amalaka and a stone finial |
| four of them overlapping up each corner | five rows climbing each corner, each shorter and narrower than the one below |
| eight more on every face, every row | one pair on each face, on the lower three rows only |
| a gold cone on every one of them | stone, so the gold no longer draws a necklace of points |
| 22 courses in the warm trim colour | in the tower's own stone — as trim they read as painted orange dashes across the shikhara |

The lesson generalises: a subsidiary element has to be a *scaled copy of the
thing it clusters round*, not a simplified stand-in. A cone is not a small
shikhara, and forty of them read as a row of beads however carefully they are
placed.

Still soft: the figure registers read as dark slots at the home distance, and
the mandapa roofs' corner spirelets are thin pins.

---

### 37. CSMT — the menagerie was there and invisible

The roadmap said the carved animals were absent. They were not: `beast()` builds
a lion, peacock, monkey, elephant and snake from primitives and put one on every
gable apex and a pair in the great arch's spandrels. They were 0.85 m tall on a
26 m building, in the wall's own cream — four pixels at the home view, the same
tone as the sky behind them.

| Was | Now |
|---|---|
| 0.85 m on the gable apexes | 3.0× — a 2.5 m animal, which is what the building has |
| 1.0× in the spandrels | 2.2× |
| the wall's cream | a shade darker (0x6a5f4d off `cream`), because weathered stone reads darker and that contrast *is* the silhouette |

Two things worth keeping. **A detail can be modelled, correct and still absent** —
the question to ask of every ornament is not "is it there" but "at what size, in
what tone, against what background". And a sub-metre ornament on a 26 m facade
needs to be three times bigger than instinct says; the instinct scales to the
building, the eye does not.

Still soft: the beasts are silhouettes at the home distance and only resolve at
about 15 m; the arcade's capitals are plain.

---

### 38. Mahabodhi — the niches hold images, and a silent no-boot

The tower is covered in niches holding images of the Buddha; each niche here was
a black box, so the faces read as three columns of dashes.

| Was | Now |
|---|---|
| a black box per niche | a seated Buddha in the recess — crossed legs, body, head, three tapered prisms — with the box left behind it as shadow |
| one item per niche (120 of them) | one merged geometry per row of three, so the count barely moves |
| a fence of posts round the site | a continuous coping over the vedika, which is what makes it a wall of stone |

**The no-boot.** `buddhaRow` was written with `new T3.BufferGeometry()`, copying
the idiom from the other modules — but this module never destructured `T3` or
`THREE` from `ctx`. The result was a page that never reached `dataset.boot`, with
**no console error at all**: the engine catches the build's exception and shows
its own failure state. That is trap 2's cousin, and the fix is to check the
destructure line before writing a new geometry helper. `THREE` is bound now.

Still soft: the figure fills its recess but the lower half sits in shadow, so at
the home distance a niche reads as a dark slot with a pale head in it.

---

### 39. The Basilica — an interior, and why lights did nothing

The tour used to say "the interior, with its gilded altars and painted ceiling,
is not modelled here". It is now: the nave was one solid block and is hollow,
with two long walls, an east wall pierced by a chancel arch, a boarded ceiling,
the gilded retable at the east end, two side altars, the chapel of the relics
with its casket under glass, pews, and a named **Interior** view.

Three things cost time and are worth keeping:

- **`ctx.light` is not a light.** Every light spec becomes a *SpotLight* whose
  intensity ramps with the time of day — they are floods, and at midday they are
  off. Raising the interior lights from 1,100 to 5,200 changed nothing at all,
  which is the tell: when a change has *no* effect on the render, the value is
  not being read.
- **A rotated open cylinder does not make a vault.** `cyl(r, r, len, 26, true)`
  with `rx: π/2` gave two lit flanks and a band of nothing down the crown. Two
  sloped boards cannot miss — there is no back face to get wrong.
- **A midday interior is lit by ambient alone**, and the engine's ambient is
  deliberately low (§7). The inner faces are lined with faintly self-lit plaster
  instead, which touches nothing outside and is what light off lime-washed walls
  looks like at this scale.

Still soft: the pews read as dark silhouettes, the ceiling's outer boards are
dim, and the chancel beyond the east wall is not modelled.

---

### 40. Sanchi — the railing had no coping

First Tier 3 item taken, and a small one. The vedika had posts and three rails
and nothing over them: at any distance it read as a fence of sticks with a gap
above it, when the top of Sanchi's railing is a continuous course of rounded
coping stones in every photograph.

| Added | Where |
|---|---|
| a coping course (two courses: the stone, then its plaster cap) | the full length of both railings, broken at the four gateways like the rails |
| a lotus boss on every third post | both railings |

The same vocabulary as the Mahabodhi vedika (§38) and the Charminar frieze
(§33): a railing is posts, rails **and** a coping, and it is the coping that
makes it read as a wall of stone rather than a fence.

---

### 41. Mysore — cusped arches, and why semicircular lobes failed

Every bay of the palace carried a plain round head; the real verandah is cusped
on every bay. A local `cuspedShape(w, h, n)` now drives both the openings in the
pierced panel and their frames.

**The first attempt was worse than what it replaced.** Each lobe was a
semicircle of radius `w/2n`, which on a 6 m opening with five lobes is 0.6 m —
so the head was 0.6 m deep on a 6.6 m arch and every opening came out a
rectangle with a scalloped fringe over it. A multifoil head has to be a third of
the opening's height, and that means the lobes are **pointed**: each one is two
quadratic curves meeting at an apex, not a semicircle.

The cost is triangles — 85k → 166k, because every hole in every pierced panel is
now a many-segment path, and there are four faces on three storeys. It is the
most expensive polish item so far and the page still boots in 79 s.

Still soft: the amber glazing behind each bay is a plain rectangle, so at a
distance an opening reads as a window with a cusped transom rather than as a
cusped arch with a shaded gallery behind it.

---

### 42. Victoria Memorial — the Angel, and what an attribute is for

The bronze Victory on the dome was a cone, three cylinders, a sphere and four
flat slabs: a silhouette, which is what the roadmap said. It is 4.88 m on a 60 m
dome, so the outline is all there is to see.

| Was | Now |
|---|---|
| a cone for the robe | a lofted robe with seven folds |
| four flat slabs for wings | five overlapping feathers a side on a swept leading edge, longest at the top |
| two thin arms | one arm raised holding a gold wreath, one hanging with the drapery |

The four allegorical groups were a sphere on a box with one arm each. They are
seated figures now, and each carries **the thing that names it**: a palette for
Art, a set square and a column for Architecture, a sword and scales for Justice,
a child at the knee for Charity. At 38 m up, an allegory without its attribute is
a woman on a plinth.

---

## Traps worth knowing

These cost real time last session. All are true.

1. **Modules do not get the Builder.** They get a curated `ctx` object with
   explicit bindings. A new helper is invisible until it is added to that list
   in `monument-engine.js` (~line 1709). This has bitten twice.
2. **A heavy build fails as a timeout, not an error.** The page never reaches
   `dataset.boot='ok'`, so there is no console message. If a page "doesn't
   load" silently, suspect geometry cost, not a syntax error.
3. **`add()` transforms geometry in place.** Cache and clone anything reused
   (see `jali()`).
4. **The per-frame sky update overwrites `hemi.intensity`.** Any per-monument
   ambient scale must be applied inside that update.
5. **HTML slider `value` attributes beat `DEFAULTS`.** Both must be changed.
6. **`qa.py` normalises the URL** and strips query strings — use a raw
   Playwright script when a `?shot=` or `?look=` matters.
7. **The engine's ambient is deliberately low.** Shadowed white surfaces go
   grey. That is the house style, not a bug.
8. **`block()` takes a BASE y; `add(box(...))` takes a CENTRE.** The engine
   does `add(key, box(w,h,d), x, y + h/2, z)`. `tools/volumes.py` had this
   backwards *and* ignored `add(box(...))` meshes entirely — which is how a
   paving slab became a "roof" over the wrong court, and why five cameras at
   Amber ended up inside walls. Both are fixed; trust it now.
9. **Always render and look before committing.** Several changes in this
   session looked correct in code and wrong on screen, and vice versa.
10. **`?view=` and `?look=` do nothing without `?shot=`.** Both are parsed
    inside `if (params.has('shot'))`, so `?view=3` on its own opens the home
    view and comes out identical to `?view=1`. Pass `?shot=11&view=3`. Two
    `?look=` shots with az 0 and az 40 also came out identical in this session
    and the cause was not chased — render a view and look at it before trusting
    the parameter.

---

## Working method that produced results

- **Research before geometry.** Every rebuild started with dimensions and a
  photograph, not with code.
- **Instrument before guessing.** Three defects were solved by dumping the
  scene — materials, lights, bounding boxes — after several failed visual
  fixes. When a change does not move the render, the answer is a value you
  have not read.
- **Say what is unverified.** Several commits state plainly that a change was
  not seen by eye. Keep doing that.
