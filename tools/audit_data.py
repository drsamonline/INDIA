#!/usr/bin/env python3
"""Audit data/monuments.json for consistency and copy problems.

    python3 tools/audit_data.py          # report
    python3 tools/audit_data.py --strict # exit non-zero on warnings too

Checks structure (ids, required fields, years, colours, image files, links)
and flags copy patterns that read as machine-written: "stands as a testament",
"not just", "more than just", em-dash piles, "nestled", "boasts", "vibrant".
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data', 'monuments.json')

REQUIRED = ['id', 'name', 'deva', 'place', 'state', 'region', 'era', 'period', 'style',
            'unesco', 'wikipedia', 'blurb', 'history', 'facts', 'links', 'image', 'year',
            'accent', 'accent2']
REGIONS = {'North', 'South', 'East', 'West', 'Central', 'North-East'}
AI_TELLS = [
    (r'\bstands? as a testament\b', 'stands as a testament'),
    (r'\bnot just\b', 'not just'),
    (r'\bmore than just\b', 'more than just'),
    (r'\bnestled\b', 'nestled'),
    (r'\bboasts?\b', 'boasts'),
    (r'\bvibrant\b', 'vibrant'),
    (r'\biconic\b', 'iconic'),
    (r'\bbreathtaking\b', 'breathtaking'),
    (r'\brich tapestry\b', 'rich tapestry'),
    (r'\bunveil', 'unveil'),
    (r'\bwhether you', 'whether you'),
    (r'—[^—]{0,60}—', 'a pair of em-dashes in one clause'),
]

errors, warnings = [], []

def check_links(data):
    """HEAD each external link. Blocked hosts count as warnings, not errors."""
    import urllib.request
    ua = {'User-Agent': 'INDIA-atlas-linkcheck/1.0'}
    for m in data:
        urls = [m['wikipedia']] + [l['href'] for l in m.get('links', [])]
        for u in dict.fromkeys(urls):
            try:
                req = urllib.request.Request(u, headers=ua, method='HEAD')
                code = urllib.request.urlopen(req, timeout=20).status
                if code >= 400:
                    warnings.append(f"{m['id']}: HTTP {code} — {u}")
            except Exception as e:
                warnings.append(f"{m['id']}: unverified link ({type(e).__name__}) — {u}")

def main():
    strict = '--strict' in sys.argv
    data = json.load(open(DATA, encoding='utf-8'))

    ids = [m['id'] for m in data]
    if len(ids) != len(set(ids)):
        errors.append('duplicate ids: ' + ', '.join(sorted({i for i in ids if ids.count(i) > 1})))

    years = {}
    for m in data:
        mid = m.get('id', '?')
        for f in REQUIRED:
            if f not in m or m[f] in (None, '', []):
                errors.append(f'{mid}: missing field "{f}"')
        if m.get('region') not in REGIONS:
            warnings.append(f'{mid}: unknown region "{m.get("region")}"')
        for c in ('accent', 'accent2'):
            if not re.fullmatch(r'#[0-9a-fA-F]{6}', str(m.get(c, ''))):
                errors.append(f'{mid}: {c} is not a 6-digit hex colour')
        # year should sit inside the period string
        p = str(m.get('period', ''))
        nums = [int(n) for n in re.findall(r'\b(\d{3,4})\b', p)]
        y = m.get('year')
        if isinstance(y, int) and nums and y > 0 and y not in nums:
            warnings.append(f'{mid}: year {y} not mentioned in period "{p}"')
        if isinstance(y, int):
            years.setdefault(y, []).append(mid)
        # history shape
        hist = m.get('history') or []
        if not (2 <= len(hist) <= 4):
            warnings.append(f'{mid}: {len(hist)} history paragraphs (want 2-4)')
        for para in hist:
            if len(para.split()) < 30:
                warnings.append(f'{mid}: short history paragraph ({len(para.split())} words)')
        if len(m.get('facts') or []) < 4:
            warnings.append(f'{mid}: fewer than 4 facts')
        if len(m.get('links') or []) < 2:
            warnings.append(f'{mid}: fewer than 2 links')
        for l in m.get('links') or []:
            if not str(l.get('href', '')).startswith('https://'):
                errors.append(f'{mid}: link is not https — {l.get("label")}')
        if not str(m.get('wikipedia', '')).startswith('https://en.wikipedia.org/'):
            errors.append(f'{mid}: wikipedia link is not an en.wikipedia.org URL')
        blurb = str(m.get('blurb', ''))
        if not (60 <= len(blurb) <= 200):
            warnings.append(f'{mid}: blurb is {len(blurb)} characters (want 60-200)')
        # image file present, with derivatives
        src = m.get('image', {}).get('src', '')
        if src:
            if not os.path.exists(os.path.join(ROOT, src)):
                errors.append(f'{mid}: image missing — {src}')
            stem = src.rsplit('.', 1)[0]
            for ext in ('.webp',):
                if not os.path.exists(os.path.join(ROOT, stem + ext)):
                    warnings.append(f'{mid}: no WebP for {src}')
            for w in (450, 900):
                for ext in ('.jpg', '.webp'):
                    t = os.path.join(ROOT, 'assets/img/thumb', os.path.basename(stem) + f'-{w}{ext}')
                    if not os.path.exists(t):
                        warnings.append(f'{mid}: missing thumbnail {os.path.basename(t)}')
        for f in ('file', 'artist', 'license', 'page'):
            if not m.get('image', {}).get(f):
                errors.append(f'{mid}: image.{f} is empty')
        # copy tells
        text = ' '.join([blurb] + hist + [t.get('k', '') + ' ' + t.get('v', '') for t in m.get('facts') or []])
        for pat, label in AI_TELLS:
            if re.search(pat, text, re.I):
                warnings.append(f'{mid}: copy tell — "{label}"')
        # tour stops live in the module, not the data; count them there
        mod = os.path.join(ROOT, 'assets', 'js', 'monuments', mid + '.js')
        if os.path.exists(mod):
            src_js = open(mod, encoding='utf-8').read()
            stops = src_js.count('title:')
            if stops < 5:
                warnings.append(f'{mid}: {stops} tour stops (want 5+)')
        elif mid != 'taj-mahal':
            errors.append(f'{mid}: no module at assets/js/monuments/{mid}.js')

    for y, who in sorted(years.items()):
        if len(who) > 1:
            warnings.append(f'year {y} used by {len(who)} monuments: ' + ', '.join(who))

    if '--links' in sys.argv:
        check_links(data)

    print(f'{len(data)} monuments checked')
    for e in errors:
        print('  ERROR   ', e)
    for w in warnings:
        print('  warning ', w)
    print(f'\n{len(errors)} errors, {len(warnings)} warnings')
    if errors or (strict and warnings):
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
