/* Hawa Mahal — Jaipur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'hawa-mahal',
  accent: '#e0895f',
  accent2: '#f3b48a',
  seed: 23,
  time: 14.6,
  bounds: 46,
  minDist: 12,
  maxDist: 180,
  home: { pos: [20, 12, 40], target: [0, 9, 2], fov: 42 },
  ground: { texture: 'paving', size: 2400, color: 0xc8b79c },
  views: [
    { name: 'Full', pos: [20, 12, 40], target: [0, 9, 2] },
    { name: 'Facade', pos: [0, 9, 26], target: [0, 9, 2] },
    { name: 'Jharokhas', pos: [7, 13, 16], target: [2, 12, 2] },
    { name: 'Crown', pos: [6, 21, 18], target: [0, 17, 2] },
    { name: 'Street', pos: [-24, 3.2, 22], target: [0, 8, 2] }
  ],
  tour: [
    {
      title: 'The Palace of Winds', deva: 'हवा महल',
      text: 'Maharaja Sawai Pratap Singh built the Hawa Mahal in 1799 as an extension of the City Palace, reaching towards the women\'s quarters. Its five storeys rise like a pyramid, shaped — it is said — after the crown of Krishna.',
      pos: [20, 12, 40], target: [0, 9, 2], time: 17.3
    },
    {
      title: '953 Windows', deva: '९५३ झरोखे',
      text: 'The facade is a honeycomb of 953 small jharokha windows in carved sandstone. From behind these screens the women of the court could watch the street and its festivals without being seen.',
      pos: [0, 9, 26], target: [0, 9, 2], time: 12
    },
    {
      title: 'A Wall That Breathes', deva: 'हवा',
      text: 'The lattice is a working cooling system. Air passes through the pierced screens and the small chambers behind them, and fountains once cooled the interior further — which is how the palace earned its name.',
      pos: [7, 13, 16], target: [2, 12, 2], time: 9.6
    },
    {
      title: 'Crown of the Facade', deva: 'मुकुट',
      text: 'The top storey carries a cusped arch crowned by a small dome and finial, with domed chhatris at the ends of each tier. The whole screen is only a few metres deep; the palace behind it is a thin, curved wall.',
      pos: [6, 21, 18], target: [0, 17, 2], time: 16.8
    },
    {
      title: 'The Bazaar Below', deva: 'बाज़ार',
      text: 'Hawa Mahal faces the busiest lane of the old city, part of the walled town laid out by Sawai Jai Singh II in 1727. In 2019 the city of Jaipur was inscribed as a UNESCO World Heritage Site.',
      pos: [-24, 3.2, 22], target: [0, 8, 2], time: 17.9
    },
    {
      title: 'Pink at Dusk', deva: 'गुलाबी',
      text: 'The building is made of red and pink sandstone, the colour that gave Jaipur its name, the Pink City. At dusk the screens turn from rose to deep terracotta, and the lamps along the lane come up.',
      pos: [16, 11, 34], target: [0, 9, 2], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, dome, onion, arch, archFrame, block, sph } = ctx;

    /* ---- the screen facade -------------------------------------------- */
    const BAY = 2.15;            // bay width
    const BAYS = 19;             // bays in the bottom tier
    const TIER_H = 2.85;
    const BASE_Y = 1.15;
    const Z = 0;                 // facade plane

    // plinth
    block('sandstonePink', 44, BASE_Y, 12, 0, 0, Z - 4);
    add('stone', box(44.6, 0.22, 12.6), 0, BASE_Y, Z - 4);

    for (let t = 0; t < 5; t++) {
      const y = BASE_Y + t * TIER_H;
      const n = BAYS - t * 2;
      const w = n * BAY;
      const depth = 5.2 - t * 0.55;
      const zf = Z - t * 0.62;
      // solid body behind the screen
      block('sandstonePink', w, TIER_H, depth, 0, y, zf - depth / 2 - 0.25);
      // carved band at the foot of the tier
      add('marble', box(w + 0.6, 0.16, 0.62), 0, y + 0.08, zf + 0.28);
      add('sandstoneRed', box(w + 0.4, 0.1, 0.5), 0, y + 0.2, zf + 0.26);

      for (let i = 0; i < n; i++) {
        const x = (i - (n - 1) / 2) * BAY;
        // the jharokha projects: a shallow box, a balcony slab, two niches
        add('sandstonePink', box(BAY * 0.84, TIER_H * 0.76, 0.46), x, y + TIER_H * 0.4, zf + 0.24);
        add('marble', box(BAY * 0.94, 0.11, 0.66), x, y + 0.4, zf + 0.3);
        add('sandstoneRed', box(BAY * 0.94, 0.07, 0.6), x, y + 0.31, zf + 0.3);
        // lower opening, screened
        add('dark', arch(0.8, 1.06, 0.16), x, y + 0.52, zf + 0.44);
        add('jali', arch(0.76, 1.02, 0.05), x, y + 0.54, zf + 0.58);
        add('marble', archFrame(1.02, 1.28, 0.085, 0.1), x, y + 0.52, zf + 0.42);
        // upper opening, smaller
        add('dark', arch(0.58, 0.78, 0.14), x, y + 1.78, zf + 0.44);
        add('jali', arch(0.54, 0.74, 0.05), x, y + 1.8, zf + 0.57);
        add('marble', archFrame(0.78, 0.98, 0.075, 0.1), x, y + 1.78, zf + 0.42);
        // canopy and finial over the bay
        add('marble', cyl(0.24, 0.28, 0.09, 8), x, y + TIER_H * 0.84, zf + 0.3);
        add('marble', dome(0.25, 0.22, 10), x, y + TIER_H * 0.88, zf + 0.3);
        add('gold', cyl(0.022, 0.022, 0.14, 5), x, y + TIER_H * 0.88 + 0.24, zf + 0.3);
        // pilaster between bays
        if (i > 0) add('marble', box(0.12, TIER_H * 0.9, 0.26), x - BAY / 2, y + TIER_H * 0.47, zf + 0.2);
      }
      // white cornice band
      add('marble', box(w + 0.7, 0.2, 0.72), 0, y + TIER_H - 0.05, zf + 0.12);
      add('marble', box(w + 0.35, 0.12, 0.52), 0, y + TIER_H - 0.42, zf + 0.1);
      // end chhatris
      [-1, 1].forEach((s2) => {
        const ex = s2 * (w / 2 - 0.3);
        add('sandstonePink', cyl(0.44, 0.5, 0.55, 8), ex, y + TIER_H + 0.27, zf - 0.4);
        add('marble', dome(0.46, 0.52, 12), ex, y + TIER_H + 0.54, zf - 0.4);
        add('gold', cyl(0.04, 0.04, 0.2, 5), ex, y + TIER_H + 1.08, zf - 0.4);
      });
    }

    /* ---- cusped crown over the central bay ---------------------------- */
    const topY = BASE_Y + 5 * TIER_H;
    add('sandstonePink', box(6.4, 1.0, 4.2), 0, topY + 0.5, -1.6);
    add('dark', arch(2.3, 2.5, 0.3), 0, topY + 0.9, 0.15);
    add('jali', arch(2.2, 2.4, 0.05), 0, topY + 0.95, 0.47);
    add('marble', archFrame(2.9, 2.95, 0.18, 0.3), 0, topY + 0.9, 0.1);
    add('marble', box(6.9, 0.26, 4.6), 0, topY + 1.05, -1.6);
    add('sandstonePink', cyl(1.5, 1.75, 1.0, 12), 0, topY + 1.8, -1.4);
    add('marble', onion(1.6, 2.2, 22), 0, topY + 2.3, -1.4);
    add('gold', cyl(0.07, 0.07, 1.1, 6), 0, topY + 4.4, -1.4);
    add('gold', sph(0.16, 8), 0, topY + 5.0, -1.4);
    [-2.9, 2.9].forEach((x) => {
      add('marble', cyl(0.36, 0.4, 0.9, 8), x, topY + 1.5, -1.4);
      add('marble', dome(0.42, 0.46, 10), x, topY + 1.95, -1.4);
    });

    /* ---- the palace behind ------------------------------------------- */
    block('sandstonePink', 30, 13, 16, 0, 0, -12);
    add('marble', box(30.4, 0.3, 16.4), 0, 13, -12);
    for (let i = 0; i < 7; i++) {
      const x = -12 + i * 4;
      add('dark', arch(1.6, 2.6, 0.2), x, 0.2, -3.95);
      add('marble', archFrame(2.0, 3.0, 0.14, 0.2), x, 0.2, -4.0);
      add('dark', box(1.1, 1.5, 0.2), x, 8.5, -3.95);
    }
    // rear courtyard wall
    block('sandstonePink', 34, 2.4, 0.8, 0, 0, -21);

    /* ---- street, bazaar, life ---------------------------------------- */
    add('paving', ctx.plane(120, 26), 0, 0.05, 14, { rx: -Math.PI / 2 });
    // bazaar awnings opposite
    for (let i = 0; i < 8; i++) {
      const x = -21 + i * 6;
      block('plaster', 4.6, 2.6, 3.0, x, 0, 30);
      add(i % 2 ? 'fabricRed' : 'fabricSaffron', box(4.9, 0.1, 3.4), x, 2.7, 29.6, { rx: -0.14 });
      add('dark', box(1.1, 1.6, 0.14), x, 0.1, 28.45);
    }
    const people = [[-8, 10], [-3, 8.5], [2, 11], [7, 9], [-13, 12], [12, 12.5], [0, 7.6], [16, 10.5],
      [-17, 8], [5, 6.5], [-5, 13], [9, 7.2]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.3, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.82));
    [[-19, 6], [19, 6], [-11, 18], [11, 18], [0, 19], [-24, 14]].forEach(([x, z]) => ctx.lamp(x, z, 3.0, 'black'));
    [[-26, 4], [26, 5], [-30, 16], [30, 15]].forEach(([x, z], i) => ctx.tree(x, z, 1.0 + (i % 2) * 0.2, 'round'));

    /* ---- lights ------------------------------------------------------ */
    ctx.light({ pos: [-16, 9, 22], target: [0, 11, 0], color: 0xffd0a0, intensity: 1900, distance: 120 });
    ctx.light({ pos: [16, 9, 22], target: [0, 11, 0], color: 0xffc890, intensity: 1900, distance: 120 });
  }
};
