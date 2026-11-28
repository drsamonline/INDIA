#!/usr/bin/env python3
"""Check that every internal href/src in the generated site resolves.

    python3 tools/linkcheck.py

Exits non-zero and lists the offenders if anything is missing. Run it after
tools/build_site.py; the CI workflow does both.
"""
import glob, io, os, re, sys, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main():
    bad = []
    pages = ['index.html', 'credits.html'] + glob.glob('monuments/*.html')
    for page in pages:
        path = os.path.join(ROOT, page)
        if not os.path.exists(path):
            bad.append((page, '(page missing)'))
            continue
        base = os.path.dirname(path)
        html = open(path, encoding='utf-8').read()
        refs = []
        for m in re.finditer(r'(?:href|src)="([^"]+)"', html):
            refs.append(m.group(1))
        for m in re.finditer(r'srcset="([^"]+)"', html):
            refs.extend(part.strip().split(' ')[0] for part in m.group(1).split(','))
        for url in refs:
            if not url or url.startswith(('http', 'mailto:', 'data:', '#', '//')):
                continue
            url = url.split('#')[0].split('?')[0]
            if not url:
                continue
            target = os.path.normpath(os.path.join(base, urllib.parse.unquote(url)))
            if not os.path.exists(target):
                bad.append((page, url))
    for css in glob.glob(os.path.join(ROOT, 'assets/css/*.css')):
        for m in re.finditer(r"url\('([^']+)'\)", open(css, encoding='utf-8').read()):
            u = m.group(1)
            if u.startswith(('data:', 'http')):
                continue
            target = os.path.normpath(os.path.join(os.path.dirname(css), u))
            if not os.path.exists(target):
                bad.append((os.path.relpath(css, ROOT), u))
    if bad:
        print('broken references:', len(bad))
        for page, url in bad[:40]:
            print(f'  {page}  ->  {url}')
        return 1
    # the README describes this repository, so every path it names must exist —
    # it drifted once already (a tool and a document were missing from the list)
    md = os.path.join(ROOT, 'README.md')
    if os.path.exists(md):
        text = io.open(md, encoding='utf-8').read()
        named = set(re.findall(r'\b(?:tools|assets|docs|monuments|data)/[A-Za-z0-9._/-]+', text))
        missing = sorted(p for p in named
                         if not os.path.exists(os.path.join(ROOT, p.rstrip('.,)'))))
        if missing:
            print('README names paths that do not exist:', missing)
            return 1

    print(f'ok: {len(pages)} pages, all internal references resolve')
    return 0

if __name__ == '__main__':
    sys.exit(main())
