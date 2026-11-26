# Contributing — and being credited

Most of the models in this atlas are approximations, and some are rough. They were
built by one person from published dimensions and photographs, not surveyed. If
you improve one, **your name and a link go on the credits page and inside the
model itself** — that is the deal, and there is nothing else to sign.

## Before you trust a check

Seven bugs in one week of this repository shared one cause: a passing signal was
taken for evidence. A few of them are worth knowing about before you add a model,
because they are easy to repeat:

- **Make the check fail before you trust it.** Break something deliberately and
  watch the gate go red. A check that has never failed has not been tested — this
  repository had a CI job that reported success without ever running.
- **A number is not a measurement until you know what it measures.** `measure.py`
  once reported a height that included a slab 9 m below ground, and a whole
  afternoon went into explaining a discrepancy that did not exist.
- **When a check disagrees with your eye, print the selector** rather than
  concluding the check is wrong. It usually is not.
- **When you fix a class of bug, search for the class.** A missing scrim behind
  text over a photograph was fixed; the same need over the 3D canvas was not, and
  the identical bug shipped twice.
- **An empty `catch` is a lie waiting to be told.** Two of the seven were hidden
  that way.
- **Say "unverified" out loud.** Half of these were only found because a note said
  so and the next pass picked it up.

## What the levels mean

| Level | Means |
|---|---|
| **measured** | dimensions taken from a published survey and checked against the built geometry |
| **approximate** | the right massing and proportions, with the ornament simplified or suggested |
| **study** | a deliberate simplification, not an attempt at a reconstruction |

Every monument's level and its reason are in `data/monuments.json` under
`fidelity`, shown in the About drawer of its page, and listed on
[the credits page](credits.html#improve). `DIMENSIONS.md` has the
measured-versus-model table for all 24, with the sources.

## How to improve one

1. **Pick one monument.** One model per pull request, so the credit is unambiguous.
2. **Say where the dimensions came from.** A survey, an ASI or UNESCO record, a
   measured drawing, a photograph with its scale — name it. Where sources
   disagree, pick a reading and say which; `DIMENSIONS.md` already records several
   such disputes rather than averaging them.
3. **Edit only that monument's module** — `assets/js/monuments/<id>.js` — or, for
   the Taj, `tools/build_taj.py`. The source scene at
   `tools/source/taj-mahal.original.html` is never edited.
4. **Run the checks** and paste the result in the pull request:
   ```
   python3 tools/build_site.py
   python3 tools/audit_data.py --strict
   python3 tools/linkcheck.py
   python3 tools/tintcheck.py --ci
   python3 tools/measure.py <id>          # if you changed a dimension
   ```
5. **Say what you changed and what you did not.** "The plinth is now 95.5 m
   square; the minarets are untouched" is the shape of a good message.

## How the credit works

When your change is merged, three things happen, and they all carry your name:

| Where | What is added |
|---|---|
| `data/monuments.json` | your entry in that monument's `contributors` array: `{"name": "...", "url": "https://..."}` |
| the monument's page | an "Improved by *your name*" line in its About drawer, linking to your URL |
| `assets/js/monuments/<id>.js` | the same name and link in the module's header comment, so the credit travels with the code |
| `credits.html` | your name in that monument's row of the fidelity table |

If you would rather not be named, say so and the change goes in without a credit
line. If you would rather be named without a link, leave `url` out.

## What is genuinely wanted

The list below is what the record already admits is weak, taken from the
`fidelity` notes and `HANDOFF.md`. It is a starting point, not a limit:

- **The Statue of Unity's figure** is procedural and is not a portrait. It needs a
  sculpted mesh; that is a modelling job, not a tweak.
- **The Taj's plinth** is 26 per cent small against the tomb, and everything else
  on that page is keyed to its footprint.
- **Meenakshi's gopurams** all come from one generator; the figure registers are
  suggested rather than carved.
- **Konark's deul** is a tapered stump; the wheels and the porch carry the detail.
- **CSMT's menagerie** is modelled at three times its true scale so that it reads
  at all — the honest fix is more geometry, not more scale.
- **Jantar Mantar's quadrants** have the right geometry in the right plane, but the
  graduated scale on the arc is a thin band rather than a scale.

## Licence

Contributions are accepted under the same
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) licence as the rest
of the atlas: attribution to you and to this project, no commercial use. You keep
your copyright — this is a licence, not an assignment.
