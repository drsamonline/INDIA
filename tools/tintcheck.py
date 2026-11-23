#!/usr/bin/env python3
"""Flag material tints that are taken from a TEXTURED base.

Cloning a material in this engine copies its map, and the map multiplies the
colour. So `ctx.mat('sandstoneBuff').clone()` with `color.setHex(0xdfd3b4)`
renders at roughly half that value — the hex you wrote is not the colour you
get. Two monuments shipped wrong for exactly this reason (Hawa Mahal came out
brick red, the Gateway of India grey).

Untextured bases give you the hex you asked for. This scans every module for
`ctx.mat('<name>')` used as a clone base and reports which are textured.

    python3 tools/tintcheck.py            # report everything
    python3 tools/tintcheck.py --ci       # fail only on ones not in the baseline

`tools/tintcheck.allow` holds the deliberate ones, one `file:base` per line.
Anything not in it is a new tint that will render at half its hex.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(ROOT, 'assets', 'js', 'monument-engine.js')

# read the material table out of the engine rather than hard-coding it
src = open(ENGINE, encoding='utf-8').read()
MATS = {}
for m in re.finditer(r"^\s{2}(\w+):\s*\{([^}]*)\}", src, re.M):
    MATS[m.group(1)] = 'tex:' in m.group(2)

CLONE = re.compile(r"ctx\.mat\(\s*'(\w+)'\s*\)")
HEX = re.compile(r"setHex\(\s*(0x[0-9a-fA-F]{6})\s*\)")


ALLOW = os.path.join(ROOT, 'tools', 'tintcheck.allow')


def load_allow():
    if not os.path.exists(ALLOW):
        return set()
    out = set()
    for line in open(ALLOW, encoding='utf-8'):
        line = line.split('#')[0].strip()
        if line:
            out.add(line)
    return out


def main():
    ci = '--ci' in sys.argv
    allow = load_allow()
    bad, ok = [], 0
    for f in sorted(os.listdir(os.path.join(ROOT, 'assets', 'js', 'monuments'))):
        if not f.endswith('.js'):
            continue
        path = os.path.join(ROOT, 'assets', 'js', 'monuments', f)
        text = open(path, encoding='utf-8').read()
        lines = text.split('\n')
        for i, line in enumerate(lines):
            for name in CLONE.findall(line):
                textured = MATS.get(name)
                if textured is None:
                    print(f'  ? {f}:{i+1}  unknown material {name}')
                    continue
                if not textured:
                    ok += 1
                    continue
                # the tint usually lands within the next few lines
                window = '\n'.join(lines[i:i + 4])
                hexes = HEX.findall(window)
                bad.append((f, i + 1, name, hexes[0] if hexes else '-'))

    print(f'\n{ok} clone(s) from untextured bases — fine.')
    if not bad:
        print('0 clone(s) from textured bases.\n')
        return 0
    if ci:
        new = [b for b in bad if f'{b[0]}:{b[2]}' not in allow]
        if not new:
            print(f'{len(bad)} known textured-base tint(s), 0 new.\n')
            return 0
        print(f'{len(new)} NEW textured-base tint(s) — the hex is halved in the render:\n')
        for f, ln, name, hx in new:
            print(f'  {f}:{ln}  base {name}  hex {hx}')
        print('\nClone an untextured base (cream, white, grey, terracotta) and keep')
        print('the hex, or add the line to tools/tintcheck.allow if it is deliberate.\n')
        return 1
    print(f'{len(bad)} clone(s) from TEXTURED bases — the hex is halved in the render:\n')
    print(f"  {'file':28s} {'line':>5s}  {'base':16s} {'hex asked for'}")
    for f, ln, name, hx in bad:
        print(f'  {f:28s} {ln:5d}  {name:16s} {hx}')
    print('\nFix: clone an untextured base (cream, white, grey, terracotta) and')
    print('keep the hex, or pre-brighten the hex to compensate.\n')
    return 1


if __name__ == '__main__':
    sys.exit(main())
