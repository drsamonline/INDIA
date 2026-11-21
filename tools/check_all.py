#!/usr/bin/env python3
"""Render every monument page in headless Chromium and report.

For each monument in data/monuments.json (that has a page), this loads the page,
waits for the engine to report ready, collects console/page errors and the
scene statistics, and writes a screenshot.

    python3 tools/check_all.py                 # every page, 1280x800
    python3 tools/check_all.py --only taj-mahal qutub-minar
    python3 tools/check_all.py --size 390x844 --out shots/mobile
    python3 tools/check_all.py --time 21       # night view (?shot=21)

Requires: pip install playwright, and a Chromium (CHROME_PATH env var).
"""
import argparse, asyncio, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')


async def check(page, url, out, wait):
    errors = []
    page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)[:300]))
    page.on('console', lambda m: errors.append('console: ' + m.text[:200]) if m.type == 'error' else None)
    await page.goto(url, wait_until='load', timeout=60000)
    ok = True
    try:
        await page.wait_for_function(
            "document.documentElement.dataset.boot === 'ok' || document.body.classList.contains('is-ready')",
            timeout=wait)
    except Exception:
        ok = False
    await page.wait_for_timeout(1800)
    stats = await page.evaluate("window.__india ? window.__india.stats() : null")
    try:
        await page.evaluate("window.__india && window.__india.pause && window.__india.pause()")
    except Exception:
        pass
    await page.wait_for_timeout(250)
    await page.screenshot(path=out, timeout=120000)
    return ok, errors, stats


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', nargs='*')
    ap.add_argument('--size', default='1280x800')
    ap.add_argument('--out', default='shots')
    ap.add_argument('--time', default='')
    ap.add_argument('--wait', type=int, default=200000)
    args = ap.parse_args()

    w, h = [int(x) for x in args.size.split('x')]
    os.makedirs(os.path.join(ROOT, args.out), exist_ok=True)
    data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))
    if args.only:
        data = [m for m in data if m['id'] in args.only]

    from playwright.async_api import async_playwright
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for m in data:
            page_path = os.path.join(ROOT, 'monuments', m['id'] + '.html')
            if not os.path.exists(page_path):
                print(f"{m['id']:24s} MISSING PAGE")
                continue
            page = await browser.new_page(viewport={'width': w, 'height': h})
            q = '?shot=' + args.time if args.time else ''
            url = 'file://' + page_path + q
            out = os.path.join(ROOT, args.out, f"{m['id']}-{args.size}.png")
            ok, errors, stats = await check(page, url, out, args.wait)
            await page.close()
            bad = [e for e in errors if 'GPU stall' not in e]
            print(f"{m['id']:24s} {'OK ' if ok else 'FAIL'}  "
                  f"{'tris=' + str(stats['triangles']) if stats else ''}  "
                  f"{'meshes=' + str(stats['meshes']) if stats else ''}  errors={len(bad)}")
            for e in bad[:4]:
                print('    ', e)
            results.append({'id': m['id'], 'ok': ok, 'errors': bad, 'stats': stats})
        await browser.close()

    fails = [r['id'] for r in results if not r['ok'] or r['errors']]
    print('\n%d/%d ok' % (len(results) - len(fails), len(results)))
    if fails:
        print('needs attention:', ', '.join(fails))
        sys.exit(1)


asyncio.run(main())
