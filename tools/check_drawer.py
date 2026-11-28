#!/usr/bin/env python3
"""Every page's About drawer must carry its fidelity block and a report link.

The honesty surfaces are generated from `data/monuments.json` — the level, the note
that says what the model lacks, and a prefilled GitHub issue — but the Taj builds its
drawer from its own markup, and for a week it silently had neither. A check that
looked for the engine's `#about-body` passed on 23 pages and found nothing wrong,
because the one page it could not see was the one with the gap.

So this opens each page's drawer — either shape — and asserts:

  * a fidelity level of measured / approximate / study, matching the JSON
  * a "Report it" link pointing at issues/new?labels=model
  * no literal "' +" in the markup (a broken template literal renders as text)

It needs no boot: the drawer is DOM, so a page costs about eight seconds rather than
the minutes a render does.

    python3 tools/check_drawer.py                 # every page
    python3 tools/check_drawer.py qutub-minar     # some

Requires: pip install playwright, and a Chromium (CHROME_PATH env var).
"""
import asyncio, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')

PROBE = """() => {
  const root = document.getElementById('about-body') ||
               document.querySelector('#taj-about .tj-card');
  if (!root) return { why: 'no drawer' };
  const f = root.querySelector('.fidelity');
  const lvl = f ? (f.querySelector('.fid-level') || {}).textContent
                : (root.textContent.match(/(measured|approximate|study)/i) || [])[1];
  const a = [...root.querySelectorAll('a')].find((x) => x.textContent.includes('Report it'));
  return { lvl: lvl && lvl.trim().toLowerCase(),
           href: a ? a.href : null,
           lit: root.innerHTML.includes("' +") };
}"""


async def main(only):
    from playwright.async_api import async_playwright
    data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json'), encoding='utf-8'))
    ids = [m['id'] for m in data]
    want = {m['id']: (m.get('fidelity') or {}).get('level', '') for m in data}
    if only:
        ids = [i for i in ids if i in only]
    bad = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'])
        for mid in ids:
            pg = await b.new_page(viewport={'width': 420, 'height': 800})
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)[:80]))
            try:
                await pg.goto('file://' + os.path.join(ROOT, 'monuments', mid + '.html'),
                              wait_until='load', timeout=60000)
                await pg.wait_for_timeout(700)
                await pg.evaluate("(()=>{const b=document.getElementById('btn-about')"
                                  "||document.getElementById('btn-about-taj'); if(b) b.click();})()")
                await pg.wait_for_timeout(400)
                r = await pg.evaluate(PROBE)
                problems = []
                if r.get('why'):
                    problems.append(r['why'])
                if r.get('lvl') != want[mid]:
                    problems.append('level %s != %s' % (r.get('lvl'), want[mid]))
                if not r.get('href') or 'issues/new?labels=model' not in r['href']:
                    problems.append('no report link')
                if r.get('lit'):
                    problems.append('literal template characters')
                if errs:
                    problems.append('pageerror')
                print('%-24s %-12s %s' % (mid, r.get('lvl') or '-',
                                          'ok' if not problems else 'FAIL ' + ', '.join(problems)))
                if problems:
                    bad.append(mid)
            except Exception as e:
                print('%-24s FAIL %s' % (mid, str(e)[:70]))
                bad.append(mid)
            await pg.close()
        await b.close()
    print('\n%d of %d page(s) with a problem' % (len(bad), len(ids)))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(asyncio.run(main(sys.argv[1:])))
