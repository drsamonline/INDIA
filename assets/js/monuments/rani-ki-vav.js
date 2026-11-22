/* Rani ki Vav — Patan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'rani-ki-vav',
  accent: '#c8a06a',
  accent2: '#e0c090',
  seed: 61,
  time: 16.4,
  bounds: 55,
  minDist: 12,
  maxDist: 200,
  home: { pos: [30, 36, 42], target: [0, 2, -6], fov: 42 },
  ground: { texture: 'paving', size: 2400, color: 0xb8a888 },
  views: [
    { name: 'Full', pos: [30, 36, 42], target: [0, 2, -6] },
    { name: 'From above', pos: [10, 52, 24], target: [0, 0, -4] },
    { name: 'Terraces', pos: [14, 13, 16], target: [0, 4, -4] },
    { name: 'Carving', pos: [8, 7, 12], target: [4, 6, 0] },
    { name: 'The well', pos: [4, 14, -18], target: [0, 6, -14] }
  ],
  tour: [
    {
      title: 'The Queen’s Stepwell', deva: 'रानी की वाव',
      text: 'Rani ki Vav was built at Patan in 1063 by Queen Udayamati in memory of her husband Bhima I of the Chaulukya, or Solanki, dynasty. It runs 64 metres long and about 20 metres wide, some 28 metres deep, with seven levels of steps — a temple turned upside down, its sanctum at the water.',
      pos: [30, 36, 42], target: [0, 2, -6], time: 16.4
    },
    {
      title: 'Seven Levels', deva: 'सात स्तर',
      text: 'The well descends in seven terraces, each narrower than the one above, so that from the rim the whole structure reads as a stepped funnel of stone down to the water.',
      pos: [10, 52, 24], target: [0, 0, -4], time: 12
    },
    {
      title: 'A Temple Upside Down', deva: 'उल्टा मंदिर',
      text: 'The stepwell was designed as a temple inverted. Avatars of Vishnu, apsaras, nagkanyas and Jain monks cover the walls, and the water at the lowest level takes the place of the sanctum.',
      pos: [14, 13, 16], target: [0, 4, -4], time: 9.6
    },
    {
      title: 'Five Hundred Figures', deva: 'मूर्तियाँ',
      text: 'More than five hundred major sculptures line the walls and the faces of the terraces, among them a great reclining Vishnu in the water. The carving is among the finest of the Māru-Gurjara school.',
      pos: [8, 7, 12], target: [4, 6, 0], time: 11
    },
    {
      title: 'Buried and Found', deva: 'पुनर्खोज',
      text: 'The Saraswati river silted over the stepwell and buried it for centuries. It was cleared in the 1950s and restored, then inscribed as a UNESCO World Heritage Site in 2014. It now appears on the reverse of the ₹100 note.',
      pos: [4, 14, -18], target: [0, 6, -14], time: 17.2
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit from the rim, the terraces read as a flight of golden steps going down into the dark.',
      pos: [26, 30, 38], target: [0, 2, -6], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    const H = 11;          // depth of the well, from rim to floor
    const W = 24;          // court width
    const L = 46;          // court length

    /* ---- the terrace the well is cut into -------------------------------- */
    // side masses
    block('sandstoneBuff', 9, H, L + 16, -(W / 2 + 4.5), 0, 0);
    block('sandstoneBuff', 9, H, L + 16, (W / 2 + 4.5), 0, 0);
    block('sandstoneBuff', W + 18, H, 8, 0, 0, -(L / 2 + 4));
    // merlons along the rim
    for (let i = 0; i < 18; i++) {
      const z = (i - 8.5) * 2.6;
      [-1, 1].forEach((s2) => add('sandstoneRed', box(0.7, 0.75, 0.7), s2 * (W / 2 + 0.4), H + 1.1, z));
    }
    // parapet around the rim
    [[-(W / 2 + 0.4), 0, Math.PI / 2, L + 2], [(W / 2 + 0.4), 0, Math.PI / 2, L + 2],
     [0, -(L / 2 + 0.4), 0, W + 2]].forEach(([x, z, ry, len]) => {
      add('sandstoneRed', box(len, 0.7, 0.7), x, H + 0.35, z, { ry });
      add('marble', box(len, 0.12, 0.9), x, H + 0.76, z, { ry });
    });

    /* ---- the descending terraces ----------------------------------------- */
    const LEVELS = 7;
    for (let i = 0; i < LEVELS; i++) {
      const y = H - (i * H) / LEVELS;
      const inset = i * 1.55;
      const len = L - i * 3.2;
      // a ledge on each side, and the riser behind it
      [-1, 1].forEach((s) => {
        const x = s * (W / 2 - inset - 1.2);
        add('sandstoneBuff', box(2.6, 0.9, len), x, y - 0.45, 0);
        add('sandstoneRed', box(2.9, 0.14, len), x, y - 0.86, 0);
        // carved panel on the riser face
        const n = Math.max(3, Math.round(len / 3.0));
        for (let k = 0; k < n; k++) {
          const z = (k - (n - 1) / 2) * 3.0;
          add('dark', box(0.14, 1.3, 0.9), x - s * 1.32, y - 1.6, z);
          add('sandstoneBuff', box(0.22, 1.7, 0.55), x - s * 1.42, y - 1.6, z - 1.05);
          add('marble', box(0.16, 1.5, 0.5), x - s * 1.44, y - 1.6, z + 1.05);
        }
      });
      // carved brackets under each ledge
      [-1, 1].forEach((s2) => {
        const x = s2 * (W / 2 - inset - 1.2);
        const nb = Math.max(3, Math.round(len / 2.6));
        for (let k = 0; k < nb; k++) {
          const z = (k - (nb - 1) / 2) * 2.6;
          add('sandstoneBuff', box(0.5, 0.7, 0.35), x - s2 * 1.1, y - 1.05, z, { rz: s2 * 0.4 });
        }
      });
      // a row of small figures on the outer wall above the ledge
      [-1, 1].forEach((s2) => {
        const x = s2 * (W / 2 + 0.55);
        const nf = Math.max(3, Math.round(len / 2.2));
        for (let k = 0; k < nf; k++) {
          const z = (k - (nf - 1) / 2) * 2.2;
          add('marble', box(0.16, 1.1, 0.55), x, y + 0.5, z);
          add('sandstoneBuff', sph(0.2, 6), x, y + 1.2, z);
        }
      });
      // the transverse steps at the far end
      add('sandstoneBuff', box(W - inset * 2, 0.9, 1.4), 0, y - 0.45, -(len / 2 - 0.7));
    }

    /* ---- the floor, the water and the shaft ------------------------------- */
    add('sandstoneBuff', box(W, 0.4, L), 0, 0.2, 0);
    add('water', box(W - 6, 0.1, L * 0.34), 0, 0.44, -L * 0.24);
    // the circular well shaft at the far end
    add('sandstoneBuff', cyl(5.6, 6.2, H, 26), 0, H / 2, -(L / 2 - 3));
    add('dark', cyl(4.4, 4.4, H + 0.2, 26), 0, H / 2 + 0.1, -(L / 2 - 3));
    add('marble', cyl(6.0, 5.8, 0.3, 26), 0, H + 0.15, -(L / 2 - 3));
    // a small pavilion over the shaft
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      add('sandstoneBuff', cyl(0.3, 0.36, 4.2, 6), Math.cos(a) * 5.0, H + 2.4, -(L / 2 - 3) + Math.sin(a) * 5.0);
    }
    add('sandstoneBuff', cyl(5.6, 5.6, 0.5, 16), 0, H + 4.75, -(L / 2 - 3));
    add('sandstoneBuff', dome(5.0, 3.4, 20), 0, H + 5.0, -(L / 2 - 3));
    add('gold', sph(0.28, 8), 0, H + 8.6, -(L / 2 - 3));

    /* ---- a low gatehouse on the near rim ---------------------------------- */
    block('sandstoneBuff', 12, 4.2, 4, 0, H, L / 2 + 2);
    add('dark', box(4.2, 3.0, 0.4), 0, H + 1.5, L / 2 + 4.1);
    add('marble', box(5.4, 0.4, 0.6), 0, H + 3.1, L / 2 + 4.2);
    add('sandstoneBuff', dome(3.4, 2.2, 16), 0, H + 4.4, L / 2 + 2);
    add('gold', sph(0.22, 8), 0, H + 6.6, L / 2 + 2);
    for (let i2 = 0; i2 < 6; i2++) {
      add('sandstoneBuff', box(6.0, 0.5, 1.0), 0, H - 0.4 - i2 * (H / 8), L / 2 - 0.4 - i2 * 0.9);
    }

    /* ---- grounds ---------------------------------------------------------- */
    const people = [[-10, 24], [9, 22], [-6, 16], [11, 14], [0, 28], [-14, 8], [15, 6], [-2, 20], [5, 26]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-18, 20], [18, 20], [-18, 0], [18, 0], [0, 32]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-24, 26], [24, 26], [-26, 4], [26, 4], [-20, -24], [20, -24]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.1 + (i % 3) * 0.15, 'round'));

    ctx.light({ pos: [-14, 16, 20], target: [0, 6, 0], color: 0xffd0a0, intensity: 2200, distance: 110 });
    ctx.light({ pos: [14, 16, 16], target: [0, 6, 0], color: 0xffc890, intensity: 1900, distance: 110 });
  }
};
