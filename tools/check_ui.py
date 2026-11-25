#!/usr/bin/env python3
"""Exercise the documented keyboard shortcuts on an engine page.

The README promises: `H` panel · `T` tour · `A` about · `C` cinema · `R` reset ·
`1`–`9` viewpoints · `Esc` close. Nothing tested them, and when I did, my own
test was wrong twice before the page was — it used the Taj's `cinematic` class
(engine pages use `cinema`) and guessed at the drawer's selector.

So the selectors live here, once, in the place that asserts them.

    python3 tools/check_ui.py                    # konark-sun-temple
    python3 tools/check_ui.py --only charminar
"""
import argparse, functools, http.server, os, socketserver, sys, threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8291


def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    class TS(socketserver.ThreadingTCPServer):
        daemon_threads = True

    srv = TS(('127.0.0.1', PORT), functools.partial(Q, directory=ROOT))
    srv.allow_reuse_address = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default='konark-sun-temple')
    a = ap.parse_args()
    srv = serve()
    from playwright.sync_api import sync_playwright

    fails = []
    with sync_playwright() as p:
        # CHROME_PATH, like every other tool here: on CI the browser is wherever
        # playwright put it, and hard-coding this path failed the job the first
        # time these browser steps were allowed to run at all
        b = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', '/usr/local/bin/chromium'),
                              args=['--no-sandbox', '--disable-dev-shm-usage',
                                    '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page(viewport={'width': 1000, 'height': 700})
        pg.set_default_timeout(200000)
        pg.goto(f'http://127.0.0.1:{PORT}/monuments/{a.only}.html',
                wait_until='domcontentloaded', timeout=120000)
        pg.wait_for_function("document.documentElement.dataset.boot === 'ok'", timeout=180000)
        pg.wait_for_timeout(2500)

        def key(k):
            pg.evaluate(f"window.dispatchEvent(new KeyboardEvent('keydown', {{key:'{k}', bubbles:true}}))")
            pg.wait_for_timeout(700)

        def has(cls):
            return pg.evaluate(f"document.body.classList.contains('{cls}')")

        def cam():
            return pg.evaluate("window.__india ? [window.__india.camera.position.x, window.__india.camera.position.z].map(v=>+v.toFixed(2)) : null")

        checks = []
        # C — cinema mode
        key('c'); checks.append(('C toggles cinema', has('cinema')))
        key('c'); checks.append(('C toggles back', not has('cinema')))
        # A — about drawer, Esc closes it
        key('a'); checks.append(('A opens the about drawer', has('about-open')))
        key('Escape'); checks.append(('Esc closes the drawer', not has('about-open')))
        # H — panel
        before = pg.evaluate("document.body.className")
        key('h'); checks.append(('H changes the panel state', pg.evaluate("document.body.className") != before))
        key('h')
        # 1-9 — viewpoints move the camera
        c0 = cam()
        key('2'); pg.wait_for_timeout(1800)
        c1 = cam()
        checks.append(('2 moves to a viewpoint', c0 != c1 and c1 is not None))

        for name, ok in checks:
            print(('  ok   ' if ok else '  FAIL ') + name)
            if not ok:
                fails.append(name)
        b.close()
    srv.shutdown()
    print(f'\n{len(checks) - len(fails)}/{len(checks)} passed on {a.only}')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
