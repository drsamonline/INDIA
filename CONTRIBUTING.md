# Contributing

Contributions are welcome — a corrected date, a better photograph, a sharper
model, a fixed bug.

## Before you start

- Read `tools/MONUMENT-CONTRACT.md` if you are adding or changing a monument.
- Every monument is data plus one module: an entry in `data/monuments.json`
  and a file in `assets/js/monuments/<id>.js`. The pages are generated —
  never edit `monuments/*.html` or `index.html` by hand.
- Run `python3 tools/build_site.py` after changing data, then
  `python3 tools/check_all.py --only <id>` to confirm the page still boots.

## Facts

Historical claims must be traceable to the Wikipedia article named in the
monument's entry, or to a UNESCO record. If you correct a fact, say where the
correction comes from in the pull request.

## Photographs

Any new photograph must be on Wikimedia Commons under a CC0, CC BY, CC BY-SA
or public-domain licence. Add the file name, photographer, licence and licence
URL to the monument's entry in `data/monuments.json`; `credits.html` and
`NOTICE` are generated from it. Do not add images under the GFDL or a
non-commercial licence.

## Code style

- ES modules, no build step, no framework, no new dependencies.
- Two-space indent, single quotes, semicolons, `const` by default.
- Keep the engine's public surface in `monument-engine.js` and the geometry in
  the monument modules.
- No external network calls at runtime.

## Licence of contributions

By opening a pull request you agree that your code and models are contributed
under CC BY-NC 4.0 — the licence the rest of the atlas uses — and that any text
you add may be adapted and published under CC BY-SA 4.0.

## Reporting a security issue

See `SECURITY.md`. Do not open a public issue for a live vulnerability.
