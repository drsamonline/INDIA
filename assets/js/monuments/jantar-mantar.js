/* Jantar Mantar — Jaipur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Rebuilt to the measured survey (UNESCO nomination dossier 1338, 1:750
   site plan, and Kaye 1918). 1 unit = 1 metre.

     · site 18,700 m² (1.8652 ha), modelled 118 × 160 m less the cut
       north-west corner, boundary wall turned 15° to the city grid while
       every instrument stays on the cardinal axes
     · Brihat Samrat Yantra: pit 40.3 × 44.15 m, 3.5 m deep; gnomon wall
       2.85 m thick, 22.62 m from the pit floor, 44.58 m base, 50.09 m
       hypotenuse; quadrants R 15.15 m, 2.84 m wide; summit 19.1 m
       above ground, under a chhatri
     · the other eighteen instruments at their surveyed sizes           */

export default {
  id: 'jantar-mantar',
  accent: '#d8b8a0',
  accent2: '#b8503a',
  seed: 103,
  floodScale: 0.35,
  time: 9.6,
  bounds: 110,
  minDist: 14,
  maxDist: 460,
  home: { pos: [88, 40, 124], target: [0, 10, -18], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xbcab8e },
  views: [
    { name: 'Full', pos: [88, 40, 124], target: [0, 10, -18] },
    { name: 'Samrat Yantra', pos: [42, 20, 8], target: [0, 8, -44] },
    { name: 'Jai Prakash', pos: [-16, 9, 62], target: [0, 2, 42] },
    { name: 'Rashivalaya', pos: [24, 8, 84], target: [0, 3, 64] },
    { name: 'Instruments', pos: [-46, 26, 30], target: [-30, 4, 22] }
  ],
  tour: [
    {
      title: 'The Observatory', deva: 'जंतर मंतर',
      text: 'Sawai Jai Singh II built the Jantar Mantar at Jaipur between 1728 and 1734, the largest of the five observatories he raised across northern India. The name comes from yantra, instrument, and mantrana, consultation.',
      pos: [66, 40, 94], target: [2, 8, 0], time: 15.4
    },
    {
      title: 'The Samrat Yantra', deva: 'सम्राट यंत्र',
      text: 'The great sundial is a triangular gnomon 27 metres high, its sloping edge set parallel to the earth\u2019s axis. Two quadrant walls on either side catch the shadow and read local time to about two seconds.',
      pos: [44, 22, 44], target: [13, 15, 2], time: 12
    },
    {
      title: 'Architecture as Astronomy', deva: 'वास्तु',
      text: 'Its nineteen instruments are architecture doing the work of lenses and brass: bowls that map the sky, dials cut for the zodiac, rings that fix the altitude of a star. Each was cut in stone and plaster to a precision the naked eye could use.',
      pos: [-52, 22, 44], target: [-6, 8, 0], time: 9.8
    },
    {
      title: 'The Jai Prakash', deva: 'जय प्रकाश',
      text: 'A hemispherical bowl sunk into the ground, with cross-wires above it, lets an observer read the position of any star against a marble grid.',
      pos: [-34, 13, 32], target: [-15, 3, 4], time: 10.6
    },
    {
      title: 'The Zodiac Dials', deva: 'राशिवलय',
      text: 'Twelve small dials, one for each sign, ring the compound. Each is inclined to match the latitude of Jaipur, 26.9 degrees north.',
      pos: [26, 14, -42], target: [0, 3, -20], time: 11.4
    },
    {
      title: 'A Working Monument', deva: 'रात्रि',
      text: 'The observatory fell into disrepair and was restored in the twentieth century. In 2010 it was inscribed as a UNESCO World Heritage Site, and it remains a working monument: the Samrat Yantra still keeps local time.',
      pos: [44, 26, 62], target: [2, 10, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, torus, dome, arch, archFrame, block, col, chhatri, lathe } = ctx;
    const rng = ctx.rng;

    const BODY = 'sandstonePink', BODY2 = 'sandstoneRed', SCALE = 'marble';
    const PL = 'plaster', PLW = 'plasterWhite', LAWN = 'grass', METAL = 'bronze';

    /* ---------------------------------------------------------------- utils */
    function prof(pts, thick) {
      const s = new T3.Shape();
      pts.forEach(([z, y], i) => (i ? s.lineTo(z, y) : s.moveTo(z, y)));
      s.closePath();
      const g = new T3.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 1 });
      g.rotateY(-Math.PI / 2);
      g.translate(thick / 2, 0, 0);
      return g;
    }
    // profile in the (x, y) plane, extruded along z
    function profX(pts, thick) {
      const s = new T3.Shape();
      pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
      s.closePath();
      const g = new T3.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 1 });
      g.translate(0, 0, -thick / 2);
      return g;
    }

    /* ================================================================ *
     *  1. THE PLOT — 118 × 160 m, wall turned 15° to the instruments   *
     * ================================================================ */
    const EX = 59, EZ = 80;                      // half-extents, 18,880 m² gross
    const CUT = 26;                              // the north-west corner is cut off

    // the plot is a rectangle with its NW corner taken off at right angles
    const plot = [
      [-EX + CUT, -EZ], [EX, -EZ], [EX, EZ], [-EX, EZ], [-EX, -EZ + CUT]
    ];

    // paving: four slabs round the Samrat pit, which is left open
    const PZ0 = -70, PZ1 = -24, PX0 = -21, PX1 = 21;
    block('paving', EX * 2, 0.5, PZ0 + EZ, 0, -0.5, (PZ0 - EZ) / 2);
    block('paving', EX * 2, 0.5, EZ - PZ1, 0, -0.5, (EZ + PZ1) / 2);
    block('paving', PX0 + EX, 0.5, PZ1 - PZ0, (-EX + PX0) / 2, -0.5, (PZ0 + PZ1) / 2);
    block('paving', EX - PX1, 0.5, PZ1 - PZ0, (EX + PX1) / 2, -0.5, (PZ0 + PZ1) / 2);
    // lawns between the instruments
    [[-38, 22, 26, 30], [38, 40, 26, 34], [0, 20, 20, 10], [-34, 62, 22, 16],
     [34, 66, 20, 14], [-40, -12, 18, 20], [40, -14, 18, 20]].forEach(([x, z, w, d]) => {
      block(LAWN, w, 0.22, d, x, 0.05, z);
      add(BODY, box(w + 0.8, 0.16, d + 0.8), x, 0.04, z);
    });

    // the boundary wall, on the city grid: fifteen degrees off the instruments
    (function boundary() {
      const W = 0.85, H = 3.4;
      const ring = plot.map(([x, z]) => {
        const a = 15 * Math.PI / 180;
        return [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
      });
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length];
        const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
        const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
        const ry = Math.atan2(-dz, dx);
        block(PL, len + W, H, W, mx, 0, mz, { ry });
        block(BODY2, len + W + 0.3, 0.34, W + 0.3, mx, H, mz, { ry });
        // pilasters
        const n = Math.max(2, Math.round(len / 7));
        for (let k = 0; k < n; k++) {
          const t = (k + 0.5) / n - 0.5;
          block(PL, 1.2, H + 0.5, W + 0.5, mx + Math.cos(ry) * t * len, 0,
            mz - Math.sin(ry) * t * len, { ry });
        }
      }
    })();

    /* ================================================================ *
     *  2. THE BRIHAT SAMRAT YANTRA                                     *
     * ================================================================ */
    const LAT = 26.9 * Math.PI / 180;
    const SB = 44.58, SH = 22.62, ST = 2.85;     // base, height, thickness
    const PIT = 3.5;                              // the pit floor sits 3.5 m down
    const CZ = (PZ0 + PZ1) / 2;                   // -47
    const zApex = CZ - SB / 2, zFoot = CZ + SB / 2;

    // the pit
    add(BODY2, box(40.3, 0.4, 45.5), 0, -PIT, CZ);
    [[0, -22.6, 40.3, 1.2], [0, 22.6, 40.3, 1.2]].forEach(([x, dz, w, d]) =>
      block(BODY, w, PIT, d, x, -PIT, CZ + dz));
    [[-19.6, 0, 1.2, 45.5], [19.6, 0, 1.2, 45.5]].forEach(([dx, z, w, d]) =>
      block(BODY, w, PIT, d, dx, -PIT, CZ + z));
    // marble kerb round the pit lip
    [[0, -22.9], [0, 22.9]].forEach(([x, dz]) => add(SCALE, box(41.6, 0.35, 1.5), x, 0.1, CZ + dz));
    [[-19.9], [19.9]].forEach(([dx]) => add(SCALE, box(1.5, 0.35, 45.9), dx, 0.1, CZ));

    // the gnomon: a right triangle, apex at the north end
    add(BODY, prof([[zFoot, -PIT], [zApex, SH - PIT], [zApex, -PIT]], ST), 0, 0, 0);
    // marble edges down the hypotenuse and up the vertical
    add(SCALE, prof([[zFoot, -PIT], [zApex, SH - PIT], [zApex, SH - PIT - 0.5],
      [zFoot + 0.6, -PIT + 0.3]], ST + 0.16), 0, 0, 0);

    // stair up the hypotenuse, 2.39 m wide, between two marble cheeks
    const STEPS = 60;
    for (let i = 0; i < STEPS; i++) {
      const t = (i + 0.5) / STEPS;
      const z = zFoot + (zApex - zFoot) * t;
      const y = -PIT + (SH - PIT) * t;
      add(PLW, box(2.39, 0.34, (SB / STEPS) * 1.25), 0, y - 0.17, z);
    }
    [-1, 1].forEach((s) => {
      add(SCALE, prof([[zFoot, -PIT], [zApex, SH - PIT], [zApex, SH - PIT - 1.5],
        [zFoot, -PIT - 0.2]], 0.5), s * 1.62, 0, 0);
    });

    // blind pointed arches on both great faces
    for (let row = 0; row < 4; row++) {
      const yb = -PIT + 2.6 + row * 4.8, ah = 3.0, aw = 1.9;
      const zEnd = zFoot - ((yb + ah + PIT) / (SH - PIT)) * SB - 1.6;
      for (let z = zApex + 3.4; z + aw / 2 < zEnd; z += 3.6) {
        [-1, 1].forEach((s) => {
          add(BODY2, arch(aw, ah, 0.16), s * (ST / 2 + 0.02), yb, z, { ry: s * Math.PI / 2 });
          add(SCALE, archFrame(aw + 0.5, ah + 0.26, 0.18, 0.12), s * (ST / 2 + 0.03), yb, z, { ry: s * Math.PI / 2 });
        });
      }
    }

    // the two quadrants: radius 15.15 m, 2.84 wide, tops falling from the
    // gnomon to the pit floor on a quarter of a circle
    const QR = 15.15, QW = 2.84, QH = QR * Math.cos(LAT);   // 13.5 m of rise
    [-1, 1].forEach((s) => {
      const pts = [[s * (ST / 2 + 0.02), -PIT + QH]];
      for (let i = 1; i <= 28; i++) {
        const a = (i / 28) * Math.PI / 2;
        pts.push([s * (ST / 2 + 0.02 + (QR - ST / 2) * Math.sin(a)), -PIT + QH * Math.cos(a)]);
      }
      pts.push([s * QR, -PIT]);
      pts.push([s * QR, -PIT - 0.4]);
      pts.push([s * (ST / 2 + 0.02), -PIT - 0.4]);
      add(BODY, profX(pts, QW), 0, 0, CZ + SB / 2 - QW / 2);
      // a narrow marble band along the graduated edge
      for (let i = 0; i < 28; i++) {
        const p0 = pts[i], p1 = pts[i + 1];
        const dxx = p1[0] - p0[0], dyy = p1[1] - p0[1];
        const l = Math.hypot(dxx, dyy);
        add(SCALE, box(l * 1.15, 0.16, QW + 0.14), (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 + 0.08,
          CZ + SB / 2 - QW / 2, { rz: Math.atan2(dyy, dxx) });
      }
      for (let i = 1; i < 24; i++) {
        const a = (i / 24) * Math.PI / 2;
        const x = s * (ST / 2 + (QR - ST / 2) * Math.sin(a));
        const y = -PIT + QH * Math.cos(a);
        add(SCALE, box(0.26, 0.1, QW + 0.24), x, y + 0.08, CZ + SB / 2 - QW / 2);
      }
    });

    // the chhatri at the summit
    add(PL, cyl(2.2, 2.4, 0.5, 10), 0, SH - PIT, zApex);
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2;
      add(PL, cyl(0.16, 0.19, 2.0, 6), Math.cos(a) * 1.6, SH - PIT + 1.4, zApex + Math.sin(a) * 1.6);
    }
    add(PL, cyl(2.3, 2.3, 0.24, 10), 0, SH - PIT + 2.5, zApex);
    add(SCALE, dome(2.0, 1.7, 14), 0, SH - PIT + 2.6, zApex);
    add('gold', sph(0.16, 8), 0, SH - PIT + 4.4, zApex);

    /* ================================================================ *
     *  3. THE JAI PRAKASH — two bowls, 5.44 m across                   *
     * ================================================================ */
    function bowl(cx, cz, R, yRim, yBot) {
      const d = yRim - yBot;
      const rho = (R * R + d * d) / (2 * d);
      const surf = (r) => yBot + rho - Math.sqrt(Math.max(0, rho * rho - r * r));
      const p = [[0.02, yBot - 0.5], [R + 0.7, yBot - 0.5], [R + 0.7, yRim], [R, yRim]];
      for (let i = 12; i >= 0; i--) {
        const r = 0.06 + (i / 12) * (R - 0.06);
        p.push([r, surf(r)]);
      }
      add(PL, lathe(p, 44), cx, 0, cz);
      add(SCALE, torus(R + 0.2, 0.13, 5, 40), cx, yRim, cz, { rx: Math.PI / 2 });
      for (const r of [1.0, 2.0, 3.0, 4.0, R - 0.2]) {
        add(SCALE, torus(r, 0.035, 3, 36), cx, surf(r) + 0.02, cz, { rx: Math.PI / 2 });
      }
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        for (let j = 0; j < 4; j++) {
          const r = 0.5 + j * 0.85;
          add(SCALE, box(0.9, 0.05, 0.06), cx + Math.cos(a) * r, surf(r) + 0.02, cz + Math.sin(a) * r, { ry: -a });
        }
      }
      // four posts and the cross-wires over the rim
      const PR = R + 0.9;
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + k * Math.PI / 2;
        add(PL, cyl(0.2, 0.26, yRim + 2.4, 8), cx + Math.cos(a) * PR, (yRim + 2.4) / 2, cz + Math.sin(a) * PR);
      }
      const span = PR * Math.SQRT2;
      add(PL, box(span, 0.14, 0.16), cx, yRim + 2.4, cz - PR);
      add(PL, box(span, 0.14, 0.16), cx, yRim + 2.4, cz + PR);
      add('grey', box(span, 0.05, 0.05), cx, yRim + 2.2, cz);
      add('grey', box(0.05, 0.05, span), cx, yRim + 2.2, cz);
      add(METAL, cyl(0.3, 0.3, 0.06, 10), cx, yRim + 2.0, cz);
    }
    block(PL, 11.22, 1.6, 20.5, 0, -1.6, 40);
    add(BODY, box(11.6, 0.22, 20.9), 0, 0.1, 40);
    bowl(-2.7, 34.4, 2.72, 0.9, -1.5);
    bowl(2.7, 45.6, 2.72, 0.9, -1.5);

    /* ================================================================ *
     *  4. THE TWELVE RASHIVALAYA — on a floor 39 × 41 m                *
     * ================================================================ */
    block(PL, 39, 1.1, 41, 0, -1.1, 66);
    add(BODY, box(39.6, 0.18, 41.6), 0, 0.06, 66);
    for (let i = 0; i < 12; i++) {
      const col = i % 6, row = Math.floor(i / 6);
      const cx = -16.2 + col * 6.5, cz = 57 + row * 17.5;
      const gh = 4.22 + (i % 5) * 0.5;                    // 4.22 to 6.21 m
      const qr = i % 2 ? 1.68 : 1.24;
      const yaw = (i / 12) * Math.PI * 2 + 0.3;           // each dial differently turned
      const gb = gh / Math.tan(LAT);
      // the gnomon wall
      add(BODY, profX([[-gb / 2, 0], [gb / 2, 0], [gb / 2, gh]], 0.62), cx, 0, cz, { ry: yaw });
      add(SCALE, box(gb * 0.9, 0.14, 0.72), cx, 0.07, cz, { ry: yaw });
      // the quadrant, a quarter of a circle beside it
      const qpts = [[0.36, gh * 0.62]];
      for (let k = 1; k <= 12; k++) {
        const a = (k / 12) * Math.PI / 2;
        qpts.push([0.36 + qr * Math.sin(a), gh * 0.62 * Math.cos(a)]);
      }
      qpts.push([0.36 + qr, 0]);
      qpts.push([0.36, 0]);
      add(BODY, profX(qpts, 0.42), cx, 0, cz, { ry: yaw });
      
      add(BODY2, box(1.5, 0.2, 1.5), cx, 0.05, cz, { ry: yaw });
    }

    /* ================================================================ *
     *  5. THE RAM YANTRAS — drums 4.48 m tall, 6.95 m across           *
     * ================================================================ */
    function ramYantra(cx, cz, R, H, yFloor) {
      const seg = 26;
      // the drum wall, open at the top, with sectors cut out of it
      for (let k = 0; k < seg; k++) {
        const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
        const am = (a0 + a1) / 2;
        const w = (2 * Math.PI * R) / seg * 1.06;
        const hh = (k % 3 === 0) ? H * 0.45 : H;
        add(PL, box(w, hh, 0.5), cx + Math.cos(am) * R, yFloor + hh / 2, cz + Math.sin(am) * R, { ry: -am });
      }
      add(SCALE, torus(R, 0.09, 4, 40), cx, yFloor + H, cz, { rx: Math.PI / 2 });
      add(PL, cyl(R + 0.3, R + 0.5, yFloor, seg), cx, yFloor / 2, cz);
      add(SCALE, torus(R - 0.4, 0.07, 3, 40), cx, yFloor + 0.04, cz, { rx: Math.PI / 2 });
      // the central pillar, as tall as the wall
      add(PLW, cyl(0.42, 0.5, H + yFloor, 10), cx, (H + yFloor) / 2, cz);
      add(SCALE, cyl(0.6, 0.6, 0.16, 10), cx, H + yFloor + 0.08, cz);
    }
    ramYantra(-33, 30, 3.47, 4.48, 1.12);        // great Ram Yantra, pair
    ramYantra(-33, 40, 3.47, 4.48, 1.12);
    ramYantra(33, 20, 1.95, 2.5, 0.8);           // small Ram Yantra

    /* ================================================================ *
     *  6. THE REST OF THE NINETEEN                                     *
     * ================================================================ */
    // Kapala Yantra: two bowls about 3.5 m across on a shared east-west base
    block(PL, 9.5, 1.3, 4.6, 34, -1.3, 44);
    add(BODY, box(9.9, 0.18, 5.0), 34, 0.06, 44);
    bowl(31.6, 44, 1.75, 0.5, -1.1);
    bowl(36.4, 44, 1.75, 0.5, -1.1);

    // Chakra Yantra: two brass rings, about 1.8 m across, on three posts
    for (let i = 0; i < 3; i++) {
      add(PL, cyl(0.22, 0.28, 4.4, 8), 34 + (i - 1) * 1.6, 2.2, 33.4);
    }
    [-0.7, 0.7].forEach((dz) => {
      add(METAL, torus(0.92, 0.1, 6, 26), 34, 4.5, 33.4 + dz, { rx: 0.47 });
      add(METAL, cyl(0.26, 0.26, 0.08, 12), 34, 4.5, 33.4 + dz, { rx: 0.47 });
    });

    // Digamsa Yantra: a pillar 0.96 m high inside two coaxial walls
    (function digamsa(cx, cz) {
      add(PL, cyl(3.6, 3.9, 0.5, 20), cx, 0.25, cz);
      add(SCALE, torus(3.5, 0.09, 4, 32), cx, 0.55, cz, { rx: Math.PI / 2 });
      for (let k = 0; k < 20; k++) {
        const a = (k / 20) * Math.PI * 2;
        add(PL, box(1.15, 1.95, 0.24), cx + Math.cos(a) * 3.3, 0.5 + 0.97, cz + Math.sin(a) * 3.3, { ry: -a });
      }
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        add(PL, box(1.1, 0.96, 0.22), cx + Math.cos(a) * 1.9, 0.5 + 0.48, cz + Math.sin(a) * 1.9, { ry: -a });
      }
      add(PL, cyl(0.52, 0.56, 0.96, 12), cx, 0.5 + 0.48, cz);
      add(SCALE, cyl(0.6, 0.6, 0.12, 12), cx, 1.5, cz);
    })(33, -2);

    // Yantra Raj: three pillars 3.3 m high carrying the great astrolabe
    (function yantraRaj(cx, cz) {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        add(PL, cyl(0.34, 0.42, 3.3, 8), cx + Math.cos(a) * 1.7, 1.65, cz + Math.sin(a) * 1.7);
      }
      add(PL, box(4.6, 0.34, 0.34), cx, 3.45, cz, { ry: 0.4 });
      add(PL, box(0.34, 0.34, 4.6), cx, 3.45, cz, { ry: 0.4 });
      add(METAL, cyl(1.06, 1.06, 0.1, 24), cx, 3.9, cz, { rx: Math.PI / 2, ry: 0.4 });
      add(METAL, torus(1.21, 0.07, 4, 26), cx, 3.9, cz, { rx: 0.35, ry: 0.4 });
      add(METAL, cyl(1.05, 1.05, 0.07, 22), cx + 0.4, 3.55, cz - 0.5, { rx: 1.2, ry: 0.4 });
    })(-33, -4);

    // Nadivalaya: two discs, 3.70 m and 3.74 m across, facing north and south
    (function nadivalaya(cx, cz) {
      block(PL, 5.0, 3.4, 3.0, cx, 0, cz);
      add(BODY2, box(5.3, 0.3, 3.3), cx, 3.4, cz);
      add(SCALE, cyl(1.85, 1.85, 0.16, 26), cx, 1.9, cz - 1.5, { rx: Math.PI / 2 - LAT });
      add(SCALE, cyl(1.87, 1.87, 0.16, 26), cx, 1.9, cz + 1.5, { rx: Math.PI / 2 + LAT });
      for (const r of [1.2, 1.6]) {
        add(BODY2, torus(r, 0.04, 3, 26), cx, 1.9, cz - 1.62, { rx: Math.PI / 2 - LAT });
      }
    })(0, 22);

    // Nadivalaya II: the small horizontal dial
    (function nadi2(cx, cz) {
      block(PL, 3.2, 1.0, 3.2, cx, 0, cz);
      add(SCALE, cyl(1.35, 1.35, 0.12, 20), cx, 1.06, cz);
      add(PLW, cyl(0.1, 0.14, 1.5, 8), cx, 1.8, cz);
    })(46, 74);

    // Krantivritta: the circular plate 3.4 m across, its superstructure lost
    (function kranti(cx, cz) {
      block(PL, 6.0, 1.2, 6.0, cx, 0, cz);
      add(SCALE, cyl(1.7, 1.7, 0.2, 26), cx, 1.3, cz, { rx: LAT });
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add(PL, cyl(0.26, 0.3, 1.6, 7), cx + Math.cos(a) * 2.5, 0.8, cz + Math.sin(a) * 2.5);
      }
    })(-36, 60);

    // Krantivritta II: the metal instrument
    (function kranti2(cx, cz) {
      block(PL, 5.0, 1.0, 5.0, cx, 0, cz);
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i / 4) * Math.PI * 2;
        add(PL, cyl(0.2, 0.24, 2.4, 7), cx + Math.cos(a) * 1.7, 1.2, cz + Math.sin(a) * 1.7);
      }
      add(METAL, torus(1.5, 0.09, 5, 26), cx, 2.7, cz, { rx: LAT });
      add(METAL, box(2.9, 0.06, 0.06), cx, 2.7, cz, { rx: LAT });
    })(-18, 74);

    // Laghu Samrat Yantra: 6.9 m tall, 19.75 m base, quadrants of 2.78 m
    (function laghu(cx, cz) {
      const b = 19.75, h = 6.9, t = 1.29;
      add(BODY, prof([[cz + b / 2, 0], [cz - b / 2, h], [cz - b / 2, 0]], t), cx, 0, 0);
      
      for (let i = 0; i < 16; i++) {
        const tt = (i + 0.5) / 16;
        add(PLW, box(1.0, 0.22, (b / 16) * 1.2), cx, h * tt - 0.11, cz + b / 2 - b * tt);
      }
      [-1, 1].forEach((s) => {
        const pts = [[s * (t / 2 + 0.02), h * 0.62]];
        for (let i = 1; i <= 14; i++) {
          const a = (i / 14) * Math.PI / 2;
          pts.push([s * (t / 2 + 0.02 + 2.78 * Math.sin(a)), h * 0.62 * Math.cos(a)]);
        }
        pts.push([s * 2.78, 0]);
        pts.push([s * (t / 2 + 0.02), 0]);
        add(BODY, profX(pts, 0.98), cx, 0, cz);
        
      });
    })(-36, -34);

    // Sasthamsa Yantra: four meridian dials in two chambers
    (function sasthamsa(cx, cz) {
      block(PL, 12, 7.0, 14, cx, 0, cz);
      add(BODY2, box(12.6, 0.5, 14.6), cx, 7.0, cz);
      [-1, 1].forEach((s) => {
        add('dark', arch(2.6, 3.6, 0.5), cx, 0.1, cz + s * 7.0, { ry: s > 0 ? 0 : Math.PI });
        add(SCALE, archFrame(3.0, 4.0, 0.3, 0.6), cx, 0.1, cz + s * 7.02, { ry: s > 0 ? 0 : Math.PI });
      });
      for (let i = 0; i < 4; i++) {
        add(SCALE, box(0.1, 5.0, 9.0), cx - 4.2 + i * 2.8, 3.0, cz, { rx: LAT * (i % 2 ? 1 : -1) });
      }
      chhatri(cx, 7.5, cz, 1.2, PL, SCALE);
    })(36, -34);

    // Unnatamsa Yantra: a brass ring 5.35 m across on pillars
    (function unnatamsa(cx, cz) {
      block(PL, 6.4, 0.9, 6.4, cx, 0, cz);
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i / 4) * Math.PI * 2;
        add(PL, cyl(0.22, 0.28, 3.2, 8), cx + Math.cos(a) * 2.4, 1.7, cz + Math.sin(a) * 2.4);
      }
      add(METAL, torus(2.67, 0.13, 6, 34), cx, 4.6, cz, { rx: 1.0 });
      add(METAL, box(5.4, 0.1, 0.1), cx, 4.6, cz, { rz: 0.2 });
      add(METAL, box(0.1, 0.1, 5.4), cx, 4.6, cz, { rx: 0.2 });
    })(36, 58);

    // Dhruva Darsaka Yantra: the little trapezoid aimed at the pole star
    (function dhruva(cx, cz) {
      block(PL, 3.0, 0.9, 3.0, cx, 0, cz);
      add(BODY, profX([[-1.4, 0], [1.4, 0], [0.9, 1.5], [-0.9, 1.5]], 1.4), cx, 0.9, cz, { rx: LAT });
      add(SCALE, box(2.0, 0.06, 1.5), cx, 2.4, cz, { rx: LAT });
    })(20, -66);

    // Disha Yantra: the square platform of uncertain purpose
    (function disha(cx, cz) {
      block(PL, 7.0, 0.7, 7.0, cx, 0, cz);
      add(BODY, box(7.3, 0.14, 7.3), cx, 0.72, cz);
      add(BODY2, box(7.4, 0.2, 0.4), cx, 0.8, cz - 3.5);
      add(BODY2, box(0.4, 0.2, 7.4), cx + 3.5, 0.8, cz);
    })(-46, -58);

    // the Astronomer's House, by the Nadivalaya
    (function house(cx, cz) {
      block(PL, 12, 5.4, 9, cx, 0, cz);
      add(BODY2, box(12.6, 0.5, 9.6), cx, 5.4, cz);
      add('dark', arch(2.2, 3.0, 0.4), cx, 0.1, cz + 4.5);
      add(SCALE, archFrame(2.6, 3.4, 0.24, 0.5), cx, 0.1, cz + 4.55);
      for (let i = -1; i <= 1; i += 2) {
        add('dark', arch(1.2, 1.8, 0.3), cx + i * 3.6, 0.1, cz + 4.5);
      }
      chhatri(cx + 3.6, 5.9, cz - 2.2, 1.0, PL, SCALE);
    })(46, -56);

    /* ================================================================ *
     *  7. LIFE                                                         *
     * ================================================================ */
    const people = [[-6, 14], [6, 16], [-2, 26], [10, 34], [-14, 30], [18, 20],
      [-24, 46], [24, 48], [-8, 52], [12, 60], [-30, 20], [30, 30],
      [4, 72], [-16, 78], [38, 40], [-40, 8]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1,
      ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));

    [[-50, 30], [50, 30], [-50, -30], [50, -30], [-20, 12], [20, 12], [-48, 70]].forEach(([x, z], i) =>
      ctx.tree(x, z, 0.7, i % 2 ? 'round' : 'cypress'));
    [[-44, 44], [44, 12], [-12, 30], [12, 44], [-44, -44], [44, -44]].forEach(([x, z]) =>
      ctx.lamp(x, z, 3.0, 'black'));

    ctx.light({ pos: [-30, 26, 40], target: [0, 10, -20], color: 0xffd0a0, intensity: 3200, distance: 200 });
    ctx.light({ pos: [34, 22, 30], target: [10, 10, 0], color: 0xffc890, intensity: 2600, distance: 200 });
  }
};
