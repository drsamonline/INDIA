/* Konark Sun Temple — Odisha · procedural miniature
   The chariot of Surya: a high plinth with 24 carved wheels, seven rearing
   horses, the surviving jagamohana under its stepped roof, and the broken deul.
   CC BY-NC 4.0

   Built to measured dimensions (1 unit = 1 metre):
     chariot plinth            36 x 70 m, 4.1 m high (13 ft 6 in)
     jagamohana                30 m square (ASI)
     jagamohana height         34.3 m above the platform to the amala,
                               38.4 m above ground (112 ft 5 in, Swarup 1910)
     wheels                    24, 2.97 m diameter, 8 spokes, 12 a flank
     horses                    seven, four to one hand and three to the other
     deul                      ruined; originally over 61 m
*/

export default {
  id: 'konark-sun-temple',
  accent: '#b8865a',
  accent2: '#dcae82',
  seed: 1250,
  floodScale: 0.35,
  time: 10.4,
  bounds: 115,
  minDist: 20,
  maxDist: 400,
  home: { pos: [88, 30, 110], target: [0, 17, 6], fov: 40 },
  ground: { texture: 'grass', size: 1700, color: 0x93a06e },
  views: [
    { name: 'Full', pos: [88, 30, 110], target: [0, 17, 6] },
    { name: 'Wheels', pos: [40, 5.5, 30], target: [20, 2.6, 6] },
    { name: 'Roof', pos: [40, 36, 54], target: [0, 27, 8] },
    { name: 'Horses', pos: [30, 11, 86], target: [-2, 4, 44] },
    { name: 'Deul', pos: [-46, 24, -62], target: [-2, 14, -22] }
  ],
  tour: [
    {
      title: 'The Chariot of Surya', deva: 'कोणार्क सूर्य मंदिर',
      text: 'Narasingha Deva I of the Eastern Ganga dynasty built the Sun Temple at Konark around 1250, on the Odisha coast about 35 kilometres from Puri. It was conceived as the chariot of Surya, with twenty-four great stone wheels, seven horses and a vast processional stair.',
      pos: [92, 30, 96], target: [2, 13, 14], time: 16.6
    },
    {
      title: 'Twenty-Four Wheels', deva: 'चौबीस चक्र',
      text: 'Twelve wheels are carved on each long flank of the plinth, each about three metres across with a carved hub, spokes and a rim of beads. They are read as the wheels of the sun chariot, and as a sundial — the spokes of each wheel can be used to tell the hour.',
      pos: [40, 5.5, 24], target: [26, 2.2, 4], time: 15.4
    },
    {
      title: 'The Jagamohana', deva: 'जगमोहन',
      text: 'The surviving assembly hall, the jagamohana, stands about 30 metres high under a stepped pyramidal roof of tiers — the pidha form of Kalinga architecture. Its walls carry bands of dancers, musicians, elephants and mythical beasts.',
      pos: [36, 32, 46], target: [0, 22, 8], time: 13.4
    },
    {
      title: 'The Lost Deul', deva: 'देउल',
      text: 'The main sanctuary tower, the deul, is thought to have risen over 61 metres. It collapsed long ago; only the broken, tapering mass of its base survives behind the assembly hall, its courses still carved and its foot still heaped with fallen blocks.',
      pos: [-50, 22, -54], target: [-2, 13, -20], time: 10.6
    },
    {
      title: 'Seven Horses', deva: 'सात घोड़े',
      text: 'Seven stone horses strain at the front of the platform, drawing the chariot of the sun across the sky. They are matched to the seven days of the week, and the chariot itself to the year.',
      pos: [22, 6, 80], target: [0, 5, 46], time: 8.4
    },
    {
      title: 'Carved in Khondalite', deva: 'खोंडलाइट',
      text: 'Its surfaces are carved with dancers, musicians, elephants, mythical beasts, and the kama and mithuna scenes for which the temple is famous, along with bands of geometric ornament. The stone is khondalite, a weathered grey-brown gneiss that turns warm in low light.',
      pos: [-22, 10, 34], target: [10, 10, 22], time: 17.2
    },
    {
      title: 'The Temple at Night', deva: 'रात्रि',
      text: 'The site was inscribed as a UNESCO World Heritage Site in 1984 and is one of the finest examples of Kalinga architecture. Under floodlight the wheels throw long shadows across the plinth and the tiers of the roof stack up into the dark.',
      pos: [84, 24, 76], target: [4, 16, 2], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, torus, block, col, plane } = ctx;
    // khondalite is a grey-brown stone, not terracotta
    const GREY = (() => { const mm = ctx.mat('granite'); if (!mm || !mm.clone) return 'granite'; const c = mm.clone(); c.color.setHex(0x8b8878); return c; })();
    const PALE = (() => { const mm = ctx.mat('sandstoneBuff'); if (!mm || !mm.clone) return 'sandstoneBuff'; const c = mm.clone(); c.color.setHex(0x9d9a86); return c; })();
    const PI = Math.PI;
    const arch = ctx.arch, archFrame = ctx.archFrame;

    /* ---------- measured plan ------------------------------------------ */
    const PX = 18;             // half of 36 m
    const PZ = 35;             // half of 70 m
    const TOP = 4.1;           // plinth, 13 ft 6 in
    const JW = 30;             // jagamohana, 30 m square
    const JZ = 9;              // its centre along the axis
    const PITH = 5.3;          // top of the pitha mouldings
    const BADA = 18.8;         // top of the bada
    const AMALA = 38.35;       // top of the crown stone, 34.3 m over the platform
    const KAL = 40.4;          // tip of the kalasha

    /* ---------- compound ground ---------------------------------------- */
    add('paving', plane(120, 160), 0, 0.04, 8, { rx: -PI / 2 });
    add('sand', plane(260, 110), -170, 0.07, 30, { rx: -PI / 2 });
    add('sand', plane(170, 90), 110, 0.07, 110, { rx: -PI / 2 });
    add('foliage', plane(340, 260), 0, 0.05, -190, { rx: -PI / 2 });
    add('foliage', plane(180, 180), -150, 0.05, -60, { rx: -PI / 2 });

    /* ---------- the chariot platform ----------------------------------- */
    block('grey', PX * 2 + 1.4, 0.9, PZ * 2 + 1.4, 0, 0, 0);            // socle
    block(GREY, PX * 2, 2.3, PZ * 2, 0, 0.9, 0);                   // wall with the wheels
    block('grey', PX * 2 + 0.5, 0.45, PZ * 2 + 0.5, 0, 1.5, 0);         // carved band
    block(GREY, PX * 2 + 0.3, 0.8, PZ * 2 + 0.3, 0, 2.8, 0);
    block('stone', PX * 2 + 1.2, 0.5, PZ * 2 + 1.2, 0, 3.6, 0);         // projecting cornice
    add('stone', plane(PX * 2 - 1.0, PZ * 2 - 1.0), 0, TOP + 0.02, 0, { rx: -PI / 2 });
    block(GREY, PX * 2 + 0.4, 0.2, PZ * 2 + 0.4, 0, TOP, 0);

    /* ---------- 24 wheels, twelve to a flank --------------------------- */
    const WR = 1.485;                 // 2.97 m diameter
    function wheel(cx, cy, cz, side) {
      const x = cx * side;
      add(PALE, torus(WR, 0.17, 6, 24), x, cy, cz, { ry: PI / 2 });
      add(GREY, torus(WR * 0.79, 0.09, 5, 20), x, cy, cz, { ry: PI / 2 });
      add(PALE, cyl(0.40, 0.40, 0.55, 10), x, cy, cz, { rz: PI / 2 });
      add('grey', cyl(0.20, 0.20, 0.68, 8), x, cy, cz, { rz: PI / 2 });
      for (let i = 0; i < 8; i++) {
        add(PALE, box(0.17, WR * 1.5, 0.13), x, cy, cz, { rx: (i * PI) / 8 });
      }
      // beaded rim, sixteen blocks
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * PI * 2;
        add('grey', box(0.26, 0.24, 0.38), x, cy + Math.cos(a) * WR, cz + Math.sin(a) * WR, { rx: a });
      }
    }
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 12; i++) wheel(PX + 0.18, 2.05, -30.5 + i * 5.55, side);
      // pilasters between the wheels
      for (let i = 0; i < 13; i++) block('grey', 0.38, 2.5, 0.85, (PX + 0.1) * side, 0.85, -33.3 + i * 5.55);
    }
    // carved panels on the front and back faces of the plinth
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 7; i++) {
        add('grey', box(1.6, 1.5, 0.22), -14.4 + i * 4.8, 2.3, (PZ - 0.15) * side);
        add(PALE, box(2.0, 0.26, 0.28), -14.4 + i * 4.8, 3.15, (PZ - 0.1) * side);
      }
    }

    /* ---------- processional stair on the east (+Z) -------------------- */
    ctx.stairs(0, 0, 38.4, 17, TOP, 9, 0.9, GREY);
    for (const s of [-1, 1]) {
      block(GREY, 2.8, 0.5, 9.0, s * 9.6, 0, 38.6, { rx: -0.4 });
      block(GREY, 2.8, TOP, 1.2, s * 9.6, 0, 34.4);
      block(PALE, 3.1, 0.45, 1.5, s * 9.6, TOP, 34.4);
      for (let i = 0; i < 4; i++) block('grey', 2.2, 0.5, 0.5, s * 9.6, 1.0 + i * 0.75, 35.0);
      block(GREY, 1.0, 2.4, 1.0, s * 12.4, 0, 43.4);
      block('grey', 1.3, 0.28, 1.3, s * 12.4, 2.4, 43.4);
      add(GREY, sph(0.4, 8), s * 12.4, 2.85, 43.4);
    }
    add('paving', plane(22, 11), 0, 0.12, 42.0, { rx: -PI / 2 });

    /* ---------- jagamohana: pitha and bada ----------------------------- */
    block(PALE, JW + 1.2, 0.7, JW + 1.2, 0, TOP, JZ);
    block(GREY, JW + 0.6, 0.5, JW + 0.6, 0, TOP + 0.7, JZ);
    block('grey', JW, PITH - TOP - 1.2, JW, 0, TOP + 1.2, JZ);

    block(PALE, JW, BADA - PITH, JW, 0, PITH, JZ);
    // horizontal mouldings, the bands of a Kalinga bada
    [[1.0, 'grey'], [1.7, 'stone'], [2.6, 'grey'], [11.4, 'stone'],
      [12.2, 'grey'], [13.0, 'stone']].forEach(([h, k]) => {
      block(k, JW + 0.6, 0.36, JW + 0.6, 0, PITH + h, JZ);
    });
    // vertical relief panels on all four faces
    for (let f = 0; f < 4; f++) {
      const a = (f * PI) / 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      for (let i = 0; i < 9; i++) {
        const t = -11.5 + i * 2.9;
        const px = t * cs + (JW / 2 + 0.22) * sn, pz = JZ - t * sn + (JW / 2 + 0.22) * cs;
        if (f === 0 && Math.abs(t) < 3.6) continue;          // doorway
        add('grey', box(1.7, 7.6, 0.32), px, PITH + 5.6, pz, { ry: a });
        add('stone', box(1.95, 0.4, 0.4), px, PITH + 9.6, pz, { ry: a });
        add('stone', box(1.95, 0.32, 0.4), px, PITH + 1.9, pz, { ry: a });
      }
    }
    // the great eastern doorway
    add('dark', arch(5.2, 7.0, 0.6), 0, PITH, JZ + JW / 2 - 0.1);
    add(PALE, archFrame(6.2, 7.8, 0.45, 0.5), 0, PITH, JZ + JW / 2 + 0.05);
    add('grey', archFrame(7.2, 8.6, 0.3, 0.35), 0, PITH, JZ + JW / 2 + 0.02);
    for (const s of [-1, 1]) {
      add('dark', arch(2.3, 4.0, 0.4), s * 9.4, PITH + 0.9, JZ + JW / 2 - 0.1);
      add(PALE, archFrame(3.0, 4.6, 0.26, 0.3), s * 9.4, PITH + 0.9, JZ + JW / 2 + 0.05);
    }

    /* ---------- roof: nine pidha tiers in three stages ------------------
       Each tier is a recessed drum closed by a projecting potika cornice, so
       the pyramid reads as a stack of ledges rather than a smooth cone. */
    let ry = BADA;
    const TIERS = 9;
    const tierH = (AMALA - BADA - 2.0) / TIERS;      // 1.95
    for (let i = 0; i < TIERS; i++) {
      const w = 30.6 - i * 2.45;
      const dh = tierH - 0.5;
      block(PALE, w, dh, w, 0, ry, JZ);                    // drum
      block('grey', w + 0.14, 0.12, w + 0.14, 0, ry + 0.02, JZ);      // shadow line
      block('stone', w + 1.15, 0.5, w + 1.15, 0, ry + dh, JZ);        // potika cornice
      block('grey', w + 1.22, 0.1, w + 1.22, 0, ry + dh - 0.06, JZ);  // under-cut
      // carved blocks round each tier face
      const n = 3 + Math.round(i * 0.7);
      for (let k = 0; k < n; k++) {
        const t2 = -w / 2 + 1.1 + k * ((w - 2.2) / Math.max(1, n - 1));
        const yy = ry + dh * 0.5;
        add('grey', box(0.5, dh * 0.55, 0.2), t2, yy, JZ + w / 2 + 0.12);
        add('grey', box(0.5, dh * 0.55, 0.2), t2, yy, JZ - w / 2 - 0.12);
        add('grey', box(0.2, dh * 0.55, 0.5), JZ + w / 2 + 0.12, yy, t2);
        add('grey', box(0.2, dh * 0.55, 0.5), JZ - w / 2 - 0.12, yy, t2);
      }
      ry += tierH;
      // a recessed terrace with musicians between the stages
      if (i === 3 || i === 6) {
        const tw = 30.6 - (i + 1) * 2.45;
        block('grey', tw - 0.2, 0.55, tw - 0.2, 0, ry - 0.1, JZ);
        for (let k = 0; k < 8; k++) {
          const t3 = -tw / 2 + 1.6 + k * ((tw - 3.2) / 7);
          add(PALE, box(0.5, 0.9, 0.5), t3, ry + 0.3, JZ + tw / 2 - 0.5);
          add(PALE, box(0.5, 0.9, 0.5), t3, ry + 0.3, JZ - tw / 2 + 0.5);
        }
      }
    }

    /* ---------- amalaka, beki and kalasha ------------------------------ */
    add(GREY, cyl(5.8, 6.4, 0.5, 24), 0, AMALA - 1.75, JZ);
    add(PALE, cyl(5.0, 5.3, 1.3, 28), 0, AMALA - 0.85, JZ);
    // the fluted rim of the crown stone
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * PI * 2;
      add('grey', box(0.44, 1.28, 0.36), Math.cos(a) * 5.1, AMALA - 0.85, JZ + Math.sin(a) * 5.1, { ry: -a });
    }
    add(PALE, cyl(3.4, 4.4, 0.42, 20), 0, AMALA - 0.1, JZ);   // beki
    add(GREY, cyl(2.2, 2.6, 0.7, 16), 0, AMALA + 0.28, JZ);
    // the kalasha: a pot, a flared mouth and a spike
    add(PALE, ctx.lathe([[0.06, 0], [0.55, 0.12], [1.15, 0.55], [1.4, 1.05],
      [1.22, 1.65], [0.78, 2.05], [0.58, 2.3], [0.74, 2.6], [0.46, 2.95], [0.16, 3.35],
      [0.06, 3.7]], 16), 0, AMALA + 0.6, JZ);
    add('gold', cone(0.24, 0.85, 8), 0, KAL + 0.3, JZ);

    /* ---------- the broken deul behind: a rough, collapsed mass -------- */
    const DZ = -22;
    block('grey', 30.4, 1.0, 30.4, 0, TOP, DZ);
    block(PALE, 30.0, 5.4, 30.0, 0, TOP + 1.0, DZ);
    block('grey', 30.4, 0.4, 30.4, 0, TOP + 4.2, DZ);
    block('grey', 30.4, 0.4, 30.4, 0, TOP + 6.4, DZ);
    block(PALE, 29.6, 6.4, 29.6, 0, TOP + 6.8, DZ);
    // offset upper masses, each smaller and shifted, as if fallen in on itself
    block(PALE, 24.0, 4.4, 23.0, -0.8, TOP + 13.2, DZ + 0.6);
    block(PALE, 16.5, 3.8, 15.5, 1.4, TOP + 17.6, DZ - 1.2);
    block(GREY, 10.0, 2.6, 9.0, -1.2, TOP + 21.4, DZ + 1.0);
    // masonry courses, shallow and irregular
    for (let i = 0; i < 10; i++) {
      const y = TOP + 1.8 + i * 2.0;
      const w = y < TOP + 7 ? 30.2 : (y < TOP + 13 ? 24.2 : 16.7);
      const cz = y < TOP + 7 ? DZ : (y < TOP + 13 ? DZ + 0.6 : DZ - 1.2);
      block('grey', w, 0.2, w * 0.96, 0, y, cz);
    }
    // carved reliefs on the lower courses
    for (let i = 0; i < 7; i++) {
      const t2 = -12 + i * 4;
      add('grey', box(1.7, 2.4, 0.28), t2, TOP + 3.4, DZ + 15.1);
      add('grey', box(1.7, 2.4, 0.28), t2, TOP + 3.4, DZ - 15.1);
    }
    // jagged broken crown
    const jag = [[-4.6, 3.6, 1.8], [-1.8, 2.2, 2.6], [1.0, 4.6, 1.3], [3.2, 2.8, 2.2],
      [5.0, 1.6, 3.0], [-3.2, 2.4, 2.8], [2.4, 1.4, 3.4], [0.2, 5.4, 1.1]];
    block(PALE, 10.4, 1.6, 9.4, -0.6, TOP + 23.4, DZ + 0.4);
    jag.forEach(([x, h, d], i) => {
      const zz = DZ + ((i % 2) ? 1.2 : -1.4);
      block(PALE, 3.2 + (i % 3) * 0.8, h, d + 1.4, x, TOP + 24.8, zz);
      block('grey', 3.4 + (i % 3) * 0.8, 0.18, d + 1.6, x, TOP + 24.8 + h, zz);
    });
    // slumped shoulders of masonry
    block(GREY, 7.0, 8.0, 9.0, -13.5, TOP + 1.0, DZ - 9.0, { rx: 0.22, rz: -0.18 });
    block(GREY, 6.0, 5.0, 7.0, 13.5, TOP + 1.0, DZ + 6.0, { rz: 0.16 });
    // fallen blocks heaped around its foot
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * PI * 2;
      const r = 16.5 + (i % 5) * 2.0;
      block(i % 3 ? GREY : 'grey', 1.7 + (i % 3) * 0.9, 0.55 + (i % 4) * 0.5, 1.6,
        Math.cos(a) * r, TOP, DZ + Math.sin(a) * r * 0.85, { ry: a });
    }
    // dark recess between the two halls
    block('dark', 20, 8, 3.2, 0, TOP, -6.2);

    /* ---------- the natamandira: unroofed dance hall to the east ------- */
    (function nata(cz) {
      block('grey', 19, 0.8, 16, 0, 0, cz);
      block(GREY, 17.5, 2.8, 14.5, 0, 0.8, cz);
      block('stone', 18.5, 0.45, 15.5, 0, 3.6, cz);
      for (let i = -3; i <= 3; i++) {
        for (const s of [-1, 1]) {
          block(GREY, 1.3, 4.0, 1.3, i * 2.7, 4.05, cz + s * 5.6);
          block(PALE, 1.6, 0.36, 1.6, i * 2.7, 8.05, cz + s * 5.6);
        }
      }
      for (let i = -2; i <= 2; i++) {
        for (const s of [-1, 1]) {
          block(GREY, 1.3, 4.0, 1.3, s * 6.0, 4.05, cz + i * 2.8);
          block(PALE, 1.6, 0.36, 1.6, s * 6.0, 8.05, cz + i * 2.8);
        }
      }
      // stumps of the fallen roof
      [[-4.2, -2.4], [3.6, 1.8], [0.4, -3.8]].forEach(([x, z]) => {
        block('grey', 2.0, 1.2, 1.8, x, 8.4, cz + z, { ry: 0.3 });
      });
    })(60);

    /* ---------- seven rearing horses ----------------------------------
       Four to one hand and three to the other, as the ASI describes them.
       Built from ellipsoids and tapered cylinders so the barrel, the arched
       neck, the head, the jointed legs and the tail each read in profile. */
    function horse(x, z, s, ry) {
      const c = Math.cos(ry), n = Math.sin(ry);
      const P = (dx, dz) => [x + (dx * c + dz * n) * s, z + (-dx * n + dz * c) * s];
      const put = (k, geo, dx, dy, dz, o) => {
        const [px, pz] = P(dx, dz);
        add(k, geo, px, dy * s, pz, Object.assign({ ry }, o || {}));
      };
      const ell = (k, dx, dy, dz, a, b, cc, o) => {
        const [px, pz] = P(dx, dz);
        add(k, sph(1, 12), px, dy * s, pz, Object.assign({ ry, sx: a * s, sy: b * s, sz: cc * s }, o || {}));
      };
      const B = PALE, G = GREY;
      /* barrel, chest and rump: the body is carried at a slight angle, the
         horse rearing, so the chest rides higher than the quarters */
      ell(B, 0, 2.12, 0.05, 0.42, 0.50, 1.00, { rx: -0.20 });
      ell(B, 0, 2.34, 0.96, 0.40, 0.46, 0.44, { rx: -0.20 });
      ell(B, 0, 1.90, -0.84, 0.42, 0.48, 0.44);
      /* neck: a long slim shaft rising steeply from the withers */
      put(B, cyl(0.15, 0.34, 1.25, 10), 0, 2.98, 1.10, { rx: -0.50 });
      // mane: a thin ridge along the crest of the neck
      put(G, box(0.08, 0.09, 1.25), 0, 3.12, 0.94, { rx: -0.50 });
      /* head: a small wedge carried high, muzzle reaching forward */
      ell(B, 0, 3.62, 1.52, 0.14, 0.17, 0.34, { rx: -0.80 });
      ell(B, 0, 3.44, 1.78, 0.12, 0.13, 0.20, { rx: -0.80 });
      ell(G, 0, 3.36, 1.90, 0.10, 0.10, 0.09, { rx: -0.80 });   // muzzle
      put(G, cone(0.05, 0.17, 6), -0.09, 3.78, 1.40, { rx: -0.3, rz: -0.18 });
      put(G, cone(0.05, 0.17, 6), 0.09, 3.78, 1.40, { rx: -0.3, rz: 0.18 });
      /* hind legs, planted and jointed */
      for (const lx of [-0.33, 0.33]) {
        put(B, cyl(0.17, 0.22, 0.95, 8), lx, 1.42, -0.78, { rx: 0.12 });
        put(B, cyl(0.09, 0.14, 0.98, 8), lx, 0.50, -0.90);
        put(G, box(0.21, 0.16, 0.30), lx, 0.08, -0.94);
      }
      /* fore legs, raised and bent: the rearing attitude */
      for (const lx of [-0.30, 0.30]) {
        put(B, cyl(0.12, 0.17, 0.80, 8), lx, 2.02, 1.24, { rx: -1.15 });
        put(B, cyl(0.07, 0.10, 0.66, 8), lx, 1.68, 1.66, { rx: -0.30 });
        put(G, box(0.16, 0.13, 0.24), lx, 1.44, 1.82);
      }
      /* tail, streaming down from the dock */
      put(G, cyl(0.09, 0.19, 0.95, 8), 0, 1.55, -1.32, { rx: 0.55 });
      put(G, cyl(0.05, 0.10, 0.80, 8), 0, 0.78, -1.62, { rx: 0.25 });
      put(G, cone(0.13, 0.42, 7), 0, 0.34, -1.72, { rx: Math.PI });
      /* a saddle cloth over the back and a breast band */
      put(GREY, box(0.70, 0.05, 1.30), 0, 2.56, 0.0, { rx: -0.20 });
      put('grey', box(0.72, 0.09, 0.14), 0, 2.62, 1.14, { rx: -0.20 });
    }
    [[1.9, 0], [5.3, 1], [8.7, 0], [12.1, 1], [-2.1, 1], [-5.5, 0], [-8.9, 1]]
      .forEach(([x, k]) => horse(x, 44.5, 1.12, k ? 0.05 : -0.05));
    // the beam the team is yoked to
    add(GREY, box(27, 0.5, 0.55), 0, 3.1, 41.2);
    [-9.5, 9.5].forEach((x) => add(GREY, box(0.5, 2.6, 0.5), x, 1.4, 41.2));
    add('paving', plane(32, 12), 0, 0.14, 45.0, { rx: -PI / 2 });

    /* ---------- subsidiary shrine, ruined, to the south-west ----------- */
    (function shrine(cx, cz) {
      block('grey', 13, 0.8, 11, cx, 0, cz);
      block(GREY, 11.4, 5.2, 9.4, cx, 0.8, cz);
      block(PALE, 11.8, 0.4, 9.8, cx, 6.0, cz);
      add('dark', arch(2.6, 4.0, 0.4), cx, 0.8, cz + 4.8);
      add(PALE, archFrame(3.3, 4.6, 0.26, 0.3), cx, 0.8, cz + 4.9);
      block(GREY, 9.0, 1.9, 7.4, cx, 6.4, cz);
      block('grey', 7.0, 1.3, 5.6, cx, 8.3, cz);
      block(GREY, 4.6, 1.1, 3.8, cx, 9.6, cz);
      block('grey', 2.6, 0.8, 2.4, cx + 0.4, 10.7, cz - 0.3);
    })(-52, 20);

    /* ---------- boundary wall ------------------------------------------ */
    (function wall() {
      const W = 64, D = 78, H = 1.5;
      for (let i = -6; i <= 6; i++) {
        const z = i * 11;
        for (const s of [-1, 1]) {
          block('grey', 0.7, H, 10.4, s * W, 0, z);
          block('sand', 1.3, 0.18, 10.8, s * W, H, z);
        }
      }
      for (let i = -6; i <= 6; i++) {
        const x = i * 10.5;
        if (Math.abs(x) > W) continue;
        for (const s of [-1, 1]) {
          if (s === 1 && Math.abs(x) < 14) continue;          // gate opening east
          block('grey', 9.9, H, 0.7, x, 0, s * D);
          block('sand', 10.3, 0.18, 1.3, x, H, s * D);
        }
      }
      for (const s of [-1, 1]) {
        block(PALE, 1.6, 3.2, 1.6, s * 15, 0, D);
        add('grey', sph(0.85, 8), s * 15, 3.4, D);
      }
    })();

    /* ---------- palms, trees, lamps, visitors --------------------------- */
    const palms = [[-58, 46], [-64, 32], [-56, 16], [-66, -8], [-60, -32], [-52, -54],
      [58, 44], [66, 28], [60, 10], [68, -14], [56, -42], [72, -48], [-30, -60], [34, -60]];
    palms.forEach(([x, z], i) => ctx.tree(x, z, 1.15 + (i % 3) * 0.18, 'palm'));
    [[-40, 60], [40, 60], [-74, 64], [46, -24], [-44, -48], [28, 66]]
      .forEach(([x, z]) => ctx.tree(x, z, 1.0, 'round'));

    [[-15, 34], [15, 34], [-15, 52], [15, 52], [-34, 48], [34, 48], [-50, 64], [50, 64]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));

    const people = [[-6, 40, 'fabricSaffron'], [7, 39, 'fabricWhite'], [-11, 47, 'fabricRed'],
      [4, 50, 'fabricWhite'], [12, 45, 'fabricRed'], [-17, 50, 'fabricSaffron'],
      [19, 41, 'fabricWhite'], [-23, 40, 'fabricRed'], [0, 30, 'fabricWhite'],
      [-34, 38, 'fabricSaffron'], [34, 36, 'fabricWhite'], [25, 52, 'fabricRed'],
      [-3, 56, 'fabricWhite'], [15, 60, 'fabricSaffron'], [-26, 62, 'fabricWhite']];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 0.7, k, 1.0 + (i % 3) * 0.05));

    /* ---------- floodlights -------------------------------------------- */
    ctx.light({ pos: [-46, 26, 56], target: [0, 22, 4], color: 0xffcf9a, intensity: 1700, distance: 340 });
    ctx.light({ pos: [52, 26, 48], target: [0, 22, 4], color: 0xffd9b0, intensity: 1400, distance: 340 });
    ctx.light({ pos: [0, 14, 88], target: [0, 12, 30], color: 0xffc48a, intensity: 900, distance: 210 });
  }
};
