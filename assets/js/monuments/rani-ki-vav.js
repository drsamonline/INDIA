/* Rani ki Vav — Patan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured proportions.
   The stepwell is 64 m long on its east–west axis, 20 m wide, and descends
   seven levels — 23 m to the floor of the tank, with the draw-well shaft
   reaching 30 m. Entrance and torana at the east (+Z); the circular well,
   10 m across, at the west end.
   It is an excavation in level ground, not a terrace: the rim sits at
   y = 0 and everything descends below it, so the seven levels read from
   the rim. The engine ground plane is dropped to the pit floor. */

export default {
  id: 'rani-ki-vav',
  accent: '#c8a06a',
  accent2: '#e0c090',
  seed: 61,
  floodScale: 0.35,
  time: 12.6,
  bounds: 60,
  minDist: 16,
  maxDist: 240,
  home: { pos: [37, 29, 49], target: [0, -7, -2], fov: 40 },
  ground: { texture: 'sandGround', size: 2400, color: 0xc0ad88 },
  groundY: -30.6,
  horizon: false,
  views: [
    { name: 'Full', pos: [37, 29, 49], target: [0, -7, -2] },
    { name: 'From above', pos: [12, 46, 22], target: [0, -12, -3] },
    { name: 'Seven levels', pos: [26, 8, 20], target: [0, -10, -4] },
    { name: 'Carving', pos: [12, -4, 6], target: [0, -9, -4] },
    { name: 'The well', pos: [14, 6, -22], target: [0, -12, -26] },
    { name: 'The tank', pos: [3, -3, -12], target: [0, -22, -21.6] }
  ],
  tour: [
    {
      title: 'The Queen’s Stepwell', deva: 'रानी की वाव',
      text: 'Rani ki Vav was built at Patan in 1063 by Queen Udayamati in memory of her husband Bhima I of the Chaulukya, or Solanki, dynasty. It runs 64 metres long and about 20 metres wide, some 28 metres deep, with seven levels of steps — a temple turned upside down, its sanctum at the water.',
      pos: [30, 36, 42], target: [0, 2, -6], time: 16.4
    },
    {
      title: 'Seven Levels', deva: 'सात स्तर',
      text: 'The well descends in seven terraces, each narrower than the one above, so that from the rim the whole structure reads as a stepped funnel of stone down to the water.',
      pos: [10, 52, 24], target: [0, 0, -4], time: 12
    },
    {
      title: 'A Temple Upside Down', deva: 'उल्टा मंदिर',
      text: 'The stepwell was designed as a temple inverted. Avatars of Vishnu, apsaras, nagkanyas and Jain monks cover the walls, and the water at the lowest level takes the place of the sanctum.',
      pos: [14, 13, 16], target: [0, 4, -4], time: 9.6
    },
    {
      title: 'Five Hundred Figures', deva: 'मूर्तियाँ',
      text: 'More than five hundred major sculptures line the walls and the faces of the terraces, among them a great reclining Vishnu in the water. The carving is among the finest of the Māru-Gurjara school.',
      pos: [8, 7, 12], target: [4, 6, 0], time: 11
    },
    {
      title: 'Buried and Found', deva: 'पुनर्खोज',
      text: 'The Saraswati river silted over the stepwell and buried it for centuries. It was cleared in the 1950s and restored, then inscribed as a UNESCO World Heritage Site in 2014. It now appears on the reverse of the ₹100 note.',
      pos: [4, 14, -18], target: [0, 6, -14], time: 17.2
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit from the rim, the terraces read as a flight of golden steps going down into the dark.',
      pos: [26, 30, 38], target: [0, 2, -6], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, plane, lathe, torus } = ctx;

    /* ---------------- measured dimensions ------------------------------- */
    const W0 = 10.0;          // half width  (20 m overall)
    const Z0 = 32.0;          // half length (64 m overall)
    const NL = 7;             // seven levels
    const H = 23.0 / NL;      // 3.286 m per level — tank floor at -23 m
    const STEPIN = 5.25 / NL; // 0.75 m of terrace per level per side
    const SLOPE = 23.0 / 48.0; // corridor falls 23 m over the first 48 m
    const depthAt = (z) => Math.min(23.0, Math.max(0, (Z0 - z) * SLOPE));
    const FLOOR = -23.0;
    const WELLZ = -28.5;      // centre of the draw-well
    const WELLR = 5.0;        // 10 m across

    const key = 'sandstoneBuff', carve = 'cream', shade = 'dark';

    /* ---------------- the ground: a flat plain with a hole in it -------- */
    function landPlane(w, d, x, z) {
      const g = plane(w, d);
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / 14, uv.getY(i) * d / 14);
      add('grass', g, x, 0, z, { rx: -Math.PI / 2 });
    }
    landPlane(800, 386, 0, Z0 + 193);          // east of the rim
    landPlane(800, 386, 0, -Z0 - 193);         // west of the rim
    landPlane(390, 64, -W0 - 195, 0);          // north strip
    landPlane(390, 64, W0 + 195, 0);           // south strip
    // a low treeline on the plain, so the horizon is not bare
    for (let i = 0; i < 54; i++) {
      const a = (i / 54) * Math.PI * 2 + 0.05;
      const r = 210 + ctx.rng() * 130, hh = 7 + ctx.rng() * 8;
      add(i % 3 ? 'haze' : 'foliage', sph(hh * 1.5, 8), Math.cos(a) * r, hh * 0.5, Math.sin(a) * r, { sy: hh / (hh * 1.5) });
    }

    /* ---------------- the seven terraces -------------------------------- */
    // vertical risers stepping inward, each cut down to the local floor
    for (let i = 0; i < NL; i++) {
      const x = W0 - STEPIN * i;
      const top = -H * i, bot0 = -H * (i + 1);
      for (let z = Z0; z > -Z0; z -= 2) {
        const d = depthAt(z - 1);
        const bot = Math.max(bot0, -d);
        if (top - bot < 0.06) continue;
        for (const s of [-1, 1]) {
          block(key, 0.62, top - bot, 2.02, s * x, bot, z - 1);
        }
      }
      // the outer face of the pit, above the first ledge
      if (i === 0) {
        for (const s of [-1, 1]) {
          block(key, 0.5, 0.7, 2 * Z0, s * (W0 + 0.28), 0, 0);
          add(carve, box(0.62, 0.14, 2 * Z0), s * (W0 + 0.28), 0.72, 0);
        }
      }
    }
    // the horizontal ledges
    for (let i = 0; i < NL - 1; i++) {
      const xIn = W0 - STEPIN * i, xOut = W0 - STEPIN * (i + 1);
      for (let z = Z0; z > -Z0; z -= 2) {
        if (depthAt(z - 1) < H * (i + 1) + 0.02) continue;
        for (const s of [-1, 1]) {
          block(key, STEPIN + 0.08, 0.3, 2.02, s * (xIn + xOut) / 2, -H * (i + 1), z - 1);
          add('marble', box(STEPIN + 0.14, 0.13, 2.04), s * (xIn + xOut) / 2, -H * (i + 1) + 0.36, z - 1);
        }
      }
    }
    // the end walls, terraced the same way
    for (let i = 0; i < NL; i++) {
      const z = Z0 - STEPIN * i;
      const top = -H * i, bot = -H * (i + 1);
      for (const s of [-1, 1]) {
        if (depthAt(s * (z)) < H * (i + 1) && s < 0) continue;
        block(key, 2 * (W0 - STEPIN * i) - 0.1, top - bot, 0.62, 0, bot, s * z);
      }
    }

    /* ---------------- the corridor: steps down to the tank -------------- */
    const CORR = 3.1;         // half width of the open stepped corridor
    for (let z = Z0 - 0.6; z > -16; z -= 1.1) {
      const d0 = depthAt(z), d1 = depthAt(z - 1.1);
      const d = Math.min(d0, d1);
      if (d < 0.4) continue;
      block(key, CORR * 2, 0.34, 1.12, 0, -d - 0.34, z - 0.55);
      add(carve, box(CORR * 2 + 0.12, 0.1, 0.22), 0, -d + 0.02, z - 0.06);
      // the riser of each step, and a carved figure beside it
      const rise = d1 - d;
      if (rise > 0.1) {
        block(key, CORR * 2, rise, 0.22, 0, -d1, z - 1.0);
      }
    }
    // the floor of the tank section
    block(key, 2 * (W0 - 5.25), 0.5, 16.5, 0, FLOOR - 0.5, -24.2);
    add(carve, box(2 * (W0 - 5.25) - 0.2, 0.1, 16.3), 0, FLOOR - 0.02, -24.2);
    // the tank itself: 9.5 x 9.4 m
    ctx.waterBody(0, -21.6, 9.5, 9.4, { y: FLOOR + 0.22, color: 0x2a4f5c, distortion: 0.7, kerb: carve });
    add(carve, box(9.9, 0.34, 9.8), 0, FLOOR + 0.02, -21.6);

    /* ---------------- the draw-well, 10 m across ------------------------ */
    // a circular shaft from the rim down to 30 m, with a parapet above ground
    add(key, cyl(WELLR + 0.5, WELLR + 0.5, 1.1, 22, true), 0, 0.55, WELLZ);
    add(key, cyl(WELLR + 0.5, WELLR + 0.5, 1.1, 22, true), 0, 0.55, WELLZ, { sx: -1 });
    add('marble', torus(WELLR + 0.5, 0.16, 6, 22), 0, 1.11, WELLZ, { rx: Math.PI / 2 });
    add('marble', torus(WELLR + 0.5, 0.1, 6, 22), 0, 0.1, WELLZ, { rx: Math.PI / 2 });
    add(shade, cyl(WELLR + 0.48, WELLR + 0.48, 0.3, 22), 0, 0.95, WELLZ);
    add(key, cyl(WELLR, WELLR + 0.2, 30.0, 22, true), 0, -14.5, WELLZ);
    add(shade, cyl(WELLR - 0.25, WELLR - 0.25, 30.0, 20, true), 0, -14.5, WELLZ);
    add('water', cyl(WELLR - 0.3, WELLR - 0.3, 0.2, 20), 0, -28.4, WELLZ);
    // its seven internal ledges, matching the seven storeys
    for (let i = 0; i < NL; i++) {
      add('marble', cyl(WELLR - 0.1, WELLR - 0.1, 0.24, 22), 0, -H * (i + 1), WELLZ);
    }

    /* ---------------- the four pavilions -------------------------------- */
    // pillared, multi-storeyed galleries standing on the terraces, 2, 4, 6
    // and 7 storeys tall, their upper floors coming up to the rim.
    const PAV = [18.5, 8.0, -2.0, -13.0];
    PAV.forEach((pz) => {
      const d = depthAt(pz);
      if (d < 1.2) return;
      const n = Math.max(1, Math.round(d / H));
      const sh = d / n, hl = 2.9;
      for (const s of [-1, 1]) {
        for (let lv = 0; lv < n; lv++) {
          const yb = -d + lv * sh;
          // the floor of this storey — sandstone, with a marble nosing
          block('cream', 4.4, 0.32, hl * 2, s * 7.0, yb, pz);
          add(carve, box(0.3, 0.12, hl * 2), s * 5.0, yb + 0.34, pz);
          // two rows of three pillars
          for (const px of [5.6, 8.5]) {
            for (let k = -1; k <= 1; k++) {
              const pzz = pz + k * (hl - 0.9);
              col(key, 0.27, 0.33, sh - 0.34, s * px, yb + 0.32, pzz, 8);
              add(carve, box(0.66, 0.18, 0.66), s * px, yb + 0.4, pzz);
              add(carve, box(0.74, 0.2, 0.74), s * px, yb + sh - 0.16, pzz);
            }
          }
          // the architrave closing the storey
          add(carve, box(0.55, 0.2, hl * 2 + 0.1), s * 5.05, yb + sh - 0.1, pz);
          add(key, box(4.4, 0.16, hl * 2 + 0.1), s * 7.1, yb + sh - 0.12, pz);
        }
      }
    });

    /* ---------------- carved panels on the riser faces ------------------ */
    for (let i = 0; i < NL; i++) {
      const x = W0 - STEPIN * i;
      const yMid = -H * i - H * 0.52;
      for (let z = Z0 - 2.4; z > -Z0 + 2; z -= 1.65) {
        if (depthAt(z) < H * i + H * 0.9) continue;
        for (const s of [-1, 1]) {
          add('sandstoneRed', box(0.12, 1.7, 0.7), s * (x - 0.3), yMid, z);
          add(shade, box(0.14, 1.45, 0.56), s * (x - 0.36), yMid, z);
          add(carve, box(0.17, 2.0, 0.42), s * (x - 0.4), yMid, z - 0.74);
          add(carve, box(0.15, 1.7, 0.36), s * (x - 0.43), yMid, z + 0.74);
          add(carve, sph(0.18, 6), s * (x - 0.43), yMid + 0.9, z);
          add(carve, box(0.2, 0.16, 1.5), s * (x - 0.38), yMid + 1.15, z);
        }
      }
    }

    /* ---------------- the torana and the rim ---------------------------- */
    // the ceremonial entrance at the east end: two columns and a lintel
    for (const s of [-1, 1]) {
      block(carve, 0.7, 0.5, 0.7, s * 2.6, 0, Z0 + 3.2);
      col(carve, 0.32, 0.4, 4.4, s * 2.6, 0.5, Z0 + 3.2, 10);
      add(carve, box(0.9, 0.3, 0.9), s * 2.6, 5.05, Z0 + 3.2);
    }
    block(carve, 6.6, 0.42, 0.8, 0, 5.2, Z0 + 3.2);
    add(key, box(7.2, 0.3, 1.0), 0, 5.62, Z0 + 3.2);
    add(key, dome(1.5, 1.0, 12), 0, 5.77, Z0 + 3.2);
    add('gold', sph(0.15, 6), 0, 6.9, Z0 + 3.2);
    // a low parapet round the whole rim
    for (let z = -Z0; z <= Z0; z += 2.4) {
      for (const s of [-1, 1]) {
        if (Math.abs(z) < WELLR + 1 && s < 0) continue;
        add(key, box(0.5, 0.9, 2.3), s * (W0 + 0.85), 0.45, z);
        add(carve, box(0.62, 0.12, 2.35), s * (W0 + 0.85), 0.96, z);
      }
    }
    for (let x = -W0; x <= W0; x += 2.4) {
      add(key, box(2.3, 0.9, 0.5), x, 0.45, Z0 + 0.85);
      add(carve, box(2.35, 0.12, 0.62), x, 0.96, Z0 + 0.85);
      if (Math.abs(x) > WELLR + 1.2) {
        add(key, box(2.3, 0.9, 0.5), x, 0.45, -Z0 - 0.85);
        add(carve, box(2.35, 0.12, 0.62), x, 0.96, -Z0 - 0.85);
      }
    }

    /* ---------------- life on the rim ----------------------------------- */
    const people = [[-8, 26], [7, 27], [-9, 14], [9, 15], [0, 30], [-6, 2],
      [7, 0], [-9, -12], [8, -14], [2, 34], [-3, 34], [11, 22]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 20], [16, 20], [-16, -4], [16, -4], [-15, -26], [15, -26], [0, 38]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.05 + (i % 3) * 0.14, 'round'));
    ctx.lamp(-12.5, 30, 3.4, 'black');
    ctx.lamp(12.5, 30, 3.4, 'black');
    ctx.lamp(-12.5, -20, 3.4, 'black');
    ctx.lamp(12.5, -20, 3.4, 'black');

    ctx.light({ pos: [-30, 14, 30], target: [0, -10, 0], color: 0xffd0a0, intensity: 1500, distance: 150 });
    ctx.light({ pos: [30, 14, 24], target: [0, -10, -4], color: 0xffc890, intensity: 1300, distance: 150 });
    ctx.light({ pos: [6, 10, -34], target: [0, -14, -26], color: 0xffd8b0, intensity: 900, distance: 110 });
  }
};
