"""Rebuild docs/gallery.jpg — the repo's contact sheet of all 24.

The old one was from the first session and showed every model before the repass:
Jantar Mantar orange, Somnath dark, Konark cold grey, Hawa Mahal brick red, the
Gateway grey, Meenakshi's office blocks. Regenerate from shots/audit/ after any
pass that changes a page.

    python3 tools/build_gallery.py
"""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'shots', 'audit')
OUT = os.path.join(ROOT, 'docs', 'gallery.jpg')

COLS, TW, TH, GAP, LAB = 4, 380, 238, 6, 40


def font(size, bold=False):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else ''),
              '/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf' % ('-Bold' if bold else '')):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main():
    data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))
    rows = (len(data) + COLS - 1) // COLS
    W = COLS * (TW + GAP) + GAP
    H = rows * (TH + LAB + GAP) + GAP
    img = Image.new('RGB', (W, H), (13, 13, 15))
    d = ImageDraw.Draw(img)
    f_name, f_sub = font(15, True), font(11)

    for i, m in enumerate(data):
        path = os.path.join(SRC, m['id'] + '-560x350.png')
        if not os.path.exists(path):
            print('  missing tile:', m['id'])
            continue
        r, c = divmod(i, COLS)
        x = GAP + c * (TW + GAP)
        y = GAP + r * (TH + LAB + GAP)
        img.paste(Image.open(path).convert('RGB').resize((TW, TH)), (x, y))
        d.text((x + 2, y + TH + 8), m['name'].upper(), fill=(232, 226, 212), font=f_name)
        sub = ' · '.join([m.get('place', ''), m.get('era', '')]).strip(' ·')
        d.text((x + 2, y + TH + 26), sub, fill=(140, 134, 122), font=f_sub)

    img.save(OUT, quality=86)
    print(f'{OUT}  {img.size[0]}x{img.size[1]}  {len(data)} monuments')


if __name__ == '__main__':
    main()
