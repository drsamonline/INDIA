/* Konark Sun Temple — Odisha · procedural miniature
   The chariot of Surya: a high plinth with 24 carved wheels, seven horses,
   the surviving jagamohana under its stepped roof, and the broken deul.
   CC BY-NC 4.0 */

export default {
  id: 'konark-sun-temple',
  accent: '#b8865a',
  accent2: '#dcae82',
  seed: 1250,
  time: 10.6,
  bounds: 105,
  minDist: 20,
  maxDist: 380,
  home: { pos: [90, 29, 100], target: [0, 13, 18], fov: 40 },
  ground: { texture: 'grass', size: 1700, color: 0x93a06e },
  views: [
    { name: 'Full', pos: [90, 29, 100], target: [0, 13, 18] },
    { name: 'Wheels', pos: [40, 5.5, 24], target: [26, 2.2, 4] },
    { name: 'Roof', pos: [36, 32, 46], target: [0, 22, 8] },
    { name: 'Horses', pos: [31, 11, 84], target: [-2, 4, 52] },
    { name: 'Deul', pos: [-50, 22, -54], target: [-2, 13, -20] }
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
    const PI = Math.PI;
    const arch = ctx.arch, archFrame = ctx.archFrame;

    /* ---------- plinth dimensions ---------- */
    const PX = 26;            // half width of the chariot platform
    const PZ = 39;            // half depth
    const TOP = 4.2;          // plinth top

    /* ---------- compound ground ---------- */
    add('paving', plane(116, 152), 0, 0.04, 4, { rx: -PI / 2 });
    add('sand', plane(240, 96), -156, 0.07, 26, { rx: -PI / 2 });
    add('sand', plane(150, 80), 96, 0.07, 104, { rx: -PI / 2 });
    add('foliage', plane(320, 240), 0, 0.05, -180, { rx: -PI / 2 });
    add('foliage', plane(170, 170), -140, 0.05, -50, { rx: -PI / 2 });

    /* ---------- the chariot platform ---------- */
    block('grey', 53.4, 0.9, 79.4, 0, 0, 0);              // socle
    block('granite', 52.0, 2.4, 78.0, 0, 0.9, 0);         // wall carrying the wheels
    block('grey', 52.6, 0.5, 78.6, 0, 1.5, 0);            // carved band
    block('granite', 52.4, 0.8, 78.4, 0, 2.8, 0);
    block('stone', 53.6, 0.6, 79.6, 0, 3.6, 0);            // projecting cornice
    add('stone', plane(51.2, 77.2), 0, TOP + 0.02, 0, { rx: -PI / 2 });
    block('granite', 52.4, 0.24, 78.4, 0, TOP, 0);

    /* ---------- 24 wheels, twelve to a flank ---------- */
    function wheel(cx, cy, cz, side) {
      const x = cx * side;
      const R = 1.72;
      add('cream', torus(R, 0.21, 6, 22), x, cy, cz, { ry: PI / 2 });
      add('granite', torus(R * 0.80, 0.10, 5, 18), x, cy, cz, { ry: PI / 2 });
      add('cream', cyl(0.44, 0.44, 0.62, 10), x, cy, cz, { rz: PI / 2 });
      add('grey', cyl(0.23, 0.23, 0.76, 8), x, cy, cz, { rz: PI / 2 });
      for (let i = 0; i < 8; i++) {
        add('cream', box(0.20, R * 1.52, 0.14), x, cy, cz, { rx: (i * PI) / 8 });
      }
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * PI * 2;
        add('grey', box(0.32, 0.30, 0.44),
          x, cy + Math.cos(a) * R, cz + Math.sin(a) * R, { rx: a });
      }
    }
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 12; i++) wheel(26.3, 2.05, -33 + i * 6, side);
      // pilasters between the wheels
      for (let i = 0; i < 13; i++) block('grey', 0.4, 2.6, 0.9, 26.05 * side, 0.7, -36 + i * 6);
    }
    // carved panels on the front and back faces of the plinth
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 9; i++) {
        add('grey', box(1.5, 1.5, 0.24), -22 + i * 5.5, 2.3, 39.1 * side);
        add('sandstoneBuff', box(1.9, 0.28, 0.3), -22 + i * 5.5, 3.15, 39.15 * side);
      }
    }

    /* ---------- processional stair on the east (+Z) ---------- */
    ctx.stairs(0, 0, 41.0, 19, TOP, 9, 0.95, 'granite');
    for (const s of [-1, 1]) {
      // battered flank walls
      block('granite', 3.0, 0.55, 10.4, s * 10.6, 0, 42.4, { rx: -0.42 });
      block('granite', 3.0, TOP, 1.3, s * 10.6, 0, 37.9);
      block('sandstoneBuff', 3.3, 0.5, 1.6, s * 10.6, TOP, 37.9);
      for (let i = 0; i < 4; i++) {
        block('grey', 2.4, 0.55, 0.55, s * 10.6, 1.0 + i * 0.8, 38.6);
      }
      // stone post at the foot of the stair
      block('granite', 1.1, 2.6, 1.1, s * 13.6, 0, 48.0);
      block('grey', 1.4, 0.3, 1.4, s * 13.6, 2.6, 48.0);
      add('granite', sph(0.45, 8), s * 13.6, 3.1, 48.0);
    }
    add('paving', plane(24, 12), 0, 0.12, 46.5, { rx: -PI / 2 });

    /* ---------- jagamohana: the assembly hall ---------- */
    const JZ = 8, JW = 26;
    block('sandstoneBuff', 28.6, 0.7, 28.6, 0, TOP, JZ);
    block('granite', 28.0, 0.6, 28.0, 0, TOP + 0.7, JZ);
    const BY = TOP + 1.3;                       // 5.5
    const BH = 9.6;                             // bada height
    block('granite', JW, BH, JW, 0, BY, JZ);
    // horizontal mouldings
    [[0.9, 'grey'], [1.5, 'stone'], [2.4, 'grey'], [7.0, 'stone'],
      [7.9, 'grey'], [8.9, 'stone']].forEach(([h, k]) => {
      block(k, JW + 0.55, 0.34, JW + 0.55, 0, BY + h, JZ);
    });
    // vertical relief panels on all four faces
    for (let f = 0; f < 4; f++) {
      const a = (f * PI) / 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      for (let i = 0; i < 9; i++) {
        const t = -11 + i * 2.75;
        const px = t * cs + (JW / 2 + 0.22) * sn, pz = JZ - t * sn + (JW / 2 + 0.22) * cs;
        if (f === 0 && Math.abs(t) < 3.4) continue;        // doorway
        add('grey', box(1.6, 5.2, 0.34), px, BY + 4.9, pz, { ry: a });
        add('stone', box(1.85, 0.45, 0.42), px, BY + 7.6, pz, { ry: a });
        add('stone', box(1.85, 0.35, 0.42), px, BY + 2.2, pz, { ry: a });
      }
    }
    // the great doorway
    add('dark', arch(5.0, 6.6, 0.6), 0, BY, JZ + JW / 2 - 0.1);
    add('sandstoneBuff', archFrame(6.0, 7.4, 0.45, 0.5), 0, BY, JZ + JW / 2 + 0.05);
    add('grey', archFrame(7.0, 8.2, 0.32, 0.35), 0, BY, JZ + JW / 2 + 0.02);
    for (const s of [-1, 1]) {
      add('dark', arch(2.3, 3.8, 0.4), s * 8.8, BY + 0.9, JZ + JW / 2 - 0.1);
      add('sandstoneBuff', archFrame(3.0, 4.4, 0.26, 0.3), s * 8.8, BY + 0.9, JZ + JW / 2 + 0.05);
    }

    /* ---------- roof: stepped pidha tiers ----------
       Each tier is a recessed drum closed by a projecting potika cornice, so
       the pyramid reads as a stack of ledges rather than a smooth cone. */
    let ry = BY + BH;                            // 15.1
    const tiers = 7;
    for (let i = 0; i < tiers; i++) {
      const w = 29.0 - i * 2.95;
      const h = 1.6;
      block('granite', w, h - 0.44, w, 0, ry, JZ);                       // drum
      block('grey', w + 0.16, 0.12, w + 0.16, 0, ry + 0.02, JZ);         // shadow line
      block('stone', w + 1.05, 0.44, w + 1.05, 0, ry + h - 0.44, JZ);    // potika cornice
      block('grey', w + 1.12, 0.1, w + 1.12, 0, ry + h - 0.52, JZ);      // under-cut
      // small carved blocks around each tier face
      const n = 3 + i;
      for (let k = 0; k < n; k++) {
        const t2 = -w / 2 + 1.0 + k * ((w - 2.0) / Math.max(1, n - 1));
        const yy = ry + (h - 0.44) * 0.5;
        add('grey', box(0.5, (h - 0.44) * 0.5, 0.2), t2, yy, JZ + w / 2 + 0.14);
        add('grey', box(0.5, (h - 0.44) * 0.5, 0.2), t2, yy, JZ - w / 2 - 0.14);
        add('grey', box(0.2, (h - 0.44) * 0.5, 0.5), JZ + w / 2 + 0.14, yy, t2);
        add('grey', box(0.2, (h - 0.44) * 0.5, 0.5), JZ - w / 2 - 0.14, yy, t2);
      }
      ry += h;
    }
    // amalaka, beki and kalasha
    add('granite', cyl(4.5, 5.2, 0.6, 16), 0, ry + 0.3, JZ);
    add('sandstoneBuff', cyl(4.25, 4.5, 1.35, 20), 0, ry + 1.3, JZ);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * PI * 2;
      add('grey', box(0.42, 1.25, 0.28), Math.cos(a) * 4.4, ry + 1.3, JZ + Math.sin(a) * 4.4, { ry: -a });
    }
    add('sandstoneBuff', cyl(3.0, 3.4, 0.45, 16), 0, ry + 2.2, JZ);
    add('granite', cyl(2.0, 2.4, 0.7, 14), 0, ry + 2.75, JZ);
    // the kalasha: a pot, a flared mouth and a spike
    add('sandstoneBuff', ctx.lathe([[0.06, 0], [0.55, 0.12], [1.15, 0.55], [1.4, 1.05],
      [1.22, 1.65], [0.78, 2.05], [0.58, 2.3], [0.74, 2.6], [0.46, 2.95], [0.16, 3.35],
      [0.06, 3.7]], 16), 0, ry + 3.45, JZ);
    add('gold', cone(0.26, 0.9, 8), 0, ry + 7.4, JZ);

    /* ---------- the broken deul behind: a rough, collapsed mass ---------- */
    const DZ = -21;
    block('grey', 27.2, 1.0, 27.2, 0, TOP, DZ);
    block('granite', 26.0, 5.6, 26.0, 0, TOP + 1.0, DZ);
    block('grey', 26.4, 0.35, 26.4, 0, TOP + 4.0, DZ);
    block('grey', 26.4, 0.35, 26.4, 0, TOP + 5.6, DZ);
    // offset upper masses, each smaller and shifted, as if fallen in on itself
    block('granite', 22.0, 4.6, 21.0, -0.8, TOP + 6.6, DZ + 0.6);
    block('granite', 15.5, 4.0, 14.5, 1.4, TOP + 11.2, DZ - 1.2);
    block('granite', 9.5, 2.6, 8.5, -1.2, TOP + 15.2, DZ + 1.0);
    // masonry courses, shallow and irregular
    for (let i = 0; i < 9; i++) {
      const y = TOP + 1.6 + i * 1.9;
      const w = y < TOP + 7 ? 26.3 : (y < TOP + 12 ? 22.2 : 15.7);
      const cz = y < TOP + 7 ? DZ : (y < TOP + 12 ? DZ + 0.6 : DZ - 1.2);
      block('grey', w, 0.22, w * 0.96, 0, y, cz);
    }
    // carved reliefs on the lower courses
    for (let i = 0; i < 6; i++) {
      const t2 = -10 + i * 4;
      add('grey', box(1.6, 2.2, 0.3), t2, TOP + 3.2, DZ + 13.1);
      add('grey', box(1.6, 2.2, 0.3), t2, TOP + 3.2, DZ - 13.1);
    }
    // jagged broken crown
    const jag = [[-4.6, 3.6, 1.8], [-1.8, 2.2, 2.6], [1.0, 4.6, 1.3], [3.2, 2.8, 2.2],
      [5.0, 1.6, 3.0], [-3.2, 2.4, 2.8], [2.4, 1.4, 3.4], [0.2, 5.4, 1.1]];
    jag.forEach(([x, h, d], i) => {
      const zz = DZ + ((i % 2) ? 1.6 : -1.8);
      block('granite', 3.2 + (i % 3) * 0.8, h, d + 2.0, x, TOP + 17.6, zz);
      block('grey', 3.4 + (i % 3) * 0.8, 0.18, d + 2.2, x, TOP + 17.6 + h, zz);
    });
    // a slumped shoulder of masonry on the north-west
    block('granite', 7.0, 8.0, 9.0, -12.0, TOP + 1.0, DZ - 8.0, { rx: 0.22, rz: -0.18 });
    block('granite', 6.0, 5.0, 7.0, 12.5, TOP + 1.0, DZ + 6.0, { rz: 0.16 });
    // fallen blocks heaped around its foot
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * PI * 2;
      const r = 15.0 + (i % 5) * 2.0;
      block(i % 3 ? 'granite' : 'grey', 1.7 + (i % 3) * 0.9, 0.55 + (i % 4) * 0.5, 1.6,
        Math.cos(a) * r, TOP, DZ + Math.sin(a) * r * 0.85, { ry: a });
    }
    // dark recess between the two halls
    block('dark', 20, 8, 3.4, 0, TOP, -6.4);

    /* ---------- seven horses ----------
       Built from tapered cylinders and ellipsoids rather than boxes, so the
       barrel, the arched neck, the head, four jointed legs and the tail each
       read in profile even from the far end of the enclosure. */
    function horse(x, z, s, ry) {
      const c = Math.cos(ry), n = Math.sin(ry);
      const P = (dx, dz) => [x + (dx * c + dz * n) * s, z + (-dx * n + dz * c) * s];
      const put = (k, geo, dx, dy, dz, o) => {
        const [px, pz] = P(dx, dz);
        add(k, geo, px, dy * s, pz, Object.assign({ ry }, o || {}));
      };
      const ell = (k, dx, dy, dz, a, b, cc, o) => {
        const [px, pz] = P(dx, dz);
        add(k, sph(1, 14), px, dy * s, pz, Object.assign({ ry, sx: a * s, sy: b * s, sz: cc * s }, o || {}));
      };
      const BODY = 'sandstoneBuff';
      // barrel, chest and rump
      ell(BODY, 0, 2.02, 0, 0.60, 0.66, 1.20);
      ell(BODY, 0, 1.94, 0.94, 0.56, 0.60, 0.50);
      ell(BODY, 0, 2.06, -0.92, 0.58, 0.62, 0.56);
      // neck: a tapered shaft from the withers up and forward, thin at the head
      put(BODY, cyl(0.23, 0.47, 1.55, 10), 0, 2.88, 1.06, { rx: -0.74 });
      // mane along the crest
      put('grey', box(0.12, 1.4, 0.2), 0, 2.98, 0.86, { rx: -0.74 });
      // cheek, then a head long and narrow, carried forward and down
      ell(BODY, 0, 3.42, 1.62, 0.23, 0.24, 0.22, { rx: -0.4 });
      ell(BODY, 0, 3.5, 1.9, 0.165, 0.215, 0.46, { rx: -0.78 });
      ell(BODY, 0, 3.28, 2.2, 0.135, 0.17, 0.24, { rx: -0.78 });
      ell('grey', 0, 3.22, 2.32, 0.13, 0.14, 0.10, { rx: -0.78 });   // muzzle
      // ears
      put('grey', cone(0.09, 0.32, 6), -0.14, 3.78, 1.6, { rx: -0.45, rz: -0.14 });
      put('grey', cone(0.09, 0.32, 6), 0.14, 3.78, 1.6, { rx: -0.45, rz: 0.14 });
      // four jointed legs: upper, lower, hoof
      const legs = [[-0.38, 0.80, 0], [0.38, 0.80, 0], [-0.38, -0.88, 0.16], [0.38, -0.88, 0.16]];
      legs.forEach(([lx, lz, tilt]) => {
        put(BODY, cyl(0.14, 0.22, 0.92, 8), lx, 1.56, lz, { rx: tilt });
        put(BODY, cyl(0.08, 0.13, 0.92, 8), lx, 0.6, lz - tilt * 0.35);
        put('grey', box(0.24, 0.16, 0.32), lx, 0.08, lz - tilt * 0.5);
      });
      // tail, falling from the dock
      put('grey', cyl(0.09, 0.19, 0.85, 8), 0, 2.4, -1.34, { rx: 0.5 });
      put('grey', cyl(0.05, 0.10, 0.8, 8), 0, 1.7, -1.62, { rx: 0.28 });
      put('grey', cone(0.15, 0.5, 7), 0, 1.22, -1.74, { rx: Math.PI });
      // a cloth over the back, kept flat so it does not read as a box
      put('granite', box(0.86, 0.07, 1.7), 0, 2.62, -0.05);
      // breast band
      put('grey', box(0.9, 0.12, 0.18), 0, 2.28, 1.14);
    }
    for (let i = 0; i < 7; i++) horse(-11.4 + i * 3.8, 52.4, 1.08, (i % 2 ? 0.04 : -0.04));
    // the beam the team is yoked to
    add('granite', box(27, 0.5, 0.6), 0, 3.0, 48.9);
    [-9.5, 9.5].forEach((x) => add('granite', box(0.5, 2.6, 0.5), x, 1.4, 48.9));
    add('paving', plane(34, 15), 0, 0.14, 52.0, { rx: -PI / 2 });

    /* ---------- subsidiary shrine, ruined, to the south-west ---------- */
    (function shrine(cx, cz) {
      block('grey', 13, 0.8, 11, cx, 0, cz);
      block('granite', 11.4, 5.2, 9.4, cx, 0.8, cz);
      block('sandstoneBuff', 11.8, 0.4, 9.8, cx, 6.0, cz);
      add('dark', arch(2.6, 4.0, 0.4), cx, 0.8, cz + 4.8);
      add('sandstoneBuff', archFrame(3.3, 4.6, 0.26, 0.3), cx, 0.8, cz + 4.9);
      block('granite', 9.0, 1.9, 7.4, cx, 6.4, cz);
      block('grey', 7.0, 1.3, 5.6, cx, 8.3, cz);
      block('granite', 4.6, 1.1, 3.8, cx, 9.6, cz);
      block('grey', 2.6, 0.8, 2.4, cx + 0.4, 10.7, cz - 0.3);
    })(-46, 22);

    /* ---------- boundary wall ---------- */
    (function wall() {
      const W = 62, D = 74, H = 1.5;
      for (let i = -6; i <= 6; i++) {
        const z = i * 10;
        for (const s of [-1, 1]) {
          block('grey', 0.7, H, 9.4, s * W, 0, z);
          block('sand', 1.3, 0.18, 9.8, s * W, H, z);
        }
      }
      for (let i = -6; i <= 6; i++) {
        const x = i * 10;
        if (Math.abs(x) > W) continue;
        for (const s of [-1, 1]) {
          if (s === 1 && Math.abs(x) < 12) continue;      // gate opening east
          block('grey', 9.4, H, 0.7, x, 0, s * D);
          block('sand', 9.8, 0.18, 1.3, x, H, s * D);
        }
      }
      for (const s of [-1, 1]) {
        block('sandstoneBuff', 1.6, 3.2, 1.6, s * 13, 0, D);
        add('grey', sph(0.85, 8), s * 13, 3.4, D);
      }
    })();

    /* ---------- palms, trees, lamps, visitors ---------- */
    const palms = [[-58, 44], [-64, 30], [-56, 14], [-66, -8], [-60, -30], [-52, -52],
      [58, 42], [66, 26], [60, 8], [68, -14], [56, -40], [72, -46], [-30, -58], [34, -58]];
    palms.forEach(([x, z], i) => ctx.tree(x, z, 1.15 + (i % 3) * 0.18, 'palm'));
    [[-40, 58], [40, 58], [-72, 62], [46, -22], [-44, -46], [28, 64]]
      .forEach(([x, z]) => ctx.tree(x, z, 1.0, 'round'));

    [[-15, 36], [15, 36], [-15, 60], [15, 60], [-32, 48], [32, 48], [-48, 62], [48, 62]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));

    const people = [[-6, 45, 'fabricSaffron'], [7, 44, 'fabricWhite'], [-11, 52, 'fabricRed'],
      [4, 57, 'fabricWhite'], [12, 50, 'fabricRed'], [-17, 56, 'fabricSaffron'],
      [19, 46, 'fabricWhite'], [-23, 44, 'fabricRed'], [0, 32, 'fabricWhite'],
      [-34, 38, 'fabricSaffron'], [34, 36, 'fabricWhite'], [25, 58, 'fabricRed'],
      [-3, 62, 'fabricWhite'], [15, 66, 'fabricSaffron']];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 0.7, k, 1.0 + (i % 3) * 0.05));

    /* ---------- floodlights ---------- */
    ctx.light({ pos: [-46, 26, 54], target: [0, 20, 4], color: 0xffcf9a, intensity: 2600, distance: 330 });
    ctx.light({ pos: [52, 26, 46], target: [0, 20, 4], color: 0xffd9b0, intensity: 2200, distance: 330 });
    ctx.light({ pos: [0, 14, 88], target: [0, 12, 30], color: 0xffc48a, intensity: 1600, distance: 210 });
  }
};
