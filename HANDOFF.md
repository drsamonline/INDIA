# Session handoff — INDIA, monuments in code

Paste this whole file into a new session to continue.

---

## Read this first: the seven ways this work went wrong

Every one of these happened in a single week, and every one produced a commit that
said something untrue. They share a cause, and the cause is the useful part.

| # | The mistake | What it cost |
|---|---|---|
| 1 | **A green tick on a job that never ran.** `site.yml`'s browser job was `pull_request`-only; this repo pushes to main. It reported success in 17 s having done only the static checks | a week of "CI is green" that meant nothing; the accessibility gate, render check and keyboard checks had never executed |
| 2 | **A claim without a mechanism.** "The engine reflects the sky" — `refreshEnv()` threw a `ReferenceError` into an empty `catch` and had never run | two commits asserting a feature that did not exist; the studio map was doing the work |
| 3 | **A measurement of the wrong quantity.** `measure.py` reported `max.y − min.y`, which includes anything below the ground plane | a whole research session explaining CSMT's "missing 8.5 m", which did not exist |
| 4 | **Trusting a stale number in my own table.** Konark carried ASI's rounded 30 m where the surveys say 38.4; Jantar Mantar carried the popular 27 m where the measured summit is 19.12 | nearly "fixed" two correct models to match wrong figures |
| 5 | **Dismissing a correct tool reading.** The contrast tool flagged a `.deva` at 1.20; I looked at the *panel* header, found it legible, and called the tool wrong. The element was in `header#topbar`, sitting on bare sky | the real failure survived another commit, and I wrote a "known limit" into the tool blaming it |
| 6 | **Not generalising a fix already made.** A scrim over photographs (`.card-num`) was fixed; the same need over the canvas (the top bar) was not | the identical bug shipped twice |
| 7 | **Editing what was already correct.** Tried to make CI's audit strict; it already was, and the edit produced `--strict --strict` | noise, and a reminder that I had not read the line before changing it |
| 8 | **Changed CI without running the CI path.** Made `build_extras` idempotent and added it to the staleness check — the local run passed, the runner failed, because `actions/checkout` is shallow and `git log` there returns HEAD's date, not the content date | one red run, and the fix was a one-line `fetch-depth: 0` I could have written first |

**The single cause: I accepted a passing signal as evidence.** A green tick, a render
that looked fine, a number from a tool, a table I had written myself — each was
treated as proof when it was only a signal. Every one of the seven was caught by
doing the boring thing instead: reading the run's steps, printing the intermediate
value, sampling the actual pixel, opening the file.

**Rules that follow, in the order they would have helped:**

1. **Before trusting a check, make it fail.** Break something deliberately and watch
   the gate go red. A check that has never failed has never been tested.
2. **A number is not a measurement until you know what it measures.** Print the
   quantity, its units and its bounds before comparing it with anything.
3. **When a check disagrees with your eyes, find out which element it looked at.**
   Print the selector. Do not conclude "the tool is wrong" from a look at a
   different thing.
4. **When you fix a class of bug, search for the class.** Scrims over images, empty
   catch blocks, hard-coded paths, copies of a number — each appeared twice.
5. **An empty `catch` is a lie waiting to be told.** Every one here is now a
   `console.warn` or a rethrow.
6. **Read the line before editing it.** Three edits this week duplicated something
   already present.
7. **Say "unverified" out loud.** Several of these were only fixed because a note in
   this file said "I could not confirm this", and the next pass picked it up.

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

**Latest run (§57–58):** the engine is instrumented (a phase timeline, and a
`?perf` readout on the page) and the numbers say the site is **not** slow: about
3 s of page work, of which 2 s is texture generation — the rest of a 24 s headless
"boot" is rAF throttling. Removing the start-up studio environment saves ~0.7 s a
page, and it exposed that **`refreshEnv` had never run** (a `ReferenceError`
swallowed by an empty catch), so the sky environment shipped in §47 was never
active. Both fixed; `__dbg.scene.environment` is real on every page now.

**Previous run (§53):** the Taj's charbagh — 300 randomly scattered flowers became
48 beds, each edged with its own low hedge and planted in rows of one colour.
Taj Part 1 item 5 of 6. `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci`
clean.

