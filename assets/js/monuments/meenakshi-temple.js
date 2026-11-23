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
    /* The figures are painted in the same five colours, but mixed a third of
       the way to the ochre of the wall: at full saturation a 1 m figure at
       200 m is a pixel of primary colour and the register reads as confetti. */
    const MUTE = FIG.map((k) => {
      const mm = ctx.mat(k);
      if (!mm || !mm.clone) return k;
      const c = mm.clone();
      c.color.lerp(new THREE.Color(0xd8b98e), 0.34);
      return c;
    });
    const CREAM = (() => { const mm = ctx.mat('sandstoneBuff'); if (!mm || !mm.clone) return 'sandstoneBuff'; const c = mm.clone(); c.color.setHex(0xd8b98e); return c; })();   // the ochre stucco of the storey walls
    // The cornices were 'cream' (0xe6d6b8) while the walls are ochre, so every
    // storey was capped by a bright white band and the tower read as a striped
    // cake. A shade darker than the wall makes them read as shadowed mouldings.
    const CORN = (() => { const mm = ctx.mat('cream'); if (!mm || !mm.clone) return 'cream'; const c = mm.clone(); c.color.setHex(0xbfa076); return c; })();
    // the recess the figure rows stand in: shadowed ochre, not black — a pure
    // black band read as a painted stripe across every storey
    const NICHE = (() => { const mm = ctx.mat('plaster'); if (!mm || !mm.clone) return 'dark'; const c = mm.clone(); c.color.setHex(0x9a7a5c); return c; })();

    /* ---------------------------------------------------------- gopuram
       A gopuram is a granite base pierced by the gateway, then n storeys,
       each a sculpted wall carrying a projecting cornice, and a barrel
       vaulted crest with gold kalashas.

       The storeys are set in by an accelerating amount — 1 − K·u^1.45 — so the
       sides lean in on a shallow concave curve. A constant step per storey is
       what made these read as office blocks with window rows: the silhouette
       was a straight stair with a square corner at every tier. The corners are
       chamfered, the cornice projects in three mouldings, and the figures
       stand in a recessed register at a spacing that lets one figure read as a
       figure rather than as a pixel of confetti. */
    function gopuram(cx, cz, W, D, H, nT, ry, o = {}) {
      const cs = Math.cos(ry), sn = Math.sin(ry);
      const P = (lx, lz) => [cx + lx * cs + lz * sn, cz - lx * sn + lz * cs];
      const BASEH = o.baseH ?? H * 0.20;
      const crestH = o.crestH ?? Math.max(3.8, H * 0.10);
      const tierH = (H - BASEH - crestH) / nT;
      const K = 1 - Math.pow(o.taper ?? 0.955, nT);   // total shrink, base to top
      const shrink = (u) => 1 - K * Math.pow(u, 1.45);

      /* ---- the granite base, pierced by the gateway ---- */
      block('granite', W * 1.05, 1.0, D * 1.05, cx, 0, cz, { ry });          // plinth
      block('granite', W, BASEH - 1.0, D, cx, 1.0, cz, { ry });
      block('plasterWhite', W * 1.02, 0.8, D * 1.02, cx, BASEH - 0.8, cz, { ry });
      const gw = Math.min(W * 0.26, 8.4);
      const gh = (BASEH - 1.0) * 0.86;
      const p0 = P(0, D / 2 + 0.06);
      add('dark', arch(gw, gh, 0.45), p0[0], 1.0, p0[1], { ry });
      add('granite', archFrame(gw + 1.8, gh + 1.0, 0.7, 0.6), p0[0], 1.0, p0[1], { ry });
      add('granite', box(gw + 3.4, 0.5, 0.9), p0[0], 1.05, p0[1], { ry });    // threshold
      for (const s2 of [-1, 1]) {
        // pilasters flanking the gateway, and a deep cornice over the base
        const q = P(s2 * (gw / 2 + 3.4), D / 2 + 0.05);
        add('granite', box(1.8, BASEH - 2.2, 0.7), q[0], 1.0 + (BASEH - 2.2) / 2, q[1], { ry });
        const r2 = P(s2 * (W / 2 - 1.6), D / 2 + 0.05);
        add('granite', box(2.2, BASEH - 1.8, 0.6), r2[0], 1.0 + (BASEH - 1.8) / 2, r2[1], { ry });
      }
      block('granite', W * 1.08, 0.9, D * 1.08, cx, BASEH - 1.7, cz, { ry });

      let y = BASEH;
      for (let i2 = 0; i2 < nT; i2++) {
        const u = i2 / nT;
        const w = W * shrink(u), d = D * shrink(u);
        const bodyH = tierH * 0.84, cornH = tierH * 0.16;

        /* the sculpted wall, with its corners chamfered off */
        block(CREAM, w, bodyH, d, cx, y, cz, { ry });
        for (const [ux, uz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          const q = P(ux * (w / 2 - 0.75), uz * (d / 2 - 0.75));
          block(CREAM, 1.6, bodyH, 1.6, q[0], y, q[1], { ry: ry + PI / 4 });
        }
        /* the moulded base of the storey: three set-backs, not one slab */
        add(CORN, box(w * 1.025, bodyH * 0.06, d * 1.025), cx, y + bodyH * 0.03, cz, { ry });

        /* the register of stucco figures, recessed under the cornice */
        const fh = bodyH * 0.74;
        const fy0 = y + bodyH * 0.17;
        const sp = 1.00;
        const nL = Math.max(3, Math.round(w / sp));
        const nS = Math.max(2, Math.round(d / sp));
        const sL = w / nL, sS = d / nS;
        for (const side of [1, -1]) {
          const a = P(0, side * (d / 2 - 0.02)), b = P(side * (w / 2 - 0.02), 0);
          add(NICHE, box(w * 0.97, fh * 1.02, 0.05), a[0], fy0 + fh * 0.50, a[1], { ry: ry + (side > 0 ? 0 : PI) });
          add(NICHE, box(d * 0.97, fh * 1.02, 0.05), b[0], fy0 + fh * 0.50, b[1], { ry: ry + side * PI / 2 });
        }
        /* A figure is three hexagonal prisms — a dhoti flared at the feet, a
           torso widening into the shoulders, and a head under a crown — and a
           whole face of them is ONE geometry, emitted for every third figure
           so three colours can run through the row.
           This matters more than the triangles do: the boot time is spent on
           the number of geometry items, not on their size. Ninety figures a
           face built as five separate pieces each was 460 items a storey and
           put the page's boot at 217 s; the same row as three merged strips is
           12 items a storey. */
        const figureRow = (n, sL, phase) => {
          const pos = [], uv = [], idx = [];
          const prism = (cx0, y0, y1, r0, r1, seg) => {
            const base = pos.length / 3;
            for (let k = 0; k <= 1; k++) {
              const r = k ? r1 : r0, yy = k ? y1 : y0;
              for (let j = 0; j < seg; j++) {
                const a = (j / seg) * Math.PI * 2 + 0.26;
                pos.push(cx0 + Math.cos(a) * r, yy, Math.sin(a) * r * 0.72 + 0.10);
                uv.push(j / seg, k);
              }
            }
            for (let j = 0; j < seg; j++) {
              const a = base + j, b = base + ((j + 1) % seg);
              idx.push(a, b, a + seg, b, b + seg, a + seg);
            }
          };
          const arm = (cx0, y0, len) => {
            const base = pos.length / 3;
            for (let k = 0; k <= 1; k++) {
              const yy = k ? y0 - len : y0;
              for (let j = 0; j < 4; j++) {
                const a = (j / 4) * Math.PI * 2;
                pos.push(cx0 + Math.cos(a) * 0.09, yy, 0.10 + Math.sin(a) * 0.09);
                uv.push(j / 4, k);
              }
            }
            for (let j = 0; j < 4; j++) {
              const a = base + j, b = base + ((j + 1) % 4);
              idx.push(a, b, a + 4, b, b + 4, a + 4);
            }
          };
          for (let i = 0; i < n; i++) {
            if (i % 3 !== phase) continue;
            const x = (i - (n - 1) / 2) * sL;
            prism(x, 0, fh * 0.54, 0.46, 0.30, 6);            // the dhoti
            prism(x, fh * 0.52, fh * 0.82, 0.25, 0.35, 6);    // the torso
            prism(x, fh * 0.81, fh * 0.99, 0.20, 0.16, 6);    // head and crown
            // arms: without them a figure is a bowling pin, which is what the
            // register read as from four metres
            arm(x - 0.30, fh * 0.76, fh * 0.50);
            arm(x + 0.30, fh * 0.76, fh * 0.50);
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
          g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          return g;
        };
        for (const side of [1, -1]) {
          const a = P(0, side * (d / 2 + 0.20));
          for (let ph = 0; ph < 3; ph++) {
            const k = MUTE[(i2 * 2 + ph * 2 + (side > 0 ? 0 : 1)) % MUTE.length];
            add(k, figureRow(nL, sL, ph), a[0], fy0, a[1], { ry: ry + (side > 0 ? 0 : PI) });
          }
          const b = P(side * (w / 2 + 0.20), 0);
          for (let ph = 0; ph < 3; ph++) {
            const k = MUTE[(i2 * 3 + ph * 2 + (side > 0 ? 0 : 1)) % MUTE.length];
            add(k, figureRow(nS, sS, ph), b[0], fy0, b[1], { ry: ry + side * PI / 2 });
          }
        }

        /* the projecting cornice: three mouldings, each standing further out,
           with a row of kudu dormer faces on the face of it */
        const yc = y + bodyH;
        block(CORN, w * 1.05, cornH * 0.40, d * 1.05, cx, yc, cz, { ry });
        block(CORN, w * 1.10, cornH * 0.30, d * 1.10, cx, yc + cornH * 0.40, cz, { ry });
        add('terracotta', box(w * 1.115, cornH * 0.12, d * 1.115), cx, yc + cornH * 0.70, cz, { ry });
        block(CORN, w * 1.07, cornH * 0.18, d * 1.07, cx, yc + cornH * 0.82, cz, { ry });
        for (let j2 = 0; j2 < nL; j2++) {
          const off = (j2 - (nL - 1) / 2) * sL;
          for (const side of [1, -1]) {
            const p = P(off, side * (d / 2 * 1.055 + 0.06));
            add('dark', plane(sL * 0.42, cornH * 0.34), p[0], yc + cornH * 0.21, p[1],
              { ry: ry + (side > 0 ? 0 : PI) });
          }
        }
        /* corner pilasters: a vertical rhythm against the horizontal one */
        for (const [ux, uz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          const q = P(ux * (w / 2 - 0.5), uz * (d / 2 - 0.5));
          block('cream', 1.5, tierH * 0.96, 1.5, q[0], y, q[1], { ry });
        }

        y += tierH;
      }

      /* ---- the crest: a stepped upapitha, the shala, the kalashas ---- */
      const wT = W * shrink((nT - 1) / nT) * Math.pow(shrink(1) / shrink((nT - 1) / nT), 0.6);
      const dT = D * shrink((nT - 1) / nT) * Math.pow(shrink(1) / shrink((nT - 1) / nT), 0.6);
      block(CORN, wT * 1.12, crestH * 0.13, dT * 1.12, cx, y, cz, { ry });
      block(CORN, wT * 1.05, crestH * 0.12, dT * 1.05, cx, y + crestH * 0.13, cz, { ry });
      const vr = Math.min(dT * 0.34, 3.8);
      const yv = y + crestH * 0.25 + vr * 0.35;
      /* the barrel vault, along the long axis */
      add('cream', cyl(vr, vr, wT * 1.00, 16), cx, yv, cz, { ry, rz: PI / 2 });
      add('gold', cyl(vr * 0.15, vr * 0.15, wT * 1.02, 8), cx, yv + vr * 0.98, cz, { ry, rz: PI / 2 });
      /* the two ends of the vault: a semicircular screen with a boss */
      for (const sgn of [-1, 1]) {
        const q = P(sgn * wT * 0.50, 0);
        add('terracotta', cyl(vr * 1.03, vr * 1.03, 0.55, 16), q[0], yv, q[1], { ry, rz: PI / 2 });
        add('cream', cyl(vr * 0.74, vr * 0.74, 0.75, 14), q[0], yv, q[1], { ry, rz: PI / 2 });
        add('gold', cyl(vr * 0.30, vr * 0.30, 0.85, 10), q[0], yv, q[1], { ry, rz: PI / 2 });
      }
      const nf = o.finials ?? 7;
      for (let j2 = 0; j2 < nf; j2++) {
        const off = (j2 - (nf - 1) / 2) * (wT * 0.86 / Math.max(1, nf - 1));
        const q = P(off, 0);
        const big = Math.abs(j2 - (nf - 1) / 2) < 0.01;
        const s3 = big ? 1.45 : 0.92;
        const yb = yv + vr * 1.05;
        add('gold', cyl(0.16 * s3, 0.24 * s3, 1.1 * s3, 6), q[0], yb, q[1], { ry });
        add('gold', sph(0.34 * s3, 8), q[0], yb + 0.70 * s3, q[1], { ry });
        add('goldLeaf', cone(0.20 * s3, 0.75 * s3, 6), q[0], yb + 1.22 * s3, q[1], { ry });
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
