/* Hawa Mahal — Jaipur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Measured against Wikipedia / Britannica / Rajasthan tourism:
     five storeys, about 15 m (50 ft) high
     facade about 21 m wide, one room deep (about 6 m), leaning back at ~87°
     ~953 jharokha openings — small pierced screens under white arch
     surrounds, each with a bangaldar cornice, a fluted dome and a finial
     the rear elevation is plain; there is no dome over the building.
   The facade faces +Z (the street); the palace mass is behind it. */

export default {
  id: 'hawa-mahal',
  accent: '#e0895f',
  accent2: '#f3b48a',
  seed: 23,
  floodScale: 0.26,
  time: 10.8,
  bounds: 46,
  minDist: 12,
  maxDist: 180,
  home: { pos: [1, 8.0, 33], target: [0, 7.6, 0], fov: 42 },
  ground: { texture: 'paving', size: 2400, color: 0xc8b79c },
  views: [
    { name: 'Full', pos: [1, 8.0, 33], target: [0, 7.6, 0] },
    { name: 'Facade', pos: [0, 7.4, 24], target: [0, 7.4, 0] },
    { name: 'Jharokhas', pos: [5, 11.5, 12], target: [1, 10.5, 1] },
    { name: 'Crown', pos: [5, 17, 13], target: [0, 15, 1] },
    { name: 'Street', pos: [-19, 2.6, 15], target: [0, 8, 1] }
  ],
  tour: [
    {
      title: 'The Palace of Winds', deva: 'हवा महल',
      text: 'Maharaja Sawai Pratap Singh built the Hawa Mahal in 1799 as an extension of the City Palace, reaching towards the women\'s quarters. Lal Chand Ustad shaped its five storeys as a pyramid, after the crown of Krishna.',
      pos: [20, 12, 40], target: [0, 9, 2], time: 17.3
    },
    {
      title: '953 Windows', deva: '९५३ झरोखे',
      text: 'The facade is a honeycomb of 953 small jharokha windows cut in sandstone. From behind those screens the women of the court watched the street and its festivals without being seen.',
      pos: [0, 9, 26], target: [0, 9, 2], time: 12
    },
    {
      title: 'A Wall That Breathes', deva: 'हवा',
      text: 'Air passes through the pierced screens and the small chambers behind them, cooling the interior, and fountains once cooled it further. That ventilation is where the name Palace of Winds comes from.',
      pos: [7, 13, 16], target: [2, 12, 2], time: 9.6
    },
    {
      title: 'Crown of the Facade', deva: 'मुकुट',
      text: 'The top storey carries a cusped arch under a small dome and finial, with domed chhatris at the ends of each tier. The whole screen is only a few metres deep; the palace behind it is a thin, curved wall.',
      pos: [6, 21, 18], target: [0, 17, 2], time: 16.8
    },
    {
      title: 'The Bazaar Below', deva: 'बाज़ार',
      text: 'Hawa Mahal faces the busiest lane of the old city, part of the walled town Sawai Jai Singh II laid out in 1727. Jaipur City was inscribed as a UNESCO World Heritage Site in 2019.',
      pos: [-24, 3.2, 22], target: [0, 8, 2], time: 17.9
    },
    {
      title: 'Pink at Dusk', deva: 'गुलाबी',
      text: 'The building is red and pink sandstone. At dusk the screens turn from rose to deep terracotta as the lamps come up along the lane.',
      pos: [16, 11, 34], target: [0, 9, 2], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, arch, archFrame, block, col, lathe } = ctx;
    const TAU = Math.PI * 2;

    /* ===================================================================
       measured envelope
       =================================================================== */
    const H = 15.0;              // 50 ft
    const W0 = 21.0;             // facade width at the base
    const DEPTH = 6.0;           // one room deep
    const T0 = 3.2;              // base tier (street arcade)
    const TH = (H - T0) / 4;     // four jharokha tiers
    const bow = (x) => 0.80 - 0.0072 * x * x;   // shallow plan curve
    const bowR = (x) => -0.0144 * x;            // slope of that curve

    /* ---- the street, the plinth, the kerb --------------------------------- */
    block('paving', 74, 0.5, 34, 0, -0.25, 10);
    block('stone', W0 + 7.0, 0.30, 9.0, 0, 0, -1.0);
    add('marble', box(W0 + 7.2, 0.10, 9.2), 0, 0.30, -1.0);

    /* ===================================================================
       tier 0 — the solid base wall with its row of plain arches
       =================================================================== */
    const nBase = 9;
    const baseZ = bow(0) + 0.0;
    block('sandstonePink', W0, T0, 1.4, 0, 0.34, baseZ - 0.7);
    add('white', box(W0 + 0.3, 0.16, 1.7), 0, 0.42, baseZ - 0.7);
    add('white', box(W0 + 0.4, 0.20, 1.8), 0, T0 + 0.26, baseZ - 0.7);
    for (let i = 0; i < nBase; i++) {
      const x = (i - (nBase - 1) / 2) * (W0 / nBase);
      const z = bow(x);
      // shallow recess, closed by a lattice panel — no black void
      add('sandstonePink', arch(1.30, 2.02, 0.10), x, 0.52, z + 0.14);
      add('jaliWhite', arch(1.14, 1.86, 0.05), x, 0.56, z + 0.34);
      add('white', archFrame(1.66, 2.42, 0.15, 0.14), x, 0.50, z + 0.30);
      add('white', box(1.30, 0.10, 0.22), x, 0.44, z + 0.36);
    }

    /* ===================================================================
       the four jharokha tiers
       =================================================================== */
    const tiers = [
      { w: 18.0, bays: 13, z: -0.30 },
      { w: 14.6, bays: 11, z: -0.62 },
      { w: 11.6, bays: 9, z: -0.94 },
      { w: 8.6, bays: 6, z: -1.26 }
    ];

    // one bangaldar cornice: a curved Bengali roof, wider than it is deep
    function cornice(x, y, z, w, ry, withDome = true) {
      const g = lathe([[w * 0.50, 0], [w * 0.50, 0.03], [w * 0.475, 0.075],
        [w * 0.40, 0.125], [w * 0.28, 0.165], [w * 0.10, 0.19], [0.012, 0.20]], 12);
      add('sandstonePink', g, x, y, z, { sz: 0.66, ry });
      add('white', cyl(w * 0.515, w * 0.515, 0.045, 12), x, y + 0.005, z, { sz: 0.66 });
      // the small fluted dome and finial that crown each casement
      if (withDome) {
        add('white', dome(Math.min(w * 0.20, 0.20), Math.min(w * 0.22, 0.22), 10), x, y + 0.19, z);
        add('white', cyl(Math.min(w * 0.10, 0.10), Math.min(w * 0.06, 0.06), 0.05, 8), x, y + 0.19 + Math.min(w * 0.22, 0.22), z);
        add('gold', cyl(0.010, 0.010, 0.13, 4), x, y + 0.24 + Math.min(w * 0.22, 0.22), z);
      }
    }

    for (let t = 0; t < 4; t++) {
      const T = tiers[t];
      const y = T0 + t * TH;
      const bw = T.w / T.bays;

      // the wall of the tier, behind the jharokhas
      block('sandstonePink', T.w, TH, 1.5, 0, y, T.z - 1.05);
      // white string courses top and bottom
      add('white', box(T.w + 0.5, 0.16, 1.9), 0, y + TH - 0.02, T.z - 0.55);
      add('white', box(T.w + 0.3, 0.12, 1.7), 0, y + 0.06, T.z - 0.62);

      for (let i = 0; i < T.bays; i++) {
        const x = (i - (T.bays - 1) / 2) * bw;
        const z = T.z + bow(x) * 0.85;
        const zw = T.z - 0.28;
        const ry = Math.atan(bowR(x)) * 0.8;

        // projecting casement, one room deep
        add('sandstonePink', box(bw * 0.88, TH * 0.64, 0.55), x, y + TH * 0.34, z + 0.22, { ry });
        add('white', box(bw * 0.94, 0.09, 0.66), x, y + 0.10, z + 0.26, { ry });

        // arched, pierced screen under a white surround
        add('jaliWhite', ctx.jali(bw * 0.74, TH * 0.50, { cols: 3, rows: 4, bar: 0.05, depth: 0.07, shape: 'arch' }), x, y + TH * 0.14, z + 0.50, { ry });
        add('white', archFrame(bw * 0.84, TH * 0.57, 0.05, 0.08), x, y + TH * 0.11, z + 0.48, { ry });
        // a second, small pierced panel on the wall above the casement
        add('jaliWhite', arch(bw * 0.30, TH * 0.15, 0.05), x, y + TH * 0.70, zw, { ry });
        add('white', archFrame(bw * 0.40, TH * 0.20, 0.045, 0.07), x, y + TH * 0.68, zw - 0.02, { ry });

        // bangaldar cornice and finial over each casement
        cornice(x, y + TH * 0.72, z + 0.28, bw * 0.88, ry);
      }

      // small domed chhatris closing the two ends of the tier
      [-1, 1].forEach((s) => {
        const x = s * (T.w / 2 + 0.22);
        const z = T.z + bow(x) * 0.85;
        add('sandstonePink', cyl(0.34, 0.40, TH * 0.55, 8), x, y + TH * 0.36, z);
        add('white', cyl(0.44, 0.44, 0.07, 10), x, y + TH * 0.62, z);
        add('white', dome(0.40, 0.44, 12), x, y + TH * 0.64, z);
        add('gold', sph(0.055, 6), x, y + TH * 0.64 + 0.50, z);
      });
    }

    /* ===================================================================
       crown: a taller cusped arch over the central bays of the top tier
       =================================================================== */
    const cy = T0 + 4 * TH;
    const cw = 3.3;
    // the central bay of the top tier is carried up a little higher, under a
    // wide bangaldar cornice — the crown of the pyramid, not a dome
    block('sandstonePink', cw, 1.35, 1.8, 0, cy - 0.35, -0.9);
    add('white', box(cw + 0.22, 0.10, 1.9), 0, cy + 0.92, -0.9);
    add('sandstonePink', arch(cw * 0.62, 1.30, 0.10), 0, cy - 0.20, -0.10);
    add('jaliWhite', arch(cw * 0.50, 1.18, 0.05), 0, cy - 0.14, 0.02);
    add('white', archFrame(cw * 0.74, 1.50, 0.09, 0.09), 0, cy - 0.20, -0.02);
    cornice(0, cy + 0.96, -0.10, cw * 0.92, 0, false);
    [-1, 1].forEach((s) => {
      add('white', cyl(0.24, 0.28, 0.10, 10), s * (cw * 0.5 + 0.30), cy + 0.96, -0.7);
      add('white', dome(0.24, 0.28, 12), s * (cw * 0.5 + 0.30), cy + 1.06, -0.7);
      add('gold', sph(0.05, 6), s * (cw * 0.5 + 0.30), cy + 1.46, -0.7);
    });

    /* ===================================================================
       the plain rear: one room deep, blank wall, crenellated parapet
       =================================================================== */
    const rearZ = -1.4 - DEPTH + 1.2;
    block('sandstonePink', W0, H - 1.2, 0.9, 0, 0, rearZ - 0.9);
    add('white', box(W0 + 0.2, 0.14, 1.1), 0, H - 1.2, rearZ - 0.9);
    // crenellations along the rear parapet
    for (let i = 0; i < 22; i++) {
      const x = -W0 / 2 + 0.5 + i * (W0 - 1) / 21;
      add('sandstonePink', box(0.46, 0.55, 0.5), x, H - 1.06, rearZ - 0.9);
    }
    // the side returns of the screen, closing it off
    [-1, 1].forEach((s) => {
      block('sandstonePink', 1.2, H - 0.6, DEPTH, s * (W0 / 2 + 0.6), 0, rearZ + 1.6);
    });

    /* ---- the City Palace wall running on either side of the screen ------- */
    [-1, 1].forEach((s) => {
      block('sandstonePink', 9.0, 6.4, 2.6, s * (W0 / 2 + 5.2), 0, rearZ + 1.5);
      add('white', box(9.2, 0.16, 2.8), s * (W0 / 2 + 5.2), 6.4, rearZ + 1.5);
      for (let i = 0; i < 8; i++) {
        add('sandstonePink', box(0.42, 0.5, 0.5),
          s * (W0 / 2 + 1.4 + i * 1.05), 6.56, rearZ + 1.5);
      }
      // shallow niches so the flank is not a blank slab
      for (let i = 0; i < 3; i++) {
        add('dark', arch(1.0, 2.1, 0.14), s * (W0 / 2 + 2.6 + i * 2.4), 0.5, rearZ + 2.72);
        add('white', archFrame(1.3, 2.4, 0.10, 0.10), s * (W0 / 2 + 2.6 + i * 2.4), 0.5, rearZ + 2.74);
      }
    });
    // corner pavilion at the right end of the screen, as in the east elevation
    (function corner(x, z) {
      block('sandstonePink', 3.0, 12.0, 3.0, x, 0, z);
      add('white', box(3.3, 0.18, 3.3), x, 12.0, z);
      add('sandstonePink', cyl(1.05, 1.15, 0.9, 8), x, 12.2, z);
      add('white', dome(1.05, 1.0, 14), x, 13.1, z);
      add('gold', sph(0.10, 6), x, 14.2, z);
      add('gold', cyl(0.02, 0.02, 0.7, 4), x, 14.4, z);
    })(W0 / 2 + 2.4, rearZ + 2.0);

    /* ===================================================================
       the bazaar street
       =================================================================== */
    for (let i = -5; i <= 5; i++) {
      const x = i * 5.6;
      if (Math.abs(x) < 4.5) continue;             // keep the axis clear
      block(i % 2 ? 'sandstoneBuff' : 'plaster', 4.2, 2.4, 2.8, x, 0.2, 20);
      add('fabricSaffron', box(4.6, 0.12, 3.2), x, 2.6, 20);
      add('dark', box(1.9, 1.3, 0.2), x, 1.1, 18.5);
      add('white', box(2.2, 0.10, 0.3), x, 1.8, 18.5);
    }
    const people = [[-8, 8], [6, 9], [-14, 6], [14, 7], [0, 10], [-18, 9], [18, 9], [-3, 6], [9, 5],
      [-11, 11], [12, 10], [3, 7]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 10], [16, 10], [-8, 11], [8, 11]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-24, 12], [24, 12], [-28, 4], [28, 4], [-34, 14], [34, 14]].forEach(([x, z], i) => ctx.tree(x, z, 1.2, 'round'));

    ctx.light({ pos: [-14, 9, 14], target: [0, 8, 0], color: 0xffd0a0, intensity: 2600, distance: 140 });
    ctx.light({ pos: [14, 9, 13], target: [0, 8, 0], color: 0xffc890, intensity: 2200, distance: 140 });
  }
};
