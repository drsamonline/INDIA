/* Chhatrapati Shivaji Maharaj Terminus — Mumbai · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions (1 unit = 1 metre):
     main block            100.6 m long (330 ft), 180 ft high
     central clock tower   11.5 m square, dome apex 48.8 m (160 ft)
     statue of Progress    5.0 m (16 ft 6 in) — total 53.8 m
     clock face            3.2 m diameter (9–10 ft)
     corner pavilions      ribbed octagonal spires to 48.6 m
     three-storey arcade   cornice 21.5 m, gables 26.0 m
     great hall            25.0 × 23.2 × 12.8 m (82 × 76 × 42 ft)
*/

export default {
  id: 'csmt-mumbai',
  accent: '#c08a52',
  accent2: '#e8c088',
  seed: 71,
  floodScale: 0.26,
  time: 15.2,
  bounds: 110,
  minDist: 34,
  maxDist: 430,
  home: { pos: [78, 32, 103], target: [9, 26, -6], fov: 40 },
  ground: { texture: 'paving', size: 2800, color: 0x9c9a94 },
  views: [
    { name: 'Full', pos: [78, 32, 103], target: [9, 26, -6] },
    { name: 'West facade', pos: [4, 20, 82], target: [0, 22, 0] },
    { name: 'Dome and clock', pos: [24, 46, 56], target: [0, 40, 0] },
    { name: 'South pavilion', pos: [-64, 38, 62], target: [-45, 34, 0] },
    { name: 'Forecourt', pos: [-38, 6, 58], target: [0, 12, 16] }
  ],
  tour: [
    {
      title: 'Victoria Terminus', deva: 'छत्रपति शिवाजी महाराज टर्मिनस',
      text: 'The terminus was built in Bombay between 1878 and 1888 to a design by Frederick William Stevens, as headquarters of the Great Indian Peninsula Railway. It was named for Queen Victoria in her jubilee year.',
      pos: [58, 27, 98], target: [0, 20, 0], time: 16.2
    },
    {
      title: 'Gothic and Indian', deva: 'गॉथिक',
      text: 'Stevens fused Victorian Gothic with Indian palace architecture: pointed arches, flying buttresses, carved animals and gargoyles, on a plan laid out as a symmetrical cross with the platforms running east.',
      pos: [4, 14, 52], target: [0, 16, 0], time: 11
    },
    {
      title: 'The Stone Dome', deva: 'गुंबद',
      text: 'The ribbed stone dome sits over the crossing, crowned by a figure of Progress holding a torch. Peacocks, monkeys, lions and snakes are carved into the gables and turrets around it — a menagerie in stone.',
      pos: [14, 34, 40], target: [0, 30, 0], time: 15.4
    },
    {
      title: 'The Clock Tower', deva: 'घड़ी मीनार',
      text: 'The clock tower rises about 49 metres at the south-west corner, and the station clock still keeps time over the forecourt.',
      pos: [-38, 30, 74], target: [-18, 26, 0], time: 9.2
    },
    {
      title: 'Three Million a Day', deva: 'भीड़',
      text: 'It is one of the busiest railway stations in the world, handling more than three million passengers a day, and it remains the headquarters of the Central Railway.',
      pos: [-26, 5, 40], target: [0, 10, 10], time: 17.4
    },
    {
      title: 'A Working Monument', deva: 'रात्रि',
      text: 'In 2004 it became a UNESCO World Heritage Site, the first working railway station to be inscribed. It is floodlit every evening.',
      pos: [52, 24, 90], target: [0, 20, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus, lathe } = ctx;
    const PI = Math.PI;

    /* ---- materials: yellow Malad stone, white Porbunder detail, red
            sandstone banding, grey basalt, red tile roofs ------------------ */
    /* The station is Kurla stone: a warm buff-yellow limestone with white
       dressings and grey basalt in the plinth, under grey roofs. It was modelled
       in cream plaster with red tile roofs, which made a Gothic terminus look
       like an Italian villa. */
    const tint = (base, col, rough) => {
      const mm = ctx.mat(base);
      if (!mm || !mm.clone) return base;
      const c = mm.clone();
      c.color.setHex(col);
      if (rough !== undefined) c.roughness = rough;
      return c;
    };
    const ST = tint('cream', 0xd8bd88);           // Kurla stone — off an untextured base, or the map halves it
    const TR = 'white';                           // white stone dressings
    const RD = tint('cream', 0xb2946a);           // string courses, in a deeper stone
    const OP = 'dark';
    const RF = tint('cream', 0x6b6660, 0.9);      // grey roof, not red tile
    const IR = 'grey';

    /* ---- measured levels ------------------------------------------------ */
    const PL = 1.2;          // terrace under the building
    const L = 100;           // main block, 330 ft
    const D = 18;            // depth of the main range
    const ZF = 3.0;          // west facade plane
    const CORN = 21.5;       // cornice of the main range
    const GAB = 26.0;        // gable apexes
    const DOME_APEX = 48.8;  // 160 ft
    const STATUE = 53.8;     // + 16 ft 6 in figure of Progress
    const BAY = [9.28, 16.33, 23.38, 30.43, 37.48];
    const CPX = 45.5;        // corner pavilion centre, ±
    const DRUM_X = 23.38;    // the two flanking ribbed domes sit over bay 3

    const profAt = (p, t) => {
      let i = 0;
      while (i < p.length - 2 && t > p[i + 1][1]) i++;
      const a = p[i], b = p[i + 1];
      const k = (t - a[1]) / ((b[1] - a[1]) || 1);
      return a[0] + (b[0] - a[0]) * k;
    };

    /* an octagonal ribbed masonry dome, as on the crossing */
    const ribDome = (cx, cz, R, H, y0, ribKey) => {
      const p = [[1, 0], [0.995, 0.06], [0.975, 0.14], [0.94, 0.24], [0.885, 0.35],
        [0.815, 0.46], [0.725, 0.57], [0.615, 0.68], [0.49, 0.78], [0.355, 0.87],
        [0.215, 0.94], [0.09, 0.985], [0, 1]];
      add('marbleWarm', lathe(p.map(([r, y]) => [r * R, y * H]), 8), cx, y0, cz);
      const N = 10;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        for (let k = 0; k < N; k++) {
          const t0 = k / N, t1 = (k + 1) / N, tm = (t0 + t1) / 2;
          const r0 = profAt(p, t0) * R, r1 = profAt(p, t1) * R;
          const dr = r1 - r0, dy = (t1 - t0) * H;
          const len = Math.hypot(dr, dy) * 1.12;
          const rm = profAt(p, tm) * R;
          add(ribKey, box(0.5, len, 0.5),
            cx + Math.cos(a) * rm, y0 + tm * H, cz + Math.sin(a) * rm,
            { ry: PI / 2 - a, rx: Math.atan2(dr, dy) });
        }
      }
      // gargoyles at the springing, and a moulded band
      add(TR, cyl(R * 1.03, R * 1.06, 0.5, 8), cx, y0 + 0.2, cz);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2 + PI / 8;
        add('stone', box(0.55, 0.5, 1.5),
          cx + Math.cos(a) * (R + 0.5), y0 + 0.55, cz + Math.sin(a) * (R + 0.5),
          { ry: -a + PI / 2, rz: -0.12 });
      }
    };

    /* ---- the menagerie ---------------------------------------------------
       Stevens peopled the gables, capitals and spandrels with carved animals:
       lions, tigers, monkeys, peacocks, elephants and snakes. The page had
       none of them, which is the one thing that separates this building from
       any other Gothic terminus. Each is a handful of primitives, sized to
       read at 40 m and to be found at 8 m. */
    const beast = (kind, bx, by, bz, ry, sc = 1) => {
      const cs = Math.cos(ry), sn = Math.sin(ry);
      const put = (k, geo, lx, ly, lz, o) => {
        add(k, geo, bx + (lx * cs + lz * sn) * sc, by + ly * sc, bz + (-lx * sn + lz * cs) * sc,
          Object.assign({ ry }, o || {}));
      };
      if (kind === 'lion') {
        put(ST, box(0.86, 0.34, 0.32), 0, 0.30, 0);                 // body
        put(ST, sph(0.20, 8), 0.44, 0.40, 0);                       // head
        put(ST, box(0.20, 0.10, 0.26), 0.58, 0.36, 0);              // muzzle
        put(ST, cone(0.13, 0.22, 5), 0.34, 0.56, 0);                // mane crest
        for (const sx of [-0.28, 0.26]) for (const sz of [-0.13, 0.13]) {
          put(ST, cyl(0.045, 0.05, 0.24, 4), sx, 0.12, sz);         // legs
        }
        put(ST, cyl(0.035, 0.03, 0.44, 4), -0.44, 0.34, 0, { rz: 0.7 });  // tail
      } else if (kind === 'peacock') {
        put(ST, cyl(0.16, 0.20, 0.40, 6), 0, 0.34, 0, { rx: 0.3 });  // body
        put(ST, cyl(0.06, 0.07, 0.30, 5), 0.16, 0.56, 0, { rz: -0.5 }); // neck
        put(ST, sph(0.075, 8), 0.26, 0.68, 0);                      // head
        put(TR, cone(0.05, 0.12, 4), 0.28, 0.76, 0);                // crest
        put(TR, cyl(0.46, 0.46, 0.04, 14), -0.30, 0.44, 0, { rx: PI / 2, rz: 0.2 }); // tail fan
        for (let i = 0; i < 5; i++) {
          const a = -0.9 + i * 0.45;
          put(RD, box(0.05, 0.40, 0.03), -0.30 + Math.sin(a) * 0.22, 0.44 + Math.cos(a) * 0.22, 0.03);
        }
        put(ST, cyl(0.03, 0.03, 0.20, 4), 0, 0.12, 0.06);           // legs
        put(ST, cyl(0.03, 0.03, 0.20, 4), 0, 0.12, -0.06);
      } else if (kind === 'monkey') {
        put(ST, sph(0.17, 8), 0, 0.30, 0, { sy: 1.3 });              // seated body
        put(ST, sph(0.13, 8), 0, 0.52, 0.02);                        // head
        put(ST, sph(0.06, 6), 0, 0.46, 0.10);                        // muzzle
        put(ST, cyl(0.035, 0.03, 0.34, 4), -0.16, 0.34, -0.04, { rz: 0.9 }); // tail
        put(ST, cyl(0.035, 0.03, 0.22, 4), -0.26, 0.20, -0.02, { rz: 0.2 });
        put(ST, cyl(0.03, 0.03, 0.16, 4), 0.12, 0.16, 0.08, { rx: 0.6 });   // arm
      } else if (kind === 'elephant') {
        put(ST, box(0.86, 0.44, 0.40), 0, 0.36, 0);                  // body
        put(ST, sph(0.22, 8), 0.46, 0.40, 0);                        // head
        put(ST, cyl(0.05, 0.08, 0.30, 5), 0.58, 0.24, 0, { rz: 0.5 });  // trunk
        put(ST, box(0.20, 0.22, 0.06), 0.42, 0.44, 0.20);            // ears
        put(ST, box(0.20, 0.22, 0.06), 0.42, 0.44, -0.20);
        for (const sx of [-0.26, 0.26]) for (const sz of [-0.14, 0.14]) {
          put(ST, cyl(0.06, 0.065, 0.26, 4), sx, 0.13, sz);
        }
      } else {                                                        // snake
        for (let i = 0; i < 4; i++) {
          put(ST, cyl(0.09, 0.11, 0.16, 6), -0.24 + i * 0.16, 0.16 + i * 0.10, 0, { rz: 0.6 });
        }
        put(ST, sph(0.10, 8), 0.28, 0.52, 0, { sx: 1.4, sy: 0.7 });
      }
    };
    const BESTIARY = ['lion', 'peacock', 'monkey', 'elephant', 'snake'];

    /* a crocketed gable: tympanum of stacked boxes behind two raking edges */
    const gable = (cx, cy, cz, w, h, dep, key, trim) => {
      const steps = 5;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        block(key, w * (1 - t), h / steps, dep, cx, cy + (i * h) / steps, cz);
      }
      const half = w / 2, rake = Math.atan2(h, half), len = Math.hypot(half, h);
      [-1, 1].forEach((s) => {
        add(key, box(len * 1.04, 0.46, dep + 0.3),
          cx + s * half / 2, cy + h / 2, cz, { rz: -s * rake });
        add(trim, box(len * 1.04, 0.13, dep + 0.44),
          cx + s * half / 2, cy + h / 2 + 0.2, cz, { rz: -s * rake });
        // crockets up the rake
        for (let k = 1; k <= 3; k++) {
          const t = k / 3.6;
          add(key, cone(0.17, 0.5, 4),
            cx + s * half * (1 - t), cy + h * t + 0.15, cz + dep / 2 + 0.1, { rz: -s * 0.5 });
        }
      });
      add(trim, box(0.34, 0.9, 0.34), cx, cy + h + 0.35, cz);
      add(trim, cone(0.3, 0.62, 4), cx, cy + h + 1.1, cz);
    };

    /* a lancet with a carved surround */
    const lancet = (x, y, z, w, h, ry = 0) => {
      add(OP, arch(w, h, 0.16), x, y, z, { ry });
      add(TR, archFrame(w + 0.5, h + 0.22, 0.22, 0.34), x, y, z + 0.02, { ry });
    };

    /* ---- terrace --------------------------------------------------------- */
    block('stone', 132, PL, 40, 0, 0, -6);
    add('paving', box(132, 0.16, 40), 0, PL, -6);

    /* ---- the main range, 100 m long -------------------------------------- */
    block(ST, L, CORN - PL, D, 0, PL, ZF - D / 2);
    [8.0, 14.8].forEach((y) => add(TR, box(L + 0.7, 0.36, D + 0.7), 0, y, ZF - D / 2));
    // cornice, parapet, and the red tile roof behind
    add(TR, box(L + 1.8, 1.1, D + 1.8), 0, CORN - 0.55, ZF - D / 2);
    add(ST, box(L + 0.8, 1.5, D + 0.8), 0, CORN + 0.55, ZF - D / 2);
    block(RF, L - 3, 0.9, D - 5, 0, CORN + 1.25, ZF - D / 2 - 2.5);
    add(RD, box(L - 3, 0.4, 0.7), 0, CORN + 2.2, ZF - D / 2 - 2.5);

    /* ---- ten gabled bays: three-storey arcade ---------------------------- */
    BAY.forEach((bx, BI) => {
      [-1, 1].forEach((s) => {
        const x = s * bx;
        // ground: a deep arcade, two wide arches per bay
        [-1.78, 1.78].forEach((o) => {
          add(OP, arch(2.7, 7.4, 0.3), x + o, PL, ZF - 0.1);
          add(TR, archFrame(3.25, 7.9, 0.3, 0.42), x + o, PL, ZF + 0.02);
        });
        // first floor: one arcaded window
        lancet(x, 9.3, ZF + 0.03, 2.1, 3.7);
        // second floor: a smaller one
        lancet(x, 15.6, ZF + 0.03, 1.8, 3.4);
        // a rose window under the gable
        add(OP, cyl(0.78, 0.78, 0.2, 14), x, 20.2, ZF + 0.1, { rx: PI / 2 });
        add(TR, cyl(0.94, 0.94, 0.1, 14), x, 20.2, ZF + 0.02, { rx: PI / 2 });
        add(RD, box(6.0, 0.34, 0.5), x, 19.9, ZF + 0.1);
        // gable
        gable(x, CORN + 1.3, ZF - 0.4, 6.6, 3.5, 1.1, ST, TR);
        // the beast at the apex of each gable
        beast(BESTIARY[(BI + s + 8) % BESTIARY.length], x, CORN + 4.9, ZF + 0.2, 0, 0.85);
        // buttress piers between the bays
        add(ST, box(0.9, CORN - PL - 1.0, 1.0), x + s * 3.4, PL, ZF + 0.3);
        add(TR, box(1.2, 0.4, 1.3), x + s * 3.4, CORN - 1.1, ZF + 0.3);
      });
    });

    /* ---- the two flanking ribbed domes ----------------------------------- */
    [-1, 1].forEach((s) => {
      const x = s * DRUM_X;
      add(ST, cyl(5.0, 5.4, 4.0, 8), x, CORN + 1.0, ZF - D / 2);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        add(OP, box(1.3, 2.4, 0.2), x + Math.cos(a) * 5.2, CORN + 2.4, ZF - D / 2 + Math.sin(a) * 5.2, { ry: -a });
      }
      add(TR, cyl(5.9, 5.9, 0.5, 8), x, CORN + 4.8, ZF - D / 2);
      ribDome(x, ZF - D / 2, 5.6, 7.0, CORN + 5.1, ST);
      add(ST, cyl(0.85, 1.05, 1.5, 8), x, CORN + 12.0, ZF - D / 2);
      add('dark', cyl(0.72, 0.72, 0.9, 8), x, CORN + 12.3, ZF - D / 2);
      add('gold', sph(0.3, 10), x, CORN + 13.7, ZF - D / 2);
    });

    /* ---- the central clock tower ----------------------------------------- */
    (function tower() {
      const cz = 2.0, TZ = 8.0;   // tower centre, front face
      // shaft, 11.5 m square, to 20.2 m
      block(ST, 11.5, 19.0, 12, 0, PL, cz);
      // the great entrance arch
      add(OP, arch(6.0, 13.0, 0.5), 0, PL, TZ - 0.1);
      add(TR, archFrame(6.9, 13.7, 0.45, 0.55), 0, PL, TZ + 0.05);
      add(RD, box(8.0, 0.45, 0.7), 0, PL + 14.3, TZ + 0.2);
      // a beast in each spandrel of the great arch
      beast('lion', -4.4, PL + 10.6, TZ + 0.1, 0, 1.0);
      beast('peacock', 4.4, PL + 10.6, TZ + 0.1, PI, 1.0);
      // corner buttresses, full height of the shaft
      [-1, 1].forEach((s) => {
        add(ST, cyl(1.25, 1.45, 20.5, 8), s * 5.3, PL, TZ - 1.2);
        add(TR, cyl(1.55, 1.55, 0.45, 8), s * 5.3, 20.0, TZ - 1.2);
        add(ST, cyl(1.2, 1.3, 4.2, 8), s * 5.3, 20.4, TZ - 1.2);
        add('marbleWarm', onion(1.15, 2.4, 14), s * 5.3, 24.5, TZ - 1.2);
        add('gold', sph(0.22, 8), s * 5.3, 27.1, TZ - 1.2);
      });
      // string courses up the shaft
      [7.4, 13.6, 19.4].forEach((y) => add(TR, box(12.0, 0.4, 12.5), 0, y, cz));

      // clock stage, 20.2 → 29.7
      block(ST, 11.0, 9.5, 11.5, 0, 20.2, cz);
      add(TR, box(11.8, 0.6, 12.3), 0, 20.2, cz);
      add(RD, box(11.6, 0.45, 12.1), 0, 28.9, cz);
      const cy = 25.3, cf = 5.52, cb = 5.77;
      [[0, cb, 0], [0, -cb, PI], [cf, 0, PI / 2], [-cf, 0, -PI / 2]].forEach(([dx, dz, ry]) => {
        add('plasterWhite', cyl(1.6, 1.6, 0.2, 24), dx, cy, cz + dz, { rx: PI / 2, ry });
        add(RD, cyl(1.75, 1.75, 0.12, 24), dx, cy, cz + dz, { rx: PI / 2, ry });
        // hands, standing proud of the face
        add('black', box(0.16, 1.35, 0.1), dx * 1.03, cy + 0.55, cz + dz * 1.03, { ry });
        add('black', box(1.15, 0.16, 0.1), dx * 1.03 + (ry === 0 ? 0.55 : 0), cy - 0.15, cz + dz * 1.03, { ry });
        // a niche under the clock, where the Queen Victoria figure stood
        add(OP, arch(1.3, 2.4, 0.2), dx * 0.99, 21.2, cz + dz * 0.99, { ry });
        add(TR, archFrame(1.7, 2.7, 0.16, 0.24), dx * 0.99, 21.2, cz + dz * 1.01, { ry });
      });

      // belfry stage with paired lancets and a rose window, 29.7 → 35.1
      block(ST, 9.6, 5.4, 10.0, 0, 29.7, cz);
      add(TR, box(10.4, 0.5, 10.8), 0, 29.7, cz);
      add(TR, box(10.4, 0.5, 10.8), 0, 34.6, cz);
      [[0, 5.0, 0], [0, -5.0, PI], [4.8, 0, PI / 2], [-4.8, 0, -PI / 2]].forEach(([dx, dz, ry]) => {
        add(OP, cyl(1.0, 1.0, 0.18, 16), dx * 0.99, 32.9, cz + dz * 0.99, { rx: PI / 2, ry });
        add(TR, cyl(1.18, 1.18, 0.1, 16), dx * 0.99, 32.9, cz + dz * 1.01, { rx: PI / 2, ry });
        [-1.15, 1.15].forEach((o) => {
          add(OP, arch(1.15, 2.5, 0.2), dx * 0.99 + (ry === 0 ? o : 0), 30.4, cz + dz * 0.99 + (ry === 0 ? 0 : o), { ry });
          add(TR, archFrame(1.55, 2.85, 0.16, 0.26), dx * 0.99 + (ry === 0 ? o : 0), 30.4, cz + dz * 1.0 + (ry === 0 ? 0 : o), { ry });
        });
      });
      // pinnacles at the four corners of the belfry
      [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => {
        add(ST, cyl(0.62, 0.78, 4.4, 8), sx * 4.6, 34.9, cz + sz * 4.8);
        add(TR, cone(0.82, 2.0, 8), sx * 4.6, 39.3, cz + sz * 4.8);
        add('gold', sph(0.16, 8), sx * 4.6, 40.5, cz + sz * 4.8);
      }));

      // octagonal drum with two levels of stained glass, 35.1 → 39.3
      add(ST, cyl(5.4, 5.7, 4.2, 8), 0, 35.1, cz);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        add('glass', box(1.5, 3.0, 0.16), Math.cos(a) * 5.55, 37.2, cz + Math.sin(a) * 5.55, { ry: -a });
        add(TR, box(1.9, 0.22, 0.26), Math.cos(a) * 5.5, 35.9, cz + Math.sin(a) * 5.5, { ry: -a });
        add(TR, box(1.9, 0.22, 0.26), Math.cos(a) * 5.5, 38.4, cz + Math.sin(a) * 5.5, { ry: -a });
      }
      add(TR, cyl(6.1, 6.1, 0.5, 8), 0, 39.3, cz);

      // the ribbed stone dome, 39.3 → 47.4, then the lantern
      ribDome(0, cz, 5.8, 7.4, 39.5, ST);
      add(ST, cyl(1.25, 1.5, 1.5, 8), 0, 46.9, cz);
      add(TR, cyl(1.55, 1.55, 0.25, 8), 0, 48.4, cz);
      add('gold', sph(0.5, 12), 0, 48.8, cz);

      // the figure of Progress, torch raised
      const sy = 48.8;
      add('bronze', cyl(1.0, 1.25, 0.5, 8), 0, sy, cz);
      add('bronze', cyl(0.55, 0.95, 2.4, 10), 0, sy + 0.5, cz);
      add('bronze', sph(0.42, 10), 0, sy + 3.05, cz);
      add('bronze', cyl(0.14, 0.16, 1.5, 6), 0.45, sy + 2.6, cz, { rz: -0.42 });
      add('gold', cone(0.3, 0.8, 8), 0.98, sy + 4.1, cz);
      add('bronze', box(0.9, 1.4, 0.12), 0, sy + 2.0, cz, { rz: 0.1 });
    })();

    /* ---- the corner pavilions, ribbed octagonal spires ------------------- */
    [-1, 1].forEach((s) => {
      const x = s * CPX;
      // gabled pavilion
      block(ST, 9.0, 20.8, 12, x, PL, ZF - 4);
      [7.0, 13.4].forEach((y) => add(TR, box(9.4, 0.4, 12.4), x, y, ZF - 4));
      add(OP, arch(3.0, 8.0, 0.3), x, PL, ZF + 2.05);
      add(TR, archFrame(3.7, 8.6, 0.32, 0.44), x, PL, ZF + 2.15);
      lancet(x, 9.6, ZF + 2.05, 2.0, 3.4);
      lancet(x, 15.4, ZF + 2.05, 1.6, 2.6);
      [-1, 1].forEach((sz) => {
        [-2.2, 2.2].forEach((o) => {
          add(OP, arch(2.2, 6.2, 0.2), x + sz * 4.55, PL, ZF - 4 + o, { ry: sz * PI / 2 });
          add(TR, archFrame(2.6, 6.6, 0.24, 0.32), x + sz * 4.55, PL, ZF - 4 + o, { ry: sz * PI / 2 });
        });
        lancet(x + sz * 4.55, 9.6, ZF - 4, 1.7, 3.0, sz * PI / 2);
        lancet(x + sz * 4.55, 15.4, ZF - 4, 1.5, 2.6, sz * PI / 2);
      });
      gable(x, CORN + 0.6, ZF + 1.7, 6.8, 3.8, 1.1, ST, TR);
      // the turret: square stage, octagonal drum, ribbed spire
      block(ST, 7.4, 8.0, 8.4, x, 22.2, ZF - 4);
      add(TR, box(8.0, 0.5, 9.0), x, 22.2, ZF - 4);
      add(TR, box(8.0, 0.5, 9.0), x, 29.7, ZF - 4);
      [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => {
        add(ST, cyl(0.5, 0.62, 3.4, 8), x + sx * 3.2, 30.0, ZF - 4 + sz * 3.6);
        add(TR, cone(0.66, 1.5, 8), x + sx * 3.2, 33.4, ZF - 4 + sz * 3.6);
      }));
      add(ST, cyl(4.0, 4.05, 4.6, 8), x, 30.2, ZF - 4);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        add(OP, box(1.2, 2.4, 0.16), x + Math.cos(a) * 4.25, 32.2, ZF - 4 + Math.sin(a) * 4.25, { ry: -a });
      }
      add(TR, cyl(4.0, 4.0, 0.45, 8), x, 34.8, ZF - 4);
      // the spire: 5.0 → 0.9 over 11 m, ribbed
      const p = [[1, 0], [0.965, 0.18], [0.885, 0.37], [0.775, 0.55], [0.635, 0.71],
        [0.47, 0.84], [0.3, 0.93], [0.14, 0.98], [0.03, 1]];
      add(ST, lathe(p.map(([r, y]) => [r * 3.6, y * 11.6]), 8), x, 35.2, ZF - 4);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        for (let k = 0; k < 7; k++) {
          const t0 = k / 7, t1 = (k + 1) / 7, tm = (t0 + t1) / 2;
          const r0 = profAt(p, t0) * 3.6, r1 = profAt(p, t1) * 3.6;
          const dr = r1 - r0, dy = (t1 - t0) * 11.0;
          add(TR, box(0.34, Math.hypot(dr, dy) * 1.18, 0.34),
            x + Math.cos(a) * profAt(p, tm) * 3.6, 35.2 + tm * 11.6,
            ZF - 4 + Math.sin(a) * profAt(p, tm) * 3.6,
            { ry: PI / 2 - a, rx: Math.atan2(dr, dy) });
        }
      }
      add('gold', sph(0.42, 10), x, 46.9, ZF - 4);
      add('bronze', cone(0.19, 1.7, 6), x, 48.0, ZF - 4);
    });

    /* ---- the wings that make the C, and the platform range behind -------- */
    [-1, 1].forEach((s) => {
      block(ST, 16, CORN - PL, 34, s * (L / 2 - 8), PL, ZF - D - 17);
      add(TR, box(16.6, 1.0, 34.6), s * (L / 2 - 8), CORN - 0.5, ZF - D - 17);
      block(RF, 14, 3.4, 30, s * (L / 2 - 8), CORN + 0.6, ZF - D - 17);
      for (let i = 0; i < 6; i++) {
        add(OP, arch(2.2, 6.0, 0.2), s * (L / 2 - 8) + (i - 2.5) * 2.6 * 0, PL, ZF - D - 34 + i * 5.4);
      }
    });

    // the platform range: 100 m of shed behind, as the plan demands
    block('plaster', 100, 13, 30, 0, 0, -34);
    add(RF, box(102, 0.6, 32), 0, 13, -34);
    add(TR, box(102, 0.4, 32), 0, 13.5, -34);
    for (let i = 0; i < 12; i++) {
      add(IR, cyl(0.24, 0.3, 7.0, 6), -46 + i * 8.4, 0, -22);
      add(IR, cyl(0.24, 0.3, 7.0, 6), -46 + i * 8.4, 0, -30);
    }
    add(IR, box(100, 0.6, 12), 0, 7.0, -26);
    add(TR, box(101, 0.4, 12.6), 0, 7.6, -26);

    /* ---- forecourt: trees, lamps, people --------------------------------- */
    const people = [[-14, 26], [10, 28], [-6, 24], [18, 25], [0, 32], [-20, 22], [22, 22], [-9, 34],
      [7, 35], [-16, 36], [14, 36], [2, 22], [-2, 27], [26, 30], [-26, 30]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-44, 30], [44, 30], [-24, 40], [24, 40], [0, 42]].forEach(([x, z]) => ctx.lamp(x, z, 5.0, 'black'));
    // the row of trees along the forecourt, as in the photograph
    [[-46, 27], [-34, 26], [-22, 25], [-10, 24], [10, 24], [22, 25], [34, 26], [46, 27],
      [-52, 40], [52, 40], [-30, 48], [30, 48], [-6, 50], [18, 50]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.25 + (i % 3) * 0.16, 'round'));
    [[-60, 16], [60, 16]].forEach(([x, z]) => ctx.tree(x, z, 1.9, 'palm'));

    ctx.light({ pos: [-46, 26, 46], target: [0, 26, 0], color: 0xffd0a0, intensity: 5200, distance: 260 });
    ctx.light({ pos: [46, 26, 42], target: [0, 26, 0], color: 0xffc890, intensity: 4400, distance: 260 });
    ctx.light({ pos: [0, 44, 60], target: [0, 34, 0], color: 0xfff0d0, intensity: 3600, distance: 240 });
  }
};
