#!/usr/bin/env python3
"""Measure a monument's built geometry, in metres, off the actual mesh.

The DIMENSIONS tables carry a "Model" column that was written from the source —
from the constants in a module, or for the Taj from the numbers in the original
scene — and never checked against the geometry that gets drawn. This does the
check: it loads the page, walks the scene, and reports the world-space extent of
everything that is not sky, ground or weather.

    python3 tools/measure.py qutub-minar
    python3 tools/measure.py taj-mahal --unit 3.353     # the Taj is unit-scaled
    python3 tools/measure.py --all

The engine's pages are authored in metres, so their figures need no scale. The Taj
is a unit-scale scene where 1 unit = 3.353 m (57 m tomb side / 17 units), which is
exactly the conversion recorded in DIMENSIONS.md.

Requires: pip install playwright, and a Chromium (CHROME_PATH env var).
"""
import argparse, asyncio, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')

# Everything bigger than this is sky, ground, clouds or the starfield.
FAR = 1500

PROBE = """(far) => {
  const S = (window.__india && window.__india.scene) || (window.__taj && window.__taj.scene);
  if (!S || !window.THREE) return null;
  const T = window.THREE;
  const acc = { min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9], n: 0 };
  const per = [];
  const b = new T.Box3(), tmp = new T.Box3();
  S.updateMatrixWorld(true);
  S.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (o.material && o.material.isShaderMaterial) return;          // sky dome
    b.setFromObject(o);
    if (!isFinite(b.min.x) || !isFinite(b.max.x)) return;
    const size = Math.max(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z);
    if (size > far) return;                                          // ground, clouds
    acc.n++;
    acc.min = [Math.min(acc.min[0], b.min.x), Math.min(acc.min[1], b.min.y), Math.min(acc.min[2], b.min.z)];
    acc.max = [Math.max(acc.max[0], b.max.x), Math.max(acc.max[1], b.max.y), Math.max(acc.max[2], b.max.z)];
    per.push({ size: [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z],
               at: [(b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2] });
  });
  // the tallest single object is the thing a visitor reads as "the monument"
  per.sort((a, c) => c.size[1] - a.size[1]);
  return { acc, tallest: per.slice(0, 3), meshes: acc.n };
}"""


async def measure(ids, unit):
    from playwright.async_api import async_playwright
    out = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for mid in ids:
            pg = await b.new_page(viewport={'width': 400, 'height': 400})
            # the page needs THREE in scope for the probe
            await pg.goto('file://' + os.path.join(ROOT, 'monuments', mid + '.html') + '?shot=11',
                          wait_until='load', timeout=60000)
            try:
                await pg.wait_for_function("document.documentElement.dataset.boot==='ok'", timeout=150000)
            except Exception:
                await pg.wait_for_timeout(20000)          # the Taj sets no boot flag
            await pg.wait_for_timeout(1200)
            await pg.evaluate("import('three').then(m => { window.THREE = m; })")
            await pg.wait_for_timeout(600)
            r = await pg.evaluate(PROBE, FAR)
            if r:
                u = unit
                w = (r['acc']['max'][0] - r['acc']['min'][0]) * u
                h = (r['acc']['max'][1] - r['acc']['min'][1]) * u
                d = (r['acc']['max'][2] - r['acc']['min'][2]) * u
                tall = r['tallest'][0]['size'][1] * u if r['tallest'] else 0
                out.append((mid, r['meshes'], w, h, d, tall))
            else:
                out.append((mid, 0, 0, 0, 0, 0))
            await pg.close()
        await b.close()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('only', nargs='*')
    ap.add_argument('--unit', type=float, default=1.0, help='metres per scene unit')
    ap.add_argument('--all', action='store_true')
    args = ap.parse_args()
    ids = args.only
    if args.all or not ids:
        data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))
        ids = [m['id'] for m in (data['monuments'] if isinstance(data, dict) else data)]
    unit = args.unit
    if 'taj-mahal' in ids and unit == 1.0:
        print('note: the Taj is unit-scaled; pass --unit 3.353 for metres\\n')
    rows = asyncio.run(measure(ids, unit))
    print('%-22s %7s %8s %8s %8s %9s' % ('monument', 'meshes', 'width', 'height', 'depth', 'tallest'))
    for mid, n, w, h, d, tall in rows:
        print('%-22s %7d %7.1f %8.1f %8.1f %9.1f' % (mid, n, w, h, d, tall))
    print('\\nall figures in metres%s' % ('' if unit == 1.0 else ' (unit %.3f)' % unit))


if __name__ == '__main__':
    sys.exit(main())
