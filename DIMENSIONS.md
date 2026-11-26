# Measured dimensions

Every model in this atlas is built to 1 unit = 1 metre. This file records the
figures each model was built from, so a reader can check the proportions
against the sources rather than take the renders on trust.

Where a published dimension is disputed, both readings are given and the one
the model uses is marked. Figures marked *(photo)* were scaled from the
reference photograph in `assets/img/` rather than taken from a survey.

The **Model** column was written from each module's constants and, until now,
never checked against the geometry that actually gets drawn. `tools/measure.py`
does that check: it loads the page, walks the scene and reports the world-space
extent of everything that is not sky, ground or weather. Three spot checks, taken
off the built mesh:

| Monument | Model column | Measured | |
|---|---|---|---|
| Qutb Minar | 72.5 m | **72.5 m** | exact |
| India Gate | 42 m | **42.1 m** | 0.1 m |
| Taj Mahal | 69.9 m | **69.8 m** | 0.1 m, and it confirms the 3.353 m scale |

The remaining tables have not been measured this way; the tool takes one monument
at a time and the numbers above are what a reader can rely on so far.

---

## Qutb Minar

| Element | Real | Model | Source |
|---|---|---|---|
| Total height | 72.5 m | 72.5 m to finial | ASI, UNESCO |
| Base diameter | 14.32 m | 14.32 m | ASI |
| Top diameter | 2.75 m | 2.75 m | ASI |
| Storeys | 5 | 5 | — |
| Storey heights | 95 / 51 / 41 / 25 / 22 ft | 27.3 / 14.7 / 11.8 / 7.2 / 6.3 m | 19th-c. survey |
| Plinth | 16.5 m square, 1.7 m deep | same | Peña et al. |
| Fluting | angular + round alternating, storey 1 | built flute by flute | ASI |
| Balconies | 4, on muqarnas corbels | 4, +1.75 / +1.55 / +1.30 / +1.05 m | — |
| Alai Minar stump | 25 m | 25 m | ASI |
| Inscription bands | 6 on storey 1, 2 each on storeys 2 and 3, 1 on storey 4 | 6 / 2 / 2 / 1, 1.0 m deep | Wikipedia (suras II 255–60, LIX 22–23, XLVIII 1–6, the names of Ghiyath al-Din and Mu'izz al-Din); Archnet |
| Script | **naskh**, a cursive hand — not Kufic | naskh rhythm: baseline, stems of uneven height, loops, dots | Wikipedia ("inscribed in naskh"); Archnet ("Nakshi inscriptions") |

## Hawa Mahal

| Element | Real | Model | Source |
|---|---|---|---|
| Height | ~15 m (50 ft) | 15.0 m | Wikipedia |
| Facade width | **disputed: 15 m or 30 m** | 21.0 m *(photo)* | — |
| Depth | one room, ~6 m | 6.0 m | Wikipedia |
| Storeys | 5, stepping back | 5 | Wikipedia |
| Tier widths | pyramid | 21 / 18 / 14.6 / 11.6 / 8.6 m | derived |
| Openings | 953 jharokhas, decorated with latticework | 55 casements on the four tiers, each screen cut with 15 cells (825 cells), + 13 base arches | Wikipedia |
| Dome | none | none | — |

## Charminar

| Element | Real | Model | Source |
|---|---|---|---|
| Block plan | 20 m square | 20 × 20 m | Wikipedia |
| Great arches | 11 m wide, 20 m high *(disputed)* | 11 m wide, apex 17 m, cresting 20.2 m | Wikipedia |
| Overall footprint | 30.48 m per side | 30.4 m | UNESCO nomination |
| Minaret shaft | 48.8 m | 48.8 m | UNESCO nomination |
| Minaret overall | 56 m | 56.0 m | Wikipedia |
| Tiers / balconies | four tiers, three balconies | same | UNESCO nomination |

## Gateway of India

| Element | Real | Model | Source |
|---|---|---|---|
| Overall height | 26.0 m | 26.0 m | Wikipedia, Structurae |
| **Dome diameter** | **15.0 m** | 15.0 m | Wikipedia, TIFR |
| Great arch span | **8.6 m** — not 15 m | 8.6 m *(photo)* | — |
| Plan | oblong octopylon, 8 piers | 36.0 × 17.0 m | Wikipedia |
| Façade width | not published | 36.0 m *(photo)* | — |

The "15 m arch" that circulates online is the dome. A 15 m opening in a 26 m
monument would force a 63 m façade, which the photograph rules out.

## India Gate

| Element | Real | Model | Source |
|---|---|---|---|
| Overall height | 42.35 m | 42.35 m | INTACH Delhi |
| Great arch span | 9.1–10.0 m | 9.6 m | Wikipedia, INTACH |
| Arch crown | ~24 m | 24.3 m | derived |
| Block width | not published | 37.0 m *(photo)* | — |
| Plan | oblong tetrapylon | 37.0 × 21.0 m | Wikipedia |
| Plinth | low, red Bharatpur stone | 1.1 m | Wikipedia |

## Mysore Palace

| Element | Real | Model | Source |
|---|---|---|---|
| Overall height | 44.0 m (144 ft) | 44.0 m to the chhatri on the gold dome | Wikipedia |
| Plan | 75 × 48 m | 75 × 48 m | Wikipedia |
| Storeys | 3 | 3 | — |
| Central tower | five stages | five, 1.6 → 28.8 m | palace site |
| Façade arches | 9 central, 7 per flank | same | The Hindu |
| Domes | gold centre, crimson corners | 44.0 / 34.4 m | palace site |

## Golden Temple

| Element | Real | Model | Source |
|---|---|---|---|
| Sanctum plan | 12.25 m square (40.5 ft) | 12.25 m | Wikipedia |
| Marble platform | 20.4 m square (67 ft) | 20.4 m | Wikipedia |
| Total height | 16.5 m (54 ft) | 16.5 m to the finial | — |
| Onion dome | not published; 0.48 of the façade *(photo)* | 5.9 m dia, 1.85 m high | — |
| Amrit Sarovar | 148.5 × 154.5 m, 5.1 m deep | same | — |
| Causeway | 61.6 × 6.4 m (202 × 21 ft) | 64 × 6.4 m | — |
| Parikrama wings | two storeys of arcade *(photo)* | 12.4 m to the cornice | — |

The 40 m / 67 m figures sometimes quoted are **feet**, not metres.

## Konark Sun Temple

| Element | Real | Model | Source |
|---|---|---|---|
| Jagamohana plan | 30 m square | 30 m | ASI |
| Jagamohana height | 34.3 m above the platform, 38.4 m above ground | same | Swarup 1910 |
| Chariot plinth | 4.1 m | 4.1 m | 2025 survey |
| Wheels | 24, 2.97 m dia, 8 spokes, 12 a flank | same | ASI |
| Horses | 7 — three to one hand, four to the other | same | ASI |
| Deul | ruined; originally over 61 m | stump to ~29 m | — |

**The disputed figure:** the ASI's own Konark page gives the jagamohana as "30 m
square and 30 m high", and that round number was in `tools/framecheck.py`'s height
table until 2026-11-26 — which is why Konark read 48 per cent too tall when the
model was measured. The surveys are unambiguous: Swarup measured 112 ft 5 in from
the platform, 125 ft 8 in above ground, Ganguly's theodolite gave 129 ft 8 in, and
the 1627 Madalapanji reading agrees. The table above has used 38.4 m all along;
the height table now does too.

## Sanchi Stupa

| Element | Real | Model | Source |
|---|---|---|---|
| Anda (dome) | 36.6 m dia | 36.6 m | ASI |
| Summit of dome | 16.46 m above the pradakshina | 16.46 m | ASI |
| Medhi (drum) | 4.4 m | 4.4 m | ASI |
| Chatravali | 21.64 m to the crown | 21.64 m | ASI |
| Torana | 8.53 m to the top architrave, ~10.4 m to the crown | 8.9 / 10.4 m | measured components |

The "6.7 m torana" in circulation is not supported by any source; published
values run 8.5–10.7 m.

## Victoria Memorial

| Element | Real | Model | Source |
|---|---|---|---|
| Plan | 103 × 69 m (338 × 228 ft) | 103 × 69 m | Structurae |
| Terrace | 120.7 × 86.3 m | same | 1953 guide |
| Height to base of Angel | 56.08 m (184 ft) | 56.08 m | Banglapedia |
| Angel of Victory | 4.88 m, ~3 t, turns on bearings | 4.88 m | Hall |
| Dome | 61 ft (18.6 m) | 18.5 m, 24 ribs | Hall |
| Corner towers | not published | 11 m square, apex 52.6 m *(photo)* | — |
| Plan form | H, curved colonnades at both ends | same | Epocheye |

## Meenakshi Amman

| Element | Real | Model | Source |
|---|---|---|---|
| Outer enclosure | 254.1 × 237.6 m | 254 × 238 m | 7wonders |
| Towers | 14: four nine-tier, one seven, five five, two three, two golden vimanas | same | temple records |
| Tallest (south) | 51.9 m, base 32.9 × 20.4 m | same | Dinamalar |
| East / west / north | 46.7 / 47.1 / 46.3 m | same | temple records |
| Tier taper | ≈0.66 of base at the crest | 0.955 per storey | *(photo)* |
| Potramarai tank | 50 × 37 m (165 × 120 ft) | same | Wikipedia |

## Lotus Temple

| Element | Real | Model | Source |
|---|---|---|---|
| Height | 34.27 m | 34.3 m | Bahá'í brochure, Wikipedia |
| Diameter across entrance petals | 70 m | 68 m | Bahá'í brochure |
| Diameter across the pools | 130 m | 128 m | Naharoy et al. |
| Entrance leaves | 7.80 m high | 7.8 m | Naharoy et al. |
| Outer leaves | 22.5 m high | 22.5 m | Naharoy et al. |
| Inner leaves | 33.6 m high | 33.6 m | Naharoy et al. |
| Petals | 27 in three rings of nine | 27 | Wikipedia |
| Central hall | 34 m dia, 1,300 seats | 34.8 m | Wikipedia |

A second height, 40.80 m from the entrance level, appears in the structural
literature; the model uses the 34.27 m reading.

## Shore Temple

| Element | Real | Model | Source |
|---|---|---|---|
| Main vimana | 18 m (60 ft) over five talas | 18.0 m, 5 talas | ASI |
| Main plinth | 15.2 m square (50 ft) | 15.2 m | ASI |
| Second shrine | about half the height; **tier count disputed** (3 or 5) | 9.6 m, 3 talas | ASI; the dispute is noted in ROADMAP and not resolved here |
| Third shrine | no superstructure | flat roof | ASI |
| Nandi row | on the boundary wall | 11 facing the sea | ASI |

## Rani ki Vav

| Element | Real | Model | Source |
|---|---|---|---|
| Length | 64 m | 64 m | UNESCO |
| Width | 20 m | 20 m | UNESCO |
| Levels | 7 | 7 × 3.29 m | UNESCO |
| Tank floor | −23 m | −23 m | UNESCO |
| Well shaft | 10 m dia, 30 m deep | same | UNESCO |
| Tank | 9.5 × 9.4 m at −23 m | same | UNESCO |
| Pavilion storeys | 2, 4, 6, 7 | 2, 4, 5, 7 | UNESCO |

## Amber Fort

| Element | Real | Model | Source |
|---|---|---|---|
| Property area | 30 ha | compressed to ~2.3 ha | UNESCO |
| Jaleb Chowk | ~100 × 65 m | 100 × 40 m | — |
| Diwan-i-Aam columns | 27 | 27 | — |
| Ganesh Pol | three levels, Suhag Mandir above | 20 m + mandir + cupolas | — |
| Terrace above the lake | ~130–150 m | 42 m (compressed) | — |
| Rampart network | ~12 km | ~490 m of representative runs | — |
| Maota Lake | 0.1 km², 5 m deep | 228 × 114 m, 1.6 m deep | — |

Amber is the one deliberate compression in the atlas: a 30-hectare site with a
12 km wall network cannot be shown at 1:1 alongside the lake and the ridge.

## CSMT, Mumbai

| Element | Real | Model | Source |
|---|---|---|---|
| Main block length | 330 ft (100.6 m) | 100.0 m | UNESCO nomination |
| Height to top of Progress | 180 ft (54.9 m) | 53.8 m | UNESCO nomination |
| Dome apex | 160 ft (48.8 m) | 48.8 m | — |
| Statue of Progress | 16 ft 6 in (5.0 m) | 5.0 m | UNESCO nomination |
| Clock face | 9–10 ft | 3.2 m *(photo)* | — |
| Great hall | 82 × 76 × 42 ft | not modelled (interior) | UNESCO nomination |
| Platform / train shed | 330 ft / 1,200 ft | 40 m shed only | — |

The clock sits on the **central** west-frontage tower, directly under the dome,
not at a corner — confirmed by the photograph and the nomination text.

## Mahabodhi Temple

| Element | Real | Model | Source |
|---|---|---|---|
| Total height | 52 m (sources give 50, 52, 55) | 52.0 m | Wikipedia |
| Base width | 15 m in the literature | 15.5 m | Wikipedia |
| Sikhara springing | ~10–11 m *(photo)* | 11.0 m | — |
| Storeys | seven, marked by bhumi-amalakas | seven | ASI |
| Corner shrines | four, panchayatana | four | — |
| Vedika railing | ~2 m | 2.1 m | — |

## Kandariya Mahadeva

| Element | Real | Model | Source |
|---|---|---|---|
| Jagati platform | 4.0 m (13 ft) | 4.0 m | UNESCO |
| Total height to kalasha | 31.0 m | 31.0 m | UNESCO |
| Length east–west | 31.0–31.17 m | 31.4 m | UNESCO |
| Width north–south | 20.0–20.36 m | 20.0 m | UNESCO |
| Sikhara | 11.8 m square → 3.4 m, convex then concave | explicit ogee profile | — |
| Miniature spirelets | 84 | four rows of clusters | UNESCO |
| Sculptures | ~870 | two registers per face | — |

## Somnath Temple

| Element | Real | Model | Source |
|---|---|---|---|
| Total height | 47.2 m (155 ft) per the Trust; 50 m quoted | 50.2 m | Trust |
| Sikhara above the sanctum | ~15 m | 15.6 m | — |
| Flagstaff | 27 ft (8.2 m) | 8.2 m, top at 58.4 m | — |
| Sikhara plan | square, curvilinear | 20 m base, 3.6 m neck | — |
| Baan Stambh | 36 m | 36 m on the sea wall | — |
| Kalasha | ~10 t | 2.5 m gold pot | — |

## Statue of Unity

| Element | Real | Model | Source |
|---|---|---|---|
| Figure height | 182 m | 182 m | Wikipedia |
| Plinth | 58 m | 58 m | Wikipedia |
| Viewing gallery | 153 m | 152.6 m | Wikipedia |
| Feet gap | 6.4 m | 6.4 m | — |
| Shoulders | ~46 m *(photo)* | 49 m | — |
| Head | ~8 heads tall | 21.5 m (8.5 heads) | — |
| Waist / shoulder | 0.60 / 0.875 of height *(photo)* | same | — |
| Dhoti skirt hem | 0.40 of height (73 m) | 0.393 (71.5 m) | supplied turnaround |
| Dhoti over the legs | wrapped to just above the ankle, ankles bare | cloth to 0.125, ankle bare below | Wikipedia ("Patel's dhoti-clad legs and sandalled feet"); Incredible India |
| Footwear | sandals: flat sole, instep strap, heel strap | same | ibid. |
| Shawl | chaddar over both shoulders; hem at 0.53 of height in front, 0.44 at the back | 0.535 / 0.445 | supplied turnaround |
| Head across the skull | 17 m | 17 m | supplied turnaround |
| Skirt across the hem | 51 m | 51 m | supplied turnaround |

## Basilica of Bom Jesus

| Element | Real | Model | Source |
|---|---|---|---|
| Nave length | 55.77 m | 55.77 m | Wikipedia |
| Breadth | 16.76 m | 16.76 m | Wikipedia |
| Height | 18.59 m to the eaves | 18.6 m, ridge 21.4 m | Wikipedia |
| Façade height | ~25 m to the apex | 25.0 m | — |
| Façade tiers | three, Ionic / Corinthian / attic | same | — |
| Material | laterite walls, Bassein basalt orders, lime plaster | plaster walls, basalt orders | — |

## Mehrangarh

| Element | Real | Model | Source |
|---|---|---|---|
| Hill above the plain | ~122 m (400 ft) | 122 m to the summit | Wikipedia |
| Enceinte footprint | 460 × 230 m | 432 × 242 m | Wikipedia |
| Curtain height | 6–36 m | 16–36 m | Wikipedia |
| Curtain thickness | up to 21 m | 21 m at base, 11 m at the walk | Wikipedia |
| Sheer drop, south rampart | 37 m | 36 m of cliff | — |
| Gates | seven | seven, in sequence | fort records |
| Palace above the wall walk | not published | 20 m *(photo)* | — |

## Jantar Mantar

| Element | Real | Model | Source |
|---|---|---|---|
| Site area | 18,652 m² (1.8652 ha) | 18,542 m² | UNESCO nomination |
| Boundary vs instrument axes | 15° apart | boundary rotated 15° | UNESCO nomination |
| Brihat Samrat pit | 44.15 × 40.3 m, 3.5 m deep | 45.5 × 40.3 m | UNESCO nomination |
| Samrat gnomon | 22.62 m high, 44.58 m base, 2.85 m thick | same | Kaye 1918 |
| Samrat summit above ground | 19.12 m | 19.12 m | UNESCO nomination |
| Quadrants | R 15.15 m, 2.84 m wide | same | Kaye 1918 |
| Jai Prakash bowls | 2 × 5.44 m dia | same | Kaye 1918 |
| Instruments modelled | 19 | 19 | — |

The "27 m high" figure often quoted is the popular one (88 ft); the nomination
dossier's measured gnomon is 22.62 m from the pit floor and 19.12 m above
ground. "187 × 160 m" for the site appears in no source and would be 60% larger
than the 1.8652 ha the nomination records.

---

## Taj Mahal

The Taj is the one page whose geometry is not this project's: it is the original
single-file scene, adapted by `tools/build_taj.py`. Its figures are therefore the
scene's own, and the scale below is derived rather than authored — 1 scene unit
= 57.0 m / 17.0 units = **3.353 m**, taken from the tomb's own side, which the
scene draws as 17 units across.

| Element | Real | Model | Source |
|---|---|---|---|
| Total height to finial | **73 m** (240 ft) | 69.9 m | Britannica; the 74 m reading is "above garden level" and 58 m on UNESCO's Japanese description measures the dome from a different base — see below |
| Plinth | 95.5 m square, 6–7 m high | **70.4 × 67.1 m**, 6.7 m high | Wikipedia 95.5 m; Britannica 95 m; the model's plinth is 26 per cent small against the tomb |
| Tomb body | 57 m square, corners chamfered | 57.0 m square, 3.6 u chamfer | Wikipedia; by definition of the scale |
| Body height to roof | pishtaq 33 m | 31.5 m | Wikipedia |
| Dome | 23 m on a 12 m drum; outer shell 44.4 m on the state site's measure | 21.5 m on a 7.0 m drum | Wikipedia; tajmahal.gov.in (44.4 m outer, 24.35 m inner) |
| Finial | 9.6 m, gilded | 9.1 m | Wikipedia |
| Minarets | more than 40 m; 42 m; 137 ft ≈ 41.8 m | 43.6 m | Wikipedia; Britannica; tajmahal.gov.in |
| Charbagh | 300 m square, four quadrants | compressed — the whole complex is ~32 u ≈ 107 m deep | Wikipedia |

**Where the sources disagree, and what was chosen.** The building's height has no
settled figure. Britannica gives 240 ft (73 m) to the tip of the finial and names
that datum; the same entry's 243 ft (74 m) is "above garden level"; the state site
gives an outer dome of 44.4 m without naming a base; and UNESCO's Japanese
description gives the central dome as 58 m, credited to a Japanese federation
rather than to a survey. Only Britannica names both a base and an end point, so
**73 m to the finial** is the reading used here, and the model's 69.9 m is recorded
as 4 per cent short rather than adjusted to fit.

**The plinth is the one real discrepancy.** In the scene the plinth is 21 × 20
units against a 17-unit tomb, a ratio of 1.24; the real ratio is 95.5 / 57 = 1.68.
That makes the model's platform noticeably tight under the mausoleum. It was not
changed: the deck, the water channel, the charbagh quads and the tour viewpoints
are all keyed to the plinth's footprint, and widening it by a third would move
every one of them. Recorded rather than silently corrected.

**Not to scale by design:** the garden. The scene compresses the 300 m charbagh
into about 107 m so that the tomb fills the frame, which is why the charbagh's
proportions read tighter than a plan does.

## Disputed figures

These are the dimensions where the sources genuinely disagree and the model
had to choose. If you have a survey drawing, these are the ones to revisit.

| Monument | Figure | Readings | Chosen |
|---|---|---|---|
| Hawa Mahal | façade width | 15 m vs 30 m | 21 m, scaled from the photograph |
| Charminar | arch height | 20 m published vs ~14 m in the photograph | 17 m apex, 20.2 m with cresting |
| Mahabodhi | base width | 15 m in the literature vs ~28–30 m in the photograph | 30 m, photograph |
| Kandariya | height datum | 31 m ground-to-kalasha vs above the plinth | 31 m including the jagati |
| Lotus | height | 34.27 m from the podium vs 40.80 m from the entrance | 34.27 m |
| Victoria Memorial | height | 184 ft (Wikipedia) vs 200 ft (the Hall) | 56.08 m to the Angel's base, 60.96 m to its head |
| Konark | height | "30 m" headline vs 112 ft 5 in in the 1910 survey | the survey |
| Sanchi | 16.46 m datum | dome alone vs drum + dome | drum + dome, so the stack reaches 21.64 m |

---

*Figures as researched for the 2026 rebuild. Sources named per row: ASI,
UNESCO nomination dossiers and ICOMOS evaluations, the relevant Wikipedia
articles, and the survey literature (Kaye 1918 for Jantar Mantar, Swarup 1910
for Konark, Peña et al. for the Qutb Minar section). Dimensions marked
*(photo)* were scaled from the reference photograph in `assets/img/`.*

## Measured, all twenty-four

`tools/measure.py` loads each page, walks the scene and reports the **top of the
geometry above the ground plane** — every module is authored with the ground at
y = 0, so that figure is directly comparable with a published height. Run over all
24 on 2026-11-26.

| Monument | Real | Model top | Δ | What the difference is |
|---|---|---|---|---|
| [Qutub Minar](monuments/qutub-minar.html) | 72.5 | **73.9** | +2% | — |
| [Hawa Mahal](monuments/hawa-mahal.html) | 15.0 | **16.5** | +10% | — |
| [Charminar](monuments/charminar.html) | 56.0 | **56.0** | +0% | — |
| [Gateway Of India](monuments/gateway-of-india.html) | 26.0 | **26.2** | +1% | — |
| [Taj Mahal](monuments/taj-mahal.html) | 73.0 | **70.1** | -4% | — |
| [India Gate](monuments/india-gate.html) | 42.4 | **42.1** | -1% | — |
| [Mysore Palace](monuments/mysore-palace.html) | 44.8 | **43.2** | -4% | — |
| [Golden Temple](monuments/golden-temple.html) | 16.5 | **21.0** | +27% | the nishan sahib, the flag mast |
| [Konark Sun Temple](monuments/konark-sun-temple.html) | 38.4 | **42.7** | +11% | — |
| [Sanchi Stupa](monuments/sanchi-stupa.html) | 16.5 | **22.1** | +34% | the railing and toranas stand 5.6 m above the dome |
| [Victoria Memorial](monuments/victoria-memorial.html) | 56.0 | **60.2** | +8% | — |
| [Meenakshi Temple](monuments/meenakshi-temple.html) | 51.9 | **55.6** | +7% | — |
| [Lotus Temple](monuments/lotus-temple.html) | 34.0 | **35.0** | +3% | — |
| [Shore Temple](monuments/shore-temple.html) | 18.0 | **18.4** | +2% | — |
| [Rani Ki Vav](monuments/rani-ki-vav.html) | 27.0 | **22.4** | -17% | measured from the terrace down; the well floor is 30.6 m below ground |
| [Amber Fort](monuments/amber-fort.html) | 52.0 | **76.6** | +47% | the hill |
| [Csmt Mumbai](monuments/csmt-mumbai.html) | 53.8 | **53.3** | -1% | — |
| [Mahabodhi Temple](monuments/mahabodhi-temple.html) | 52.0 | **54.8** | +5% | — |
| [Statue Of Unity](monuments/statue-of-unity.html) | 240.0 | **239.9** | -0% | — |
| [Kandariya Mahadeva](monuments/kandariya-mahadeva.html) | 31.0 | **31.0** | +0% | — |
| [Basilica Bom Jesus](monuments/basilica-bom-jesus.html) | 25.0 | **32.8** | +31% | the belfry at the rear, which the façade figures exclude |
| [Mehrangarh Fort](monuments/mehrangarh-fort.html) | 36.0 | **131.3** | +265% | the rock, ~95 m of it |
| [Jantar Mantar](monuments/jantar-mantar.html) | 23.5 | **23.7** | +1% | — the summit is 19.12 m and the chhatri takes it to 23.5; the popular "27 m" is not a height above ground |
| [Somnath Temple](monuments/somnath-temple.html) | 50.0 | **61.3** | +23% | the flag mast |

**Sixteen of twenty-four are within 12 per cent, and CSMT is the reason this table
was rebuilt.** Its first version compared the *box* — max.y minus min.y — and the
box includes whatever dips below the ground plane. CSMT has a base slab at −9.1 m,
so its box read 62.3 m against a real 53.8 m and looked 8.5 m too tall. Its highest
stone is at **53.3 m**, which is 0.5 m from the dome's apex plus the Statue of
Progress. The model was right; the measurement was wrong.

The five that remain outside 12 per cent are each a thing that is not the building:
a rock, a hill, a railing, a belfry, a flag mast.

**Jantar Mantar was flagged as a sixth and is not one.** The height table carried
the popular "27 m / 88 ft" figure for the Samrat Yantra; this file's own table has
said 22.62 m from the pit floor and 19.12 m above ground since the first session,
and the model's 23.7 m is that summit under its chhatri. The model is within a
fifth of a metre of the measured building, and the flagged shortfall was the table's
again.
## Disputed figures

These are the dimensions where the sources genuinely disagree and the model
had to choose. If you have a survey drawing, these are the ones to revisit.

| Monument | Figure | Readings | Chosen |
|---|---|---|---|
| Hawa Mahal | façade width | 15 m vs 30 m | 21 m, scaled from the photograph |
| Charminar | arch height | 20 m published vs ~14 m in the photograph | 17 m apex, 20.2 m with cresting |
| Mahabodhi | base width | 15 m in the literature vs ~28–30 m in the photograph | 30 m, photograph |
| Kandariya | height datum | 31 m ground-to-kalasha vs above the plinth | 31 m including the jagati |
| Lotus | height | 34.27 m from the podium vs 40.80 m from the entrance | 34.27 m |
| Victoria Memorial | height | 184 ft (Wikipedia) vs 200 ft (the Hall) | 56.08 m to the Angel's base, 60.96 m to its head |
| Konark | height | "30 m" headline vs 112 ft 5 in in the 1910 survey | the survey |
| Sanchi | 16.46 m datum | dome alone vs drum + dome | drum + dome, so the stack reaches 21.64 m |

---

*Figures as researched for the 2026 rebuild. Sources named per row: ASI,
UNESCO nomination dossiers and ICOMOS evaluations, the relevant Wikipedia
articles, and the survey literature (Kaye 1918 for Jantar Mantar, Swarup 1910
for Konark, Peña et al. for the Qutb Minar section). Dimensions marked
*(photo)* were scaled from the reference photograph in `assets/img/`.*

## Measured, all twenty-four

`tools/measure.py` loads each page, walks the scene and reports the world-space
extent of everything that is not sky, ground or weather. Run over all 24 on
2026-11-26, comparing the **bounding-box height** with the published figure in the
tables above, and the **tallest single mesh** beside it — the two differ wherever a
building is assembled from separate pieces.

| Monument | Real | Box height | Δ | Tallest mesh | What the box includes |
|---|---|---|---|---|---|
| [Taj Mahal](monuments/taj-mahal.html) | 73.0 | **75.1** | +3% | 69.8 | — |
| [Qutub Minar](monuments/qutub-minar.html) | 72.5 | **73.9** | +2% | 72.5 | — |
| [Hawa Mahal](monuments/hawa-mahal.html) | 15.0 | **16.8** | +12% | 16.2 | the plinth and parapet |
| [Charminar](monuments/charminar.html) | 56.0 | **56.0** | +0% | 54.5 | — |
| [Gateway Of India](monuments/gateway-of-india.html) | 26.0 | **28.6** | +10% | 28.1 | the plinth and steps |
| [India Gate](monuments/india-gate.html) | 42.4 | **42.1** | -1% | 42.1 | — |
| [Mysore Palace](monuments/mysore-palace.html) | 44.8 | **43.3** | -3% | 33.4 | — |
| [Golden Temple](monuments/golden-temple.html) | 16.5 | **28.9** | +75% | 27.9 | the shrine is 16.5 m; the box includes the surrounding buildings and the gate |
| [Konark Sun Temple](monuments/konark-sun-temple.html) | 38.4 | **44.4** | +16% | 42.7 | the 4.1 m terrace under the hall; the table's own figure, and the ASI's 30 m is the outlier |
| [Sanchi Stupa](monuments/sanchi-stupa.html) | 16.5 | **22.7** | +38% | 22.1 | the railing and toranas stand above the dome |
| [Victoria Memorial](monuments/victoria-memorial.html) | 56.0 | **62.4** | +11% | 59.1 | the plinth and the Angel above the dome |
| [Meenakshi Temple](monuments/meenakshi-temple.html) | 51.9 | **55.7** | +7% | 54.8 | the plinth and the gopuram finials |
| [Lotus Temple](monuments/lotus-temple.html) | 34.0 | **37.8** | +11% | 34.0 | the plinth and the pools' kerbs |
| [Shore Temple](monuments/shore-temple.html) | 18.0 | **19.7** | +9% | 18.8 | the plinth |
| [Rani Ki Vav](monuments/rani-ki-vav.html) | 27.0 | **52.9** | +96% | 36.3 | a stepwell: the box spans the top terrace to the well floor |
| [Amber Fort](monuments/amber-fort.html) | 52.0 | **79.8** | +53% | 75.2 | the hill the palace stands on |
| [Csmt Mumbai](monuments/csmt-mumbai.html) | 53.8 | **62.3** | +16% | 56.7 | 48.8 m is to the dome's apex, plus the 5 m Statue of Progress = 53.8; **8.5 m still unexplained** |
| [Mahabodhi Temple](monuments/mahabodhi-temple.html) | 52.0 | **57.2** | +10% | 52.5 | the plinth and the tower's finial |
| [Statue Of Unity](monuments/statue-of-unity.html) | 240.0 | **249.9** | +4% | 180.8 | statue 182 m on a 58 m plinth; the box spans both |
| [Kandariya Mahadeva](monuments/kandariya-mahadeva.html) | 31.0 | **33.0** | +6% | 31.9 | the plinth |
| [Basilica Bom Jesus](monuments/basilica-bom-jesus.html) | 24.0 | **32.8** | +37% | 32.8 | the belfry at the rear, which the façade figures exclude |
| [Mehrangarh Fort](monuments/mehrangarh-fort.html) | 36.0 | **135.3** | +276% | 129.6 | the rock the fort stands on, ~100 m |
| [Jantar Mantar](monuments/jantar-mantar.html) | 27.0 | **27.4** | +1% | 27.1 | — |
| [Somnath Temple](monuments/somnath-temple.html) | 50.0 | **61.3** | +23% | 60.9 | the flag mast |

**Read this table carefully.** The box is not the building: it is everything the
page draws that is not sky, terrain or weather, so a fort on a rock, a stepwell
below grade, a flag mast or a plinth all read as height. Where the note names the
extra object, the model is not wrong — the measurement is measuring more than the
published figure.

**The three that were flagged have been researched, and two of them were the
figure, not the model:**

- **Konark.** The figure in the height table was 30 m, which is the ASI's own
  wording ("jagamohana, 30 m square and 30 m high"). The surveys say otherwise:
  Swarup measured the porch at 112 ft 5 in from the platform, 125 ft 8 in above
  ground, and Ganguly's theodolite gave 129 ft 8 in — **about 39 m**, which is also
  what Wikipedia, the Odisha histories and the 1627 Madalapanji reading agree on.
  Add the 4.1 m terrace the hall stands on and the building is 42.5 m against the
  model's 44.4 m. The model was right and the height table was wrong; it now says
  38.4 m, which is the figure this file's own Konark section has carried since the
  first session.
- **The Basilica.** 61 ft (18.6 m) is the façade; the model's box reaches the
  belfry at the rear, which the façade figures exclude. Not a discrepancy in the
  building, but the box is measuring a different part of it.
- **CSMT.** 48.8 m is to the dome's apex; the Statue of Progress on top is 16 ft
  6 in, so 53.8 m to the top of the figure. The model's box is 62.3 m — **8.5 m
  above that, and still unexplained.** It is the one real question left in this
  table.

Two of the three were the published figure measuring something narrower than the
model draws. That is the argument for recording a discrepancy instead of adjusting
a model to satisfy it: the adjustment would have made Konark *wrong*.
