#!/usr/bin/env python3
"""Run check_a11y over every page, resuming across runs.

One page takes 45-110 s under software rendering, so twenty-four of them do not
fit in a single command. This writes a line per page to shots/a11y-all-<w>x<h>.log
and skips pages already in it, so a run can be stopped and started again.

    python3 tools/check_a11y_all.py                  # continue from the log
    python3 tools/check_a11y_all.py --restart        # wipe the log and start over
    python3 tools/check_a11y_all.py --budget 200     # seconds of work this run
    python3 tools/check_a11y_all.py --size 390x844   # a phone viewport

Requires: pip install playwright, and a Chromium (CHROME_PATH env var).
"""
import argparse, asyncio, importlib.util, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG = ''

spec = importlib.util.spec_from_file_location('check_a11y', os.path.join(ROOT, 'tools', 'check_a11y.py'))
a11y = importlib.util.module_from_spec(spec)
spec.loader.exec_module(a11y)


async def run(pending, budget, size):
    from playwright.async_api import async_playwright
    t0 = time.time()
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=a11y.CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for mid in pending:
            if time.time() - t0 > budget:
                break
            page = await b.new_page(viewport={'width': size[0], 'height': size[1]})
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)[:120]))
            t = time.time()
            try:
                await page.goto('file://' + os.path.join(ROOT, 'monuments', mid + '.html'),
                                wait_until='load', timeout=60000)
                booted = True
                try:
                    await page.wait_for_function(
                        "document.documentElement.dataset.boot==='ok'", timeout=100000)
                except Exception:
                    booted = False
                    await page.wait_for_function("document.readyState==='complete'", timeout=30000)
                f = await a11y.check(page, mid)
                bad = [k for k, v in a11y.EXPECT.items() if f.get(k) != v]
                if f.get('desc_len', 0) < 40:
                    bad.append('desc_len')
                if errs:
                    bad.append('pageerror')
                line = '%-24s %-4s %5.1fs %s%s' % (
                    mid, 'ok' if not bad else 'FAIL', time.time() - t,
                    ' '.join(bad) if bad else '-', '' if booted else '  (no boot flag)')
            except Exception as e:                       # noqa: BLE001 - report and carry on
                line = '%-24s FAIL %5.1fs %s' % (mid, time.time() - t, str(e)[:70])
            print(line, flush=True)
            with open(LOG, 'a') as fh:
                fh.write(line + '\n')
            await page.close()
        await b.close()


def main():
    global LOG
    ap = argparse.ArgumentParser()
    ap.add_argument('--budget', type=int, default=250, help='seconds of work this run')
    ap.add_argument('--restart', action='store_true')
    ap.add_argument('--size', default='380x430', help='viewport, e.g. 390x844')
    args = ap.parse_args()
    size = tuple(int(v) for v in args.size.lower().split('x'))
    LOG = os.path.join(ROOT, 'shots', 'a11y-all-%dx%d.log' % size)
    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    if args.restart and os.path.exists(LOG):
        os.remove(LOG)
    done = set()
    if os.path.exists(LOG):
        for line in open(LOG):
            if line.strip():
                done.add(line.split()[0])
    ids = [m['id'] for m in json.load(open(os.path.join(ROOT, 'data', 'monuments.json')))]
    ids = [i for i in ids if i != 'taj-mahal'] + ['taj-mahal']      # slowest last
    pending = [i for i in ids if i not in done]
    if not pending:
        print('all %d pages already in %s' % (len(ids), LOG))
        return 0
    asyncio.run(run(pending, args.budget, size))
    left = [i for i in ids if i not in set(l.split()[0] for l in open(LOG) if l.strip())]
    print('\n%d done, %d to go%s' % (len(ids) - len(left), len(left),
                                     '' if not left else ' - run again to continue'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
