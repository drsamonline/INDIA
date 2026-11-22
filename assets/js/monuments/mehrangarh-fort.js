/* Mehrangarh — Jodhpur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'mehrangarh-fort',
  accent: '#c08a5a',
  accent2: '#e0b088',
  seed: 101,
  time: 16.2,
  bounds: 150,
  minDist: 40,
  maxDist: 480,
  home: { pos: [104, 92, 158], target: [0, 50, 0], fov: 40 },
  ground: { texture: 'sandGround', size: 2800, color: 0xc0a982, tile: 26 },
  views: [
    { name: 'Full', pos: [104, 92, 158], target: [0, 50, 0] },
    { name: 'Walls', pos: [-104, 62, 112], target: [0, 54, 0] },
    { name: 'Palaces', pos: [34, 92, 78], target: [0, 70, 0] },
    { name: 'The gate', pos: [64, 56, 96], target: [20, 52, 42] },
    { name: 'Blue city', pos: [126, 46, 168], target: [0, 8, 60] }
  ],
  tour: [
    {
      title: 'Fort of the Sun', deva: 'मेहरानगढ़',
      text: 'Rao Jodha founded Mehrangarh in 1459 on a rocky hill above the new city of Jodhpur. The name means fort of the sun, and the Rathore rulers held it, with interruptions, until independence.',
      pos: [86, 54, 132], target: [0, 40, 0], time: 16.2
    },
    {
      title: 'Thirty-Six Metres', deva: 'प्राचीर',
      text: 'The walls rise up to 36 metres above the rock and are up to 21 metres thick in places, with seven gates, each named for a battle or a victory.',
      pos: [-30, 46, 96], target: [-10, 42, 0], time: 11
    },
    {
      title: 'The Palaces', deva: 'महल',
      text: 'Inside are the Moti Mahal, the Phool Mahal with its gold ceiling, the Sheesh Mahal and the Takhat Vilas, set around courtyards with pierced screens and coloured glass.',
      pos: [26, 48, 56], target: [0, 44, 0], time: 9.6
    },
    {
      title: 'Scars on the Gate', deva: 'द्वार',
      text: 'The second gate still carries cannonball scars from a siege, and the sati gate the handprints of the widows who immolated themselves there.',
      pos: [4, 30, 60], target: [0, 34, 18], time: 17.2
    },
    {
      title: 'The Blue City', deva: 'नीला शहर',
      text: 'Below the walls the blue-washed houses of Jodhpur spread out to the desert. The fort is now a museum run by a trust, and one of the most visited in Rajasthan.',
      pos: [70, 26, 90], target: [0, 16, 40], time: 17.8
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit from below, the sandstone turns to amber and the city becomes a field of small lights.',
      pos: [80, 48, 120], target: [0, 40, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, chhatri, lathe, arcade } = ctx;
    const rng = ctx.rng;

    const rock = 'basalt', ledge = 'grey', boulder = 'basaltDark';
    const wall = 'sandstoneRed', stone2 = 'sandstoneBuff', trim = 'marble', white = 'plasterWhite';

    /* ==================================================================== *
     *  1. THE ROCK — a truncated cone, stratified, with a bouldered skirt
     * ==================================================================== */
    const BASE = 46;                 // plateau level: walls and palace stand here
    const RTOP = 52, RBOT = 82;
    const RR = (y) => RTOP + (RBOT - RTOP) * Math.pow(Math.max(0, 1 - y / BASE), 1.7);

    /* The rock is a truncated cone built as a stack of faceted drums. Each drum
       is turned a little against the one below and stands on a shelf that the
       drum above overhangs — that shelf is the stratum line, and because every
       drum has its own rotation the ledges never line up into a smooth cone. */
    const BANDS = 11;
    const ys = [0];
    for (let b = 1; b < BANDS; b++) ys.push(ys[b - 1] + (0.72 + rng() * 0.56));
    const k = BASE / ys[BANDS - 1];
    for (let b = 0; b < BANDS; b++) ys[b] *= k;
    ys.push(BASE);

    const lip = [], rot = [], seg = [], rB = [], rT = [];
    for (let b = 0; b < BANDS; b++) {
      lip[b] = 2.2 + rng() * 2.8;
      rot[b] = rng() * 1.3;
      seg[b] = 12 + (b % 4) * 2;
      rB[b] = RR(ys[b]) + lip[b];
      rT[b] = RR(ys[b + 1]) + 0.5;
    }
    for (let b = 0; b < BANDS; b++) {
      add(b % 2 === 1 ? boulder : rock, lathe([[rB[b], ys[b]], [rT[b], ys[b + 1]]], seg[b]), 0, 0, 0, { ry: rot[b] });
      if (b > 0) {                                    // the shelf the drum overhangs
        add(boulder, lathe([[rT[b - 1], ys[b]], [rB[b], ys[b] - 0.25]], seg[b]), 0, 0, 0, { ry: rot[b] });
        add(ledge, lathe([[rB[b] - 0.15, ys[b] - 0.25], [rB[b], ys[b] - 1.1]], seg[b]), 0, 0, 0, { ry: rot[b] });
      }
    }
    add(rock, lathe([[RR(BASE) + 0.5, BASE], [0.01, BASE]], 24), 0, 0, 0);

    // angular rubble at the foot of the hill
    for (let i = 0; i < 84; i++) {
      const a = rng() * Math.PI * 2, r = 56 + rng() * 22, s = 1.4 + rng() * 2.6;
      add(i % 3 === 0 ? boulder : rock, box(s, s * (0.6 + rng() * 0.6), s * (0.8 + rng() * 0.5)),
        Math.cos(a) * r, s * 0.35, Math.sin(a) * r,
        { ry: rng() * 3.1, rx: (rng() - 0.5) * 0.5, rz: (rng() - 0.5) * 0.5 });
    }
    // broken rock clinging to the face
    for (let i = 0; i < 64; i++) {
      const a = rng() * Math.PI * 2, y = 3 + rng() * 38, r = RR(y) + 0.4, s = 1.2 + rng() * 2.2;
      add(i % 2 ? boulder : rock, box(s, s * (0.7 + rng() * 0.7), s * (0.7 + rng() * 0.6)),
        Math.cos(a) * r, y, Math.sin(a) * r,
        { ry: a + rng(), rx: (rng() - 0.5) * 0.6, rz: (rng() - 0.5) * 0.6 });
    }

    /* ==================================================================== *
     *  2. THE RAMPARTS — continuous curtains, corrected rotation sign
     * ==================================================================== */
    const WH = 20;                   // wall height above the plateau
    const WTOP = BASE + WH;          // 66

    /* local +X runs along the wall, local +Z points OUTWARD.
       (the old module used ry = atan2(dz, dx), which mirrored every run) */
    function runInfo(a, b) {
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      let ry = Math.atan2(-dz, dx);
      let ox = Math.sin(ry), oz = Math.cos(ry);
      if (ox * mx + oz * mz < 0) { ry += Math.PI; ox = -ox; oz = -oz; }
      return { len, mx, mz, ry, ox, oz, ux: dx / len, uz: dz / len };
    }

    function curtain(a, b) {
      const g = runInfo(a, b);
      const { len, mx, mz, ry, ox, oz, ux, uz } = g;
      const L = len + 2.6;                       // overlap into the corner bastions
      const at = (d) => [mx + ox * d, mz + oz * d];
      let p;

      p = at(1.4);                               // battered lower body
      add(wall, box(L, 12.5, 10), p[0], BASE + 6.25, p[1], { ry });
      p = at(1.9);                               // projecting string course
      add(stone2, box(L, 1.1, 11.4), p[0], BASE + 13.05, p[1], { ry });
      p = at(0);                                 // upper body
      add(wall, box(L, 6.4, 7), p[0], BASE + 16.4, p[1], { ry });
      p = at(0.4);                               // cornice
      add(stone2, box(L, 0.8, 8.4), p[0], WTOP + 0.4, p[1], { ry });
      p = at(2.85);                              // full-length parapet
      add(wall, box(L, 1.6, 1.4), p[0], WTOP + 1.6, p[1], { ry });

      // merlons every ~2.4 m
      const n = Math.max(2, Math.round(len / 2.4));
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n - 0.5;
        add(wall, box(1.2, 1.5, 1.5), mx + ux * t * len + ox * 2.85, WTOP + 3.15,
          mz + uz * t * len + oz * 2.85, { ry });
      }
      // buttress ribs
      const nr = Math.max(1, Math.round(len / 7.5));
      for (let i = 0; i < nr; i++) {
        const t = (i + 0.5) / nr - 0.5;
        add(wall, box(1.5, WH - 1.8, 2.6), mx + ux * t * len + ox * 6.0, BASE + (WH - 1.8) / 2,
          mz + uz * t * len + oz * 6.0, { ry });
      }
    }

    function bastion(x, z, r, hh, cap) {
      add(wall, cyl(r + 1.0, r + 2.8, 8, 16), x, BASE + 4, z);
      add(wall, cyl(r + 0.2, r + 1.0, hh - 8, 16), x, BASE + 8 + (hh - 8) / 2, z);
      add(stone2, cyl(r + 1.6, r + 1.6, 1.1, 16), x, BASE + hh - 0.4, z);
      add(wall, cyl(r + 0.2, r + 1.1, 1.8, 16), x, BASE + hh + 1.1, z);
      const n = Math.max(8, Math.round(2 * Math.PI * r / 2.4));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        add(wall, box(1.2, 1.5, 1.3), x + Math.cos(a) * (r + 0.6), BASE + hh + 2.75,
          z + Math.sin(a) * (r + 0.6), { ry: Math.PI / 2 - a });
      }
      if (cap === 'chhatri') chhatri(x, BASE + hh + 2.0, z, 1.1, wall, trim);
      if (cap === 'dome') {
        add(stone2, cyl(r * 0.6, r * 0.7, 1.4, 12), x, BASE + hh + 2.7, z);
        add(trim, onion(r * 0.66, 3.4, 16), x, BASE + hh + 3.4, z);
        add('gold', sph(0.22, 8), x, BASE + hh + 6.9, z);
      }
    }

    // an irregular ring following the plateau edge
    const ring = [
      [30, 36], [7, 41], [-21, 37], [-39, 26], [-47, 5],
      [-44, -17], [-27, -34], [-3, -41], [22, -37], [39, -20], [46, -2], [42, 19]
    ];
    for (let i = 0; i < ring.length; i++) curtain(ring[i], ring[(i + 1) % ring.length]);

    const caps = ['chhatri', null, 'dome', null, 'chhatri', null, null, 'chhatri', null, 'dome', null, null];
    ring.forEach((v, i) => bastion(v[0], v[1], 4.8, WH, caps[i]));

    /* ---- the main gate (Jai Pol) on the south front ---------------------- */
    (function gate(a, b, t) {
      const g = runInfo(a, b);
      const gx = a[0] + (b[0] - a[0]) * t, gz = a[1] + (b[1] - a[1]) * t;
      const { ry, ox, oz, ux, uz } = g;
      const at = (d, off = 0) => [gx + ox * d + ux * off, gz + oz * d + uz * off];
      let p;

      p = at(5.0);
      block(wall, 16, 25, 16, p[0], BASE, p[1], { ry });
      p = at(13.1);
      add('dark', arch(5.6, 8.6, 0.6), p[0], BASE + 0.1, p[1], { ry });
      add(trim, archFrame(6.9, 9.9, 0.7, 0.8), p[0], BASE + 0.1, p[1], { ry });
      // a jharokha over the arch
      p = at(13.4);
      add(stone2, box(4.2, 3.4, 1.8), p[0], BASE + 13.0, p[1], { ry });
      add('dark', arch(2.0, 2.2, 0.2), p[0], BASE + 13.3, p[1], { ry });
      add(white, archFrame(2.4, 2.6, 0.18, 0.3), p[0], BASE + 13.3, p[1], { ry });
      add(white, box(4.8, 0.35, 2.3), p[0], BASE + 16.4, p[1], { ry });
      add(trim, dome(1.7, 1.4, 12), p[0], BASE + 16.7, p[1], { ry });
      p = at(5.0);
      add(stone2, box(19.2, 1.1, 17.2), p[0], BASE + 25.5, p[1], { ry });
      for (let i = -3; i <= 3; i++) {
        const q = at(12.4, i * 2.5);
        add(wall, box(1.3, 1.5, 1.4), q[0], BASE + 26.6, q[1], { ry });
      }
      // upper pavilion with a pair of chhatris
      p = at(3.4);
      block(stone2, 12, 7.5, 11, p[0], BASE + 26.1, p[1], { ry });
      add(trim, box(13, 0.7, 12), p[0], BASE + 34.0, p[1], { ry });
      [-1, 1].forEach((s) => {
        const q = at(3.4, s * 3.6);
        chhatri(q[0], BASE + 34.3, q[1], 0.9, stone2, trim);
      });
      // flanking round turrets
      [-1, 1].forEach((s) => {
        const q = at(10.0, s * 9.5);
        add(wall, cyl(3.2, 4.2, 29, 14), q[0], BASE + 14.5, q[1]);
        add(stone2, cyl(4.2, 4.2, 1.0, 14), q[0], BASE + 29.2, q[1]);
        for (let i = 0; i < 9; i++) {
          const a2 = (i / 9) * Math.PI * 2;
          add(wall, box(1.1, 1.4, 1.2), q[0] + Math.cos(a2) * 3.7, BASE + 30.4,
            q[1] + Math.sin(a2) * 3.7, { ry: Math.PI / 2 - a2 });
        }
        chhatri(q[0], BASE + 30.2, q[1], 0.95, wall, trim);
      });
      const f = at(7.0);
      ctx.flag(f[0], BASE + 34.6, f[1], 7, 'fabricSaffron');
    })(ring[0], ring[1], 0.5);

    /* ==================================================================== *
     *  3. THE PALACE — raised clear of the walls
     * ==================================================================== */
    // terrace / plinth
    block(rock, 64, 8, 44, 0, BASE, -4);
    add(trim, box(66, 0.9, 46), 0, BASE + 8.4, -4);
    arcade(trim, { count: 7, w: 2.6, h: 3.6, depth: 0.4, spacing: 8.2, x: 0, y: BASE + 1.8, z: 18.1 });

    // lower storey (54 → 70)
    block(stone2, 56, 16, 28, 0, 54, -4);
    add(white, box(57, 0.7, 29), 0, 62.0, -4);           // white plaster band
    add(trim, box(57.4, 0.7, 29.4), 0, 70.0, -4);         // cornice
    arcade(trim, { count: 12, w: 3.4, h: 6.8, depth: 0.5, spacing: 4.6, x: 0, y: 55.4, z: 10.1 });

    // upper storey (70 → 82)
    block(stone2, 50, 12, 24, 0, 70, -5);
    add(white, box(51, 0.7, 25), 0, 71.0, -5);
    add(trim, box(51.4, 0.8, 25.4), 0, 82.0, -5);
    arcade(trim, { count: 11, w: 2.8, h: 4.6, depth: 0.45, spacing: 4.5, x: 0, y: 72.2, z: 7.1 });
    add(white, box(49, 0.6, 23), 0, 76.4, -5);            // second plaster band

    // projecting jharokhas with domes
    for (let i = -2; i <= 2; i++) {
      const x = i * 9.8;
      block(stone2, 3.4, 4.4, 2.6, x, 76.2, 8.2);
      add('dark', arch(1.7, 2.5, 0.2), x, 77.2, 9.45);
      add(white, box(4.1, 0.35, 3.2), x, 80.7, 8.4);
      add(trim, box(4.4, 0.3, 3.5), x, 81.0, 8.4);
      add(trim, dome(1.7, 1.5, 12), x, 81.2, 8.4);
      add('gold', sph(0.2, 8), x, 82.9, 8.4);
    }

    // stepped parapet round the roof
    const RY = 83.2;
    add(stone2, box(51, 1.4, 1.1), 0, RY + 0.1, 6.6);
    add(stone2, box(51, 1.4, 1.1), 0, RY + 0.1, -16.6);
    add(stone2, box(1.1, 1.4, 24), -25, RY + 0.1, -5);
    add(stone2, box(1.1, 1.4, 24), 25, RY + 0.1, -5);
    for (let i = -10; i <= 10; i++) {
      add(stone2, box(1.1, 1.2, 1.1), i * 2.4, RY + 1.4, 6.6);
      add(stone2, box(1.1, 1.0, 1.1), i * 2.4, RY + 1.3, -16.6);
    }

    // roof pavilions
    for (const px of [-13, 13]) {
      add(stone2, box(8.0, 0.5, 8.0), px, RY + 0.2, -10);
      for (const [ax, az] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) {
        add(stone2, cyl(0.42, 0.46, 3.4, 8), px + ax, RY + 2.1, -10 + az);
      }
      add(stone2, box(7.6, 0.6, 7.6), px, RY + 4.1, -10);
      add(trim, dome(2.9, 2.2, 14), px, RY + 4.4, -10);
      add('gold', sph(0.22, 8), px, RY + 6.8, -10);
    }

    // a run of chhatris along the roof
    [-19, -6.5, 6.5, 19].forEach((x) => chhatri(x, RY + 0.1, 1.5, 1.05, stone2, trim));

    // domed corner towers, rising from the lower storey
    [-1, 1].forEach((s) => {
      block(stone2, 10, 34, 10, s * 26, 54, -4);
      add(white, box(10.6, 0.8, 10.6), s * 26, 78.0, -4);
      add(trim, box(11.4, 0.8, 11.4), s * 26, 88.0, -4);
      add(stone2, cyl(3.4, 3.8, 1.8, 12), s * 26, 89.5, -4);
      add(trim, onion(3.9, 5.2, 18), s * 26, 90.4, -4);
      add('gold', cyl(0.09, 0.09, 1.5, 6), s * 26, 96.0, -4);
      add('gold', sph(0.26, 8), s * 26, 97.0, -4);
      add('dark', arch(1.4, 2.4, 0.2), s * 26, 74.0, 1.2);
      add(white, box(2.4, 0.25, 0.5), s * 26, 76.6, 1.3);
    });

    /* ==================================================================== *
     *  4. THE BLUE CITY — houses ringing the hill
     * ==================================================================== */
    for (let i = 0; i < 300; i++) {
      const a = rng() * Math.PI * 2;
      const r = 96 + 170 * Math.pow(rng(), 0.7);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const w = 4.4 + rng() * 4.0, d = 4.4 + rng() * 3.6, h = 4 + rng() * 6;
      const isBlue = rng() < 0.7;
      const key = isBlue ? 'blue' : 'plasterWhite';
      const ry = rng() * 3.14;
      block(key, w, h, d, x, 0, z, { ry });
      add(isBlue ? 'blue' : 'cream', box(w + 0.4, 0.4, d + 0.4), x, h + 0.2, z, { ry });
      if (isBlue) add('cream', box(w + 0.5, 0.22, d + 0.5), x, h + 0.45, z, { ry });
      if (rng() < 0.25) add(key, box(w * 0.85, 1.0, 0.45), x, h + 0.4, z + d * 0.5, { ry });
      if (!isBlue && rng() < 0.14) add('plasterWhite', dome(1.9, 1.8, 10), x, h + 0.4, z);
    }
    // dense belts where the ring is actually seen from the home view
    for (let i = 0; i < 190; i++) {
      const a = (i % 3 === 0 ? -0.7 + rng() * 2.6 : 1.5 + rng() * 1.9);
      const r = 96 + rng() * 140;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const w = 4.6 + rng() * 4.2, d = 4.6 + rng() * 3.8, h = 4.5 + rng() * 6.5;
      const isB = rng() < 0.68;
      const key = isB ? 'blue' : 'plasterWhite';
      const ry = rng() * 3.14;
      block(key, w, h, d, x, 0, z, { ry });
      add(isB ? 'blue' : 'cream', box(w + 0.4, 0.4, d + 0.4), x, h + 0.2, z, { ry });
      if (isB) add('cream', box(w + 0.5, 0.22, d + 0.5), x, h + 0.45, z, { ry });
    }

    /* ==================================================================== *
     *  5. LIFE — people, trees, lamps
     * ==================================================================== */
    const people = [[52, 78], [58, 86], [44, 92], [64, 74], [38, 100], [72, 96], [30, 110],
      [80, 88], [54, 104], [68, 108], [42, 116], [24, 96], [86, 78], [36, 78]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.15, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 1.0));

    [[46, 86], [62, 82], [34, 102], [76, 92], [52, 110]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));

    const trees = [[-104, 74], [106, 70], [-72, 116], [78, 120], [-124, 14], [126, 10],
      [-34, 130], [26, 138], [96, 108], [-96, 100]];
    trees.forEach(([x, z], i) => ctx.tree(x, z, 1.3 + (i % 3) * 0.25, i % 4 === 0 ? 'palm' : 'round'));

    ctx.light({ pos: [-72, 54, 84], target: [0, 58, 0], color: 0xffd0a0, intensity: 5200, distance: 300 });
    ctx.light({ pos: [80, 56, 80], target: [0, 58, 0], color: 0xffc890, intensity: 4600, distance: 300 });
    ctx.light({ pos: [10, 30, 150], target: [0, 12, 50], color: 0xffbe86, intensity: 2200, distance: 260 });
  }
};
