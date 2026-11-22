/* Jantar Mantar — Jaipur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'jantar-mantar',
  accent: '#e6d8b8',
  accent2: '#b8503a',
  seed: 103,
  time: 15.4,
  bounds: 66,
  minDist: 24,
  maxDist: 280,
  home: { pos: [66, 40, 94], target: [2, 8, 0], fov: 40 },
  ground: { texture: 'paving', size: 2600, color: 0xbcab8e },
  views: [
    { name: 'Full', pos: [66, 40, 94], target: [2, 8, 0] },
    { name: 'Samrat Yantra', pos: [44, 22, 44], target: [13, 15, 2] },
    { name: 'Jai Prakash', pos: [-34, 13, 32], target: [-15, 3, 4] },
    { name: 'Rashivalaya', pos: [26, 14, -42], target: [0, 3, -20] },
    { name: 'Instruments', pos: [-52, 22, 44], target: [-6, 8, 0] }
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

    const PL = 'plaster', PLW = 'plasterWhite', RED = 'sandstoneRed', MARB = 'marble';

    /* ---------------------------------------------------------------- utils */
    // A solid made by extruding a polygon drawn in the (z,y) plane through a
    // thickness along x.  Points are [z, y] in the monument's local frame.
    const prism = (pts, thick) => {
      let a = 0;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], q = pts[(i + 1) % pts.length];
        a += p[0] * q[1] - q[0] * p[1];
      }
      const P = a < 0 ? pts.slice().reverse() : pts;
      const s = new T3.Shape();
      P.forEach(([z, y], i) => (i ? s.lineTo(z, y) : s.moveTo(z, y)));
      s.closePath();
      return new T3.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 1 });
    };
    // place a (z,y) profile so that it is centred on x = cx, thickness along x
    const wallZY = (key, pts, thick, cx, cz, y0 = 0) =>
      add(key, prism(pts, thick), cx + thick / 2, y0, cz, { ry: -Math.PI / 2 });

    const FX = 38, FZ = 29;                       // half-extents of the paving

    /* ============================== the paving, kerb and compound wall ==== */
    block(PL, FX * 2, 0.5, FZ * 2, 0, -0.5, 0);                 // plaster floor, top at y = 0
    for (let x = -32; x <= 32; x += 8) add('stone', box(0.10, 0.05, FZ * 2 - 1.6), x, 0.02, 0);
    for (let z = -24; z <= 24; z += 8) add('stone', box(FX * 2 - 1.6, 0.05, 0.10), 0, 0.02, z);

    // red kerb inside the wall
    [1, -1].forEach((s) => {
      add(RED, box(FX * 2, 0.34, 0.9), 0, 0.17, s * (FZ - 0.45));
      add(RED, box(0.9, 0.34, FZ * 2), s * (FX - 0.45), 0.17, 0);
    });

    // plastered wall with red coping
    const WH = 3.0, WT = 0.9;
    const wallRun = (w, d, x, z) => {
      block(PL, w, WH, d, x, 0, z);
      block(RED, w + 0.3, 0.3, d + 0.3, x, WH, z);
      add(PL, box(w * 0.5, 0.18, d + 0.5), x, WH * 0.62, z);      // simple moulding
    };
    wallRun(WT, FZ * 2 + 1.8, FX + WT / 2, 0);
    wallRun(WT, FZ * 2 + 1.8, -(FX + WT / 2), 0);
    wallRun(FX * 2 + 1.8, WT, 0, -(FZ + WT / 2));
    // south wall, broken by the gate
    const GX = -4, GW = 9;
    wallRun(FX - (GX + GW / 2), WT, (-FX + GX + GW / 2) / 2, FZ + WT / 2);
    wallRun(FX - (GW / 2 - GX), WT, (FX + GX - GW / 2) / 2, FZ + WT / 2);
    // gate
    block(RED, 1.1, 4.9, 1.3, GX - GW / 2 - 0.55, 0, FZ + WT / 2);
    block(RED, 1.1, 4.9, 1.3, GX + GW / 2 + 0.55, 0, FZ + WT / 2);
    add('dark', arch(GW - 1.4, 4.1, 0.4), GX, 0, FZ + WT / 2);
    add(RED, archFrame(GW - 0.9, 4.4, 0.3, 0.55), GX, 0, FZ + WT / 2);
    block(RED, GW + 2.4, 0.45, 1.7, GX, 4.9, FZ + WT / 2);
    chhatri(GX - GW / 2 - 0.55, 5.35, FZ + WT / 2, 0.85, PL, MARB);
    chhatri(GX + GW / 2 + 0.55, 5.35, FZ + WT / 2, 0.85, PL, MARB);

    /* ============================== the Samrat Yantra ===================== */
    // A true extruded right-triangle prism: 42 m base, 27 m high, 3.4 m thick.
    const SX = 13, SZ = 3, HB = 42, HH = 27, HT = 3.4;
    const zA = -HB / 2, zB = HB / 2;                 // summit end (north), foot (south)
    const slope = HB / HH;                            // dz per dy along the hypotenuse
    const hypZ = (y) => zA + slope * (HH - y);        // hypotenuse z at height y

    wallZY(PL, [[zB, 0], [zA, HH], [zA, 0]], HT, SX, SZ);

    // stone stair up the hypotenuse
    const STEPS = 48, rise = HH / STEPS, run = HB / STEPS;
    for (let i = 0; i < STEPS; i++) {
      const yTop = HH - i * rise;
      add(PLW, box(2.3, rise + 0.5, run * 1.02), SX, yTop - (rise + 0.5) / 2, SZ + zA + (i + 0.5) * run);
    }
    // marble cheeks either side of the stair
    const sl = Math.atan(1 / slope);
    [1, -1].forEach((s) => {
      add(MARB, box(0.6, 0.26, HB / Math.cos(sl)), SX + s * 1.45, HH * 0.5 + 0.12, SZ, { rx: sl });
    });

    // rows of blind niches on both great faces (skipped where a quadrant hides them)
    const wingTop = (z) => {
      const d = z - zA;
      return d >= 0 && d <= 15 ? Math.sqrt(Math.max(0, 225 - d * d)) : 0;
    };
    for (let row = 0; row < 4; row++) {
      const yb = 3.2 + row * 4.6, ah = 2.8, aw = 1.9;
      const zEnd = hypZ(yb + ah) - 1.1;
      for (let z = zA + 2.4; z + aw / 2 < zEnd; z += 3.3) {
        if (yb + ah < wingTop(z) + 0.5) continue;
        [1, -1].forEach((s) => {
          const px = SX + s * (HT / 2 - 0.05);
          add('dark', arch(aw, ah, 0.13), px, yb, SZ + z, { ry: s * Math.PI / 2 });
          add(RED, archFrame(aw + 0.46, ah + 0.24, 0.2, 0.11), px, yb, SZ + z, { ry: s * Math.PI / 2 });
        });
      }
      // red string-course under each row
      add(RED, box(HT + 0.14, 0.14, Math.max(1, zEnd - zA - 1.6)), SX, yb - 0.24, SZ + (zA + 1.2 + zEnd) / 2);
    }

    // small domed pavilion on the summit
    chhatri(SX, HH, SZ + zA, 1.3, PL, MARB);

    // the two quadrant walls.  Their top edge is a quarter circle of radius
    // 15 m (the radius the survey gives the quadrants) struck from the summit's
    // foot, so it falls from the top of the gnomon to the plinth exactly as the
    // marble scales do on the real instrument.
    const QR = 15.0, QT = 2.2;
    const qpts = [[zA, 0], [zA + QR, 0]];
    for (let i = 1; i <= 26; i++) {
      const a = Math.PI / 2 - (i / 26) * (Math.PI / 2 - 0.02);
      qpts.push([zA + QR * Math.sin(a), QR * Math.cos(a)]);
    }
    [1, -1].forEach((s) => {
      const cxw = SX + s * (HT / 2 + 0.05 + QT / 2);
      wallZY(PL, qpts, QT, cxw, SZ);
      // marble face band + red graduations on the outer face
      for (let i = 0; i <= 30; i++) {
        const a = 0.03 + (i / 30) * (Math.PI / 2 - 0.07);
        const r = QR - 0.16;
        add(RED, box(QT + 0.1, 0.26, 0.62), cxw, r * Math.cos(a), SZ + zA + r * Math.sin(a), { rx: a });
      }
      for (let k = 1; k <= 5; k++) {
        const a = 0.04 + (k / 6) * (Math.PI / 2 - 0.1);
        const r = QR - 0.5;
        add(RED, box(QT + 0.2, 1.0, 0.18), cxw, r * Math.cos(a), SZ + zA + r * Math.sin(a), { rx: a });
      }
    });

    /* ============================== the Jai Prakash ======================= */
    (function jaiPrakash(cx, cz) {
      const RI = 6.2, WT2 = 0.6, yBot = 0.75, yRim = 3.3;
      const d = yRim - yBot;
      const rho = (RI * RI + d * d) / (2 * d);
      const surf = (r) => yBot + rho - Math.sqrt(Math.max(0, rho * rho - r * r));

      // thick-walled bowl: outside up, across the rim, down the inside
      const p = [[0.02, -0.25], [RI + WT2, -0.25], [RI + WT2, yRim], [RI, yRim]];
      for (let i = 13; i >= 0; i--) {
        const r = 0.06 + (i / 13) * (RI - 0.06);
        p.push([r, surf(r)]);
      }
      add(PL, lathe(p, 48), cx, 0, cz);

      // marble rim
      add(MARB, torus(RI + 0.3, 0.17, 6, 48), cx, yRim, cz, { rx: Math.PI / 2 });
      // marble grid: rings
      for (const r of [1.2, 2.4, 3.6, 4.8, 6.0]) {
        add(MARB, torus(r, 0.045, 4, 44), cx, surf(r) + 0.02, cz, { rx: Math.PI / 2 });
      }
      // marble grid: radial rules
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        for (let j = 0; j < 5; j++) {
          const r = 0.6 + j * 1.1;
          const t = Math.atan(r / Math.sqrt(Math.max(0.01, rho * rho - r * r)));
          add(MARB, box(1.14, 0.06, 0.08), cx + Math.cos(a) * r, surf(r) + 0.02, cz + Math.sin(a) * r,
            { ry: -a, rz: t });
        }
      }
      // four pillars and cross-wires above
      const PR = RI + 1.3;
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + k * Math.PI / 2;
        const px = cx + Math.cos(a) * PR, pz = cz + Math.sin(a) * PR;
        add(PL, cyl(0.42, 0.5, 0.4, 10), px, 0.2, pz);
        add(PL, cyl(0.24, 0.3, 5.0, 10), px, 2.7, pz);
        add(MARB, cyl(0.34, 0.28, 0.24, 10), px, 5.2, pz);
      }
      const span = PR * Math.SQRT2;
      add(PL, box(span, 0.18, 0.22), cx, 5.45, cz - span / 2);
      add(PL, box(span, 0.18, 0.22), cx, 5.45, cz + span / 2);
      add(PL, box(0.22, 0.18, span), cx - span / 2, 5.45, cz);
      add(PL, box(0.22, 0.18, span), cx + span / 2, 5.45, cz);
      add('grey', box(span, 0.07, 0.07), cx, 5.4, cz);
      add('grey', box(0.07, 0.07, span), cx, 5.4, cz);
      add('grey', box(span, 0.05, 0.05), cx, 5.33, cz, { ry: Math.PI / 4 });
      add('grey', box(span, 0.05, 0.05), cx, 5.33, cz, { ry: -Math.PI / 4 });
    })(-15, 4);

    /* ============================== the twelve zodiac dials =============== */
    (function rashivalaya() {
      const spots = [
        [-30, -21], [-24, -23], [-18, -24], [-12, -24], [-4, -24], [4, -24], [12, -24], [20, -24],
        [32, -12], [33, 4], [24, 22], [-28, 20]
      ];
      spots.forEach(([x, z], i) => {
        const yaw = Math.atan2(-x, -z);
        block(PL, 3.1, 1.0, 3.1, x, 0, z);
        add(RED, cyl(1.72, 1.72, 0.16, 16), x, 1.08, z);
        add(MARB, cyl(1.5, 1.5, 0.14, 16), x, 1.16, z);
        add(MARB, box(2.5, 0.22, 2.5), x, 1.72, z, { rx: -0.47, ry: yaw });
        add(RED, box(2.56, 0.1, 2.56), x, 1.62, z, { rx: -0.47, ry: yaw });
        add(PLW, box(0.14, 1.15, 1.5), x, 2.35, z, { ry: yaw });
        add(RED, cyl(0.06, 0.06, 0.5, 6), x, 1.95, z);
      });
    })();

    /* ============================== smaller instruments =================== */
    // Ram Yantra: two open cylinders with a central pillar
    (function ramYantra(cx, cz) {
      add(PL, cyl(5.0, 5.4, 0.9, 24), cx, 0.45, cz);
      add(RED, cyl(5.05, 5.05, 0.14, 24), cx, 0.96, cz);
      const ringWall = (r, h, t) => {
        const n = Math.round((2 * Math.PI * r) / 1.5);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          add(PLW, box(t, h, (2 * Math.PI * r) / n * 1.05), cx + Math.cos(a) * r, 0.9 + h / 2, cz + Math.sin(a) * r, { ry: -a });
        }
      };
      ringWall(4.4, 4.2, 0.45);
      ringWall(2.5, 3.4, 0.4);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        add(PLW, box(1.9, 2.4, 0.34), cx + Math.cos(a) * 3.45, 0.9 + 1.2, cz + Math.sin(a) * 3.45, { ry: -a });
      }
      add(PLW, cyl(0.55, 0.7, 4.6, 10), cx, 0.9 + 2.3, cz);
      add(MARB, cyl(0.85, 0.85, 0.2, 10), cx, 5.6, cz);
    })(-6, -14);

    // Chakra Yantra: a graduated ring on a pillar
    (function chakra(cx, cz) {
      add(PL, cyl(2.4, 2.7, 0.7, 16), cx, 0.35, cz);
      add(RED, cyl(2.45, 2.45, 0.12, 16), cx, 0.76, cz);
      add(PLW, cyl(0.4, 0.5, 4.2, 10), cx, 0.8 + 2.1, cz);
      add(MARB, torus(2.1, 0.16, 6, 32), cx, 5.3, cz, { rx: 0.46 });
      add(MARB, torus(1.5, 0.13, 6, 28), cx, 5.3, cz, { rx: 0.46 });
      add(RED, cyl(0.9, 0.9, 0.14, 12), cx, 5.3, cz, { rx: 0.46 });
    })(-32, -6);

    // Digamsha Yantra: a small domed pillar
    (function digamsha(cx, cz) {
      add(PL, cyl(3.2, 3.6, 0.9, 16), cx, 0.45, cz);
      add(RED, cyl(3.25, 3.25, 0.14, 16), cx, 0.96, cz);
      add(PLW, cyl(0.85, 1.1, 5.2, 10), cx, 0.9 + 2.6, cz);
      add(RED, cyl(1.35, 1.35, 0.24, 12), cx, 6.15, cz);
      add(MARB, dome(1.25, 1.15, 16), cx, 6.25, cz);
      add('gold', sph(0.14, 8), cx, 7.6, cz);
    })(-4, 16);

    /* ============================== life ================================= */
    const people = [[-2, 20], [8, 21], [-12, 16], [16, 18], [2, 24], [-22, 14], [24, 12], [-5, 9], [10, 8], [-26, -2], [30, 6], [6, -6]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-30, 16], [30, 16], [-30, -14], [30, -14], [0, 26], [-24, 24], [22, 26]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-34, 26], [34, 26], [-34, -26], [34, -26], [-34, 8], [34, 8], [12, 26]].forEach(([x, z], i) => ctx.tree(x, z, 0.82, i % 2 ? 'round' : 'cypress'));

    ctx.light({ pos: [-24, 18, 30], target: [0, 12, 0], color: 0xffd0a0, intensity: 2600, distance: 170 });
    ctx.light({ pos: [26, 16, 26], target: [10, 12, 0], color: 0xffc890, intensity: 2200, distance: 170 });
  }
};
