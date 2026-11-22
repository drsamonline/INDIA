/* India Gate — New Delhi · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Rebuilt to measured dimensions.  1 unit = 1 metre.

   real (m)                            model    source
   -----------------------------------------------------------------------
   overall height, top of the attic     42.35    INTACH Delhi (Central Vista)
   great arch span                       9.6     Wikipedia 30 ft = 9.1 m;
                                                 INTACH "10 m wide main opening"
   great arch crown, above the plinth   24.3     derived: semicircular head of
                                                 4.8 m radius springing at 19.5
                                                 — "the arch itself, springing
                                                 from less than half way up the
                                                 building" (Lutyens Catalogue)
   block width                         ~37.0     scaled off the lead photograph;
                                                 not stated in any source (the
                                                 9.1 m often quoted as "width"
                                                 is the opening)
   block depth                         ~21.0     oblong tetrapylon; not stated
   short-face arch span                  6.0     derived from the photograph
   short-face arch crown                16.0     derived from the photograph
   plinth, red Bharatpur stone           1.1     Wikipedia / INTACH

   The canopy is a separate four-pillared structure on the axis behind the
   gate — INTACH: "Standing behind India gate is an empty canopy constructed
   in sandstone, designed by Lutyens."  Its distance from the gate is not
   stated in any source; modelled at 84 m. */

