/* Charminar — Hyderabad · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'charminar',
  accent: '#c8a26a',
  accent2: '#e8c48a',
  seed: 31,
  time: 15.4,
  bounds: 80,
  minDist: 16,
  maxDist: 300,
  home: { pos: [74, 27, 98], target: [0, 26, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xc3b298 },
  views: [
    { name: 'Full', pos: [74, 27, 98], target: [0, 26, 0] },
    { name: 'Arches', pos: [15, 12, 44], target: [0, 13, 0] },
    { name: 'Minarets', pos: [34, 50, 40], target: [0, 46, 0] },
    { name: 'Crossing', pos: [4, 4.5, 12], target: [0, 7, 0] },
    { name: 'Bazaar', pos: [-48, 9, 48], target: [0, 20, 0] }
  ],
  tour: [
    {
      title: 'Four Minarets', deva: 'चारमीनार',
      text: 'Muhammad Quli Qutb Shah raised the Charminar in 1591, the year Hyderabad was laid out around it. The name means simply four minarets, and the monument stands at the crossing of the city\'s two great bazaars.',
      pos: [58, 26, 78], target: [0, 25, 0], time: 17.2
    },
    {
      title: 'The Great Arches', deva: 'मेहराब',
      text: 'Four arches face the cardinal directions, each about 11 metres wide and 20 metres high, their openings lined in shadow. Two storeys of arcaded galleries sit above them, and a small mosque has occupied the top floor for more than four centuries.',
      pos: [16, 12, 38], target: [0, 13, 0], time: 12
    },
    {
      title: 'Granite and Stucco', deva: 'ग्रेनाइट',
      text: 'The structure is granite and lime mortar, dressed with plaster and stucco ornament, standing on a square plinth with a fountain at its centre. Spiral stairs climb inside each minaret to galleries above the streets.',
      pos: [10, 8, 26], target: [0, 10, 0], time: 9.4
    },
    {
      title: 'Fifty-Six Metres', deva: 'मीनारें',
      text: 'The four minarets rise to 56 metres, each with balconies ringed by pierced screens, a bulbous dome and a finial. The Charminar was the tallest building in Hyderabad for 396 years, until 1987.',
      pos: [30, 46, 34], target: [0, 44, 0], time: 16.6
    },
    {
      title: 'Laad Bazaar', deva: 'लाड बाज़ार',
      text: 'To the west runs the Laad Bazaar, the lane of lacquer bangles, and to the southwest the Makkah Masjid. On Eid the whole quarter fills with crowds, and the monument is lit from below.',
      pos: [-46, 9, 46], target: [0, 18, 0], time: 17.8
    },
    {
      title: 'The City at Night', deva: 'रात्रि',
      text: 'Under floodlight the stucco picks up a warm amber and the arches go black. Around it the bazaar keeps trading until late, and the Charminar stands at the centre of the old city it made.',
      pos: [52, 24, 70], target: [0, 28, 0], time: 21.3
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, plane } = ctx;

    /* granite and limestone plaster — a pale warm grey, never white */
    /* The palette's textured keys multiply their own colour by a map of the
       same colour, so `granite` and `stone` render far darker than their hex.
       These three surfaces keep the stone grain but hold the building at the
       pale warm grey of granite dressed in lime plaster. */
    const grain = ctx.tex('plaster').clone();
    grain.needsUpdate = true;
    grain.wrapS = grain.wrapT = T3.RepeatWrapping;
    grain.repeat.set(1, 1);
    const surface = (color, rough) => new T3.MeshStandardMaterial({ color, roughness: rough, map: grain });
    const MASON = surface(0xc4c8ce, 0.9);   // granite masonry — warm mid grey
    const PL = surface(0xd6d8db, 0.86);     // lime plaster — pale warm grey
    const CR = surface(0xedeef0, 0.82);     // dressed stucco trim — palest
    const GR = 'granite';                   // plinth, pedestals, drums
    const ST = 'plaster';                   // mosque shell and domes
    const GY = 'grey';                      // shadow lines and recesses
    const JL = 'jali';                      // pierced balcony screens

    /* ---- a four-centred pointed arch, as at the Charminar ------------
       The engine's archShape rises almost vertically from the springing and
       closes in a sharp lancet; the Charminar's arches spread wide at the
       haunch and close in a blunt point. Built here from two quadratics a
       side, with the springing at 40% of the height. */
    function archProfile(w, h, sp) {
      const hw = w / 2, s = new T3.Shape();
      s.moveTo(-hw, 0);
      s.lineTo(-hw, sp);
      s.quadraticCurveTo(-hw, h * 0.74, -hw * 0.50, h * 0.905);
      s.quadraticCurveTo(-hw * 0.18, h * 0.975, 0, h);
      s.quadraticCurveTo(hw * 0.18, h * 0.975, hw * 0.50, h * 0.905);
      s.quadraticCurveTo(hw, h * 0.74, hw, sp);
      s.lineTo(hw, 0);
      s.closePath();
      return s;
    }
    const SP = 0.40;
    function archGeo(w, h, depth) {
      return new T3.ExtrudeGeometry(archProfile(w, h, h * SP), { depth, bevelEnabled: false, curveSegments: 10 });
    }
    function frameGeo(w, h, thick, depth) {
      const outer = archProfile(w, h, h * SP);
      const iw = w - thick * 2, ih = h - thick * 1.2;
      const pts = archProfile(iw, ih, ih * SP).getPoints(34).map((p) => new T3.Vector2(p.x, p.y + thick * 0.55));
      outer.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 10 });
    }

    /* ---- a wall pierced by one great arch ----------------------------- */
    function piercedWall(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const pts = archProfile(aw, ah, ah * SP).getPoints(34).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 8 });
    }

    /* ---- plinth ------------------------------------------------------- */
    block(GR, 34, 1.4, 34, 0, 0, 0);
    add(ST, box(34.8, 0.3, 34.8), 0, 1.4, 0);
    [[0, 17.6, 0], [0, -17.6, 0], [17.6, 0, Math.PI / 2], [-17.6, 0, Math.PI / 2]].forEach(([x, z, ry]) => {
      for (let i = 0; i < 4; i++) {
        block(ST, 7.4, 0.35 * (i + 1), 1.0, x, 0, z + (i * 0.9) * (z > 0 ? 1 : -1), { ry });
      }
    });

    /* ---- the four pierced walls ---------------------------------------
       The block is 20 m square on plan with an 11 m wide, 20 m high arch on
       each face: the opening takes the full height of the storey and 55% of
       its width, so the arch — not the masonry — is what reads. The wall is
       carried 1.2 m below the plinth top so the arch hole never touches the
       outer boundary of the extrusion (which used to break the silhouette). */
    const W = 20, T = 2.2, AW = 11, AH = 20;
    const PTOP = 1.4;                 // plinth top
    const WT = PTOP + 21.2;           // 22.6 — top of the arch storey
    const wh = WT - 0.2;              // wall shape height
    // +Z / -Z
    add(MASON, piercedWall(W, wh, T, AW, AH, PTOP - 0.2), 0, 0.2, W / 2 - T);
    add(MASON, piercedWall(W, wh, T, AW, AH, PTOP - 0.2), 0, 0.2, -W / 2);
    // +X / -X
    add(MASON, piercedWall(W, wh, T, AW, AH, PTOP - 0.2), W / 2 - T, 0.2, 0, { ry: Math.PI / 2 });
    add(MASON, piercedWall(W, wh, T, AW, AH, PTOP - 0.2), -W / 2, 0.2, 0, { ry: Math.PI / 2 });

    /* interior of the crossing: dark faces, dark ceiling, lit floor apron */
    const IW = W - 2 * T;             // 15.6
    add('dark', box(IW, AH - 0.2, 0.18), 0, PTOP + AH / 2 - 0.1, IW / 2 - 0.1);
    add('dark', box(IW, AH - 0.2, 0.18), 0, PTOP + AH / 2 - 0.1, -IW / 2 + 0.1);
    add('dark', box(0.18, AH - 0.2, IW), IW / 2 - 0.1, PTOP + AH / 2 - 0.1, 0);
    add('dark', box(0.18, AH - 0.2, IW), -IW / 2 + 0.1, PTOP + AH / 2 - 0.1, 0);
    add('dark', box(IW, 0.5, IW), 0, PTOP + AH - 0.3, 0);
    add('dark', box(IW - 0.6, 0.35, IW - 0.6), 0, PTOP + AH - 0.62, 0);
    // inner floor + fountain
    add('cream', box(IW, 0.3, IW), 0, PTOP + 0.15, 0);
    [[0, W / 2 - 1.4, 0], [0, -W / 2 + 1.4, Math.PI], [W / 2 - 1.4, 0, Math.PI / 2], [-W / 2 + 1.4, 0, -Math.PI / 2]]
      .forEach(([x, z, ry]) => add('cream', box(AW + 1.2, 0.22, 3.2), x, PTOP + 0.26, z, { ry }));
    add(GR, cyl(2.6, 2.8, 0.9, 16), 0, PTOP + 0.5, 0);
    add(CR, cyl(2.2, 2.2, 0.3, 16), 0, PTOP + 1.1, 0);
    add(CR, cyl(0.35, 0.45, 1.4, 10), 0, PTOP + 1.6, 0);
    add('water', cyl(0.9, 1.0, 0.15, 14), 0, PTOP + 1.3, 0);

    /* ---- stucco arch surrounds ---------------------------------------- */
    [[0, W / 2 + 0.01, 0], [0, -W / 2 - 0.01, Math.PI], [W / 2 + 0.01, 0, Math.PI / 2], [-W / 2 - 0.01, 0, -Math.PI / 2]]
      .forEach(([x, z, ry]) => {
        add(CR, frameGeo(AW + 1.3, AH + 0.7, 0.45, 0.5), x, PTOP, z, { ry });
        add(ST, box(AW + 4.2, 0.4, 0.6), x, PTOP + AH + 0.55, z, { ry });
        // spandrel medallions in the haunches of the arch
        for (const s of [-1, 1]) {
          const off = s * (AW / 2 + 1.5);
          add(CR, cyl(0.6, 0.6, 0.24, 12), x + off * Math.cos(ry), PTOP + AH * 0.74, z - off * Math.sin(ry),
            { rx: Math.PI / 2, ry });
        }
      });

    /* ---- two arcaded gallery storeys ----------------------------------- */
    let y = WT;
    add(CR, box(W + 1.8, 0.75, W + 1.8), 0, y + 0.37, 0);      // cornice over the arches
    y += 0.75;                                                  // 23.35

    // storey one: five open arches to a face
    block(PL, W + 0.6, 4.0, W + 0.6, 0, y, 0);
    for (let f = 0; f < 4; f++) {
      const a = (f / 4) * Math.PI * 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      for (let i = -2; i <= 2; i++) {
        const px = i * 2.3 * cs + (W / 2 + 0.32) * sn;
        const pz = -i * 2.3 * sn + (W / 2 + 0.32) * cs;
        add('dark', archGeo(2.0, 2.85, 0.14), px, y + 0.55, pz, { ry: a });
        add(CR, frameGeo(2.36, 3.1, 0.18, 0.22), px, y + 0.55, pz, { ry: a });
      }
    }
    y += 4.0;                                                   // 27.35
    add(CR, box(W + 1.5, 0.55, W + 1.5), 0, y + 0.27, 0);
    y += 0.55;                                                  // 27.9

    // storey two: a band of pierced screens
    block(PL, W - 0.2, 3.5, W - 0.2, 0, y, 0);
    for (let f = 0; f < 4; f++) {
      const a = (f / 4) * Math.PI * 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      for (let i = -3; i <= 3; i++) {
        const px = i * 1.66 * cs + (W / 2 + 0.06) * sn;
        const pz = -i * 1.66 * sn + (W / 2 + 0.06) * cs;
        add(JL, box(1.24, 2.5, 0.07), px, y + 1.55, pz, { ry: a });
        add(CR, box(0.16, 2.6, 0.16), px + 0.83 * cs, y + 1.55, pz - 0.83 * sn, { ry: a });
      }
    }
    y += 3.5;                                                   // 31.4
    const RF = y;                                               // roof level

    /* ---- parapet with merlons and tiny corner minarets ----------------- */
    add(CR, box(W + 1.2, 0.5, W + 1.2), 0, RF + 0.25, 0);
    for (let side = 0; side < 4; side++) {
      const a = (side / 4) * Math.PI * 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      const ex = (W / 2 + 0.35) * sn, ez = (W / 2 + 0.35) * cs;
      block(PL, 0.5, 0.85, W + 0.9, ex, RF + 0.5, ez, { ry: a });
      for (let i = -5; i <= 5; i++) {
        add(CR, box(0.42, 0.5, 0.42), i * 1.8 * cs + ex, RF + 1.62, -i * 1.8 * sn + ez, { ry: a });
      }
    }
    const pn = 5;
    for (let side = 0; side < 4; side++) {
      const a = (side / 4) * Math.PI * 2;
      for (let i = 0; i < pn; i++) {
        const t = (i - (pn - 1) / 2) * 4.2;
        const x = Math.cos(a) * t + Math.cos(a + Math.PI / 2) * (W / 2 + 0.9);
        const z = Math.sin(a) * t + Math.sin(a + Math.PI / 2) * (W / 2 + 0.9);
        col(PL, 0.36, 0.42, 2.0, x, RF + 1.05, z, 8);
        add(PL, dome(0.44, 0.52, 10), x, RF + 3.05, z);
        add('gold', cone(0.11, 0.34, 6), x, RF + 3.45, z);
      }
    }

    /* ---- the mosque on the roof: a cluster of domes -------------------- */
    const MH = 4.6;                       // prayer-hall height
    block(PL, 12.8, MH, 9.6, 0, RF, 0);
    add(ST, box(13.6, 0.4, 10.4), 0, RF + 0.2, 0);        // base moulding
    add(ST, box(13.6, 0.45, 10.4), 0, RF + MH + 0.2, 0);  // cornice
    // five-arch facade to the east (+Z), facing the camera
    for (let i = -2; i <= 2; i++) {
      add('dark', archGeo(1.7, 2.5, 0.16), i * 2.3, RF + 0.9, 4.86);
      add(CR, frameGeo(2.05, 2.8, 0.17, 0.22), i * 2.3, RF + 0.9, 4.9);
    }
    // side walls get two arches each
    for (const s of [-1, 1]) {
      for (const i of [-1, 1]) {
        add('dark', archGeo(1.4, 2.2, 0.16), s * 6.46, RF + 0.9, i * 2.4, { ry: s * Math.PI / 2 });
        add(CR, frameGeo(1.7, 2.45, 0.15, 0.2), s * 6.5, RF + 0.9, i * 2.4, { ry: s * Math.PI / 2 });
      }
    }
    // central dome on an octagonal drum
    col(GR, 3.05, 3.3, 1.1, 0, RF + MH + 0.2, 0, 8);
    add(ST, cyl(3.35, 3.3, 0.28, 8), 0, RF + MH + 1.45, 0);
    add(PL, onion(3.2, 5.0, 26), 0, RF + MH + 1.6, 0);
    add('gold', cyl(0.1, 0.12, 1.4, 8), 0, RF + MH + 7.3, 0);
    add('gold', sph(0.24, 10), 0, RF + MH + 8.1, 0);
    add('gold', cone(0.14, 0.65, 8), 0, RF + MH + 8.6, 0);
    // two flanking domes
    for (const s of [-1, 1]) {
      col(GR, 1.75, 1.85, 0.7, s * 4.5, RF + MH + 0.2, 0, 8);
      add(PL, onion(1.85, 2.9, 20), s * 4.5, RF + MH + 0.9, 0);
      add('gold', cone(0.09, 0.55, 6), s * 4.5, RF + MH + 4.1, 0);
    }
    // four corner turrets on the hall
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      col(PL, 0.62, 0.72, 1.5, dx * 5.6, RF + MH + 0.2, dz * 4.0, 8);
      add(PL, onion(0.78, 1.15, 14), dx * 5.6, RF + MH + 1.7, dz * 4.0);
      add('gold', cone(0.07, 0.32, 6), dx * 5.6, RF + MH + 3.0, dz * 4.0);
    }

    /* ---- the four minarets --------------------------------------------
       Octagonal, four tiers of decreasing diameter, each closed by a
       projecting balcony with a pierced railing on corbels, then a bulbous
       dome and finial. 1.4 (plinth) to 55.4 m — 56 m to the tip. */
    function balcony(cx, cz, y, r) {
      const R = r + 1.18;
      const apo = r * Math.cos(Math.PI / 8);
      // corbel brackets under the slab
      for (let k = 0; k < 8; k++) {
        const a = Math.PI / 8 + k * Math.PI / 4;
        add(GR, box(0.4, 0.62, 0.5), cx + Math.cos(a) * (apo + 0.12), y - 0.3, cz + Math.sin(a) * (apo + 0.12), { ry: -a + Math.PI / 2 });
      }
      // the slab itself, projecting well past the shaft
      add(CR, cyl(R, R - 0.18, 0.5, 8), cx, y + 0.25, cz);
      add(CR, cyl(R + 0.06, R + 0.06, 0.13, 8), cx, y + 0.55, cz);
      // pierced railing, one panel to each octagon face
      const chord = 2 * R * Math.sin(Math.PI / 8) - 0.1;
      for (let k = 0; k < 8; k++) {
        const a = Math.PI / 8 + k * Math.PI / 4;
        add(JL, box(chord, 1.05, 0.07), cx + Math.cos(a) * (apo + 0.66), y + 1.12, cz + Math.sin(a) * (apo + 0.66), { ry: -a + Math.PI / 2 });
        add(CR, box(0.15, 1.15, 0.15), cx + Math.cos(a) * (apo + 0.66) + Math.cos(a + Math.PI / 2) * chord / 2,
          y + 1.12, cz + Math.sin(a) * (apo + 0.62) + Math.sin(a + Math.PI / 2) * chord / 2, { ry: -a + Math.PI / 2 });
      }
      add(CR, cyl(apo + 0.74, apo + 0.74, 0.15, 8), cx, y + 1.7, cz);   // handrail
    }

    function minaret(cx, cz) {
      const base = PTOP;
      // octagonal pedestal
      col(GR, 3.0, 3.45, 2.3, cx, base, cz, 8);
      add(CR, cyl(3.55, 3.7, 0.42, 8), cx, base + 2.5, cz);
      add(GY, cyl(3.1, 3.1, 0.28, 8), cx, base + 2.85, cz);   // shadow gap
      let y = base + 3.0;
      const TIERS = [[2.72, 2.16, 11.6], [2.06, 1.74, 9.6], [1.68, 1.44, 8.0], [1.40, 1.22, 7.0]];
      TIERS.forEach(([rb, rt, h]) => {
        col(PL, rt, rb, h, cx, y, cz, 8);
        // vertical stucco pilasters on each face so the tiers read at distance
        const apo = ((rb + rt) / 2) * Math.cos(Math.PI / 8);
        for (let k = 0; k < 8; k++) {
          const a = Math.PI / 8 + k * Math.PI / 4;
          add(CR, box(0.26, h * 0.86, 0.1), cx + Math.cos(a) * (apo + 0.01), y + h / 2, cz + Math.sin(a) * (apo + 0.01), { ry: -a + Math.PI / 2 });
        }
        y += h;
        balcony(cx, cz, y, rt);
        y += 1.2;
      });
      // dome, drum and finial
      add(GY, cyl(2.05, 2.15, 0.28, 8), cx, y + 0.14, cz);
      col(GR, 2.1, 2.2, 1.15, cx, y + 0.28, cz, 8);          // drum
      add(CR, cyl(2.28, 2.18, 0.3, 8), cx, y + 1.58, cz);
      add(PL, onion(2.15, 4.5, 26), cx, y + 1.72, cz);
      add(GR, cyl(0.36, 0.5, 0.45, 10), cx, y + 6.4, cz);
      add('gold', cyl(0.09, 0.12, 2.9, 8), cx, y + 8.1, cz);
      add('gold', sph(0.26, 10), cx, y + 9.6, cz);
      add('gold', cone(0.15, 0.85, 8), cx, y + 10.4, cz);
    }
    const cx0 = W / 2 + 1.6;
    [[cx0, cx0], [-cx0, cx0], [cx0, -cx0], [-cx0, -cx0]].forEach(([x, z]) => minaret(x, z));

    /* ---- bazaar arcades ------------------------------------------------ */
    [[-31, 0, Math.PI / 2], [31, 0, -Math.PI / 2], [0, -31, 0]].forEach(([x, z, ry]) => {
      block(PL, 24, 6.5, 4, x, 0, z, { ry });
      for (let i = -2; i <= 2; i++) {
        const px = x + Math.cos(ry) * i * 4.4 + Math.sin(ry) * 2.02;
        const pz = z - Math.sin(ry) * i * 4.4 + Math.cos(ry) * 2.02;
        add('dark', archGeo(2.2, 3.4, 0.2), px, 0.3, pz, { ry });
        add(CR, frameGeo(2.6, 3.8, 0.18, 0.2), px, 0.3, pz + (ry === 0 ? 0.04 : 0), { ry });
      }
      add(ST, box(24.6, 0.5, 4.6), x, 6.5, z, { ry });
    });

    /* ---- ground, crowds, lamps, trees ---------------------------------- */
    add('paving', plane(96, 96), 0, 0.05, 0, { rx: -Math.PI / 2 });
    const people = [[-6, 22], [6, 23], [-10, 18], [10, 17], [0, 26], [-16, 26], [16, 25], [-22, 14],
      [22, 13], [-3, 15], [8, 27], [-13, 8], [13, 8], [18, -18], [-18, -18], [0, -24]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed', 'fabricWhite'][i % 4], 0.95));
    [[-13, 20], [13, 20], [-20, 6], [20, 6], [0, 30], [-26, -6], [26, -6]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-34, 30], [34, 30], [-40, -20], [40, -20], [-28, -34], [28, -34]].forEach(([x, z]) => ctx.tree(x, z, 1.1, 'round'));

    ctx.light({ pos: [-30, 14, 30], target: [0, 26, 0], color: 0xffd0a0, intensity: 2400, distance: 200 });
    ctx.light({ pos: [30, 16, 26], target: [0, 26, 0], color: 0xffc890, intensity: 2000, distance: 200 });
    ctx.light({ pos: [0, 10, 34], target: [0, 8, 0], color: 0xffd9b0, intensity: 1200, distance: 120 });
  }
};
