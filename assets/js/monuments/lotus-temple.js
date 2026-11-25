/* FIDELITY: study — The petals are doubly-curved shells; the hall and the interior are deliberately simplified.
   Improved by: (nobody yet). If you improve this model, add your name and
   a link here and it will appear on the site: see CONTRIBUTING.md. */
/* Lotus Temple — New Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions, 1 unit = 1 metre.
   ----------------------------------------------------------------
   height                34.27 m
   diameter across the entrance petals   70 m
   diameter across the lotus pools      130 m
   central hall diameter  34 m, seating 1,300
   27 petals in three rings of nine:
     entrance leaves   7.8 m high, opening outwards
     outer leaves     22.5 m high, pointing inwards
     inner leaves     33.6 m high, closing over the hall
   ---------------------------------------------------------------- */

export default {
  id: 'lotus-temple',
  accent: '#d8d2c4',
  accent2: '#f0e8d8',
  seed: 53,
  hemiScale: 1.25,
  hemiGround: 0xcfc8b8,   // the plinth is white marble, not earth
  floodScale: 0.3,
  time: 12.2,
  bounds: 90,
  minDist: 20,
  maxDist: 300,
  home: { pos: [56, 25, 80], target: [0, 13, 0], fov: 40 },
  ground: { texture: 'grass', size: 2600, color: 0x8d9a63 },
  views: [
    { name: 'Full', pos: [56, 25, 80], target: [0, 13, 0] },
    { name: 'Petals', pos: [22, 26, 38], target: [0, 18, 0] },
    { name: 'Approach', pos: [0, 9, 88], target: [0, 12, 0] },
    { name: 'Aerial', pos: [56, 62, 58], target: [0, 6, 0] },
    { name: 'Pools', pos: [-34, 7, 36], target: [-8, 5, 14] }
  ],
  tour: [
    {
      title: 'A House of Worship', deva: 'कमल मंदिर',
      text: 'The Lotus Temple is a Bahá’í House of Worship on the eastern edge of New Delhi, completed in 1986. Fariborz Sahba shaped it as a lotus of twenty-seven marble petals — nine in each of three rings.',
      pos: [54, 27, 76], target: [0, 12, 0], time: 17.1
    },
    {
      title: 'Twenty-Seven Petals', deva: 'कमल की पंखुड़ियाँ',
      text: 'The petals are clad in white marble and close over a hall that seats about 1,300 people. There is no altar and no pulpit: Bahá’í houses of worship are open to every faith, and the only sound inside is the reading of scriptures.',
      pos: [18, 24, 30], target: [0, 15, 0], time: 12
    },
    {
      title: 'Nine Ways In', deva: 'नौ द्वार',
      text: 'Nine paths and nine pools ring the plinth, set in twenty-six acres of gardens. The building is entered from any of them; there is no front door and no preferred direction.',
      pos: [0, 9, 62], target: [0, 11, 0], time: 9.4
    },
    {
      title: 'A Flower in Plan', deva: 'योजना',
      text: 'From above the geometry is exact: three concentric rings of nine petals, each ring leaning further inward than the one below, so the building closes like a bud at the top.',
      pos: [40, 46, 42], target: [0, 6, 0], time: 11
    },
    {
      title: 'Marble and Water', deva: 'संगमरमर',
      text: 'The petals are white marble, the paths red sandstone, and the pools hold the building’s reflection through the day. At dusk the flower is lit from below.',
      pos: [-24, 6, 26], target: [-6, 6, 10], time: 18.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit at night, the petals read as a single white flower above the gardens — the image most visitors carry away.',
      pos: [36, 18, 50], target: [0, 10, 0], time: 21.3
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus, plane, arch, archFrame } = ctx;

    /* white marble, shaded from both sides so the thin petal shells read as
       solid carved stone from any angle */
    const MARBLE = ctx.mat('marble').clone();
    MARBLE.side = T3.DoubleSide;
    MARBLE.needsUpdate = true;
    const MARBLE2 = ctx.mat('marbleWarm').clone();
    MARBLE2.side = T3.DoubleSide;
    MARBLE2.needsUpdate = true;

    const BASE = 0.7;   // top of the podium, where the petals spring

    /* ---- nonagonal podium, pools and paths ----------------------------- */
    add('marble', cyl(23.5, 24.6, BASE, 9), 0, 0, 0);
    add('marbleWarm', cyl(24.7, 24.7, 0.16, 9), 0, BASE - 0.16, 0);
    add('sandstoneRed', cyl(24.9, 24.9, 0.1, 9), 0, BASE - 0.42, 0);
    // three steps down all round
    for (let i = 0; i < 3; i++) {
      add('marble', cyl(24.9 + i * 1.5, 25.4 + i * 1.5, 0.24, 9), 0, BASE - 0.24 - i * 0.24, 0);
    }

    // nine radial paths and nine pools (the pools span 130 m across)
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      add('sandstoneRed', box(4.6, 0.12, 26), Math.cos(a) * 36, 0.07, Math.sin(a) * 36, { ry: -a });
      const px = Math.cos(a + Math.PI / 9) * 52, pz = Math.sin(a + Math.PI / 9) * 52;
      const ry2 = -(a + Math.PI / 9) + Math.PI / 2;
      const PW = 24, PD = 15.5, PT = 1.6;
      const L = (lx, lz) => [px + lx * Math.cos(ry2) + lz * Math.sin(ry2),
        pz - lx * Math.sin(ry2) + lz * Math.cos(ry2)];
      for (const sg of [-1, 1]) {
        let q = L(0, sg * (PD / 2 - PT / 2));
        add('marble', box(PW, 0.5, PT), q[0], 0.25, q[1], { ry: ry2 });
        add('marbleWarm', box(PW + 0.5, 0.12, PT + 0.5), q[0], 0.5, q[1], { ry: ry2 });
        q = L(sg * (PW / 2 - PT / 2), 0);
        add('marble', box(PT, 0.5, PD - 2 * PT), q[0], 0.25, q[1], { ry: ry2 });
        add('marbleWarm', box(PT + 0.5, 0.12, PD - 2 * PT), q[0], 0.5, q[1], { ry: ry2 });
      }
      add('water', box(PW - 2 * PT, 0.1, PD - 2 * PT), px, 0.31, pz, { ry: ry2 });
    }
    // garden beds between the paths
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.PI / 9;
      add('grass', box(16, 0.12, 12), Math.cos(a) * 36, 0.06, Math.sin(a) * 36, { ry: -a });
    }

    /* ---- one petal -------------------------------------------------------
       A lotus petal is not a leaf: it is doubly curved. It curves along its
       length — springs near-vertical, bellies out, and turns back in to a point
       — and it curves across its width three times over: a keel runs up the
       centre, the flanks cup back toward the axis of the flower, and the rim
       turns out again. The old petal had one shallow arc across the width, so
       every leaf read as a bent sheet with a knife edge.

       The shell is built as two surfaces offset along the true normal, joined
       by a rim, so the edge is a thin lip rather than an open sheet. */
    function petalGeometry(o) {
      const { H, R0, Rc, Rtip, W, keel, wrap, edge, thick, yPow = 1.5, droop = 0 } = o;
      const NU = 26, NV = 12;
      // the elevation, in the (radius, height) plane
      const spineR = (u) => (1 - u) * (1 - u) * R0 + 2 * u * (1 - u) * Rc + u * u * Rtip;
      // a petal that arcs over and hangs at the tip — the entrance leaves —
      // needs the height to fall again after its maximum, which a monotonic
      // u^yPow cannot do
      const spineY = (u) => H * Math.pow(u, yPow) * (1 - droop * Math.pow(u, 4));
      // broad by a third of the height, then tapering to a point at the tip
      const halfW = (u) => W * Math.pow(u, 0.42) * Math.pow(1 - Math.pow(u, 3.2), 0.55);
      // the section: keel, cup, rim
      const sect = (u, v) => {
        const av = Math.abs(v);
        const k = keel * Math.pow(1 - av * av, 1.5);
        const w = -wrap * av * av;
        const e = edge * Math.pow(Math.max(0, (av - 0.82) / 0.18), 2);
        return k + w + e;
      };
      const S = (u, v) => [v * halfW(u), spineY(u), spineR(u) + sect(u, v)];
      const N = (u, v) => {
        const e = 2e-3;
        const a = S(u, Math.min(1, v + e)), b = S(u, Math.max(-1, v - e));
        const c = S(Math.min(1, u + e), v), d = S(Math.max(0, u - e), v);
        const du = [c[0] - d[0], c[1] - d[1], c[2] - d[2]];
        const dv = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
        const n = [du[1] * dv[2] - du[2] * dv[1], du[2] * dv[0] - du[0] * dv[2],
          du[0] * dv[1] - du[1] * dv[0]];
        const L = Math.hypot(n[0], n[1], n[2]) || 1;
        return [n[0] / L, n[1] / L, n[2] / L];
      };
      const pos = [], uv = [], idx = [];
      const hh = thick / 2;
      for (let side = 0; side < 2; side++) {
        const sg = side ? -1 : 1;
        const base = pos.length / 3;
        for (let i2 = 0; i2 <= NU; i2++) {
          const u = i2 / NU;
          for (let j2 = 0; j2 <= NV; j2++) {
            const v = (j2 / NV) * 2 - 1;
            const p = S(u, v), n = N(u, v);
            pos.push(p[0] + n[0] * hh * sg, p[1] + n[1] * hh * sg, p[2] + n[2] * hh * sg);
            uv.push((v + 1) / 2, u);
          }
        }
        for (let i2 = 0; i2 < NU; i2++) {
          for (let j2 = 0; j2 < NV; j2++) {
            const a = base + i2 * (NV + 1) + j2, b = a + NV + 1;
            if (side === 0) idx.push(a, b, a + 1, a + 1, b, b + 1);
            else idx.push(a, a + 1, b, a + 1, b + 1, b);
          }
        }
      }
      // the rim down each side of the petal: the two surfaces joined
      for (const vEdge of [1, -1]) {
        const base = pos.length / 3;
        for (let i2 = 0; i2 <= NU; i2++) {
          const u = i2 / NU;
          const p = S(u, vEdge), n = N(u, vEdge);
          pos.push(p[0] + n[0] * hh, p[1] + n[1] * hh, p[2] + n[2] * hh);
          pos.push(p[0] - n[0] * hh, p[1] - n[1] * hh, p[2] - n[2] * hh);
          uv.push(0, u); uv.push(1, u);
        }
        for (let i2 = 0; i2 < NU; i2++) {
          const a = base + i2 * 2;
          if (vEdge > 0) idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
          else idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    /* ---- three rings of nine ---------------------------------------------
       Entrance leaves 7.8 m high, springing at the edge of the podium and
       peeling out to the documented 70 m span; outer leaves 22.5 m, leaning in
       over them; inner leaves 33.6 m, closing over the hall. The petals are
       wide enough in each ring to almost touch their neighbours: a ring of nine
       at radius r has 0.70 r between petal centres, and a 14 m petal at that
       spacing is what makes a bud rather than a crown of spikes. */
    const RINGS = [
      { H: 8.6, R0: 21.0, Rc: 27.0, Rtip: 32.5, W: 8.2, keel: 1.6, wrap: 4.0, edge: 0.5, thick: 0.5, yPow: 1.15, droop: 0.42, rot: 0, mat: MARBLE2 },
      { H: 22.5, R0: 21.0, Rc: 25.0, Rtip: 14.0, W: 7.4, keel: 1.9, wrap: 4.6, edge: 0.55, thick: 0.45, yPow: 1.35, rot: Math.PI / 9, mat: MARBLE2 },
      { H: 33.6, R0: 17.6, Rc: 21.0, Rtip: 6.5, W: 7.2, keel: 1.7, wrap: 4.2, edge: 0.5, thick: 0.4, yPow: 1.55, rot: 0, mat: MARBLE }
    ];
    RINGS.forEach((r) => {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + r.rot;
        add(r.mat, petalGeometry(r), 0, BASE, 0, { ry: Math.PI / 2 - a });
      }
    });

    /* ---- the hall: floor, nine doors, the latticed inner dome ------------ */
    add('marble', cyl(17.4, 18.0, 0.35, 40), 0, BASE, 0);          // floor
    add('marbleWarm', cyl(17.2, 17.2, 0.14, 40), 0, BASE + 0.35, 0);
    add('marble', cyl(16.0, 16.5, 6.9, 40), 0, BASE, 0);            // the hall wall
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.PI / 9;
      const dx = Math.cos(a) * 16.2, dz = Math.sin(a) * 16.2;
      add('dark', arch(4.4, 6.4, 0.3), dx, BASE + 0.4, dz, { ry: -a + Math.PI / 2 });
      add('marbleWarm', archFrame(5.3, 7.0, 0.4, 0.45), dx * 1.03, BASE + 0.4, dz * 1.03, { ry: -a + Math.PI / 2 });
    }
    // interior: three shallow tiers of seating, then the latticed dome
    for (let k = 0; k < 3; k++) {
      add('marbleWarm', cyl(12.6 - k * 2.1, 12.9 - k * 2.1, 0.5, 36), 0, BASE + 0.5 + k * 0.5, 0);
    }
    (function lattice() {
      const ribs = 36, y0 = BASE + 1.6, h = 22.0;
      for (let i = 0; i < ribs; i++) {
        const a = (i / ribs) * Math.PI * 2;
        const steps = 5;
        for (let j = 0; j < steps; j++) {
          const t0 = j / steps, t1 = (j + 1) / steps;
          const r0 = Math.cos(t0 * Math.PI / 2) * 8.4, yA = y0 + Math.sin(t0 * Math.PI / 2) * h;
          const r1 = Math.cos(t1 * Math.PI / 2) * 8.4, yB = y0 + Math.sin(t1 * Math.PI / 2) * h;
          const len = Math.hypot(r1 - r0, yB - yA);
          add('ivory', box(0.22, len, 0.22),
            Math.cos(a) * (r0 + r1) / 2, (yA + yB) / 2, Math.sin(a) * (r0 + r1) / 2,
            { ry: -a, rz: Math.atan2(r1 - r0, yB - yA) });
        }
      }
      add('glass', cyl(1.2, 1.2, 0.2, 16), 0, y0 + h, 0);
      add('glass', cyl(2.6, 2.6, 0.16, 16), 0, y0 + h * 0.955, 0);
    })();
    // the bud closes: the tips of the inner leaves nearly meet at the top
    add('gold', sph(0.2, 10), 0, BASE + 34.1, 0);

    /* ---- the gardens ------------------------------------------------------ */
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + 0.15;
      const r = 76 + (i % 3) * 9;
      ctx.tree(Math.cos(a) * r, Math.sin(a) * r, 1.15 + (i % 4) * 0.14, i % 5 === 0 ? 'palm' : 'round');
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.35;
      ctx.lamp(Math.cos(a) * 32, Math.sin(a) * 32, 3.6, 'black');
      ctx.lamp(Math.cos(a + Math.PI / 9) * 68, Math.sin(a + Math.PI / 9) * 68, 3.6, 'black');
    }
    const people = [[-8, 26], [9, 27], [-16, 20], [16, 21], [0, 29], [-24, 14], [24, 15], [-4, 20],
      [5, 19], [-13, 28], [14, 29], [19, 24], [-19, 26], [2, 34], [-2, 36], [11, 33]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));

    ctx.light({ pos: [-30, 6, 34], target: [0, 16, 0], color: 0xfff0d8, intensity: 620, distance: 150 });
    ctx.light({ pos: [30, 6, 32], target: [0, 16, 0], color: 0xffe8c8, intensity: 520, distance: 150 });
    ctx.light({ pos: [0, 6, -38], target: [0, 16, 0], color: 0xfff4e2, intensity: 480, distance: 150 });
  }
};
