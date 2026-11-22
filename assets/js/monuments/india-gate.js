/* India Gate — New Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'india-gate',
  accent: '#c98a5a',
  accent2: '#e8b07a',
  seed: 41,
  bounds: 90,
  minDist: 16,
  maxDist: 300,
  time: 15.2,
  home: { pos: [50, 25, 92], target: [0, 19, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x9dab74, tile: 16 },
  views: [
    { name: 'Full', pos: [50, 25, 92], target: [0, 19, 0] },
    { name: 'Axis', pos: [0, 13, 88], target: [0, 20, 0] },
    { name: 'Arch', pos: [5, 9, 30], target: [0, 15, 0] },
    { name: 'Crown', pos: [16, 36, 34], target: [0, 33, 0] },
    { name: 'Canopy', pos: [-24, 9, 30], target: [-29, 7, 3] }
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
    const { add, box, cyl, sph, cone, dome, arch, block, col, plane } = ctx;

    function tint(key, hex) {
      const m = ctx.mat(key);
      if (!m || !m.clone) return key;
      const c = m.clone();
      c.color.setHex(hex);
      return c;
    }
    const stone = tint('plaster', 0xf7ddc0);          // warm Bharatpur sandstone
    const light = 'ivory';                            // lighter carved stone
    const light2 = tint('plaster', 0xffe9d2);         // pale carved panels
    const soffit = tint('plaster', 0x5c4b3f);         // shaded passage vault
    const recess = tint('plaster', 0xdcc0a2);        // inscription panels

    /* ---------------------------------------------------------- dimensions
       36 m across, 33 m to the cornice, 39.6 m to the top of the attic —
       nearly as wide as it is high, with a 9.6 m opening rising 24 m. */
    const W = 33, H = 33.2, D = 13;
    const BASE = 1.25;              // top of the plinth
    const AW = 9.6, AH = 23.5;      // arch opening: width and total rise
    const SILL = 0.35;              // arch base above the plinth
    const SPRING = SILL + AH - AW / 2;
    const WT = 3.4;                 // thickness of the pierced wall
    const PIER = (W - AW) / 2;

    /* a true semicircular Roman arch, as Lutyens built it */
    function romArch(w, h) {
      const r = w / 2, s = h - r;
      const sh = new T3.Shape();
      sh.moveTo(-r, 0);
      sh.lineTo(-r, s);
      sh.absarc(0, s, r, Math.PI, 0, true);
      sh.lineTo(r, 0);
      sh.closePath();
      return sh;
    }
    function piercedWall(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const a = romArch(aw, ah);
      const pts = a.getPoints(22).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 4 });
    }
    function archRing(w, h, thick, depth) {
      const outer = romArch(w, h);
      const inner = romArch(w - thick * 2, h - thick * 1.02);
      const pts = inner.getPoints(22).map((p) => new T3.Vector2(p.x, p.y + thick * 0.5));
      outer.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 4 });
    }

    /* ------------------------------------------------ low plinth and steps */
    block(light2, W + 7.5, 0.5, D + 7.5, 0, 0, 0);
    block(light, W + 5.5, 0.45, D + 5.5, 0, 0.5, 0);
    block(light, W + 3.5, 0.3, D + 3.5, 0, 0.95, 0);
    // steps on the four sides, shallow and light
    for (let i = 0; i < 3; i++) {
      const w = 26 - i * 2.2, z = D / 2 + 3.6 + i * 0.9;
      add(light, box(w, 0.24 * (i + 1), 1.0), 0, 0.12 * (i + 1), z);
      add(light, box(w, 0.24 * (i + 1), 1.0), 0, 0.12 * (i + 1), -z);
    }
    for (let i = 0; i < 3; i++) {
      const d = 9 - i * 1.6, x = W / 2 + 3.4 + i * 0.9;
      add(light, box(1.0, 0.24 * (i + 1), d), x, 0.12 * (i + 1), 0);
      add(light, box(1.0, 0.24 * (i + 1), d), -x, 0.12 * (i + 1), 0);
    }

    /* ------------------------------------------------------- the arch block */
    // the two pierced faces
    add(stone, piercedWall(W, H, WT, AW, AH, SILL), 0, BASE, D / 2 - WT);
    add(stone, piercedWall(W, H, WT, AW, AH, SILL), 0, BASE, -D / 2);
    // the solid piers between them
    [-1, 1].forEach((s) => {
      add(stone, box(PIER, H, D - 2 * WT), s * (AW / 2 + PIER / 2), BASE + H / 2, 0);
    });
    // ribbed vault of the passage, following the semicircle
    const R = AW / 2;
    for (let i = 0; i < 9; i++) {
      const a = (Math.PI * (i + 0.5)) / 9;
      add(soffit, box(2 * R * Math.sin(Math.PI / 18) + 0.1, 0.2, D - 2 * WT + 0.2),
        Math.cos(a) * R, BASE + SILL + SPRING + Math.sin(a) * R, 0, { rz: a - Math.PI / 2 });
    }
    add(soffit, box(AW + 0.4, 0.24, D - 2 * WT + 0.2), 0, BASE + SILL + 0.1, 0);
    [-1, 1].forEach((s) => {
      add(soffit, box(0.16, SPRING + SILL, D - 2 * WT), s * (AW / 2 - 0.05), BASE + (SPRING + SILL) / 2, 0);
    });

    /* ------------------------------------------------- carved arch surrounds */
    add(light, archRing(AW + 1.1, AH + 0.65, 0.55, 0.5), 0, BASE + SILL, D / 2 + 0.04);
    add(light, archRing(AW + 2.3, AH + 1.35, 0.36, 0.3), 0, BASE + SILL, D / 2 + 0.02);
    add(light, archRing(AW + 1.1, AH + 0.65, 0.55, 0.5), 0, BASE + SILL, -D / 2 - 0.08, { ry: Math.PI });
    // keystone
    add(light, box(1.0, 1.7, 0.7), 0, BASE + SILL + SPRING + R - 0.5, D / 2 + 0.15);
    // impost blocks at the springing
    [-1, 1].forEach((s) => {
      add(light, box(1.7, 0.6, D + 0.5), s * (AW / 2 + 0.7), BASE + SILL + SPRING - 0.3, 0);
    });
    // base moulding round the piers
    add(light, box(W + 0.7, 0.9, D + 0.7), 0, BASE + 0.45, 0);
    // pilaster strips on the piers and recessed inscription panels
    [-1, 1].forEach((s) => {
      // pilasters on the outer edges of each pier
      [AW / 2 + 0.9, W / 2 - 0.9].forEach((x) => {
        add(light, box(1.0, H - 2.6, 0.4), s * x, BASE + 0.9 + (H - 2.6) / 2, D / 2 + 0.16);
        add(light, box(1.0, H - 2.6, 0.4), s * x, BASE + 0.9 + (H - 2.6) / 2, -D / 2 - 0.16);
      });
      [2.6, 4.6].forEach((z) => {
        add(light, box(0.4, H - 2.6, 1.0), W / 2 + 0.16, BASE + 0.9 + (H - 2.6) / 2, s * z);
        add(light, box(0.4, H - 2.6, 1.0), -W / 2 - 0.16, BASE + 0.9 + (H - 2.6) / 2, s * z);
      });
      // one tall recessed inscription panel per pier, front and back
      const cx = s * (AW / 2 + PIER / 2);
      add(recess, box(PIER - 5.4, H - 11.0, 0.08), cx, BASE + 1.2 + (H - 11.0) / 2, D / 2 + 0.02);
      add(recess, box(PIER - 5.4, H - 11.0, 0.08), cx, BASE + 1.2 + (H - 11.0) / 2, -D / 2 - 0.02);
      add(light, box(PIER - 4.6, 0.32, 0.22), cx, BASE + H - 4.6, D / 2 + 0.08);
      add(light, box(PIER - 4.6, 0.32, 0.22), cx, BASE + H - 4.6, -D / 2 - 0.08);
      // the same on the outer flank of each pier
      add(recess, box(0.08, H - 11.0, 3.2), W / 2 + 0.02, BASE + 1.2 + (H - 11.0) / 2, s * (D / 2 - 2.4));
      add(recess, box(0.08, H - 11.0, 3.2), -W / 2 - 0.02, BASE + 1.2 + (H - 11.0) / 2, s * (D / 2 - 2.4));
    });

    /* ------------------------------------------ spandrel frieze and cornice */
    // rosette medallions on the spandrels
    [-1, 1].forEach((s) => {
      [0, 1].forEach((k) => {
        const x = s * (5.2 + k * 3.4), y = BASE + SILL + SPRING + 3.4 - k * 0.9;
        add(light, cyl(0.95, 0.95, 0.3, 14), x, y, D / 2 + 0.16, { rx: Math.PI / 2 });
        add(light2, cyl(0.62, 0.62, 0.18, 12), x, y, D / 2 + 0.3, { rx: Math.PI / 2 });
        add(light, cyl(0.95, 0.95, 0.3, 14), x, y, -D / 2 - 0.16, { rx: Math.PI / 2 });
      });
    });
    // sunburst frieze under the cornice
    for (let i = -8; i <= 8; i++) {
      const x = i * 2.1;
      if (Math.abs(x) < 5.0) continue;
      add(light, box(0.55, 1.1, 0.18), x, BASE + H - 3.0, D / 2 + 0.1, { rz: i % 2 ? 0.3 : -0.3 });
      add(light, box(0.55, 1.1, 0.18), x, BASE + H - 3.0, -D / 2 - 0.1, { rz: i % 2 ? 0.3 : -0.3 });
    }
    // plain moulding, shallow dentils, then the cornice slab
    add(light, box(W + 0.6, 0.4, D + 0.6), 0, BASE + H - 2.15, 0);
    for (let i = -17; i <= 17; i++) {
      const x = i * 1.0;
      add(light2, box(0.44, 0.34, 0.16), x, BASE + H - 1.6, D / 2 + 0.2);
      add(light2, box(0.44, 0.34, 0.16), x, BASE + H - 1.6, -D / 2 - 0.2);
    }
    for (let i = -6; i <= 6; i++) {
      const z = i * 1.0;
      add(light2, box(0.16, 0.34, 0.44), W / 2 + 0.2, BASE + H - 1.6, z);
      add(light2, box(0.16, 0.34, 0.44), -W / 2 - 0.2, BASE + H - 1.6, z);
    }
    add(light, box(W + 1.5, 0.42, D + 1.5), 0, BASE + H - 0.95, 0);   // plain band
    add(light, box(W + 2.0, 0.55, D + 2.0), 0, BASE + H - 0.45, 0);   // cornice
    add(light2, box(W + 1.4, 0.2, D + 1.4), 0, BASE + H - 0.1, 0);

    /* --------------------------------------------- the attic and the basin */
    const AT = BASE + H;                 // attic base
    block(stone, W - 3.4, 3.2, D - 3.4, 0, AT, 0);
    // recessed panels round the attic
    [-1, 1].forEach((s) => {
      for (let i = -2; i <= 2; i++) {
        if (Math.abs(i) < 2) continue;
        add(light2, box(2.4, 1.6, 0.12), i * 7.0, AT + 1.9, s * ((D - 3.0) / 2 + 0.02));
      }
    });
    // the inscribed name panel, front and back
    add(light2, box(9.0, 1.7, 0.12), 0, AT + 1.9, (D - 3.0) / 2 + 0.02);
    add(light2, box(9.0, 1.7, 0.12), 0, AT + 1.9, -(D - 3.0) / 2 - 0.02);
    add(light, box(9.6, 0.22, 0.2), 0, AT + 2.85, (D - 3.0) / 2 + 0.06);
    add(light, box(9.6, 0.22, 0.2), 0, AT + 2.85, -(D - 3.0) / 2 - 0.06);
    // attic cornice and a stepped parapet
    add(light, box(W - 2.0, 0.45, D - 2.0), 0, AT + 3.4, 0);
    add(light2, box(W - 3.6, 0.3, D - 3.6), 0, AT + 3.75, 0);
    block(stone, W - 6.4, 0.6, D - 6.4, 0, AT + 3.9, 0);
    add(light, box(W - 5.8, 0.26, D - 5.8), 0, AT + 4.65, 0);
    // the shallow bowl on the roof — a never-filled lamp basin
    add(light, cyl(2.3, 2.6, 0.4, 22), 0, AT + 4.9, 0);
    add(light2, cyl(2.9, 2.6, 0.22, 22), 0, AT + 5.15, 0);
    add(soffit, cyl(2.1, 2.1, 0.2, 20), 0, AT + 5.22, 0);
    add(light, cyl(0.55, 0.75, 0.5, 10), 0, AT + 5.4, 0);

    /* -------------------------------------------- Amar Jawan Jyoti under the arch */
    add('black', box(4.6, 0.45, 4.6), 0, BASE + SILL + 0.22, 0);
    add('bronze', box(3.4, 0.3, 3.4), 0, BASE + SILL + 0.55, 0);
    add('gold', cone(0.16, 0.85, 8), 0, BASE + SILL + 1.1, 0);
    [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]].forEach(([x, z]) => {
      add('black', cyl(0.05, 0.05, 1.6, 5), x, BASE + SILL + 1.0, z, { rz: 0.05 });
    });

    /* -------------------------------------------------- the empty canopy
       Four pillars on a stepped plinth, standing to the south-west of the
       gate — the chhatri that once held the statue of George V. */
    (function canopy(cx, cz) {
      block(light2, 11.5, 0.45, 11.5, cx, 0, cz);
      block(light, 10.2, 0.45, 10.2, cx, 0.45, cz);
      block(light, 9.0, 0.5, 9.0, cx, 0.9, cz);
      for (let i = 0; i < 3; i++) {
        add(light, box(7.0, 0.22 * (i + 1), 0.8), cx, 0.11 * (i + 1), cz + 5.0 + i * 0.7);
      }
      // four pillars with bases and capitals
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const px = cx + dx * 3.1, pz = cz + dz * 3.1;
        block(light, 1.3, 0.6, 1.3, px, 1.4, pz);
        block(stone, 0.95, 6.2, 0.95, px, 2.0, pz);
        add(light, box(1.25, 0.28, 1.25), px, 5.4, pz);
        add(light, box(1.25, 0.28, 1.25), px, 7.1, pz);
        block(light, 1.4, 0.7, 1.4, px, 8.2, pz);
        add(light2, box(1.1, 0.3, 1.1), px, 8.9, pz);
      }
      // entablature and stepped cornice
      block(stone, 8.6, 0.9, 8.6, cx, 9.2, cz);
      add(light, box(9.8, 0.4, 9.8), cx, 10.15, cz);
      add(light, box(9.0, 0.35, 9.0), cx, 10.55, cz);
      add(light, box(8.2, 0.3, 8.2), cx, 10.9, cz);
      // shallow dome and finial
      add(light, dome(3.7, 1.25, 20), cx, 11.2, cz);
      add(light, cyl(0.9, 1.15, 0.5, 10), cx, 12.5, cz);
      add(light2, sph(0.55, 10), cx, 13.1, cz);
      add('gold', cone(0.12, 1.1, 5), cx, 13.8, cz);
    })(-29, 3);

    /* --------------------------------------------- bollards along the axis */
    for (let i = -5; i <= 5; i++) {
      if (Math.abs(i) < 2) continue;
      add('grey', cyl(0.16, 0.2, 0.85, 8), i * 4.4, 0.42, 22);
      add('grey', sph(0.17, 8), i * 4.4, 0.9, 22);
    }

    /* ------------------------------------------ lawns, paths and fountains */
    add('paving', plane(34, 230), 0, 0.06, 0, { rx: -Math.PI / 2 });
    add('grass', plane(150, 230), -92, 0.05, 0, { rx: -Math.PI / 2 });
    add('grass', plane(150, 230), 92, 0.05, 0, { rx: -Math.PI / 2 });
    for (let i = 0; i < 3; i++) {
      const z = 30 + i * 24;
      add(light, cyl(5.4, 5.6, 0.6, 20), 0, 0.35, z);
      add('water', cyl(4.7, 4.7, 0.2, 20), 0, 0.72, z);
      add(light, cyl(0.6, 0.8, 1.4, 10), 0, 1.3, z);
    }
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 8; i++) block('foliage', 1.6, 0.85, 12, s * 11.5, 0.05, 22 + i * 17);
    });

    /* ------------------------------------------- crowds, lamps and trees */
    const people = [[-6, 14], [6, 15], [-11, 9], [11, 10], [0, 18], [-16, 22], [16, 23], [-3, 7],
      [3, 6], [-9, 26], [9, 27], [14, 5], [-14, 5], [0, 32], [-19, 18], [19, 19], [7, 9],
      [-7, 10], [12, 30], [-12, 31], [4, 36], [-4, 36], [-22, 12], [22, 13]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-13, 16], [13, 16], [-20, 34], [20, 34], [0, 46]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'grey'));
    [[-30, 22], [30, 22], [-34, 46], [34, 46], [-26, -18], [26, -18], [-42, 62], [42, 62],
     [-24, 68], [24, 68], [-44, 32], [44, 32], [-18, -24], [18, -24], [-40, 12], [40, 12]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 3) * 0.2, i % 4 === 0 ? 'cypress' : 'round'));

    ctx.light({ pos: [-22, 15, 32], target: [0, 18, 0], color: 0xffd0a0, intensity: 2800, distance: 190 });
    ctx.light({ pos: [22, 17, 28], target: [0, 18, 0], color: 0xffc890, intensity: 2400, distance: 190 });
    ctx.light({ pos: [-29, 9, 16], target: [-29, 8, 3], color: 0xffd8b0, intensity: 900, distance: 60 });
  }
};
