/* Hawa Mahal — Jaipur · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'hawa-mahal',
  accent: '#e0895f',
  accent2: '#f3b48a',
  seed: 23,
  time: 10.8,
  bounds: 46,
  minDist: 12,
  maxDist: 180,
  home: { pos: [12, 9, 32], target: [0, 8, -2], fov: 46 },
  ground: { texture: 'paving', size: 2400, color: 0xc8b79c },
  views: [
    { name: 'Full', pos: [12, 9, 32], target: [0, 8, -2] },
    { name: 'Facade', pos: [0, 8, 30], target: [0, 8, -2] },
    { name: 'Jharokhas', pos: [7, 13, 16], target: [2, 12, 2] },
    { name: 'Crown', pos: [6, 21, 18], target: [0, 17, 2] },
    { name: 'Street', pos: [-24, 3.2, 22], target: [0, 8, 2] }
  ],
  tour: [
    {
      title: 'The Palace of Winds', deva: 'हवा महल',
      text: 'Maharaja Sawai Pratap Singh built the Hawa Mahal in 1799 as an extension of the City Palace, reaching towards the women\'s quarters. Lal Chand Ustad shaped its five storeys as a pyramid, after the crown of Krishna.',
      pos: [20, 12, 40], target: [0, 9, 2], time: 17.3
    },
    {
      title: '953 Windows', deva: '९५३ झरोखे',
      text: 'The facade is a honeycomb of 953 small jharokha windows cut in sandstone. From behind those screens the women of the court watched the street and its festivals without being seen.',
      pos: [0, 9, 26], target: [0, 9, 2], time: 12
    },
    {
      title: 'A Wall That Breathes', deva: 'हवा',
      text: 'Air passes through the pierced screens and the small chambers behind them, cooling the interior, and fountains once cooled it further. That ventilation is where the name Palace of Winds comes from.',
      pos: [7, 13, 16], target: [2, 12, 2], time: 9.6
    },
    {
      title: 'Crown of the Facade', deva: 'मुकुट',
      text: 'The top storey carries a cusped arch under a small dome and finial, with domed chhatris at the ends of each tier. The whole screen is only a few metres deep; the palace behind it is a thin, curved wall.',
      pos: [6, 21, 18], target: [0, 17, 2], time: 16.8
    },
    {
      title: 'The Bazaar Below', deva: 'बाज़ार',
      text: 'Hawa Mahal faces the busiest lane of the old city, part of the walled town Sawai Jai Singh II laid out in 1727. Jaipur City was inscribed as a UNESCO World Heritage Site in 2019.',
      pos: [-24, 3.2, 22], target: [0, 8, 2], time: 17.9
    },
    {
      title: 'Pink at Dusk', deva: 'गुलाबी',
      text: 'The building is red and pink sandstone. At dusk the screens turn from rose to deep terracotta as the lamps come up along the lane.',
      pos: [16, 11, 34], target: [0, 9, 2], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, arch, archFrame, block, col } = ctx;

    const BASE = 0.9, TIER_H = 2.9, BAY = 2.3;
    const bow = (x) => -0.010 * x * x;          // the screen curves in plan

    /* ---- the street and the plinth --------------------------------------- */
    block('paving', 64, 0.6, 30, 0, -0.3, 8);
    block('sandstoneRed', 44, 0.9, 8, 0, 0, -1.4);
    add('marble', box(44.4, 0.12, 8.4), 0, 0.9, -1.4);

    /* ---- the screen: five tiers, one room deep --------------------------- */
    for (let t = 0; t < 5; t++) {
      const y = BASE + t * TIER_H;
      const bays = 17 - t * 2;
      const w = bays * BAY;
      const zf = -1.0 - t * 0.55;

      for (let i = 0; i < bays; i++) {
        const x = (i - (bays - 1) / 2) * BAY;
        const z = zf + bow(x);

        // the jharokha projects from the wall
        add('sandstonePink', box(BAY * 0.86, TIER_H * 0.80, 0.9), x, y + TIER_H * 0.40, z);
        add('marble', box(BAY * 0.92, 0.12, 1.05), x, y + 0.10, z);

        // a screened arch below, a smaller one above
        add('dark', arch(0.86, 1.30, 0.18), x, y + 0.34, z + 0.46);
        add('marble', archFrame(1.02, 1.46, 0.08, 0.10), x, y + 0.34, z + 0.44);
        add('dark', arch(0.60, 0.86, 0.14), x, y + 1.72, z + 0.46);

        // canopy and finial over each jharokha
        add('marble', cyl(0.24, 0.28, 0.08, 8), x, y + TIER_H * 0.84, z + 0.30);
        add('marble', dome(0.24, 0.20, 10), x, y + TIER_H * 0.88, z + 0.30);
        add('gold', cyl(0.02, 0.02, 0.12, 5), x, y + TIER_H * 0.88 + 0.20, z + 0.30);
      }

      // the rear wall of the one-room-deep screen
      block('sandstonePink', w, TIER_H, 0.5, 0, y, zf - 1.35);
      // white cornice above and a moulded band below
      add('marble', box(w + 0.5, 0.16, 1.5), 0, y + TIER_H - 0.08, zf + 0.2);
      add('marble', box(w + 0.3, 0.12, 1.2), 0, y + 0.04, zf + 0.3);
      // chhatris at the two ends of the tier
      [-1, 1].forEach((s) => {
        add('marble', cyl(0.52, 0.60, 0.12, 10), s * (w / 2 + 0.3), y + TIER_H - 0.02, zf + 0.1);
        add('marble', dome(0.52, 0.52, 12), s * (w / 2 + 0.3), y + TIER_H + 0.10, zf + 0.1);
        add('gold', sph(0.10, 6), s * (w / 2 + 0.3), y + TIER_H + 0.78, zf + 0.1);
      });
    }

    /* ---- the cusped crown over the central bays --------------------------- */
    const topY = BASE + 5 * TIER_H;
    block('sandstonePink', 10.4, 3.2, 2.6, 0, topY, -3.2);
    add('dark', arch(5.8, 2.7, 0.3), 0, topY + 0.2, -2.0);
    add('marble', archFrame(6.6, 3.0, 0.30, 0.34), 0, topY + 0.2, -1.9);
    add('marble', box(11.2, 0.22, 3.0), 0, topY + 3.3, -3.2);
    [-1, 1].forEach((s) => {
      add('marble', cyl(0.5, 0.6, 0.7, 8), s * 5.4, topY + 3.7, -3.2);
      add('marble', dome(0.5, 0.55, 12), s * 5.4, topY + 4.05, -3.2);
      add('gold', sph(0.10, 6), s * 5.4, topY + 4.75, -3.2);
    });
    add('gold', sph(0.16, 8), 0, topY + 3.95, -3.2);

    /* ---- the palace mass behind, lower than the screen -------------------- */
    block('sandstonePink', 40, 8.5, 12, 0, 1.4, -9.6);
    add('marble', box(41, 0.4, 13), 0, 9.9, -9.6);
    for (let i = -6; i <= 6; i++) add('dark', box(1.1, 1.6, 0.16), i * 3.0, 6.4, -3.5);

    /* ---- the bazaar street ------------------------------------------------ */
    for (let i = -4; i <= 4; i++) {
      const x = i * 5.2;
      block(i % 2 ? 'sandstoneBuff' : 'plaster', 4.2, 2.6, 3.0, x, 0.2, 13);
      add('fabricSaffron', box(4.6, 0.14, 3.4), x, 2.9, 13);
      add('dark', box(2.0, 1.4, 0.2), x, 1.2, 11.4);
    }
    const people = [[-8, 8], [6, 9], [-14, 6], [14, 7], [0, 10], [-18, 9], [18, 9], [-3, 6], [9, 5]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-20, 10], [20, 10], [-10, 11], [10, 11]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-26, 14], [26, 14], [-30, 4], [30, 4]].forEach(([x, z], i) => ctx.tree(x, z, 1.2, 'round'));

    ctx.light({ pos: [-20, 9, 16], target: [0, 8, 0], color: 0xffd0a0, intensity: 2600, distance: 140 });
    ctx.light({ pos: [20, 9, 14], target: [0, 8, 0], color: 0xffc890, intensity: 2200, distance: 140 });
  }
};
