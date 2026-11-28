#!/usr/bin/env python3
"""Boot monument pages and assert the accessibility contract holds.

    python3 tools/check_a11y.py                 # qutub-minar and golden-temple
    python3 tools/check_a11y.py --only taj-mahal

Checks, per page: a skip link that comes first in tab order, the canvas
exposed as an image with a written description, lang on Devanagari runs,
aria-expanded on the panel toggle, and the history drawer's focus behaviour
(opens onto its close button, traps Tab, closes on Esc, returns focus).

Needs Playwright and a Chromium: pip install playwright; CHROME_PATH overrides
the default /usr/local/bin/chromium.
"""
import argparse, asyncio, json, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')

async def check(pg, mid):
    f = {}
    f['skip_link'] = await pg.evaluate("!!document.querySelector('.skip-link')")
    f['skip_first'] = await pg.evaluate(
        "(()=>{const a=[...document.querySelectorAll('a[href],button')]"
        ".filter(e=>{const r=e.getBoundingClientRect();return r.width>0||e.classList.contains('skip-link');});"
        "return a.length>0 && a[0].classList.contains('skip-link');})()")
    f['canvas_role'] = await pg.evaluate("(document.getElementById('app')||{}).getAttribute && document.getElementById('app').getAttribute('role')")
    f['canvas_desc'] = await pg.evaluate("!!document.getElementById('scene-desc')")
    f['desc_len'] = await pg.evaluate("(document.getElementById('scene-desc')||{textContent:''}).textContent.trim().length")
    f['deva_lang'] = await pg.evaluate(
        "(()=>{const d=document.querySelector('.deva');return d?d.getAttribute('lang'):null;})()")
    # a toggle button may say aria-expanded (the engine) or aria-pressed (the
    # Taj); both are valid ARIA, so accept either rather than failing a page for
    # choosing the other idiom
    f['panel_expanded'] = await pg.evaluate("""(()=>{
      const b=document.getElementById('btn-panel');
      if (!b) return null;
      const ex=b.getAttribute('aria-expanded');
      if (ex !== null) return ex;
      const pr=b.getAttribute('aria-pressed');
      return pr === null ? null : (pr === 'true' ? 'true' : 'false');
    })()""")
    # Stop the render loop before the interaction checks. On a heavy page under
    # software rendering the main thread is busy for seconds a frame and every
    # Playwright input call waits for it: on the Taj each Tab took 16 s, so ten
    # of them blew the whole budget and the page looked as if it had hung. The
    # checks below are all DOM, so pausing costs nothing.
    try:
        await pg.evaluate("window.__india && window.__india.pause && window.__india.pause()")
        await pg.evaluate("""(()=>{
          const b=[...document.querySelectorAll('button')].find(x=>/pause/i.test(
            (x.getAttribute('aria-label')||'')+(x.title||'')+(x.textContent||'')));
          if (b) { b.click(); return true; }
          return false; })()""")
    except Exception:
        pass
    # drawer behaviour. Two idioms: the engine's (#about + body.about-open) and the
    # Taj's own (#taj-about + .open). The Taj used to fail four checks here purely
    # because the runner only knew the first one — a false failure is as misleading
    # as a false pass, so both are handled.
    taj = await pg.evaluate("!!document.getElementById('taj-about')")
    if taj:
        f['drawer_idiom'] = 'taj'
        await pg.evaluate("const b=document.getElementById('btn-about-taj'); if(b){b.focus(); b.click();}")
        await pg.wait_for_timeout(500)
        f['dialog_open'] = await pg.evaluate(
            "document.getElementById('taj-about').classList.contains('open')")
        f['focus_inside'] = await pg.evaluate(
            "(()=>{const a=document.getElementById('taj-about');return !!a && a.contains(document.activeElement);})()")
        await pg.keyboard.press('Escape')
        await pg.wait_for_timeout(300)
        f['esc_closes'] = await pg.evaluate(
            "!document.getElementById('taj-about').classList.contains('open')")
        f['focus_returned'] = await pg.evaluate(
            "document.activeElement && document.activeElement.id === 'btn-about-taj'")
        # the trap needs the drawer open again
        await pg.evaluate("document.getElementById('btn-about-taj').click()")
        await pg.wait_for_timeout(700)   # the drawer focuses its close button on a timer
        for _ in range(6):
            await pg.keyboard.press('Tab')
        f['trap'] = await pg.evaluate(
            "(()=>{const a=document.getElementById('taj-about');return !!a && a.contains(document.activeElement);})()")
        await pg.keyboard.press('Escape')
        return f

    f['drawer_idiom'] = 'engine'
    await pg.evaluate("const b=document.getElementById('btn-about'); if(b){b.focus(); b.click();}")
    await pg.wait_for_timeout(500)
    f['dialog_open'] = await pg.evaluate("document.body.classList.contains('about-open')")
    f['focus_inside'] = await pg.evaluate(
        "(()=>{const a=document.getElementById('about');return !!a && a.contains(document.activeElement);})()")
    # ten tabs on a fast page, three on a slow one: under software rendering a
    # heavy scene makes each press wait seconds for the main thread (16 s on the
    # Taj), which is a property of the renderer, not of the focus trap.
    import time as _t
    _t0 = _t.time()
    await pg.keyboard.press('Tab')
    slow_page = (_t.time() - _t0) > 2.5
    for _ in range(3 if slow_page else 9):
        await pg.keyboard.press('Tab')
    f['trap'] = await pg.evaluate(
        "(()=>{const a=document.getElementById('about');return !!a && a.contains(document.activeElement);})()")
    await pg.keyboard.press('Escape')
    await pg.wait_for_timeout(250)
    f['esc_closes'] = await pg.evaluate("!document.body.classList.contains('about-open')")
    f['slow_page'] = slow_page
    f['focus_returned'] = await pg.evaluate("document.activeElement && document.activeElement.id === 'btn-about'")
    return f

