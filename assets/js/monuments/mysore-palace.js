/* Mysore Palace — Mysuru · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Rebuilt to measured dimensions.  1 unit = 1 metre.

   real (m)                            model    source
   -----------------------------------------------------------------------
   overall height, to the top of the    44.0    Wikipedia "44 m (144 ft)";
     gold dome and its chhatri                  palace site: "Gold-plated dome
                                                about 145 feet from the ground"
   plan, frontage × depth            75 x 48    Wikipedia "75 m (246 ft) across
                                                x 48 m (157 ft) deep"; palace
                                                site "length about 245 feet,
                                                breadth about 156 feet"
   storeys                                 3    Wikipedia / palace site
   central tower, five stages              5    palace site: "five-storied
                                                145 ft tower with a gilded dome"
   façade arches                           9    The Hindu: "nine impressive
                                                arches — three on each side
                                                flanking the giant central arch
                                                that is supported by two smaller
                                                arches"; mysore.ind.in
   side bays                               7    brief; fitted to the 48 m depth
   domes: gold centre, deep pink        —       palace site: "deep pink marble
     corners; two domed chhatris                domes"; mysore.ind.in: "two
     either side of the central arch            domed Chhatris ... on either
                                                side of the central arch"
   Gajalakshmi over the central arch            palace site / Wikipedia

   The heights of the four corner towers and of the two chhatris flanking the
   central arch are not stated in any source; they are read off photographs
   and kept clearly below the 44 m of the gold dome. */

