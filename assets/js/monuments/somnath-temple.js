/* Somnath Temple — Prabhas Patan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'somnath-temple',
  accent: '#d0b890',
  accent2: '#e8d0b0',
  seed: 107,
  time: 17.4,
  bounds: 70,
  minDist: 18,
  maxDist: 260,
  home: { pos: [46, 26, 84], target: [0, 22, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xc6b394, tile: 12 },
  water: { y: -0.5, size: 520, z: -280, color: 0x2a5160, distortion: 2.4 },
  views: [
    { name: 'Full', pos: [46, 26, 84], target: [0, 22, 0] },
    { name: 'Shikhara', pos: [18, 40, 44], target: [0, 34, 0] },
    { name: 'Mandapa', pos: [0, 12, 46], target: [0, 12, 0] },
    { name: 'From the sea', pos: [-20, 12, -66], target: [0, 20, 0] },
    { name: 'Flag', pos: [10, 46, 26], target: [0, 46, 0] }
  ],
  tour: [
    {
      title: 'The First Jyotirlinga', deva: 'सोमनाथ',
      text: 'Somnath, at Prabhas Patan on the Saurashtra coast, is the first of the twelve Jyotirlingas of Shiva. It has been destroyed and rebuilt repeatedly, most famously sacked by Mahmud of Ghazni in 1026.',
      pos: [46, 26, 84], target: [0, 22, 0], time: 17.4
    },
    {
      title: 'Fifty Metres', deva: 'शिखर',
      text: 'The present temple was rebuilt between 1950 and 1951 on the initiative of Sardar Vallabhbhai Patel, in the Kailash Mahameru Prasad style: a 50-metre shikhara of carved grey sandstone rising over the sanctum.',
      pos: [18, 40, 44], target: [0, 34, 0], time: 12
    },
    {
      title: 'The Pillared Hall', deva: 'सभा मंडप',
      text: 'A pillared hall of polished stone stands in front of the sanctum, its ceiling carried on carved columns, with the Nandi facing the shrine.',
      pos: [0, 12, 46], target: [0, 12, 0], time: 9.6
    },
    {
      title: 'Beside the Sea', deva: 'समुद्र',
      text: 'The temple stands within sight of the Arabian Sea, and the granite for the present building was brought from the other side of the continent.',
      pos: [-20, 12, -66], target: [0, 20, 0], time: 18.2
    },
    {
      title: 'The Flag', deva: 'ध्वज',
      text: 'A flag flies from the spire and is changed three times a day, each time to the sound of conches and drums.',
      pos: [10, 46, 26], target: [0, 46, 0], time: 16.8
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit after dark, the shikhara is visible along the coast, and the evening aarti draws crowds to the steps.',
      pos: [42, 22, 76], target: [0, 24, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus } = ctx;

    const stone = 'sandstoneBuff', trim = 'marble', dark = 'granite';

    /* ---- the terrace and steps -------------------------------------------- */
    block(dark, 62, 2.2, 54, 0, 0, 0);
    block(trim, 54, 1.2, 46, 0, 2.2, 0);
    for (let i = 0; i < 6; i++) add(dark, box(18 - i * 1.2, 0.4, 1.4), 0, 0.4 + i * 0.4, 24 + i * 1.2);

    /* ---- the mandapa: a pillared hall ------------------------------------- */
    const mx = 0, mz = 12;
    block(stone, 20, 8.4, 16, mx, 3.4, mz);
    add(trim, box(21, 0.5, 17), mx, 11.8, mz);
    // rows of columns on the open side
    for (let i = -3; i <= 3; i++) {
      add(trim, cyl(0.55, 0.65, 7.0, 10), i * 2.8, 7.0, mz + 7.6);
      add(trim, cyl(0.75, 0.6, 0.5, 10), i * 2.8, 10.7, mz + 7.6);
    }
    for (let i = -2; i <= 2; i++) {
      add('dark', box(1.6, 3.0, 0.24), i * 3.2, 6.6, mz + 8.05);
    }
    // stepped pyramid roof over the hall
    let ry = 12.2, rw = 22;
    for (let i = 0; i < 4; i++) {
      add(stone, box(rw, 0.9, rw * 0.8), mx, ry, mz);
      add(trim, box(rw + 0.3, 0.14, rw * 0.8 + 0.3), mx, ry + 0.9, mz);
      ry += 0.9; rw *= 0.84;
    }
    add('gold', sph(0.3, 8), mx, ry + 0.5, mz);

    /* ---- the sanctum and the shikhara ------------------------------------- */
    const sx = 0, sz = -6;
    block(stone, 16, 12, 16, sx, 3.4, sz);
    add(trim, box(17, 0.6, 17), sx, 15.4, sz);
    add('dark', arch(4.2, 7.0, 0.4), sx, 3.8, sz + 8.2);
    add(trim, archFrame(5.0, 7.8, 0.4, 0.45), sx, 3.8, sz + 8.3);

    // the tower: a curved tapering shikhara with vertical ribs
    let y = 15.9, w = 16.0;
    for (let i = 0; i < 20; i++) {
      const h = 2.0;
      block(stone, w, h, w, sx, y, sz);
      // horizontal mouldings
      add(trim, box(w + 0.16, 0.1, w + 0.16), sx, y + h, sz);
      // vertical ribs on each face
      const n = Math.max(3, Math.round(w / 1.6));
      for (let k = 0; k < n; k++) {
        const off = (k - (n - 1) / 2) * (w / n);
        add(trim, box(0.22, h, 0.22), sx + off, y + h / 2, sz + w / 2 + 0.1);
        add(trim, box(0.22, h, 0.22), sx + off, y + h / 2, sz - w / 2 - 0.1);
        add(trim, box(0.22, h, 0.22), sx + w / 2 + 0.1, y + h / 2, sz + off);
        add(trim, box(0.22, h, 0.22), sx - w / 2 - 0.1, y + h / 2, sz + off);
      }
      // corner pilasters that keep the tower square as it curves
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add(stone, box(w * 0.16, h, w * 0.16), sx + dx * (w / 2 - w * 0.08), y + h / 2, sz + dz * (w / 2 - w * 0.08));
      }
      y += h;
      w *= 0.955;
    }
    // amalaka and kalasha
    add(trim, cyl(w * 0.66, w * 0.8, 0.7, 16), sx, y + 0.35, sz);
    add(stone, cyl(w * 0.58, w * 0.64, 1.0, 16), sx, y + 1.2, sz);
    add(trim, cyl(w * 0.44, w * 0.54, 0.4, 16), sx, y + 1.9, sz);
    add('gold', cyl(0.34, 0.42, 1.6, 10), sx, y + 2.9, sz);
    add('gold', sph(0.44, 10), sx, y + 3.9, sz);
    // the flag
    add('grey', cyl(0.09, 0.1, 6.0, 6), sx, y + 7.0, sz);
    add('fabricSaffron', box(2.4, 1.4, 0.08), sx + 1.3, y + 9.0, sz);

    /* ---- subsidiary shrines and the Nandi --------------------------------- */
    for (const [x, z, s] of [[-22, 4, 1.0], [22, 4, 1.0], [-22, -14, 0.85], [22, -14, 0.85]]) {
      block(stone, 7 * s, 5 * s, 7 * s, x, 3.4, z);
      let sy = 8.4 * s + 3.4, sw = 7.4 * s;
      for (let i = 0; i < 4; i++) {
        add(stone, box(sw, 0.8 * s, sw), x, sy, z);
        add(trim, box(sw + 0.16, 0.1, sw + 0.16), x, sy + 0.8 * s, z);
        sy += 0.8 * s; sw *= 0.84;
      }
      add('gold', sph(0.22 * s, 8), x, sy + 0.4, z);
    }
    // Nandi facing the shrine
    add(dark, box(3.0, 1.2, 4.4), 0, 4.6, 26);
    add(dark, box(2.0, 1.6, 2.4), 0, 5.6, 24.4);
    add(dark, sph(0.9, 8), 0, 6.2, 23.2);

    /* ---- the sea wall and the shore --------------------------------------- */
    block(dark, 76, 3.2, 3.0, 0, 0, -34);
    for (let i = -7; i <= 7; i++) add(dark, box(2.2, 1.4, 3.4), i * 5.2, 3.4, -34);

    /* ---- people, lamps, trees ---------------------------------------------- */
    const people = [[-8, 30], [8, 31], [-16, 26], [16, 27], [0, 34], [-24, 22], [24, 23], [-4, 26], [10, 25]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricSaffron', 'fabricWhite', 'fabricRed'][i % 3], 0.95));
    [[-20, 30], [20, 30], [-26, 12], [26, 12], [0, 38]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-30, 30], [30, 30], [-32, 8], [32, 8], [-26, -22], [26, -22]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 3) * 0.15, 'round'));

    ctx.light({ pos: [-26, 20, 34], target: [0, 26, 0], color: 0xffd0a0, intensity: 3400, distance: 190 });
    ctx.light({ pos: [26, 20, 30], target: [0, 26, 0], color: 0xffc890, intensity: 2800, distance: 190 });
  }
};
