/* Qutb Minar — Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'qutub-minar',
  accent: '#d9a441',
  accent2: '#f0a868',
  seed: 11,
  bounds: 95,
  minDist: 18,
  maxDist: 340,
  home: { pos: [76, 30, 98], target: [0, 32, 0], fov: 40 },
  ground: { texture: 'paving', size: 1600, color: 0xc9bda6 },
  views: [
    { name: 'Full', pos: [76, 30, 98], target: [0, 32, 0] },
    { name: 'Base', pos: [24, 8, 32], target: [0, 9, 0] },
    { name: 'Crown', pos: [22, 66, 26], target: [0, 63, 0] },
    { name: 'Courtyard', pos: [-40, 13, 40], target: [-10, 10, 4] }
  ],
  tour: [
    {
      title: 'The Victory Tower', deva: 'क़ुतुब मीनार',
      text: 'At 72.5 metres the Qutb Minar is the tallest masonry tower in India and the tallest brick minaret in the world. Qutb al-Din Aibak began it around 1199 to mark the founding of the Delhi Sultanate; his successor Iltutmish added three more storeys.',
      pos: [76, 30, 98], target: [0, 32, 0], time: 17.4
    },
    {
      title: 'Five Storeys, One Taper', deva: 'पाँच मंज़िलें',
      text: 'The tower narrows from 14.3 metres at the base to 2.75 metres at the crown. Its first three storeys are red sandstone with alternating angular and round fluting, divided by projecting balconies carried on carved brackets.',
      pos: [24, 40, 34], target: [0, 40, 0], time: 12
    },
    {
      title: 'Marble & Sandstone', deva: 'संगमरमर',
      text: 'Firoz Shah Tughlaq repaired the tower after lightning strikes in the fourteenth century, rebuilding the upper storeys in white marble and setting a cupola on top. Bands of marble cut across the red sandstone below.',
      pos: [19, 60, 24], target: [0, 58, 0], time: 9.8
    },
    {
      title: 'The Iron Pillar', deva: 'लौह स्तंभ',
      text: 'In the courtyard stands a 7-metre iron pillar cast in the Gupta period, around 400 CE, and inscribed in Sanskrit. Its resistance to rust for sixteen centuries is still studied by metallurgists.',
      pos: [20, 6, 22], target: [13, 5, 13], time: 11
    },
    {
      title: 'Quwwat-ul-Islam', deva: 'कुव्वत-उल-इस्लाम',
      text: 'The mosque beside the tower, begun in 1193, was raised from the stones of twenty-seven demolished Hindu and Jain temples — their carved columns still stand in the colonnades of the courtyard.',
      pos: [-34, 10, 30], target: [-12, 8, 2], time: 16.4
    },
    {
      title: 'The Unfinished Minar', deva: 'अलाई मीनार',
      text: 'Alauddin Khalji planned a tower twice the height of the Qutb Minar. Work stopped after the first storey; the stump, 24 metres wide, still stands north of the complex.',
      pos: [54, 17, -8], target: [40, 12, -28], time: 17.9
    },
    {
      title: 'The Tower at Night', deva: 'रात्रि',
      text: 'Under floodlight the fluting throws long shadows up the shaft. The complex is a UNESCO World Heritage Site, inscribed in 1993, and one of Delhi\'s most visited monuments.',
      pos: [70, 26, 92], target: [0, 34, 0], time: 21.4
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, arch, archFrame, dome, block, col } = ctx;

    /* ---- fluted shaft section ---- */
    function fluted(rTop, rBot, h, flutes, amp, rings = 16) {
      const seg = flutes * 5;
      const pos = [], uv = [], idx = [];
      for (let j = 0; j <= rings; j++) {
        const v = j / rings, y = v * h, r = rBot + (rTop - rBot) * v;
        for (let i = 0; i <= seg; i++) {
          const a = (i / seg) * Math.PI * 2;
          const rr = r * (1 + amp * Math.cos(flutes * a));
          pos.push(Math.cos(a) * rr, y, Math.sin(a) * rr);
          uv.push(i / seg, v * 3);
        }
      }
      for (let j = 0; j < rings; j++) {
        for (let i = 0; i < seg; i++) {
          const a = j * (seg + 1) + i, b = a + seg + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    /* ---- paved courtyard ---- */
    add('paving', ctx.plane(78, 66), 0, 0.06, 6, { rx: -Math.PI / 2 });
    add('stone', box(78.6, 0.12, 0.5), 0, 0.06, 39.2);
    add('stone', box(0.5, 0.12, 66.4), 39.2, 0.06, 6);
    add('stone', box(0.5, 0.12, 66.4), -39.2, 0.06, 6);

    /* ---- plinth ---- */
    col('stone', 12.6, 13.6, 1.0, 0, 0, 0, 36);
    col('sandstoneBuff', 11.9, 12.4, 1.1, 0, 1.0, 0, 36);
    for (let i = 0; i < 5; i++) block('stone', 5.0 - i * 0.32, 0.22, 1.2, 0, i * 0.22, 14.2 - i * 0.95);
    add('stone', cyl(12.5, 12.5, 0.22, 44), 0, 2.1, 0);

    /* ---- entrance doorway (facing +z) ---- */
    add('dark', arch(2.4, 4.2, 0.5), 0, 2.2, 12.1);
    add('marble', archFrame(2.9, 4.6, 0.24, 0.34), 0, 2.2, 12.2);

    /* ---- five storeys ---- */
    const storeys = [
      { rB: 7.16, rT: 6.15, h: 24.4, flutes: 24, amp: 0.085, key: 'sandstoneRed' },
      { rB: 5.62, rT: 4.95, h: 14.6, flutes: 24, amp: 0.075, key: 'sandstoneRed' },
      { rB: 4.72, rT: 4.10, h: 10.0, flutes: 24, amp: 0.065, key: 'sandstoneRed' },
      { rB: 3.86, rT: 3.36, h: 7.0, flutes: 12, amp: 0.04, key: 'marble' },
      { rB: 3.14, rT: 2.60, h: 4.4, flutes: 12, amp: 0.035, key: 'marble' }
    ];
    let y = 2.1;
    storeys.forEach((s, si) => {
      add(s.key, fluted(s.rT, s.rB, s.h, s.flutes, s.amp), 0, y, 0);
      // broad marble banding on the lower three storeys
      if (si < 3) {
        const f = 0.52;
        const r = (s.rB + (s.rT - s.rB) * f) * (1 + s.amp) + 0.04;
        add('marble', cyl(r, r, 1.1, 56), 0, y + s.h * f, 0);
        const f2 = 0.08;
        const r2 = (s.rB + (s.rT - s.rB) * f2) * (1 + s.amp) + 0.04;
        add('marble', cyl(r2, r2, 0.5, 56), 0, y + s.h * f2, 0);
      }
      y += s.h;
      if (si < storeys.length - 1) {
        const rb = s.rT, rn = storeys[si + 1].rB;
        // projecting balcony slab
        add('sandstoneBuff', cyl(rb + 1.5, rb + 1.7, 0.5, 48), 0, y + 0.25, 0);
        // brackets under the slab
        const brackets = s.flutes;
        for (let i = 0; i < brackets; i++) {
          const a = (i / brackets) * Math.PI * 2;
          add('sandstoneRed', box(0.28, 1.0, 0.55),
            Math.cos(a) * (rb + 1.0), y - 0.3, Math.sin(a) * (rb + 1.0), { ry: -a });
        }
        // pierced railing above the slab
        const railN = 44;
        for (let i = 0; i < railN; i++) {
          const a = (i / railN) * Math.PI * 2;
          add('jali', box(1.0, 0.95, 0.07),
            Math.cos(a) * (rb + 1.55), y + 0.98, Math.sin(a) * (rb + 1.55), { ry: -a + Math.PI / 2 });
        }
        add('marble', cyl(rb + 1.6, rb + 1.6, 0.12, 48), 0, y + 1.5, 0);
        add('sandstoneBuff', cyl(rn + 0.16, rn + 0.16, 0.26, 36), 0, y + 0.05, 0);
      }
    });

    /* ---- crown: cupola ---- */
    const topY = y;
    add('marble', cyl(3.45, 3.75, 0.55, 36), 0, topY + 0.28, 0);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      add('marble', cyl(0.17, 0.2, 1.7, 6), Math.cos(a) * 2.6, topY + 1.35, Math.sin(a) * 2.6);
    }
    add('marble', cyl(3.05, 3.05, 0.24, 36), 0, topY + 2.3, 0);
    add('marble', dome(2.7, 2.3, 28), 0, topY + 2.4, 0);
    add('gold', cyl(0.11, 0.11, 1.6, 8), 0, topY + 5.2, 0);
    add('gold', sph(0.28, 10), 0, topY + 6.1, 0);
    add('gold', cone(0.22, 0.8, 8), 0, topY + 6.7, 0);

    /* ---- low perimeter wall with crenellations ---- */
    (function wall() {
      const R = 34, H = 2.7, T = 0.45;
      // a ring wall, revolved from a rectangular profile
      add('sandstoneRed', ctx.lathe([[R - T, 0], [R + T, 0], [R + T, H], [R - T, H]], 72), 0, 0, 0);
      add('sandstoneBuff', ctx.lathe([[R - T - 0.12, H], [R + T + 0.12, H], [R + T + 0.12, H + 0.22], [R - T - 0.12, H + 0.22]], 72), 0, 0, 0);
      // merlons
      const n = 72;
      for (let i = 0; i < n; i++) {
        if (i % 2) continue;
        const a = (i / n) * Math.PI * 2;
        add('sandstoneRed', box(0.85, 0.62, 0.7), Math.cos(a) * R, H + 0.52, Math.sin(a) * R, { ry: -a });
      }
      // gate piers on the south, with a gap in the wall
      [-1, 1].forEach((sg) => {
        block('sandstoneBuff', 1.7, 4.6, 1.7, sg * 3.4, 0, R);
        add('sandstoneBuff', dome(1.05, 0.95, 16), sg * 3.4, 4.6, R);
        add('gold', ctx.cyl(0.07, 0.07, 0.6, 6), sg * 3.4, 5.7, R);
      });
    })();

    /* ---- Alai Darwaza ---- */
    (function alaiDarwaza(x, z) {
      const w = 9.6, h = 11;
      block('sandstoneRed', w, h, w, x, 0, z);
      add('dark', arch(5.2, 7.4, 0.6), x, 0, z + w / 2 + 0.05);
      add('marble', archFrame(6.0, 8.0, 0.45, 0.4), x, 0, z + w / 2 + 0.1);
      add('dark', arch(4.4, 6.6, 0.5), x - w / 2 - 0.05, 0, z, { ry: Math.PI / 2 });
      add('marble', archFrame(5.1, 7.1, 0.38, 0.36), x - w / 2 - 0.1, 0, z, { ry: Math.PI / 2 });
      block('marble', w + 1.0, 0.7, w + 1.0, x, h, z);
      add('marble', box(w + 0.05, 0.55, w + 0.05), x, h - 1.3, z);
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add('marble', cyl(0.6, 0.68, 2.1, 8), x + dx * (w / 2 - 0.7), h + 1.7, z + dz * (w / 2 - 0.7));
        add('marble', dome(0.78, 0.75, 12), x + dx * (w / 2 - 0.7), h + 2.75, z + dz * (w / 2 - 0.7));
      }
      add('marble', cyl(4.5, 4.7, 0.55, 30), x, h + 0.95, z);
      add('marble', dome(4.2, 3.5, 28), x, h + 1.2, z);
      add('gold', cyl(0.1, 0.1, 1.4, 8), x, h + 5.6, z);
      add('gold', sph(0.24, 8), x, h + 6.3, z);
    })(-32, 26);

    /* ---- Iron Pillar ---- */
    (function ironPillar(x, z) {
      block('stone', 3.6, 0.9, 3.6, x, 0, z);
      block('stone', 2.8, 0.7, 2.8, x, 0.9, z);
      add('black', cyl(0.44, 0.52, 7.4, 14), x, 1.6 + 3.7, z);
      add('black', cyl(0.58, 0.44, 0.55, 14), x, 1.6 + 7.6, z);
      add('bronze', cyl(0.36, 0.38, 1.0, 10), x, 1.6 + 8.4, z);
      add('bronze', sph(0.42, 10), x, 1.6 + 9.0, z);
      ctx.railing(x, 1.6, z + 2.1, 4.8, 'black', 0.9, 0, 6);
    })(14, 14);

    /* ---- Quwwat-ul-Islam colonnade ruins ---- */
    (function mosque(cx, cz) {
      block('stone', 42, 0.55, 30, cx, 0, cz);
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < 9; i++) {
          const x = cx - 16 + i * 4, z = cz - 11 + r * 5;
          col('stone', 0.34, 0.4, 4.4, x, 0.55, z, 8);
          col('stone', 0.42, 0.46, 0.32, x, 4.95, z, 8);
          if (i < 8 && r === 0) add('sandstoneRed', archFrame(3.3, 3.5, 0.24, 0.4), x + 2, 5.15, z);
        }
      }
      for (let i = 0; i < 7; i++) {
        const h = 1.5 + ((i * 37) % 5) * 0.6;
        block('sandstoneRed', 3.8, h, 0.95, cx - 15 + i * 5, 0.55, cz + 14);
      }
      block('sandstoneRed', 10.4, 7.6, 2.4, cx + 20, 0, cz);
      add('dark', arch(4.2, 6.1, 0.4), cx + 20, 0, cz + 1.3);
      add('marble', archFrame(4.9, 6.6, 0.34, 0.3), cx + 20, 0, cz + 1.4);
      block('marble', 11.2, 0.55, 3.0, cx + 20, 7.6, cz);
      add('marble', dome(1.7, 1.4, 14), cx + 17.2, 8.15, cz);
      add('marble', dome(1.7, 1.4, 14), cx + 22.8, 8.15, cz);
    })(-30, -8);

    /* ---- Alai Minar stump ---- */
    (function alaiMinar(x, z) {
      col('stone', 12.8, 13.4, 1.3, x, 0, z, 36);
      add('sandstoneRed', fluted(11.4, 12.3, 21, 32, 0.05, 8), x, 1.3, z);
      add('stone', cyl(11.7, 11.7, 0.55, 40), x, 22.6, z);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        add('stone', box(2.5, 1.3, 1.9), x + Math.cos(a) * 8.5, 23.1, z + Math.sin(a) * 8.5, { ry: a });
      }
    })(44, -36);

    /* ---- grounds: lawn, paths, lamps, trees, people ---- */
    add('foliage', ctx.plane(30, 22), -30, 0.6, -8, { rx: -Math.PI / 2 });
    add('paving', ctx.plane(9, 34), 0, 0.05, 22, { rx: -Math.PI / 2 });
    const trees = [[-58, 22], [-56, 42], [-22, 44], [8, 42], [30, 34], [-64, 2], [64, 12], [20, -22],
      [-44, -34], [16, 48], [-12, 50], [48, 40], [-70, -14], [60, -18]];
    trees.forEach(([x, z], i) => {
      const s = 0.95 + ((Math.abs(x * 7 + z) % 6) / 10);
      ctx.tree(x, z, s, (i % 4 === 0) ? 'palm' : 'round');
    });
    const far = [[-118, 74], [-96, 104], [-64, 118], [-18, 126], [34, 120], [78, 100], [112, 66],
      [124, 18], [118, -46], [92, -96], [46, -120], [-14, -124], [-70, -112], [-108, -74]];
    far.forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 4) * 0.18, i % 3 === 0 ? 'palm' : 'round'));
    [[-16, 26], [16, 26], [-16, -16], [16, -16], [0, 34], [0, -24], [-30, 16], [30, 18]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    const people = [[-4, 20, 'fabricWhite'], [5, 18, 'fabricSaffron'], [-9, 17, 'fabricRed'], [18, 8, 'fabricWhite'],
      [-20, 12, 'fabricRed'], [3, 27, 'fabricSaffron'], [-24, 4, 'fabricWhite'], [22, 24, 'fabricRed'],
      [-2, 15, 'fabricWhite'], [10, 21, 'fabricSaffron'], [-14, 20, 'fabricRed'], [26, 14, 'fabricWhite']];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 0.9, k, 0.95 + (i % 3) * 0.06));

    /* ---- floodlights ---- */
    ctx.light({ pos: [-40, 22, 40], target: [0, 30, 0], color: 0xffcf9a, intensity: 2600, distance: 280 });
    ctx.light({ pos: [42, 26, 36], target: [0, 30, 0], color: 0xffd9b0, intensity: 1800, distance: 280 });
  }
};