export default {
  id: 'mysore-palace',
  accent: '#d4a24c',
  accent2: '#f0c878',
  seed: 43,
  floodScale: 0.26,
  bounds: 118,
  minDist: 22,
  maxDist: 360,
  time: 16.2,
  home: { pos: [44, 29, 132], target: [2, 21, 0], fov: 38 },
  ground: { texture: 'grass', size: 2400, color: 0x8f9666 },
  views: [
    { name: 'Full', pos: [44, 29, 132], target: [2, 21, 0] },
    { name: 'Façade', pos: [0, 19, 122], target: [0, 20, 0] },
    { name: 'The tower', pos: [24, 42, 78], target: [0, 34, -3] },
    { name: 'Arcade', pos: [13, 6.5, 54], target: [4, 8, 24] },
    { name: 'Forecourt', pos: [-44, 13, 104], target: [0, 22, 0] }
  ],
  tour: [
    {
      title: 'Amba Vilas', deva: 'मैसूर पैलेस',
      text: 'The old wooden palace of the Wadiyars burned in 1897. Krishnaraja Wodeyar IV commissioned a new one that August; Henry Irwin designed it, and construction ran from 1897 to 1912.',
      pos: [56, 26, 104], target: [0, 20, 0], time: 16.2
    },
    {
      title: 'Indo-Saracenic', deva: 'वास्तुकला',
      text: 'Irwin combined Indo-Islamic, Rajput, Hoysala and Gothic elements into one composition: a deep pink facade of arched colonnades, a central tower, and smaller domes and chhatris along the roofline.',
      pos: [0, 16, 92], target: [0, 18, 0], time: 11
    },
    {
      title: 'The Golden Finial', deva: 'कलश',
      text: 'The central tower carries a large onion dome capped with a gilded finial. It rises above the durbar hall, the ceremonial heart of the palace, whose carved rosewood ceiling is one of the finest in India.',
      pos: [24, 40, 56], target: [0, 36, 0], time: 15.6
    },
    {
      title: 'The Verandah', deva: 'बरामदा',
      text: 'A nine-arch verandah fronts the entrance, with a taller central arch, above three storeys of arcaded windows and deep chajja cornices that keep the sun off the walls.',
      pos: [26, 8, 44], target: [10, 10, 0], time: 8.8
    },
    {
      title: 'A Hundred Thousand Lamps', deva: 'दसहरा',
      text: 'On Sunday evenings, and through the ten days of Dasara, close to a hundred thousand bulbs outline the palace and its gardens. The building is one of the largest palaces in India.',
      pos: [-40, 10, 76], target: [0, 16, 0], time: 21.2
    },
    {
      title: 'Night Illumination', deva: 'रात्रि',
      text: 'Under the lamps the pink walls warm to gold and the domes pick up the light, while the gardens in front fill with visitors.',
      pos: [46, 20, 92], target: [0, 20, 0], time: 22.0
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, block, col, plane } = ctx;

    /* The walls are a pale dusty rose plaster with cream-white trim; the
       sandstonePink material renders far too saturated at this exposure, so
       the rose is mixed here by tinting the plaster. */
    function tint(key, hex) {
      const m = ctx.mat(key);
      if (!m || !m.clone) return key;
      const c = m.clone();
      c.color.setHex(hex);
      return c;
    }
    const rose = tint('plaster', 0xf6ddd0);       // dusty rose walls
    const roseSoft = tint('plaster', 0xfbe8dd);
    const shade = tint('plaster', 0x7d5a4e);      // shaded gallery interior
    const crimson = tint('plaster', 0xc0505c);    // deep pink marble domes
    const amber = tint('plaster', 0xa8823f);      // glazed amber bays
    const trim = 'ivory';
    const trim2 = 'cream';
    const gold = 'goldLeaf';

    /* ---------------------------------------------------------------- layout */
    const W = 75, D = 48, HX = W / 2, HZ = D / 2;
    const F = 1.6;                              // arcade floor
    const Y1 = 9.6, Y2 = 15.8, Y3 = 21.4;       // storey divisions
    const ROOF = 22.2, PAR = 23.4;
    const PW = 27.0, PZ = 28.6;                 // the projecting entrance porch
    const PZD = PZ - HZ, PZC = (HZ + PZ) / 2;

    /* --------------------------------------------------------- cheap frames */
    function frame(w, h, thick, depth) {
      const outer = ctx.archShape(w, h, 0.5);
      const inner = ctx.archShape(Math.max(w - thick * 2, 0.3), Math.max(h - thick * 1.1, 0.3), 0.5);
      const pts = inner.getPoints(7).map((p) => new T3.Vector2(p.x, p.y + thick * 0.6));
      outer.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 3 });
    }
    function panel(w, h, depth, holes) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      for (const o of holes) {
        const a = ctx.archShape(o.w, o.h, 0.5);
        const pts = a.getPoints(9).map((p) => new T3.Vector2(p.x + o.x, p.y + (o.y || 0)));
        s.holes.push(new T3.Path(pts));
      }
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 3 });
    }

    /* ------------------------------------------------------ plinth and steps */
    block('granite', W + 13, 1.0, D + 13, 0, 0, 0);
    block('stone', W + 10, 0.6, D + 10, 0, 1.0, 0);
    for (let i = 0; i < 4; i++) {
      add('stone', box(30 - i * 1.4, 0.4 * (i + 1), 1.1), 0, 0.2 * (i + 1), HZ + 6.5 + i * 1.0);
    }

    /* ------------------------------------------------------- the massing
       The inner mass is held back 2.6 m on every face to leave room for the
       verandah that runs behind the ground-floor arcade. */
    const VD = 2.6;
    block(rose, W - 2 * VD, Y3 - F, D - 2 * VD, 0, F, 0);
    block('stone', W - 0.4, 0.4, D - 0.4, 0, F + 0.02, 0);

    /* ------------------------------------------------- an arcaded storey face
       One pierced panel per face per storey, with the shaded gallery and the
       glazed amber bays behind it — the rhythm that runs right round the
       building on all three levels. */
    const WT = 0.5;
    function arcadeFace(ry, cx, cz, nx, nz, span, holes, y0, hgt, vd) {
      add(rose, panel(span, hgt, WT, holes), cx - nx * WT, y0, cz - nz * WT, { ry });
      add(shade, box(span, hgt, 0.16), cx - nx * (WT + vd), y0 + hgt / 2, cz - nz * (WT + vd), { ry });
      add('stone', box(span, 0.32, vd), cx - nx * (WT + vd / 2), y0 + 0.16, cz - nz * (WT + vd / 2), { ry });
      add(trim, box(span, 0.34, 0.3), cx + nx * 0.1, y0 + 0.5, cz + nz * 0.1, { ry });
      const ux = Math.cos(ry), uz = -Math.sin(ry);
      holes.forEach((o) => {
        const wx = cx + ux * o.x, wz = cz + uz * o.x;
        add(amber, box(o.w * 0.84, o.h * 0.5, 0.1), wx - nx * (WT + 0.3),
          y0 + (o.y || 0) + o.h * 0.31, wz - nz * (WT + 0.3), { ry });
        add(trim2, box(0.07, o.h * 0.5, 0.06), wx - nx * (WT + 0.22),
          y0 + (o.y || 0) + o.h * 0.31, wz - nz * (WT + 0.22), { ry });
        add(trim2, box(o.w * 0.84, 0.07, 0.06), wx - nx * (WT + 0.22),
          y0 + (o.y || 0) + o.h * 0.31, wz - nz * (WT + 0.22), { ry });
        add(trim, frame(o.w + 0.8, o.h + 0.42, 0.24, 0.3), wx + nx * 0.04, y0 + (o.y || 0),
          wz + nz * 0.04, { ry });
        add(trim2, frame(o.w + 0.28, o.h + 0.14, 0.11, 0.16), wx + nx * 0.32, y0 + (o.y || 0),
          wz + nz * 0.32, { ry });
      });
    }

    /* the opening rhythms */
    const frontHoles = [];      // the wings only — the centre three are the porch
    [16.2, 23.6, 31.0].forEach((c) => {
      frontHoles.push({ x: c, w: 6.0, h: 6.6 });
      frontHoles.push({ x: -c, w: 6.0, h: 6.6 });
    });
    const backHoles = [];
    for (let i = 0; i < 4; i++) {
      const c = i * 9.0;
      backHoles.push({ x: c, w: 5.4, h: 6.6 });
      if (c) backHoles.push({ x: -c, w: 5.4, h: 6.6 });
    }
    const sideHoles = [];       // seven bays on each flank
    [0, 6.2, 12.4, 18.6].forEach((c) => {
      sideHoles.push({ x: c, w: 4.4, h: 6.6 });
      if (c) sideHoles.push({ x: -c, w: 4.4, h: 6.6 });
    });

    /* ground storey */
    arcadeFace(0, 0, HZ, 0, 1, W, frontHoles, F, Y1 - F, VD);
    arcadeFace(Math.PI, 0, -HZ, 0, -1, W, backHoles, F, Y1 - F, VD);
    arcadeFace(Math.PI / 2, HX, 0, 1, 0, D, sideHoles, F, Y1 - F, VD);
    arcadeFace(-Math.PI / 2, -HX, 0, -1, 0, D, sideHoles, F, Y1 - F, VD);

    /* first and second storeys: the same rhythm, smaller openings, raised
       on sills so the gallery reads as a screen of arches */
    const sc = (arr, k, h) => arr.map((o) => ({ x: o.x, w: o.w * k, h, y: 1.0 }));
    [1, 2].forEach((s) => {
      const y0 = s === 1 ? Y1 : Y2, hgt = s === 1 ? Y2 - Y1 : Y3 - Y2;
      const h = s === 1 ? 4.6 : 3.8, k = s === 1 ? 0.72 : 0.62;
      arcadeFace(0, 0, HZ, 0, 1, W, sc(frontHoles, k, h), y0, hgt, 1.3);
      arcadeFace(Math.PI, 0, -HZ, 0, -1, W, sc(backHoles, k, h), y0, hgt, 1.3);
      arcadeFace(Math.PI / 2, HX, 0, 1, 0, D, sc(sideHoles, k, h), y0, hgt, 1.3);
      arcadeFace(-Math.PI / 2, -HX, 0, -1, 0, D, sc(sideHoles, k, h), y0, hgt, 1.3);
    });

    /* ------------------------------------------ string courses and cornices */
    [Y1, Y2].forEach((y) => {
      add(trim, box(W + 1.2, 0.5, D + 1.2), 0, y, 0);
      add(trim2, box(W + 0.6, 0.18, D + 0.6), 0, y + 0.34, 0);
      add(trim, box(W + 3.0, 0.42, D + 3.0), 0, y - 0.46, 0);      // chajja eaves
      add(trim2, box(W + 2.4, 0.2, D + 2.4), 0, y - 0.78, 0);
    });
    for (let i = -12; i <= 12; i++) {
      const x = i * 3.0;
      [-1, 1].forEach((s) => {
        add(trim, box(0.34, 0.5, 0.5), x, Y1 - 0.76, s * (HZ + 1.3));
        add(trim, box(0.34, 0.5, 0.5), x, Y2 - 0.76, s * (HZ + 1.3));
      });
    }
    // pierced balustrades along each balcony
    [Y1 - 1.45, Y2 - 1.45].forEach((y) => {
      ctx.railing(0, y, HZ + 1.42, W + 2.8, trim2, 0.6, 0, 29);
      ctx.railing(0, y, -HZ - 1.42, W + 2.8, trim2, 0.6, 0, 29);
      ctx.railing(HX + 1.42, y, 0, D + 2.8, trim2, 0.6, Math.PI / 2, 19);
      ctx.railing(-HX - 1.42, y, 0, D + 2.8, trim2, 0.6, Math.PI / 2, 19);
    });
    // main cornice and parapet
    add(trim, box(W + 4.0, 0.52, D + 4.0), 0, Y3 + 0.26, 0);
    add(trim, box(W + 3.0, 0.42, D + 3.0), 0, Y3 + 0.68, 0);
    block(roseSoft, W + 0.6, PAR - ROOF + 0.3, D + 0.6, 0, ROOF, 0);
    ctx.railing(0, PAR - 0.05, HZ + 0.3, W, trim, 0.5, 0, 27);
    ctx.railing(0, PAR - 0.05, -HZ - 0.3, W, trim, 0.5, 0, 27);
    ctx.railing(HX + 0.3, PAR - 0.05, 0, D, trim, 0.5, Math.PI / 2, 19);
    ctx.railing(-HX - 0.3, PAR - 0.05, 0, D, trim, 0.5, Math.PI / 2, 19);

    /* -------------------------------------------------- projecting entrance
       Three big arches per storey on a porch that carries the two crimson
       chhatris and the Gajalakshmi relief. */
    const porchG = [{ x: 0, w: 8.6, h: 8.0 }, { x: 8.8, w: 6.0, h: 6.6 }, { x: -8.8, w: 6.0, h: 6.6 }];
    block(rose, PW, Y3 - F + 0.9, PZD - VD, 0, F, HZ + (PZD - VD) / 2);
    arcadeFace(0, 0, PZ, 0, 1, PW, porchG, F, Y1 - F, VD);
    add(trim, box(PW + 0.1, 0.36, 0.3), 0, Y1 - 0.22, PZ + 0.08);
    [1, 2].forEach((s) => {
      const y0 = s === 1 ? Y1 : Y2, hgt = s === 1 ? Y2 - Y1 : Y3 - Y2;
      const h = s === 1 ? 4.8 : 4.0, k = s === 1 ? 0.78 : 0.68;
      arcadeFace(0, 0, PZ, 0, 1, PW, sc(porchG, k, h), y0, hgt, 1.3);
    });
    // porch side walls and their plinths
    [-1, 1].forEach((s) => {
      block(rose, 1.0, Y3 - F + 0.9, PZD, s * (PW / 2 - 0.5), F, PZC);
      block('stone', 1.6, F, PZD, s * (PW / 2 - 0.8), 0, PZC);
      // a narrow jharokha bay on the porch flank
      block(roseSoft, 1.2, 3.2, 2.8, s * (PW / 2 + 0.4), Y2 + 0.4, PZC - 2.6);
      add(trim, box(1.5, 0.24, 3.1), s * (PW / 2 + 0.4), Y2 + 3.6, PZC - 2.6);
    });
    // Gajalakshmi relief above the central arch
    add(trim, box(3.2, 2.4, 0.3), 0, Y1 + 1.1, PZ + 0.14);
    add(trim2, box(2.5, 1.8, 0.2), 0, Y1 + 1.35, PZ + 0.26);
    add(gold, sph(0.5, 10), 0, Y1 + 2.15, PZ + 0.38);
    // porch cornice and parapet, carried above the main roofline
    block(roseSoft, PW + 0.2, 1.0, PZD + 0.2, 0, Y3 + 0.9, PZC);
    add(trim, box(PW + 3.4, 0.55, PZD + 3.4), 0, Y3 + 2.0, PZC);
    add(trim, box(PW + 2.4, 0.42, PZD + 2.4), 0, Y3 + 2.4, PZC);
    block(roseSoft, PW + 0.5, 0.9, PZD + 0.5, 0, Y3 + 2.65, PZC);
    ctx.railing(0, Y3 + 3.55, PZ - 0.2, PW, trim, 0.5, 0, 15);

    /* ------------------------------------ the two crimson chhatris flanking
       the central arch: open colonnaded drums under deep pink marble domes */
    [-1, 1].forEach((s) => {
      const px = s * 9.4, pz = PZ - 3.2;
      block(rose, 6.2, 1.0, 6.2, px, Y3 + 3.55, pz);
      add(trim, box(7.0, 0.4, 7.0), px, Y3 + 4.6, pz);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        add(trim, cyl(0.24, 0.3, 2.9, 6), px + Math.cos(a) * 2.4, Y3 + 6.2, pz + Math.sin(a) * 2.4);
      }
      add(shade, cyl(2.1, 2.1, 2.9, 10), px, Y3 + 6.2, pz);
      add(trim, cyl(3.3, 2.9, 0.42, 16), px, Y3 + 7.75, pz);
      add(crimson, onion(2.7, 3.9, 16), px, Y3 + 7.95, pz);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        add(gold, box(0.08, 2.4, 0.08), px + Math.cos(a) * 2.5, Y3 + 9.6, pz + Math.sin(a) * 2.5,
          { ry: -a, rz: 0.3 });
      }
      add(gold, cyl(0.09, 0.09, 1.2, 5), px, Y3 + 12.0, pz);
      add(gold, sph(0.19, 6), px, Y3 + 12.7, pz);
    });

    /* ------------------------------------------------------- the five-storey
       central tower.  Five stages from the plinth — the lower three hidden by
       the main block, the upper two rising clear of the roof — then the
       colonnaded drum, the gilded onion dome and its chhatri, landing on 44 m. */
    const TW = 15.5, TZ = -3.0;
    const L = [F, 7.2, 12.8, 18.4, 24.0, 28.8];
    block(rose, TW, L[5] - L[0], TW, 0, L[0], TZ);
    [L[3], L[4]].forEach((y) => {
      add(trim, box(TW + 1.4, 0.46, TW + 1.4), 0, y + 0.2, TZ);
      add(trim2, box(TW + 0.8, 0.18, TW + 0.8), 0, y + 0.52, TZ);
    });
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      block(trim2, 1.2, L[5] - L[3], 1.2, dx * (TW / 2 - 0.6), L[3], TZ + dz * (TW / 2 - 0.6));
    }
    [L[3], L[4]].forEach((y) => {
      const holes = [{ x: 0, w: 3.0, h: 4.0, y: 0.9 }, { x: -4.8, w: 2.4, h: 3.6, y: 0.9 },
        { x: 4.8, w: 2.4, h: 3.6, y: 0.9 }];
      arcadeFace(0, 0, TZ + TW / 2, 0, 1, TW, holes, y, 5.6, 1.2);
      arcadeFace(Math.PI, 0, TZ - TW / 2, 0, -1, TW, holes, y, 5.6, 1.2);
      arcadeFace(Math.PI / 2, TW / 2, TZ, 1, 0, TW, holes, y, 5.6, 1.2);
      arcadeFace(-Math.PI / 2, -TW / 2, TZ, -1, 0, TW, holes, y, 5.6, 1.2);
    });
    // tower cornice, then four small chhatris at its corners
    add(trim, box(TW + 2.8, 0.55, TW + 2.8), 0, L[5] + 0.28, TZ);
    add(trim, box(TW + 1.8, 0.42, TW + 1.8), 0, L[5] + 0.72, TZ);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const cx = dx * (TW / 2 - 0.4), cz = TZ + dz * (TW / 2 - 0.4);
      add(trim, box(1.8, 0.26, 1.8), cx, L[5] + 1.0, cz);
      add(trim, cyl(0.58, 0.72, 0.5, 8), cx, L[5] + 1.4, cz);
      add(gold, sph(0.44, 8), cx, L[5] + 1.9, cz);
      add(gold, cone(0.14, 1.4, 5), cx, L[5] + 2.9, cz);
    }

    /* the drum and the gilded onion dome — apex 41 m, chhatri to 44 m */
    const DB = L[5] + 1.0;                       // 29.8
    add(trim, cyl(5.4, 6.0, 0.7, 18), 0, DB + 0.35, TZ);
    add(shade, cyl(4.4, 4.4, 2.4, 12), 0, DB + 1.9, TZ);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      add(trim, cyl(0.24, 0.3, 2.6, 6), Math.cos(a) * 4.9, DB + 2.0, TZ + Math.sin(a) * 4.9);
    }
    add(trim, cyl(6.1, 5.6, 0.5, 18), 0, DB + 3.35, TZ);
    add(gold, onion(5.2, 7.2, 26), 0, DB + 3.6, TZ);       // 33.4 → 40.6
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      add(gold, box(0.1, 4.4, 0.1), Math.cos(a) * 4.75, DB + 6.6, TZ + Math.sin(a) * 4.75,
        { ry: -a, rz: 0.28 });
    }
    /* instead of a finial, the dome carries a small chhatri */
    const DA = DB + 3.6 + 6.2;                             // 39.6
    add(gold, cyl(1.6, 1.8, 0.4, 10), 0, DA, TZ);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      add(gold, cyl(0.11, 0.13, 1.1, 5), Math.cos(a) * 1.25, DA + 0.75, TZ + Math.sin(a) * 1.25);
    }
    add(gold, cyl(1.7, 1.6, 0.24, 10), 0, DA + 1.4, TZ);
    add(gold, onion(1.3, 1.6, 12), 0, DA + 1.55, TZ);
    add(gold, cyl(0.07, 0.07, 1.0, 5), 0, DA + 3.15, TZ);

    /* ------------------------------------------- the four square corner towers */
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = dx * (HX - 5.0), z = dz * (HZ - 5.0);
      block(rose, 8.8, 22.2 - F, 8.8, x, F, z);
      add(trim, box(9.8, 0.42, 9.8), x, 22.2, z);
      for (const [ax, az] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        block(trim2, 0.9, 4.4, 0.9, x + ax * 3.9, 22.4, z + az * 3.9);
      }
      for (let f = 0; f < 4; f++) {
        const ry = (f * Math.PI) / 2;
        const nx = Math.sin(ry), nz = Math.cos(ry);
        add('dark', arch(1.5, 3.0, 0.16), x + nx * 4.75, 23.0, z + nz * 4.75, { ry });
        add(amber, box(0.8, 1.1, 0.1), x + nx * 4.8, 23.6, z + nz * 4.8, { ry });
        add(trim, frame(1.9, 3.3, 0.17, 0.22), x + nx * 4.78, 23.0, z + nz * 4.78, { ry });
      }
      add(trim, box(10.2, 0.55, 10.2), x, 26.6, z);
      add(trim, box(9.4, 0.35, 9.4), x, 27.2, z);
      // open colonnade drum, then the deep pink dome
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        add(trim, cyl(0.2, 0.24, 2.0, 6), x + Math.cos(a) * 3.0, 28.4, z + Math.sin(a) * 3.0);
      }
      add(shade, cyl(2.4, 2.4, 2.0, 10), x, 28.4, z);
      add(trim, cyl(3.5, 3.0, 0.42, 14), x, 29.4, z);
      add(crimson, onion(2.9, 3.6, 16), x, 29.6, z);
      add(gold, cyl(0.08, 0.08, 1.0, 5), x, 33.3, z);
      add(gold, sph(0.2, 6), x, 33.9, z);
      add(gold, cone(0.11, 0.9, 5), x, 34.4, z);
    }

    /* -------------------------------------------- roofline chhatris and spires */
    function smallChhatri(x, y, z, s) {
      add(trim, cyl(1.5 * s, 1.6 * s, 0.24 * s, 8), x, y + 0.12 * s, z);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        add(trim, cyl(0.12 * s, 0.14 * s, 1.5 * s, 5),
          x + Math.cos(a) * 1.05 * s, y + 0.95 * s, z + Math.sin(a) * 1.05 * s);
      }
      add(trim, cyl(1.55 * s, 1.55 * s, 0.16 * s, 8), x, y + 1.78 * s, z);
      add(crimson, dome(1.3 * s, 1.5 * s, 10), x, y + 1.86 * s, z);
      add(gold, cone(0.07 * s, 0.55 * s, 4), x, y + 3.3 * s, z);
    }
    for (let i = 0; i < 5; i++) {
      const x = -26 + i * 13;
      smallChhatri(x, PAR, HZ - 3.4, 0.95);
      smallChhatri(x, PAR, -HZ + 3.4, 0.95);
    }
    for (let i = 0; i < 3; i++) {
      const z = -13 + i * 13;
      smallChhatri(HX - 3.4, PAR, z, 0.95);
      smallChhatri(-HX + 3.4, PAR, z, 0.95);
    }
    for (let i = -10; i <= 10; i++) {
      add(gold, cone(0.15, 1.1, 4), i * 3.6, PAR + 0.55, HZ + 0.3);
      add(gold, cone(0.15, 1.1, 4), i * 3.6, PAR + 0.55, -HZ - 0.3);
    }
    for (let i = -5; i <= 5; i++) {
      add(gold, cone(0.15, 1.1, 4), HX + 0.3, PAR + 0.55, i * 4.2);
      add(gold, cone(0.15, 1.1, 4), -HX - 0.3, PAR + 0.55, i * 4.2);
    }

    /* ------------------------------------------------- forecourt and gardens */
    add('paving', plane(160, 200), 0, 0.06, 38, { rx: -Math.PI / 2 });
    [[-34, 54], [34, 54], [-34, 84], [34, 84]].forEach(([x, z]) => {
      add('grass', plane(32, 26), x, 0.1, z, { rx: -Math.PI / 2 });
      add(trim, box(32.4, 0.24, 26.4), x, 0.1, z);
    });
    add('stone', cyl(8.4, 8.8, 0.8, 20), 0, 0.4, 64);
    add('water', cyl(7.6, 7.6, 0.2, 20), 0, 0.9, 64);
    add('stone', cyl(0.9, 1.1, 2.2, 8), 0, 1.5, 64);
    // the Jayamartanda gate, well beyond the palace
    block(rose, 26, 11, 5, 0, 0, 132);
    add('dark', arch(7.4, 9.0, 0.6), 0, 0.2, 134.4);
    add(trim, frame(8.2, 9.6, 0.45, 0.45), 0, 0.2, 134.5);
    add(trim, box(27, 0.7, 6), 0, 11, 132);
    [-1, 1].forEach((s) => {
      add(crimson, dome(2.5, 2.3, 12), s * 9.4, 11.3, 132);
      add(gold, cyl(0.08, 0.08, 1.2, 5), s * 9.4, 13.6, 132);
    });

    /* ------------------------------------------------ people, lamps and trees */
    const people = [[-14, 38], [12, 40], [-5, 34], [18, 36], [-22, 44], [24, 46], [0, 32],
      [-9, 48], [9, 50], [-18, 56], [18, 56], [-2, 66], [5, 46], [-27, 32], [27, 30],
      [-33, 62], [33, 62], [12, 72], [-12, 72]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2,
      ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-36, 36], [36, 36], [-17, 70], [17, 70], [-40, 78], [40, 78], [-26, 112], [26, 112]]
      .forEach(([x, z]) => ctx.lamp(x, z, 4.2, 'black'));
    [[-52, 44], [52, 44], [-54, 74], [54, 74], [-48, 104], [48, 104], [-62, 20], [62, 20],
     [-60, 58], [60, 58], [-66, 94], [66, 94]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.35 + (i % 3) * 0.2, 'round'));

    ctx.light({ pos: [-38, 20, 58], target: [0, 26, 0], color: 0xffd0a0, intensity: 3600, distance: 250 });
    ctx.light({ pos: [38, 22, 52], target: [0, 26, 0], color: 0xffc890, intensity: 3000, distance: 250 });
    ctx.light({ pos: [0, 16, 84], target: [0, 34, 0], color: 0xffe0b0, intensity: 2000, distance: 200 });
  }
};
