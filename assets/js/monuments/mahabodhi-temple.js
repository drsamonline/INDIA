/* Mahabodhi Temple — Bodh Gaya · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions (1 unit = 1 metre):
     total height to the finial tip   52.0 m   (sources 50–55 m)
     basement of the temple           30 m square
     sikhara springing                11.0 m, 24.5 m square
     sikhara neck                     44.0 m, 7.6 m square — taper to 0.31
     crown (collar, banded drum, finial) 44.0 → 52.0 m
     seven storeys marked by bhumi-amalakas, pancharatha plan
     four corner shrines (panchayatana), vedika railing 2.1 m
*/

export default {
  id: 'mahabodhi-temple',
  accent: '#c8b49a',
  accent2: '#e8d8c0',
  seed: 73,
  floodScale: 0.26,
  time: 15.4,
  bounds: 60,
  minDist: 14,
  maxDist: 220,
  home: { pos: [-58, 31, 88], target: [6, 23, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8f9a66, tile: 16 },
  views: [
    { name: 'Full', pos: [-58, 31, 88], target: [6, 23, 0] },
    { name: 'The tower', pos: [-12, 22, 30], target: [0, 26, 0] },
    { name: 'Crown', pos: [-16, 46, 20], target: [0, 45, 0] },
    { name: 'From the east', pos: [4, 13, 46], target: [0, 18, 0] },
    { name: 'Bodhi tree', pos: [-8, 9, 22], target: [-20, 11, -4] }
  ],
  tour: [
    {
      title: 'Where the Buddha Woke', deva: 'महाबोधि मंदिर',
      text: 'The Mahabodhi Temple at Bodh Gaya stands beside the tree the tradition names as the place of the Buddha\'s enlightenment. Ashoka built a shrine here in the 3rd century BCE; the present temple is usually dated to the 5th or 6th century CE.',
      pos: [-38, 21, 58], target: [0, 22, 0], time: 16.8
    },
    {
      title: 'Brick and Plaster', deva: 'ईंट',
      text: 'The tower rises about 52 metres, straight-sided and tapering, built of brick under plaster, its faces crowded with niches holding images of the Buddha. It is one of the oldest brick temples surviving in India.',
      pos: [-8, 22, 22], target: [0, 26, 0], time: 12
    },
    {
      title: 'The Vajrasana', deva: 'वज्रासन',
      text: 'Inside, a polished stone seat, the vajrasana, marks the place of enlightenment. The shrine has been in continuous worship for more than a thousand years.',
      pos: [26, 12, 30], target: [0, 18, 0], time: 9.6
    },
    {
      title: 'The Bodhi Tree', deva: 'बोधि वृक्ष',
      text: 'To the west stands a descendant of the original pipal tree, grown from a cutting Ashoka\'s daughter Sanghamitta carried to Sri Lanka and brought back. Pilgrims circle it on a raised platform.',
      pos: [-14, 8, 6], target: [-12, 10, -8], time: 17.2
    },
    {
      title: 'The Stone Railing', deva: 'वेदिका',
      text: 'A carved stone railing surrounds the site, parts of it from the Mauryan period and among the oldest sculpture in India.',
      pos: [16, 5, 20], target: [4, 4, 2], time: 10.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'The temple was inscribed as a UNESCO World Heritage Site in 2002. At night it is lit for the pilgrims who keep arriving through the evening.',
      pos: [-34, 19, 52], target: [0, 22, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, torus, lathe } = ctx;
    const PI = Math.PI;

    const PL = 'plaster';          // the plastered brick surface
    const PW = 'ivory';
    const STN = 'stone';           // the carved railing
    const SB = 'cream';            // the stone trim, one tone off the plaster
    const OP = 'dark';

    /* ---- measured levels ------------------------------------------------ */
    const TER = 0.9;      // paved terrace of the complex
    const BASE_TOP = 4.6; // basement
    const FRIEZE = 10.2;  // top of the Buddha-niche storey
    const SH0 = 11.0;     // sikhara springs
    const SH1 = 44.0;     // sikhara neck
    const TOP = 52.0;     // finial tip
    const BW = 30.0;      // basement, square
    const FW = 27.5;      // frieze storey, square
    const S0 = 24.5;      // sikhara at its base
    const S1 = 7.6;       // sikhara at its neck

    /* the sikhara profile: straight-edged pyramidal, a slight swell at the
       foot and a quick draw-in at the neck, as in the photograph */
    const PROF = [[1.000, 0.00], [1.006, 0.06], [0.982, 0.15], [0.920, 0.30],
      [0.856, 0.45], [0.788, 0.60], [0.726, 0.72], [0.660, 0.84],
      [0.590, 0.93], [0.400, 1.00]];
    const profAt = (p, t) => {
      let i = 0;
      while (i < p.length - 2 && t > p[i + 1][1]) i++;
      const a = p[i], b = p[i + 1];
      const k = (t - a[1]) / ((b[1] - a[1]) || 1);
      return a[0] + (b[0] - a[0]) * k;
    };
    const widthAt = (t) => S0 * profAt(PROF, t);

    /* ---- the terrace and the vedika railing ------------------------------ */
    block('stone', 74, TER, 76, 0, 0, -2);
    add('paving', box(73, 0.14, 75), 0, TER, -2);

    (function vedika() {
      const X = 30, Z0 = -26, Z1 = 26, h = 2.1;
      // posts and rails on all four sides, with lotus medallions
      const runX = (z) => {
        for (let i = 0; i <= 24; i++) {
          const x = -X + i * (2 * X / 24);
          add(STN, box(0.62, h, 0.62), x, TER, z);
          add(STN, box(0.72, 0.22, 1.15), x, TER + h, z);
          if (i % 2 === 0) add(PL, cyl(0.26, 0.26, 0.1, 10), x, TER + h * 0.5, z + 0.32, { rx: PI / 2 });
        }
        add(STN, box(2 * X, 0.3, 0.34), 0, TER + h * 0.44, z);
        add(STN, box(2 * X, 0.3, 0.34), 0, TER + h * 0.78, z);
      };
      const runZ = (x) => {
        for (let i = 0; i <= 21; i++) {
          const z = Z0 + i * ((Z1 - Z0) / 21);
          add(STN, box(0.62, h, 0.62), x, TER, z);
          add(STN, box(1.15, 0.22, 0.72), x, TER + h, z);
          if (i % 2 === 0) add(PL, cyl(0.26, 0.26, 0.1, 10), x + 0.32, TER + h * 0.5, z, { rz: PI / 2 });
        }
        add(STN, box(0.34, 0.3, Z1 - Z0), x, TER + h * 0.44, (Z0 + Z1) / 2);
        add(STN, box(0.34, 0.3, Z1 - Z0), x, TER + h * 0.78, (Z0 + Z1) / 2);
      };
      runX(Z1); runX(Z0); runZ(-X); runZ(X);
    })();

    /* ---- the temple: basement and the frieze of Buddha niches ------------ */
    block(PL, BW, BASE_TOP - TER, BW, 0, TER, 0);
    // mouldings of the low basement
    [TER + 0.5, TER + 1.5, BASE_TOP - 0.45].forEach((y) => add(PW, box(BW + 0.6, 0.3, BW + 0.6), 0, y, 0));
    block(PW, FW, 0.5, FW, 0, BASE_TOP, 0);

    // the niche storey: tall pointed niches holding seated Buddhas
    block(PL, FW, FRIEZE - BASE_TOP - 0.5, FW, 0, BASE_TOP + 0.5, 0);
    (function frieze() {
      const n = 9, half = FW / 2;
      const put = (x, z, ry) => {
        add(OP, arch(1.25, 3.1, 0.24), x, BASE_TOP + 0.9, z, { ry });
        add(SB, archFrame(1.7, 3.45, 0.2, 0.3), x, BASE_TOP + 0.9, z, { ry });
        add('gold', box(0.34, 0.9, 0.1), x, BASE_TOP + 1.9, z + 0.16, { ry });
      };
      for (let i = 0; i < n; i++) {
        const o = (i - (n - 1) / 2) * (FW / n);
        put(o, half + 0.02, 0);
        put(o, -half - 0.02, PI);
        put(half + 0.02, o, PI / 2);
        put(-half - 0.02, o, -PI / 2);
      }
    })();
    add(PW, box(FW + 0.9, 0.55, FW + 0.9), 0, FRIEZE - 0.3, 0);
    block(PW, FW + 0.2, 0.5, FW + 0.2, 0, FRIEZE + 0.25, 0);

    /* ---- the sikhara -----------------------------------------------------
       A smooth four-sided taper: one lathe with four segments carries the
       whole profile, so the faces are continuous ramps rather than a
       staircase of blocks. The pancharatha plan is then drawn on with four
       face-centre ribs and four corner ribs, and the storeys are marked by
       horizontal bands and bhumi-amalakas. */
    const TIERS = 26;
    const NS = 40;
    const R4 = (w) => w / Math.SQRT2;   // corner radius of a square lathe
    const sikhara = [];
    for (let i = 0; i <= NS; i++) {
      const t = i / NS;
      sikhara.push([R4(widthAt(t)), SH0 + t * (SH1 - SH0)]);
    }
    add(PL, lathe(sikhara, 4), 0, 0, 0, { ry: PI / 4 });

    // horizontal banding, and the seven bhumi-amalaka storey lines
    for (let i = 1; i < TIERS; i++) {
      const t = i / TIERS;
      const w = widthAt(t);
      const y = SH0 + t * (SH1 - SH0);
      add(PL, box(w + 0.07, 0.11, w + 0.07), 0, y, 0);
      if (i % 4 === 0) {
        add(PW, box(w + 0.26, 0.22, w + 0.26), 0, y, 0);
        for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          add(PW, cyl(0.5, 0.5, 0.2, 10), sx * (w / 2 + 0.02), y + 0.1, sz * (w / 2 + 0.02));
        }
      }
    }

    // the ribs: three per face and one at each corner, following the taper
    const ridge = (az, off, key, thick) => {
      const N = 18;
      for (let k = 0; k < N; k++) {
        const t0 = k / N, t1 = (k + 1) / N, tm = (t0 + t1) / 2;
        const w0 = widthAt(t0), w1 = widthAt(t1);
        const r0 = w0 / 2 + off, r1 = w1 / 2 + off;
        const dy = (t1 - t0) * (SH1 - SH0);
        const dr = r1 - r0;
        const rm = widthAt(tm) / 2 + off;
        add(key, box(thick, Math.hypot(dr, dy) * 1.12, thick),
          Math.cos(az) * rm, SH0 + tm * (SH1 - SH0), Math.sin(az) * rm,
          { ry: PI / 2 - az, rx: Math.atan2(dr, dy) });
      }
    };
    for (let f = 0; f < 4; f++) {
      const a = (f / 4) * PI * 2;
      ridge(a, 0.1, PL, 0.55);           // the central ratha of each face
      ridge(a + PI / 4, 0.16, PL, 0.46);  // the corner, at the diagonal
    }

    // niches: vertical columns of Buddha images up every face
    for (let i = 2; i < TIERS - 2; i++) {
      const t = (i + 0.5) / TIERS;
      const w = widthAt(t);
      const y = SH0 + t * (SH1 - SH0);
      const hy = Math.min(0.95, w * 0.045);
      for (let f = 0; f < 4; f++) {
        const a = (f / 4) * PI * 2;
        [-0.3, 0, 0.3].forEach((o) => {
          const px = Math.cos(a) * (w / 2 + 0.06) - Math.sin(a) * o * w;
          const pz = Math.sin(a) * (w / 2 + 0.06) + Math.cos(a) * o * w;
          add(OP, box(0.34, hy, 0.1), px, y, pz, { ry: PI / 2 - a });
        });
      }
    }

    /* ---- the rounded crown ---------------------------------------------- */
    const wTop = widthAt(1.0);
    add(PW, cyl(wTop * 0.56, wTop * 0.48, 0.9, 16), 0, SH1 + 0.45, 0);
    // the flared ribbed collar
    add(SB, lathe([[wTop * 0.36, 0], [wTop * 0.55, 0.35], [wTop * 0.57, 0.8],
      [wTop * 0.5, 1.2], [wTop * 0.38, 1.55]], 20), 0, SH1 + 0.9, 0);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * PI * 2;
      add(SB, box(0.34, 0.5, 0.9), Math.cos(a) * wTop * 0.52, SH1 + 1.35,
        Math.sin(a) * wTop * 0.52, { ry: -a, rz: 0.5 });
    }
    // the banded drum
    const drumR = wTop * 0.38;
    add(PW, cyl(drumR * 0.92, drumR, 2.5, 18), 0, SH1 + 3.5, 0);
    [0.5, 1.05, 1.6, 2.15].forEach((d) => add(SB, cyl(drumR * 0.95, drumR * 0.95, 0.16, 18), 0, SH1 + 3.2 + d, 0));
    // the rounded crown proper
    add(PW, dome(drumR * 0.94, 1.5, 18), 0, SH1 + 4.75, 0);
    add(SB, cyl(drumR * 0.5, drumR * 0.72, 0.5, 14), 0, SH1 + 6.2, 0);
    // the chatravali: stacked rings, tapering to a point
    const fy = SH1 + 6.7;
    const rings = [[1.05, 0.5], [0.92, 0.5], [0.78, 0.48], [0.63, 0.45], [0.48, 0.42], [0.34, 0.38]];
    let ry = fy;
    rings.forEach(([r, h]) => {
      add(SB, cyl(r * 1.06, r, h, 12), 0, ry + h / 2, 0);
      add('gold', cyl(r * 0.55, r * 0.7, h * 0.4, 10), 0, ry + h / 2, 0);
      ry += h;
    });
    add('gold', cone(0.3, 1.1, 10), 0, ry + 0.55, 0);
    add('gold', sph(0.2, 10), 0, ry + 1.15, 0);

    /* ---- the four corner shrines (panchayatana) ------------------------- */
    const cornerShrine = (sx, sz) => {
      const cx = sx * 12.2, cz = sz * 12.2;
      block(PL, 5.0, 7.6, 5.0, cx, BASE_TOP, cz);
      add(PW, box(5.5, 0.4, 5.5), cx, BASE_TOP + 7.4, cz);
      add(OP, arch(1.4, 2.6, 0.2), cx, BASE_TOP + 0.6, cz + sz * 2.55, { ry: sz > 0 ? 0 : PI });
      // a miniature sikhara
      let y = BASE_TOP + 7.8, w = 4.6;
      for (let i = 0; i < 8; i++) {
        const k = i / 8;
        add(PL, box(w, 0.95, w), cx, y, cz);
        add(SB, box(w * 0.5, 0.95, w + 0.3), cx, y + 0.475, cz);
        add(SB, box(w + 0.3, 0.95, w * 0.5), cx, y + 0.475, cz);
        y += 0.95;
        w *= 0.87;
      }
      add(PW, cyl(w * 0.7, w * 0.9, 0.4, 12), cx, y + 0.2, cz);
      add(PW, dome(w * 0.62, 0.8, 12), cx, y + 0.4, cz);
      add('gold', sph(0.24, 8), cx, y + 1.4, cz);
      add('gold', cone(0.14, 0.7, 6), cx, y + 1.9, cz);
    };
    cornerShrine(-1, -1); cornerShrine(1, -1); cornerShrine(-1, 1); cornerShrine(1, 1);

    /* ---- the entrance porch on the east face ---------------------------- */
    block(PL, 9.0, 7.4, 3.2, 0, BASE_TOP, 15.6);
    add(PW, box(9.6, 0.5, 3.6), 0, BASE_TOP + 7.4, 15.6);
    add(OP, arch(3.2, 5.6, 0.3), 0, TER, 17.2);
    add(SB, archFrame(4.0, 6.2, 0.34, 0.4), 0, TER, 17.25);
    block(PW, 8.0, 1.2, 3.0, 0, BASE_TOP + 7.9, 15.6);
    add(SB, box(8.4, 0.3, 3.4), 0, BASE_TOP + 9.1, 15.6);

    /* ---- the Bodhi tree and its raised platform ------------------------- */
    (function bodhi(tx, tz) {
      add('stone', box(15, 1.0, 15), tx, TER, tz);
      add('marble', box(15.4, 0.2, 15.4), tx, TER + 1.0, tz);
      // trunk, buttress roots and a low spreading crown
      add('bark', cyl(1.05, 1.75, 8.6, 10), tx, TER + 1.0, tz);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        add('bark', cyl(0.3, 0.55, 2.6, 6), tx + Math.cos(a) * 1.2, TER + 1.0,
          tz + Math.sin(a) * 1.2, { rz: Math.cos(a) * 0.55, rx: -Math.sin(a) * 0.55 });
      }
      [[0, 14.0, 0, 8.6], [6.4, 12.8, 2.0, 6.0], [-6.6, 13.2, -1.5, 6.2], [1.8, 15.4, -5.4, 5.0],
       [-2.2, 15.2, 5.6, 5.1], [0, 11.6, 0, 6.0], [4.4, 16.4, 3.6, 4.2], [-4.6, 16.0, -4.0, 4.3]]
        .forEach(([dx, dy, dz, r]) => add('foliage', sph(r, 11), tx + dx, TER + dy, tz + dz, { sy: 0.46 }));
      // the vajrasana-like slab and a small shrine beside the tree
      add('sandstonePink', box(3.4, 0.9, 2.6), tx + 6.0, TER, tz + 4.0);
      add(SB, box(3.8, 0.25, 3.0), tx + 6.0, TER + 0.9, tz + 4.0);
      ctx.flag(tx + 7.6, TER + 1.0, tz + 6.2, 6.5, 'fabricSaffron');
    })(-19.5, -5.0);

    /* ---- votive stupas -------------------------------------------------- */
    const stupa = (x, z, s) => {
      add('stone', cyl(1.5 * s, 1.8 * s, 0.7 * s, 12), x, TER, z);
      add(PL, cyl(1.35 * s, 1.5 * s, 0.9 * s, 12), x, TER + 0.7 * s, z);
      add(PW, dome(1.3 * s, 1.25 * s, 14), x, TER + 1.6 * s, z);
      add(SB, box(0.62 * s, 0.5 * s, 0.62 * s), x, TER + 2.75 * s, z);
      add('gold', cone(0.24 * s, 0.6 * s, 8), x, TER + 3.35 * s, z);
    };
    [[-9, 21, 1.0], [-5.5, 23, 0.8], [9, 22, 0.95], [12.5, 19, 0.75], [-13, 17, 0.85],
      [13, 12, 0.8], [-14, 11, 0.7], [6, 24.5, 0.7], [-2, 22.5, 0.65],
      [17, 6, 0.9], [-17, 3, 0.75], [18, -6, 0.8]]
      .forEach(([x, z, s]) => stupa(x, z, s));

    /* ---- lotus pond ----------------------------------------------------- */
    add('stone', cyl(6.2, 6.6, 0.8, 22), 21, TER, 22);
    add('water', cyl(5.5, 5.5, 0.24, 22), 21, TER + 0.7, 22);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * PI * 2;
      add('green', cyl(0.5, 0.5, 0.06, 8), 21 + Math.cos(a) * 3.2, TER + 0.85, 22 + Math.sin(a) * 3.2);
    }

    /* ---- grounds -------------------------------------------------------- */
    const people = [[-8, 18], [8, 19], [-15, 22], [15, 22], [0, 24], [-22, 16], [22, 16],
      [-4, 14], [10, 13], [-11, 26], [12, 27], [18, 9], [-18, 8], [-24, -2], [24, 0]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricSaffron', 'fabricWhite', 'fabricRed'][i % 3], 0.95));
    [[-27, 22], [27, 22], [-27, 4], [27, 4], [0, 30]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));
    [[-34, 26], [34, 26], [-36, 4], [36, 4], [-32, -22], [32, -22], [-24, 32], [24, 32],
      [-38, -8], [38, -8], [-6, 34], [6, 34]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.25 + (i % 3) * 0.2, 'round'));

    ctx.light({ pos: [-22, 16, 26], target: [0, 24, 0], color: 0xffd0a0, intensity: 3200, distance: 170 });
    ctx.light({ pos: [22, 16, 22], target: [0, 24, 0], color: 0xffc890, intensity: 2800, distance: 170 });
  }
};
