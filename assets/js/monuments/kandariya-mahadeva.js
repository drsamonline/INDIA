/* Kandariya Mahadeva — Khajuraho · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'kandariya-mahadeva',
  accent: '#c9a878',
  accent2: '#e0c49a',
  seed: 89,
  time: 15.6,
  bounds: 55,
  minDist: 12,
  maxDist: 200,
  home: { pos: [34, 18, 46], target: [0, 16, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x94a06c, tile: 14 },
  views: [
    { name: 'Full', pos: [34, 18, 46], target: [0, 16, 0] },
    { name: 'Shikhara', pos: [16, 34, 26], target: [0, 28, 0] },
    { name: 'Carving', pos: [9, 9, 14], target: [0, 8, 2] },
    { name: 'Platform', pos: [-26, 9, 30], target: [0, 10, 0] },
    { name: 'West face', pos: [-30, 16, -18], target: [0, 16, 0] }
  ],
  tour: [
    {
      title: 'The Great Temple', deva: 'कंदारिया महादेव',
      text: 'The Kandariya Mahadeva is the largest and tallest of the temples at Khajuraho, built by the Chandela kings around 1030 CE and dedicated to Shiva. It stands on a high platform with a five-part plan around a central shrine.',
      pos: [34, 18, 46], target: [0, 16, 0], time: 15.6
    },
    {
      title: 'A Mountain in Stone', deva: 'शिखर',
      text: 'The tower rises about 31 metres in a curve of stacked tiers, each with its own row of small turrets, so the shikhara reads as a mountain with subsidiary peaks — the nagara form at its most elaborate.',
      pos: [16, 34, 26], target: [0, 28, 0], time: 12
    },
    {
      title: 'Eight Hundred Figures', deva: 'मूर्तियाँ',
      text: 'The walls carry some 870 sculptures: gods, nymphs, musicians, mithuna couples and animals, cut in a soft sandstone that has held its detail for a thousand years.',
      pos: [9, 9, 14], target: [0, 8, 2], time: 9.4
    },
    {
      title: 'The Platform', deva: 'जगती',
      text: 'The temple stands on a jagati, a raised platform with a walkway for circumambulation, and is entered through a porch and a pillared hall before the dark sanctum.',
      pos: [-26, 9, 30], target: [0, 10, 0], time: 10.8
    },
    {
      title: 'Abandoned and Kept', deva: 'खजुराहो',
      text: 'The temples were built in a burst between about 950 and 1050 and then left; the site was remote enough to escape destruction, and Khajuraho became a UNESCO World Heritage Site in 1986.',
      pos: [-30, 16, -18], target: [0, 16, 0], time: 17.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Under floodlight the tiers throw long shadows up the tower and the carvings read as a texture of light and dark.',
      pos: [30, 16, 42], target: [0, 16, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col } = ctx;

    const stone = 'sandstoneBuff', trim = 'stone';

    /* ---- the jagati platform --------------------------------------------- */
    block(stone, 30, 2.6, 22, 0, 0, 0);
    add(trim, box(30.6, 0.3, 22.6), 0, 2.6, 0);
    // mouldings
    [0.6, 1.8].forEach((y) => add(trim, box(30.3, 0.18, 22.3), 0, y, 0));
    for (let i = 0; i < 5; i++) {
      add(stone, box(12 - i * 0.9, 0.5, 1.2), 0, 0.25 + i * 0.5, 11.6 + i * 1.1);
    }

    /* ---- the sanctum and its tower --------------------------------------- */
    const cx = 0, cz = -3;
    block(stone, 11, 6.4, 11, cx, 2.6, cz);
    add(trim, box(11.8, 0.4, 11.8), cx, 9.0, cz);
    // the door on the east face
    add('dark', arch(2.6, 4.2, 0.3), cx, 3.0, cz + 5.55);
    add(trim, archFrame(3.2, 4.8, 0.24, 0.28), cx, 3.0, cz + 5.6);

    // the shikhara: twelve tiers, each smaller and each ringed with turrets
    let y = 9.2, w = 11.0;
    for (let i = 0; i < 12; i++) {
      const h = 1.55;
      block(stone, w, h, w, cx, y, cz);
      add(trim, box(w + 0.28, 0.16, w + 0.28), cx, y + h, cz);
      // figure bands on each face
      const n = Math.max(3, Math.round(w / 1.5));
      for (let k = 0; k < n; k++) {
        const off = (k - (n - 1) / 2) * (w / n);
        add('sandstonePink', box(0.55, h * 0.62, 0.16), cx + off, y + h * 0.45, cz + w / 2 + 0.02);
        add('sandstonePink', box(0.55, h * 0.62, 0.16), cx + off, y + h * 0.45, cz - w / 2 - 0.02);
        add('sandstonePink', box(0.16, h * 0.62, 0.55), cx + w / 2 + 0.02, y + h * 0.45, cz + off);
        add('sandstonePink', box(0.16, h * 0.62, 0.55), cx - w / 2 - 0.02, y + h * 0.45, cz + off);
      }
      // corner turrets, shrinking with the tower
      const tw = w * 0.26;
      if (i % 3 === 0) for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add(stone, box(tw, h * 1.5, tw), cx + dx * (w / 2 - tw / 2 + 0.05), y + h * 0.2, cz + dz * (w / 2 - tw / 2 + 0.05));
        add(trim, box(tw + 0.2, 0.14, tw + 0.2), cx + dx * (w / 2 - tw / 2 + 0.05), y + h * 0.2 + h * 1.5, cz + dz * (w / 2 - tw / 2 + 0.05));
      }
      y += h;
      w *= 0.9;
    }
    // amalaka, kalasha
    add(trim, cyl(w * 0.62, w * 0.78, 0.6, 16), cx, y + 0.3, cz);
    add(stone, cyl(w * 0.55, w * 0.6, 0.9, 16), cx, y + 1.05, cz);
    add(trim, cyl(w * 0.42, w * 0.52, 0.35, 16), cx, y + 1.65, cz);
    add('gold', cyl(0.28, 0.34, 1.2, 10), cx, y + 2.4, cz);
    add('gold', sph(0.36, 10), cx, y + 3.1, cz);

    /* ---- the porch and the hall ------------------------------------------ */
    // mandapa with a stepped pyramid roof
    block(stone, 9.0, 6.0, 8.0, 0, 2.6, 6.2);
    let ry = 8.6, rw = 9.2;
    for (let i = 0; i < 5; i++) {
      add(stone, box(rw, 0.9, rw * 0.9), 0, ry, 6.2);
      add(trim, box(rw + 0.2, 0.12, rw * 0.9 + 0.2), 0, ry + 0.9, 6.2);
      ry += 0.9; rw *= 0.84;
    }
    add(trim, cyl(rw * 0.4, rw * 0.5, 0.4, 12), 0, ry + 0.2, 6.2);
    add('gold', sph(0.26, 8), 0, ry + 0.9, 6.2);
    // entrance porch
    block(stone, 6.4, 4.4, 4.4, 0, 2.6, 11.4);
    add(stone, box(6.8, 0.8, 4.8), 0, 7.0, 11.4);
    add(trim, box(7.0, 0.14, 5.0), 0, 7.8, 11.4);
    add('dark', arch(2.2, 3.4, 0.24), 0, 2.9, 13.6);
    add(trim, archFrame(2.7, 3.9, 0.2, 0.24), 0, 2.9, 13.65);

    /* ---- subsidiary shrines on the platform ------------------------------- */
    for (const [sx, sz] of [[-10.5, 4.5], [10.5, 4.5], [-10.5, -8.5], [10.5, -8.5]]) {
      block(stone, 4.2, 3.6, 4.2, sx, 2.6, sz);
      let sy = 6.2, sw = 4.4;
      for (let i = 0; i < 4; i++) {
        add(stone, box(sw, 0.8, sw), sx, sy, sz);
        add(trim, box(sw + 0.16, 0.1, sw + 0.16), sx, sy + 0.8, sz);
        sy += 0.8; sw *= 0.82;
      }
      add('gold', sph(0.22, 8), sx, sy + 0.5, sz);
    }

    /* ---- grounds ---------------------------------------------------------- */
    const people = [[-6, 20], [7, 21], [-12, 16], [13, 17], [0, 24], [-18, 12], [18, 13], [-3, 18], [9, 15]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 24], [16, 24], [-22, 4], [22, 4], [-20, -18], [20, -18]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-26, 18], [26, 18], [-30, -6], [30, -6], [-24, -26], [24, -26], [-32, 10], [32, 10]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.1 + (i % 3) * 0.15, 'round'));

    ctx.light({ pos: [-20, 12, 22], target: [0, 18, 0], color: 0xffd0a0, intensity: 2600, distance: 140 });
    ctx.light({ pos: [20, 12, 18], target: [0, 18, 0], color: 0xffc890, intensity: 2200, distance: 140 });
  }
};
