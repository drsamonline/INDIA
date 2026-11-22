/* India Gate — New Delhi · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'india-gate',
  accent: '#c98a5a',
  accent2: '#e8b07a',
  seed: 41,
  bounds: 70,
  minDist: 14,
  maxDist: 260,
  time: 15.2,
  home: { pos: [62, 27, 120], target: [0, 19, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x9dab74, tile: 16 },
  views: [
    { name: 'Full', pos: [62, 27, 120], target: [0, 19, 0] },
    { name: 'Axis', pos: [0, 12, 96], target: [0, 20, 0] },
    { name: 'Arch', pos: [6, 8, 32], target: [0, 14, 0] },
    { name: 'Crown', pos: [14, 34, 30], target: [0, 32, 0] },
    { name: 'Canopy', pos: [-24, 7, 40], target: [-16, 7, 6] }
  ],
  tour: [
    {
      title: 'All India War Memorial', deva: 'इंडिया गेट',
      text: 'India Gate stands at the eastern end of the ceremonial axis of New Delhi. Designed by Edwin Lutyens, it commemorates the 74,187 soldiers of the British Indian Army who died between 1914 and 1921, in France, Flanders, Mesopotamia, Persia, East Africa, Gallipoli and the Third Anglo-Afghan War.',
      pos: [62, 27, 120], target: [0, 19, 0], time: 15.2
    },
    {
      title: 'Forty-Two Metres', deva: 'मेहराब',
      text: 'The memorial is 42 metres high, built of sandstone and granite on a low plinth. Its form borrows from Roman triumphal arches; the great opening is about 9.6 metres wide and rises 24 metres to the crown.',
      pos: [0, 12, 96], target: [0, 20, 0], time: 12
    },
    {
      title: 'The Names', deva: 'नाम',
      text: 'The names of the dead are cut into the walls of the arch, and a further 13,300 names of British Empire servicemen are inscribed alongside them. The foundation stone was laid in 1921 and the memorial dedicated in 1931.',
      pos: [6, 8, 32], target: [0, 14, 0], time: 10.2
    },
    {
      title: 'Crown and Bowl', deva: 'शिखर',
      text: 'Above the cornice an attic storey carries a shallow stone bowl, once intended for a never-installed lamp. The frieze and dentil courses are carved with sunbursts and rosettes.',
      pos: [14, 34, 30], target: [0, 32, 0], time: 16.8
    },
    {
      title: 'Amar Jawan Jyoti', deva: 'अमर जवान ज्योति',
      text: 'Beneath the arch stood the Amar Jawan Jyoti, lit in 1972 and moved to the National War Memorial in 2022. Behind the gate, the empty canopy that once held a statue of George V still stands among the lawns.',
      pos: [-14, 5, 22], target: [-4, 4, 2], time: 8.6
    },
    {
      title: 'Kartavya Path', deva: 'कर्तव्य पथ',
      text: 'The lawns along the axis are among the most used public spaces in the capital, full of families, vendors and kites on a winter afternoon.',
      pos: [30, 9, 58], target: [0, 16, 0], time: 17.6
    },
    {
      title: 'The Gate at Night', deva: 'रात्रि',
      text: 'After dark the sandstone is floodlit from below and the arch becomes a bright frame against the sky.',
      pos: [54, 23, 108], target: [0, 20, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, arch, archFrame, block, col } = ctx;

    function piercedWall(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const a = ctx.archShape(aw, ah);
      const pts = a.getPoints(28).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 });
    }

    /* ---- plinth and lawn terraces ------------------------------------- */
    block('granite', 40, 0.8, 40, 0, 0, 0);
    for (let i = 0; i < 3; i++) block('stone', 34 - i * 2.4, 0.28, 34 - i * 2.4, 0, 0.8 + i * 0.28, 0);

    /* ---- the arch block ------------------------------------------------ */
    const W = 30, H = 36, D = 10.5, AX = 9.6, AY = 24, SILL = 0.4;
    const base = 1.64;
    // two pierced faces and the side walls of the passage
    add('plaster', piercedWall(W, H, 2.0, AX, AY, SILL), 0, base, D / 2 - 2.0);
    add('plaster', piercedWall(W, H, 2.0, AX, AY, SILL), 0, base, -D / 2);
    add('plaster', box(2.4, H, D - 4.0), -AX / 2 - 1.2, base + H / 2, 0);
    add('plaster', box(2.4, H, D - 4.0), AX / 2 + 1.2, base + H / 2, 0);
    // the barrel of the passage
    add('stone', box(AX + 1.6, 0.2, D - 1.0), 0, base + 0.1, 0);
    add('stone', box(AX + 0.4, 0.22, D), 0, base + 0.2, 0);
    // mouldings at the springing
    [-1, 1].forEach((s) => {
      add('stone', box(2.2, 0.5, D + 0.4), s * (AX / 2 + 1.1), base + SILL + AY * 0.62, 0);
    });
    // inscribed panels on each pier
    [-1, 1].forEach((s) => {
      for (let r = 0; r < 2; r++) {
        add('stone', box(0.1, 2.2, 4.6), s * (W / 2 + 0.02), base + 4 + r * 6, 0);
      }
      add('stone', box(0.1, 2.2, 4.6), s * (AX / 2 + 2.6), base + 4, 0);
    });
    // keystone and spandrel detail
    add('stone', box(1.2, 1.6, 1.4), 0, base + SILL + AY - 0.6, D / 2 - 0.6);
    add('plaster', box(W + 1.0, 0.6, D + 1.0), 0, base + H - 1.2, 0);
    add('plaster', box(W + 1.6, 0.7, D + 1.6), 0, base + H, 0);
    // attic storey with the shallow bowl
    block('plaster', W - 2.0, 4.0, D - 1.0, 0, base + H + 0.7, 0);
    add('stone', box(W - 1.4, 0.4, D - 0.4), 0, base + H + 4.7, 0);
    add('stone', cyl(1.7, 1.2, 1.0, 20), 0, base + H + 5.6, 0);
    add('stone', cyl(2.1, 2.1, 0.22, 20), 0, base + H + 6.2, 0);

    /* ---- carved detail: archivolt, keystone, friezes, dentils ------------ */
    add('stone', archFrame(AX + 1.2, AY + 0.9, 0.36, 0.42), 0, base + SILL, D / 2 + 0.04);
    add('stone', archFrame(AX + 2.2, AY + 1.5, 0.3, 0.34), 0, base + SILL, D / 2 + 0.02);
    add('stone', archFrame(AX + 1.2, AY + 0.9, 0.36, 0.42), 0, base + SILL, -D / 2 - 0.06, { ry: Math.PI });
    add('stone', box(1.05, 1.6, 1.3), 0, base + SILL + AY - 0.55, D / 2 - 0.45);
    // impost blocks at the springing
    [-1, 1].forEach((sd) => {
      add('stone', box(1.5, 0.5, D + 0.7), sd * (AX / 2 + 1.05), base + SILL + AY * 0.55, 0);
    });
    // sunburst frieze above the arch
    for (let i = -6; i <= 6; i++) {
      add('stone', box(0.5, 0.95, 0.2), i * 1.35, base + H - 3.1, D / 2 + 0.1, { rz: i % 2 ? 0.32 : -0.32 });
    }
    // dentil course under the cornice, all four faces
    for (let i = -9; i <= 9; i++) {
      add('stone', box(0.55, 0.42, 0.42), i * 1.55, base + H - 1.95, D / 2 + 0.32);
      add('stone', box(0.55, 0.42, 0.42), i * 1.55, base + H - 1.95, -D / 2 - 0.32);
    }
    for (let i = -3; i <= 3; i++) {
      add('stone', box(0.42, 0.42, 0.55), W / 2 + 0.32, base + H - 1.95, i * 1.55);
      add('stone', box(0.42, 0.42, 0.55), -W / 2 - 0.32, base + H - 1.95, i * 1.55);
    }
    // steps up to the plinth
    for (let i = 0; i < 4; i++) {
      add('stone', box(22 - i * 1.5, 0.22, 1.0), 0, 0.46 - i * 0.2, D / 2 + 3.4 + i * 0.95);
    }
    // bollards along the axis
    for (let i = -4; i <= 4; i++) {
      if (Math.abs(i) < 2) continue;
      add('black', cyl(0.16, 0.2, 0.9, 8), i * 4.6, 0.45, 20);
      add('black', sph(0.18, 8), i * 4.6, 0.95, 20);
    }

    /* ---- Amar Jawan Jyoti under the arch -------------------------------- */
    add('black', box(4.4, 0.5, 4.4), 0, base + 0.25, 0);
    add('gold', cone(0.18, 0.9, 8), 0, base + 1.0, 0);
    [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].forEach(([x, z]) => {
      add('black', cyl(0.05, 0.05, 1.5, 5), x, base + 0.9, z, { rz: 0.06 });
    });

    /* ---- the empty canopy ----------------------------------------------- */
    (function canopy(cx, cz) {
      block('plaster', 7.6, 0.6, 7.6, cx, 0, cz);
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        col('plaster', 0.42, 0.5, 4.6, cx + dx * 2.8, 0.6, cz + dz * 2.8, 8);
      }
      add('plaster', box(7.4, 0.5, 7.4), cx, 5.4, cz);
      add('plaster', box(6.4, 0.5, 6.4), cx, 5.9, cz);
      add('stone', dome(3.2, 1.6, 16), cx, 6.2, cz);
      add('stone', cyl(0.16, 0.2, 0.8, 8), cx, 8.0, cz);
    })(-17, 2);

    /* ---- lawns, paths, fountains ---------------------------------------- */
    add('paving', ctx.plane(46, 200), 0, 0.06, 0, { rx: -Math.PI / 2 });
    add('grass', ctx.plane(120, 200), -70, 0.05, 0, { rx: -Math.PI / 2 });
    add('grass', ctx.plane(120, 200), 70, 0.05, 0, { rx: -Math.PI / 2 });
    for (let i = 0; i < 3; i++) {
      const z = 26 + i * 22;
      add('stone', cyl(5.2, 5.4, 0.6, 20), 0, 0.35, z);
      add('water', cyl(4.6, 4.6, 0.2, 20), 0, 0.72, z);
      add('stone', cyl(0.6, 0.8, 1.4, 10), 0, 1.3, z);
    }
    // hedge lines along the axis
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 8; i++) {
        block('foliage', 1.6, 0.9, 12, s * 13.5, 0.05, 18 + i * 16);
      }
    });

    /* ---- crowds, lamps, trees ------------------------------------------ */
    const people = [[-6, 12], [6, 13], [-11, 8], [11, 9], [0, 16], [-16, 20], [16, 21], [-3, 6],
      [3, 5], [-9, 24], [9, 25], [14, 4], [-14, 4], [0, 30], [-19, 16], [19, 17], [7, 8],
      [-7, 9], [12, 28], [-12, 29], [4, 34], [-4, 34]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-12, 14], [12, 14], [-20, 30], [20, 30], [0, 44]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));
    [[-30, 20], [30, 20], [-34, 44], [34, 44], [-26, -16], [26, -16], [-40, 60], [40, 60],
     [-24, 66], [24, 66], [-44, 30], [44, 30], [-18, -22], [18, -22]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 3) * 0.2, i % 4 === 0 ? 'cypress' : 'round'));

    ctx.light({ pos: [-24, 14, 34], target: [0, 18, 0], color: 0xffd0a0, intensity: 2600, distance: 180 });
    ctx.light({ pos: [24, 16, 30], target: [0, 18, 0], color: 0xffc890, intensity: 2200, distance: 180 });
  }
};
