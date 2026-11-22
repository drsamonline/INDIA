/* Golden Temple (Harmandir Sahib) — Amritsar · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'golden-temple',
  accent: '#e0b64a',
  accent2: '#ffe08a',
  seed: 47,
  bounds: 80,
  minDist: 16,
  maxDist: 240,
  time: 16.8,
  home: { pos: [-26, 16, 46], target: [2, 11, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xd8cdb8 },
  groundY: -0.85,
  water: { y: -0.62, size: 66, color: 0x1f5560, distortion: 1.8 },
  views: [
    { name: 'Full', pos: [-26, 16, 46], target: [2, 11, 0] },
    { name: 'Causeway', pos: [-34, 9, 26], target: [0, 9, 0] },
    { name: 'Dome', pos: [16, 26, 30], target: [0, 20, 0] },
    { name: 'Tank', pos: [30, 12, 44], target: [0, 6, 0] },
    { name: 'Akal Takht', pos: [-6, 16, -34], target: [-14, 12, -14] }
  ],
  tour: [
    {
      title: 'Harmandir Sahib', deva: 'हरमंदिर साहिब',
      text: 'Guru Ram Das founded Amritsar and began the sacred pool, the Amrit Sarovar, in 1577. His son Guru Arjan completed the Harmandir Sahib at its centre in 1604, set lower than the ground around it so that visitors step down into it.',
      pos: [-26, 16, 46], target: [2, 11, 0], time: 16.8
    },
    {
      title: 'Four Doors', deva: 'चार द्वार',
      text: 'Four doors face four directions, open to every faith and every caste. The causeway from the west is the way in, and pilgrims walk it barefoot with their heads covered.',
      pos: [-34, 9, 26], target: [0, 9, 0], time: 12
    },
    {
      title: 'Gold Leaf', deva: 'सोना',
      text: 'In 1830 Maharaja Ranjit Singh had the upper storeys covered in gold leaf, which gave the building its English name. The gurdwara sits on an island reached by the causeway, its reflection held in the tank.',
      pos: [16, 26, 30], target: [0, 20, 0], time: 9.8
    },
    {
      title: 'The Amrit Sarovar', deva: 'अमृत सरोवर',
      text: 'The tank is the heart of the complex. A marble walkway, the parikrama, runs right round it between arcades and balustrades, and pilgrims circle as they recite.',
      pos: [30, 12, 44], target: [0, 6, 0], time: 16.2
    },
    {
      title: 'Akal Takht', deva: 'अकाल तख़्त',
      text: 'The Akal Takht faces the shrine across the water: seat of Sikh temporal authority and one of the five takhts. The complex also holds a clock tower, a museum and the langar, a kitchen that feeds every visitor free of charge.',
      pos: [-6, 16, -34], target: [-14, 12, -14], time: 17.4
    },
    {
      title: 'A Hundred and Fifty Thousand', deva: 'संगत',
      text: 'Around 150,000 people come each day, one of the largest daily gatherings at any religious site in the world. The gurdwara is on UNESCO\'s tentative list.',
      pos: [-30, 12, 50], target: [0, 10, 0], time: 17.9
    },
    {
      title: 'The Temple at Night', deva: 'रात्रि',
      text: 'After dark the floodlight takes the gold and the shrine seems to float on the black water, while the parikrama stays busy through the night.',
      pos: [-34, 18, 56], target: [0, 12, 0], time: 21.4
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, onion, arch, archFrame, block, col } = ctx;

    const TANK = 66;          // outer size of the tank
    const ISLE = 21;          // island under the shrine
    const WATER_Y = -0.62;

    /* ---- the marble platform with a square hole for the tank ----------- */
    const PLAT = 132;
    // four slabs around the tank
    add('marble', box(PLAT, 0.9, (PLAT - TANK) / 2), 0, -0.45, (TANK + PLAT) / 4);
    add('marble', box(PLAT, 0.9, (PLAT - TANK) / 2), 0, -0.45, -(TANK + PLAT) / 4);
    add('marble', box((PLAT - TANK) / 2, 0.9, TANK), (TANK + PLAT) / 4, -0.45, 0);
    add('marble', box((PLAT - TANK) / 2, 0.9, TANK), -(TANK + PLAT) / 4, -0.45, 0);

    /* ---- tank coping and ghats ----------------------------------------- */
    const h = TANK / 2;
    [-1, 1].forEach((s) => {
      add('marble', box(TANK + 3.0, 1.5, 1.6), 0, 0.75, s * (h + 0.4));
      add('marble', box(1.6, 1.5, TANK + 3.0), s * (h + 0.4), 0.75, 0);
      add('marble', box(TANK + 3.4, 0.2, 2.0), 0, 1.55, s * (h + 0.4));
      add('marble', box(2.0, 0.2, TANK + 3.4), s * (h + 0.4), 1.55, 0);
    });
    // balustrade round the tank
    for (let i = 0; i < 44; i++) {
      const t = (i / 44) * 4;
      const side = Math.floor(t), f = t - side;
      const p = [[-h - 1.2 + f * (TANK + 2.4), -h - 1.2], [h + 1.2, -h - 1.2 + f * (TANK + 2.4)],
        [h + 1.2 - f * (TANK + 2.4), h + 1.2], [-h - 1.2, h + 1.2 - f * (TANK + 2.4)]][side];
      add('marble', cyl(0.18, 0.22, 0.9, 6), p[0], 1.95, p[1]);
    }

    /* ---- the island and the shrine -------------------------------------- */
    add('marble', box(ISLE, 1.6, ISLE), 0, -0.4, 0);
    add('marble', box(ISLE + 1.2, 0.3, ISLE + 1.2), 0, 0.4, 0);

    const baseY = 0.55;
    // lower storey: white marble with gold-framed arches
    block('marbleWarm', 15.5, 4.6, 15.5, 0, baseY, 0);
    add('gold', box(15.9, 0.3, 15.9), 0, baseY + 4.6, 0);
    [[0, 7.8, 0], [0, -7.8, Math.PI], [7.8, 0, Math.PI / 2], [-7.8, 0, -Math.PI / 2]].forEach(([x, z, ry]) => {
      for (let k = -1; k <= 1; k++) {
        const off = k * 4.4;
        const px = x + Math.cos(ry) * off, pz = z - Math.sin(ry) * off;
        add('dark', arch(2.2, 3.2, 0.2), px, baseY + 0.3, pz, { ry });
        add('gold', archFrame(2.6, 3.5, 0.2, 0.24), px, baseY + 0.3, pz + (ry === 0 ? 0.06 : 0), { ry });
      }
    });
    // upper storey in gold
    block('gold', 13.0, 3.8, 13.0, 0, baseY + 4.9, 0);
    add('goldLeaf', box(13.5, 0.35, 13.5), 0, baseY + 8.7, 0);
    [[0, 6.55, 0], [0, -6.55, Math.PI], [6.55, 0, Math.PI / 2], [-6.55, 0, -Math.PI / 2]].forEach(([x, z, ry]) => {
      for (let k = -1; k <= 1; k++) {
        const off = k * 3.6;
        const px = x + Math.cos(ry) * off, pz = z - Math.sin(ry) * off;
        add('dark', arch(1.8, 2.6, 0.18), px, baseY + 5.1, pz, { ry });
        add('goldLeaf', archFrame(2.1, 2.9, 0.16, 0.2), px, baseY + 5.1, pz + (ry === 0 ? 0.05 : 0), { ry });
      }
    });
    // projecting eaves with brackets
    add('gold', box(15.0, 0.3, 15.0), 0, baseY + 8.9, 0);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      add('gold', box(0.4, 0.5, 1.0), Math.cos(a) * 7.4, baseY + 8.5, Math.sin(a) * 7.4, { ry: -a });
    }

    /* ---- drum, dome, cupola ---------------------------------------------- */
    const drumY = baseY + 9.1;
    add('gold', cyl(6.2, 6.6, 1.6, 24), 0, drumY + 0.8, 0);
    add('goldLeaf', cyl(6.8, 6.4, 0.4, 24), 0, drumY + 1.7, 0);
    add('gold', onion(6.4, 9.0, 30), 0, drumY + 1.9, 0);
    add('goldLeaf', cyl(1.1, 1.3, 1.4, 14), 0, drumY + 10.6, 0);
    add('gold', onion(1.5, 2.4, 20), 0, drumY + 11.2, 0);
    add('gold', cyl(0.12, 0.12, 2.2, 8), 0, drumY + 13.4, 0);
    add('goldLeaf', sph(0.3, 10), 0, drumY + 14.6, 0);
    // four corner chhatris on the roof deck
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = dx * 5.0, z = dz * 5.0;
      add('gold', cyl(1.0, 1.1, 1.2, 10), x, baseY + 9.6, z);
      add('gold', onion(1.15, 1.9, 16), x, baseY + 10.2, z);
      add('gold', sph(0.14, 8), x, baseY + 12.2, z);
    }

    /* ---- causeway from the west ------------------------------------------ */
    add('marble', box(9.0, 0.55, h - ISLE / 2), -(h + ISLE / 2) / 2, 0.35, 0);
    add('gold', box(0.18, 0.9, h - ISLE / 2), -3.6, 1.2, 0);
    add('gold', box(0.18, 0.9, h - ISLE / 2), 3.6, 1.2, 0);
    for (let i = 0; i < 8; i++) {
      const z = -(h - ISLE / 2) / 2 + i * ((h - ISLE / 2) / 8);
      add('gold', cyl(0.12, 0.14, 1.1, 6), -3.6, 1.2, z);
      add('gold', cyl(0.12, 0.14, 1.1, 6), 3.6, 1.2, z);
    }
    // gateway at the west end
    block('marbleWarm', 11, 7.4, 6, -(h + 1.6), 0.35, 0);
    add('gold', arch(4.4, 5.6, 0.3), -(h + 1.6), 0.5, 0, { ry: Math.PI / 2 });
    add('goldLeaf', dome(2.4, 2.2, 18), -(h + 1.6), 7.75, 0);
    add('gold', cyl(0.1, 0.1, 1.4, 6), -(h + 1.6), 10.0, 0);

    /* ---- parikrama: arcades round the tank -------------------------------- */
    // inner colonnade ring
    add('marbleWarm', ctx.lathe([[45.6, 0.5], [48.4, 0.5], [48.4, 5.6], [45.6, 5.6]], 64), 0, 0, 0);
    add('marble', ctx.lathe([[45.2, 5.6], [48.8, 5.6], [48.8, 6.0], [45.2, 6.0]], 64), 0, 0, 0);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      add('dark', arch(2.4, 3.8, 0.3), Math.cos(a) * 45.5, 1.1, Math.sin(a) * 45.5, { ry: -a });
      add('marble', archFrame(2.8, 4.2, 0.2, 0.24), Math.cos(a) * 45.4, 1.1, Math.sin(a) * 45.4, { ry: -a });
    }
    // outer wall ring
    add('marbleWarm', ctx.lathe([[57.4, 0], [58.8, 0], [58.8, 7.0], [57.4, 7.0]], 64), 0, 0, 0);
    add('marble', ctx.lathe([[57.2, 7.0], [59.0, 7.0], [59.0, 7.5], [57.2, 7.5]], 64), 0, 0, 0);
    for (let i = 0; i < 44; i++) {
      const a = (i / 44) * Math.PI * 2;
      add('dark', arch(1.6, 2.8, 0.2), Math.cos(a) * 57.3, 0.6, Math.sin(a) * 57.3, { ry: -a });
    }

    /* ---- Akal Takht, opposite the shrine ---------------------------------- */
    (function akal(x, z) {
      block('marbleWarm', 16, 8, 12, x, 0.5, z);
      add('marble', box(17, 0.4, 13), x, 8.5, z);
      for (let i = -2; i <= 2; i++) {
        add('dark', arch(2.0, 3.0, 0.2), x + i * 3.0, 0.9, z + 6.1);
        add('marble', archFrame(2.3, 3.3, 0.16, 0.2), x + i * 3.0, 0.9, z + 6.15);
      }
      add('gold', cyl(3.4, 3.8, 1.6, 18), x, 9.5, z);
      add('gold', onion(3.6, 5.4, 24), x, 10.3, z);
      add('gold', sph(0.22, 8), x, 16.2, z);
      // Nishan Sahib
      add('grey', cyl(0.12, 0.14, 12, 6), x + 12, 6, z + 4);
      add('fabricSaffron', ctx.plane(2.4, 1.6), x + 13.2, 10.6, z + 4);
    })(-22, -26);

    /* ---- clock tower ------------------------------------------------------ */
    block('marbleWarm', 10, 16, 10, 34, 0.5, -24);
    add('marble', box(11, 0.5, 11), 34, 16.5, -24);
    add('plasterWhite', cyl(2.6, 2.6, 0.15, 20), 34, 13.0, -18.9, { rx: Math.PI / 2 });
    add('black', box(0.16, 1.7, 0.1), 34, 13.4, -18.8);
    add('black', box(1.2, 0.16, 0.1), 34, 13.0, -18.8);
    add('marble', dome(2.8, 2.6, 18), 34, 17.0, -24);
    add('gold', cyl(0.08, 0.08, 1.2, 6), 34, 19.8, -24);

    /* ---- pilgrims, lamps, trees ------------------------------------------- */
    const people = [[-14, 8], [-10, 4], [-6, 2], [10, 6], [14, 10], [-18, 12], [18, 14], [-8, 16],
      [8, 18], [0, 20], [-22, 6], [22, 8], [12, 22], [-12, 22], [-26, 16], [26, 18]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricSaffron', 'fabricWhite', 'fabricRed'][i % 3], 0.95));
    [[-26, 24], [26, 24], [-30, 4], [30, 4], [0, 30]].forEach(([x, z]) => ctx.lamp(x, z, 4.2, 'black'));
    [[-40, 30], [40, 30], [-44, 10], [44, 10], [-38, 44], [38, 44], [-30, 50], [30, 50]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2, 'round'));

    ctx.light({ pos: [-26, 16, 26], target: [0, 12, 0], color: 0xffd9a0, intensity: 3000, distance: 160 });
    ctx.light({ pos: [26, 16, 20], target: [0, 12, 0], color: 0xffcf90, intensity: 2400, distance: 160 });
    ctx.light({ pos: [0, 10, 34], target: [0, 10, 0], color: 0xffe0b0, intensity: 1400, distance: 120 });
  }
};
