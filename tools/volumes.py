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
# add(key, box(w, h, d), x, y, z) — the other half of the geometry, and the half
# that a block()-only reader is blind to. A paving slab written this way was
# read as a roof over a court it never covered.
ADDBOX = re.compile(
    r"\badd\(\s*(['\"]?)([A-Za-z_][\w]*)\1\s*,\s*box\(\s*([^)]*?)\s*\)\s*,\s*([^)]*?)\s*\)")
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
        # block(key, w, h, d, x, y, z) puts the BASE at y (the engine adds h/2),
        # so y0 = y. Reading it as centred was wrong by half a height.
        boxes.append({
            "key": key, "src": "block",
            "x": x, "y": y, "z": z,
            "x0": x - w / 2, "x1": x + w / 2,
            "y0": y, "y1": y + h,
            "z0": z - d / 2, "z1": z + d / 2,
        })
    for m in ADDBOX.finditer(src):
        key = m.group(2)
        dims = [a.strip() for a in m.group(3).split(",")]
        pos = [a.strip() for a in m.group(4).split(",")]
        if len(dims) < 3 or len(pos) < 3 or not all(NUM.match(a) for a in dims[:3] + pos[:3]):
            skipped += 1
            continue
        w, h, d = (float(a) for a in dims[:3])
        x, y, z = (float(a) for a in pos[:3])
        # add() places a mesh CENTRED on (x, y, z)
        boxes.append({
            "key": key, "src": "add-box",
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
    nb = sum(1 for b in boxes if b["src"] == "block")
    print(f"{name}: {nb} literal block() calls, {len(boxes) - nb} add(box(...)) meshes, "
          f"{skipped} built from variables (unreadable)")

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
                  f"  z {b['z0']:7.1f}..{b['z1']:7.1f}"
                  f"  ({b['src']})")

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
                  f"   x {b['x0']:7.1f}..{b['x1']:7.1f}  z {b['z0']:7.1f}..{b['z1']:7.1f}"
                  f"  ({b['src']})")
            prev = b["y1"] if prev is None else max(prev, b["y1"])
        if prev is not None:
            print(f"    ---- open above {prev:.1f}")


if __name__ == "__main__":
    main()
