/* Charminar — Hyderabad · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Measured against Wikipedia / Telangana Tourism / Archnet:
     square block, 20 m on each side, four storeys, ~30 m to the parapet
     four great arches, 11 m wide, opening to the four streets
     minarets at the corners, 48.8 m to the top of the shaft, 56 m overall,
     each in four tiers separated by projecting balconies
     overall footprint with the minarets ~30.5 m on a side; 149 steps */

export default {
  id: 'charminar',
  accent: '#c8a26a',
  accent2: '#e8c48a',
  seed: 31,
  floodScale: 0.26,
  time: 15.4,
  bounds: 80,
  minDist: 16,
  maxDist: 300,
  home: { pos: [58, 24, 82], target: [0, 26, 0], fov: 42 },
  ground: { texture: 'paving', size: 2400, color: 0xc3b298 },
  views: [
    { name: 'Full', pos: [58, 24, 82], target: [0, 26, 0] },
    { name: 'Arches', pos: [12, 11, 40], target: [0, 12, 0] },
    { name: 'Minarets', pos: [30, 46, 36], target: [0, 44, 0] },
    { name: 'Crossing', pos: [3, 4, 11], target: [0, 6, 0] },
    { name: 'Bazaar', pos: [-40, 8, 42], target: [0, 20, 0] }
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
      pos: [61, 48, 69], target: [0, 44, 0], time: 16.6
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
    const { add, box, cyl, sph, cone, dome, arch, archFrame, block, col, lathe } = ctx;
    const TAU = Math.PI * 2;

    /* ===================================================================
       measured envelope
       =================================================================== */
    const SIDE = 20.0;           // block, 20 m on each side
    const HALF = SIDE / 2;
    const ARCH_W = 11.0;         // great arches, 11 m wide
    const ARCH_H = 17.0;         // apex of the opening
    const CREST = 20.0;          // cresting above the apex
    const H1 = 20.5;             // arch storey
    const H2 = 25.5;             // arcaded gallery
    const H3 = 29.0;             // upper arcade
    const H4 = 30.6;             // pierced parapet
    const MC = 12.4;             // minaret centres, footprint 30.4 m
    const M_TOP = 48.8;          // top of the fourth tier
    const M_DOME = 56.0;         // finial

    const wall = 'plaster';
    const trim = 'sandstoneBuff';
    const white = 'white';

    /* ---- paved square, plinth, steps ---- */
    add('paving', ctx.plane(96, 96), 0, 0.05, 0, { rx: -Math.PI / 2 });
    block('granite', 26, 0.45, 26, 0, 0, 0);
    block('stone', 25.2, 0.30, 25.2, 0, 0.45, 0);

    /* ===================================================================
       the block: each face is a pierced slab, so the arch is a real
       opening that leads through to the crossing
       =================================================================== */
    function piercedFace(w, h, aw, ah, thick) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h);
      s.closePath();
      const hole = ctx.archShape(aw, ah, 0.55);
      s.holes.push(new T3.Path(hole.getPoints(34)));
      return new T3.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 8 });
    }

    const T = 1.6;                                   // wall thickness
    const faceGeo = () => piercedFace(SIDE, H1, ARCH_W, ARCH_H, T);
    // +z (south, the camera side), -z, +x, -x
    add(wall, faceGeo(), 0, 0, HALF - T);
    add(wall, faceGeo(), 0, 0, -HALF + T, { ry: Math.PI });
    add(wall, faceGeo(), HALF - T, 0, 0, { ry: Math.PI / 2 });
    add(wall, faceGeo(), -HALF + T, 0, 0, { ry: -Math.PI / 2 });

    // inner walls closing the cross-passage at the corners
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      block(wall, 4.6, H1, 4.6, sx * (HALF - 2.3), 0, sz * (HALF - 2.3));
    });
    // vault over the crossing
    add(wall, dome(ARCH_W / 2 + 0.6, 2.6, 24), 0, 14.2, 0);
    add(trim, cyl(ARCH_W / 2 + 0.7, ARCH_W / 2 + 0.7, 0.28, 24), 0, 14.1, 0);
    add('stone', box(ARCH_W + 0.6, 0.12, ARCH_W + 0.6), 0, 0.76, 0);

    /* ---- ornamental cresting and medallions over each arch ---- */
    const faces = [
      { ry: 0, x: 0, z: HALF, sx: 1 },
      { ry: Math.PI, x: 0, z: -HALF, sx: -1 },
      { ry: Math.PI / 2, x: HALF, z: 0, sx: 1 },
      { ry: -Math.PI / 2, x: -HALF, z: 0, sx: -1 }
    ];
    // outward normal of a face, and its in-plane direction
    const NO = (ry) => [Math.sin(ry), Math.cos(ry)];

    /* ---- the lotus-petal fringe ------------------------------------------
       A row of pointed petals hangs under every cornice and round every
       balcony at the Charminar, and it is most of what the stucco ornament is
       made of. Each petal is a four-sided pyramid, six triangles, and a whole
       row is ONE geometry: the boot time is spent on geometry items, not on
       triangles (§30). Items are [x, y, z, ry] in local coordinates. */
    const petalField = (items, w, h, d, key, ox = 0, oz = 0) => {
      const pos = [], uv = [], idx = [];
      for (const [px, py, pz, ry] of items) {
        const c = Math.cos(ry), s2 = Math.sin(ry);
        const base = pos.length / 3;
        for (const [lx, lz] of [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]]) {
          pos.push(px + lx * c + lz * s2, py, pz - lx * s2 + lz * c);
          uv.push(0.5, 1);
        }
        pos.push(px, py - h, pz);
        uv.push(0.5, 0);
        for (let k = 0; k < 4; k++) idx.push(base + k, base + ((k + 1) % 4), base + 4);
        idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      add(key, g, ox, 0, oz);
    };
    // a fringe along one face of the block
    const fringeFace = (f, y, off, span, n, w, h) => {
      const items = [];
      const ry = f.ry, nx = Math.sin(ry), nz = Math.cos(ry);
      for (let i = 0; i < n; i++) {
        const ox = (i - (n - 1) / 2) * (span / n);
        items.push([f.x + Math.cos(ry) * ox + nx * off, y, f.z - Math.sin(ry) * ox + nz * off, ry]);
      }
      petalField(items, w, h, 0.16, trim);
    };
    faces.forEach((f) => {
      const ry = f.ry;
      const [nx, nz] = NO(ry);
      const at = (ox, off) => [f.x + Math.cos(ry) * ox + nx * off, f.z - Math.sin(ry) * ox + nz * off];

      /* The great arch is cut through the pierced wall, so its edge is raw.
         Two concentric hood moulds give it the deep stepped portal the
         building actually has — the plain cut edge is what made the portal
         look like a hole in a cardboard box. */
      [[ARCH_W + 1.5, ARCH_H + 0.75, 0.55, 0.50],
       [ARCH_W + 2.9, ARCH_H + 1.45, 0.34, 0.44]].forEach(([w2, h2, dp, th]) => {
        const [hx, hz] = at(0, 0.10);
        add(trim, archFrame(w2, h2, dp, th), hx, 0.02, hz, { ry });
      });

      // ornamental cresting rising from the apex of the arch to the cornice
      const [ax, az] = at(0, 0.34);
      add(trim, arch(3.4, 3.2, 0.26), ax, ARCH_H, az, { ry });
      add(wall, arch(2.7, 2.7, 0.30), ax, ARCH_H + 0.10, az, { ry });
      add(trim, sph(0.22, 8), ax, ARCH_H + 3.30, az);

      // medallions in the spandrels: a roundel set into a ring of the trim stone
      [-1, 1].forEach((sgn) => {
        const [mx, mz] = at(sgn * (ARCH_W / 2 + 1.45), 0.20);
        add(trim, cyl(0.85, 0.85, 0.16, 16), mx, 12.4, mz, { rx: Math.PI / 2, ry });
        ctx.inlay(wall, trim, 1.30, 1.30, mx, 12.4, mz + 0.06, { n: 1, motif: 'roundel', depth: 0.05, ry });
      });

      // a row of blind arches in each spandrel. The Charminar's spandrels are
      // covered in small niches; bare plaster beside the great arch is the
      // plainest thing on the building
      [-1, 1].forEach((sgn) => {
        const [bx, bz] = at(sgn * (ARCH_W / 2 + 3.6), 0.14);
        ctx.carvedBand(trim, 3.0, 1.7, bx, 15.9, bz,
          { n: 3, motif: 'arch', depth: 0.18, ry, back: wall });
      });

      // pilaster strips flanking the arch
      [-1, 1].forEach((sgn) => {
        const [px, pz] = at(sgn * (ARCH_W / 2 + 0.60), 0.22);
        block(trim, 1.1, H1, 0.5, px, 0, pz, { ry });
      });
    });

    /* ---- cornice at the head of the arch storey ---- */
    add(trim, box(SIDE + 1.5, 0.55, SIDE + 1.5), 0, H1 - 0.1, 0);
    add(wall, box(SIDE + 0.9, 0.30, SIDE + 0.9), 0, H1 + 0.45, 0);
    faces.forEach((f) => fringeFace(f, H1 - 0.36, 0.80, SIDE + 1.3, 26, 0.26, 0.42));

    /* ===================================================================
       storey 2 — the arcaded gallery, with a clock on each face
       =================================================================== */
    block(wall, SIDE + 0.4, H2 - H1 - 0.3, SIDE + 0.4, 0, H1 + 0.75, 0);
    faces.forEach((f) => {
      const ry = f.ry;
      const [nx, nz] = NO(ry);
      const at = (ox, off) => [f.x + Math.cos(ry) * ox + nx * off, f.z - Math.sin(ry) * ox + nz * off];
      const n = 5, span = 3.2;
      for (let i = 0; i < n; i++) {
        if (i === 2) continue;                       // centre bay carries the clock
        const [ax, az] = at((i - (n - 1) / 2) * span, 0.28);
        add('dark', arch(2.1, 3.2, 0.22), ax, H1 + 1.35, az, { ry });
        add(trim, archFrame(2.45, 3.5, 0.14, 0.12), ax, H1 + 1.30, az - 0.02, { ry });
      }
      // clock (added 1899) — white dial in the centre bay
      const [cx2, cz2] = at(0, 0.32);
      add('dark', cyl(1.05, 1.05, 0.10, 20), cx2, H2 - 3.0, cz2 - 0.04, { rx: Math.PI / 2, ry });
      add(white, cyl(0.95, 0.95, 0.12, 20), cx2, H2 - 3.0, cz2, { rx: Math.PI / 2, ry });
      add('dark', box(0.07, 0.60, 0.07), cx2, H2 - 2.98, cz2 + 0.10, { ry });
      add('dark', box(0.38, 0.07, 0.07), cx2 + 0.17 * Math.cos(ry), H2 - 3.0, cz2 - 0.17 * Math.sin(ry), { ry });
    });

    /* ===================================================================
       storey 3 — the upper arcade, set back
       =================================================================== */
    add(trim, box(SIDE + 1.9, 0.55, SIDE + 1.9), 0, H2 - 0.05, 0);
    faces.forEach((f) => fringeFace(f, H2 - 0.34, 1.00, SIDE + 1.7, 26, 0.26, 0.40));
    block(wall, SIDE - 0.6, H3 - H2 - 0.5, SIDE - 0.6, 0, H2 + 0.5, 0);
    faces.forEach((f) => {
      const ry = f.ry;
      const [nx, nz] = NO(ry);
      const n = 7, span = 2.3;
      for (let i = 0; i < n; i++) {
        const ox = (i - (n - 1) / 2) * span;
        const ax = f.x + Math.cos(ry) * ox + nx * 0.34;
        const az = f.z - Math.sin(ry) * ox + nz * 0.34;
        add('dark', arch(1.2, 1.9, 0.18), ax, H2 + 0.95, az, { ry });
        add(trim, archFrame(1.5, 2.15, 0.10, 0.10), ax, H2 + 0.90, az - 0.02, { ry });
      }
    });

    /* ===================================================================
       storey 4 — the pierced parapet
       =================================================================== */
    add(trim, box(SIDE - 0.2, 0.40, SIDE - 0.2), 0, H3 - 0.05, 0);
    faces.forEach((f) => fringeFace(f, H3 - 0.30, -0.10, SIDE - 0.4, 22, 0.22, 0.34));
    const pW = SIDE - 1.2;
    faces.forEach((f) => {
      const ry = f.ry;
      const nx2 = Math.sin(ry), nz2 = Math.cos(ry);
      add('jali', ctx.jali(pW, 1.2, { cols: 5, rows: 3, bar: 0.06, depth: 0.10 }), f.x + nx2 * 0.20, H3 + 0.15, f.z + nz2 * 0.20, { ry });
      add(trim, box(pW + 0.4, 0.18, 0.34), f.x + nx2 * 0.20, H3 + 1.36, f.z + nz2 * 0.20, { ry });
      for (let i = 0; i < 11; i++) {
        const ox = (i - 5) * (pW / 11);
        add(trim, box(0.34, 0.42, 0.28),
          f.x + Math.cos(ry) * ox + nx2 * 0.20, H3 + 1.62, f.z - Math.sin(ry) * ox + nz2 * 0.20, { ry });
      }
    });
    // roof slab
    add(wall, box(SIDE - 1.0, 0.30, SIDE - 1.0), 0, H3 + 0.6, 0);

    /* ---- the mosque on the roof, at the western end ---- */
    (function roofMosque() {
      const x = -4.6, z = 0;
      block(wall, 8.4, 3.4, 9.6, x, H3 + 0.75, z);
      add(trim, box(9.2, 0.34, 10.4), x, H3 + 4.15, z);
      add('dark', arch(2.4, 3.0, 0.24), x, H3 + 0.85, z + 4.85);
      add(white, archFrame(2.8, 3.3, 0.16, 0.14), x, H3 + 0.8, z + 4.8);
      add(wall, dome(2.5, 2.6, 22), x, H3 + 4.4, z);
      add(trim, cyl(0.30, 0.30, 0.5, 10), x, H3 + 7.0, z);
      add('gold', sph(0.16, 8), x, H3 + 7.4, z);
      // two small chhatris at the corners of the roof
      [[HALF - 2.4, HALF - 2.4], [-HALF + 2.4, HALF - 2.4],
       [HALF - 2.4, -HALF + 2.4], [-HALF + 2.4, -HALF + 2.4]].forEach(([cx, cz2]) => {
        add(trim, cyl(0.72, 0.80, 0.18, 10), cx, H3 + 0.95, cz2);
        add(wall, dome(0.70, 0.72, 14), cx, H3 + 1.05, cz2);
        add('gold', sph(0.08, 6), cx, H3 + 1.72, cz2);
      });
    })();

    /* ===================================================================
       the four minarets: four tiers, three projecting balconies
       =================================================================== */
    function balcony(y, r, proj) {
      const rOut = r + proj;
      // corbels
      const nb = 20;
      for (let k = 0; k < 2; k++) {
        const rr = r + proj * (0.35 + 0.3 * k);
        const yy = y - 0.14 - 0.17 * (1 - k);
        for (let i = 0; i < nb; i++) {
          const a = (i / nb) * TAU;
          add(trim, box((TAU * rr / nb) * 0.9, 0.19, proj * 0.4), Math.cos(a) * rr, yy, Math.sin(a) * rr, { ry: -a });
        }
      }
      add(trim, cyl(rOut, rOut * 0.98, 0.26, 24), 0, y + 0.13, 0);
      add(white, cyl(rOut + 0.08, rOut + 0.08, 0.09, 24), 0, y + 0.30, 0);
      // pierced balustrade
      add('jali', cyl(rOut - 0.06, rOut - 0.06, 0.62, 24, true), 0, y + 0.65, 0);
      add(trim, cyl(rOut, rOut, 0.10, 24), 0, y + 0.99, 0);
    }

    function minaret(cx, cz) {
      const g = (key, geo, y, o) => add(key, geo, cx, y, cz, o);
      // square base
      block(trim, 5.4, 1.2, 5.4, cx, 0.75, cz);
      block(wall, 4.6, 2.2, 4.6, cx, 1.95, cz);

      const tiers = [
        { y0: 4.1, y1: 13.5, r0: 2.60, r1: 2.30 },
        { y0: 14.2, y1: 24.0, r0: 2.15, r1: 1.95 },
        { y0: 24.7, y1: 34.5, r0: 1.80, r1: 1.62 },
        { y0: 35.2, y1: M_TOP, r0: 1.50, r1: 1.30 }
      ];
      tiers.forEach((t, i) => {
        const hh = t.y1 - t.y0, mid = (t.y0 + t.y1) / 2;
        g(wall, cyl(t.r1, t.r0, hh, 8), mid, { ry: Math.PI / 8 });
        // moulded bands at the foot and head of the tier
        g(trim, cyl(t.r0 + 0.10, t.r0 + 0.10, 0.22, 8), t.y0 + 0.16, { ry: Math.PI / 8 });
        g(trim, cyl(t.r1 + 0.22, t.r1 + 0.10, 0.30, 8), t.y1 - 0.34, { ry: Math.PI / 8 });
        // a tall arched niche on the cardinal faces of the octagon
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * TAU + Math.PI / 8;
          const rr = (t.r0 + t.r1) / 2;
          const wdt = i === 3 ? 0.55 : 0.82, hgt = i === 3 ? 1.8 : 2.7;
          const px = cx + Math.cos(a) * (rr - 0.06), pz = cz + Math.sin(a) * (rr - 0.06);
          // a lighter arch laid behind the dark opening reads as its surround
          add(trim, arch(wdt + 0.30, hgt + 0.26, 0.10), px, t.y0 + 1.45, pz, { ry: -a + Math.PI / 2 });
          add('dark', arch(wdt, hgt, 0.10), px + Math.cos(a) * 0.05, t.y0 + 1.50, pz + Math.sin(a) * 0.05, { ry: -a + Math.PI / 2 });
        }
        // projecting balcony at the head of each of the first three tiers
        if (i < 3) {
          const proj = [1.35, 1.15, 0.95][i];
          // translate the balcony into place
          const save = [cx, cz];
          balconyTmp(t.y1 + 0.10, t.r1, proj, save[0], save[1]);
        }
      });

      // lotus base, bulbous dome, finial
      const rTop = 1.30;
      g(trim, cyl(rTop + 0.35, rTop + 0.20, 0.34, 16), M_TOP + 0.05);
      g(trim, cyl(rTop + 0.95, rTop + 0.35, 0.52, 16), M_TOP + 0.39);
      // petal ring round the lotus base
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU;
        add(trim, sph(0.30, 8), cx + Math.cos(a) * (rTop + 0.62), M_TOP + 0.72, cz + Math.sin(a) * (rTop + 0.62), { sy: 0.55 });
      }
      g(wall, ctx.onion(rTop + 0.72, 4.7, 22), M_TOP + 0.78);
      g(trim, cyl(0.22, 0.30, 0.62, 8), M_TOP + 5.4);
      g('gold', sph(0.24, 8), M_TOP + 6.05);
      g('gold', cone(0.17, 0.8, 8), M_TOP + 6.55);
      g('gold', sph(0.11, 6), M_TOP + 7.1);
    }

    // balcony built at the origin then translated, so the ring maths stays simple
    function balconyTmp(y, r, proj, cx, cz) {
      const rOut = r + proj;
      const nb = 24;
      // corbel course under the slab
      for (let i = 0; i < nb; i++) {
        const a = (i / nb) * TAU;
        add(trim, box((TAU * r / nb) * 0.85, 0.52, proj * 0.55),
          cx + Math.cos(a) * (r + proj * 0.28), y - 0.28, cz + Math.sin(a) * (r + proj * 0.28), { ry: -a });
      }
      add(trim, cyl(rOut, rOut * 0.97, 0.40, 24), cx, y + 0.20, cz);
      add(white, cyl(rOut + 0.10, rOut + 0.10, 0.10, 24), cx, y + 0.45, cz);
      // pierced balustrade, posts and rail
      add(trim, cyl(rOut - 0.18, rOut - 0.18, 0.60, 24, true), cx, y + 0.80, cz);
      const np = 18;
      for (let i = 0; i < np; i++) {
        const a = (i / np) * TAU;
        add(white, box(0.16, 0.34, 0.16), cx + Math.cos(a) * (rOut - 0.10), y + 1.20, cz + Math.sin(a) * (rOut - 0.10), { ry: -a });
      }
      add(trim, cyl(rOut + 0.02, rOut + 0.02, 0.14, 24), cx, y + 1.42, cz);
      // the petal fringe under the slab: the detail that makes a minaret read
      // as a minaret rather than as a pipe with rings on it
      const ring = [];
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU;
        ring.push([Math.cos(a) * (rOut - 0.14), y + 0.01, Math.sin(a) * (rOut - 0.14), -a]);
      }
      petalField(ring, 0.22, 0.36, 0.15, trim, cx, cz);
    }

    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => minaret(sx * MC, sz * MC));

    /* ===================================================================
       the crossing: arcades round the four streets
       =================================================================== */
    function arcadeRow(x, z, ry, count, span) {
      for (let i = 0; i < count; i++) {
        const ox = (i - (count - 1) / 2) * span;
        const px = x + Math.cos(ry) * ox, pz = z - Math.sin(ry) * ox;
        block(wall, 1.0, 4.4, 1.0, px, 0, pz);
        add(trim, arch(span * 0.66, 3.4, 0.3), px, 4.4, pz + 0.0, { ry });
      }
    }
    // shopfront arcades standing back from the monument
    [[0, 34, 0], [0, -34, Math.PI], [34, 0, Math.PI / 2], [-34, 0, -Math.PI / 2]].forEach(([x, z, ry]) => {
      block('plaster', 30, 5.4, 1.6, x, 0, z, { ry });
      add(white, box(30.6, 0.16, 2.0), x, 5.4, z, { ry });
      for (let i = 0; i < 7; i++) {
        const ox = (i - 3) * 4.0;
        const px = x + Math.cos(ry) * ox, pz = z - Math.sin(ry) * ox;
        add('dark', arch(2.4, 3.2, 0.2), px, 0.3, pz + Math.cos(ry) * 0.85, { ry });
        add(white, archFrame(2.8, 3.5, 0.14, 0.12), px, 0.25, pz + Math.cos(ry) * 0.85, { ry });
        add(i % 2 ? 'fabricSaffron' : 'fabricRed', box(3.0, 0.10, 1.5),
          px, 3.9, pz + Math.cos(ry) * 1.2, { ry });
      }
    });

    /* ---- life ---- */
    const people = [[-8, 16], [6, 18], [-14, 12], [13, 14], [0, 22], [-18, 20], [18, 20], [-4, 12],
      [9, 24], [-22, 8], [22, 10], [3, 30]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 26], [16, 26], [-26, 16], [26, 16], [-30, -10], [30, 10]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));
    [[-30, 30], [30, 30], [-32, -26], [32, -26], [-40, 14], [40, 14]].forEach(([x, z], i) => ctx.tree(x, z, 1.25, 'round'));

    ctx.light({ pos: [-34, 20, 34], target: [0, 24, 0], color: 0xffd2a0, intensity: 3000, distance: 260 });
    ctx.light({ pos: [34, 22, 30], target: [0, 24, 0], color: 0xffdcb4, intensity: 2200, distance: 260 });
  }
};
