/* Somnath Temple — Prabhas Patan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'somnath-temple',
  accent: '#d0b890',
  accent2: '#e8d0b0',
  seed: 107,
  time: 10.6,
  bounds: 70,
  minDist: 18,
  maxDist: 260,
  home: { pos: [51, 26.5, 93], target: [0, 22, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xc6b394, tile: 12 },
  water: { y: -0.5, size: 520, z: -280, color: 0x2a5160, distortion: 2.4 },
  views: [
    { name: 'Full', pos: [51, 26.5, 93], target: [0, 22, 0] },
    { name: 'Shikhara', pos: [18, 40, 44], target: [0, 34, 0] },
    { name: 'Mandapa', pos: [0, 12, 46], target: [0, 12, 0] },
    { name: 'From the sea', pos: [-20, 12, -66], target: [0, 20, 0] },
    { name: 'Flag', pos: [10, 46, 26], target: [0, 46, 0] }
  ],
  tour: [
    {
      title: 'The First Jyotirlinga', deva: 'सोमनाथ',
      text: 'Somnath, at Prabhas Patan on the Saurashtra coast, is the first of the twelve Jyotirlingas of Shiva. It has been destroyed and rebuilt repeatedly, most famously sacked by Mahmud of Ghazni in 1026.',
      pos: [51, 26.5, 93], target: [0, 22, 0], time: 17.4
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
      pos: [47, 24, 85], target: [0, 24, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus } = ctx;

    const stone = 'granite', trim = 'plasterWhite', dark = 'basaltDark';

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

    // the tower: a curvilinear nagara shikhara
    // The core is one square-sectioned lathe: 23 stations whose half-width
    // follows w(t) = WT + (WB-WT)(1-t)^0.55, so the silhouette is a true curve
    // and not a stack of steps. Tiers, bands and ribs are applied over it.
    const TY = 15.7, TH = 34.2, NT = 22;
    const WB = 15.4, WT = 4.4;
    const wAt = (t) => WT + (WB - WT) * Math.pow(Math.max(0, 1 - t), 0.55);
    const tAt = (i) => 1.25 * (i / NT) - 0.25 * Math.pow(i / NT, 2.5);  // tiers crowd upwards

    const prof = [];
    for (let i = 0; i <= NT; i++) {
      const t = tAt(i);
      prof.push([(wAt(t) / 2) * Math.SQRT2, TH * t]);   // corner radius of the square
    }
    add(stone, ctx.lathe(prof, 4), sx, TY, sz, { ry: Math.PI / 4 });

    // thin courses at the tier joints, and vertical ribs (latas) that follow
    // the curve closely enough not to read as steps
    for (let i = 0; i < NT; i++) {
      const t0 = tAt(i), t1 = tAt(i + 1);
      const y0 = TY + TH * t0, y1 = TY + TH * t1;
      const w0 = wAt(t0), w1 = wAt(t1), wm = (w0 + w1) * 0.5;
      // ribs and courses are subdivided so no segment is wider than the one
      // below by more than 0.12 — the silhouette stays a curve, not a stair
      const nsub = Math.max(2, Math.ceil((w0 - w1) / 0.12));
      for (let q = 0; q < nsub; q++) {
        const sa = q / nsub, sb = (q + 1) / nsub;
        const ya = y0 + (y1 - y0) * sa, yb = y0 + (y1 - y0) * sb;
        const wa = w0 + (w1 - w0) * sa, wb2 = w0 + (w1 - w0) * sb;
        const wq = (wa + wb2) * 0.5, hq = yb - ya, yq = (ya + yb) * 0.5;
        const ribs = [-0.78, -0.39, 0, 0.39, 0.78];
        for (let k = 0; k < ribs.length; k++) {
          const u = ribs[k] * (wq / 2);
          const rw = k === 2 ? 0.34 : 0.14;
          const key = k === 2 ? 'cream' : stone;   // the lata reads as a band
          add(key, box(rw, hq + 0.02, 0.13), sx + u, yq, sz + wq / 2);
          add(key, box(rw, hq + 0.02, 0.13), sx + u, yq, sz - wq / 2);
          add(key, box(0.13, hq + 0.02, rw), sx + wq / 2, yq, sz + u);
          add(key, box(0.13, hq + 0.02, rw), sx - wq / 2, yq, sz + u);
        }
        // the thin course at the head of each tier, following the curve
        if (q === nsub - 1) add('cream', box(wq + 0.07, 0.065, wq + 0.07), sx, yq + hq / 2 - 0.05, sz);
        // small corner offsets, base third only, tapering out at its head
        if (t0 < 0.34) {
          const fade = Math.min(1, (0.34 - t0) / 0.12);
          const c = wq * 0.13 * fade, off = wq / 2 - c * 0.30;
          if (c > 0.05) for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
            add(stone, box(c, hq + 0.02, c), sx + dx * off, yq, sz + dz * off);
          }
        }
      }
    }
    // a course where the corner offsets die out
    add('cream', box(wAt(0.34) + 0.18, 0.13, wAt(0.34) + 0.18), sx, TY + TH * 0.34, sz);

    // neck, amalaka, kalasha
    const yTop = TY + TH, wTop = wAt(1), A = wTop * 0.5;
    add(stone, cyl(A * 0.85, A * 1.0, 1.1, 20), sx, yTop + 0.55, sz);
    add('cream', cyl(A * 1.2, A * 1.35, 0.55, 24), sx, yTop + 1.35, sz);
    add('cream', cyl(A * 1.32, A * 1.28, 0.5, 24), sx, yTop + 1.85, sz);
    for (let k = 0; k < 20; k++) {
      const a = (k / 20) * Math.PI * 2;
      add('cream', box(0.16, 1.3, 0.4), sx + Math.cos(a) * A * 1.2, yTop + 1.6, sz + Math.sin(a) * A * 1.2, { ry: -a });
    }
    add('cream', cyl(A * 0.85, A * 1.05, 0.5, 18), sx, yTop + 2.35, sz);
    add('gold', cyl(A * 0.6, A * 0.8, 1.1, 14), sx, yTop + 3.15, sz);
    add('gold', sph(A * 0.72, 12), sx, yTop + 4.1, sz);
    add('gold', cyl(0.3, 0.45, 1.5, 10), sx, yTop + 5.3, sz);
    // the flag
    add('grey', cyl(0.09, 0.1, 6.0, 6), sx, yTop + 9.1, sz);
    add('fabricSaffron', box(2.4, 1.4, 0.08), sx + 1.3, yTop + 10.9, sz);

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
