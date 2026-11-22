/* Basilica of Bom Jesus — Old Goa · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'basilica-bom-jesus',
  accent: '#c0a68c',
  accent2: '#e0cdb8',
  seed: 97,
  time: 15.8,
  bounds: 60,
  minDist: 14,
  maxDist: 220,
  home: { pos: [30, 15, 62], target: [0, 14, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8b9a63, tile: 18 },
  views: [
    { name: 'Full', pos: [30, 15, 62], target: [0, 14, 0] },
    { name: 'Facade', pos: [4, 13, 42], target: [0, 15, 0] },
    { name: 'Portal', pos: [0, 6, 26], target: [0, 8, 0] },
    { name: 'Nave', pos: [26, 12, 18], target: [0, 10, -6] },
    { name: 'From the square', pos: [-34, 9, 40], target: [0, 14, 0] }
  ],
  tour: [
    {
      title: 'Bom Jesus', deva: 'बॉम जीसस',
      text: 'The Basilica of Bom Jesus was begun in 1594 and consecrated in 1605, in the Portuguese capital of Old Goa. It is one of the earliest baroque churches in India.',
      pos: [30, 15, 62], target: [0, 14, 0], time: 15.8
    },
    {
      title: 'Laterite and Lime', deva: 'लेटराइट',
      text: 'The church is built of laterite, a soft iron-rich stone quarried locally, faced with lime plaster. The facade rises in tiers of Ionic, Doric and Corinthian columns to a central pediment.',
      pos: [4, 13, 42], target: [0, 15, 0], time: 12
    },
    {
      title: 'Three Portals', deva: 'द्वार',
      text: 'Three doors open through the facade; the central one is the tallest, framed by pilasters and a carved pediment, with the Jesuit emblem above it.',
      pos: [0, 6, 26], target: [0, 8, 0], time: 9.6
    },
    {
      title: 'The Casket', deva: 'अवशेष',
      text: 'Inside, gilded altars and a painted ceiling frame the chapel that holds the silver casket of St Francis Xavier, who died off the China coast in 1552. His relics are displayed every ten years.',
      pos: [26, 12, 18], target: [0, 10, -6], time: 10.6
    },
    {
      title: 'Old Goa', deva: 'पुराना गोवा',
      text: 'In 1986 the basilica was inscribed, with the other churches and convents of Old Goa, as a UNESCO World Heritage Site. It was made a minor basilica in 1946, the first in India.',
      pos: [-34, 9, 40], target: [0, 14, 0], time: 17.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit, the white plaster turns gold and the facade reads as a set of stacked pediments against the dark.',
      pos: [26, 13, 54], target: [0, 14, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus } = ctx;

    const wall = 'plasterWhite', trim = 'plaster', base = 'basaltDark';

    /* ---- plinth and forecourt -------------------------------------------- */
    block(base, 44, 1.0, 30, 0, 0, -4);
    add('paving', box(44, 0.2, 22), 0, 1.0, 16);
    for (let i = 0; i < 3; i++) add(trim, box(12 - i * 1.2, 0.3, 1.2), 0, 0.3 + i * 0.3, 6.4 + i * 1.0);

    /* ---- the nave --------------------------------------------------------- */
    const W = 24, H = 15, D = 34;
    block(wall, W, H, D, 0, 1.0, -12);
    add(trim, box(W + 1.2, 0.7, D + 1.2), 0, 1.0 + H, -12);
    // buttresses down the flanks
    for (let i = -2; i <= 2; i++) {
      [-1, 1].forEach((s) => {
        add(wall, box(1.6, H * 0.9, 3.0), s * (W / 2 + 0.5), 1.0 + H * 0.45, -12 + i * 6.4);
        add(trim, box(1.9, 0.5, 3.3), s * (W / 2 + 0.5), 1.0 + H * 0.9, -12 + i * 6.4);
      });
    }
    // side windows
    for (let i = -1; i <= 1; i++) {
      [-1, 1].forEach((s) => {
        add('dark', arch(2.0, 3.6, 0.2), s * (W / 2 + 0.02), 6.0, -12 + i * 8.5, { ry: s > 0 ? Math.PI / 2 : -Math.PI / 2 });
      });
    }
    // tiled roof
    add('terracotta', box(W + 1.6, 0.5, D + 1.6), 0, 1.0 + H + 0.6, -12);

    /* ---- the baroque facade ---------------------------------------------- */
    const fz = 5.0;
    // first tier: three portals between paired columns
    add(wall, box(W + 1.0, 6.4, 1.6), 0, 1.0, fz);
    [-1, 1].forEach((s) => {
      add(trim, cyl(0.55, 0.65, 5.4, 10), s * 9.6, 3.7, fz + 0.9);
      add(trim, cyl(0.55, 0.65, 5.4, 10), s * 6.2, 3.7, fz + 0.9);
      add(trim, box(1.6, 0.4, 1.6), s * 9.6, 6.5, fz + 0.9);
    });
    add('dark', arch(4.4, 6.0, 0.4), 0, 1.2, fz + 0.7);
    add(trim, archFrame(5.2, 6.6, 0.4, 0.42), 0, 1.2, fz + 0.75);
    [-1, 1].forEach((s) => {
      add('dark', arch(2.6, 4.0, 0.3), s * 7.6, 1.2, fz + 0.7);
      add(trim, archFrame(3.1, 4.4, 0.28, 0.3), s * 7.6, 1.2, fz + 0.75);
    });
    // second tier
    add(wall, box(W - 2.0, 5.4, 1.4), 0, 7.4, fz - 0.2);
    [-1, 1].forEach((s) => {
      add(trim, cyl(0.5, 0.6, 4.6, 10), s * 8.4, 9.6, fz + 0.6);
      add(trim, cyl(0.5, 0.6, 4.6, 10), s * 4.4, 9.6, fz + 0.6);
    });
    add('dark', arch(2.4, 3.8, 0.3), 0, 7.6, fz + 0.6);
    add(trim, archFrame(2.9, 4.2, 0.26, 0.28), 0, 7.6, fz + 0.65);
    // cornice and the crowning pediment
    add(trim, box(W + 1.4, 0.6, 2.0), 0, 12.8, fz - 0.1);
    add(wall, box(11.0, 2.6, 1.2), 0, 13.1, fz - 0.4);
    add(trim, box(11.6, 0.4, 1.5), 0, 15.7, fz - 0.4);
    // the triangular gable, built from stepped slabs
    [0, 1, 2, 3].forEach((i) => {
      add(wall, box(8.6 - i * 1.9, 1.0, 1.0), 0, 15.9 + i * 0.95, fz - 0.5);
      add(trim, box(9.0 - i * 1.9, 0.16, 1.2), 0, 16.4 + i * 0.95, fz - 0.5);
    });
    add('gold', cyl(0.2, 0.26, 1.6, 8), 0, 20.2, fz - 0.5);
    add('gold', sph(0.32, 10), 0, 21.1, fz - 0.5);
    // volutes flanking the pediment
    [-1, 1].forEach((s) => {
      add(trim, torus(1.5, 0.35, 6, 14), s * 6.6, 14.2, fz - 0.3, { rz: Math.PI / 2 });
      add(wall, box(2.6, 1.2, 1.2), s * 6.6, 13.0, fz - 0.3);
    });

    /* ---- the bell gable and cross ---------------------------------------- */
    add(wall, box(3.2, 2.4, 1.0), 0, 16.4, -13);
    add('bronze', box(0.24, 2.2, 0.24), 0, 19.2, -13);
    add('bronze', box(1.2, 0.24, 0.24), 0, 19.9, -13);

    /* ---- grounds: palms, people, the neighbouring convent ----------------- */
    const people = [[-6, 14], [7, 15], [-13, 11], [14, 12], [0, 18], [-18, 20], [18, 20], [-3, 12], [9, 11]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-18, 12], [18, 12], [-22, 24], [22, 24], [0, 26]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-24, 16], [24, 16], [-28, 2], [28, 2], [-26, 28], [26, 28]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.3, 'palm'));
    // the convent wall and a neighbouring chapel
    block(trim, 60, 4.2, 1.0, 0, 0, -30);
    block(wall, 14, 11, 12, -30, 0, -26);
    add('terracotta', box(15, 0.5, 13), -30, 11, -26);
    add('marble', dome(3.0, 2.4, 16), -30, 11.3, -26);

    ctx.light({ pos: [-18, 12, 26], target: [0, 14, 0], color: 0xffd0a0, intensity: 2600, distance: 150 });
    ctx.light({ pos: [18, 12, 24], target: [0, 14, 0], color: 0xffc890, intensity: 2200, distance: 150 });
  }
};
