/* Gateway of India — Mumbai · procedural miniature
   Author: Dr Sohil Momin · CC0 1.0 Universal */

export default {
  id: 'gateway-of-india',
  accent: '#9aa8b4',
  accent2: '#c8d6e0',
  seed: 37,
  time: 15.6,
  exposure: 0.86,
  bounds: 60,
  minDist: 14,
  maxDist: 220,
  home: { pos: [42, 16, 62], target: [0, 13, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xa89c86 },
  groundY: -0.35,
  water: { y: -0.28, size: 520, z: 300, color: 0x2c4f5e, distortion: 2.4 },
  views: [
    { name: 'Full', pos: [42, 16, 62], target: [0, 13, 0] },
    { name: 'Arch', pos: [10, 9, 34], target: [0, 11, 0] },
    { name: 'Towers', pos: [26, 24, 40], target: [0, 20, 0] },
    { name: 'From the sea', pos: [-30, 9, 52], target: [0, 12, 0] },
    { name: 'Quay', pos: [-34, 4, 26], target: [-6, 8, 6] }
  ],
  tour: [
    {
      title: 'A Gate to India', deva: 'गेटवे ऑफ़ इंडिया',
      text: 'The Gateway of India was built to mark the landing of King George V at Bombay in December 1911, the first British monarch to visit India. George Wittet\'s Indo-Saracenic design was sanctioned in 1914 and the arch finished in 1924.',
      pos: [42, 16, 62], target: [0, 13, 0], time: 17.3
    },
    {
      title: 'Basalt and Shadow', deva: 'मेहराब',
      text: 'It is built of local basalt, 26 metres high, with a central arch about 15 metres across, its passage cut deep through the block. Two smaller arches flank it, and carved brackets carry the cornice above.',
      pos: [10, 9, 34], target: [0, 11, 0], time: 12
    },
    {
      title: 'Gujarati Detail', deva: 'जाली',
      text: 'The ornament draws on sixteenth-century Gujarati architecture — jaali screens, lotus motifs and slender columns — set into the Indo-Saracenic frame that Wittet had used across Bombay.',
      pos: [14, 14, 30], target: [8, 14, 0], time: 9.5
    },
    {
      title: 'The Octagonal Towers', deva: 'मीनार',
      text: 'Two octagonal towers flank the arch, each carrying a dome of reinforced concrete. They give the monument the silhouette of a triumphal arch crossed with a mosque gateway.',
      pos: [26, 24, 40], target: [0, 20, 0], time: 16.4
    },
    {
      title: 'Apollo Bunder', deva: 'बंदरगाह',
      text: 'The Gateway faces the harbour at Apollo Bunder. In 1948 the last British troops left India through this arch, and today boats leave from the quay for Elephanta Island.',
      pos: [-30, 9, 52], target: [0, 12, 0], time: 17.8
    },
    {
      title: 'Harbour Lights', deva: 'रात्रि',
      text: 'After dark the basalt goes almost black and the floodlights pick out the arch and the domes, with the city\'s lights across the water behind.',
      pos: [38, 14, 56], target: [0, 15, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, onion, arch, archFrame, block, col } = ctx;

    function piercedWall(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const a = ctx.archShape(aw, ah);
      const pts = a.getPoints(26).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 });
    }

    /* ---- quay and plinth ---------------------------------------------- */
    block('paving', 60, 0.9, 44, 0, -0.3, -4);
    for (let i = 0; i < 3; i++) block('granite', 30 - i * 1.6, 0.3, 18 - i * 1.2, 0, 0.6 + i * 0.3, 0);
    // sea wall on the harbour side
    block('stone', 46, 1.6, 1.2, 0, -0.6, 15);

    /* ---- the arch block ----------------------------------------------- */
    const W = 30, H = 26, D = 12;
    const AX = 15, AY = 19.6, SILL = 0.4;
    // front and back faces, each pierced
    add('granite', piercedWall(W, H, 1.6, AX, AY, SILL), 0, 1.5, D / 2 - 1.6);
    add('granite', piercedWall(W, H, 1.6, AX, AY, SILL), 0, 1.5, -D / 2);
    // side walls of the passage
    add('granite', box(2.2, H, D - 3.2), -AX / 2 - 1.1, 1.5 + H / 2, 0);
    add('granite', box(2.2, H, D - 3.2), AX / 2 + 1.1, 1.5 + H / 2, 0);
    // vaulted ribs inside the passage
    for (let i = -1; i <= 1; i++) {
      add('granite', piercedWall(W, H, 0.8, AX, AY, SILL), 0, 1.5, i * 3.2);
    }
    // shaded lining so the passage reads deep
    add('dark', box(AX - 0.3, AY, D - 5.2), 0, 1.5 + SILL + AY / 2, -1.2);
    add('stone', box(AX + 3.0, 0.2, D - 1.2), 0, 1.75, 0);
    add('stone', box(AX + 2.4, 0.25, D), 0, 1.62, 0);

    /* ---- flanking bays with smaller arches ----------------------------- */
    [-1, 1].forEach((s) => {
      const x = s * (W / 2 - 4.2);
      add('granite', piercedWall(7.4, 13, 1.4, 3.4, 7.6, 1.2), x, 1.5, D / 2 - 1.4);
      add('granite', piercedWall(7.4, 13, 1.4, 3.4, 7.6, 1.2), x, 1.5, -D / 2);
      add('grey', box(3.6, 8, D - 2.8), x, 1.5 + 5.2, 0);
      add('sandstoneBuff', archFrame(3.9, 8.2, 0.3, 0.35), x, 2.7, D / 2 + 0.02);
    });

    /* ---- cornice, parapet, roof ---------------------------------------- */
    add('sandstoneBuff', box(W + 2.4, 0.55, D + 2.0), 0, 1.5 + H + 0.2, 0);
    add('granite', box(W + 1.2, 0.7, D + 0.8), 0, 1.5 + H + 0.85, 0);
    for (let i = -6; i <= 6; i++) {
      add('sandstoneBuff', box(1.0, 0.85, 0.9), i * 2.3, 1.5 + H + 1.55, D / 2 - 0.4);
      add('sandstoneBuff', box(1.0, 0.85, 0.9), i * 2.3, 1.5 + H + 1.55, -D / 2 + 0.4);
    }
    // central dome behind the parapet
    add('marble', cyl(3.4, 3.7, 1.2, 20), 0, 1.5 + H + 1.2, -1.5);
    add('marble', onion(3.4, 5.0, 24), 0, 1.5 + H + 2.4, -1.5);
    add('gold', cyl(0.09, 0.09, 1.4, 8), 0, 1.5 + H + 7.4, -1.5);
    add('gold', sph(0.22, 8), 0, 1.5 + H + 8.2, -1.5);

    /* ---- octagonal towers ---------------------------------------------- */
    [-1, 1].forEach((s) => {
      const x = s * (W / 2 + 2.6), z = D / 2 - 3.4;
      col('granite', 3.1, 3.5, 3.0, x, 1.5, z, 8);
      col('granite', 2.5, 2.9, 15.0, x, 4.5, z, 8);
      // banded shaft
      for (let i = 0; i < 4; i++) add('sandstoneBuff', cyl(2.55 - i * 0.02, 2.6 - i * 0.02, 0.3, 8), x, 7.4 + i * 3.4, z);
      add('sandstoneBuff', cyl(3.3, 3.5, 0.5, 8), x, 19.5, z);
      // jaali gallery
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2;
        add('jaliWhite', box(1.0, 1.1, 0.06), x + Math.cos(a) * 3.1, 20.6, z + Math.sin(a) * 3.1, { ry: -a + Math.PI / 2 });
      }
      add('marble', cyl(3.2, 3.2, 0.16, 16), x, 21.2, z);
      add('marble', cyl(2.7, 2.9, 0.7, 8), x, 21.6, z);
      add('marble', onion(2.7, 4.0, 22), x, 21.95, z);
      add('gold', cyl(0.08, 0.08, 1.2, 6), x, 26.1, z);
      add('gold', sph(0.18, 8), x, 26.8, z);
    });

    /* ---- boats on the harbour ------------------------------------------ */
    // small dhows out on the harbour, hulls sitting on the water line
    const boats = [[-22, 34, 0.6], [10, 40, -0.3], [26, 30, 1.1], [-34, 26, 0.2]];
    boats.forEach(([x, z, ry], i) => {
      add(i % 2 ? 'wood' : 'plasterWhite', box(2.6, 0.7, 6.4), x, -0.2, z, { ry });
      add('plasterWhite', box(2.2, 0.5, 2.4), x, 0.5, z + 1.2, { ry });
      add('grey', cyl(0.07, 0.07, 4.2, 5), x, 2.4, z - 0.4, { ry });
    });

    /* ---- plaza, palms, crowds ------------------------------------------ */
    const people = [[-8, 10], [8, 11], [-14, 6], [14, 7], [0, 13], [-20, 10], [20, 9], [-4, 6],
      [4, 5], [-11, 12], [11, 13], [16, 4]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-20, 12], [20, 12], [-26, 4], [26, 4], [0, 17]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-22, -14], [22, -14], [-26, -2], [26, -2]].forEach(([x, z], i) => ctx.tree(x, z, 1.3, 'palm'));

    /* ---- distant city silhouette --------------------------------------- */
    for (let i = 0; i < 9; i++) {
      const x = -70 + i * 17;
      const h = 6 + ((i * 37) % 5) * 3;
      block('plaster', 12, h, 8, x, -0.3, -34);
      add('terracotta', box(12.6, 0.6, 8.6), x, h - 0.3, -34);
    }
    block('plaster', 22, 22, 12, -58, -0.3, -40);
    add('marble', onion(3.0, 4.4, 20), -58, 21.7, -40);

    ctx.light({ pos: [-26, 12, 26], target: [0, 14, 0], color: 0xffd0a0, intensity: 2200, distance: 150 });
    ctx.light({ pos: [26, 14, 24], target: [0, 14, 0], color: 0xffc890, intensity: 1900, distance: 150 });
  }
};
