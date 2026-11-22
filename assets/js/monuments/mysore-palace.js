/* Mysore Palace — Mysuru · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'mysore-palace',
  accent: '#c98a6e',
  accent2: '#e8c07a',
  seed: 43,
  bounds: 110,
  minDist: 24,
  maxDist: 340,
  time: 16.2,
  home: { pos: [54, 33, 121], target: [7, 22, 0], fov: 38 },
  ground: { texture: 'grass', size: 2400, color: 0x8f9666 },
  views: [
    { name: 'Full', pos: [54, 33, 121], target: [7, 22, 0] },
    { name: 'Facade', pos: [0, 22, 104], target: [0, 20, 0] },
    { name: 'Tower', pos: [30, 48, 70], target: [0, 36, 0] },
    { name: 'Arcade', pos: [20, 8, 48], target: [6, 8, 6] },
    { name: 'Forecourt', pos: [-50, 14, 94], target: [0, 22, 0] }
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
    const { add, box, cyl, sph, cone, dome, onion, arch, block, plane } = ctx;

    /* ---------------------------------------------------------------- palette
       The real walls are a dusty rose / salmon plaster with cream-white trim.
       The palette's sandstonePink renders far too saturated at this exposure,
       so the rose is mixed here by tinting the plaster material. */
    function tint(key, hex) {
      const m = ctx.mat(key);
      if (!m || !m.clone) return key;
      const c = m.clone();
      c.color.setHex(hex);
      return c;
    }
    const rose = tint('plaster', 0xffd8cc);      // dusty rose walls
    const roseSoft = tint('plaster', 0xffe4d8);  // lighter panels
    const shade = tint('plaster', 0x8a6458);     // shaded verandah interior
    const crimson = tint('plaster', 0xc85a66);   // deep pink marble domes
    const trim = 'ivory';                        // cream-white stone trim
    const trim2 = 'cream';
    const gold = 'goldLeaf';
    const amber = tint('plaster', 0xd8b070);   // glazed bays behind the arches

    /* ---------------------------------------------------------------- layout */
    const W = 72, D = 46, HX = W / 2, HZ = D / 2;
    const F = 1.8;                            // ground-floor level
    const Y1 = 8.6, Y2 = 14.2, Y3 = 19.8;     // storey divisions
    const ROOF = 20.6, PAR = 21.6;
    const VD = 2.7;                           // verandah recess
    const SILL = 2.1, AH = 4.6;               // verandah arch sill and height

    /* --------------------------------------------------------- cheap frames */
    function frame(w, h, thick, depth) {
      const outer = ctx.archShape(w, h, 0.58);
      const inner = ctx.archShape(Math.max(w - thick * 2, 0.3), Math.max(h - thick * 1.1, 0.3), 0.58);
      const pts = inner.getPoints(7).map((p) => new T3.Vector2(p.x, p.y + thick * 0.6));
      outer.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 2 });
    }

    /* ------------------------------------------------------- pierced panels */
    function panel(w, h, depth, holes) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      for (const o of holes) {
        const a = ctx.archShape(o.w, o.h, o.spring || 0.58);
        const pts = a.getPoints(13).map((p) => new T3.Vector2(p.x + o.x, p.y + (o.y || 0)));
        s.holes.push(new T3.Path(pts));
      }
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 3 });
    }

    /* one arcaded face of the ground storey: a deep pierced wall with the
       shaded interior behind it, a floor line and a carved frame per bay */
    function verandah(face, holes, span) {
      const nx = face === '+x' ? 1 : face === '-x' ? -1 : 0;
      const nz = face === '+z' ? 1 : face === '-z' ? -1 : 0;
      const ry = nx === 1 ? Math.PI / 2 : nx === -1 ? -Math.PI / 2 : nz === 1 ? 0 : Math.PI;
      const px = nx * (HX - VD), pz = nz * (HZ - VD);
      const ux = Math.cos(ry), uz = -Math.sin(ry);
      add(rose, panel(span, Y1 - F, VD, holes), px, F, pz, { ry });
      // shaded back wall of the verandah, one bay deep
      add(shade, box(span, Y1 - F, 0.14), px - nx * 0.1, F + (Y1 - F) / 2, pz - nz * 0.1, { ry });
      // verandah floor, raised a step above the plinth
      add('stone', box(span, 0.34, VD + 0.12), px + nx * VD * 0.5, F + 0.17, pz + nz * VD * 0.5, { ry });
      const fx = px + nx * VD, fz = pz + nz * VD;
      // continuous sill band and spandrel band on the outer face
      add(trim, box(span + 0.08, 0.36, 0.3), fx + nx * 0.11, F + 0.36, fz + nz * 0.11, { ry });
      add(trim, box(span + 0.08, 0.34, 0.24), fx + nx * 0.09, Y1 - 0.2, fz + nz * 0.09, { ry });
      for (const o of holes) {
        const wx = fx + ux * o.x, wz = fz + uz * o.x;
        add(roseSoft, frame(o.w + 0.86, o.h + 0.44, 0.26, 0.3), wx + nx * 0.05, F + (o.y || 0) - 0.02, wz + nz * 0.05, { ry });
        add(trim, frame(o.w + 0.32, o.h + 0.14, 0.12, 0.16), wx + nx * 0.36, F + (o.y || 0) + 0.02, wz + nz * 0.36, { ry });
        add(trim, box(o.w + 1.2, 0.2, 0.26), wx + nx * 0.11, F + (o.y || 0) + o.h * 0.57, wz + nz * 0.1, { ry });
        // inner order of the verandah, standing a metre back in the shade
        [-1, 1].forEach((d) => {
          add(trim2, cyl(0.19, 0.24, o.h + 0.2, 6), wx + ux * d * (o.w / 2 + 0.42) - nx * 1.15,
            F + (o.y || 0) + (o.h + 0.2) / 2, wz + uz * d * (o.w / 2 + 0.42) - nz * 1.15);
        });
      }
    }

    /* ------------------------------------------------------ plinth and steps */
    block('granite', W + 12, 1.1, D + 12, 0, 0, 0);
    block('stone', W + 9, 0.7, D + 9, 0, 1.1, 0);
    for (let i = 0; i < 4; i++) {
      add('stone', box(26 - i * 1.2, 0.42 * (i + 1), 1.1), 0, 0.21 * (i + 1), HZ + 5.0 + i * 1.0);
    }

    /* ---------------------------------------------------- main block massing */
    block(rose, W, Y3 - Y1, D, 0, Y1, 0);                       // upper storeys
    block(rose, W - 2 * VD, Y1 - F, D - 2 * VD, 0, F, 0);       // inner mass
    block('stone', W - 0.2, 0.4, D - 0.2, 0, F + 0.02, 0);      // verandah floor

    /* ground-storey arcades: seven arches either side of the porch on the
       front, seven on each flank, eleven across the back */
    const wingHoles = [];
    for (let i = 0; i < 7; i++) {
      const c = 16.0 + i * 2.92;
      wingHoles.push({ x: c, w: 2.2, h: AH, y: SILL - F });
      wingHoles.push({ x: -c, w: 2.2, h: AH, y: SILL - F });
    }
    verandah('+z', wingHoles, W);
    const backHoles = [];
    for (let i = 0; i < 6; i++) {
      const c = i * 5.7;
      backHoles.push({ x: c, w: 2.9, h: AH, y: SILL - F });
      if (c) backHoles.push({ x: -c, w: 2.9, h: AH, y: SILL - F });
    }
    verandah('-z', backHoles, W);
    const sideHoles = [];
    for (let i = 0; i < 7; i++) {
      const c = 16.4 - i * 5.45;
      sideHoles.push({ x: c, w: 3.1, h: AH, y: SILL - F });
      sideHoles.push({ x: -c, w: 3.1, h: AH, y: SILL - F });
    }
    verandah('+x', sideHoles, D);
    verandah('-x', sideHoles, D);

    /* ------------------------------------------ string courses and cornices */
    [Y1, Y2].forEach((y) => {
      add(trim, box(W + 1.0, 0.52, D + 1.0), 0, y, 0);
      add(trim2, box(W + 0.5, 0.18, D + 0.5), 0, y + 0.35, 0);
      // deep chajja eaves with a drip moulding and brackets
      add(trim, box(W + 2.8, 0.44, D + 2.8), 0, y - 0.5, 0);
      add(trim2, box(W + 2.3, 0.2, D + 2.3), 0, y - 0.82, 0);
    });
    for (let i = -11; i <= 11; i++) {
      const x = i * 3.1;
      [-1, 1].forEach((s) => {
        add(trim, box(0.36, 0.56, 0.56), x, Y1 - 0.8, s * (HZ + 1.2));
        add(trim, box(0.36, 0.56, 0.56), x, Y2 - 0.8, s * (HZ + 1.2));
      });
    }
    // carved frieze band above the verandah arches
    for (let i = -10; i <= 10; i++) {
      add(trim2, box(0.7, 0.7, 0.16), i * 3.3, Y1 - 1.55, HZ + 0.14);
      add(trim2, box(0.7, 0.7, 0.16), i * 3.3, Y1 - 1.55, -HZ - 0.14);
    }
    // pierced balustrades along each storey's balcony
    ctx.railing(0, Y1 - 1.5, HZ + 1.35, W + 2.6, trim2, 0.62, 0, 27);
    ctx.railing(0, Y2 - 1.5, HZ + 1.35, W + 2.6, trim2, 0.62, 0, 27);
    ctx.railing(HX + 1.35, Y1 - 1.5, 0, D + 2.6, trim2, 0.62, Math.PI / 2, 17);
    ctx.railing(-HX - 1.35, Y1 - 1.5, 0, D + 2.6, trim2, 0.62, Math.PI / 2, 17);
    ctx.railing(HX + 1.35, Y2 - 1.5, 0, D + 2.6, trim2, 0.62, Math.PI / 2, 17);
    ctx.railing(-HX - 1.35, Y2 - 1.5, 0, D + 2.6, trim2, 0.62, Math.PI / 2, 17);
    // main cornice, parapet
    add(trim, box(W + 3.6, 0.52, D + 3.6), 0, Y3 + 0.26, 0);
    add(trim, box(W + 2.8, 0.42, D + 2.8), 0, Y3 + 0.68, 0);
    block(roseSoft, W + 0.5, PAR - ROOF + 0.2, D + 0.5, 0, ROOF, 0);
    ctx.railing(0, PAR - 0.1, HZ + 0.25, W, trim, 0.5, 0, 25);
    ctx.railing(0, PAR - 0.1, -HZ - 0.25, W, trim, 0.5, 0, 25);
    ctx.railing(HX + 0.25, PAR - 0.1, 0, D, trim, 0.5, Math.PI / 2, 17);
    ctx.railing(-HX - 0.25, PAR - 0.1, 0, D, trim, 0.5, Math.PI / 2, 17);

    /* ---------------------------------------------- upper-storey window bays */
    function windowBay(x, y, z, ry, w, h, detail) {
      const nx = Math.sin(ry), nz = Math.cos(ry);
      const ux = Math.cos(ry), uz = -Math.sin(ry);
      add('dark', arch(w, h, 0.16), x + nx * 0.03, y, z + nz * 0.03, { ry });
      add(amber, box(w * 0.58, h * 0.4, 0.08), x + nx * 0.2, y + h * 0.18, z + nz * 0.2, { ry });
      add(trim2, box(w * 0.7, 0.1, 0.1), x + nx * 0.21, y + h * 0.4, z + nz * 0.21, { ry });
      add(trim, frame(w + 0.44, h + 0.26, 0.17, 0.22), x + nx * 0.06, y, z + nz * 0.06, { ry });
      if (detail) {
        add(trim, box(w + 1.0, 0.18, 0.3), x + nx * 0.1, y + h * 0.52, z + nz * 0.1, { ry });
        [-1, 1].forEach((d) => {
          add(trim2, box(0.3, h + 0.7, 0.3), x + ux * d * (w / 2 + 0.46) + nx * 0.06,
            y + (h + 0.7) / 2, z + uz * d * (w / 2 + 0.46) + nz * 0.06, { ry });
        });
      }
    }
    const bayX = (i) => 16.0 + i * 2.92;
    for (let r = 0; r < 2; r++) {
      const y = (r ? Y2 : Y1) + 0.9, h = 3.5;
      for (let i = 0; i < 7; i++) {
        windowBay(bayX(i), y, HZ, 0, 2.05, h, true);
        windowBay(-bayX(i), y, HZ, 0, 2.05, h, true);
        windowBay(bayX(i), y, -HZ, Math.PI, 2.05, h, false);
        windowBay(-bayX(i), y, -HZ, Math.PI, 2.05, h, false);
      }
      for (let i = 0; i < 5; i++) {
        const c = 17.4 - i * 8.7;
        windowBay(HX, y, c, Math.PI / 2, 2.4, h, true);
        windowBay(HX, y, -c, Math.PI / 2, 2.4, h, false);
        windowBay(-HX, y, c, -Math.PI / 2, 2.4, h, false);
        windowBay(-HX, y, -c, -Math.PI / 2, 2.4, h, true);
      }
    }

    /* -------------------------------------------------- projecting entrance */
    const PW = 26, PZ = 30.5;
    const PZC = (HZ + PZ) / 2, PZD = PZ - HZ;
    block(rose, PW, Y3 - F + 0.8, PZD, 0, F, PZC);
    const porchHoles = [{ x: 0, w: 4.5, h: 5.9, y: SILL - F }];
    for (let i = 0; i < 4; i++) {
      const c = 3.5 + i * 2.95;
      porchHoles.push({ x: c, w: 1.9, h: AH, y: SILL - F });
      porchHoles.push({ x: -c, w: 1.9, h: AH, y: SILL - F });
    }
    add(rose, panel(PW, Y1 - F, VD, porchHoles), 0, F, PZ - VD, { ry: 0 });
    add(shade, box(PW, Y1 - F, 0.14), 0, F + (Y1 - F) / 2, PZ - VD - 0.1);
    add('stone', box(PW, 0.38, VD + 0.12), 0, F + 0.02, PZ - VD / 2);
    add(trim, box(PW + 0.1, 0.4, 0.32), 0, F + 0.36, PZ + 0.1);
    add(trim, box(PW + 0.1, 0.34, 0.26), 0, Y1 - 0.2, PZ + 0.08);
    porchHoles.forEach((o) => {
      add(trim, frame(o.w + 0.7, o.h + 0.38, 0.24, 0.32), o.x, F + o.y - 0.02, PZ + 0.06);
      add(trim2, frame(o.w + 0.26, o.h + 0.14, 0.13, 0.18), o.x, F + o.y + 0.02, PZ + 0.38);
      add(trim, box(o.w + 1.2, 0.2, 0.26), o.x, F + o.y + o.h * 0.57, PZ + 0.11);
    });
    // porch side walls and their plinths
    [-1, 1].forEach((s) => {
      block(rose, 1.0, Y3 - F + 0.8, PZD, s * (PW / 2 - 0.5), F, PZC);
      block('stone', 1.6, F, PZD, s * (PW / 2 - 0.8), 0, PZC);
      // jharokha balconies on the porch flanks
      block(roseSoft, 1.4, 3.4, 3.2, s * (PW / 2 + 0.6), Y2 + 0.4, PZC - 2.0);
      add(crimson, dome(1.3, 1.2, 12), s * (PW / 2 + 0.6), Y2 + 3.9, PZC - 2.0);
    });
    // porch upper storeys
    block(rose, PW, Y3 - Y1 + 1.0, PZD, 0, Y1, PZC);
    for (let r = 0; r < 2; r++) {
      const y = (r ? Y2 : Y1) + 0.9;
      for (let i = 0; i < 4; i++) {
        const c = 2.7 + i * 3.05;
        if (r === 0 && i === 0) continue;
        windowBay(c, y, PZ, 0, 2.1, 3.4, false);
        windowBay(-c, y, PZ, 0, 2.1, 3.4, false);
      }
      if (r === 1) windowBay(0, y, PZ, 0, 2.8, 3.6, false);
    }
    // Gajalakshmi relief above the central arch
    add(trim, box(3.8, 2.6, 0.34), 0, Y1 + 1.4, PZ + 0.14);
    add(trim2, box(3.1, 2.0, 0.24), 0, Y1 + 1.7, PZ + 0.26);
    add(gold, sph(0.5, 10), 0, Y1 + 2.65, PZ + 0.38);
    // porch cornice and parapet, carried above the main roofline
    block(roseSoft, PW + 0.2, 1.0, PZD + 0.2, 0, Y3 + 1.0, PZC);
    add(trim, box(PW + 3.2, 0.55, PZD + 3.2), 0, Y3 + 2.1, PZC);
    add(trim, box(PW + 2.2, 0.42, PZD + 2.2), 0, Y3 + 2.5, PZC);
    block(roseSoft, PW + 0.4, 0.8, PZD + 0.4, 0, Y3 + 2.75, PZC);
    ctx.railing(0, Y3 + 3.5, PZ - 0.2, PW, trim, 0.5, 0, 13);
    // two domed chhatris flanking the central arch, above the porch
    [-1, 1].forEach((s) => {
      block(rose, 5.6, 2.6, 5.6, s * 8.6, Y3 + 3.55, PZ - 2.6);
      add(trim, box(6.4, 0.4, 6.4), s * 8.6, Y3 + 6.2, PZ - 2.6);
      for (const [ax, az] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add(trim, cyl(0.2, 0.24, 1.9, 6), s * 8.6 + ax * 2.3, Y3 + 7.3, PZ - 2.6 + az * 2.3);
      }
      add(trim, box(6.2, 0.3, 6.2), s * 8.6, Y3 + 8.3, PZ - 2.6);
      add(crimson, onion(2.5, 3.6, 14), s * 8.6, Y3 + 8.5, PZ - 2.6);
      add(gold, cyl(0.08, 0.08, 1.3, 5), s * 8.6, Y3 + 12.0, PZ - 2.6);
      add(gold, sph(0.18, 6), s * 8.6, Y3 + 12.7, PZ - 2.6);
    });
    // crimson barrel vault over the durbar front, behind the porch parapet
    add(crimson, cyl(4.4, 4.4, 17, 16), 0, Y3 + 1.2, PZC - 1.4, { rz: Math.PI / 2 });
    add(gold, box(17.2, 0.16, 0.5), 0, Y3 + 5.6, PZC - 1.4);

    /* ------------------------------------------------------- the five-storey
       central tower. Five stages of 6.24 m from the plinth — the lower two
       hidden by the main block, the upper three rising clear of the roof —
       then a colonnaded drum and the gilded onion dome. */
    const TW = 15, TZ = -2;
    const L = [F, 8.5, 15.2, 21.9, 28.6, 35.3];
    block(rose, TW, L[5] - L[0], TW, 0, L[0], TZ);
    [L[3], L[4]].forEach((y) => {
      add(trim, box(TW + 1.2, 0.46, TW + 1.2), 0, y + 0.2, TZ);
      add(trim2, box(TW + 0.7, 0.18, TW + 0.7), 0, y + 0.52, TZ);
    });
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      block(trim2, 1.1, L[5] - L[3], 1.1, dx * (TW / 2 - 0.55), L[3], TZ + dz * (TW / 2 - 0.55));
    }
    for (const y of [L[3] + 1.0, L[4] + 1.0]) {
      for (let i = -1; i <= 1; i++) {
        const x = i * 4.6;
        windowBay(x, y, TZ + TW / 2, 0, 2.4, 3.7, i === 0);
        windowBay(x, y, TZ - TW / 2, Math.PI, 2.4, 3.7, false);
        windowBay(TW / 2, y, TZ - x, Math.PI / 2, 2.4, 3.7, i === 0);
        windowBay(-TW / 2, y, TZ + x, -Math.PI / 2, 2.4, 3.7, false);
      }
    }
    // tower cornice, then four small chhatris at its corners
    add(trim, box(TW + 2.6, 0.55, TW + 2.6), 0, L[5] + 0.28, TZ);
    add(trim, box(TW + 1.7, 0.42, TW + 1.7), 0, L[5] + 0.72, TZ);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const cx = dx * (TW / 2 - 0.35), cz = TZ + dz * (TW / 2 - 0.35);
      add(trim, box(1.7, 0.26, 1.7), cx, L[5] + 1.0, cz);
      add(trim, cyl(0.55, 0.7, 0.5, 8), cx, L[5] + 1.4, cz);
      add(gold, sph(0.42, 8), cx, L[5] + 1.9, cz);
      add(gold, cone(0.14, 1.3, 5), cx, L[5] + 2.9, cz);
    }
    // the two crimson-domed pavilions flanking the gold dome
    [-1, 1].forEach((s) => {
      const px = s * 5.6, pz = TZ + TW / 2 - 1.4;
      block(roseSoft, 4.6, 2.8, 4.6, px, L[5] + 1.0, pz);
      add(trim, box(5.4, 0.34, 5.4), px, L[5] + 3.9, pz);
      for (const [ax, az] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        add(trim, cyl(0.16, 0.2, 1.9, 6), px + ax * 2.0, L[5] + 4.9, pz + az * 2.0);
      }
      add(trim, box(5.2, 0.3, 5.2), px, L[5] + 5.9, pz);
      add(crimson, onion(2.3, 3.5, 14), px, L[5] + 6.1, pz);
      add(gold, cyl(0.08, 0.08, 1.3, 5), px, L[5] + 9.7, pz);
      add(gold, sph(0.17, 6), px, L[5] + 10.4, pz);
    });

    /* the drum and the gilded onion dome */
    const DB = L[5] + 1.0;
    add(trim, cyl(5.6, 6.2, 0.7, 16), 0, DB + 0.35, TZ);
    add(shade, cyl(4.5, 4.5, 3.2, 12), 0, DB + 2.3, TZ);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      add(trim, cyl(0.24, 0.3, 3.4, 6), Math.cos(a) * 5.1, DB + 2.4, TZ + Math.sin(a) * 5.1);
    }
    add(trim, cyl(6.3, 5.8, 0.55, 16), 0, DB + 4.1, TZ);
    add(gold, onion(5.5, 8.2, 24), 0, DB + 4.35, TZ);
    const DA = DB + 4.35 + 8.0;
    // the small chhatri that replaces a finial on top of the dome
    add(gold, cyl(1.6, 1.8, 0.45, 10), 0, DA, TZ);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      add(gold, cyl(0.1, 0.12, 1.4, 5), Math.cos(a) * 1.25, DA + 0.9, TZ + Math.sin(a) * 1.25);
    }
    add(gold, cyl(1.75, 1.6, 0.28, 10), 0, DA + 1.7, TZ);
    add(gold, onion(1.4, 1.9, 12), 0, DA + 1.85, TZ);
    add(gold, cyl(0.06, 0.06, 1.6, 5), 0, DA + 3.7, TZ);
    add(gold, sph(0.15, 6), 0, DA + 4.6, TZ);

    /* ------------------------------------------- the four square corner towers */
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = dx * (HX - 4.6), z = dz * (HZ - 4.6);
      block(rose, 8.4, 27.4 - F, 8.4, x, F, z);
      add(trim, box(9.2, 0.4, 9.2), x, 20.9, z);
      for (const [ax, az] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        block(trim2, 0.8, 6.4, 0.8, x + ax * 3.8, 21.1, z + az * 3.8);
      }
      // a tall arched window and a jharokha on the outer faces
      for (let f = 0; f < 4; f++) {
        const ry = (f * Math.PI) / 2;
        const nx = Math.sin(ry), nz = Math.cos(ry);
        add('dark', arch(1.4, 2.8, 0.16), x + nx * 4.55, 21.8, z + nz * 4.55, { ry });
        add(amber, box(0.75, 1.0, 0.1), x + nx * 4.6, 22.4, z + nz * 4.6, { ry });
        add(trim, frame(1.8, 3.1, 0.16, 0.22), x + nx * 4.58, 21.8, z + nz * 4.58, { ry });
      }
      add(trim, box(9.6, 0.55, 9.6), x, 27.6, z);
      add(trim, box(8.8, 0.35, 8.8), x, 28.2, z);
      // open colonnade drum, then the deep pink dome
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        add(trim, cyl(0.19, 0.23, 2.4, 6), x + Math.cos(a) * 2.9, 29.1, z + Math.sin(a) * 2.9);
      }
      add(shade, cyl(2.3, 2.3, 2.4, 10), x, 29.1, z);
      add(trim, cyl(3.3, 2.9, 0.42, 14), x, 30.3, z);
      add(crimson, onion(2.75, 4.2, 16), x, 30.5, z);
      add(gold, cyl(0.07, 0.07, 1.5, 5), x, 34.4, z);
      add(gold, sph(0.18, 6), x, 35.3, z);
      add(gold, cone(0.11, 1.0, 5), x, 36.0, z);
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
      const x = -25 + i * 12.5;
      smallChhatri(x, PAR, HZ - 3.2, 0.95);
      smallChhatri(x, PAR, -HZ + 3.2, 0.95);
    }
    for (let i = 0; i < 3; i++) {
      const z = -13 + i * 13;
      smallChhatri(HX - 3.2, PAR, z, 0.95);
      smallChhatri(-HX + 3.2, PAR, z, 0.95);
    }
    for (let i = -9; i <= 9; i++) {
      add(gold, cone(0.15, 1.1, 4), i * 3.7, PAR + 0.55, HZ + 0.25);
      add(gold, cone(0.15, 1.1, 4), i * 3.7, PAR + 0.55, -HZ - 0.25);
    }
    for (let i = -4; i <= 4; i++) {
      add(gold, cone(0.15, 1.1, 4), HX + 0.25, PAR + 0.55, i * 4.6);
      add(gold, cone(0.15, 1.1, 4), -HX - 0.25, PAR + 0.55, i * 4.6);
    }

    /* ------------------------------------------------- forecourt and gardens */
    add('paving', plane(150, 190), 0, 0.06, 34, { rx: -Math.PI / 2 });
    [[-30, 50], [30, 50], [-30, 78], [30, 78]].forEach(([x, z]) => {
      add('grass', plane(30, 24), x, 0.1, z, { rx: -Math.PI / 2 });
      add(trim, box(30.4, 0.24, 24.4), x, 0.1, z);
    });
    add('stone', cyl(8, 8.4, 0.8, 20), 0, 0.4, 58);
    add('water', cyl(7.2, 7.2, 0.2, 20), 0, 0.9, 58);
    add('stone', cyl(0.9, 1.1, 2.2, 8), 0, 1.5, 58);
    // the elephant gate, well beyond the palace
    block(rose, 24, 10, 5, 0, 0, 120);
    add('dark', arch(7.0, 8.4, 0.6), 0, 0.2, 122.4);
    add(trim, frame(7.8, 9.0, 0.45, 0.45), 0, 0.2, 122.5);
    add(trim, box(25, 0.7, 6), 0, 10, 120);
    [-1, 1].forEach((s) => {
      add(crimson, dome(2.4, 2.2, 12), s * 8.6, 10.3, 120);
      add(gold, cyl(0.08, 0.08, 1.2, 5), s * 8.6, 12.6, 120);
    });

    /* ------------------------------------------------ people, lamps and trees */
    const people = [[-14, 34], [12, 36], [-5, 30], [18, 32], [-22, 40], [24, 42], [0, 28],
      [-9, 44], [9, 46], [-18, 52], [18, 52], [-2, 60], [5, 42], [-26, 28], [26, 26]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-34, 32], [34, 32], [-16, 64], [16, 64], [-38, 72], [38, 72], [-24, 104], [24, 104]]
      .forEach(([x, z]) => ctx.lamp(x, z, 4.2, 'black'));
    [[-50, 40], [50, 40], [-52, 70], [52, 70], [-46, 100], [46, 100], [-60, 16], [60, 16],
     [-58, 54], [58, 54], [-64, 90], [64, 90]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.35 + (i % 3) * 0.2, 'round'));

    ctx.light({ pos: [-38, 20, 56], target: [0, 26, 0], color: 0xffd0a0, intensity: 3600, distance: 250 });
    ctx.light({ pos: [38, 22, 50], target: [0, 26, 0], color: 0xffc890, intensity: 3000, distance: 250 });
    ctx.light({ pos: [0, 16, 80], target: [0, 34, 0], color: 0xffe0b0, intensity: 2000, distance: 200 });
  }
};
