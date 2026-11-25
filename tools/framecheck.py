#!/usr/bin/env python3
"""Report the framing of every named view and tour stop.

The Statue of Unity's tour was shooting a 182 m figure from 120-180 m, which at
fov 40 frames 90-130 m — every stop was a cropped bronze wall. That class of bug
is invisible in code and obvious in a render, so measure it instead:

    python3 tools/framecheck.py            # every module
    python3 tools/framecheck.py --only taj-mahal konark-sun-temple

For each camera it prints the distance to its target, the vertical extent that
distance covers at the camera's fov, and a verdict against the height given in
the table below. Heights are the real buildings' published figures, so a view
that frames less than the building is wrong however it looks.
"""
import argparse, json, os, re, sys, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# published overall heights, in metres
H = {
    'taj-mahal': 73, 'qutub-minar': 72.5, 'hawa-mahal': 15, 'charminar': 56,
    'gateway-of-india': 26, 'india-gate': 42.35, 'mysore-palace': 44.8,
    'golden-temple': 16.5, 'konark-sun-temple': 30, 'sanchi-stupa': 16.5,
    'victoria-memorial': 56, 'meenakshi-temple': 51.9, 'lotus-temple': 34,
    'shore-temple': 18, 'rani-ki-vav': 27, 'amber-fort': 52,
    'csmt-mumbai': 48.8, 'mahabodhi-temple': 52, 'statue-of-unity': 240,
    'kandariya-mahadeva': 31, 'basilica-bom-jesus': 25, 'mehrangarh-fort': 36,
    'jantar-mantar': 27, 'somnath-temple': 50,
}

POS = re.compile(r"pos:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*,\s*target:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]")
NAME = re.compile(r"name:\s*'([^']+)'")


def fov_of(src, default=40.0):
    m = re.search(r"fov:\s*([\d.]+)", src)
    return float(m.group(1)) if m else default


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', nargs='*')
    ap.add_argument('--tol', type=float, default=0.15,
                    help='flag when the frame is more than this fraction short')
    a = ap.parse_args()
    data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))
    bad = 0
    for m in data:
        mid = m['id']
        if a.only and mid not in a.only:
            continue
        if mid == 'taj-mahal':
            continue                      # self-contained page, not a module
        path = os.path.join(ROOT, 'assets', 'js', 'monuments', mid + '.js')
        if not os.path.exists(path):
            continue
        src = open(path, encoding='utf-8').read()
        fov = fov_of(src)
        height = H.get(mid, 0)
        rows = []
        for label, block in (('view', src), ('tour', src)):
            pass
        # named views
        for mm in re.finditer(r"\{\s*name:\s*'([^']+)'\s*,\s*pos:\s*\[([^\]]+)\]\s*,\s*target:\s*\[([^\]]+)\]", src):
            name = mm.group(1)
            p = [float(x) for x in mm.group(2).split(',')]
            t = [float(x) for x in mm.group(3).split(',')]
            rows.append(('view: ' + name, p, t))
        # tour stops: pos/target pairs, named by the preceding title
        for mm in re.finditer(r"title:\s*'([^']+)'[^}]*?pos:\s*\[([^\]]+)\]\s*,\s*target:\s*\[([^\]]+)\]", src, re.S):
            name = mm.group(1)
            p = [float(x) for x in mm.group(2).split(',')]
            t = [float(x) for x in mm.group(3).split(',')]
            rows.append(('tour: ' + name, p, t))
        if not rows:
            continue
        # the home camera is the one that must show the building: it is what the
        # page opens on, what the gallery and the social card use. Detail views
        # are meant to be close — the old check flagged every one of them and
        # returned zero either way, which is a report nobody can act on.
        home = re.search(r"home:\s*\{\s*pos:\s*\[([^\]]+)\]\s*,\s*target:\s*\[([^\]]+)\]", src)
        if home:
            hp = [float(x) for x in home.group(1).split(',')]
            ht = [float(x) for x in home.group(2).split(',')]
            hd = math.dist(hp, ht)
            hext = 2 * hd * math.tan(math.radians(fov / 2))
            if hext < height * 1.25 * (1 - a.tol):
                bad += 1
                print(f'{mid}  (fov {fov:g}, height {height} m)')
                print(f'   {"home":44s} d={hd:6.0f} m  frames {hext:5.0f} m  of {height:5.1f}  SHORT')
        out = []
        for name, p, t in rows:
            d = math.dist(p, t)
            ext = 2 * d * math.tan(math.radians(fov / 2))
            # a detail view is allowed to frame a quarter of the building. Below
            # that it is usually looking at something that is not the building —
            # the Iron Pillar, the bodhi tree, a crossing — so this is listed for
            # a human to glance at, not counted as a failure
            if ext < height * 0.25:
                out.append(f'   {name:44s} d={d:6.0f} m  frames {ext:5.0f} m  of {height:5.1f}  close-up')
        if out:
            print(f'{mid}  (fov {fov:g}, height {height} m) — detail views, expected:')
            print('\n'.join(out))
    print(f'\n{bad} home camera(s) frame less than the building.')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
