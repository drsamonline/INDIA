#!/usr/bin/env python3
"""Render several monument pages and tile them into one contact sheet.

A change to the engine — the environment, the light rig, a shared material —
reaches every page at once, and looking at them one render at a time is far too
slow to do properly. This renders four pages into a 2 × 2 sheet so a whole site
can be checked in six images.

    python3 tools/contact_sheet.py                      # every page, 4 a sheet
    python3 tools/contact_sheet.py qutub-minar sanchi-stupa
    python3 tools/contact_sheet.py --size 560x420 --out /tmp/sheet.png

Requires: pip install playwright pillow, and a Chromium (CHROME_PATH env var).
Writes shots/sheet.png unless --out is given.
"""
import argparse, asyncio, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')
OUTDIR = os.path.join(ROOT, 'shots', 'contact')


async def shoot(ids, w, h, time_of_day):
    from playwright.async_api import async_playwright
    from PIL import Image, ImageDraw
    os.makedirs(OUTDIR, exist_ok=True)
    rows = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for mid in ids:
            page = await browser.new_page(viewport={'width': w, 'height': h})
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)[:120]))
            t0 = time.time()
            path = os.path.join(OUTDIR, mid + '.png')
            try:
                await page.goto('file://%s/monuments/%s.html?shot=%s' % (ROOT, mid, time_of_day),
                                wait_until='load', timeout=60000)
                await page.wait_for_function("document.documentElement.dataset.boot === 'ok'",
                                             timeout=110000)
                await page.wait_for_timeout(350)
                stats = await page.evaluate("window.__india && window.__india.stats()")
                await page.evaluate("window.__india && window.__india.pause && window.__india.pause()")
                await page.evaluate(
                    "document.querySelectorAll('#panel,.hud,.tour-card,header').forEach(e=>e.style.display='none')")
                await page.screenshot(path=path, timeout=60000)
                rows.append((mid, path, stats and stats.get('triangles'), time.time() - t0, errs))
            except Exception as e:                       # noqa: BLE001 - report, do not raise
                rows.append((mid, None, None, time.time() - t0, errs + [str(e)[:100]]))
            await page.close()
        await browser.close()

    ok = [r for r in rows if r[1]]
    cols = 2
    n = max(1, len(ok))
    sheet = Image.new('RGB', (w * cols, h * ((n + cols - 1) // cols)), (20, 20, 22))
    for i, (mid, path, _tris, _secs, _errs) in enumerate(ok):
        sheet.paste(Image.open(path).convert('RGB'), ((i % cols) * w, (i // cols) * h))
        ImageDraw.Draw(sheet).text(((i % cols) * w + 6, (i // cols) * h + 6), mid, fill=(255, 255, 0))
    return rows, sheet


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('only', nargs='*', default=None, help='monument ids (default: all)')
    ap.add_argument('--size', default='420x330')
    ap.add_argument('--time', default='11', help='hour to render at')
    ap.add_argument('--out', default=os.path.join(ROOT, 'shots', 'sheet.png'))
    args = ap.parse_args()
    w, h = (int(v) for v in args.size.lower().split('x'))
    ids = args.only
    if not ids:
        data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))
        ids = [m['id'] for m in (data['monuments'] if isinstance(data, dict) else data)]
    rows, sheet = shoot(ids, w, h, args.time)
    sheet.save(args.out)
    for mid, _path, tris, secs, errs in rows:
        print('%-24s %-8s %5.1fs %s' % (mid, tris, secs, errs))
    print('\n%d page(s) in %s' % (len(rows), args.out))


if __name__ == '__main__':
    main()
