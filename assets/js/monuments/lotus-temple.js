/* Lotus Temple — New Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'lotus-temple',
  accent: '#d8d2c4',
  accent2: '#f0e8d8',
  seed: 53,
  time: 16.4,
  bounds: 60,
  minDist: 16,
  maxDist: 220,
  home: { pos: [40, 21, 56], target: [0, 10, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8d9a63 },
  views: [
    { name: 'Full', pos: [40, 21, 56], target: [0, 10, 0] },
    { name: 'Petals', pos: [18, 24, 30], target: [0, 15, 0] },
    { name: 'Approach', pos: [0, 9, 62], target: [0, 11, 0] },
    { name: 'Aerial', pos: [40, 46, 42], target: [0, 6, 0] },
    { name: 'Pools', pos: [-24, 6, 26], target: [-6, 6, 10] }
  ],
  tour: [
    {
      title: 'A House of Worship', deva: 'कमल मंदिर',
      text: 'The Lotus Temple is a Bahá’í House of Worship on the eastern edge of New Delhi, completed in 1986. Fariborz Sahba shaped it as a lotus of twenty-seven marble petals — nine in each of three rings.',
      pos: [40, 21, 56], target: [0, 10, 0], time: 17.1
    },
    {
      title: 'Twenty-Seven Petals', deva: 'कमल की पंखुड़ियाँ',
      text: 'The petals are clad in white marble and close over a hall that seats about 1,300 people. There is no altar and no pulpit: Bahá’í houses of worship are open to every faith, and the only sound inside is the reading of scriptures.',
      pos: [18, 24, 30], target: [0, 15, 0], time: 12
    },
    {
      title: 'Nine Ways In', deva: 'नौ द्वार',
      text: 'Nine paths and nine pools ring the plinth, set in twenty-six acres of gardens. The building is entered from any of them; there is no front door and no preferred direction.',
      pos: [0, 9, 62], target: [0, 11, 0], time: 9.4
    },
    {
      title: 'A Flower in Plan', deva: 'योजना',
      text: 'From above the geometry is exact: three concentric rings of nine petals, each ring leaning further inward than the one below, so the building closes like a bud at the top.',
      pos: [40, 46, 42], target: [0, 6, 0], time: 11
    },
    {
      title: 'Marble and Water', deva: 'संगमरमर',
      text: 'The petals are white marble, the paths red sandstone, and the pools hold the building’s reflection through the day. At dusk the flower is lit from below.',
      pos: [-24, 6, 26], target: [-6, 6, 10], time: 18.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Lit at night, the petals read as a single white flower above the gardens — the image most visitors carry away.',
      pos: [36, 18, 50], target: [0, 10, 0], time: 21.3
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    /* ---- plinth, pools and paths ---------------------------------------- */
    col('marble', 21, 22, 1.1, 0, 0, 0, 48);
    add('sandstoneRed', torus(21.3, 0.16, 6, 48), 0, 1.14, 0, { rx: Math.PI / 2 });
    // nine radial paths and nine pools
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      add('sandstoneRed', box(3.2, 0.14, 22), Math.cos(a) * 34, 0.08, Math.sin(a) * 34, { ry: -a });
      add('marble', cyl(4.2, 4.4, 0.5, 20), Math.cos(a + 0.35) * 29, 0.25, Math.sin(a + 0.35) * 29);
      add('water', cyl(3.7, 3.7, 0.16, 20), Math.cos(a + 0.35) * 29, 0.5, Math.sin(a + 0.35) * 29);
    }
    // garden beds between the paths
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.PI / 9;
      add('grass', box(11, 0.12, 9), Math.cos(a) * 32, 0.07, Math.sin(a) * 32, { ry: -a });
    }

    /* ---- the petals ------------------------------------------------------ */
    // a petal is a half-shell: a unit dome scaled to a leaf and leaned outward
    function petal(a, R, y, lean, w, h, t, key) {
      const g = dome(1, 1, 16);
      g.scale(w, h, t);
      add(key, g, Math.cos(a) * R, y, Math.sin(a) * R, { ry: -a, rx: -lean });
    }
    const RINGS = [
      { R: 12.4, y: 1.15, lean: 0.34, w: 4.2, h: 11.6, t: 1.0 },
      { R: 9.0, y: 1.15, lean: 0.62, w: 3.6, h: 11.8, t: 0.92 },
      { R: 5.6, y: 1.15, lean: 0.98, w: 3.0, h: 10.2, t: 0.84 },
      { R: 3.0, y: 1.15, lean: 1.32, w: 2.4, h: 8.2, t: 0.78 }
    ];
    RINGS.forEach((r, ri) => {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + (ri % 2 ? Math.PI / 9 : 0);
        petal(a, r.R, r.y, r.lean, r.w, r.h, r.t, 'marble');
        // a second, smaller petal behind each one gives the ring depth
        petal(a + 0.11, r.R * 1.02, r.y + 0.1, r.lean + 0.04, r.w * 0.92, r.h * 0.96, r.t * 0.9, 'marbleWarm');
      }
    });

    /* ---- the hall inside -------------------------------------------------- */
    add('marble', cyl(9.0, 9.4, 1.4, 36), 0, 1.2, 0);
    add('glass', cyl(7.6, 7.6, 6.8, 36), 0, 2.6, 0);
    add('marble', cyl(8.2, 7.8, 0.5, 36), 0, 9.4, 0);
    // nine doors
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      add('dark', box(2.2, 3.4, 0.4), Math.cos(a) * 7.5, 3.4, Math.sin(a) * 7.5, { ry: -a });
    }
    // the closing bud at the apex
    add('marble', cyl(2.0, 3.0, 1.4, 20), 0, 9.8, 0);
    add('marble', dome(1.9, 2.2, 20), 0, 11.2, 0);
    add('gold', sph(0.26, 10), 0, 13.6, 0);

    /* ---- the gardens ------------------------------------------------------- */
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + 0.15;
      const r = 46 + (i % 3) * 7;
      ctx.tree(Math.cos(a) * r, Math.sin(a) * r, 1.05 + (i % 4) * 0.12, i % 5 === 0 ? 'palm' : 'round');
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.35;
      ctx.lamp(Math.cos(a) * 30, Math.sin(a) * 30, 3.4, 'black');
    }
    const people = [[-6, 24], [7, 25], [-14, 18], [14, 19], [0, 27], [-20, 12], [20, 13], [-3, 18],
      [4, 17], [-11, 26], [12, 27], [17, 22]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));

    ctx.light({ pos: [-20, 10, 24], target: [0, 12, 0], color: 0xfff0d8, intensity: 2400, distance: 130 });
    ctx.light({ pos: [20, 10, 22], target: [0, 12, 0], color: 0xffe8c8, intensity: 2000, distance: 130 });
  }
};
