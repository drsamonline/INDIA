/* Qutb Minar — Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Measured against ASI / UNESCO / Peña et al. (2010) structural survey:
     height 72.5 m · base diameter 14.32 m · top diameter 2.75 m
     plinth: square ashlar platform ~16.5 m on side, 1.7 m deep
     five storeys, documented heights 95 / 51 / 41 / 25 / 22 ft
     storey 1 alternating angular + rounded fluting (24 flutes),
     storey 2 rounded only, storey 3 angular only, storeys 4-5 round. */

export default {
  id: 'qutub-minar',
  accent: '#d9a441',
  accent2: '#f0a868',
  seed: 11,
  floodScale: 0.26,
  bounds: 95,
  minDist: 18,
  maxDist: 340,
  home: { pos: [86, 36, 116], target: [0, 35, 0], fov: 40 },
  ground: { texture: 'paving', size: 1600, color: 0xc9bda6 },
  views: [
    { name: 'Full', pos: [86, 36, 116], target: [0, 35, 0] },
    { name: 'Base', pos: [26, 7, 34], target: [0, 10, 0] },
    { name: 'Crown', pos: [13, 66, 17], target: [0, 64, 0] },
    { name: 'Courtyard', pos: [-40, 13, 40], target: [-10, 10, 4] }
  ],
  tour: [
    {
      title: 'The Victory Tower', deva: 'क़ुतुब मीनार',
      text: 'At 72.5 metres, the Qutb Minar is the tallest masonry tower in India and the tallest brick minaret in the world. Qutb al-Din Aibak began it around 1199, to mark the founding of the Delhi Sultanate. Iltutmish, his successor, added three more storeys.',
      pos: [76, 30, 98], target: [0, 32, 0], time: 17.4
    },
    {
      title: 'Five Storeys, One Taper', deva: 'पाँच मंज़िलें',
      text: 'The tower narrows from 14.3 metres at the base to 2.75 metres at the crown. The first three storeys are red sandstone, fluted in alternating angular and round patterns and divided by projecting balconies carried on carved brackets.',
      pos: [24, 40, 34], target: [0, 40, 0], time: 12
    },
    {
      title: 'Marble & Sandstone', deva: 'संगमरमर',
      text: 'Lightning struck the tower in the fourteenth century; Firoz Shah Tughlaq repaired it, rebuilding the upper storeys in white marble and setting a cupola on top. Bands of marble also cut across the red sandstone below.',
      pos: [19, 60, 24], target: [0, 58, 0], time: 9.8
    },
    {
      title: 'The Iron Pillar', deva: 'लौह स्तंभ',
      text: 'A 7-metre iron pillar stands in the courtyard, cast in the Gupta period, around 400 CE, and inscribed in Sanskrit. Metallurgists still study why it has not rusted in sixteen centuries.',
      pos: [20, 6, 22], target: [13, 5, 13], time: 11
    },
    {
      title: 'Quwwat-ul-Islam', deva: 'कुव्वत-उल-इस्लाम',
      text: 'The mosque beside the tower was begun in 1193, raised from the stones of twenty-seven demolished Hindu and Jain temples. Their carved columns still carry the colonnades of the courtyard.',
      pos: [-34, 10, 30], target: [-12, 8, 2], time: 16.4
    },
    {
      title: 'The Unfinished Minar', deva: 'अलाई मीनार',
      text: 'Alauddin Khalji planned a tower twice the height of the Qutb Minar. Work stopped after the first storey, and the stump, 24 metres wide, remains north of the complex.',
      pos: [54, 17, -8], target: [40, 12, -28], time: 17.9
    },
    {
      title: 'The Tower at Night', deva: 'रात्रि',
      text: 'Floodlights throw the fluting into long shadows up the shaft. The complex was inscribed as a UNESCO World Heritage Site in 1993, and it is among the most visited monuments in Delhi.',
      pos: [70, 26, 92], target: [0, 34, 0], time: 21.4
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, arch, archFrame, block, col } = ctx;
    const TAU = Math.PI * 2;

    /* ===================================================================
       measured profile
       =================================================================== */
    const PLINTH_H = 1.7;        // square ashlar platform, 1.7 m deep
    const PLINTH_W = 16.5;       // ~16.5 m on side
    const BASE_D = 14.32;        // ASI: diameter at the base
    const TOP_D = 2.75;          // ASI: diameter at the top
    const TOP_Y = 69.0;          // top of the fifth storey (= platform level)
    const TOTAL = 72.5;          // ASI: total height to the finial

    // documented storey heights 95 / 51 / 41 / 25 / 22 ft, scaled so that
    // the shafts run from the plinth to the platform under the crown.
    const shaftTotal = TOP_Y - PLINTH_H;
    const FT = shaftTotal / 234;
    const H = [95 * FT, 51 * FT, 41 * FT, 25 * FT, 22 * FT];

    const diaAt = (y) => BASE_D + (TOP_D - BASE_D) * ((y - PLINTH_H) / shaftTotal);

    /* ===================================================================
       fluted shaft: built flute-by-flute so that each lobe keeps its own
       crisp arris, and band-by-band so that marble inlay sits flush in
       the sandstone instead of being stuck on as a ring.
       =================================================================== */
    function lobe(t, kind, phase) {
      // returns 0..1 radial offset across one flute
      if (kind === 'plain') return 0;
      if (kind === 'round') return Math.pow(Math.sin(Math.PI * t), 0.9);
      if (kind === 'angular') return Math.pow(1 - Math.abs(2 * t - 1), 0.72);
      // 'mixed' — alternate angular ridges and rounded ones
      return (phase % 2 === 0)
        ? Math.pow(1 - Math.abs(2 * t - 1), 0.72)
        : Math.pow(Math.sin(Math.PI * t), 0.9);
    }

    function shaftBand(y0, y1, d0, d1, flutes, kind, key, amp, cx = 0, cz = 0, altKey = null) {
      const per = kind === 'plain' ? 9 : 5;
      const rings = 3;
      const n = kind === 'plain' ? 1 : flutes;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU;
        const pos = [], uv = [], idx = [];
        for (let j = 0; j <= rings; j++) {
          const v = j / rings;
          const y = y0 + (y1 - y0) * v;
          const r = (d0 + (d1 - d0) * v) / 2;
          for (let k = 0; k <= per; k++) {
            const t = k / per;
            const a = a0 + (a1 - a0) * t;
            const rr = r * (1 + amp * lobe(t, kind, i));
            pos.push(cx + Math.cos(a) * rr, y, cz + Math.sin(a) * rr);
            uv.push(t, v);
          }
        }
        for (let j = 0; j < rings; j++) {
          for (let k = 0; k < per; k++) {
            const a = j * (per + 1) + k, b = a + per + 1;
            idx.push(a, b, a + 1, a + 1, b, b + 1);
          }
        }
        const g = new T3.BufferGeometry();
        g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
        g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        const k2 = (altKey && key === 'sandstoneRed') ? (i % 2 ? key : altKey) : key;
        add(k2, g, 0, 0, 0);
      }
    }

    /* ---- paved courtyard ---- */
    add('paving', ctx.plane(78, 66), 0, 0.06, 6, { rx: -Math.PI / 2 });
    add('stone', box(78.6, 0.12, 0.5), 0, 0.06, 39.2);
    add('stone', box(0.5, 0.12, 66.4), 39.2, 0.06, 6);
    add('stone', box(0.5, 0.12, 66.4), -39.2, 0.06, 6);

    /* ---- square plinth (16.5 m on side, 1.7 m deep) ---- */
    block('stone', PLINTH_W + 0.9, 0.35, PLINTH_W + 0.9, 0, 0, 0);
    block('sandstoneBuff', PLINTH_W, 1.05, PLINTH_W, 0, 0.35, 0);
    block('stone', PLINTH_W + 0.5, 0.3, PLINTH_W + 0.5, 0, 1.4, 0);
    // steps up the north (model +z) face
    for (let i = 0; i < 5; i++) {
      block('stone', 5.4 - i * 0.3, 0.28, 0.5, 0, i * 0.28, PLINTH_W / 2 + 1.5 - i * 0.5);
    }

    /* ---- entrance doorway ---- */
    add('dark', arch(2.6, 4.4, 0.6), 0, PLINTH_H, 6.9);
    add('marble', archFrame(3.2, 4.9, 0.26, 0.4), 0, PLINTH_H, 6.85);

    /* ===================================================================
       the five storeys
       =================================================================== */
    // band maps: [from, to, key] in normalised storey height
    const red = 'sandstoneRed', buf = 'sandstoneBuff', mar = 'marble';
    const bands = [
      // storey 1 — red sandstone with broad inlaid marble bands low down
      [[0.00, 0.035, mar], [0.035, 0.075, red], [0.075, 0.105, mar],
       [0.105, 0.40, red], [0.40, 0.435, buf], [0.435, 0.72, red],
       [0.72, 0.755, buf], [0.755, 1.00, red]],
      // storey 2 — rounded flutes only
      [[0.00, 0.10, red], [0.10, 0.135, buf], [0.135, 0.62, red],
       [0.62, 0.655, buf], [0.655, 1.00, red]],
      // storey 3 — angular flutes only
      [[0.00, 0.11, red], [0.11, 0.15, buf], [0.15, 0.78, red],
       [0.78, 0.82, buf], [0.82, 1.00, red]],
      // storey 4 — Tughlaq: red sandstone banded with broad white marble
      [[0.00, 0.16, mar], [0.16, 0.30, red], [0.30, 0.44, mar], [0.44, 0.58, red],
       [0.58, 0.72, mar], [0.72, 0.86, red], [0.86, 1.00, mar]],
      // storey 5 — white marble, red band at the foot and at the crown
      [[0.00, 0.14, red], [0.14, 0.86, mar], [0.86, 1.00, red]]
    ];
    const storeys = [
      { flutes: 24, kind: 'mixed', amp: 0.055 },
      { flutes: 24, kind: 'round', amp: 0.050 },
      { flutes: 24, kind: 'angular', amp: 0.046 },
      { flutes: 1, kind: 'plain', amp: 0 },
      { flutes: 1, kind: 'plain', amp: 0 }
    ];

    let y = PLINTH_H;
    for (let si = 0; si < 5; si++) {
      const s = storeys[si], h = H[si];
      const dB = diaAt(y), dT = diaAt(y + h);
      for (const [a, b, key] of bands[si]) {
        shaftBand(y + h * a, y + h * b,
          dB + (dT - dB) * a, dB + (dT - dB) * b,
          s.flutes, s.kind, key, s.amp, 0, 0, si === 0 ? 'sandstonePink' : null);
      }
      // plain keel moulding at the foot of each storey
      add(buf, cyl(dB / 2 + 0.14, dB / 2 + 0.14, 0.22, 48), 0, y + 0.11, 0);
      y += h;

      if (si < 4) {
        const rT = dT / 2;
        const proj = [1.75, 1.55, 1.30, 1.05][si];
        const rOut = rT + proj;

        /* ---- muqarnas corbel course under the slab ---- */
        const nb = 40;
        for (let k = 0; k < 3; k++) {
          const rr = rT + proj * (0.30 + 0.235 * k);
          const yy = y - 0.10 - 0.20 * (2 - k);
          const wd = (TAU * rr / nb) * 0.92;
          for (let i = 0; i < nb; i++) {
            const a = (i / nb) * TAU + (k % 2) * (TAU / nb) * 0.5;
            add(red, box(wd, 0.22, proj * 0.34), Math.cos(a) * rr, yy, Math.sin(a) * rr, { ry: -a });
          }
        }
        // bell-shaped pendentive ring closing the corbels
        add(red, ctx.lathe([[rT + 0.05, 0], [rT + proj * 0.55, 0.34], [rOut, 0.62], [rOut, 0.66]], 48), 0, y - 0.66, 0);

        /* ---- projecting balcony slab ---- */
        add('sandstoneBuff', cyl(rOut, rOut * 0.985, 0.34, 56), 0, y + 0.17, 0);
        add(mar, cyl(rOut + 0.10, rOut + 0.10, 0.10, 56), 0, y + 0.39, 0);

        /* ---- low parapet with merlon posts ---- */
        add(red, ctx.lathe([[rOut - 0.20, 0], [rOut, 0], [rOut, 0.46], [rOut - 0.20, 0.46]], 56), 0, y + 0.44, 0);
        const np = 52;
        for (let i = 0; i < np; i++) {
          const a = (i / np) * TAU;
          add(buf, box(0.24, 0.20, 0.20), Math.cos(a) * (rOut - 0.09), y + 0.94, Math.sin(a) * (rOut - 0.09), { ry: -a });
        }
        // the next storey springs from a short drum on the balcony
        const rNext = diaAt(y) / 2;
        add(buf, cyl(rNext + 0.10, rNext + 0.10, 0.30, 44), 0, y + 0.42, 0);
      }
    }

    /* ===================================================================
       crown: platform, railing, chhatri, finial
       =================================================================== */
    const rTop = TOP_D / 2;
    add(mar, cyl(rTop + 0.55, rTop + 0.55, 0.30, 40), 0, TOP_Y + 0.15, 0);
    add(buf, cyl(rTop + 0.75, rTop + 0.75, 0.16, 40), 0, TOP_Y + 0.38, 0);
    // railing round the platform
    const nPost = 20, rRail = rTop + 0.62;
    for (let i = 0; i < nPost; i++) {
      const a = (i / nPost) * TAU;
      add('black', cyl(0.045, 0.045, 0.85, 6), Math.cos(a) * rRail, TOP_Y + 0.89, Math.sin(a) * rRail);
    }
    add('black', ctx.torus(rRail, 0.045, 5, 40), 0, TOP_Y + 1.30, 0, { rx: Math.PI / 2 });
    add('black', ctx.torus(rRail, 0.035, 5, 40), 0, TOP_Y + 1.02, 0, { rx: Math.PI / 2 });

    // chhatri: eight columns under a small dome
    const chY = TOP_Y + 0.44, chR = 1.55;
    add(mar, cyl(chR + 0.32, chR + 0.38, 0.22, 20), 0, chY, 0);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      add(mar, cyl(0.15, 0.17, 1.65, 8), Math.cos(a) * chR, chY + 1.0, Math.sin(a) * chR);
      add(mar, cyl(0.20, 0.20, 0.10, 8), Math.cos(a) * chR, chY + 0.05, Math.sin(a) * chR);
    }
    add(mar, cyl(chR + 0.30, chR + 0.24, 0.24, 20), 0, chY + 1.90, 0);
    add(mar, dome(chR + 0.10, 1.05, 24), 0, chY + 2.02, 0);
    add('gold', cyl(0.06, 0.06, 0.9, 6), 0, chY + 3.35, 0);
    add('gold', sph(0.17, 8), 0, chY + 3.85, 0);
    add('gold', cone(0.13, 0.5, 6), 0, chY + 4.2, 0);

    /* ===================================================================
       low perimeter wall with crenellations
       =================================================================== */
    (function wall() {
      const R = 34, Hw = 2.7, T = 0.45;
      add(red, ctx.lathe([[R - T, 0], [R + T, 0], [R + T, Hw], [R - T, Hw]], 72), 0, 0, 0);
      add(buf, ctx.lathe([[R - T - 0.12, Hw], [R + T + 0.12, Hw], [R + T + 0.12, Hw + 0.22], [R - T - 0.12, Hw + 0.22]], 72), 0, 0, 0);
      const n = 72;
      for (let i = 0; i < n; i++) {
        if (i % 2) continue;
        const a = (i / n) * TAU;
        add(red, box(0.85, 0.62, 0.7), Math.cos(a) * R, Hw + 0.52, Math.sin(a) * R, { ry: -a });
      }
      [-1, 1].forEach((sg) => {
        block('sandstoneBuff', 1.7, 4.6, 1.7, sg * 3.4, 0, R);
        add('sandstoneBuff', dome(1.05, 0.95, 16), sg * 3.4, 4.6, R);
        add('gold', cyl(0.07, 0.07, 0.6, 6), sg * 3.4, 5.7, R);
      });
    })();

    /* ---- Alai Darwaza ---- */
    (function alaiDarwaza(x, z) {
      const w = 9.6, h = 11;
      block(red, w, h, w, x, 0, z);
      add('dark', arch(5.2, 7.4, 0.6), x, 0, z + w / 2 + 0.05);
      add(mar, archFrame(6.0, 8.0, 0.45, 0.4), x, 0, z + w / 2 + 0.1);
      add('dark', arch(4.4, 6.6, 0.5), x - w / 2 - 0.05, 0, z, { ry: Math.PI / 2 });
      add(mar, archFrame(5.1, 7.1, 0.38, 0.36), x - w / 2 - 0.1, 0, z, { ry: Math.PI / 2 });
      block(mar, w + 1.0, 0.7, w + 1.0, x, h, z);
      add(mar, box(w + 0.05, 0.55, w + 0.05), x, h - 1.3, z);
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add(mar, cyl(0.6, 0.68, 2.1, 8), x + dx * (w / 2 - 0.7), h + 1.7, z + dz * (w / 2 - 0.7));
        add(mar, dome(0.78, 0.75, 12), x + dx * (w / 2 - 0.7), h + 2.75, z + dz * (w / 2 - 0.7));
      }
      add(mar, cyl(4.5, 4.7, 0.55, 30), x, h + 0.95, z);
      add(mar, dome(4.2, 3.5, 28), x, h + 1.2, z);
      add('gold', cyl(0.1, 0.1, 1.4, 8), x, h + 5.6, z);
      add('gold', sph(0.24, 8), x, h + 6.3, z);
    })(-32, 26);

    /* ---- Iron Pillar (7.2 m shaft on its plinth) ---- */
    (function ironPillar(x, z) {
      block('stone', 3.6, 0.9, 3.6, x, 0, z);
      block('stone', 2.8, 0.7, 2.8, x, 0.9, z);
      add('black', cyl(0.44, 0.52, 7.2, 14), x, 1.6 + 3.6, z);
      add('black', cyl(0.58, 0.44, 0.55, 14), x, 1.6 + 7.5, z);
      add('bronze', cyl(0.36, 0.38, 1.0, 10), x, 1.6 + 8.3, z);
      add('bronze', sph(0.42, 10), x, 1.6 + 8.9, z);
      ctx.railing(x, 1.6, z + 2.1, 4.8, 'black', 0.9, 0, 6);
    })(14, 14);

    /* ---- Quwwat-ul-Islam colonnade ruins ---- */
    (function mosque(cx, cz) {
      block('stone', 42, 0.55, 30, cx, 0, cz);
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < 9; i++) {
          const x = cx - 16 + i * 4, z = cz - 11 + r * 5;
          col('stone', 0.34, 0.4, 4.4, x, 0.55, z, 8);
          col('stone', 0.42, 0.46, 0.32, x, 4.95, z, 8);
          if (i < 8 && r === 0) add(red, archFrame(3.3, 3.5, 0.24, 0.4), x + 2, 5.15, z);
        }
      }
      for (let i = 0; i < 7; i++) {
        const h = 1.5 + ((i * 37) % 5) * 0.6;
        block(red, 3.8, h, 0.95, cx - 15 + i * 5, 0.55, cz + 14);
      }
      block(red, 10.4, 7.6, 2.4, cx + 20, 0, cz);
      add('dark', arch(4.2, 6.1, 0.4), cx + 20, 0, cz + 1.3);
      add(mar, archFrame(4.9, 6.6, 0.34, 0.3), cx + 20, 0, cz + 1.4);
      block(mar, 11.2, 0.55, 3.0, cx + 20, 7.6, cz);
      add(mar, dome(1.7, 1.4, 14), cx + 17.2, 8.15, cz);
      add(mar, dome(1.7, 1.4, 14), cx + 22.8, 8.15, cz);
    })(-30, -8);

    /* ---- Alai Minar stump: 25 m extant, ~24.5 m across ---- */
    (function alaiMinar(x, z) {
      col('stone', 12.2, 12.6, 1.3, x, 0, z, 36);
      shaftBand(1.3, 25.0, 24.4, 22.6, 32, 'angular', red, 0.05, x, z);
      add('stone', cyl(11.2, 11.2, 0.55, 40), x, 25.3, z);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        add('stone', box(2.5, 1.3, 1.9), x + Math.cos(a) * 8.2, 25.9, z + Math.sin(a) * 8.2, { ry: a });
      }
    })(44, -36);

    /* ---- grounds ---- */
    add('foliage', ctx.plane(30, 22), -30, 0.6, -8, { rx: -Math.PI / 2 });
    add('paving', ctx.plane(9, 34), 0, 0.05, 22, { rx: -Math.PI / 2 });
    const trees = [[-58, 22], [-56, 42], [-22, 44], [8, 42], [30, 34], [-64, 2], [64, 12], [20, -22],
      [-44, -34], [16, 48], [-12, 50], [48, 40], [-70, -14], [60, -18]];
    trees.forEach(([x, z], i) => {
      const s = 0.95 + ((Math.abs(x * 7 + z) % 6) / 10);
      ctx.tree(x, z, s, (i % 4 === 0) ? 'palm' : 'round');
    });
    const far = [[-118, 74], [-96, 104], [-64, 118], [-18, 126], [34, 120], [78, 100], [112, 66],
      [124, 18], [118, -46], [92, -96], [46, -120], [-14, -124], [-70, -112], [-108, -74]];
    far.forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 4) * 0.18, i % 3 === 0 ? 'palm' : 'round'));
    [[-16, 26], [16, 26], [-16, -16], [16, -16], [0, 34], [0, -24], [-30, 16], [30, 18]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    const people = [[-4, 20, 'fabricWhite'], [5, 18, 'fabricSaffron'], [-9, 17, 'fabricRed'], [18, 8, 'fabricWhite'],
      [-20, 12, 'fabricRed'], [3, 27, 'fabricSaffron'], [-24, 4, 'fabricWhite'], [22, 24, 'fabricRed'],
      [-2, 15, 'fabricWhite'], [10, 21, 'fabricSaffron'], [-14, 20, 'fabricRed'], [26, 14, 'fabricWhite']];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 0.9, k, 0.95 + (i % 3) * 0.06));

    /* ---- floodlights ---- */
    ctx.light({ pos: [-40, 22, 40], target: [0, 30, 0], color: 0xffcf9a, intensity: 2600, distance: 280 });
    ctx.light({ pos: [42, 26, 36], target: [0, 30, 0], color: 0xffd9b0, intensity: 1800, distance: 280 });
  }
};
