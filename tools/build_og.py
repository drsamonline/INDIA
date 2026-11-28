#!/usr/bin/env python3
"""Rebuild the share-card crops from the photographs.

A social card is about 1.9:1. Thirteen of the monument photographs are portrait or
square, so pointing `og:image` at them means the platform crops through the middle of
the subject — the Qutb's shaft, the Statue's head.

Each of those pages gets a 1200x630 crop instead, and **the band is chosen by looking at
the photograph**, not by centring: the value below is where the crop starts as a fraction
of the source height. Change a photograph, re-run this, and look at the result.

    python3 tools/build_og.py            # every crop
    python3 tools/build_og.py qutub-minar

Writes assets/img/og/<id>.jpg. The pages pick them up through `ogImage` in
data/monuments.json; `tools/check_html.py` fails if a page points at something that is
missing, under 1200 px wide, or portrait.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = (1200, 630)

# id -> (source file, where the crop starts as a fraction of the source height)
SPEC = {
    'qutub-minar':      ('qutub-minar.jpg',      0.34),   # the shaft's balconies
    'statue-of-unity':  ('statue-of-unity.jpg',  0.04),   # the head has to be whole
    'charminar':        ('charminar.jpg',        0.16),   # the two minarets and the arcade
    'sanchi-stupa':     ('sanchi.jpg',           0.20),   # the torana with the dome behind
    'mahabodhi-temple': ('mahabodhi-temple.jpg', 0.10),   # the shikhara's body
    'india-gate':       ('india-gate.jpg',       0.08),   # the inscription and the arch
    'gateway-of-india': ('gateway-of-india.jpg', 0.06),   # the arch, without the crowd
    'amber-fort':       ('amber-fort.jpg',       0.12),   # the palace and the lake below
    'mysore-palace':    ('mysore-palace.jpg',    0.30),   # also under 1200 px wide
    'lotus-temple':     ('lotus-temple.jpg',     0.25),   # also under 1200 px wide
    'somnath-temple':   ('somnath-temple.jpg',   0.20),   # 1.27:1, too square for a card
    'hawa-mahal':       ('hawa-mahal.jpg',       0.30),   # 1.33:1
    'kandariya-mahadeva': ('kandariya-mahadeva.jpg', 0.22),  # 1.33:1
    'taj-mahal':        ('taj-mahal.jpg',        0.30),   # its own builder points here
}


def main(only):
    from PIL import Image
    out_dir = os.path.join(ROOT, 'assets', 'img', 'og')
    os.makedirs(out_dir, exist_ok=True)
    ids = only or sorted(SPEC)
    for mid in ids:
        if mid not in SPEC:
            print('%-22s not in the crop list' % mid)
            continue
        src, y0 = SPEC[mid]
        path = os.path.join(ROOT, 'assets', 'img', src)
        if not os.path.exists(path):
            print('%-22s source missing: %s' % (mid, src))
            continue
        im = Image.open(path).convert('RGB')
        w, h = im.size
        band = min(h, int(round(w / (TARGET[0] / TARGET[1]))))
        top = int(round((h - band) * y0))
        crop = im.crop((0, top, w, top + band)).resize(TARGET, Image.LANCZOS)
        out = os.path.join(out_dir, mid + '.jpg')
        crop.save(out, quality=84, optimize=True)
        print('%-22s %4dx%-4d -> %s (%d KB)' % (mid, w, h, os.path.relpath(out, ROOT),
                                                os.path.getsize(out) // 1024))
    print('\n%d crop(s); look at them before committing' % len(ids))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
