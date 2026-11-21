/* Gateway of India — Mumbai · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'gateway-of-india',
  accent: '#9aa8b4',
  accent2: '#c8d6e0',
  seed: 37,
  time: 11.6,
  exposure: 0.72,
  bounds: 62,
  minDist: 14,
  maxDist: 240,
  home: { pos: [54, 23, 80], target: [0, 14, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xa89c86 },
  groundY: -0.35,
  water: { y: -0.28, size: 520, z: 300, color: 0x24424f, distortion: 2.2 },
  views: [
    { name: 'Full', pos: [54, 23, 80], target: [0, 14, 0] },
    { name: 'Arch', pos: [11, 10, 30], target: [0, 12, 0] },
    { name: 'Towers', pos: [26, 26, 38], target: [0, 21, 0] },
    { name: 'From the sea', pos: [-34, 10, 44], target: [0, 13, 0] },
    { name: 'Quay', pos: [-30, 4.5, 24], target: [-8, 7, 8] }
  ],
  tour: [
    {
      title: 'A Gate to India', deva: 'गेटवे ऑफ़ इंडिया',
      text: 'The Gateway of India was built to mark the landing of King George V at Bombay in December 1911, the first British monarch to visit India. George Wittet\'s Indo-Saracenic design was sanctioned in 1914 and the arch finished in 1924.',
      pos: [54, 23, 80], target: [0, 14, 0], time: 11.6
    },
    {
      title: 'Basalt and Shadow', deva: 'मेहराब',
      text: 'It is built of local basalt, 26 metres high, with a central arch about 15 metres across, its passage cut deep through the block. Two smaller arches flank it, and carved brackets carry the cornice above.',
      pos: [11, 10, 30], target: [0, 12, 0], time: 12
    },
    {
      title: 'Gujarati Detail', deva: 'जाली',
      text: 'The ornament draws on sixteenth-century Gujarati architecture — jaali screens, lotus motifs and slender columns — set into the Indo-Saracenic frame that Wittet had used across Bombay.',
      pos: [15, 15, 28], target: [9, 15, 0], time: 9.6
    },
    {
      title: 'The Octagonal Towers', deva: 'मीनार',
      text: 'Two octagonal towers flank the arch, each carrying a ribbed dome of reinforced concrete. They give the monument the silhouette of a triumphal arch crossed with a mosque gateway.',
      pos: [26, 26, 38], target: [0, 21, 0], time: 16.4
    },
    {
      title: 'Apollo Bunder', deva: 'बंदरगाह',
      text: 'The Gateway faces the harbour at Apollo Bunder. In 1948 the last British troops left India through this arch, and today boats leave from the quay for Elephanta Island.',
      pos: [-34, 10, 44], target: [0, 13, 0], time: 17.8
    },
    {
      title: 'Harbour Lights', deva: 'रात्रि',
      text: 'After dark the basalt goes almost black and the floodlights pick out the arch and the domes, with the city\'s lights across the water behind.',
      pos: [50, 20, 74], target: [0, 16, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, onion, arch, archFrame, block, col } = ctx;

    function piercedWall(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const a = ctx.archShape(aw, ah);
      const pts = a.getPoints(30).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 7 });
    }

    /* ---- quay, steps, plinth -------------------------------------------- */
    block('paving', 64, 0.9, 48, 0, -0.3, -6);
    block('basaltDark', 46, 1.2, 34, 0, 0.5, -2);
    for (let i = 0; i < 3; i++) block('basalt', 30 - i * 1.4, 0.28, 18 - i * 1.0, 0, 0.6 + i * 0.28, 0);
    // sea wall and mooring steps on the harbour side
    block('basaltDark', 64, 1.7, 1.4, 0, -0.9, 17.4);
    for (let i = 0; i < 4; i++) block('basalt', 20, 0.3, 1.0, 0, -0.5 + i * 0.3, 18.4 + i * 0.9);
    // bollards along the quay
    for (let i = -3; i <= 3; i++) {
      add('black', cyl(0.22, 0.28, 0.55, 8), i * 8.4, 0.28, 16.2);
      add('black', sph(0.24, 8), i * 8.4, 0.56, 16.2);
    }

    /* ---- the arch block -------------------------------------------------- */
    const W = 30, H = 26, D = 13;
    const AX = 15, AY = 19.6, SILL = 0.4;
    const base = 1.44;

    add('basalt', piercedWall(W, H, 1.8, AX, AY, SILL), 0, base, D / 2 - 1.8);
    add('basalt', piercedWall(W, H, 1.8, AX, AY, SILL), 0, base, -D / 2);
    add('basalt', box(2.6, H, D - 3.6), -AX / 2 - 1.3, base + H / 2, 0);
    add('basalt', box(2.6, H, D - 3.6), AX / 2 + 1.3, base + H / 2, 0);
    // the vault of the passage: three transverse ribs
    [-1, 0, 1].forEach((i) => {
      add('basaltDark', piercedWall(W, H, 0.9, AX, AY, SILL), 0, base, i * 3.6);
    });
    // ceiling and floor of the passage
    add('basaltDark', box(AX + 0.4, 0.5, D - 3.4), 0, base + SILL + AY - 0.2, 0);
    add('basalt', box(AX + 3.2, 0.22, D - 1.0), 0, base + 0.11, 0);

    /* archivolt: three moulded rings around the great arch */
    [0, 1, 2].forEach((k) => {
      const grow = k * 0.55;
      add(k === 1 ? 'basaltDark' : 'basalt',
        archFrame(AX + 0.9 + grow * 2, AY + 0.7 + grow * 1.6, 0.34, 0.36 + k * 0.05),
        0, base + SILL, D / 2 + 0.05 + k * 0.06);
    });
    // spandrel rosettes
    [-1, 1].forEach((s) => {
      [[3.6, 2.2], [3.6, -1.4]].forEach(([dx, dy]) => {
        add('basaltDark', torus(0.62, 0.13, 6, 14), s * (AX / 2 + dx), base + SILL + AY / 2 + dy, D / 2 + 0.06);
        add('basalt', sph(0.3, 8), s * (AX / 2 + dx), base + SILL + AY / 2 + dy, D / 2 + 0.1);
      });
    });
    // keystone
    add('basaltDark', box(1.1, 1.7, 1.5), 0, base + SILL + AY - 0.4, D / 2 - 0.5);

    /* ---- flanking bays --------------------------------------------------- */
    [-1, 1].forEach((s) => {
      const x = s * (W / 2 - 4.3);
      add('basalt', piercedWall(7.6, 13.4, 1.6, 3.5, 7.8, 1.1), x, base, D / 2 - 1.6);
      add('basalt', piercedWall(7.6, 13.4, 1.6, 3.5, 7.8, 1.1), x, base, -D / 2);
      add('basaltDark', box(3.7, 8.4, D - 3.0), x, base + 5.3, 0);
      // jaali screen in the opening
      for (let i = -1; i <= 1; i++) {
        add('jaliWhite', box(0.9, 1.0, 0.07), x + i * 1.05, base + 3.0, D / 2 + 0.06);
        add('jaliWhite', box(0.9, 1.0, 0.07), x + i * 1.05, base + 4.3, D / 2 + 0.06);
      }
      add('basaltDark', archFrame(4.0, 8.2, 0.3, 0.34), x, base + 1.1, D / 2 + 0.04);
    });

    /* ---- cornice with dentils, parapet ----------------------------------- */
    add('basalt', box(W + 2.6, 0.5, D + 2.2), 0, base + H + 0.1, 0);
    add('basaltDark', box(W + 3.0, 0.28, D + 2.6), 0, base + H + 0.45, 0);
    for (let i = -7; i <= 7; i++) {
      add('basalt', box(0.5, 0.42, 0.42), i * 2.05, base + H + 0.78, D / 2 + 1.0);
      add('basalt', box(0.5, 0.42, 0.42), i * 2.05, base + H + 0.78, -D / 2 - 1.0);
    }
    add('basalt', box(W + 2.0, 0.55, D + 1.6), 0, base + H + 1.2, 0);
    // merlons along the roof edge
    for (let i = -6; i <= 6; i++) {
      add('basalt', box(1.05, 0.9, 0.9), i * 2.3, base + H + 1.95, D / 2 - 0.3);
      add('basalt', box(1.05, 0.9, 0.9), i * 2.3, base + H + 1.95, -D / 2 + 0.3);
    }
    for (let i = -2; i <= 2; i++) {
      add('basalt', box(0.9, 0.9, 1.05), W / 2 - 0.3, base + H + 1.95, i * 2.3);
      add('basalt', box(0.9, 0.9, 1.05), -W / 2 + 0.3, base + H + 1.95, i * 2.3);
    }
    // central dome behind the parapet
    add('basalt', cyl(3.6, 3.9, 1.3, 20), 0, base + H + 1.5, -2.0);
    add('basaltDark', onion(3.7, 5.2, 26), 0, base + H + 2.8, -2.0);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      add('basalt', box(0.22, 4.4, 0.22), Math.cos(a) * 3.5, base + H + 4.9, -2.0 + Math.sin(a) * 3.5, { ry: -a, rz: 0.22 });
    }
    add('gold', cyl(0.09, 0.09, 1.5, 8), 0, base + H + 7.9, -2.0);
    add('gold', sph(0.24, 8), 0, base + H + 8.7, -2.0);

    /* ---- octagonal towers ------------------------------------------------ */
    [-1, 1].forEach((s) => {
      const x = s * (W / 2 + 2.7), z = D / 2 - 3.6;
      // base block
      add('basalt', cyl(3.3, 3.7, 3.2, 8), x, base + 1.6, z);
      add('basaltDark', cyl(3.5, 3.5, 0.3, 8), x, base + 3.25, z);
      // three shaft tiers with a balcony between each
      let y = base + 3.4;
      [[2.6, 2.35, 5.2], [2.3, 2.1, 4.6], [2.05, 1.9, 4.0]].forEach(([rb, rt, h]) => {
        add('basalt', cyl(rt, rb, h, 8), x, y + h / 2, z);
        // engaged columns on each face
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          add('basaltDark', cyl(0.13, 0.15, h * 0.92, 5),
            x + Math.cos(a) * (rb + 0.05), y + h / 2, z + Math.sin(a) * (rb + 0.05));
        }
        y += h;
        add('basaltDark', cyl(rb + 0.55, rb + 0.62, 0.34, 8), x, y + 0.17, z);
        y += 0.34;
      });
      // jaali gallery under the dome
      add('basalt', cyl(2.0, 2.2, 1.3, 8), x, y + 0.65, z);
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2;
        add('jaliWhite', box(0.62, 1.0, 0.06), x + Math.cos(a) * 2.02, y + 0.7, z + Math.sin(a) * 2.02, { ry: -a + Math.PI / 2 });
      }
      y += 1.3;
      add('basaltDark', cyl(2.35, 2.35, 0.3, 16), x, y + 0.15, z);
      // ribbed dome
      add('basalt', cyl(2.15, 2.3, 0.5, 8), x, y + 0.55, z);
      add('basaltDark', onion(2.15, 3.3, 22), x, y + 0.8, z);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        add('basalt', box(0.14, 2.6, 0.14), x + Math.cos(a) * 1.95, y + 2.1, z + Math.sin(a) * 1.95, { ry: -a, rz: 0.3 });
      }
      add('gold', cyl(0.07, 0.07, 1.1, 6), x, y + 4.2, z);
      add('gold', sph(0.17, 8), x, y + 4.9, z);
    });

    /* ---- boats on the harbour -------------------------------------------- */
    [[-46, 268, 0.6], [16, 300, -0.3], [62, 258, 1.1], [-96, 236, 0.2], [-10, 320, 1.9]].forEach(([x, z, ry], i) => {
      const s2 = 0.9 + (i % 3) * 0.15;
      add(i % 2 ? 'wood' : 'plasterWhite', box(2.8 * s2, 0.75 * s2, 6.6 * s2), x, -0.18, z, { ry });
      add(i % 2 ? 'plasterWhite' : 'wood', box(2.4 * s2, 0.55 * s2, 2.6 * s2), x, 0.55 * s2, z + 1.1 * s2, { ry });
      add('grey', cyl(0.07, 0.07, 4.4 * s2, 5), x, 2.5 * s2, z - 0.5 * s2, { ry });
      add('fabricWhite', box(0.06, 1.6 * s2, 1.2 * s2), x, 3.2 * s2, z - 0.5 * s2, { ry });
    });

    /* ---- plaza, palms, crowds, distant city ------------------------------- */
    const people = [[-9, 11], [8, 12], [-15, 7], [15, 8], [0, 14], [-21, 11], [21, 10], [-4, 7],
      [5, 6], [-12, 13], [12, 14], [17, 5], [-18, 4], [2, 17], [24, 15]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-22, 13], [22, 13], [-28, 5], [28, 5], [0, 19]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));
    [[-24, -15], [24, -15], [-28, -3], [28, -3], [-34, 8], [34, 8]].forEach(([x, z], i) => ctx.tree(x, z, 1.25, 'palm'));
    [[-40, -22], [40, -22]].forEach(([x, z], i) => ctx.tree(x, z, 1.15, 'round'));
    // the city behind the monument
    for (let i = 0; i < 11; i++) {
      const x = -78 + i * 15.6;
      const h = 7 + ((i * 37) % 5) * 3.4;
      block('plaster', 11, h, 9, x, -0.3, -58);
      add('terracotta', box(11.6, 0.6, 9.6), x, h - 0.3, -58);
      for (let w2 = 0; w2 < 3; w2++) add('dark', box(1.0, 1.3, 0.2), x - 3 + w2 * 3, h * 0.55, -53.4);
    }
    block('plaster', 24, 22, 13, -64, -0.3, -62);
    add('marble', onion(3.2, 4.6, 22), -64, 21.7, -62);
    add('gold', cyl(0.1, 0.1, 1.4, 6), -64, 26.6, -62);

    ctx.light({ pos: [-26, 13, 26], target: [0, 15, 0], color: 0xffd0a0, intensity: 2400, distance: 150 });
    ctx.light({ pos: [26, 15, 24], target: [0, 15, 0], color: 0xffc890, intensity: 2000, distance: 150 });
    ctx.light({ pos: [0, 6, 22], target: [0, 4, 0], color: 0xffd9b0, intensity: 700, distance: 60 });
  }
};
