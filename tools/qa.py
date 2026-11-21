import asyncio, sys, json, os
from playwright.async_api import async_playwright

CHROME = os.environ.get('CHROME_PATH', '/usr/local/bin/chromium')
async def shot(url, out, w=1440, h=900, wait=90000, scroll=None):
    errors=[]
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=[
            '--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader',
            '--enable-unsafe-swiftshader','--allow-file-access-from-files','--disable-gpu-sandbox'])
        pg = await b.new_page(viewport={'width':w,'height':h}, device_scale_factor=1)
        pg.on('console', lambda m: errors.append(('console:'+m.type, m.text)) if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: errors.append(('pageerror', str(e))))
        try:
            await pg.goto(url, wait_until='load', timeout=60000)
        except Exception as e:
            errors.append(('goto', str(e)))
        try:
            await pg.wait_for_function("document.documentElement.dataset.boot === 'ok'", timeout=wait)
            ok=True
        except Exception as e:
            ok=False
            errors.append(('boot', str(e)[:200]))
        if scroll:
            await pg.evaluate(f"window.scrollTo(0,{scroll})")
        await pg.wait_for_timeout(2000)
        stats = await pg.evaluate("window.__india ? window.__india.stats() : null")
        try:
            await pg.evaluate("window.__india && window.__india.pause && window.__india.pause()")
        except Exception:
            pass
        await pg.wait_for_timeout(300)
        await pg.screenshot(path=out, full_page=False, timeout=120000)
        await b.close()
    return ok, errors, stats

if __name__=='__main__':
    url, out = sys.argv[1], sys.argv[2]
    w = int(sys.argv[3]) if len(sys.argv)>3 else 1440
    h = int(sys.argv[4]) if len(sys.argv)>4 else 900
    ok, errors, stats = asyncio.run(shot(url, out, w, h))
    print('BOOT', 'ok' if ok else 'FAILED')
    print('STATS', json.dumps(stats))
    for e in errors[:14]: print('ERR', e[0], e[1][:400])
