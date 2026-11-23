/* Sanchi Stupa — Madhya Pradesh · procedural miniature
   The Great Stupa: hemispherical dome on a drum, square harmika, triple chatra,
   stone vedika railings and four carved toranas on a hilltop terrace.
   CC BY-NC 4.0

   Built to measured dimensions (1 unit = 1 metre):
     anda (dome)        36.6 m diameter, top of the dome at 16.46 m above the
                        ground-level pradakshina (ASI: 36.8 m dia, 16.46 m high,
                        excluding railing and chhatra)
     medhi (drum)       4.4 m high, upper pradakshina 3 m wide on its top
     harmika            square railed balcony, about 1.9 m tall
     chatravali         three parasols, the whole 21.64 m to the crown (ASI: 71 ft)
     vedika             lower railing 2.9 m high, upper 2.4 m
     torana             4.17 m pillars + 1.37 m capitals + three architraves:
                        8.9 m to the top beam, about 10.4 m to the crown
*/

export default {
  id: 'sanchi-stupa',
  accent: '#b8a888',
  accent2: '#d8c8a8',
  seed: 300,
  floodScale: 0.35,
  time: 15.2,
  bounds: 100,
  minDist: 16,
  maxDist: 340,
  home: { pos: [58, 28, 62], target: [3, 9.5, -1], fov: 40 },
  ground: { texture: 'grass', size: 1700, color: 0x8f9c68 },
  views: [
    { name: 'Full', pos: [58, 28, 62], target: [3, 9.5, -1] },
    { name: 'Gateway', pos: [13, 8, 42], target: [0, 7.5, 27] },
    { name: 'Dome', pos: [-26, 26, 30], target: [0, 15, 0] },
    { name: 'Railing', pos: [26, 6, 26], target: [14, 5, 14] },
    { name: 'Monastery', pos: [-24, 12, 40], target: [-48, 4, 6] }
  ],
  tour: [
    {
      title: "Ashoka's Mound", deva: 'साँची का स्तूप',
      text: 'The Mauryan emperor Ashoka commissioned the Great Stupa at Sanchi in the 3rd century BCE. Its core was a plain hemispherical brick dome raised over relics of the Buddha and crowned by a chatra, the parasol that marks a place of honour.',
      pos: [-56, 26, 66], target: [0, 13, 0], time: 16.2
    },
    {
      title: 'The Dome', deva: 'अंड',
      text: 'Later dynasties enlarged the stupa to roughly twice its original size and faced it in stone. The dome measures about 36 metres across and 16 metres high, on a circular drum above a wide processional terrace.',
      pos: [40, 34, 40], target: [0, 19, 0], time: 14.2
    },
    {
      title: 'Four Toranas', deva: 'चार तोरण',
      text: 'Four carved toranas went up at the cardinal points in the 1st century BCE: two square pillars carrying three architraves that end in spiral volutes. Their lintels are crowded with scenes from the life of the Buddha.',
      pos: [17, 12, 50], target: [0, 11, 26], time: 12.4
    },
    {
      title: 'The Vedika', deva: 'वेदिका',
      text: 'A stone vedika, or railing, runs around the dome and around the terrace, copying in stone the wooden fence that once enclosed the relic mound. Its posts and three rails mark out the path of circumambulation.',
      pos: [30, 7, 30], target: [15, 7, 15], time: 10.8
    },
    {
      title: 'Harmika & Chatra', deva: 'हर्मिका',
      text: 'A square harmika, the railed balcony of the gods, sits at the summit, and above it a triple stone chatra — three parasols on a single pole. The parasol is the old Indian mark of sovereignty and protection.',
      pos: [22, 30, 22], target: [0, 24, 0], time: 17.4
    },
    {
      title: 'The Monastery', deva: 'विहार',
      text: 'Monasteries, temples and smaller stupas grew up around the Great Stupa, and the site was occupied for more than a thousand years before it was abandoned. Rediscovered and conserved in the nineteenth and twentieth centuries, it became a UNESCO World Heritage Site in 1989.',
      pos: [-20, 14, 44], target: [-46, 5, 8], time: 15.6
    },
    {
      title: 'The Stupa at Night', deva: 'रात्रि',
      text: 'Sanchi sits on a hilltop in Raisen district above the plain. Lit after dusk, the dome reads as a single pale mass while the gateways throw the shadows of their architraves across the terrace.',
      pos: [-50, 24, 60], target: [0, 14, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, torus, block, col, plane, dome } = ctx;
    // the site is pale sandstone, not orange
    // Cloned from 'cream', which carries no texture map: a textured base
    // multiplies the hex down and warms it, which is why the stupa's plaster
    // came out yellow-green under the grass mound's bounce.
    const tintMat = (col) => {
      const mm = ctx.mat('cream');
      if (!mm || !mm.clone) return 'cream';
      const c = mm.clone();
      c.color.setHex(col);
      return c;
    };
    const PALE = tintMat(0xdfd3b4);
    const DOME = tintMat(0xe9e3d6);
    const PI = Math.PI;
    const arch = ctx.arch;

    /* ---------- measured levels ---------------------------------------- */
    const DR = 21.3;              // medhi radius: 18.3 m dome + 3 m upper path
    const DRUM = 4.4;             // medhi height, 14 ft
    const AR = 18.3;              // anda radius, 36.6 m diameter
    const AH = 12.06;             // anda height, so the summit is at 16.46 m
    const DTOP = DRUM + AH;       // 16.46
    const HARM = 1.9;             // harmika
    const CTOP = 21.64;           // crown of the chatravali
    const VR = 26.3;              // lower vedika radius (3 m + 5 m path outside)
    const VH = 2.9;               // lower vedika height
    const TR = 28.7;              // radius of the four toranas

    /* ---------- hilltop and grounds ------------------------------------ */
    add('foliage', dome(84, 3.2, 44), 0, -0.6, 0);
    add('foliage', plane(520, 520), 0, 0.02, 0, { rx: -PI / 2 });
    add('paving', plane(150, 22), 0, 0.06, 48, { rx: -PI / 2 });

    /* ---------- the paved pradakshina and its kerb --------------------- */
    add('paving', cyl(VR + 5.5, VR + 5.5, 0.2, 56), 0, 0.1, 0);
    add('stone', cyl(VR + 0.55, VR + 0.75, 0.45, 56), 0, 0.2, 0);
    add('paving', cyl(DR + 0.2, DR + 0.2, 0.16, 56), 0, 0.18, 0);

    /* ---------- the medhi: a circular drum 4.4 m high ------------------- */
    col('stone', DR - 0.25, DR, DRUM - 0.35, 0, 0.2, 0, 52);
    col('granite', DR - 0.1, DR + 0.15, 0.4, 0, DRUM - 0.2, 0, 52);     // top moulding
    add('paving', cyl(DR - 0.3, DR - 0.3, 0.14, 52), 0, DRUM, 0);       // upper path floor
    // grass skirt just outside the medhi
    add('foliage', cyl(DR + 1.6, DR + 2.4, 0.4, 44), 0, 0.1, 0);

    /* ---------- the anda: 36.6 m across, summit at 16.46 m -------------- */
    add(DOME, dome(AR, AH, 52), 0, DRUM, 0);
    add('granite', cyl(AR + 0.05, AR + 0.15, 0.35, 52), 0, DRUM, 0);    // base edging
    add('granite', cyl(AR - 0.35, AR - 0.25, 0.22, 52), 0, DRUM + 0.35, 0);

    /* ---------- harmika and triple chatra ------------------------------ */
    const HY = DTOP - 0.55;
    block('plaster', 5.6, 0.55, 5.6, 0, HY, 0);                         // base slab
    block('plaster', 5.0, HARM - 0.55, 5.0, 0, HY + 0.55, 0);           // the box
    block('plaster', 5.7, 0.3, 5.7, 0, HY + HARM, 0);                   // coping
    // the small vedika round the harmika
    for (let i = 0; i < 5; i++) {
      const t = -2.3 + i * 1.15;
      for (const s of [-1, 1]) {
        block('plaster', 0.22, 0.85, 0.22, t, HY + HARM + 0.3, s * 2.45);
        block('plaster', 0.22, 0.85, 0.22, s * 2.45, HY + HARM + 0.3, t);
      }
    }
    for (const s of [-1, 1]) {
      add('plaster', box(5.2, 0.12, 0.14), 0, HY + HARM + 1.15, s * 2.45);
      add('plaster', box(0.14, 0.12, 5.2), s * 2.45, HY + HARM + 1.15, 0);
      add('plaster', box(5.2, 0.12, 0.14), 0, HY + HARM + 0.72, s * 2.45);
      add('plaster', box(0.14, 0.12, 5.2), s * 2.45, HY + HARM + 0.72, 0);
    }
    const PY = HY + HARM + 0.6;                                        // 18.4
    col('granite', 0.3, 0.42, CTOP - PY + 0.5, 0, PY, 0, 10);
    // three parasols, diminishing upward
    [[2.15, 0.85], [1.7, 1.75], [1.3, 2.65]].forEach(([r, y]) => {
      add('plaster', cyl(r, r - 0.1, 0.26, 22), 0, PY + y, 0);
      add('granite', cyl(r - 0.18, r - 0.28, 0.14, 22), 0, PY + y - 0.19, 0);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * PI * 2;
        add('granite', box(0.14, 0.18, 0.14), Math.cos(a) * (r - 0.12), PY + y + 0.08, Math.sin(a) * (r - 0.12));
      }
    });
    add('stone', sph(0.34, 10), 0, CTOP - 0.1, 0);
    add('gold', cone(0.24, 0.6, 8), 0, CTOP + 0.2, 0);

    /* ---------- vedika railings ---------------------------------------- */
    function vedika(r, y, h, gaps, segs) {
      const n = Math.round((2 * PI * r) / 1.35);
      const skip = (a) => gaps.some((g) => Math.abs(((a - g + PI) % (PI * 2)) - PI) < 0.13);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * PI * 2;
        if (skip(a)) continue;
        add('granite', box(0.28, h, 0.28), Math.cos(a) * r, y + h / 2, Math.sin(a) * r, { ry: -a });
        add('granite', box(0.42, 0.13, 0.42), Math.cos(a) * r, y + h + 0.06, Math.sin(a) * r, { ry: -a });
      }
      // three rails, broken at the gateways
      for (const rh of [h * 0.3, h * 0.62, h * 0.95]) {
        for (let i = 0; i < segs; i++) {
          const a0 = (i / segs) * PI * 2, a1 = ((i + 1) / segs) * PI * 2;
          const am = (a0 + a1) / 2;
          if (skip(am)) continue;
          const len = 2 * r * Math.sin((a1 - a0) / 2) + 0.03;
          add('granite', box(len, 0.15, 0.18), Math.cos(am) * r, y + rh, Math.sin(am) * r, { ry: -am + PI / 2 });
        }
      }
    }
    const gates = [PI / 2, 0, -PI / 2, PI];
    vedika(DR - 0.55, DRUM, 2.4, gates, 110);        // round the drum, on its top
    vedika(VR, 0.42, VH, gates, 120);                // round the terrace edge

    /* ---------- four toranas -------------------------------------------
       Two square pillars 4.17 m high carrying 1.37 m capitals, then three
       architraves of diminishing length, ending in spiral volutes. */
    function torana(a) {
      const ca = Math.cos(a), sa = Math.sin(a);
      const ry = PI / 2 - a;
      const W = (lx, lz) => [TR * ca + lx * sa + lz * ca, TR * sa - lx * ca + lz * sa];
      const put = (key, geo, lx, ly, lz, o) => {
        const [wx, wz] = W(lx, lz);
        add(key, geo, wx, ly, wz, Object.assign({}, o, { ry: ry + (o && o.ry ? o.ry : 0) }));
      };
      const blk = (key, w, h, d, lx, ly, lz) => put(key, box(w, h, d), lx, ly + h / 2, lz);

      for (const s of [-1, 1]) {
        const px = s * 1.5;
        blk('granite', 1.35, 0.45, 1.35, px, 0, 0);                  // footing
        blk(PALE, 0.8, 4.17, 0.8, px, 0.45, 0);           // shaft
        // carved panels on both faces
        for (let i = 0; i < 5; i++) {
          blk('granite', 0.86, 0.42, 0.16, px, 1.15 + i * 0.72, 0.44);
          blk('granite', 0.86, 0.42, 0.16, px, 1.15 + i * 0.72, -0.44);
        }
        blk('stone', 0.95, 0.24, 0.95, px, 2.05, 0);                 // mid band
        blk(PALE, 1.05, 1.37, 1.05, px, 4.62, 0);         // capital
        blk('granite', 1.2, 0.2, 1.2, px, 5.99, 0);
        // the lion / elephant / dwarf group on the abacus
        blk('stone', 0.62, 0.5, 0.62, px, 6.19, 0);
      }
      // three architraves, 6.0 / 5.4 / 4.8 m, with volute ends
      const beams = [[6.0, 0.84, 0], [5.4, 0.72, 1.42], [4.8, 0.58, 2.72]];
      beams.forEach(([len, hgt, dy], bi) => {
        const y = 6.69 + dy;
        blk(PALE, len, hgt, 1.05, 0, y, 0);
        blk('stone', len - 0.4, 0.16, 1.15, 0, y + hgt, 0);
        for (const s of [-1, 1]) {
          put(PALE, torus(hgt * 0.62, 0.2, 6, 14), s * (len / 2 + 0.22), y + hgt * 0.5, 0);
          put('granite', cyl(0.26, 0.26, 1.1, 10), s * (len / 2 + 0.22), y + hgt * 0.5, 0, { rx: PI / 2 });
          for (let i = 0; i < 5; i++) {
            blk('stone', 0.5, 0.26, 0.2, -len / 2 + 1.1 + i * ((len - 2.2) / 4), y + 0.06, 0.56);
          }
        }
        // uprights carrying the next architrave
        if (bi < 2) {
          for (const s of [-1, 0, 1]) {
            blk('granite', 0.26, 0.5, 0.7, s * 1.9, y + hgt, 0);
          }
        }
      });
      // the dharma chakra crowning the top architrave
      const cy = 6.69 + 2.72 + 0.58;
      put('stone', torus(0.95, 0.15, 6, 16), 0, cy + 1.0, 0);
      for (let i = 0; i < 4; i++) {
        put('stone', box(0.12, 1.8, 0.12), 0, cy + 1.0, 0, { rz: (i * PI) / 4 });
      }
      put('stone', cyl(0.26, 0.26, 0.3, 10), 0, cy + 1.0, 0, { rx: PI / 2 });
      put('granite', box(0.45, 0.9, 0.45), 0, cy + 0.05, 0);
      put('stone', sph(0.22, 8), 0, cy + 2.0, 0);
    }
    gates.forEach(torana);

    /* ---------- four flights of steps up the drum ----------------------- */
    function flight(a) {
      const ca = Math.cos(a), sa = Math.sin(a), ry = PI / 2 - a;
      const n = 9, r0 = DR - 1.6, r1 = DR + 3.4;
      for (let i = 0; i < n; i++) {
        const h = DRUM * (i + 1) / n;
        const r = r0 + (r1 - r0) * ((i + 0.5) / n);
        const dr = (r1 - r0) / n;
        block('stone', 3.2, h, dr + 0.04, ca * r, 0.2, sa * r, { ry });
      }
      // low flanking kerbs
      for (const s of [-1, 1]) {
        for (let i = 0; i < n; i++) {
          const h = DRUM * (i + 1) / n;
          const r = r0 + (r1 - r0) * ((i + 0.5) / n);
          const dr = (r1 - r0) / n;
          block('granite', 0.45, h + 0.45, dr + 0.04,
            ca * r - s * 1.75 * sa, 0.2, sa * r + s * 1.75 * ca, { ry });
        }
      }
    }
    gates.forEach(flight);

    /* ---------- monastery courtyard (vihara) ---------------------------- */
    (function vihara(cx, cz) {
      block('stone', 28, 0.6, 25, cx, 0, cz);
      add('foliage', plane(15, 13), cx, 0.62, cz, { rx: -PI / 2 });
      for (let r = 0; r < 4; r++) {
        for (let i = 0; i < 7; i++) {
          const t = -9.8 + i * 3.3;
          const cw = 2.9, ch = 3.2;
          if (r === 0 || r === 3) {
            const z = cz + (r === 0 ? -9.9 : 9.9);
            block('granite', cw, ch, 4.0, cx + t, 0.6, z);
            add('dark', plane(1.1, 2.0), cx + t, 1.75, z + (r === 0 ? 2.02 : -2.02), { ry: r === 0 ? 0 : PI });
          } else if (i > 0 && i < 6) {
            const x = cx + (r === 1 ? -11.4 : 11.4);
            block('granite', 4.0, ch, cw, x, 0.6, cz + t);
            add('dark', plane(1.1, 2.0), x + (r === 1 ? 2.02 : -2.02), 1.75, cz + t, { ry: r === 1 ? PI / 2 : -PI / 2 });
          }
        }
      }
      block('stone', 5.0, 0.5, 5.0, cx, 0.6, cz - 2);
      block('granite', 4.2, 3.0, 4.2, cx, 1.1, cz - 2);
      block(PALE, 4.8, 0.45, 4.8, cx, 4.1, cz - 2);
      add('dark', plane(1.3, 1.9), cx, 2.2, cz + 0.15);
    })(-50, 4);

    /* ---------- votive stupas ------------------------------------------ */
    function votive(x, z, s) {
      block('stone', 4.4 * s, 0.6 * s, 4.4 * s, x, 0, z);
      col('granite', 3.2 * s, 3.4 * s, 0.7 * s, x, 0.6 * s, z, 20);
      add('granite', dome(3.2 * s, 2.4 * s, 20), x, 1.3 * s, z);
      block(PALE, 1.4 * s, 0.9 * s, 1.4 * s, x, 3.7 * s, z);
      add('stone', cyl(1.2 * s, 1.2 * s, 0.16 * s, 12), x, 4.7 * s, z);
      add('stone', cyl(0.85 * s, 0.85 * s, 0.14 * s, 12), x, 5.2 * s, z);
      add('stone', cyl(0.12 * s, 0.14 * s, 1.2 * s, 6), x, 5.9 * s, z);
    }
    [[-36, -34, 1.0], [-27, 35, 0.9], [35, -31, 1.0], [31, 37, 0.85],
      [-41, 22, 0.75], [45, 14, 0.8], [12, -45, 0.9], [-14, -47, 0.8]]
      .forEach(([x, z, s]) => votive(x, z, s));

    /* ---------- trees, lamps, visitors ---------------------------------- */
    const trees = [[-47, -22], [-38, -47], [-20, -59], [22, -55], [47, -18], [51, 27],
      [41, 53], [-31, 53], [-57, 35], [-65, 6], [58, -44], [-58, -40], [10, 61], [-8, -67]];
    trees.forEach(([x, z], i) => ctx.tree(x, z, 1.05 + (i % 3) * 0.2, i % 5 === 0 ? 'cypress' : 'round'));

    [[-9, 40], [9, 40], [-9, 54], [9, 54], [-34, 12], [34, 12], [-20, -35], [24, -33]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));

    const people = [[-3, 41, 'fabricSaffron'], [4, 43, 'fabricWhite'], [-10, 45, 'fabricRed'],
      [12, 41, 'fabricWhite'], [-16, 39, 'fabricSaffron'], [6, 49, 'fabricRed'],
      [22, 12, 'fabricWhite'], [-24, 14, 'fabricRed'], [0, 35, 'fabricWhite'],
      [-36, 41, 'fabricSaffron'], [18, -31, 'fabricWhite'], [-30, -27, 'fabricRed'],
      [2, 55, 'fabricWhite'], [-46, 16, 'fabricSaffron']];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 0.8, k, 1.0 + (i % 3) * 0.05));

    /* ---------- floodlights -------------------------------------------- */
    ctx.light({ pos: [-38, 24, 46], target: [0, 14, 0], color: 0xffd2a0, intensity: 2400, distance: 300 });
    ctx.light({ pos: [42, 22, 34], target: [0, 14, 0], color: 0xffdcb4, intensity: 2000, distance: 300 });
    ctx.light({ pos: [4, 12, 60], target: [0, 10, 26], color: 0xffc890, intensity: 1500, distance: 180 });
  }
};
