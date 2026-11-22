#!/usr/bin/env python3
"""Find the open volume in a monument module.

A module is a list of block(key, w, h, d, x, y, z) calls. Reading them by eye
to work out where a camera can stand is how I put five cameras inside a wall at
Amber. This parses the literal calls and answers two questions:

    python3 tools/volumes.py amber-fort --column 0,-32
        what occupies the vertical column through (x=0, z=-32), bottom to top

    python3 tools/volumes.py amber-fort --at 0,45,-32
        which blocks contain that point

Only calls whose arguments are all numeric literals can be read statically;
anything built from a variable is reported as skipped rather than guessed at.
"""
import argparse, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CALL = re.compile(r"\bblock\(\s*(['\"]?)([A-Za-z_][\w]*)\1\s*,\s*([^)]*)\)")
NUM = re.compile(r"^-?\d+(\.\d+)?$")


def parse(path):
    src = open(path, encoding="utf-8").read()
    boxes, skipped = [], 0
    for m in CALL.finditer(src):
        key = m.group(2)
        args = [a.strip() for a in m.group(3).split(",")]
        if len(args) < 6 or not all(NUM.match(a) for a in args[:6]):
            skipped += 1
            continue
        w, h, d, x, y, z = (float(a) for a in args[:6])
        # block() is centred on (x, y, z) in this engine
        boxes.append({
            "key": key,
            "x": x, "y": y, "z": z,
            "x0": x - w / 2, "x1": x + w / 2,
            "y0": y - h / 2, "y1": y + h / 2,
            "z0": z - d / 2, "z1": z + d / 2,
        })
    return boxes, skipped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("module")
    ap.add_argument("--column", help="x,z — what occupies this vertical column")
    ap.add_argument("--at", help="x,y,z — which blocks contain this point")
    ap.add_argument("--tol", type=float, default=0.01)
    args = ap.parse_args()

    name = args.module[:-3] if args.module.endswith(".js") else args.module
    path = os.path.join(ROOT, "assets", "js", "monuments", name + ".js")
    if not os.path.exists(path):
        sys.exit("no such module: " + path)
    boxes, skipped = parse(path)
    print(f"{name}: {len(boxes)} literal block() calls, {skipped} built from variables (unreadable)")

    if args.at:
        px, py, pz = (float(v) for v in args.at.split(","))
        hits = [b for b in boxes
                if b["x0"] - args.tol <= px <= b["x1"] + args.tol
                and b["y0"] - args.tol <= py <= b["y1"] + args.tol
                and b["z0"] - args.tol <= pz <= b["z1"] + args.tol]
        if not hits:
            print(f"  ({px}, {py}, {pz}) is inside nothing — open air")
        for b in hits:
            print(f"  {b['key']:12s} x {b['x0']:7.1f}..{b['x1']:7.1f}"
                  f"  y {b['y0']:7.1f}..{b['y1']:7.1f}"
                  f"  z {b['z0']:7.1f}..{b['z1']:7.1f}")

    if args.column:
        px, pz = (float(v) for v in args.column.split(","))
        hits = [b for b in boxes
                if b["x0"] - args.tol <= px <= b["x1"] + args.tol
                and b["z0"] - args.tol <= pz <= b["z1"] + args.tol]
        hits.sort(key=lambda b: b["y0"])
        print(f"  column through x={px}, z={pz}:")
        prev = None
        for b in hits:
            if prev is not None and b["y0"] > prev + 0.05:
                print(f"    ---- open {prev:.1f} .. {b['y0']:.1f} ({b['y0'] - prev:.1f} m)")
            print(f"    {b['key']:12s} y {b['y0']:7.1f}..{b['y1']:7.1f}"
                  f"   x {b['x0']:7.1f}..{b['x1']:7.1f}  z {b['z0']:7.1f}..{b['z1']:7.1f}")
            prev = b["y1"] if prev is None else max(prev, b["y1"])
        if prev is not None:
            print(f"    ---- open above {prev:.1f}")


if __name__ == "__main__":
    main()
