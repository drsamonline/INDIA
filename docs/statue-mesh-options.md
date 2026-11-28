# The Statue of Unity: what a real mesh would cost, and what it would change

The figure on `/monuments/statue-of-unity.html` is **procedural** — built from code in
`assets/js/monuments/statue-of-unity.js` — and it is honest about that: its fidelity
level is **study**, and the About drawer says in as many words that it is not a portrait
of Sardar Patel.

This note exists so that the decision to change that is a decision, not a research task.
Compiled 28 November 2026. Prices and licences are as published on the day; **check the
licence field on the page before paying** — it is the one thing a search result cannot
settle.

## The two constraints that decide most of it

1. **The repository is public and the site is CC BY-NC 4.0.** Anything committed to it is
   downloadable by anyone. Most marketplace "Royalty Free" licences let you *use* an
   asset in a project but **forbid redistributing the asset itself** — which is exactly
   what committing it to a public repository does. A mesh that cannot be redistributed
   cannot live in this repo.
2. **The triangle budget.** The monument pages run at roughly 90,000 triangles and are
   already the heaviest thing on the site. A 250k–1M triangle statue needs decimating to
   about 40–60k before it can be one of them.

## What is available

| Model | Where | Price | Size | Licence, as published | Fits this repo? |
|---|---|---|---|---|---|
| Statue Of Unity India — Chenzoss | Sketchfab | free download | 249.6k vertices | free download, licence shown on the page | **Possibly** — free downloads on Sketchfab are Creative Commons; confirm it is CC BY or CC0, not NC-ND |
| Statue of Unity — EasyGameStudio | CGTrader / ArtStation | $9.99 | 23,189 tris | Royalty Free (CGTrader) / Standard + Extended (ArtStation) | No — royalty free is not redistribution |
| Statue of Unity low-poly — reyknow | CGTrader | $29 ($25 on sale) | 14,000 polys | Royalty Free | No — same reason |
| Statue of Unity — Gurpreet4424 | CGTrader | $5 | low-poly, rigged | Royalty Free | No |
| Sardar Patel 3D print — rkdesignstudio | CGTrader | $51 | STL/OBJ/3DM | Royalty Free | No — and it is a print model, not a display mesh |
| Statue of Unity — arshad irfan | Sketchfab via STLFinder | **$9,500** | STL | Standard | No |
| Statues of Unity — nicotepo | Sketchfab | free download | 566k tris | free download — but **generated with Meshy AI** | No — an AI-generated mesh would need saying so, and it is a different honesty problem |
| Statue of Unity — ARK Technology / vishaljeengar09 / mut2995 | Sketchfab | viewing only | 600k–1M tris | not stated as downloadable | No |

## What each route would actually involve

**A. Use the Sketchfab free model, if its licence is CC BY.**
Pay nothing. Attribute the author on the statue page and in `credits.html`, decimate from
~250k to ~50k triangles, retarget the material to the engine's palette, and **change the
homepage's "No downloaded models" claim** — which the owner has already approved as
"generated in code, one page uses a licensed mesh". This is the only route that keeps
everything in a public repository.

**B. Buy a marketplace model.**
$5–$51. It cannot be committed to a public repository under a royalty-free licence, so
the mesh would have to be served from somewhere private, or the repo would have to stop
being public, or the licence would have to explicitly permit redistribution — which is
rare and worth asking the seller about in writing.

**C. Commission or sculpt one.**
The only route that produces a mesh this project could own outright. Weeks of work or a
real invoice.

**D. Leave it as a study.**
The page already says what it is. Nothing on the site is untrue today, and this costs
nothing.

## What I would do

**A, if and only if the Sketchfab licence is CC BY or CC0** — because it is the only
option that is compatible with a public repository, and the attribution requirement is
one this project already meets elsewhere. Otherwise **D**, and spend the effort on the
twelve monuments whose fidelity notes are longer than their models deserve.

Not B: paying money for a mesh that cannot be committed is the worst of both.

---

Sources: the model pages linked above (Sketchfab, CGTrader, ArtStation, STLFinder), read
on 28 November 2026. The licence column is what each page states; none of it has been
verified against the licence text itself.
