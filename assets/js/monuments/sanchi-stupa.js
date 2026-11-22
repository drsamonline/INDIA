/* Sanchi Stupa — Madhya Pradesh · procedural miniature
   The Great Stupa: hemispherical dome on a drum, square harmika, triple chatra,
   stone vedika railings and four carved toranas on a hilltop terrace.
   CC BY-NC 4.0 */

export default {
  id: 'sanchi-stupa',
  accent: '#b8a888',
  accent2: '#d8c8a8',
  seed: 300,
  time: 10.2,
  bounds: 100,
  minDist: 16,
  maxDist: 340,
  home: { pos: [-56, 26, 66], target: [0, 13, 0], fov: 40 },
  ground: { texture: 'grass', size: 1700, color: 0x8f9c68 },
  views: [
    { name: 'Full', pos: [-56, 26, 66], target: [0, 13, 0] },
    { name: 'Gateway', pos: [17, 12, 50], target: [0, 11, 26] },
    { name: 'Dome', pos: [40, 34, 40], target: [0, 20, 0] },
    { name: 'Railing', pos: [30, 7, 30], target: [16, 7, 16] },
    { name: 'Monastery', pos: [-20, 14, 44], target: [-46, 5, 8] }
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
    const PI = Math.PI;
    const arch = ctx.arch;

    /* ---------- hilltop and grounds ---------- */
    add('foliage', dome(78, 3.6, 44), 0, -0.4, 0);
    add('foliage', plane(520, 520), 0, 0.02, 0, { rx: -PI / 2 });
    add('paving', plane(150, 22), 0, 0.06, 44, { rx: -PI / 2 });

    /* ---------- terrace (pradakshina path) ---------- */
    const TR = 26.6, TH = 4.2;
    col('stone', TR - 0.7, TR, TH, 0, 0, 0, 48);
    col('granite', TR, TR + 0.35, 0.45, 0, TH - 0.45, 0, 48);
    add('paving', cyl(TR - 0.7, TR - 0.7, 0.12, 48), 0, TH, 0);
    // grass skirt just outside the terrace wall
    add('foliage', cyl(TR + 6, TR + 1, 0.5, 40), 0, 0, 0);

    /* ---------- circular drum (medhi) ---------- */
    const MR = 18.8;
    col('stone', MR - 0.5, MR, 2.6, 0, TH, 0, 44);
    col('stone', MR, MR + 0.25, 0.3, 0, TH + 1.9, 0, 44);

    /* ---------- dome ---------- */
    const DH = 15.0;
    add('plaster', dome(MR - 0.55, DH, 48), 0, TH + 2.2, 0);
    add('stone', cyl(MR - 0.5, MR - 0.4, 0.35, 44), 0, TH + 2.65, 0);
    const DTOP = TH + 2.6 + DH;

    /* ---------- harmika and triple chatra ---------- */
    const HY = DTOP - 0.9;
    block('sandstoneBuff', 7.4, 1.1, 7.4, 0, HY, 0);
    block('granite', 6.8, 2.9, 6.8, 0, HY + 1.1, 0);
    block('sandstoneBuff', 7.8, 0.45, 7.8, 0, HY + 4.0, 0);
    // small vedika around the harmika
    for (let i = 0; i < 6; i++) {
      const t = -3.0 + i * 1.2;
      for (const s of [-1, 1]) {
        block('stone', 0.26, 0.95, 0.26, t, HY + 4.45, s * 3.45);
        block('stone', 0.26, 0.95, 0.26, s * 3.45, HY + 4.45, t);
      }
    }
    for (const s of [-1, 1]) {
      add('stone', box(7.2, 0.14, 0.16), 0, HY + 5.1, s * 3.45);
      add('stone', box(0.16, 0.14, 7.2), s * 3.45, HY + 5.1, 0);
      add('stone', box(7.2, 0.14, 0.16), 0, HY + 4.7, s * 3.45);
      add('stone', box(0.16, 0.14, 7.2), s * 3.45, HY + 4.7, 0);
    }
    const PY = HY + 5.4;
    col('stone', 0.36, 0.5, 8.4, 0, PY, 0, 10);
    // three parasols, diminishing upward
    [[4.4, 1.1], [3.5, 3.1], [2.7, 5.1]].forEach(([r, y]) => {
      add('sandstoneBuff', cyl(r, r - 0.12, 0.34, 22), 0, PY + y, 0);
      add('stone', cyl(r - 0.2, r - 0.32, 0.16, 22), 0, PY + y - 0.24, 0);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * PI * 2;
        add('stone', box(0.16, 0.22, 0.16), Math.cos(a) * (r - 0.15), PY + y + 0.1, Math.sin(a) * (r - 0.15));
      }
    });
    add('stone', sph(0.42, 10), 0, PY + 5.5, 0);
    add('gold', cone(0.3, 0.9, 8), 0, PY + 6.3, 0);

    /* ---------- vedika railings ---------- */
    function vedika(r, y, h, gaps) {
      const n = Math.round((2 * PI * r) / 1.25);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * PI * 2;
        let skip = false;
        for (const g of gaps) {
          let d = Math.abs(((a - g + PI) % (PI * 2)) - PI);
          if (d < 0.115) skip = true;
        }
        if (skip) continue;
        add('stone', box(0.24, h, 0.24), Math.cos(a) * r, y + h / 2, Math.sin(a) * r, { ry: -a });
        add('stone', box(0.36, 0.14, 0.36), Math.cos(a) * r, y + h + 0.05, Math.sin(a) * r, { ry: -a });
      }
      // three rails, broken at the gateways
      for (const rh of [h * 0.32, h * 0.62, h * 0.94]) {
        const segs = 96;
        for (let i = 0; i < segs; i++) {
          const a0 = (i / segs) * PI * 2, a1 = ((i + 1) / segs) * PI * 2;
          const am = (a0 + a1) / 2;
          let skip = false;
          for (const g of gaps) {
            let d = Math.abs(((am - g + PI) % (PI * 2)) - PI);
            if (d < 0.115) skip = true;
          }
          if (skip) continue;
          const len = 2 * r * Math.sin((a1 - a0) / 2) + 0.03;
          add('stone', box(len, 0.15, 0.16), Math.cos(am) * r, y + rh, Math.sin(am) * r, { ry: -am + PI / 2 });
        }
      }
    }
    const gates = [PI / 2, 0, -PI / 2, PI];
    vedika(MR + 0.55, TH + 2.6, 1.5, gates);          // around the dome base
    vedika(TR - 1.5, TH, 1.3, gates);                 // around the terrace edge

    /* ---------- four toranas ---------- */
    function torana(a) {
      const R = 22.6, ry = PI / 2 - a;
      const ca = Math.cos(a), sa = Math.sin(a);
      const W = (lx, lz) => [R * ca + lx * sa + lz * ca, R * sa - lx * ca + lz * sa];
      const put = (key, geo, lx, ly, lz, o) => {
        const [wx, wz] = W(lx, lz);
        add(key, geo, wx, ly, wz, Object.assign({}, o, { ry: ry + (o && o.ry ? o.ry : 0) }));
      };
      const blk = (key, w, h, d, lx, ly, lz) => put(key, box(w, h, d), lx, ly + h / 2, lz);

      for (const s of [-1, 1]) {
        const px = s * 4.4;
        blk('granite', 2.1, 0.55, 2.1, px, TH, 0);              // footing
        blk('sandstoneBuff', 1.65, 5.3, 1.65, px, TH + 0.55, 0); // shaft
        // carved panels on both faces
        for (let i = 0; i < 4; i++) {
          blk('granite', 1.75, 0.34, 0.3, px, TH + 0.95 + i * 1.15, 0.82);
          blk('granite', 1.75, 0.34, 0.3, px, TH + 0.95 + i * 1.15, -0.82);
        }
        blk('stone', 1.7, 0.3, 1.7, px, TH + 2.4, 0);
        blk('granite', 2.0, 0.5, 2.0, px, TH + 5.85, 0);         // capital
        // sphinx bracket
        blk('sandstoneBuff', 1.0, 0.55, 1.8, px, TH + 6.35, 0);
        blk('stone', 0.7, 0.4, 0.8, px, TH + 6.9, 0.5);
      }
      // three architraves with volute ends
      const beams = [[6.85, 11.6], [7.78, 10.9], [8.71, 10.2]];
      beams.forEach(([y, len], bi) => {
        blk('sandstoneBuff', len, 0.80, 1.45, 0, TH + y, 0);
        blk('stone', len - 0.5, 0.2, 1.55, 0, TH + y + 0.62, 0);
        for (const s of [-1, 1]) {
          put('sandstoneBuff', torus(0.78, 0.24, 6, 14), s * (len / 2 + 0.25), TH + y + 0.4, 0);
          put('granite', cyl(0.34, 0.34, 1.5, 10), s * (len / 2 + 0.25), TH + y + 0.4, 0, { rx: PI / 2 });
          // small carved blocks along the beam
          for (let i = 0; i < 7; i++) {
            blk('stone', 0.6, 0.36, 0.28, -len / 2 + 1.3 + i * ((len - 2.6) / 6), TH + y + 0.1, 0.76);
          }
        }
        if (bi === 2) {
          // dharma wheel on the crown
          put('stone', torus(1.05, 0.16, 6, 16), 0, TH + y + 1.6, 0);
          for (let i = 0; i < 4; i++) {
            put('stone', box(0.14, 2.0, 0.14), 0, TH + y + 1.6, 0, { rz: i * PI / 4 });
          }
          put('stone', cyl(0.3, 0.3, 0.34, 10), 0, TH + y + 1.6, 0, { rx: PI / 2 });
          put('granite', box(0.5, 1.2, 0.5), 0, TH + y + 0.55, 0);
        }
      });
    }
    [PI / 2, 0, -PI / 2, PI].forEach(torana);

    /* ---------- four flights of steps ---------- */
    function flight(a) {
      const ca = Math.cos(a), sa = Math.sin(a), ry = PI / 2 - a;
      const n = 10, r0 = TR - 0.4, r1 = TR + 7.6;
      for (let i = 0; i < n; i++) {
        const h = TH * (i + 1) / n;
        const r = r0 + (r1 - r0) * ((i + 0.5) / n);
        const dr = (r1 - r0) / n;
        block('stone', 8.4, h, dr + 0.04, ca * r, 0, sa * r, { ry });
      }
      // flanking walls
      for (const s of [-1, 1]) {
        for (let i = 0; i < n; i++) {
          const h = TH * (i + 1) / n;
          const r = r0 + (r1 - r0) * ((i + 0.5) / n);
          const dr = (r1 - r0) / n;
          block('granite', 0.9, h + 0.5, dr + 0.04,
            ca * r - s * 4.6 * sa, 0, sa * r + s * 4.6 * ca, { ry });
        }
      }
    }
    gates.forEach(flight);

    /* ---------- monastery courtyard (vihara) ---------- */
    (function vihara(cx, cz) {
      block('stone', 30, 0.7, 27, cx, 0, cz);
      add('foliage', plane(17, 14), cx, 0.72, cz, { rx: -PI / 2 });
      // cells around the court
      for (let r = 0; r < 4; r++) {
        for (let i = 0; i < 7; i++) {
          const t = -10.5 + i * 3.5;
          const cw = 3.0, ch = 3.4;
          if (r === 0 || r === 3) {
            const z = cz + (r === 0 ? -10.6 : 10.6);
            block('granite', cw, ch, 4.4, cx + t, 0.7, z);
            add('dark', plane(1.2, 2.1), cx + t, 1.9, z + (r === 0 ? 2.22 : -2.22), { ry: r === 0 ? 0 : PI });
          } else if (i > 0 && i < 6) {
            const x = cx + (r === 1 ? -12.2 : 12.2);
            block('granite', 4.4, ch, cw, x, 0.7, cz + t);
            add('dark', plane(1.2, 2.1), x + (r === 1 ? 2.22 : -2.22), 1.9, cz + t, { ry: r === 1 ? PI / 2 : -PI / 2 });
          }
        }
      }
      // a small shrine in the court
      block('stone', 5.2, 0.6, 5.2, cx, 0.7, cz - 2);
      block('granite', 4.4, 3.2, 4.4, cx, 1.3, cz - 2);
      block('sandstoneBuff', 5.0, 0.5, 5.0, cx, 4.5, cz - 2);
      add('dark', plane(1.4, 2.0), cx, 2.4, cz + 0.25);
    })(-50, 4);

    /* ---------- votive stupas ---------- */
    function votive(x, z, s) {
      block('stone', 4.6 * s, 0.7 * s, 4.6 * s, x, 0, z);
      col('granite', 3.4 * s, 3.6 * s, 0.8 * s, x, 0.7 * s, z, 20);
      add('granite', dome(3.4 * s, 2.9 * s, 20), x, 1.5 * s, z);
      block('sandstoneBuff', 1.5 * s, 1.0 * s, 1.5 * s, x, 4.4 * s, z);
      add('stone', cyl(1.3 * s, 1.3 * s, 0.2 * s, 12), x, 5.5 * s, z);
      add('stone', cyl(0.9 * s, 0.9 * s, 0.18 * s, 12), x, 6.1 * s, z);
      add('stone', cyl(0.14 * s, 0.16 * s, 1.4 * s, 6), x, 6.9 * s, z);
    }
    [[-34, -34, 1.0], [-26, 34, 0.9], [34, -30, 1.0], [30, 36, 0.85],
      [-40, 22, 0.75], [44, 14, 0.8], [12, -44, 0.9], [-14, -46, 0.8]]
      .forEach(([x, z, s]) => votive(x, z, s));

    /* ---------- trees, lamps, visitors ---------- */
    const trees = [[-46, -22], [-38, -46], [-20, -58], [22, -54], [46, -18], [50, 26],
      [40, 52], [-30, 52], [-56, 34], [-64, 6], [58, -44], [-58, -40], [10, 60], [-8, -66]];
    trees.forEach(([x, z], i) => ctx.tree(x, z, 1.05 + (i % 3) * 0.2, i % 5 === 0 ? 'cypress' : 'round'));

    [[-8, 38], [8, 38], [-8, 52], [8, 52], [-34, 12], [34, 12], [-20, -34], [24, -32]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));

    const people = [[-3, 40, 'fabricSaffron'], [4, 42, 'fabricWhite'], [-10, 44, 'fabricRed'],
      [12, 40, 'fabricWhite'], [-16, 38, 'fabricSaffron'], [6, 48, 'fabricRed'],
      [22, 12, 'fabricWhite'], [-24, 14, 'fabricRed'], [0, 34, 'fabricWhite'],
      [-36, 40, 'fabricSaffron'], [18, -30, 'fabricWhite'], [-30, -26, 'fabricRed'],
      [2, 54, 'fabricWhite'], [-46, 16, 'fabricSaffron']];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 0.8, k, 1.0 + (i % 3) * 0.05));

    /* ---------- floodlights ---------- */
    ctx.light({ pos: [-38, 24, 46], target: [0, 18, 0], color: 0xffd2a0, intensity: 2400, distance: 300 });
    ctx.light({ pos: [42, 22, 34], target: [0, 18, 0], color: 0xffdcb4, intensity: 2000, distance: 300 });
    ctx.light({ pos: [4, 12, 60], target: [0, 12, 26], color: 0xffc890, intensity: 1500, distance: 180 });
  }
};
