/* Mysore Palace — Mysuru · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'mysore-palace',
  accent: '#d4a24c',
  accent2: '#f0c878',
  seed: 43,
  bounds: 90,
  minDist: 20,
  maxDist: 300,
  time: 16.2,
  home: { pos: [56, 26, 104], target: [0, 20, 0], fov: 38 },
  ground: { texture: 'grass', size: 2400, color: 0x8f9666 },
  views: [
    { name: 'Full', pos: [56, 26, 104], target: [0, 20, 0] },
    { name: 'Facade', pos: [0, 16, 92], target: [0, 18, 0] },
    { name: 'Dome', pos: [24, 40, 56], target: [0, 36, 0] },
    { name: 'Arcade', pos: [26, 8, 44], target: [10, 10, 0] },
    { name: 'Forecourt', pos: [-40, 10, 76], target: [0, 16, 0] }
  ],
  tour: [
    {
      title: 'Amba Vilas', deva: 'मैसूर पैलेस',
      text: 'The old wooden palace of the Wadiyars burned in 1897. Krishnaraja Wodeyar IV commissioned a new one that August; Henry Irwin designed it, and construction ran from 1897 to 1912.',
      pos: [56, 26, 104], target: [0, 20, 0], time: 16.2
    },
    {
      title: 'Indo-Saracenic', deva: 'वास्तुकला',
      text: 'Irwin combined Indo-Islamic, Rajput, Hoysala and Gothic elements into one composition: a deep pink facade of arched colonnades, a central tower, and smaller domes and chhatris along the roofline.',
      pos: [0, 16, 92], target: [0, 18, 0], time: 11
    },
    {
      title: 'The Golden Finial', deva: 'कलश',
      text: 'The central tower carries a large onion dome capped with a gilded finial. It rises above the durbar hall, the ceremonial heart of the palace, whose carved rosewood ceiling is one of the finest in India.',
      pos: [24, 40, 56], target: [0, 36, 0], time: 15.6
    },
    {
      title: 'The Verandah', deva: 'बरामदा',
      text: 'A nine-arch verandah fronts the entrance, with a taller central arch, above three storeys of arcaded windows and deep chajja cornices that keep the sun off the walls.',
      pos: [26, 8, 44], target: [10, 10, 0], time: 8.8
    },
    {
      title: 'A Hundred Thousand Lamps', deva: 'दसहरा',
      text: 'On Sunday evenings, and through the ten days of Dasara, close to a hundred thousand bulbs outline the palace and its gardens. The building is one of the largest palaces in India.',
      pos: [-40, 10, 76], target: [0, 16, 0], time: 21.2
    },
    {
      title: 'Night Illumination', deva: 'रात्रि',
      text: 'Under the lamps the pink walls warm to gold and the domes pick up the light, while the gardens in front fill with visitors.',
      pos: [46, 20, 92], target: [0, 20, 0], time: 22.0
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, onion, arch, archFrame, block, col, chhatri } = ctx;

    const W = 72, D = 44, H = 18;
    const wall = 'sandstonePink', trim = 'cream';

    /* ---- plinth and steps ---------------------------------------------- */
    block('granite', W + 8, 1.4, D + 8, 0, 0, 0);
    block('stone', W + 5, 0.5, D + 5, 0, 1.4, 0);
    for (let i = 0; i < 5; i++) block('stone', 16 - i * 0.6, 0.28 * (i + 1), 1.2, 0, 0, D / 2 + 4 + i * 1.0);

    /* ---- the three storeys ---------------------------------------------- */
    block(wall, W, H, D, 0, 1.9, 0);
    // string courses
    [7.2, 13.0, 18.6].forEach((y) => {
      add(trim, box(W + 0.9, 0.42, D + 0.9), 0, y, 0);
      add('marble', box(W + 0.4, 0.18, D + 0.4), 0, y + 0.3, 0);
    });
    // deep chajja eaves
    add(trim, box(W + 3.2, 0.55, D + 3.2), 0, 1.9 + H + 0.1, 0);

    /* ---- arcades on all four faces -------------------------------------- */
    function arcade(faceZ, ry, n, span, y, h, w) {
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * span;
        const x = Math.cos(ry) * off, z = faceZ - Math.sin(ry) * off;
        const fz = Math.sin(ry) * 0 + Math.cos(ry) * 0;
        add('dark', arch(w, h, 0.2), x, y, z, { ry });
        add(trim, archFrame(w + 0.5, h + 0.3, 0.18, 0.28), x, y, z + (ry === 0 ? 0.06 : 0), { ry });
        add('marble', box(0.24, h + 0.5, 0.3), x + Math.cos(ry) * (w / 2 + 0.45), y + (h + 0.5) / 2, z - Math.sin(ry) * (w / 2 + 0.45), { ry });
      }
    }
    arcade(D / 2 + 0.06, 0, 11, 6.0, 2.2, 4.4, 3.0);
    arcade(-D / 2 - 0.06, Math.PI, 11, 6.0, 2.2, 4.4, 3.0);
    arcade(W / 2 + 0.06, Math.PI / 2, 6, 6.4, 2.2, 4.4, 3.0);
    arcade(-W / 2 - 0.06, -Math.PI / 2, 6, 6.4, 2.2, 4.4, 3.0);
    // upper windows
    for (let r = 0; r < 2; r++) {
      const y = 8.4 + r * 5.6;
      for (let i = 0; i < 13; i++) {
        const x = (i - 6) * 5.4;
        add('dark', arch(1.5, 2.6, 0.18), x, y, D / 2 + 0.07);
        add(trim, archFrame(1.9, 2.9, 0.14, 0.22), x, y, D / 2 + 0.12);
      }
    }

    /* ---- entrance porch -------------------------------------------------- */
    block(wall, 22, 15, 8, 0, 1.9, D / 2 + 2.5);
    add('dark', arch(6.0, 8.2, 0.4), 0, 2.6, D / 2 + 6.6);
    add(trim, archFrame(6.8, 8.8, 0.4, 0.5), 0, 2.6, D / 2 + 6.7);
    add(trim, box(23, 0.6, 9), 0, 17.2, D / 2 + 2.5);
    [-1, 1].forEach((s) => {
      block(wall, 3.4, 6, 3.4, s * 10, 17.8, D / 2 + 2.5);
      add('marble', dome(1.7, 1.5, 16), s * 10, 23.8, D / 2 + 2.5);
      add('gold', cyl(0.08, 0.08, 1.0, 6), s * 10, 25.3, D / 2 + 2.5);
    });

    /* ---- central tower and dome ------------------------------------------ */
    block(wall, 18, 22, 18, 0, 19.9, -2);
    add(trim, box(19.4, 0.6, 19.4), 0, 42.1, -2);
    // colonnaded drum
    add('plasterWhite', cyl(7.0, 7.4, 3.2, 20), 0, 43.7, -2);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      add('plasterWhite', cyl(0.32, 0.36, 3.0, 6), Math.cos(a) * 6.6, 43.7, -2 + Math.sin(a) * 6.6);
    }
    add('plasterWhite', cyl(7.6, 7.2, 0.5, 20), 0, 45.5, -2);
    add('marble', onion(7.2, 10.5, 28), 0, 45.7, -2);
    add('gold', cyl(0.14, 0.14, 2.6, 8), 0, 55.8, -2);
    add('gold', sph(0.34, 10), 0, 57.4, -2);
    add('gold', cone(0.22, 0.9, 8), 0, 58.2, -2);
    // four small chhatris on the tower
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      chhatri(dx * 6.4, 42.4, -2 + dz * 6.4, 1.05, 'plasterWhite', 'marble');
    }

    /* ---- corner towers --------------------------------------------------- */
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = dx * (W / 2 - 4), z = dz * (D / 2 - 4);
      block(wall, 8, 22, 8, x, 19.9, z);
      add(trim, box(9, 0.5, 9), x, 42.0, z);
      add('plasterWhite', cyl(3.4, 3.7, 2.0, 16), x, 43.2, z);
      add('marble', onion(3.6, 5.4, 24), x, 44.2, z);
      add('gold', cyl(0.1, 0.1, 1.6, 6), x, 49.4, z);
      add('gold', sph(0.24, 8), x, 50.4, z);
    }

    /* ---- roofline chhatris ------------------------------------------------ */
    for (let i = 0; i < 5; i++) {
      const x = -28 + i * 14;
      chhatri(x, 19.9, D / 2 - 3.4, 0.9, wall, 'marble');
      chhatri(x, 19.9, -D / 2 + 3.4, 0.9, wall, 'marble');
    }
    for (let i = 0; i < 3; i++) {
      const z = -12 + i * 12;
      chhatri(W / 2 - 3.4, 19.9, z, 0.9, wall, 'marble');
      chhatri(-W / 2 + 3.4, 19.9, z, 0.9, wall, 'marble');
    }

    /* ---- forecourt, gardens, gate ---------------------------------------- */
    add('paving', ctx.plane(120, 150), 0, 0.06, 24, { rx: -Math.PI / 2 });
    [[-26, 40], [26, 40], [-26, 66], [26, 66]].forEach(([x, z]) => {
      add('grass', ctx.plane(26, 20), x, 0.1, z, { rx: -Math.PI / 2 });
      add('marble', box(26.4, 0.24, 20.4), x, 0.12, z);
    });
    // fountain on the axis
    add('stone', cyl(7, 7.4, 0.7, 24), 0, 0.4, 46);
    add('water', cyl(6.3, 6.3, 0.2, 24), 0, 0.8, 46);
    add('stone', cyl(0.8, 1.0, 2.0, 10), 0, 1.4, 46);
    // gate pavilion
    block(wall, 20, 9, 5, 0, 0, 96);
    add('dark', arch(6.0, 7.4, 0.5), 0, 0.2, 98.3);
    add(trim, archFrame(6.8, 8.0, 0.4, 0.4), 0, 0.2, 98.4);
    add(trim, box(21, 0.6, 6), 0, 9, 96);
    [-1, 1].forEach((s) => {
      add('marble', dome(2.2, 2.0, 16), s * 7.4, 9.3, 96);
      add('gold', cyl(0.08, 0.08, 1.0, 6), s * 7.4, 11.5, 96);
    });

    /* ---- people, lamps, trees -------------------------------------------- */
    const people = [[-12, 26], [10, 28], [-4, 22], [16, 24], [-20, 30], [22, 34], [0, 20],
      [-8, 36], [8, 38], [-16, 44], [16, 44], [-2, 50], [4, 34], [-24, 20], [24, 18]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-30, 24], [30, 24], [-14, 54], [14, 54], [-34, 60], [34, 60]].forEach(([x, z]) => ctx.lamp(x, z, 4.0, 'black'));
    [[-44, 34], [44, 34], [-46, 62], [46, 62], [-40, 86], [40, 86], [-52, 12], [52, 12]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.3 + (i % 3) * 0.2, 'round'));

    ctx.light({ pos: [-34, 18, 50], target: [0, 24, 0], color: 0xffd0a0, intensity: 3200, distance: 220 });
    ctx.light({ pos: [34, 20, 44], target: [0, 24, 0], color: 0xffc890, intensity: 2600, distance: 220 });
    ctx.light({ pos: [0, 14, 70], target: [0, 30, 0], color: 0xffe0b0, intensity: 1600, distance: 160 });
  }
};