export default {
  id: 'india-gate',
  accent: '#c98a5a',
  accent2: '#e8b07a',
  seed: 41,
  floodScale: 0.26,
  bounds: 96,
  minDist: 15,
  maxDist: 320,
  time: 15.4,
  home: { pos: [34, 21, 130], target: [0, 20, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x9dab74, tile: 16 },
  views: [
    { name: 'Full', pos: [26, 21, 100], target: [0, 20, 0] },
    { name: 'The axis', pos: [0, 15, 112], target: [0, 21, 0] },
    { name: 'Under the arch', pos: [0.5, 2.6, 15], target: [0, 21, -3] },
    { name: 'Attic and bowl', pos: [16, 42, 50], target: [0, 35, 0] },
    { name: 'The canopy', pos: [5, 12, -50], target: [0, 8, -84] }
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
    const { add, box, cyl, sph, cone, torus, dome, block, col, plane } = ctx;

    function tint(key, hex) {
      const m = ctx.mat(key);
      if (!m || !m.clone) return key;
      const c = m.clone();
      c.color.setHex(hex);
      return c;
    }
    const stone = tint('plaster', 0xf2d3b2);          // warm Bharatpur sandstone
    const light = 'ivory';                            // lighter carved stone
    const light2 = tint('plaster', 0xfae4cc);
    const soffit = tint('plaster', 0x8f7861);         // shaded passage vault
    const coffer = tint('plaster', 0x735f4e);
    const recess = tint('plaster', 0xe0c5a6);
    const plinth = tint('plaster', 0xd9a882);   // red Bharatpur stone base

    /* ---------------------------------------------------------- dimensions */
    const W = 37.0, D = 21.0;         // block, in plan
    const BASE = 1.1;                 // top of the plinth
    const AW = 9.6, AH = 24.3;        // great opening: span and crown above ground
    const SPRING = AH - AW / 2;       // 19.5 — springs just under half way up
    const SW = 6.0, SH = 16.0;        // short-face arch: span and crown above ground
    const SSPRING = SH - SW / 2;      // 13.0
    const AHOL = AH - BASE, SHOL = SH - BASE;   // opening heights above the floor
    const HWALL = 27.4;               // top of the spandrel wall, base of the frieze
    const PIER = (W - AW) / 2;        // 13.7
    const WT = 3.6;                   // thickness of each pierced face

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
    function pierced(w, h, depth, aw, ah, sill) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      const a = romArch(aw, ah);
      const pts = a.getPoints(24).map((p) => new T3.Vector2(p.x, p.y + (sill || 0)));
      s.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 5 });
    }
    function archRing(w, h, thick, depth) {
      const outer = romArch(w, h);
      const inner = romArch(w - thick * 2, h - thick * 1.02);
      const pts = inner.getPoints(24).map((p) => new T3.Vector2(p.x, p.y + thick * 0.5));
      outer.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 5 });
    }

    /* ------------------------------------------------ low plinth and steps */
    block(plinth, W + 6.0, 0.42, D + 6.0, 0, 0, 0);
    block(plinth, W + 4.4, 0.38, D + 4.4, 0, 0.42, 0);
    block(plinth, W + 2.6, 0.30, D + 2.6, 0, 0.80, 0);
    for (let i = 0; i < 3; i++) {
      const w2 = 26 - i * 2.0, z = D / 2 + 3.4 + i * 0.95;
      add(plinth, box(w2, 0.26 * (i + 1), 1.0), 0, 0.13 * (i + 1), z);
      add(plinth, box(w2, 0.26 * (i + 1), 1.0), 0, 0.13 * (i + 1), -z);
    }
    for (let i = 0; i < 3; i++) {
      const d2 = 11 - i * 1.4, x = W / 2 + 3.4 + i * 0.95;
      add(plinth, box(1.0, 0.26 * (i + 1), d2), x, 0.13 * (i + 1), 0);
      add(plinth, box(1.0, 0.26 * (i + 1), d2), -x, 0.13 * (i + 1), 0);
    }

    /* ------------------------------------------------------- the arch block
       Two pierced faces along z carrying the great arch, two along x
       carrying the smaller short-face arch, and solid basalt between. */
    add(stone, pierced(W, HWALL, WT, AW, AHOL, BASE), 0, 0, D / 2 - WT);
    add(stone, pierced(W, HWALL, WT, AW, AHOL, BASE), 0, 0, -D / 2);
    [-1, 1].forEach((s) => {
      add(stone, pierced(D, HWALL, WT, SW, SHOL, BASE), s * (W / 2 - WT), 0, 0, { ry: s * Math.PI / 2 });
      // the blocked lower half of that arch, with a door cut through it
      add(stone, pierced(SW + 0.2, SSPRING + 0.4, 0.45, 2.4, 4.4, BASE),
        s * (W / 2 + 0.02), 0, 0, { ry: s * Math.PI / 2 });
      add('dark', box(0.4, 4.4, 2.4), s * (W / 2 - 1.4), BASE + 2.2, 0);
      // the stone ornament above the blocked base
      add(light, box(0.3, 2.4, 3.2), s * (W / 2 + 0.14), BASE + SSPRING + 2.6, 0);
      add(light, torus(1.05, 0.16, 6, 14), s * (W / 2 + 0.34), BASE + SSPRING + 2.6, 0, { ry: Math.PI / 2 });
    });
    // solid basalt: the piers either side of the great arch ...
    [-1, 1].forEach((sx) => {
      add(stone, box(PIER - WT, HWALL, D - 2 * WT),
        sx * (AW / 2 + (PIER - WT) / 2), BASE + HWALL / 2, 0);
    });
    // ... and the corner masses between the long and short faces
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        add(stone, box(W / 2 - WT - AW / 2, HWALL, D / 2 - WT - SW / 2),
          sx * (AW / 2 + (W / 2 - WT - AW / 2) / 2), BASE + HWALL / 2,
          sz * (SW / 2 + (D / 2 - WT - SW / 2) / 2));
      });
    });

    /* --------------------------------------------- the coffered barrel vault
       Lutyens: "The ceilings and undersides of the arches are decorated with
       well-spaced coffers."  Nine flat segments carry a grid of panels. */
    const R = AW / 2;
    const VD = D - 2 * WT;
    for (let i = 0; i < 9; i++) {
      const a = (Math.PI * (i + 0.5)) / 9;
      const segW = 2 * R * Math.sin(Math.PI / 18) + 0.14;
      add(soffit, box(segW, 0.24, VD + 0.1),
        Math.cos(a) * R, SPRING + Math.sin(a) * R, 0, { rz: a - Math.PI / 2 });
      for (let k = 0; k < 4; k++) {
        const z = (k - 1.5) * (VD / 4);
        add(coffer, box(segW * 0.56, 0.14, 1.7),
          Math.cos(a) * (R - 0.16), SPRING + Math.sin(a) * (R - 0.16), z, { rz: a - Math.PI / 2 });
      }
    }
    // the vertical jambs of the passage, and its floor
    [-1, 1].forEach((s) => {
      add(soffit, box(0.2, SPRING - BASE, VD), s * (AW / 2 - 0.06), (SPRING + BASE) / 2, 0);
    });
    add(soffit, box(AW + 0.3, 0.22, VD + 0.1), 0, BASE + 0.11, 0);

    /* ------------------------------------------------- carved arch surrounds */
    [-1, 1].forEach((s) => {
      const zf = s * (D / 2 + 0.02);
      add(light, archRing(AW + 1.2, AHOL + 0.7, 0.55, 0.5), 0, BASE, zf, { ry: s < 0 ? Math.PI : 0 });
      add(light, archRing(AW + 2.5, AHOL + 1.4, 0.34, 0.3), 0, BASE, zf + s * 0.1, { ry: s < 0 ? Math.PI : 0 });
      add(light, box(1.05, 1.8, 0.75), 0, AH + 0.35, zf + s * 0.2);          // keystone
      [-1, 1].forEach((d) => {
        add(light, box(1.9, 0.6, 0.7), d * (AW / 2 + 0.85), SPRING - 0.3, zf + s * 0.15);
      });
    });
    // a moulding round the block at the springing line
    add(light, box(W + 0.8, 0.55, D + 0.8), 0, SPRING - 0.2, 0);
    add(light2, box(W + 0.5, 0.2, D + 0.5), 0, SPRING + 0.16, 0);
    add(light, box(W + 0.7, 1.1, D + 0.7), 0, BASE + 0.55, 0);              // base moulding

    /* ------------------------------------- piers: pilasters, setback, panels */
    [-1, 1].forEach((s) => {
      [AW / 2 + 1.0, W / 2 - 1.0].forEach((x) => {
        add(light, box(1.1, HWALL - 3.4, 0.42), s * x, BASE + 1.1 + (HWALL - 3.4) / 2, D / 2 + 0.16);
        add(light, box(1.1, HWALL - 3.4, 0.42), s * x, BASE + 1.1 + (HWALL - 3.4) / 2, -D / 2 - 0.16);
      });
      [D / 4, -D / 4].forEach((z) => {
        add(light, box(0.42, HWALL - 3.4, 1.1), W / 2 + 0.16, BASE + 1.1 + (HWALL - 3.4) / 2, z);
        add(light, box(0.42, HWALL - 3.4, 1.1), -W / 2 - 0.16, BASE + 1.1 + (HWALL - 3.4) / 2, z);
      });
      // the inscribed panel on each pier face, and its carved head
      const cx = s * (AW / 2 + PIER / 2);
      add(recess, box(PIER - 5.6, HWALL - 14.0, 0.1), cx, BASE + 1.4 + (HWALL - 14.0) / 2, D / 2 + 0.03);
      add(recess, box(PIER - 5.6, HWALL - 14.0, 0.1), cx, BASE + 1.4 + (HWALL - 14.0) / 2, -D / 2 - 0.03);
      add(recess, box(0.1, HWALL - 14.0, PIER - 5.6), W / 2 + 0.03, BASE + 1.4 + (HWALL - 14.0) / 2, cx);
      add(recess, box(0.1, HWALL - 14.0, PIER - 5.6), -W / 2 - 0.03, BASE + 1.4 + (HWALL - 14.0) / 2, cx);
      // fine bands of names
      for (let i = 0; i < 24; i++) {
        const y = BASE + 1.9 + i * 0.45;
        add(recess, box(PIER - 6.4, 0.05, 0.05), cx, y, D / 2 + 0.09);
        add(recess, box(PIER - 6.4, 0.05, 0.05), cx, y, -D / 2 - 0.09);
      }
      // a setback, stepped in as the pier rises
      add(light, box(1.3, HWALL - 6.4, 0.5), s * (W / 2 - 2.6), BASE + 1.1 + (HWALL - 6.4) / 2, D / 2 + 0.2);
      add(light, box(1.3, HWALL - 6.4, 0.5), s * (W / 2 - 2.6), BASE + 1.1 + (HWALL - 6.4) / 2, -D / 2 - 0.2);
    });

    /* ------------------------------------------ spandrel rosettes and frieze */
    [-1, 1].forEach((s) => {
      [0, 1].forEach((k) => {
        const x = s * (5.4 + k * 3.6), y = SPRING + 3.2 - k * 1.1;
        add(stone, cyl(0.85, 0.85, 0.26, 14), x, y, D / 2 + 0.14, { rx: Math.PI / 2 });
        add(light2, cyl(0.55, 0.55, 0.14, 12), x, y, D / 2 + 0.24, { rx: Math.PI / 2 });
        add(stone, cyl(0.85, 0.85, 0.26, 14), x, y, -D / 2 - 0.14, { rx: Math.PI / 2 });
      });
    });
    // the sunburst frieze under the cornice
    for (let i = -8; i <= 8; i++) {
      const x = i * 2.1;
      if (Math.abs(x) < 5.2) continue;
      add(light, box(0.6, 1.3, 0.2), x, HWALL - 1.7, D / 2 + 0.12, { rz: i % 2 ? 0.34 : -0.34 });
      add(light, box(0.6, 1.3, 0.2), x, HWALL - 1.7, -D / 2 - 0.12, { rz: i % 2 ? 0.34 : -0.34 });
    }
    for (let i = -4; i <= 4; i++) {
      const z = i * 2.1;
      if (Math.abs(z) < 3.4) continue;
      add(light, box(0.2, 1.3, 0.6), W / 2 + 0.12, HWALL - 1.7, z, { rx: i % 2 ? 0.34 : -0.34 });
      add(light, box(0.2, 1.3, 0.6), -W / 2 - 0.12, HWALL - 1.7, z, { rx: i % 2 ? 0.34 : -0.34 });
    }

    /* ------------------------------------------------ the principal cornice */
    add(light, box(W + 0.7, 0.45, D + 0.7), 0, HWALL - 1.0, 0);
    for (let i = -17; i <= 17; i++) {
      add(light2, box(0.42, 0.36, 0.18), i * 1.05, HWALL - 0.5, D / 2 + 0.24);
      add(light2, box(0.42, 0.36, 0.18), i * 1.05, HWALL - 0.5, -D / 2 - 0.24);
    }
    for (let i = -8; i <= 8; i++) {
      add(light2, box(0.18, 0.36, 0.42), W / 2 + 0.24, HWALL - 0.5, i * 1.05);
      add(light2, box(0.18, 0.36, 0.42), -W / 2 - 0.24, HWALL - 0.5, i * 1.05);
    }
    add(light, box(W + 1.7, 0.5, D + 1.7), 0, HWALL - 0.05, 0);
    add(light2, box(W + 1.2, 0.2, D + 1.2), 0, HWALL + 0.3, 0);

    /* --------------------------------------------- the attic and the basin
       A massive blocky attic stepping inward, then the shallow bowl. */
    block(stone, W - 3.0, 1.5, D - 3.0, 0, HWALL + 0.4, 0);            // 27.8 → 29.3
    add(light, box(W - 2.4, 0.34, D - 2.4), 0, 29.4, 0);
    const ATW = W - 11.0, ATD = D - 11.0;                              // 26 x 10
    block(stone, ATW, 7.9, ATD, 0, 29.7, 0);                           // attic body
    // the inscription panel: INDIA, and the years either side
    [-1, 1].forEach((s) => {
      add(light2, box(9.6, 2.6, 0.12), 0, 33.6, s * (ATD / 2 + 0.02));
      add(light2, box(9.6, 2.6, 0.12), s * (ATW / 2 + 0.02), 33.6, 0, { ry: Math.PI / 2 });
      add(light, box(10.2, 0.26, 0.22), 0, 35.1, s * (ATD / 2 + 0.1));
      add(light, box(10.2, 0.26, 0.22), 0, 32.1, s * (ATD / 2 + 0.1));
    });
    for (let i = -7; i <= 7; i++) {
      add(recess, box(0.14, 1.6, 0.05), i * 0.6, 33.6, ATD / 2 + 0.09);
      add(recess, box(0.14, 1.6, 0.05), i * 0.6, 33.6, -ATD / 2 - 0.09);
    }
    // a moulded base course and a recessed field, so the attic is not a blank slab
    add(light, box(ATW + 1.0, 0.34, ATD + 1.0), 0, 30.2, 0);
    add(light2, box(ATW + 0.4, 0.2, ATD + 0.4), 0, 30.55, 0);
    [-1, 1].forEach((s2) => {
      add(recess, box(ATW * 0.52, 2.1, 0.09), 0, 31.8, s2 * (ATD / 2 + 0.03));
      add(recess, box(ATW * 0.52, 2.1, 0.09), s2 * (ATW / 2 + 0.03), 31.8, 0, { ry: Math.PI / 2 });
      add(light, box(ATW * 0.56, 0.16, 0.14), 0, 32.95, s2 * (ATD / 2 + 0.07));
      add(light, box(ATW * 0.56, 0.16, 0.14), 0, 30.75, s2 * (ATD / 2 + 0.07));
    });
    // attic cornice
    add(light, box(ATW + 1.8, 0.5, ATD + 1.8), 0, 37.6, 0);
    add(light2, box(ATW + 1.0, 0.28, ATD + 1.0), 0, 38.05, 0);
    // the top block, narrower again, carrying the bowl
    block(stone, W - 17.0, 2.3, D - 17.0, 0, 38.3, 0);                 // 20 x 4
    add(light, box(W - 15.6, 0.38, D - 15.6), 0, 40.7, 0);
    // the shallow bowl, and its stepped base
    add(light, cyl(2.6, 3.0, 0.5, 24), 0, 41.1, 0);
    add(light2, cyl(3.2, 2.9, 0.3, 24), 0, 41.5, 0);
    add(soffit, cyl(2.4, 2.4, 0.2, 22), 0, 41.62, 0);
    add(light, cyl(0.7, 0.95, 0.6, 12), 0, 41.8, 0);

    /* -------------------------------------------- Amar Jawan Jyoti under the arch */
    add('black', box(5.0, 0.5, 5.0), 0, BASE + 0.25, 0);
    add('bronze', box(3.6, 0.32, 3.6), 0, BASE + 0.62, 0);
    add('gold', cone(0.18, 0.9, 8), 0, BASE + 1.2, 0);
    [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].forEach(([x, z]) => {
      add('black', cyl(0.05, 0.05, 1.7, 5), x, BASE + 1.05, z, { rz: 0.05 });
    });

    /* -------------------------------------------------- the empty canopy
       Lutyens' four-pillared chhatri on the axis behind the gate, empty
       since the statue of George V came down in 1947. */
    (function canopy(cx, cz) {
      block(light2, 24.0, 0.55, 24.0, cx, 0, cz);
      block(light, 21.6, 0.5, 21.6, cx, 0.55, cz);
      block(light, 19.4, 0.6, 19.4, cx, 1.05, cz);
      for (let i = 0; i < 4; i++) {
        add(light, box(9.0, 0.24 * (i + 1), 0.9), cx, 0.12 * (i + 1), cz + 11.0 + i * 0.8);
      }
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const px = cx + dx * 6.6, pz = cz + dz * 6.6;
        block(light, 2.2, 0.9, 2.2, px, 1.65, pz);
        block(stone, 1.5, 7.4, 1.5, px, 2.55, pz);
        add(light, box(1.95, 0.34, 1.95), px, 6.6, pz);
        add(light, box(1.95, 0.34, 1.95), px, 9.3, pz);
        block(light, 2.3, 0.9, 2.3, px, 10.3, pz);
        add(light2, box(1.8, 0.36, 1.8), px, 11.25, pz);
      }
      block(stone, 17.0, 1.1, 17.0, cx, 11.6, cz);
      add(light, box(19.0, 0.45, 19.0), cx, 12.75, cz);
      add(light, box(17.6, 0.4, 17.6), cx, 13.2, cz);
      add(light, box(16.2, 0.34, 16.2), cx, 13.6, cz);
      add(light, dome(7.0, 2.6, 22), cx, 13.95, cz);
      add(light, cyl(1.5, 1.9, 0.7, 12), cx, 16.4, cz);
      add(light2, sph(0.9, 10), cx, 17.1, cz);
      add('gold', cone(0.16, 1.5, 6), cx, 17.8, cz);
      // the statue plinth, standing empty
      block(light2, 3.0, 0.6, 3.0, cx, 1.65, cz);
      block('stone', 2.2, 1.4, 2.2, cx, 2.25, cz);
    })(0, -84);

    /* ------------------------------------------------ lawns, paths, bollards */
    add('paving', plane(30, 300), 0, 0.05, 6, { rx: -Math.PI / 2 });
    add('grass', plane(170, 300), -100, 0.04, 6, { rx: -Math.PI / 2 });
    add('grass', plane(170, 300), 100, 0.04, 6, { rx: -Math.PI / 2 });
    for (let i = -5; i <= 5; i++) {
      if (Math.abs(i) < 2) continue;
      add('grey', cyl(0.16, 0.2, 0.9, 8), i * 4.6, 0.45, 26);
      add('grey', sph(0.17, 8), i * 4.6, 0.95, 26);
    }
    for (let i = 0; i < 3; i++) {
      const z = 42 + i * 26;
      add(light, cyl(5.6, 5.8, 0.6, 20), 0, 0.35, z);
      add('water', cyl(4.9, 4.9, 0.2, 20), 0, 0.72, z);
      add(light, cyl(0.6, 0.8, 1.5, 10), 0, 1.35, z);
    }
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 8; i++) block('foliage', 1.6, 0.9, 13, s * 12.5, 0.05, 36 + i * 18);
    });

    /* ------------------------------------------- crowds, lamps and trees */
    const people = [[-6, 18], [6, 19], [-12, 12], [12, 13], [0, 22], [-17, 26], [17, 27],
      [-3, 9], [3, 8], [-9, 30], [9, 31], [15, 7], [-15, 7], [0, 38], [-21, 22], [21, 23],
      [7, 12], [-7, 13], [13, 34], [-13, 35], [4, 44], [-4, 44], [-24, 16], [24, 17]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1,
      ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-14, 20], [14, 20], [-22, 42], [22, 42], [0, 54]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'grey'));
    [[-32, 26], [32, 26], [-36, 52], [36, 52], [-28, -22], [28, -22], [-44, 72], [44, 72],
     [-26, 78], [26, 78], [-46, 36], [46, 36], [-20, -28], [20, -28], [-42, 14], [42, 14],
     [-52, -40], [52, -40], [-30, -54], [30, -54]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 3) * 0.2, i % 4 === 0 ? 'cypress' : 'round'));

    ctx.light({ pos: [-22, 14, 34], target: [0, 18, 0], color: 0xffd0a0, intensity: 2800, distance: 190 });
    ctx.light({ pos: [22, 16, 30], target: [0, 18, 0], color: 0xffc890, intensity: 2400, distance: 190 });
    ctx.light({ pos: [0, 8, 24], target: [0, 4, 0], color: 0xffd8b0, intensity: 900, distance: 60 });
  }
};
