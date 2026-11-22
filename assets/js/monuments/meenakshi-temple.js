/* Meenakshi Amman Temple — Madurai · procedural miniature
   Dravidian temple city: painted gopurams, Golden Lotus tank, pillared halls.
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'meenakshi-temple',
  accent: '#d4544a',
  accent2: '#f08a6a',
  seed: 41,
  bounds: 120,
  minDist: 30,
  maxDist: 460,
  home: { pos: [74, 68, 262], target: [6, 20, 0], fov: 38 },
  ground: { texture: 'paving', size: 1800, color: 0xc0ae8c },
  floods: [
    { pos: [-96, 40, 104], target: [0, 26, 0], color: 0xffd9ae, intensity: 3200, distance: 420 },
    { pos: [92, 34, 96], target: [0, 28, 0], color: 0xffe2bc, intensity: 2400, distance: 420 },
    { pos: [10, 14, 132], target: [0, 30, 40], color: 0xffd2a0, intensity: 1600, distance: 320 }
  ],
  views: [
    { name: 'Full', pos: [74, 68, 262], target: [6, 20, 0] },
    { name: 'Gopuram', pos: [26, 40, 104], target: [0, 34, 72] },
    { name: 'Tank', pos: [-16, 24, 92], target: [-44, 6, 50] },
    { name: 'Inner court', pos: [58, 46, 44], target: [0, 14, -6] },
    { name: 'Crest', pos: [16, 56, 60], target: [0, 48, 72] }
  ],
  tour: [
    {
      title: 'The Temple City', deva: 'மீனாட்சி அம்மன் கோயில்',
      text: 'The Meenakshi Sundareswarar temple occupies the southern bank of the Vaigai at Madurai, dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar, Shiva. Sangam literature describes the temple city, and the earliest structures here date from Pandya rule in the 12th and 13th centuries.',
      pos: [64, 56, 202], target: [6, 18, 0], time: 16.4
    },
    {
      title: 'Fourteen Gopurams', deva: 'கோபுரம்',
      text: 'Much of the present complex was rebuilt in the 14th century and enlarged under the Vijayanagara Empire and the Nayaks, who added the great gopurams. Fourteen of them rise above the streets, the tallest nearly 52 metres high and covered in thousands of painted stucco figures.',
      pos: [26, 40, 104], target: [0, 34, 72], time: 15.4
    },
    {
      title: 'Tiers of Painted Figures', deva: 'சிற்பங்கள்',
      text: 'Each gopuram is a tapering stack of storeys, every one carrying a row of stucco deities, dancers and guardians, repainted in reds, blues and yellows. A barrel-vaulted crest with gold finials closes the top.',
      pos: [-18, 44, 96], target: [-70, 34, 0], time: 11.6
    },
    {
      title: 'The Golden Lotus Tank', deva: 'பொற்றாமரைக் குளம்',
      text: 'Inside the walls lies the Potramarai tank, the Golden Lotus tank, where pilgrims bathe and where the golden lotus once floated. Its stepped ghats descend in tiers to the water, with a gold-roofed shrine at the centre.',
      pos: [-16, 24, 92], target: [-44, 6, 50], time: 13.4
    },
    {
      title: 'The Thousand Pillar Hall', deva: 'ஆயிரங்கால் மண்டபம்',
      text: 'The Hall of a Thousand Pillars opens off the courts, its carved columns packed close together. Beyond it the two sanctums are roofed in gold plate.',
      pos: [52, 30, 40], target: [6, 10, 8], time: 12.2
    },
    {
      title: 'A Living Temple', deva: 'வழிபாடு',
      text: 'The temple remains a working centre of Tamil religious life, with around 33,000 sculptures across the complex and daily processions through the streets of the old city. Crowds of pilgrims fill the courts from dawn.',
      pos: [-30, 12, 66], target: [-20, 8, 44], time: 9.2
    },
    {
      title: 'Gopurams at Night', deva: 'இரவு',
      text: 'After dark the tiers are floodlit and the painted figures glow against the sky, while the tank holds the reflection of the towers. The temple is one of the oldest continuously worshipped sites in India.',
      pos: [86, 50, 128], target: [0, 30, 0], time: 21.3
    }
  ],

  build(ctx) {
    const { add, box, cyl, cone, sph, plane, arch, archFrame, block, col, dome, onion, THREE } = ctx;
    const PI = Math.PI;

    /* palette used for the painted tiers */
    const PAL = ['red', 'teal', 'blue', 'pinkPaint', 'terracotta'];
    const FIG = ['yellow', 'teal', 'red', 'pinkPaint', 'blue'];

    /* ---------------------------------------------------------- gopuram */
    function gopuram(cx, cz, baseW, totalH, nTiers, ry, opts = {}) {
      const cs = Math.cos(ry), sn = Math.sin(ry);
      const P = (lx, lz) => [cx + lx * cs + lz * sn, cz - lx * sn + lz * cs];
      const baseD = baseW * 0.64;
      const plinthH = 2.0;
      const crestH = Math.max(4.5, totalH * 0.12);
      const tierH = (totalH - plinthH - crestH) / nTiers;

      // stone plinth
      block('granite', baseW * 1.1, plinthH, baseD * 1.1, cx, 0, cz, { ry });
      block('plasterWhite', baseW * 1.04, 0.5, baseD * 1.04, cx, plinthH - 0.5, cz, { ry });

      let w = baseW, d = baseD, y = plinthH;
      for (let i = 0; i < nTiers; i++) {
        const bodyH = tierH * 0.66;
        const colKey = (i < 2 || i % 3 !== 1) ? 'yellow' : PAL[(i + (opts.shift || 0)) % PAL.length];
        block(colKey, w, bodyH, d, cx, y, cz, { ry });

        // rows of stucco figures on all four faces
        const fh = bodyH * 0.58, fy = y + bodyH * 0.2;
        const nLong = Math.max(4, Math.round(w / 1.35));
        const nShort = Math.max(3, Math.round(d / 1.35));
        const spL = w / nLong, spS = d / nShort;
        const main1 = FIG[(i * 2) % FIG.length];
        const main2 = FIG[(i * 2 + 3) % FIG.length];
        for (let j = 0; j < nLong; j++) {
          const off = (j - (nLong - 1) / 2) * spL;
          const k1 = j % 3 === 2 ? main2 : main1;
          let p = P(off, d / 2);
          add(k1, box(spL * 0.46, fh, 0.3), p[0], fy + fh / 2, p[1], { ry });
          p = P(off, -d / 2);
          add(k1, box(spL * 0.46, fh, 0.3), p[0], fy + fh / 2, p[1], { ry });
        }
        for (let j = 0; j < nShort; j++) {
          const off = (j - (nShort - 1) / 2) * spS;
          const k1 = j % 3 === 2 ? main2 : main1;
          let p = P(w / 2, off);
          add(k1, box(0.3, fh, spS * 0.46), p[0], fy + fh / 2, p[1], { ry });
          p = P(-w / 2, off);
          add(k1, box(0.3, fh, spS * 0.46), p[0], fy + fh / 2, p[1], { ry });
        }

        // moulded cornice between storeys
        block('yellow', w * 1.05, tierH * 0.34, d * 1.05, cx, y + bodyH, cz, { ry });
        add('terracotta', box(w * 1.06, tierH * 0.07, d * 1.06), cx, y + bodyH + tierH * 0.05, cz, { ry });

        y += tierH;
        w *= 0.905; d *= 0.905;
      }

      // gateway opening on the principal face
      const gw = Math.min(9, baseW * 0.42);
      const pp = P(0, baseD / 2 + 0.08);
      add('dark', arch(gw, plinthH + tierH * 1.5, 0.3), pp[0], 0.05, pp[1], { ry });
      add('granite', archFrame(gw + 1.0, plinthH + tierH * 1.6, 0.42, 0.4), pp[0], 0.05, pp[1], { ry });

      /* ---- barrel-vaulted crest with finials ---- */
      add('yellow', box(w * 1.14, crestH * 0.22, d * 1.14), cx, y + crestH * 0.11, cz, { ry });
      const vr = d * 0.62;
      add('yellow', cyl(vr * 0.72, vr * 0.72, w * 1.06, 16), cx, y + crestH * 0.22 + vr * 0.10, cz, { ry, rz: PI / 2 });
      add('gold', cyl(vr * 0.34, vr * 0.34, w * 1.10, 12), cx, y + crestH * 0.22 + vr * 0.10, cz, { ry, rz: PI / 2 });
      add('yellow', box(w * 1.06, crestH * 0.16, d * 0.34), cx, y + crestH * 0.22 + vr * 0.95, cz, { ry });
      // row of kalasha finials along the ridge
      const nf = 7;
      for (let j = 0; j < nf; j++) {
        const off = (j - (nf - 1) / 2) * (w * 0.92 / (nf - 1));
        const q = P(off, 0);
        const big = j === (nf - 1) / 2;
        const s = big ? 1.55 : 1.0;
        add('gold', cyl(0.16 * s, 0.22 * s, 1.0 * s, 6), q[0], y + crestH * 0.22 + vr * 1.12, q[1], { ry });
        add('gold', sph(0.34 * s, 8), q[0], y + crestH * 0.22 + vr * 1.12 + 0.62 * s, q[1], { ry });
        add('goldLeaf', cone(0.2 * s, 0.7 * s, 6), q[0], y + crestH * 0.22 + vr * 1.12 + 1.1 * s, q[1], { ry });
      }
    }

    /* ------------------------------------------------------------ walls */
    function wallRun(x1, z1, x2, z2, h, key) {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const n = Math.max(1, Math.round(len / 6));
      const ang = Math.atan2(z2 - z1, x2 - x1);
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n;
        const mx = x1 + (x2 - x1) * (t0 + t1) / 2, mz = z1 + (z2 - z1) * (t0 + t1) / 2;
        const seg = len / n;
        block(key, seg + 0.1, h, 1.6, mx, 0, mz, { ry: -ang });
        block('plasterWhite', seg + 0.1, 0.5, 1.9, mx, h - 0.5, mz, { ry: -ang });
        if (i % 2 === 0) add('terracotta', box(seg * 0.55, 0.7, 1.7), mx, h + 0.35, mz, { ry: -ang });
      }
    }

    /* ================= ground inside the complex ================= */
    add('paving', plane(146, 146), 0, 0.06, 0, { rx: -PI / 2 });

    /* ================= outer wall (square, ±72) ================= */
    const OW = 72, WALLH = 9;
    wallRun(-OW, OW, OW, OW, WALLH, 'plaster');
    wallRun(OW, OW, OW, -OW, WALLH, 'plaster');
    wallRun(OW, -OW, -OW, -OW, WALLH, 'plaster');
    wallRun(-OW, -OW, -OW, OW, WALLH, 'plaster');
    // corner bastions
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      block('plaster', 9, WALLH + 2.5, 9, sx * OW, 0, sz * OW);
      add('terracotta', box(10, 0.8, 10), sx * OW, WALLH + 2.9, sz * OW);
      add('gold', cyl(0.5, 0.6, 2.4, 8), sx * OW, WALLH + 3.3, sz * OW);
    }

    /* ================= four great gopurams ================= */
    gopuram(0, OW, 27, 46, 9, 0, { shift: 0 });            // east (front)
    gopuram(-OW, 0, 29, 52, 9, PI / 2, { shift: 2 });      // south — the tallest
    gopuram(OW, 0, 26, 44, 9, PI / 2, { shift: 4 });       // north
    gopuram(0, -OW, 25, 42, 9, 0, { shift: 1 });           // west

    /* ================= inner enclosure ================= */
    const IW = 34, IZH = 42, IZF = 30, IH = 7;
    for (const [x1, z1, x2, z2] of [[-IW, IZF, IW, IZF], [-IW, -IZH, IW, -IZH], [-IW, IZF, -IW, -IZH], [IW, IZF, IW, -IZH]]) {
      const len = Math.hypot(x2 - x1, z2 - z1), n = Math.max(1, Math.round(len / 6));
      const ang = Math.atan2(z2 - z1, x2 - x1);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        add('terracotta', box(len / n, 1.1, 1.75), x1 + (x2 - x1) * t, 0.55, z1 + (z2 - z1) * t, { ry: -ang });
      }
    }
    wallRun(-IW, IZF, IW, IZF, IH, 'plasterWhite');
    wallRun(-IW, -IZH, IW, -IZH, IH, 'plasterWhite');
    wallRun(-IW, IZF, -IW, -IZH, IH, 'plasterWhite');
    wallRun(IW, IZF, IW, -IZH, IH, 'plasterWhite');

    /* four inner gopurams */
    gopuram(0, IZF, 15, 31, 7, 0, { shift: 3 });
    gopuram(0, -IZH, 14, 28, 7, 0, { shift: 5 });
    gopuram(-IW, -4, 15, 33, 7, PI / 2, { shift: 1 });
    gopuram(IW, -4, 14, 29, 7, PI / 2, { shift: 2 });

    /* ================= golden lotus tank ================= */
    (function tank() {
      const TX = -44, TZ = 50, TW = 34, TD = 24, levels = 4, th = 1.15, t = 3.2;
      for (let k = 0; k < levels; k++) {
        const a = (TW - k * t * 2) / 2, b = (TD - k * t * 2) / 2;
        const y = k * th;
        block('plaster', 2 * a, th, t, TX, y, TZ + b - t / 2);
        block('plaster', 2 * a, th, t, TX, y, TZ - b + t / 2);
        block('plaster', t, th, 2 * b - 2 * t, TX - a + t / 2, y, TZ);
        block('plaster', t, th, 2 * b - 2 * t, TX + a - t / 2, y, TZ);
        // painted band along the top step
        if (k === 0) {
          block('terracotta', 2 * a + 0.4, 0.35, t + 0.4, TX, th - 0.35, TZ + b - t / 2);
          block('terracotta', 2 * a + 0.4, 0.35, t + 0.4, TX, th - 0.35, TZ - b + t / 2);
        }
      }
      const wy = levels * th;
      add('water', plane(TW - levels * t * 2 + 1.5, TD - levels * t * 2 + 1.5), TX, wy - 0.15, TZ, { rx: -PI / 2 });
      // gold-roofed shrine on the island
      block('granite', 7.5, 1.2, 7.5, TX, wy - 0.3, TZ);
      block('plasterWhite', 5.4, 3.4, 5.4, TX, wy + 0.9, TZ);
      add('gold', cyl(3.4, 3.9, 1.0, 8), TX, wy + 5.0, TZ);
      add('goldLeaf', dome(3.1, 2.6, 12), TX, wy + 5.6, TZ);
      add('gold', cyl(0.18, 0.18, 1.6, 6), TX, wy + 8.6, TZ);
      add('gold', sph(0.5, 8), TX, wy + 9.5, TZ);
      // four small lamps on the corners of the top step
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add('stone', cyl(0.5, 0.6, 1.6, 8), TX + sx * (TW / 2 - 1.2), 1.15, TZ + sz * (TD / 2 - 1.2));
        add('goldLeaf', sph(0.45, 8), TX + sx * (TW / 2 - 1.2), 2.9, TZ + sz * (TD / 2 - 1.2));
      }
    })();

    /* ================= sanctums with gold roofs ================= */
    function sanctum(cx, cz, w, d, wallH, roofKey) {
      block('granite', w + 2, 1.2, d + 2, cx, 0, cz);
      block('plasterWhite', w, wallH, d, cx, 1.2, cz);
      // pilaster rhythm
      for (let i = 0; i < 5; i++) {
        const t = (i / 4 - 0.5) * w * 0.86;
        for (const s of [-1, 1]) {
          add('plaster', box(1.1, wallH, 0.5), cx + t, 1.2 + wallH / 2, cz + s * (d / 2 + 0.2));
          add('plaster', box(0.5, wallH, 1.1), cx + s * (w / 2 + 0.2), 1.2 + wallH / 2, cz + t * (d / w));
        }
      }
      add('dark', arch(w * 0.3, wallH * 0.72, 0.2), cx, 1.3, cz + d / 2 + 0.1);
      add('granite', archFrame(w * 0.34, wallH * 0.78, 0.3, 0.34), cx, 1.3, cz + d / 2 + 0.15);
      block('plaster', w + 2.4, 0.9, d + 2.4, cx, 1.2 + wallH, cz);
      // stepped gold-plated vimana roof
      let rw = w * 0.88, ry = 1.2 + wallH + 0.9;
      for (let i = 0; i < 4; i++) {
        block(roofKey, rw, 1.4, rw * (d / w), cx, ry, cz);
        add('gold', box(rw * 1.04, 0.22, rw * (d / w) * 1.04), cx, ry + 1.4, cz);
        ry += 1.62; rw *= 0.76;
      }
      add('gold', cyl(rw * 0.55, rw * 0.72, 1.2, 8), cx, ry + 0.6, cz);
      add('goldLeaf', dome(rw * 0.5, rw * 0.55, 12), cx, ry + 1.2, cz);
      add('gold', cyl(0.22, 0.22, 2.0, 6), cx, ry + 2.2, cz);
      add('gold', sph(0.5, 8), cx, ry + 3.4, cz);
      add('goldLeaf', cone(0.28, 0.9, 6), cx, ry + 4.1, cz);
    }
    sanctum(-14, 0, 18, 18, 8.5, 'goldLeaf');    // Meenakshi
    sanctum(12, -14, 17, 17, 8.0, 'gold');       // Sundareswarar

    /* ================= thousand pillar hall ================= */
    (function hall(cx, cz, w, d) {
      block('granite', w + 3, 1.4, d + 3, cx, 0, cz);
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 5; j++) {
          const x = cx + (i - 3) * (w / 7), z = cz + (j - 2) * (d / 5);
          col('granite', 0.55, 0.68, 5.2, x, 1.4, z, 8);
          add('granite', box(1.5, 0.55, 1.5), x, 6.9, z);
        }
      }
      block('plasterWhite', w + 3, 1.2, d + 3, cx, 7.2, cz);
      block('plaster', w + 1, 1.6, d + 1, cx, 8.4, cz);
      for (let i = 0; i < 6; i++) {
        add('terracotta', box(2.6, 0.9, 0.5), cx + (i - 2.5) * (w / 6), 10.0, cz + d / 2 + 0.3);
      }
      add('gold', cyl(0.4, 0.5, 1.8, 8), cx, 10.0, cz);
      add('gold', sph(0.6, 8), cx, 11.4, cz);
    })(16, 16, 30, 18);

    /* ================= smaller shrines in the courts ================= */
    function shrine(cx, cz, w, d, h, key) {
      block('granite', w + 1.4, 0.9, d + 1.4, cx, 0, cz);
      block(key, w, h, d, cx, 0.9, cz);
      block('plasterWhite', w + 1.2, 0.7, d + 1.2, cx, 0.9 + h, cz);
      add('gold', cyl(0.28, 0.34, 1.3, 6), cx, 1.6 + h + 0.6, cz);
      add('gold', sph(0.42, 8), cx, 1.6 + h + 1.5, cz);
      add('dark', arch(w * 0.42, h * 0.68, 0.16), cx, 1.0, cz + d / 2 + 0.06);
    }
    shrine(-24, -22, 10, 9, 5.5, 'plasterWhite');
    shrine(24, -30, 9, 9, 5.0, 'plaster');
    shrine(-24, 14, 8, 8, 4.6, 'plasterWhite');
    shrine(6, 24, 8, 7, 4.4, 'plaster');
    shrine(-2, -30, 7, 7, 4.2, 'plasterWhite');
    shrine(28, 2, 7, 9, 4.8, 'plaster');

    /* ================= streets, people, lamps, trees ================= */
    // flagstaff in front of the inner east gate
    add('gold', cyl(0.55, 0.8, 15, 8), 0, 7.5, 36);
    add('gold', sph(1.0, 10), 0, 15.4, 36);
    add('fabricSaffron', plane(3.2, 2.0), 1.7, 13.4, 36, { ry: PI / 2 });

    const people = [
      [-8, 44, 'fabricRed'], [-6, 47, 'fabricSaffron'], [-11, 51, 'fabricWhite'], [-13, 56, 'fabricRed'],
      [-5, 58, 'fabricSaffron'], [-16, 44, 'fabricWhite'], [-2, 52, 'fabricRed'], [-9, 62, 'fabricSaffron'],
      [4, 46, 'fabricWhite'], [7, 52, 'fabricRed'], [10, 58, 'fabricSaffron'], [2, 64, 'fabricWhite'],
      [-24, 38, 'fabricSaffron'], [-18, 34, 'fabricRed'], [12, 38, 'fabricWhite'], [16, 44, 'fabricRed'],
      [-30, 56, 'fabricWhite'], [20, 62, 'fabricSaffron'], [-34, 20, 'fabricRed'], [26, 30, 'fabricWhite']
    ];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 1.3, k, 0.95 + (i % 3) * 0.07));

    [[-6, 40], [6, 40], [-32, 40], [8, 30], [-32, 62], [14, 66], [-8, 66], [24, 40], [-40, 8], [40, 22]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));

    [[-52, 60], [-56, 40], [46, 56], [56, 44], [-46, 12], [50, -10], [-58, -40], [44, -52],
      [-30, 66], [30, 66], [-64, 30], [64, 28], [-84, 78], [84, 80], [-80, -70], [78, -74]]
      .forEach(([x, z], i) => ctx.tree(x, z, 0.85 + (i % 4) * 0.09, i % 5 === 2 ? 'palm' : 'round'));

    /* low houses of the old city outside the walls */
    const houses = [[-96, 40, 14, 10], [-96, 62, 12, 9], [-98, 12, 16, 11], [98, 46, 15, 10],
      [96, 68, 12, 9], [100, 16, 13, 10], [-40, 96, 16, 10], [8, 98, 14, 10], [56, 94, 12, 9],
      [-96, -18, 13, 10], [-98, -46, 15, 9], [98, -24, 14, 10], [96, -54, 12, 10],
      [-64, 100, 13, 9], [30, 100, 12, 10], [-14, 100, 11, 9], [80, 96, 12, 9],
      [-98, 88, 12, 9], [98, 90, 13, 9], [-24, -96, 14, 10], [40, -98, 13, 10]];
    houses.forEach(([x, z, w, d], i) => {
      block(i % 2 ? 'cream' : 'plaster', w, 7 + (i % 3) * 2, d, x, 0, z);
      block('terracotta', w + 1, 0.6, d + 1, x, 7 + (i % 3) * 2, z);
      add('dark', box(1.6, 2.4, 0.2), x, 1.2, z + d / 2 + 0.05);
    });

    /* the four processional streets */
    add('paving', plane(26, 200), 0, 0.04, 0, { rx: -PI / 2 });
    add('paving', plane(200, 26), 0, 0.04, 0, { rx: -PI / 2 });
  }
};
