"""Contrast audit: every text node's colour against the background behind it.

The accessibility gate checks structure — skip link, landmarks, alt text, focus
trap. It has never checked whether the text can actually be read, which is the
failure most people actually experience.

    python3 tools/contrastcheck.py                    # index, credits, two monuments
    python3 tools/contrastcheck.py --only index.html

Reports WCAG 2.1 AA (4.5:1 normal text, 3:1 large text at 24 px or 18.66 px bold).

**What it trusts and what it does not.** The landing page is a flat cream background
and its numbers are trustworthy — that is where it found three real failures. The
monument pages layer a translucent panel over a canvas, and the tool reports
gold-on-dark panel headings at 1.34:1, which is not true of the rendered page. So
**read the landing and credits results, and treat the monument pages as unverified**
until the layering is modelled properly. Text over the canvas, over a photograph or
over a gradient is skipped rather than guessed at.

Requires: pip install playwright, and a Chromium (CHROME_PATH env var).
"""
import argparse, asyncio, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')

PROBE = """() => {
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a),
                              g: fg.g * fg.a + bg.g * (1 - fg.a),
                              b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = (el) => {
    let n = el, acc = null;
    while (n) {
      const cs = getComputedStyle(n);
      // a background-image may be a gradient (which can change the colour a lot)
      // or a repeating noise texture over a flat colour (which does not). Take the
      // flat colour when there is one and keep going; only give up if there is none.
      if (cs.backgroundImage && cs.backgroundImage !== 'none' &&
          !(parse(cs.backgroundColor) || { a: 0 }).a) { n = n.parentElement; continue; }
      const c = parse(cs.backgroundColor);
      // composite every layer, however opaque it claims to be: a panel at
      // rgba(18,20,29,.92) over a cream body is not (18,20,29)
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        if (c.a >= 0.999) return acc;
      }
      n = n.parentElement;
    }
    return null;      // nothing opaque behind it: the canvas, a photograph or a
                      // gradient. Guessing white here scored the hint over the
                      // canvas at 1.38 and the card numbers over their photographs
                      // at 1.97, both false.
  };
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
    if (!text) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    // a screen-reader-only node is clipped to a pixel on purpose: it is not
    // read by eye and must not be scored as if it were
    if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
    // anything drawn over the 3D canvas is scored against whatever the scene
    // happens to be showing, which this tool cannot know
    if (el.closest('#app')) return;
    // or if a canvas is what is actually behind it: hit-test the element's centre
    const rr = el.getBoundingClientRect();
    const hit = document.elementFromPoint(rr.left + rr.width / 2, rr.top + rr.height / 2);
    if (hit && (hit.tagName === 'CANVAS' || hit.tagName === 'IMG' ||
                (hit.closest && (hit.closest('#app') || hit.closest('picture'))))) return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.width <= 2 || r.height <= 2) return;
    const fg0 = parse(cs.color); const bg = bgOf(el);
    if (!fg0 || !bg) return;
    let op = 1, n = el;
    while (n && n !== document.documentElement) { op *= +getComputedStyle(n).opacity; n = n.parentElement; }
    if (op < 0.05) return;                     // not rendered
    const fg = op < 1 ? over({ ...fg0, a: fg0.a * op }, bg) : over(fg0, bg);
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    out.push({ text: text.slice(0, 40), ratio: +ratio.toFixed(2), size, weight, large,
               fg: cs.color, tag: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') });
  });
  return out;
}"""

PAGES = ['index.html', 'credits.html', 'monuments/qutub-minar.html', 'monuments/taj-mahal.html']


async def main(pages, width, height):
    from playwright.async_api import async_playwright
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for page_name in pages:
            path = os.path.join(ROOT, page_name)
            if not os.path.exists(path):
                print('%-28s skip  not found' % page_name)
                continue
            pg = await b.new_page(viewport={'width': width, 'height': height})
            await pg.goto('file://' + path, wait_until='load', timeout=60000)
            # The pages reveal on scroll: a `.rv` element sits at opacity 0 until it
            # is scrolled into view, and an ancestor at opacity 0 makes every ratio
            # compute as 1.00 — which is how the first run "failed" 88 nodes.
            await pg.add_style_tag(content='*{animation:none!important;transition:none!important}'
                                           '.rv{opacity:1!important;transform:none!important}')
            await pg.wait_for_timeout(1200)
            rows = await pg.evaluate(PROBE)
            fails = [r for r in rows if r['ratio'] < (3.0 if r['large'] else 4.5)]
            fails.sort(key=lambda r: r['ratio'])
            print('%-28s %3d text nodes, %d below AA' % (page_name, len(rows), len(fails)))
            for r in fails[:8]:
                print('    %5.2f  %-26s %5.1fpx w%s  %s' % (
                    r['ratio'], r['tag'][:26], r['size'], r['weight'], r['text'][:36]))
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
    a = ap.parse_args()
    sys.exit(asyncio.run(main(a.only or PAGES, a.width, a.height)))
