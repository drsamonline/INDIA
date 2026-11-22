/* Amber Fort — Amer, Rajasthan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'amber-fort',
  accent: '#d8a86a',
  accent2: '#f0c890',
  seed: 67,
  time: 16.6,
  bounds: 95,
  minDist: 24,
  maxDist: 320,
  home: { pos: [44, 50, 78], target: [0, 34, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8a9463 },
  views: [
    { name: 'Full', pos: [44, 50, 78], target: [0, 34, 0] },
    { name: 'Palace', pos: [16, 30, 56], target: [0, 26, 0] },
    { name: 'Ramparts', pos: [-56, 30, 44], target: [-18, 26, 0] },
    { name: 'Maota', pos: [10, 8, 74], target: [0, 14, 20] },
    { name: 'Gate', pos: [0, 26, 40], target: [0, 26, 8] }
  ],
  tour: [
    {
      title: 'Above the Lake', deva: 'आमेर किला',
      text: 'Raja Man Singh I of the Kachwaha Rajputs began Amber Fort in 1592, on the ridge above the Maota lake outside Jaipur. It served as the seat of the rulers of Amber until the court moved down to Jaipur in 1727.',
      pos: [44, 50, 78], target: [0, 34, 0], time: 16.6
    },
    {
      title: 'Courtyards', deva: 'आँगन',
      text: 'A sequence of courtyards climbs the hill inside the walls: the Diwan-i-Aam for public audience, the Ganesh Pol gateway with its painted arches, and the private palaces behind.',
      pos: [16, 30, 56], target: [0, 26, 0], time: 11
    },
    {
      title: 'Sheesh Mahal', deva: 'शीश महल',
      text: 'Thousands of pieces of mirror, set into plaster, cover the walls and ceiling of the Hall of Mirrors. A single lamp is enough to fill the room with light.',
      pos: [12, 27, 44], target: [4, 26, 12], time: 9.4
    },
    {
      title: 'The Rampart', deva: 'प्राचीर',
      text: 'A long crenellated wall with watchtowers runs along the Aravalli ridge above the fort, joining it to Jaigarh. From the rampart the plain towards Jaipur opens out.',
      pos: [-56, 30, 44], target: [-18, 26, 0], time: 17.4
    },
    {
      title: 'Maota Lake', deva: 'मावठा',
      text: 'The Maota lake below the fort catches its reflection and waters the Dil-e-Aram garden, laid out in the Mughal charbagh manner at the foot of the hill.',
      pos: [10, 8, 74], target: [0, 14, 20], time: 18.2
    },
    {
      title: 'Hill Forts of Rajasthan', deva: 'दुर्ग',
      text: 'Amber was inscribed in 2013, with five other forts of Rajasthan, as a UNESCO World Heritage Site: the Hill Forts of Rajasthan.',
      pos: [40, 44, 72], target: [0, 34, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, chhatri } = ctx;

    const stone = 'sandstoneBuff', trim = 'marble';

    /* ---- the hill -------------------------------------------------------- */
    block('stone', 96, 8, 78, 0, 0, -2);
    block('sandstoneBuff', 88, 7, 70, 0, 8, -4);
    block('sandstoneBuff', 76, 7, 60, 0, 15, -6);
    block(stone, 66, 4, 50, 0, 22, -8);
    // rock faces catching the light
    [[-46, 4, 6, 14], [46, 3, -4, 12], [-30, 12, 22, 9], [34, 11, 16, 10]].forEach(([x, y, z, r]) => {
      add('stone', sph(r, 9), x, y, z, { sy: 0.8 });
    });

    /* ---- the palace platform and walls ------------------------------------ */
    block(stone, 56, 3.2, 40, 0, 26, -8);
    add(trim, box(57, 0.4, 41), 0, 29.2, -8);
    // crenellated parapet round the platform
    for (let i = -13; i <= 13; i++) {
      add(stone, box(1.5, 1.5, 0.9), i * 2.1, 30.2, 12.1);
      if (i % 2 === 0) add(stone, box(0.8, 0.7, 0.9), i * 2.1, 31.1, 12.1);
    }

    /* ---- the palace blocks ------------------------------------------------ */
    // main range along the ridge
    block(stone, 48, 10, 16, 0, 29.4, -6);
    add(trim, box(49, 0.5, 17), 0, 39.4, -6);
    // arcaded facade facing the lake
    for (let i = -5; i <= 5; i++) {
      const x = i * 4.1;
      add('dark', arch(2.4, 3.6, 0.22), x, 30.6, 2.1);
      add(trim, archFrame(2.8, 4.0, 0.2, 0.24), x, 30.6, 2.2);
    }
    // upper storey windows
    for (let i = -5; i <= 5; i++) {
      add('dark', arch(1.4, 2.2, 0.18), i * 4.1, 35.2, 2.1);
      add(trim, archFrame(1.7, 2.5, 0.16, 0.2), i * 4.1, 35.2, 2.2);
    }
    // side wings
    [-1, 1].forEach((s) => {
      block(stone, 14, 12, 22, s * 26, 29.4, -8);
      add(trim, box(15, 0.4, 23), s * 26, 41.4, -8);
    });

    /* ---- the Ganesh Pol gate --------------------------------------------- */
    block('sandstonePink', 14, 12, 5, 0, 29.4, 13);
    add('dark', arch(5.0, 7.2, 0.5), 0, 30.0, 15.6);
    add(trim, archFrame(5.8, 7.9, 0.4, 0.45), 0, 30.0, 15.7);
    add('sandstonePink', box(15, 0.6, 6), 0, 41.4, 13);
    // painted bands
    [33.6, 36.4, 39.2].forEach((y, i) => add(i % 2 ? 'yellow' : 'teal', box(14.2, 0.35, 5.2), 0, y, 13));
    [-1, 1].forEach((s) => {
      chhatri(s * 5.4, 41.9, 13, 1.0, 'sandstonePink', 'marble');
    });

    /* ---- domes, chhatris, towers ------------------------------------------ */
    block(stone, 12, 6, 12, 0, 39.4, -6);
    add(trim, box(13, 0.4, 13), 0, 45.4, -6);
    add('marble', onion(4.4, 6.4, 24), 0, 45.8, -6);
    add('gold', cyl(0.1, 0.1, 1.6, 6), 0, 52.4, -6);
    add('gold', sph(0.26, 8), 0, 53.4, -6);
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      chhatri(i * 8.4, 39.9, -6, 0.95, stone, 'marble');
    }
    [-1, 1].forEach((s) => {
      block(stone, 7, 8, 7, s * 30, 41.4, -14);
      add('marble', onion(3.0, 4.2, 20), s * 30, 49.6, -14);
      add('gold', sph(0.2, 8), s * 30, 53.6, -14);
    });

    /* ---- the rampart running along the ridge ------------------------------- */
    function rampart(x0, z0, x1, z1, y) {
      const dx = x1 - x0, dz = z1 - z0;
      const len = Math.hypot(dx, dz), ry = Math.atan2(dz, dx);
      const n = Math.round(len / 3.6);
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const x = x0 + dx * t, z = z0 + dz * t;
        add(stone, box(3.7, 5.4, 1.5), x, y + 2.7, z, { ry });
        if (i % 2 === 0) add(stone, box(1.1, 1.1, 1.6), x, y + 5.9, z, { ry });
      }
      // a watchtower every few bays
      for (let i = 2; i < n; i += 6) {
        const t = i / (n - 1);
        const x = x0 + dx * t, z = z0 + dz * t;
        add(stone, cyl(2.2, 2.6, 8.4, 8), x, y + 4.2, z);
        add('marble', dome(2.4, 2.0, 14), x, y + 8.4, z);
      }
    }
    rampart(-46, 12, -26, -22, 26);
    rampart(-26, -22, 10, -30, 26);
    rampart(46, 8, 30, -24, 26);

    /* ---- Maota lake and the garden ----------------------------------------- */
    add('stone', box(56, 1.2, 26), 0, 0.4, 44);
    add('water', box(50, 0.2, 20), 0, 1.0, 44);
    add('marble', box(56.4, 0.4, 0.8), 0, 1.3, 31.4);
    add('marble', box(56.4, 0.4, 0.8), 0, 1.3, 56.6);
    // charbagh garden beds at the water's edge
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 3; i++) {
        add('grass', box(12, 0.14, 6), s * 18, 1.15, 32 + i * 8);
      }
    });
    // the stepped path up from the lake
    for (let i = 0; i < 10; i++) {
      add('stone', box(9, 1.1, 2.0), 0, 1.2 + i * 1.05, 28 - i * 1.6);
    }

    /* ---- people, lamps, trees ---------------------------------------------- */
    const people = [[-6, 18], [7, 19], [-14, 14], [14, 15], [0, 22], [-20, 20], [20, 21], [-9, 26], [10, 26],
      [-24, 8], [24, 8], [0, 34], [-12, 34], [12, 34]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-26, 20], [26, 20], [-18, 30], [18, 30], [0, 28]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-42, 26], [42, 26], [-48, 6], [48, 6], [-34, 52], [34, 52], [-52, 40], [52, 40]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 3) * 0.2, i % 4 === 0 ? 'cypress' : 'round'));

    ctx.light({ pos: [-40, 30, 40], target: [0, 32, 0], color: 0xffd0a0, intensity: 3400, distance: 220 });
    ctx.light({ pos: [40, 30, 34], target: [0, 32, 0], color: 0xffc890, intensity: 2800, distance: 220 });
  }
};
