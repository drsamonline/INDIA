/* Statue of Unity — Kevadia, Gujarat · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'statue-of-unity',
  accent: '#b8b2a4',
  accent2: '#d8d2c4',
  seed: 83,
  time: 16.9,
  bounds: 150,
  minDist: 60,
  maxDist: 900,
  home: { pos: [205, 122, 295], target: [0, 98, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8e9a68, tile: 30 },
  water: { y: -1.2, size: 900, z: 520, color: 0x2d5566, distortion: 2.0 },
  views: [
    { name: 'Full', pos: [205, 122, 295], target: [0, 98, 0] },
    { name: 'The figure', pos: [90, 150, 150], target: [0, 130, 0] },
    { name: 'From the dam', pos: [0, 60, 300], target: [0, 110, 0] },
    { name: 'Plinth', pos: [70, 40, 90], target: [0, 30, 0] },
    { name: 'Aerial', pos: [200, 300, 260], target: [0, 80, 0] }
  ],
  tour: [
    {
      title: 'The Tallest Statue', deva: 'एकता की प्रतिमा',
      text: 'The Statue of Unity stands on the island of Sadhu Bet in the Narmada, facing the Sardar Sarovar dam. At 182 metres it is the tallest statue in the world, dedicated to Sardar Vallabhbhai Patel, who brought the princely states into the Indian Union.',
      pos: [205, 122, 295], target: [0, 98, 0], time: 16.9
    },
    {
      title: 'Bronze on Steel', deva: 'कांस्य',
      text: 'The figure is a steel frame clad in about 1,700 tonnes of bronze panels over 25,000 tonnes of steel and concrete. It was designed by the sculptor Ram V. Sutar and built by Larsen & Toubro between 2013 and 2018.',
      pos: [90, 150, 150], target: [0, 130, 0], time: 12
    },
    {
      title: 'The Viewing Gallery', deva: 'दीर्घा',
      text: 'A gallery at 153 metres holds two hundred people at a time, looking out over the reservoir and the Vindhya hills.',
      pos: [60, 170, 110], target: [0, 155, 0], time: 9.6
    },
    {
      title: 'The Dam', deva: 'सरदार सरोवर',
      text: 'The statue faces the Sardar Sarovar dam across the water, a deliberate pairing: the man who argued for the project, looking at it.',
      pos: [0, 60, 300], target: [0, 110, 0], time: 17.6
    },
    {
      title: 'The Island', deva: 'साधु बेट',
      text: 'The plinth is a memorial complex with a museum, a garden and a memorial walk. The statue was unveiled on 31 October 2018, Patel’s birthday.',
      pos: [70, 40, 90], target: [0, 30, 0], time: 11
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit after dark, the bronze reads almost black against the sky, and the dam carries a line of lights.',
      pos: [140, 92, 200], target: [0, 96, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    /* ---- the island and its plinth --------------------------------------- */
    block('stone', 120, 6, 100, 0, -2, 0);
    block('paving', 96, 4, 78, 0, 4, 0);
    block('marble', 60, 10, 52, 0, 8, 0);
    add('marble', box(62, 0.6, 54), 0, 18.2, 0);
    // steps up to the plinth on four sides
    for (let i = 0; i < 6; i++) {
      add('stone', box(20 - i * 1.2, 1.4, 2.4), 0, 18 - i * 1.4, 30 + i * 2.2);
    }
    // the memorial hall inside the plinth
    block('stone', 34, 9, 28, 0, 18, 0);
    for (let i = -2; i <= 2; i++) add('dark', box(3.2, 4.4, 0.4), i * 6, 22, 14.1);

    /* ---- the figure ------------------------------------------------------ */
    const BASE = 18.6;
    const B = 'bronze';
    // dhoti: one tapered mass from hem to waist
    add(B, cyl(19.5, 27.5, 62, 20), 0, BASE + 31, 0, { sz: 0.78 });
    add(B, cyl(27.6, 27.0, 3.2, 20), 0, BASE + 1.8, 0, { sz: 0.78 });     // hem
    add(B, cyl(19.0, 20.0, 4.0, 20), 0, BASE + 63, 0, { sz: 0.76 });       // waistband
    // torso, and the coat over it
    add(B, cyl(18.4, 20.4, 46, 20), 0, BASE + 88, 0, { sz: 0.7 });
    add(B, cyl(19.2, 18.8, 44, 20), 0, BASE + 90, 0, { sz: 0.73 });        // jacket
    // shoulders
    add(B, sph(21.0, 18), 0, BASE + 113, 0, { sy: 0.42, sz: 0.62 });
    // arms, hanging with a slight outward angle, hands at mid-thigh
    [-1, 1].forEach((sd) => {
      add(B, cyl(4.4, 5.4, 46, 10), sd * 18.2, BASE + 90, 0, { rz: sd * 0.05 });
      add(B, sph(4.6, 10), sd * 19.4, BASE + 66, 0);
      add(B, cyl(4.0, 4.4, 22, 8), sd * 19.8, BASE + 54, 0);
      add(B, sph(4.2, 8), sd * 20.0, BASE + 42, 0);                         // hand
    });
    // neck, head, cap
    add(B, cyl(5.0, 6.4, 8, 12), 0, BASE + 119, 0);
    add(B, sph(8.4, 18), 0, BASE + 131, 0, { sy: 1.2, sz: 0.9 });
    add(B, sph(4.0, 10), 0, BASE + 126, 6.8, { sy: 0.7 });                  // jaw
    add(B, sph(2.6, 8), 0, BASE + 134, 7.4, { sy: 0.5 });                   // brow
    add(B, dome(8.6, 3.4, 16), 0, BASE + 136, 0, { sz: 0.92 });             // cap
    add(B, cyl(1.6, 2.0, 1.6, 8), 0, BASE + 140.4, 0);

    /* ---- the complex around it ------------------------------------------- */
    // memorial walk with columns
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      add('marble', cyl(1.6, 1.9, 8, 8), Math.cos(a) * 44, 22, Math.sin(a) * 44);
      add('gold', sph(1.0, 8), Math.cos(a) * 44, 30.4, Math.sin(a) * 44);
    }
    // the dam wall across the water
    block('stone', 260, 26, 22, 0, -2, 420);
    for (let i = -8; i <= 8; i++) {
      block('stone', 12, 18, 30, i * 15, -2, 430);
      add('grey', cyl(0.7, 0.7, 6, 6), i * 15, 26, 418);
    }
    // gardens and paths
    add('paving', box(90, 0.2, 12), 0, 6.1, 46);
    [[-52, 30], [52, 30], [-58, -10], [58, -10], [-40, 56], [40, 56], [-64, 50], [64, 50]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.6 + (i % 3) * 0.3, 'round'));
    const people = [[-8, 40], [6, 41], [-16, 36], [14, 37], [0, 44], [-24, 32], [22, 33], [-3, 34], [9, 34]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 1.6));

    ctx.light({ pos: [-90, 60, 110], target: [0, 100, 0], color: 0xffe0b0, intensity: 9000, distance: 400 });
    ctx.light({ pos: [90, 60, 100], target: [0, 100, 0], color: 0xffd0a0, intensity: 7000, distance: 400 });
  }
};