**Previous run (§49):** the statue's head — a fuller occiput, a narrower jaw, a lid
and a crease over each eye, a nose that ends in a tip, hollows under the cheekbone
and at the temples, a crease under the lower lip, and a helix rim on each ear. It
is not a portrait and will not become one in this code. 51.3k triangles, boot
32 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§47–48):** the engine's environment is now a sky gradient rather
than a fixed studio room, verified across all 24 pages with the new
`tools/contact_sheet.py`.

**Previous run (§46):** the Golden Temple's gold — a small emissive stands in for
the sky the gold leaf would be reflecting, with the dome tuned apart from the
trims. 152k triangles, boot 91 s, `audit_data` 0, `linkcheck` 26 pages,
`tintcheck --ci` clean.

**Previous run (§45):** Jantar Mantar's quadrants — moved out of the vertical
plane into the plane of the equator, centred on D on the hypotenuse, 2.84 m
thick along the plane's normal. 51k triangles, boot 33 s, `audit_data` 0,
`linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§44):** India Gate's names — twenty-four ruled lines a pier face
became rows of lettering, one geometry a face. 45k → 66k triangles, boot 37 s,
`audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci` clean.

**Previous run (§43):** the Shore Temple's porch — the bare barrel vault now
carries seven kudu faces, a pilaster band at each end and three ridge stupis.
30k triangles, boot 37 s, `audit_data` 0, `linkcheck` 26 pages, `tintcheck --ci`
clean.

**Previous run (§42):** Victoria Memorial — the Angel of Victory rebuilt (lofted
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

## Work log

The detailed history — fifty-nine numbered sections, one per piece of work, each
ending with what was verified and what was not — is in **`docs/WORKLOG.md`**. It
used to live here and grew to eighty per cent of this file.

Read it before starting anything that sounds familiar: six of those sections record
briefs that asked for work already in the code.

### 60. The site now says how good each model is, and offers credit

The owner's instruction: the site must state clearly that anyone improving a model
gets their name and a link, on the website and in the model, so the level of
modelling can be honest.

**Three levels, in `data/monuments.json` as `fidelity`:**

| Level | Means | Count |
|---|---|---|
| measured | dimensions from a published survey, checked against the built geometry | 2 — Qutb Minar, India Gate |
| approximate | right massing and proportions, ornament simplified or suggested | 20 |
| study | a deliberate simplification, not a reconstruction | 2 — Lotus Temple, Statue of Unity |

Each carries a one-line reason naming what the model *lacks*, not what it has:
"the plinth is 26 per cent small against the tomb", "the figure is procedural and
is not a portrait of Sardar Patel", "the menagerie is modelled at three times its
true scale, because at 0.85 m it was invisible".

**Where it shows:** the landing page has a section of its own — "Help build these
models better", in the nav as *Contribute* and in the footer — with the three
counts, the credit deal in one paragraph, and a list of the five models where work
would show first. Then: the About drawer of every monument (a level pill, the reason,
and "Nobody has improved this model yet — if you do, your name and a link go
here"); `credits.html` §2, which lists all 24 with level, reason and an "Improved
by" column; and a `FIDELITY:` header comment in all 23 module files, so the credit
travels with the code. `CONTRIBUTING.md` states the deal in full: one monument per
pull request, name the source, three places the credit appears, no CLA, licence
CC BY-NC 4.0, copyright stays with the contributor.

**The credit is wired, not promised.** `contributors` is an array per monument;
adding `{"name": "...", "url": "..."}` puts a linked name in the drawer, in the
credits row, and the module header is the third place. Nothing else has to change.

**Two things this exposed:** `page_data()` in `build_site.py` whitelists the keys
that reach the page, so a new field in `monuments.json` is invisible until it is
added there — the fidelity block did not render until it was. And the Taj has no
module file, so its credit lives only in the JSON and the credits table.

---

### 61. The app apparatus is gone — this is a website

A previous session added a second front door for an app that was never released as
an app. All of it is removed:

| Removed | What it was |
|---|---|
| `.github/workflows/build-apps.yml` | built a portable EXE and a signed APK from `docs/play`, published a rolling `app-latest` release, and deployed `docs/` |
| `docs/index.html` | an app landing page with `.exe` and `.apk` download buttons and a "live demo" link to `/play/` |
| `docs/play/index.html` | a copy of the atlas at a second URL, with its own canonical tag pointing at `/play/` |
| `docs/robots.txt`, `docs/sitemap.xml` | stale copies that listed `/play/` |
| the `app-latest` release | the published EXE, APK and Linux binary, and its tag |

**The atlas was never moved.** It has been at the repository root all along, and
Pages has been serving `main` / (root) the whole time — `index.html`, `credits.html`,
`404.html` and `monuments/`. The app material was *additional*, published under
`/docs/`, which is why the site looked as if it had a landing page and a `/play/`
path.

`docs/` now holds only what is referenced: `WORKLOG.md` and the three images
(`gallery.jpg`, `preview.jpg`, `shot.png`). Deployment is GitHub's own
`pages-build-deployment`, which is what the site needs: static files, no build.

**If anyone proposes an app again**, the reason to say no is in this repository's
own history: the pipeline had to be patched four times in one day to stay green
(`0d1b330`, `7a84f07`, `4842ea6`, `51292ce`), it published an artefact nobody
asked for, and it made the site's own front door ambiguous.

---

### 62. The three pages nobody was checking

The accessibility gate has always walked `monuments/*.html`. It never looked at
`index.html`, `credits.html` or `404.html` — the pages a visitor meets first. They
had one `h1` each, a `<main>`, `lang="en"` and alt text on every image, but **no
skip link**, which the other twenty-four pages have all had for weeks.

Fixed, and now gated:

- a skip link on all three, first in tab order, visible on focus, pointing at a
  `main` with `tabindex="-1"` so the jump actually moves focus
- `check_a11y.py --root` — a separate check for pages that are not monuments:
  skip link present and first, exactly one `h1`, a `main` landmark, the skip
  link's target existing, alt on every image, and a `lang`
- CI runs it in `site.yml` alongside the monument check

All three pass at 1200 wide and at 390 × 844.

**Why it was missed:** the tool's URL was built as `monuments/<id>.html`, so a
root page could not be expressed. The fix was a second mode, not a parameter.

---

### 63. The browser job had never run, and three tools were never exercised

Adding the root-page check meant watching CI, which is how this came out:

**`site.yml`'s `render` job had `if: github.event_name == 'pull_request'`.** This
repository pushes straight to main and opens no pull requests, so the job — which
holds the accessibility gate, the render check and the keyboard-shortcut check —
**never ran**. The workflow reported success in seventeen seconds having done only
the static checks. Every "CI is green" in this log meant "the static checks pass".

It runs on push now, and the first real run failed at once: `check_ui.py`
hard-coded `/usr/local/bin/chromium` while every other tool reads `CHROME_PATH`, so
the keyboard check died on a path that exists only in the dev sandbox. Fixed.

**The gate is live, and it passes:** boot two pages, the accessibility contract,
the landing/credits/404 pages, and 6/6 keyboard shortcuts — all green on push, not
on a pull request that never comes.

**The lesson is about verification theatre.** A green tick on a job that is skipped
is worse than a red one, because it is counted as evidence.

---

### 64. framecheck was a report, not a check

`framecheck.py` compared every named view and tour stop against the building's full
height, so every detail view "failed" — a view called *Flag*, *Portal*, *Carving*
or *The Iron Pillar* is meant to be close — and it returned 0 whatever it found.
120 cameras flagged, no signal, nobody able to act on it.

Now it checks what the tool was for: **the home camera must frame the building**,
because that is what the page opens on and what the gallery and social card show.
Detail views are listed only when they frame under a quarter of the building, and
labelled *close-up* rather than as a fault — several of them are looking at
something that is not the building at all (the Iron Pillar, the bodhi tree).

| Verdict | Meaning | Fails CI |
|---|---|---|
| home SHORT | the page opens cropped | **yes** |
| close-up | a detail view, or a view of another object | no |

**Result on the current site: 0 home cameras fail.** Four detail views are listed
for a glance: Qutb's *Crown* and *Iron Pillar*, Charminar's *Crossing*, Mahabodhi's
*Bodhi Tree*. All four are what they say they are.

It runs in `site.yml` now, on push, and takes a second because it reads the module
source rather than rendering.

---

### 65. Measuring all twenty-four, and what the measurement can say

`tools/measure.py --all` was run over every page: 24 renders, about forty minutes.
The results are in `DIMENSIONS.md` as a new table, with the bounding-box height
beside the tallest single mesh.

**The tool measures the box, not the building.** Everything the page draws that is
not sky, terrain or weather goes into it, so a fort on a rock reads as 135 m
(Mehrangarh, +276 per cent), a stepwell below grade reads as 53 m (Rani ki Vav,
+96), and a flag mast adds 10 m (Somnath, +23). Fourteen of the twenty-four are
within 12 per cent, and in almost every one of those the note in the table names
the plinth or parapet that accounts for the difference.

**Three are unexplained** and are marked as such rather than adjusted: Konark
+48 per cent, CSMT +28, the Basilica +31. All three stand on flat ground with no
mast, rock or well to account for it — so either the model is too tall or the
published figure measures a different thing. Adjusting a model to satisfy a
measurement whose scope is unsettled is exactly how the Shore Temple's tier count
got averaged; they are recorded, not "fixed".

**The lesson about the tool:** `tallest single mesh` and `bounding box` answer
different questions, and neither answers "is the building the right height" on its
own. A calliper that reports a number is not the same as a check.

---

### 66. The three unexplained heights: two were the figure, not the model

Researched the three the measurement flagged (Konark +48, CSMT +28, Basilica +31).

| Monument | What the sources say | Verdict |
|---|---|---|
| **Konark** | the jagamohana is **38.4 m above ground** (Swarup 1910: 112 ft 5 in from the platform, 125 ft 8 in above ground; Ganguly's theodolite 129 ft 8 in; the 1627 Madalapanji agrees). ASI's own page says "30 m square and 30 m high" | **the height table was wrong.** It had ASI's round 30 m, while this file's Konark section has carried 38.4 m since the first session. Fixed in `framecheck.py` |
| **Basilica** | 61 ft (18.6 m) is the façade; the model's box reaches the belfry at the rear, which façade figures exclude | the box measures a different part of the building |
| **CSMT** | 48.8 m is to the dome's apex, plus the 16 ft 6 in Statue of Progress = **53.8 m** | **8.5 m still unexplained.** The only real question left |

**The lesson is the one the file already had and I had to learn again:** a
discrepancy is not automatically a model error. Had I "fixed" Konark to match the
30 m figure, I would have made a correct model wrong, and deleted the one thing the
surveys agree on.

**Also worth noting:** `framecheck.py`'s height table is a second copy of numbers
that `DIMENSIONS.md` already holds, and the two had drifted. They agree now. If a
third copy is ever needed, it should be read from the first.

---

### 67. The measurement was wrong, not CSMT — and the table is rebuilt

Chasing CSMT's missing 8.5 m found the bug in my own tool. `measure.py` reported the
**box**: max.y minus min.y. Every module is authored with the ground at y = 0, and
CSMT has a base slab at **−9.1 m**, so its box read 62.3 m against a real 53.8 m.

Measured as **top above ground**, CSMT is **53.3 m** — 0.5 m from 48.8 m of dome
plus the 16 ft 6 in Statue of Progress. The model was right all along.

The tool now reports `top`, `base` and `box`, and all 24 were re-measured:

| | Before (box) | After (top) |
|---|---|---|
| within 12 per cent | 14 of 24 | **16 of 24** |
| CSMT | +28% | **−1%** |
| statue | +4% | **0%** |
| Kandariya | +6% | **0%** |

The five that remain outside 12 per cent are a rock, a hill, a railing, a belfry and
a flag mast — each named in the table.

**And the "one real shortfall" I then reported was wrong too.** I said Jantar
Mantar's gnomon reached 23.7 m where the Samrat Yantra is 27 m. The 27 m is the
popular "88 ft" figure; this file's own table has recorded 22.62 m from the pit
floor and 19.12 m above ground since the first session, and 23.7 m is that summit
under its chhatri. The model is within a fifth of a metre. **Every discrepancy in
this table was the table's, not the model's** — which is the strongest argument for
the rule that a number from a tool is not a measurement until you know what it
measures.

**The lesson, which is the same one twice in two days:** a number from a tool is not
a measurement until you know what the tool is measuring. `box` and `top` differ by
whatever dips below the ground, and I published a table on the wrong one.

---

### 68. A weekly sweep, because the push gate can only sample

`site.yml` runs on every push and finishes in minutes, which means it checks two
monument pages and the three root pages. Twenty-one pages are never visited by CI.
That is the right trade for a push, but it is not coverage.

`.github/workflows/sweep.yml` runs on Mondays at 03:00 UTC and on demand:

| Step | What it covers |
|---|---|
| regenerate + staleness | every page, generated from data |
| links, data, tints, framing | 26 pages, 24 monuments |
| accessibility at 380 × 430 | **all 24 pages** |
| accessibility at 390 × 844 | **all 24 pages** |
| root pages, both viewports | index, credits, 404 |
| measure | every monument's built height |

It reports rather than blocks, and keeps `shots/a11y-all-*.log` as an artifact.

**One trap it had to avoid:** `check_a11y_all.py` resumes from its log, and those
logs are committed — so a fresh CI run would have read "all 24 pages already in …"
and passed without looking at one. The sweep passes `--restart`.

---

### 69. The level is on the card now

The fidelity work said how good each model is, but only on the credits page and in
a monument's About drawer — nowhere near the moment someone browses. Each gallery
card now carries its level beside the era, in the same colours as the credits
table: **measured** green, **approximate** amber, **study** grey, with the reason as
a `title` on the chip.

Above the grid, one line says what the chips mean and links to the invitation.

**It costs nothing to keep true:** the chip is generated from `data/monuments.json`
in `build_site.py`, so a contributor who improves a model and changes its level
changes the card, the credits row and the About drawer in the same commit.

---

### 70. Contrast — the check nobody had run, and three real failures

The accessibility gate checks structure. It has never checked whether text can be
**read**, which is the failure people actually experience. `tools/contrastcheck.py`
does: every text node's colour against the background behind it, WCAG AA.

The landing page reported **224 text nodes, three kinds below AA** — and all three
were worth fixing:

| Was | Ratio | Now |
|---|---|---|
| my own fidelity chips (`.fid-mini`, 8 px) | 3.45 and 3.87 | darker: 5.0+ |
| `--muted` on `--paper` | 4.30 | `#6b5e50`, 5.0 |
| the principle numerals (01/02/03), marigold | **1.97** | terracotta, 5.0 |

`index.html` now reports **0 of 224 below AA**.

**The CSS-walk version was wrong, so the tool now samples pixels.** It photographs
the page with every glyph made transparent and takes the median colour under each
text node's box — the real backdrop, whatever produced it. That version measured
the whole page (index 395 nodes, credits 318) and found four more real failures,
all fixed:

| Was | Ratio | Now |
|---|---|---|
| the credits table's level pills | **1.71** | darkened to match the card chips |
| `.card-num`, white on a 50 % scrim over a photograph | 4.40 | scrim deepened to 72 % |
| `.cards-note` — a link inside `opacity:.72` | 3.10 | `--muted` colour, no opacity |

**Both pages now report 0 below AA** across the whole document.

**What is still open: two readings on the monument pages.** The tool reports a
`.panel-deva` at 1.20 and a `.panel-sub` at 2.03 on Qutb Minar.

I checked by eye and by direct sampling: the panel header is **gold on #212c, about
6.2:1**, and a crop of the rendered header shows it plainly. The tool's own debug
output prints *two* `.panel-deva` nodes — one at 0.85 opacity over the dark panel
(6.23:1) and one at full opacity over `[156,170,175]`, which is sky. The second is
most likely the tour card's Devanagari title, measured while it sits over the canvas.

**Then I looked at the element the tool actually named, and it was right.**
`--debug` prints the ancestor chain: `span.deva < div.titles < header#topbar` — the
**top bar's title block**, sitting straight on the sky with no scrim. A crop of the
render showed gold Devanagari on pale grey, barely readable at noon. My "the panel
is fine" check had been of a *different* element.

Fixed: the title block carries a 62 % scrim with a blur, the subtitle line goes from
72 % to 95 % opacity, and the Devanagari lightens a step. Qutb Minar went from 2
below AA to **0**, and India Gate's last node (the orbit hint at 4.50) went with a
scrim of its own.

**The lesson, which is the fourth time this week:** the tool was right and I was
wrong. "I looked at it and it seemed fine" is not a measurement. Two genuine fixes came out of the chase anyway — the
tool now waits for `dataset.boot` (it had been measuring the *loading screen*, where
a title over bright sky really does score 1.20) and it has `--debug TAG` to print
fg, bg and ratio for any element.

**Two of the four bugs were in the tool, not the site:** it scored text over the
canvas against a white guess (1.38 for white-on-dark), and it read a `.rv` element
still at opacity 0 as invisible (88 false failures on the first run). A checker is
a piece of software and needs the same scepticism as the thing it checks.

---

### 71. Amber Fort's ramparts were a fence of stones

The last open polish item in the roadmap. The wall runs were a line of separate
4.3 m blocks with a 1.2 m cube on every second one, which reads as a fence of stones
rather than a fortification — the same fault the Sanchi vedika had before it got a
coping (§40).

Each run is now: **one continuous wall**, a **parapet walk** along the crest set
back a little, a **crenellated row of merlons** (1 m wide, 2 m apart) on the outer
edge, and bastions spaced along the length instead of every eighth block. +420
triangles in total — 88,374 to 88,794 — because the blocks were merged anyway.

**What was not done, and is in the roadmap as such:** the extent. The real wall
network is 12 km and this is 490 m of representative runs, and the hill and the lake
are still compressed. The note in `data/monuments.json` says so, so the gallery card
and the credits row say so too.

---

### 72. The gold stopped cheating

§46 gave the Golden Temple an emissive because a metal with nothing to reflect
renders matte. §47 gave the engine a sky environment — and then turned out never to
have run until §58. Both are settled now, so the cheat has been dialled back to a
token:

| | §46 (cheat) | §72 (metal) |
|---|---|---|
| trims | metalness 0.70, emissive 0.55 | **0.88**, emissive 0.20 |
| dome and leaf | metalness 0.62, emissive 0.75 | **0.82**, emissive 0.28 |

A small emissive stays, at about a quarter of what it was, because the shaded side
of a real metal under this sky still goes to soot without it. That is a compromise,
and it is a much smaller one.

**Rendered at noon and at 17:48.** At noon the dome and the four finials now carry
distinct specular highlights rather than a uniform glow; at dusk the leaf takes the
sky's colour. That is what gold leaf does, and it is the first time this page has
shown it.

---

### 73. The top bar was the contrast failure, and the tool was right

`contrastcheck.py` reported `.deva` at 1.20 on Qutb Minar. I dismissed it as a tool
artefact because I had looked at the *panel* header and it was legible. `--debug`
printed the ancestor chain and showed the element was in `header#topbar`, not the
panel: the title block sits straight on the sky, with no scrim, and gold Devanagari
on pale grey at noon is barely readable. A crop of the render confirmed it.

| Element | Was | Now |
|---|---|---|
| title block | no background | 62 % scrim with a blur |
| subtitle line | 72 % opacity | 95 % |
| Devanagari | `--accent-2` | a step lighter |
| the orbit hint | 62 % white, no background | 88 % on a 45 % scrim |

Qutb Minar: 2 below AA → **0**. India Gate: 1 → **0**. Index 395 nodes and credits
318 nodes remain at 0.

**A UI element that floats over a live scene cannot rely on the scene.** It needs its
own scrim, exactly as a caption over a photograph does — the same fix as
`.card-num` on the gallery cards, three commits earlier.

---

### 74. The contrast sweep: 11 of 24 pages, all clean, and why that is the answer

Ran `contrastcheck.py` over the pages one at a time. **Eleven checked, every one at
0 text nodes below AA:**

| Page | Nodes |
|---|---|
| index | 395 |
| credits | 318 |
| qutub-minar, hawa-mahal, charminar, gateway-of-india, india-gate, mysore-palace, golden-temple, lotus-temple, victoria-memorial | 46–47 each |

**Thirteen are unrun**, and the reason is throughput, not doubt: each page costs about
four minutes because the engine boots a WebGL scene under software rendering before
the tool will photograph it. Meenakshi timed out even at 285 s.

Two things came out of trying:

- **A false lead I did not publish.** A static check of each module's `accent` and
  `accent2` against the panel and paper backgrounds flagged all 24 — but `accent2` is
  a *light* colour meant for the dark panel, and I was comparing it with paper. The
  numbers were right and the comparison was wrong. It was the wrong proxy and the
  rendered checks already answer the question.
- **The sweep now runs contrast over every page.** It is slow here and fast on a CI
  runner, which is exactly the trade the weekly sweep exists for.

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
