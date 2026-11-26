"""Contrast audit: is the text readable against what is actually behind it?

The accessibility gate checks structure — skip link, landmarks, alt text, focus
trap. It never checked whether text can be **read**, which is the failure people
actually experience.

**Why this samples pixels instead of walking the CSS.** The first version of this
tool composited background colours up the tree. It scored white text over the 3D
canvas against a white guess, read a reveal animation still at opacity 0 as
invisible, and reported gold-on-dark panel headings at 1.34:1. Every one of those
was the tool's fault, because a page's real backdrop is what the renderer painted,
not what the cascade says.

So: photograph the page with every glyph made transparent, then sample the median
colour under each text node's box. That is the backdrop, whatever produced it —
canvas, photograph, gradient, translucent panel.

    python3 tools/contrastcheck.py                     # the four default pages
    python3 tools/contrastcheck.py --only index.html
    python3 tools/contrastcheck.py --width 390 --height 844

Reports WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large (24 px, or 18.66 px bold).

**Known limit.** On the monument pages the tool reports a `.deva` and a `.panel-sub`
at 1.20 and 2.03 on Qutb Minar. Both are wrong for what a reader sees: the panel
header is gold on #212c, about 6.2:1, and a crop of the rendered header confirms it.
The tool is picking up a second element of the same class — most likely the tour
card's Devanagari title — while it sits over the canvas. Until that is pinned down,
**trust the landing and credits results and treat the two monument readings as open.**

Requires: pip install playwright pillow, and a Chromium (CHROME_PATH env var).
"""
import argparse, asyncio, io as _io, os, statistics, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')
# the Taj is left out by default: it takes minutes to load and its loader covers
# the page until then. Pass --only monuments/taj-mahal.html to include it.
PAGES = ['index.html', 'credits.html', 'monuments/qutub-minar.html',
         'monuments/meenakshi-temple.html']

# collect the text nodes: colour, box, size, weight
COLLECT = """() => {
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
    if (!text) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    if (r.bottom < 0 || r.top > innerHeight) return;         // off-screen: no pixels
    let op = 1, n = el;
    while (n) { op *= +getComputedStyle(n).opacity; n = n.parentElement; }
    if (op < 0.05) return;
    const c = parse(cs.color); if (!c) return;
    out.push({ text: text.slice(0, 38), r: [r.left, r.top, r.width, r.height],
               color: [c.r, c.g, c.b], alpha: c.a * op,
               size: parseFloat(cs.fontSize), weight: +cs.fontWeight || 400,
               tag: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') });
  });
  return out;
}"""

HIDE_TEXT = """* { color: transparent !important; text-shadow: none !important;
      -webkit-text-fill-color: transparent !important; }"""


DEBUG = ''


def lum(c):
    def f(v):
        v /= 255.0
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])


def ratio(fg, bg):
    l1, l2 = lum(fg), lum(bg)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


def over(fg, a, bg):
    return [fg[i] * a + bg[i] * (1 - a) for i in range(3)]


async def main(pages, width, height, verbose):
    from playwright.async_api import async_playwright
    from PIL import Image
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for name in pages:
            path = os.path.join(ROOT, name)
            if not os.path.exists(path):
                print('%-30s skip  not found' % name)
                continue
            pg = await b.new_page(viewport={'width': width, 'height': height})
            await pg.goto('file://' + path, wait_until='load', timeout=60000)
            # reveals: a `.rv` at opacity 0 is not rendered yet, and a page mid-fade
            # is not what anyone reads
            await pg.add_style_tag(content='*{animation:none!important;transition:none!important}'
                                           '.rv{opacity:1!important;transform:none!important}')
            # wait for the scene to finish booting. Without this the tool measures
            # the loading screen, where a Devanagari title sits over bright sky and
            # scored 1.20 — a real reading of a page nobody is meant to read.
            try:
                await pg.wait_for_function("document.documentElement.dataset.boot==='ok'", timeout=150000)
            except Exception:
                pass                      # the Taj never sets it
            await pg.wait_for_timeout(1200)
            # measure the whole page, not just the first viewport: grow the window to
            # the document height (capped) so nothing below the fold goes unchecked
            doc_h = await pg.evaluate("Math.min(document.documentElement.scrollHeight, 7000)")
            if doc_h and doc_h > height:
                await pg.set_viewport_size({'width': width, 'height': int(doc_h)})
                await pg.wait_for_timeout(900)
            nodes = await pg.evaluate(COLLECT)
            # the plate: the same page with every glyph invisible
            await pg.add_style_tag(content=HIDE_TEXT)
            await pg.wait_for_timeout(250)
            shot = await pg.screenshot(timeout=120000)
            img = Image.open(_io.BytesIO(shot)).convert('RGB')
            fails = []
            for n in nodes:
                x, y, w, h = n['r']
                x0, y0 = int(max(0, x)), int(max(0, y))
                x1, y1 = int(min(img.width, x + w)), int(min(img.height, y + h))
                if x1 - x0 < 2 or y1 - y0 < 2:
                    continue
                crop = img.crop((x0, y0, x1, y1))
                raw = crop.convert("RGB").tobytes(); px = [tuple(raw[i:i+3]) for i in range(0, len(raw), 3)]
                bg = [statistics.median([p[i] for p in px]) for i in range(3)]
                fg = over(n['color'], n['alpha'], bg) if n['alpha'] < 1 else n['color']
                rt = ratio(fg, bg)
                need = 3.0 if (n['size'] >= 24 or (n['size'] >= 18.66 and n['weight'] >= 700)) else 4.5
                if verbose and n['tag'].startswith(DEBUG):
                    print('      debug %-16s fg=%s a=%.2f bg=%s ratio=%.2f' % (
                        n['tag'], n['color'], n['alpha'], [round(v) for v in bg], rt))
                if rt < need:
                    fails.append((rt, need, n))
            fails.sort(key=lambda t: t[0])
            print('%-30s %3d text nodes, %d below AA' % (name, len(nodes), len(fails)))
            for rt, need, n in (fails if verbose else fails[:8]):
                print('    %5.2f (needs %.1f)  %-22s %5.1fpx w%s  %s' % (
                    rt, need, n['tag'][:22], n['size'], n['weight'], n['text']))
            bad += len(fails)
            await pg.close()
        await b.close()
    print('\n%d text node(s) below WCAG AA' % bad)
    return 1 if bad else 0


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', nargs='*', default=None)
    ap.add_argument('--width', type=int, default=1200)
    ap.add_argument('--height', type=int, default=900)
    ap.add_argument('--all', action='store_true', help='print every failure, not the worst 8')
    ap.add_argument('--debug', default='', help='print fg/bg/ratio for tags starting with this')
    a = ap.parse_args()
    DEBUG = a.debug
    globals()['DEBUG'] = a.debug
    sys.exit(asyncio.run(main(a.only or PAGES, a.width, a.height, a.all or bool(a.debug))))
