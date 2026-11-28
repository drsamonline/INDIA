#!/usr/bin/env python3
"""Structural checks on the built pages, without a browser.

Cheap, fast, and it runs on every push: these are the faults that a render does not
show you and that a person reading the page cannot see.

  * duplicate ids — breaks `getElementById`, every `aria-labelledby`, and any anchor
  * unbalanced <div> counts — the commonest symptom of a template edit gone wrong
  * <img> without alt — the single most common accessibility fault on the web
  * <html> without lang — screen readers cannot choose a voice
  * target="_blank" without rel="noopener" — the opened page gets `window.opener`

    python3 tools/check_html.py
"""
import io, os, re, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def pages():
    out = ['index.html', 'credits.html', '404.html']
    d = os.path.join(ROOT, 'monuments')
    out += ['monuments/' + f for f in sorted(os.listdir(d)) if f.endswith('.html')]
    return out


def check(rel):
    path = os.path.join(ROOT, rel)
    if not os.path.exists(path):
        return ['missing']
    s = io.open(path, encoding='utf-8').read()
    problems = []

    ids = re.findall(r'\sid="([^"]+)"', s)
    for i, n in Counter(ids).items():
        if n > 1:
            problems.append('duplicate id "%s" x%d' % (i, n))

    opens, closes = len(re.findall(r'<div\b', s)), s.count('</div>')
    if opens != closes:
        problems.append('<div> %d open, %d close' % (opens, closes))

    for tag in re.findall(r'<img\b[^>]*>', s):
        if 'alt=' not in tag:
            problems.append('<img> without alt: %s' % tag[:60])

    if not re.search(r'<html[^>]*\blang=', s):
        problems.append('<html> without lang')

    # without this, Android Chrome's auto dark mode may invert a deliberately light page
    if 'name="color-scheme"' not in s:
        problems.append('no color-scheme meta')

    # a description longer than ~160 is truncated in a search result, which is how
    # most people will first read this site
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    if not d:
        problems.append('no meta description')
    elif not (60 <= len(d.group(1)) <= 160):
        problems.append('description is %d chars (want 60-160)' % len(d.group(1)))

    # a share card crops to about 1.9:1, so a portrait or narrow og:image is cut
    # through the subject; 1200 wide is the minimum the platforms recommend
    og = re.search(r'property="og:image" content="([^"]+)"', s)
    if rel.startswith('monuments/'):
        if not og:
            problems.append('no og:image')
        else:
            f = og.group(1).replace('https://drsamonline.github.io/INDIA/', '')
            full = os.path.join(ROOT, f)
            if not os.path.exists(full):
                problems.append('og:image missing: ' + f)
            else:
                try:
                    from PIL import Image
                    w, h = Image.open(full).size
                    if w < 1200 or w / h < 1.4:
                        problems.append('og:image %dx%d crops badly' % (w, h))
                except Exception:
                    problems.append('og:image unreadable: ' + f)

    for a in re.findall(r'<a\b[^>]*target="_blank"[^>]*>', s):
        if 'rel=' not in a or 'noopener' not in a:
            problems.append('target=_blank without rel=noopener: %s' % a[:60])
    return problems


def main():
    bad = 0
    for rel in pages():
        problems = check(rel)
        if problems:
            bad += 1
            print(rel)
            for p in problems[:6]:
                print('    ' + p)
    print('%d of %d page(s) with a structural problem' % (bad, len(pages())))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
