/* Meenakshi Amman Temple — Madurai · procedural miniature
   Dravidian temple city: painted gopurams, Golden Lotus tank, pillared halls.
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions, 1 unit = 1 metre.
   ----------------------------------------------------------------
   outer enclosure        254 x 238 m  (847 x 792 ft)
   fourteen towers: 4 nine-tier, 1 seven-tier, 5 five-tier,
                    2 three-tier, 2 golden vimanas
   east rajagopuram       46.7 m high, base 33.9 x 20.0 m
   south rajagopuram      51.9 m high, base 32.9 x 20.4 m  (the tallest)
   west  rajagopuram      47.1 m high, base 30.8 x 19.4 m
   north rajagopuram      46.3 m high, base 34.0 x 20.3 m
   Potramarai tank        50 x 37 m  (165 x 120 ft)
   ---------------------------------------------------------------- */

export default {
  id: 'meenakshi-temple',
  accent: '#d4544a',
  accent2: '#f08a6a',
  seed: 41,
  floodScale: 0.3,
  time: 14.6,
  bounds: 210,
  minDist: 40,
  maxDist: 720,
  home: { pos: [116, 88, 196], target: [0, 26, 84], fov: 36 },
  ground: { texture: 'paving', size: 2600, color: 0xc0ae8c },
  floods: [
    { pos: [-120, 46, 150], target: [0, 26, 90], color: 0xffd9ae, intensity: 3800, distance: 520 },
    { pos: [110, 40, 140], target: [0, 30, 90], color: 0xffe2bc, intensity: 2800, distance: 520 },
    { pos: [0, 14, 190], target: [0, 30, 110], color: 0xffd2a0, intensity: 1900, distance: 380 }
  ],
  views: [
    { name: 'Full', pos: [116, 88, 196], target: [0, 26, 84] },
    { name: 'Gopuram', pos: [34, 24, 172], target: [0, 28, 119] },
    { name: 'Tank', pos: [-40, 26, 112], target: [-2, 2, 74] },
    { name: 'Inner court', pos: [46, 44, 96], target: [0, 16, 0] },
    { name: 'Crest', pos: [14, 44, 152], target: [0, 42, 119] }
  ],
  tour: [
    {
      title: 'The Temple City', deva: 'மீனாட்சி அம்மன் கோயில்',
      text: 'The Meenakshi Sundareswarar temple occupies the southern bank of the Vaigai at Madurai, dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar, Shiva. Sangam literature describes the temple city, and the earliest structures here date from Pandya rule in the 12th and 13th centuries.',
      pos: [64, 56, 202], target: [6, 18, 0], time: 16.4
    },
    {
      title: 'Fourteen Gopurams', deva: 'கோபுரம்',
      text: 'Much of the present complex was rebuilt in the 14th century and enlarged under the Vijayanagara Empire and the Nayaks, who added the great gopurams. Fourteen of them rise above the streets, the tallest nearly 52 metres high and covered in thousands of painted stucco figures.',
      pos: [26, 40, 104], target: [0, 34, 72], time: 15.4
    },
    {
      title: 'Tiers of Painted Figures', deva: 'சிற்பங்கள்',
      text: 'Each gopuram is a tapering stack of storeys, every one carrying a row of stucco deities, dancers and guardians, repainted in reds, blues and yellows. A barrel-vaulted crest with gold finials closes the top.',
      pos: [-18, 44, 96], target: [-70, 34, 0], time: 11.6
    },
    {
      title: 'The Golden Lotus Tank', deva: 'பொற்றாமரைக் குளம்',
      text: 'Inside the walls lies the Potramarai tank, the Golden Lotus tank, where pilgrims bathe and where the golden lotus once floated. Its stepped ghats descend in tiers to the water, with a gold-roofed shrine at the centre.',
      pos: [-16, 24, 92], target: [-44, 6, 50], time: 13.4
    },
    {
      title: 'The Thousand Pillar Hall', deva: 'ஆயிரங்கால் மண்டபம்',
      text: 'The Hall of a Thousand Pillars opens off the courts, its carved columns packed close together. Beyond it the two sanctums are roofed in gold plate.',
      pos: [52, 30, 40], target: [6, 10, 8], time: 12.2
    },
    {
      title: 'A Living Temple', deva: 'வழிபாடு',
      text: 'The temple remains a working centre of Tamil religious life, with around 33,000 sculptures across the complex and daily processions through the streets of the old city. Crowds of pilgrims fill the courts from dawn.',
      pos: [-30, 12, 66], target: [-20, 8, 44], time: 9.2
    },
    {
      title: 'Gopurams at Night', deva: 'இரவு',
      text: 'After dark the tiers are floodlit and the painted figures glow against the sky, while the tank holds the reflection of the towers. The temple is one of the oldest continuously worshipped sites in India.',
      pos: [86, 50, 128], target: [0, 30, 0], time: 21.3
    }
  ],

  build(ctx) {
    const { add, box, cyl, cone, sph, plane, arch, archFrame, block, col, THREE } = ctx;
    const PI = Math.PI;

    /* the painted stucco palette — figures, not stripes. These are the colours
       the gopurams are actually repainted in: a red, a yellow, a blue, a pink
       and a green, on ochre stucco. The old five stone greys read as stripes. */
    const FIG = ['red', 'yellow', 'blue', 'pinkPaint', 'teal', 'terracotta'];
    const CREAM = (() => { const mm = ctx.mat('sandstoneBuff'); if (!mm || !mm.clone) return 'sandstoneBuff'; const c = mm.clone(); c.color.setHex(0xd8b98e); return c; })();   // the ochre stucco of the storey walls
    // The cornices were 'cream' (0xe6d6b8) while the walls are ochre, so every
    // storey was capped by a bright white band and the tower read as a striped
    // cake. A shade darker than the wall makes them read as shadowed mouldings.
    const CORN = (() => { const mm = ctx.mat('cream'); if (!mm || !mm.clone) return 'cream'; const c = mm.clone(); c.color.setHex(0xbfa076); return c; })();
    // the recess the figure rows stand in: shadowed ochre, not black — a pure
    // black band read as a painted stripe across every storey
    const NICHE = (() => { const mm = ctx.mat('plaster'); if (!mm || !mm.clone) return 'dark'; const c = mm.clone(); c.color.setHex(0x3b2b21); return c; })();

    /* ---------------------------------------------------------- gopuram
       A gopuram is a granite base pierced by the gateway, then nine (or
       fewer) storeys, each a sculpted wall carrying a projecting cornice.
       Every storey is set in from the one below, so the sides lean in by
       about a third over the full height. A barrel-vaulted crest with gold
       kalashas closes the top. */
    function gopuram(cx, cz, W, D, H, nT, ry, o = {}) {
      const cs = Math.cos(ry), sn = Math.sin(ry);
      const P = (lx, lz) => [cx + lx * cs + lz * sn, cz - lx * sn + lz * cs];
      const BASEH = o.baseH ?? H * 0.18;
      const crestH = o.crestH ?? Math.max(3.2, H * 0.088);
      const tierH = (H - BASEH - crestH) / nT;
      const taper = o.taper ?? 0.955;

      /* granite base with the tall gateway passage */
      block('granite', W, BASEH, D, cx, 0, cz, { ry });
      block('plasterWhite', W * 1.015, 0.7, D * 1.015, cx, BASEH - 0.7, cz, { ry });
      block('granite', W * 1.03, 0.5, D * 1.03, cx, 0, cz, { ry });
      const gw = Math.min(W * 0.3, 9.5);
      const p0 = P(0, D / 2 + 0.06);
      add('dark', arch(gw, BASEH * 0.78, 0.4), p0[0], 0.05, p0[1], { ry });
      add('granite', archFrame(gw + 1.5, BASEH * 0.84, 0.55, 0.5), p0[0], 0.05, p0[1], { ry });
      for (const s of [-1, 1]) {
        const q = P(s * (gw / 2 + 1.9), D / 2 + 0.06);
        add('dark', box(1.5, BASEH * 0.5, 0.4), q[0], BASEH * 0.27, q[1], { ry });
      }

      let w = W, d = D, y = BASEH;
      for (let i = 0; i < nT; i++) {
        const bodyH = tierH * 0.84, cornH = tierH * 0.16;
        /* sculpted wall */
        block(CREAM, w, bodyH, d, cx, y, cz, { ry });
        /* dense rows of stucco figures on all four faces. A figure is seven
           pieces, not four boxes: a ledge, a dhoti flared at the feet, a torso
           that widens into the shoulders, two arms, a head and a crown. The old
           four boxes were all about the same width, so the register read as a
           picket fence of coloured bars rather than as sculpture.
           The recess behind the row is one dark band per face per storey, not a
           niche box per figure: same read, a fraction of the geometry. */
        const fh = bodyH * 0.68;
        const fy0 = y + bodyH * 0.15;
        const sp = 1.06;   // dense: a real register almost touches, figure to figure
        const nL = Math.max(4, Math.round(w / sp));
        const nS = Math.max(3, Math.round(d / sp));
        const sL = w / nL, sS = d / nS;
        for (const side of [1, -1]) {
          const a = P(0, side * (d / 2 - 0.02)), b = P(side * (w / 2 - 0.02), 0);
          add(NICHE, box(w * 0.96, fh * 1.02, 0.05), a[0], fy0 + fh * 0.51, a[1], { ry: ry + (side > 0 ? 0 : PI) });
          add(NICHE, box(d * 0.96, fh * 1.02, 0.05), b[0], fy0 + fh * 0.51, b[1], { ry: ry + side * PI / 2 });
        }
        const figure = (px, pz, ryF, H, key) => {
          const cs2 = Math.cos(ryF), sn2 = Math.sin(ryF);
          // local (lx, ly, lz) in the figure's own frame, lz pointing outward
          const put = (k, geo, lx, ly, lz, o) => {
            add(k, geo, px + lx * cs2 + lz * sn2, ly, pz - lx * sn2 + lz * cs2,
              Object.assign({ ry: ryF }, o));
          };
          put(CREAM, box(0.96, 0.07, 0.52), 0, fy0 + 0.035, 0.09);                  // its ledge
          put(key, cyl(0.26, 0.36, H * 0.30, 5), 0, fy0 + H * 0.21, 0.08);          // dhoti
          put(key, cyl(0.30, 0.22, H * 0.32, 5), 0, fy0 + H * 0.52, 0.08);          // torso to shoulders
          put('ivory', cyl(0.060, 0.075, H * 0.30, 4), -0.27, fy0 + H * 0.50, 0.09, { rz: 0.12 });
          put('ivory', cyl(0.060, 0.075, H * 0.30, 4), 0.27, fy0 + H * 0.50, 0.09, { rz: -0.12 });
          put('ivory', cyl(0.15, 0.16, H * 0.13, 5), 0, fy0 + H * 0.745, 0.07);     // head
          put('gold', cyl(0.07, 0.13, H * 0.11, 5), 0, fy0 + H * 0.86, 0.06);       // crown
        };
        for (let j = 0; j < nL; j++) {
          const off = (j - (nL - 1) / 2) * sL;
          const k = FIG[(j * 3 + i * 2) % FIG.length];
          for (const side of [1, -1]) {
            const p = P(off, side * (d / 2 + 0.06));
            figure(p[0], p[1], ry + (side > 0 ? 0 : PI), fh, k);
          }
        }
        for (let j = 0; j < nS; j++) {
          const off = (j - (nS - 1) / 2) * sS;
          const k = FIG[(j * 5 + i * 3 + 1) % FIG.length];
          for (const side of [1, -1]) {
            const p = P(side * (w / 2 + 0.06), off);
            figure(p[0], p[1], ry + side * PI / 2, fh, k);
          }
        }
        /* moulded base, then the projecting cornice */
        add('cream', box(w * 1.03, bodyH * 0.08, d * 1.03), cx, y + bodyH * 0.04, cz, { ry });
        block(CORN, w * 1.095, cornH * 0.58, d * 1.095, cx, y + bodyH, cz, { ry });
        add('terracotta', box(w * 1.105, cornH * 0.1, d * 1.105), cx, y + bodyH + cornH * 0.58, cz, { ry });
        add(CORN, box(w * 1.075, cornH * 0.2, d * 1.075), cx, y + bodyH + cornH * 0.68, cz, { ry });
        /* corner pilasters give the storey a vertical as well as a horizontal rhythm */
        for (const [ux, uz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          block('cream', 1.4, tierH * 0.98, 1.4, cx + ux * (w / 2 - 0.55), y, cz + uz * (d / 2 - 0.55), { ry });
        }
        /* kudu niches along the cornice of the long faces */
        for (let j = 0; j < nL; j++) {
          const off = (j - (nL - 1) / 2) * sL;
          for (const side of [1, -1]) {
            const p = P(off, side * (d / 2 + 0.1));
            add('dark', plane(sL * 0.3, cornH * 0.26), p[0], y + bodyH + cornH * 0.28, p[1], { ry: ry + (side > 0 ? 0 : PI) });
          }
        }
        y += tierH;
        w *= taper; d *= taper;
      }

      /* ---- barrel-vaulted crest with gold finials ---- */
      const vr = Math.min(d * 0.30, 3.4);
      block(CORN, w * 1.05, crestH * 0.16, d * 1.05, cx, y, cz, { ry });
      add('cream', cyl(vr, vr, w * 1.0, 14), cx, y + crestH * 0.16, cz, { ry, rz: PI / 2 });
      add('gold', cyl(vr * 0.2, vr * 0.2, w * 1.01, 8), cx, y + crestH * 0.16 + vr * 0.95, cz, { ry, rz: PI / 2 });
      add('plasterWhite', box(w * 1.02, crestH * 0.1, d * 0.44), cx, y + crestH * 0.16 + vr * 0.58, cz, { ry });
      /* decorated semicircular ends to the vault */
      for (const sgn of [-1, 1]) {
        const q = P(sgn * w * 0.5, 0);
        add('cream', cyl(vr * 1.06, vr * 1.06, 0.45, 14), q[0], y + crestH * 0.16, q[1], { ry, rz: PI / 2 });
        add('terracotta', cyl(vr * 0.62, vr * 0.62, 0.6, 12), q[0], y + crestH * 0.16, q[1], { ry, rz: PI / 2 });
        add('gold', cyl(vr * 0.26, vr * 0.26, 0.7, 10), q[0], y + crestH * 0.16, q[1], { ry, rz: PI / 2 });
      }
      const nf = o.finials ?? 7;
      for (let j = 0; j < nf; j++) {
        const off = (j - (nf - 1) / 2) * (w * 0.94 / Math.max(1, nf - 1));
        const q = P(off, 0);
        const big = j === (nf - 1) / 2;
        const s = big ? 1.5 : 0.95;
        const yb = y + crestH * 0.16 + vr * 1.0;
        add('gold', cyl(0.15 * s, 0.22 * s, 1.0 * s, 6), q[0], yb, q[1], { ry });
        add('gold', sph(0.32 * s, 8), q[0], yb + 0.62 * s, q[1], { ry });
        add('goldLeaf', cone(0.19 * s, 0.7 * s, 6), q[0], yb + 1.1 * s, q[1], { ry });
      }
    }

    /* ------------------------------------------------------------ walls */
    function wallRun(x1, z1, x2, z2, h, key) {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const n = Math.max(1, Math.round(len / 7));
      const ang = Math.atan2(z2 - z1, x2 - x1);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const mx = x1 + (x2 - x1) * t, mz = z1 + (z2 - z1) * t;
        const seg = len / n;
        block(key, seg + 0.1, h, 1.8, mx, 0, mz, { ry: -ang });
        block('plasterWhite', seg + 0.1, 0.6, 2.1, mx, h - 0.6, mz, { ry: -ang });
        add('terracotta', box(seg * 0.5, 0.75, 1.9), mx, h + 0.35, mz, { ry: -ang });
      }
    }

    /* ================= ground and the outer enclosure ================= */
    add('paving', plane(300, 290), 0, 0.06, 0, { rx: -PI / 2 });

    const OW = 127, OZ = 119, WALLH = 10;
    wallRun(-OW, OZ, OW, OZ, WALLH, 'plaster');
    wallRun(OW, OZ, OW, -OZ, WALLH, 'plaster');
    wallRun(OW, -OZ, -OW, -OZ, WALLH, 'plaster');
    wallRun(-OW, -OZ, -OW, OZ, WALLH, 'plaster');
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      block('plaster', 11, WALLH + 3, 11, sx * OW, 0, sz * OZ);
      add('terracotta', box(12, 0.9, 12), sx * OW, WALLH + 3.4, sz * OZ);
      add('gold', cyl(0.5, 0.6, 2.6, 8), sx * OW, WALLH + 3.9, sz * OZ);
    }

    /* ================= the four nine-tier rajagopurams ================= */
    gopuram(0, OZ, 33.9, 20.0, 46.7, 9, 0, { finials: 7 });        // east, 153.3 ft
    gopuram(OW, 0, 32.9, 20.4, 51.9, 9, PI / 2, { finials: 9 });   // south, the tallest
    gopuram(0, -OZ, 30.8, 19.4, 47.1, 9, 0, { finials: 7 });       // west, 154.6 ft
    gopuram(-OW, 0, 34.0, 20.3, 46.3, 9, PI / 2, { finials: 7 });  // north, 152 ft

    /* ================= second prakara ================= */
    const X2 = 88, Z2 = 82, H2 = 8;
    wallRun(-X2, Z2, X2, Z2, H2, 'plaster');
    wallRun(X2, Z2, X2, -Z2, H2, 'plaster');
    wallRun(X2, -Z2, -X2, -Z2, H2, 'plaster');
    wallRun(-X2, -Z2, -X2, Z2, H2, 'plaster');

    /* five-tier gopurams at the second prakara gates */
    gopuram(0, Z2, 19.5, 12.5, 30.0, 5, 0, { finials: 5 });
    gopuram(X2, 0, 19.0, 12.5, 31.5, 5, PI / 2, { finials: 5 });
    gopuram(0, -Z2, 18.5, 12.0, 29.0, 5, 0, { finials: 5 });
    gopuram(-X2, 0, 19.0, 12.0, 29.5, 5, PI / 2, { finials: 5 });

    /* ================= third prakara ================= */
    const X3 = 52, Z3 = 46, H3 = 7;
    wallRun(-X3, Z3, X3, Z3, H3, 'plasterWhite');
    wallRun(X3, Z3, X3, -Z3, H3, 'plasterWhite');
    wallRun(X3, -Z3, -X3, -Z3, H3, 'plasterWhite');
    wallRun(-X3, -Z3, -X3, Z3, H3, 'plasterWhite');

    /* the seven-tier Chittirai gopuram, and the small three-tier gates */
    gopuram(0, Z3, 17.0, 11.0, 34.0, 7, 0, { finials: 5 });
    gopuram(0, -Z3, 14.0, 9.5, 20.5, 3, 0, { finials: 5, taper: 0.93 });
    gopuram(-X3, 0, 13.5, 9.5, 19.5, 3, PI / 2, { finials: 5, taper: 0.93 });
    /* the fifth five-tier tower, on the north-east corner of the third prakara */
    gopuram(X3, -18, 13.0, 9.0, 24.0, 5, PI / 2, { finials: 5 });

    /* ================= the Potramarai tank ================= */
    (function tank() {
      const TX = -2, TZ = 72, TW = 50, TD = 37, levels = 5, th = 1.0, t = 2.6;
      for (let k = 0; k < levels; k++) {
        const a = (TW - k * t * 2) / 2, b = (TD - k * t * 2) / 2;
        const y = k * th;
        const runs = [
          [2 * a, t, 0, b - t / 2], [2 * a, t, 0, -b + t / 2],
          [t, 2 * b - 2 * t, -a + t / 2, 0], [t, 2 * b - 2 * t, a - t / 2, 0]
        ];
        for (const [bw, bd, ox, oz] of runs) {
          block('plasterWhite', bw, th, bd, TX + ox, y, TZ + oz);
          // the red and white banding painted on every riser
          const horiz = bw > bd;
          const L = horiz ? bw : bd, W = horiz ? bd : bw;
          const n = Math.round(L / 2.4);
          for (let i = 0; i < n; i++) {
            const off = (i - (n - 1) / 2) * (L / n);
            const k2 = i % 2 ? 'terracotta' : 'plasterWhite';
            block(k2, horiz ? L / n : W, th * 0.62, horiz ? W : L / n,
              TX + ox + (horiz ? off : 0), y, TZ + oz + (horiz ? 0 : off));
          }
        }
      }
      const wy = levels * th;
      add('water', plane(TW - levels * t * 2 + 2.0, TD - levels * t * 2 + 2.0), TX, wy - 0.2, TZ, { rx: -PI / 2 });

      /* pillared corridor round the tank */
      for (const [len, ry, ox, oz] of [[TW + 9, 0, 0, (TD / 2 + 5)], [TW + 9, 0, 0, -(TD / 2 + 5)],
        [TD + 10, PI / 2, TW / 2 + 5, 0], [TD + 10, PI / 2, -(TW / 2 + 5), 0]]) {
        const n = Math.round(len / 4.2);
        for (let i = 0; i <= n; i++) {
          const off = (i / n - 0.5) * len;
          const px = TX + ox + Math.cos(ry) * off, pz = TZ + oz - Math.sin(ry) * off;
          col('plasterWhite', 0.42, 0.5, 4.2, px, wy, pz, 7);
          block('terracotta', 1.1, 0.4, 1.1, px, wy + 4.2, pz);
        }
        const cx = TX + ox, cz = TZ + oz;
        block('plaster', len + 1.4, 0.9, 3.4, cx, wy + 4.6, cz, { ry });
        block('terracotta', len + 1.6, 0.5, 3.8, cx, wy + 5.5, cz, { ry });
      }

      /* octagonal island platform, its shrine and the golden lotus */
      const IX = TX + 3, IZ = TZ - 2;
      for (let k = 0; k < 2; k++) {
        add('plasterWhite', cyl(7.6 - k * 1.1, 8.0 - k * 1.1, 0.85, 8), IX, wy - 0.85 + k * 0.85, IZ);
        add('terracotta', cyl(7.7 - k * 1.1, 7.7 - k * 1.1, 0.22, 8), IX, wy - 0.85 + k * 0.85 + 0.85, IZ);
      }
      block('granite', 5.0, 0.9, 5.0, IX, wy + 0.85, IZ);
      block('plasterWhite', 3.4, 2.6, 3.4, IX, wy + 1.75, IZ);
      add('gold', cyl(2.3, 2.7, 0.7, 8), IX, wy + 4.35, IZ);
      add('goldLeaf', ctx.dome(2.1, 1.9, 12), IX, wy + 5.05, IZ);
      add('gold', cyl(0.16, 0.16, 1.4, 6), IX, wy + 6.9, IZ);
      add('gold', sph(0.42, 8), IX, wy + 8.3, IZ);
      // the tall gold lotus standard
      const LX = IX + 5.6, LZ = IZ + 1.2;
      add('gold', cyl(0.42, 0.55, 9.0, 10), LX, wy + 0.2, LZ);
      add('gold', sph(0.75, 10), LX, wy + 9.4, LZ);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        add('goldLeaf', box(1.5, 0.16, 0.75), LX + Math.cos(a) * 1.1, wy + 9.9, LZ + Math.sin(a) * 1.1, { ry: -a, rz: 0.3 });
      }
      add('goldLeaf', sph(0.55, 8), LX, wy + 10.3, LZ);
    })();

    /* ================= sanctums with gold vimanas ================= */
    function sanctum(cx, cz, w, d, wallH, roofKey) {
      block('granite', w + 2.4, 1.3, d + 2.4, cx, 0, cz);
      block('plasterWhite', w, wallH, d, cx, 1.3, cz);
      for (let i = 0; i < 5; i++) {
        const t = (i / 4 - 0.5) * w * 0.86;
        for (const s of [-1, 1]) {
          add('plaster', box(1.1, wallH, 0.55), cx + t, 1.3 + wallH / 2, cz + s * (d / 2 + 0.22));
          add('plaster', box(0.55, wallH, 1.1), cx + s * (w / 2 + 0.22), 1.3 + wallH / 2, cz + t * (d / w));
        }
      }
      add('dark', arch(w * 0.3, wallH * 0.72, 0.2), cx, 1.4, cz + d / 2 + 0.1);
      add('granite', archFrame(w * 0.34, wallH * 0.78, 0.32, 0.36), cx, 1.4, cz + d / 2 + 0.15);
      block('plaster', w + 2.6, 1.0, d + 2.6, cx, 1.3 + wallH, cz);
      /* stepped gold-plated vimana, eight-sided */
      let rw = w * 0.44, ry = 1.3 + wallH + 1.0;
      for (let i = 0; i < 5; i++) {
        add(roofKey, cyl(rw * 0.86, rw, 1.3, 8), cx, ry, cz);
        add('gold', cyl(rw * 0.88, rw * 0.88, 0.2, 8), cx, ry + 1.3, cz);
        ry += 1.5; rw *= 0.8;
      }
      add('gold', cyl(rw * 0.8, rw * 1.0, 1.1, 8), cx, ry, cz);
      add('goldLeaf', ctx.dome(rw * 0.85, rw * 0.95, 12), cx, ry + 1.1, cz);
      add('gold', cyl(0.22, 0.22, 2.2, 6), cx, ry + 1.8, cz);
      add('gold', sph(0.5, 8), cx, ry + 4.1, cz);
      add('goldLeaf', cone(0.3, 1.0, 6), cx, ry + 4.7, cz);
    }
    sanctum(-14, -6, 19, 19, 9.0, 'goldLeaf');   // Meenakshi
    sanctum(13, -20, 18, 18, 8.5, 'gold');       // Sundareswarar

    /* ================= thousand pillar hall ================= */
    (function hall(cx, cz, w, d) {
      block('granite', w + 3, 1.5, d + 3, cx, 0, cz);
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 6; j++) {
          const x = cx + (i - 4) * (w / 9), z = cz + (j - 2.5) * (d / 6);
          col('granite', 0.5, 0.62, 5.4, x, 1.5, z, 8);
          add('granite', box(1.4, 0.5, 1.4), x, 7.15, z);
        }
      }
      block('plasterWhite', w + 3, 1.3, d + 3, cx, 7.4, cz);
      block('plaster', w + 1, 1.7, d + 1, cx, 8.7, cz);
      for (let i = 0; i < 7; i++) {
        add('terracotta', box(2.8, 0.9, 0.5), cx + (i - 3) * (w / 7), 10.4, cz + d / 2 + 0.35);
      }
      add('gold', cyl(0.4, 0.5, 1.8, 8), cx, 10.4, cz);
      add('gold', sph(0.6, 8), cx, 11.8, cz);
    })(34, 12, 32, 20);

    /* ================= smaller shrines in the courts ================= */
    function shrine(cx, cz, w, d, h, key) {
      block('granite', w + 1.4, 0.9, d + 1.4, cx, 0, cz);
      block(key, w, h, d, cx, 0.9, cz);
      block('plasterWhite', w + 1.2, 0.7, d + 1.2, cx, 0.9 + h, cz);
      add('gold', cyl(0.28, 0.34, 1.3, 6), cx, 1.6 + h + 0.6, cz);
      add('gold', sph(0.42, 8), cx, 1.6 + h + 1.5, cz);
      add('dark', arch(w * 0.42, h * 0.68, 0.16), cx, 1.0, cz + d / 2 + 0.06);
    }
    shrine(-34, -32, 10, 9, 5.5, 'plasterWhite');
    shrine(34, -34, 9, 9, 5.0, 'plaster');
    shrine(-36, 18, 8, 8, 4.6, 'plasterWhite');
    shrine(8, 30, 8, 7, 4.4, 'plaster');
    shrine(-4, -34, 7, 7, 4.2, 'plasterWhite');
    shrine(38, 2, 7, 9, 4.8, 'plaster');
    shrine(-20, 30, 7, 7, 4.2, 'plasterWhite');

    /* ================= flagstaff, people, lamps, trees ================= */
    add('gold', cyl(0.6, 0.9, 16, 8), 0, 8, 56);
    add('gold', sph(1.1, 10), 0, 16.4, 56);
    add('fabricSaffron', plane(3.4, 2.2), 1.8, 14.2, 56, { ry: PI / 2 });

    const people = [
      [-14, 62, 'fabricRed'], [-10, 66, 'fabricSaffron'], [-18, 70, 'fabricWhite'], [-22, 76, 'fabricRed'],
      [-8, 80, 'fabricSaffron'], [-26, 62, 'fabricWhite'], [-4, 72, 'fabricRed'], [-16, 86, 'fabricSaffron'],
      [8, 64, 'fabricWhite'], [13, 72, 'fabricRed'], [18, 80, 'fabricSaffron'], [4, 90, 'fabricWhite'],
      [-40, 56, 'fabricSaffron'], [-30, 48, 'fabricRed'], [24, 56, 'fabricWhite'], [30, 66, 'fabricRed'],
      [-46, 84, 'fabricWhite'], [34, 88, 'fabricSaffron'], [-50, 30, 'fabricRed'], [44, 40, 'fabricWhite'],
      [2, 100, 'fabricRed'], [-2, 104, 'fabricSaffron'], [6, 108, 'fabricWhite'], [-6, 112, 'fabricRed']
    ];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 1.3, k, 0.95 + (i % 3) * 0.07));

    [[-10, 58], [10, 58], [-38, 54], [12, 44], [-38, 92], [22, 96], [-12, 96], [36, 56],
      [-58, 16], [58, 30], [0, 46], [0, -46]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));

    [[-70, 96], [-84, 74], [66, 96], [86, 74], [-66, 24], [70, 8], [-88, -50], [64, -70],
      [-44, 100], [44, 100], [-96, 44], [96, 40], [-104, 104], [104, 108], [-100, -92], [98, -96],
      [-120, 30], [120, 34], [-30, 106], [34, 106]]
      .forEach(([x, z], i) => ctx.tree(x, z, 0.95 + (i % 4) * 0.1, i % 5 === 2 ? 'palm' : 'round'));

    /* low houses of the old city outside the walls */
    const houses = [
      [-150, 60, 16, 11], [-150, 92, 13, 10], [-152, 22, 18, 12], [150, 66, 17, 11],
      [148, 100, 13, 10], [152, 26, 15, 11], [-60, 148, 18, 11], [12, 150, 16, 11],
      [82, 146, 14, 10], [-148, -34, 15, 11], [-150, -72, 17, 10], [150, -40, 16, 11],
      [148, -84, 13, 11], [-96, 152, 15, 10], [46, 152, 14, 11], [-22, 152, 13, 10],
      [116, 148, 14, 10], [-150, 126, 13, 10], [150, 130, 14, 10], [-34, -150, 16, 11],
      [56, -152, 15, 11], [-104, -150, 14, 11], [112, -150, 15, 10]
    ];
    houses.forEach(([x, z, w, d], i) => {
      block(i % 2 ? 'cream' : 'plaster', w, 8 + (i % 3) * 2, d, x, 0, z);
      block('terracotta', w + 1, 0.7, d + 1, x, 8 + (i % 3) * 2, z);
      add('dark', box(1.7, 2.6, 0.2), x, 1.3, z + d / 2 + 0.05);
    });

    /* the four processional streets running out from the gates */
    add('paving', plane(28, 300), 0, 0.04, 0, { rx: -PI / 2 });
    add('paving', plane(300, 28), 0, 0.04, 0, { rx: -PI / 2 });
  }
};