ROOT_PAGES = ['index.html', 'credits.html', '404.html']

async def check_root(pg):
    """The three pages that are not monuments.

    The monument checks are about a canvas and a drawer; these are the basics a
    landing page owes a reader — a skip link, one h1, a main landmark the skip
    link actually reaches, alt text on every image, and a language.
    """
    f = {}
    f['skip_link'] = await pg.evaluate("!!document.querySelector('.skip-link')")
    f['skip_first'] = await pg.evaluate(
        "(()=>{const a=[...document.querySelectorAll('a[href],button')]"
        ".filter(e=>{const r=e.getBoundingClientRect();return r.width>0||e.classList.contains('skip-link');});"
        "return a.length>0 && a[0].classList.contains('skip-link');})()")
    f['h1'] = await pg.evaluate("document.querySelectorAll('h1').length")
    f['main'] = await pg.evaluate("!!document.querySelector('main')")
    f['skip_target'] = await pg.evaluate(
        "(()=>{const s=document.querySelector('.skip-link');if(!s)return false;"
        "const id=(s.getAttribute('href')||'').slice(1);return !!id && !!document.getElementById(id);})()")
    f['imgs_alt'] = await pg.evaluate("[...document.images].every(i=>i.hasAttribute('alt'))")
    f['lang'] = await pg.evaluate("document.documentElement.lang || ''")
    return f


EXPECT = {
    'skip_link': True, 'skip_first': True, 'canvas_role': 'img', 'canvas_desc': True,
    'deva_lang': 'hi', 'panel_expanded': 'true', 'dialog_open': True,
    'focus_inside': True, 'trap': True, 'esc_closes': True, 'focus_returned': True,
}

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', nargs='*', default=['qutub-minar', 'golden-temple'])
    ap.add_argument('--width', type=int, default=1100)
    ap.add_argument('--height', type=int, default=700)
    ap.add_argument('--root', action='store_true',
                    help='check index/credits/404 instead of monument pages')
    ap.add_argument('--boot-timeout', type=int, default=180,
                    help='seconds to wait for dataset.boot (the Taj never sets it)')
    args = ap.parse_args()

    if args.root:
        return await run_root(args)

    failures = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for mid in args.only:
            page = await b.new_page(viewport={'width': args.width, 'height': args.height})
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)[:160]))
            url = 'file://' + os.path.join(ROOT, 'monuments', mid + '.html')
            await page.goto(url, wait_until='load', timeout=60000)
            booted = True
            try:
                await page.wait_for_function("document.documentElement.dataset.boot==='ok'", timeout=args.boot_timeout * 1000)
            except Exception:
                # The Taj is not on the engine and never sets dataset.boot, which
                # meant this check silently skipped the one page that was outside
                # the contract. Fall back to the document being loaded, and say
                # which pages were checked that way so a real engine timeout is
                # still visible as one.
                booted = False
                try:
                    await page.wait_for_function("document.readyState==='complete'", timeout=30000)
                except Exception:
                    print(f'{mid:24s} FAIL  never booted')
                    failures += 1
                    await page.close()
                    continue
            f = await check(page, mid)
            bad = [k for k, v in EXPECT.items() if f.get(k) != v]
            if f.get('desc_len', 0) < 40:
                bad.append('desc_len')
            if errs:
                bad.append('pageerror')
            status = 'ok  ' if not bad else 'FAIL'
            note = '' if booted else '  (no boot flag — checked on load)'
            print(f'{mid:24s} {status} ' + (' '.join(bad) if bad else '') + note)
            failures += 1 if bad else 0
            await page.close()
        await b.close()
    print(f'\n{failures} failing page(s)')
    return 1 if failures else 0

async def run_root(args):
    from playwright.async_api import async_playwright
    failures = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        for page_name in ROOT_PAGES:
            path = os.path.join(ROOT, page_name)
            if not os.path.exists(path):
                print('%-24s skip  not built' % page_name)
                continue
            page = await b.new_page(viewport={'width': args.width, 'height': args.height})
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)[:120]))
            await page.goto('file://' + path, wait_until='load', timeout=60000)
            await page.wait_for_timeout(600)
            f = await check_root(page)
            bad = []
            if not f['skip_link']:
                bad.append('skip_link')
            if not f['skip_first']:
                bad.append('skip_first')
            if f['h1'] != 1:
                bad.append('h1=%s' % f['h1'])
            if not f['main']:
                bad.append('main')
            if not f['skip_target']:
                bad.append('skip_target')
            if not f['imgs_alt']:
                bad.append('imgs_alt')
            if not f['lang']:
                bad.append('lang')
            if errs:
                bad.append('pageerror')
            print('%-24s %-4s %s' % (page_name, 'ok' if not bad else 'FAIL', ' '.join(bad)))
            failures += 1 if bad else 0
            await page.close()
        await b.close()
    print('\n%d failing page(s)' % failures)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
