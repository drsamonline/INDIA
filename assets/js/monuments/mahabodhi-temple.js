/* Mahabodhi Temple — Bodh Gaya · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'mahabodhi-temple',
  accent: '#c8b49a',
  accent2: '#e8d8c0',
  seed: 73,
  time: 16.8,
  bounds: 55,
  minDist: 12,
  maxDist: 200,
  home: { pos: [-38, 21, 58], target: [0, 22, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8f9a66 },
  views: [
    { name: 'Full', pos: [-38, 21, 58], target: [0, 22, 0] },
    { name: 'Tower', pos: [-8, 22, 22], target: [0, 26, 0] },
    { name: 'From the east', pos: [26, 12, 30], target: [0, 18, 0] },
    { name: 'Bodhi tree', pos: [-14, 8, 6], target: [-12, 10, -8] },
    { name: 'Railing', pos: [16, 5, 20], target: [4, 4, 2] }
  ],
  tour: [
    {
      title: 'Where the Buddha Woke', deva: 'महाबोधि मंदिर',
      text: 'The Mahabodhi Temple stands at Bodh Gaya, beside the tree under which the Buddha is said to have attained enlightenment. Ashoka built a shrine here in the 3rd century BCE; the present temple is usually dated to the 5th or 6th century CE.',
      pos: [-38, 21, 58], target: [0, 22, 0], time: 16.8
    },
    {
      title: 'Brick and Plaster', deva: 'ईंट',
      text: 'The tower rises about 52 metres, straight-sided and tapering, built of brick and covered in plaster, its faces crowded with niches holding images of the Buddha. It is one of the oldest brick temples surviving in India.',
      pos: [-8, 22, 22], target: [0, 26, 0], time: 12
    },
    {
      title: 'The Vajrasana', deva: 'वज्रासन',
      text: 'Inside, a polished stone seat marks the place of enlightenment, and the shrine is in continuous worship after more than a thousand years.',
      pos: [26, 12, 30], target: [0, 18, 0], time: 9.6
    },
    {
      title: 'The Bodhi Tree', deva: 'बोधि वृक्ष',
      text: 'To the west stands a descendant of the original pipal tree, grown from a cutting taken to Sri Lanka by Ashoka’s daughter Sanghamitta and brought back. Pilgrims circle it on a raised platform.',
      pos: [-14, 8, 6], target: [-12, 10, -8], time: 17.2
    },
    {
      title: 'The Stone Railing', deva: 'वेदिका',
      text: 'A carved stone railing surrounds the site, parts of it from the Mauryan period — among the oldest sculpture in India.',
      pos: [16, 5, 20], target: [4, 4, 2], time: 10.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'The temple was inscribed as a UNESCO World Heritage Site in 2002, and at night it is lit for the pilgrims who keep arriving through the evening.',
      pos: [-34, 19, 52], target: [0, 22, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus } = ctx;

    /* ---- the terrace and the railing -------------------------------------- */
    block('stone', 46, 1.2, 42, 0, 0, 0);
    add('paving', box(44, 0.2, 40), 0, 1.2, 0);
    // the carved vedika railing
    for (let i = 0; i < 22; i++) {
      const x = -21 + i * 2;
      [21, -21].forEach((z) => {
        add('sandstoneBuff', box(0.55, 2.2, 0.55), x, 2.3, z);
        add('sandstoneBuff', box(0.6, 0.22, 1.1), x, 3.5, z);
      });
    }
    for (let i = 0; i < 20; i++) {
      const z = -20 + i * 2.1;
      [-21, 21].forEach((x) => {
        add('sandstoneBuff', box(0.55, 2.2, 0.55), x, 2.3, z);
        add('sandstoneBuff', box(1.1, 0.22, 0.6), x, 3.5, z);
      });
    }

    /* ---- the temple -------------------------------------------------------- */
    const bx = 0, bz = -4;
    block('plaster', 18, 4.4, 18, bx, 1.2, bz);
    add('plasterWhite', box(18.6, 0.4, 18.6), bx, 5.6, bz);
    // the great entrance arch on the east face
    add('dark', arch(5.0, 8.0, 0.4), bx, 1.6, bz + 9.1);
    add('plaster', archFrame(5.8, 8.7, 0.42, 0.5), bx, 1.6, bz + 9.2);
    // the tower: straight-sided and tapering, in bands
    let y = 5.9, w = 15.0;
    for (let i = 0; i < 12; i++) {
      const h = 3.3;
      block('plaster', w, h, w, bx, y, bz);
      add('sandstoneBuff', box(w + 0.16, 0.3, w + 0.16), bx, y + h, bz);
      // niches on each face
      const n = Math.max(2, Math.round(w / 2.6));
      for (let k = 0; k < n; k++) {
        const off = (k - (n - 1) / 2) * (w / n);
        add('dark', box(0.7, 1.5, 0.18), bx + off, y + 1.5, bz + w / 2 + 0.02);
        add('dark', box(0.7, 1.5, 0.18), bx + off, y + 1.5, bz - w / 2 - 0.02);
        add('dark', box(0.18, 1.5, 0.7), bx + w / 2 + 0.02, y + 1.5, bz + off);
        add('dark', box(0.18, 1.5, 0.7), bx - w / 2 - 0.02, y + 1.5, bz + off);
      }
      y += h + 0.3;
      w *= 0.955;
    }
    // the rounded crown and finial
    add('sandstoneBuff', cyl(w * 0.62, w * 0.78, 1.2, 12), bx, y + 0.6, bz);
    add('plasterWhite', dome(w * 0.6, w * 0.72, 18), bx, y + 1.2, bz);
    add('sandstoneBuff', cyl(0.5, 0.7, 1.6, 8), bx, y + 1.2 + w * 0.72, bz);
    add('gold', sph(0.42, 10), bx, y + 3.0 + w * 0.72, bz);
    add('gold', cone(0.24, 1.2, 6), bx, y + 3.8 + w * 0.72, bz);

    /* ---- the Bodhi tree and its platform ------------------------------------ */
    (function bodhi(tx, tz) {
      add('stone', box(12, 0.9, 12), tx, 1.2, tz);
      add('marble', box(12.4, 0.2, 12.4), tx, 2.1, tz);
      // trunk and roots
      add('bark', cyl(0.85, 1.35, 6.4, 9), tx, 5.4, tz);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add('bark', cyl(0.3, 0.5, 2.2, 6), tx + Math.cos(a) * 1.0, 3.0, tz + Math.sin(a) * 1.0, { rz: Math.cos(a) * 0.5, rx: -Math.sin(a) * 0.5 });
      }
      // the canopy: wide and flat, as a pipal grows
      [[0, 9.6, 0, 5.4], [3.4, 9.0, 1.2, 3.6], [-3.6, 9.2, -0.8, 3.8], [0.8, 10.6, -3.0, 3.0],
       [-1.2, 10.4, 3.2, 3.1], [0, 8.4, 0, 3.4]]
        .forEach(([dx, dy, dz, r]) => add('foliage', sph(r, 10), tx + dx, dy, tz + dz, { sy: 0.5 }));
      // prayer flags and a small shrine
      add('fabricSaffron', box(0.1, 3.0, 0.1), tx + 5.4, 3.6, tz + 5.4);
      add('fabricSaffron', box(1.4, 0.9, 0.08), tx + 5.9, 4.4, tz + 5.4);
    })(-13, -2);

    /* ---- smaller stupas and shrines ---------------------------------------- */
    [[-14, 12, 1.0], [-10, 15, 0.8], [14, 13, 0.9], [17, 9, 0.7], [-17, 8, 0.75], [12, 17, 0.7]].forEach(([x, z, s]) => {
      add('stone', cyl(1.5 * s, 1.8 * s, 1.2 * s, 12), x, 1.2 + 0.6 * s, z);
      add('plasterWhite', dome(1.5 * s, 1.4 * s, 14), x, 1.2 + 1.2 * s, z);
      add('sandstoneBuff', box(0.5 * s, 0.5 * s, 0.5 * s), x, 1.2 + 2.5 * s, z);
      add('gold', cone(0.2 * s, 0.5 * s, 6), x, 1.2 + 3.0 * s, z);
    });
    // lotus pond
    add('stone', cyl(5.2, 5.4, 0.7, 20), 15, 1.5, -12);
    add('water', cyl(4.6, 4.6, 0.2, 20), 15, 1.9, -12);

    /* ---- grounds ------------------------------------------------------------ */
    const people = [[-6, 14], [6, 15], [-14, 18], [14, 18], [0, 20], [-20, 14], [20, 14], [-3, 10],
      [9, 10], [-9, 22], [11, 22], [17, 5], [-17, 4]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricSaffron', 'fabricWhite', 'fabricRed'][i % 3], 0.95));
    [[-24, 18], [24, 18], [-24, 2], [24, 2], [0, 26]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-30, 22], [30, 22], [-32, 0], [32, 0], [-28, -18], [28, -18], [-20, 26], [20, 26]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.15 + (i % 3) * 0.15, 'round'));

    ctx.light({ pos: [-20, 14, 24], target: [0, 22, 0], color: 0xffd0a0, intensity: 2600, distance: 150 });
    ctx.light({ pos: [20, 14, 20], target: [0, 22, 0], color: 0xffc890, intensity: 2200, distance: 150 });
  }
};
