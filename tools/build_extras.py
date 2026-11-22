#!/usr/bin/env python3
"""Generate robots.txt, sitemap.xml and 404.html from data/monuments.json."""
import json, os, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://drsamonline.github.io/INDIA'
data = json.load(open(os.path.join(ROOT, 'data', 'monuments.json'), encoding='utf-8'))
today = datetime.date.today().isoformat()

open(os.path.join(ROOT, 'robots.txt'), 'w').write(
    "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % BASE)

urls = ['', 'credits.html'] + ['monuments/%s.html' % m['id'] for m in data]
body = "\n".join(
    "  <url><loc>%s/%s</loc><lastmod>%s</lastmod><changefreq>monthly</changefreq>"
    "<priority>%s</priority></url>" % (BASE, u, today, '1.0' if u == '' else '0.8')
    for u in urls)
open(os.path.join(ROOT, 'sitemap.xml'), 'w').write(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % body)

open(os.path.join(ROOT, '404.html'), 'w', encoding='utf-8').write("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found — INDIA</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/INDIA/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/INDIA/assets/css/fonts.css">
<link rel="stylesheet" href="/INDIA/assets/css/site.css">
</head>
<body>
<main class="wrap" style="min-height:70vh;display:flex;flex-direction:column;justify-content:center;padding-top:12vh">
  <p class="eyebrow">404</p>
  <h1 style="font-size:clamp(34px,6vw,68px);margin:10px 0 14px">This page has not been built.</h1>
  <p style="max-width:52ch;color:var(--ink-2)">The atlas holds twenty-four monuments. Whatever you were looking for is not one of them, or the address has a typo.</p>
  <p style="margin-top:26px"><a href="/INDIA/" style="display:inline-block;padding:13px 22px;border-radius:999px;background:var(--ink,#191411);color:var(--paper,#f7f0e4);text-decoration:none;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Back to the atlas</a></p>
</main>
</body>
</html>
""")
print('robots.txt, sitemap.xml, 404.html written — %d urls' % len(urls))
