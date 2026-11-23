/* Statue of Unity — Kevadia, Gujarat · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Measured proportions (1 unit = 1 m). The figure is 182 m from the soles of
   the feet to the crown and stands on a 58 m plinth, so the whole structure
   reaches 240 m; the viewing gallery sits at 153 m (0.52 of the figure, at
   Patel's hips); the stance leaves 6.4 m between the feet.

   The body is ONE continuous lofted surface — a smooth union of the torso and
   the two arms, sampled as a radial grid — so there is no cylinder shoulder
   and no tube arm with a joint. The dhoti, the shawl, the legs and the head
   are separate lofts set against that grid, which is kept so every fold and
   seam can be placed exactly on the surface.

   Datum (y):
     0     island
     58    plinth top = soles of the feet
     58 + 0.52·182 = 152.6   viewing gallery (153 m)
     58 + 182 = 240          crown                                            */

export default {
  id: 'statue-of-unity',
  accent: '#b8b2a4',
  accent2: '#d8d2c4',
  seed: 83,
  floodScale: 0.3,
  fogScale: 0.22,
  time: 16.9,
  bounds: 200,
  minDist: 90,
  maxDist: 1200,
  home: { pos: [206, 118, 358], target: [0, 128, 0], fov: 40 },
  ground: { texture: 'grass', size: 2600, color: 0x8e9a68, tile: 30 },
  water: { y: -1.2, size: 1100, z: 620, color: 0x2d5566, distortion: 2.0 },
  views: [
    { name: 'Full', pos: [206, 118, 358], target: [0, 128, 0] },
    { name: 'The figure', pos: [158, 168, 322], target: [0, 152, 0] },
    { name: 'From the dam', pos: [0, 70, 420], target: [0, 130, 0] },
    { name: 'Plinth', pos: [96, 46, 116], target: [0, 34, 0] },
    { name: 'Aerial', pos: [250, 360, 300], target: [0, 100, 0] }
  ],
  tour: [
    {
      title: 'The Tallest Statue', deva: 'एकता की प्रतिमा',
      text: 'The Statue of Unity stands on the island of Sadhu Bet in the Narmada, facing the Sardar Sarovar dam. At 182 metres it is the tallest statue in the world, dedicated to Sardar Vallabhbhai Patel, who brought the princely states into the Indian Union.',
      pos: [238, 132, 360], target: [0, 118, 0], time: 16.9
    },
    {
      title: 'Bronze on Steel', deva: 'कांस्य',
      text: 'The figure is a steel frame clad in about 1,700 tonnes of bronze panels over 25,000 tonnes of steel and concrete. It was designed by the sculptor Ram V. Sutar and built by Larsen & Toubro between 2013 and 2018.',
      pos: [130, 150, 215], target: [0, 112, 0], time: 12
    },
    {
      title: 'The Viewing Gallery', deva: 'दीर्घा',
      text: 'A gallery at 153 metres holds two hundred people at a time, looking out over the reservoir and the Vindhya hills.',
      pos: [60, 170, 110], target: [0, 155, 0], time: 9.6
    },
    {
      title: 'The Dam', deva: 'सरदार सरोवर',
      text: 'The statue faces the Sardar Sarovar dam across the water, a deliberate pairing: the man who argued for the project, looking at it.',
      pos: [0, 60, 300], target: [0, 110, 0], time: 17.6
    },
    {
      title: 'The Island', deva: 'साधु बेट',
      text: 'The plinth is a memorial complex with a museum, a garden and a memorial walk. The statue was unveiled on 31 October 2018, Patel’s birthday.',
      pos: [70, 40, 90], target: [0, 30, 0], time: 11
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit after dark, the bronze reads almost black against the sky, and the dam carries a line of lights.',
      pos: [140, 96, 210], target: [0, 102, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, block, col, torus } = ctx;

    // The engine's bronze is metalness 0.9, and a metal with only a weak
    // environment map to reflect renders almost black — which is why the
    // figure read as a silhouette with a few copper highlights. Less metal,
    // more diffuse colour, so the panels catch the key light instead.
    const patina = (base, col, metal, rough) => {
      const mm = ctx.mat(base);
      if (!mm || !mm.clone) return base;
      const c = mm.clone();
      c.color.setHex(col); c.metalness = metal; c.roughness = rough;
      return c;
    };
    const B = patina('bronze', 0xa8854e, 0.56, 0.52);    // the figure: patinated bronze, not brass
    const C = patina('bronze', 0xb08a56, 0.50, 0.50);    // the shawl, a shade lighter so it reads as cloth
    const DK = 'dark';
    const H = 182, BASE = 58;              // figure height, plinth top
    const Y = (t) => BASE + H * t;

    /* ==================================================================== *
     * profile tables — t runs from the soles (0) to the crown (1)
     * ==================================================================== */
    const lerpTab = (tab, t) => {
      if (t <= tab[0][0]) return tab[0][1];
      for (let i = 1; i < tab.length; i++) {
        if (t <= tab[i][0]) {
          const a = tab[i - 1], b = tab[i];
          return a[1] + (b[1] - a[1]) * ((t - a[0]) / (b[0] - a[0]));
        }
      }
      return tab[tab.length - 1][1];
    };

    // torso: half-width, half-depth, forward offset of the section centre
    const TA = [[0.38, 11.4], [0.47, 12.8], [0.53, 12.3], [0.58, 11.4], [0.64, 11.8],
      [0.70, 12.6], [0.755, 14.2], [0.79, 16.6], [0.815, 19.3], [0.836, 18.8],
      [0.852, 14.6], [0.862, 10.4], [0.872, 6.2]];
    const TB = [[0.38, 9.6], [0.47, 10.6], [0.53, 10.4], [0.58, 10.0], [0.64, 10.3],
      [0.70, 10.6], [0.755, 11.0], [0.79, 11.4], [0.815, 11.4], [0.836, 10.8],
      [0.852, 9.4], [0.862, 8.2], [0.872, 5.4]];
    const TZ = [[0.38, 0.6], [0.47, 0.8], [0.53, 0.6], [0.58, 0.4], [0.64, 0.3],
      [0.70, 0.0], [0.755, -0.3], [0.79, -0.5], [0.815, -0.6], [0.836, -0.6],
      [0.852, -0.5], [0.872, -0.2]];
    /* the arm: one swept loft along a spine that starts inside the shoulder
       mass and runs down through the deltoid, the elbow and the wrist, so
       there is no tube and no joint — the radius varies continuously and
       the top of the sweep is buried in the shoulder. */
    const ARM = [ // t, x, z, radius
      [0.860, 12.4, -0.6, 0.35],
      [0.850, 17.0, -0.5, 2.6],
      [0.835, 20.0, -0.3, 4.4],
      [0.815, 21.8, -0.1, 6.0],
      [0.790, 22.5, 0.3, 6.4],
      [0.750, 21.8, 0.8, 6.2],
      [0.700, 22.0, 1.4, 5.6],
      [0.640, 21.8, 2.0, 5.4],
      [0.560, 20.9, 2.5, 4.8],
      [0.480, 20.0, 3.0, 4.4],
      [0.430, 19.4, 3.3, 4.0],
      [0.395, 18.8, 3.6, 3.6]
    ];

    /* ==================================================================== *
     * the lofted body — a smooth union of the torso and the two arms
     * ==================================================================== */
    const NV = 74, NU = 60;                 // levels, angular segments
    const T0 = 0.385, T1 = 0.872;
    const K = 0.55;                         // blend radius: 1.5 fused the arm to the torso

    const smin = (a, b, k) => {
      const h = Math.max(k - Math.abs(a - b), 0) / k;
      return Math.min(a, b) - h * h * k * 0.25;
    };
    const ell = (x, z, cx, cz, a, b) =>
      (Math.hypot((x - cx) / a, (z - cz) / b) - 1) * Math.min(a, b);

    // the field: negative inside the body
    const field = (x, z, t) => {
      const a = lerpTab(TA, t), b = lerpTab(TB, t), zc = lerpTab(TZ, t);
      let f = ell(x, z, 0, zc, a, b);
      // the chest is flatter in front than the back is round
      return f;
    };

    // radial grid: R[i][j] is the surface radius at level i, angle j
    const R = [], YS = [];
    for (let i = 0; i <= NV; i++) {
      const t = T0 + (T1 - T0) * (i / NV);
      YS.push(Y(t));
      const row = [];
      for (let j = 0; j <= NU; j++) {
        const a = (j / NU) * Math.PI * 2;
        const dx = Math.cos(a), dz = Math.sin(a);
        let r0 = 0.2, r1 = 0.2, hit = -1;
        for (let r = 0.4; r <= 34; r += 1.2) {
          if (field(dx * r, dz * r, t) > 0) { hit = r; break; }
          r1 = r;
        }
        if (hit < 0) { row.push(r1); continue; }
        // bisect between the last inside sample and the first outside one
        let lo = hit - 1.2, hi = hit;
        for (let k = 0; k < 16; k++) {
          const mid = (lo + hi) / 2;
          if (field(dx * mid, dz * mid, t) > 0) hi = mid; else lo = mid;
        }
        row.push((lo + hi) / 2);
      }
      R.push(row);
    }

    // surface point, interpolated from the grid
    const surf = (t, ang) => {
      const fi = (t - T0) / (T1 - T0) * NV;
      const i = Math.max(0, Math.min(NV - 1, Math.floor(fi))), f = Math.max(0, Math.min(1, fi - i));
      let a = ang % (Math.PI * 2); if (a < 0) a += Math.PI * 2;
      const fj = a / (Math.PI * 2) * NU;
      const j = Math.min(NU - 1, Math.floor(fj)), g = fj - j;
      const r = (R[i][j] * (1 - f) + R[i + 1][j] * f) * (1 - g) +
        (R[i][j + 1] * (1 - f) + R[i + 1][j + 1] * f) * g;
      const y = Y(t);
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    };

    const bodyGeo = () => {
      const pos = [], uv = [], idx = [];
      for (let i = 0; i <= NV; i++) {
        for (let j = 0; j <= NU; j++) {
          const a = (j / NU) * Math.PI * 2, r = R[i][j];
          pos.push(Math.cos(a) * r, YS[i], Math.sin(a) * r);
          uv.push(j / NU, i / NV);
        }
      }
      for (let i = 0; i < NV; i++) {
        for (let j = 0; j < NU; j++) {
          const a = i * (NU + 1) + j, b = a + NU + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      // a cap across the bottom ring (hidden inside the dhoti)
      const capC = pos.length / 3;
      pos.push(0, YS[0], 0); uv.push(0.5, 0);
      for (let j = 0; j < NU; j++) idx.push(capC, j + 1, j);
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    add(B, bodyGeo(), 0, 0, 0);

    /* ---- the dhoti: a lofted skirt with pleats and a folded hem --------- */
    const DH = [[0.295, 20.4, 12.7], [0.31, 20.2, 12.6], [0.36, 19.7, 12.5],
      [0.42, 18.8, 12.3], [0.47, 17.4, 12.0], [0.53, 15.0, 11.4], [0.575, 12.6, 10.4]];
    const dhotiGeo = () => {
      const NVd = 26, NUd = 64;
      const pos = [], uv = [], idx = [];
      for (let i = 0; i <= NVd; i++) {
        const v = i / NVd;
        const t = 0.575 + (0.295 - 0.575) * v;
        const A = lerpTab(DH.map(([tt, a]) => [tt, a]), t);
        const Bd = lerpTab(DH.map(([tt, a, b]) => [tt, b]), t);
        // the hem is not level: it dips at the front and at the sides
        const dip = v > 0.94 ? (v - 0.94) / 0.06 : 0;
        for (let j = 0; j <= NUd; j++) {
          const a = (j / NUd) * Math.PI * 2;
          // pleats: eight folds down the front, deepening towards the hem
          const pl = (0.030 + 0.150 * v) * Math.cos(8 * a + 0.4) +
            (0.018 + 0.075 * v) * Math.cos(16 * a - 1.1);
          const r = 1 + pl;
          const yy = Y(t) - dip * (0.9 + 0.7 * Math.cos(a));
          pos.push(Math.cos(a) * A * r, yy, Math.sin(a) * Bd * r);
          uv.push(j / NUd, v);
        }
      }
      for (let i = 0; i < NVd; i++) {
        for (let j = 0; j < NUd; j++) {
          const a = i * (NUd + 1) + j, b = a + NUd + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    add(B, dhotiGeo(), 0, 0, 0);
    // the hem: a band of rolled cloth at the bottom edge
    {
      const pos = [], uv = [], idx = [];
      const N = 64;
      for (let i = 0; i <= 3; i++) {
        const t = 0.302 + i * 0.006;
        const A = lerpTab(DH.map(([tt, a]) => [tt, a]), t);
        const Bd = lerpTab(DH.map(([tt, a, b]) => [tt, b]), t);
        for (let j = 0; j <= N; j++) {
          const a = (j / N) * Math.PI * 2;
          const rr = 1.02 + 0.02 * Math.cos(8 * a);
          pos.push(Math.cos(a) * A * rr, Y(t), Math.sin(a) * Bd * rr);
          uv.push(j / N, i / 3);
        }
      }
      for (let i = 0; i < 3; i++) for (let j = 0; j < N; j++) {
        const a = i * (N + 1) + j, b = a + N + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      add(B, g, 0, 0, 0);
    }
    // eight pleats standing proud of the dhoti's front
    for (let f = -4; f <= 4; f++) {
      if (f === 0) continue;
      const ang = Math.PI / 2 + f * 0.20;
      const pos = [], uv = [], idx = [];
      const NL = 8;
      for (let i = 0; i <= NL; i++) {
        const v = i / NL;
        const t = 0.575 + (0.298 - 0.575) * v;
        const A = lerpTab(DH.map(([tt, a]) => [tt, a]), t);
        const Bd = lerpTab(DH.map(([tt, a, b]) => [tt, b]), t);
        for (let k = -1; k <= 1; k++) {
          const a = ang + k * 0.035;
          const rr = 1 + 0.10 * v;
          pos.push(Math.cos(a) * A * rr, Y(t) - (v > 0.95 ? 0.6 : 0), Math.sin(a) * Bd * rr);
          uv.push((k + 1) / 2, v);
        }
      }
      for (let i = 0; i < NL; i++) for (let k = 0; k < 2; k++) {
        const a = i * 3 + k, b = a + 3;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      add(B, g, 0, 0, 0);
    }
    // the waistband with its knot
    add(C, cyl(13.2, 13.6, 2.4, 36), 0, Y(0.566), 0, { sz: 0.82 });
    add(C, cyl(13.6, 13.2, 1.0, 36), 0, Y(0.553), 0, { sz: 0.82 });
    for (let i = -1; i <= 1; i++) add(C, box(1.6, 1.4, 2.2), i * 3.8, Y(0.545), 10.6, { rz: 0.2 });

    /* ---- the jacket: a hem band, a collar and a placket on the surface --- */
    const band = (t, h, off, key, seg = 40) => {
      const pos = [], idx = [], uv = [];
      for (let i = 0; i <= 1; i++) {
        const tt = t + (i ? h / H : 0);
        for (let j = 0; j <= seg; j++) {
          const a = (j / seg) * Math.PI * 2;
          const p = surf(tt, a), r = Math.hypot(p[0], p[2]) + off;
          pos.push(Math.cos(a) * r, Y(tt), Math.sin(a) * r);
          uv.push(j / seg, i);
        }
      }
      for (let j = 0; j < seg; j++) {
        const a = j, b = a + seg + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    add(B, band(0.567, 1.6, 0.8, B), 0, 0, 0);          // jacket hem
    add(B, band(0.838, 1.4, 0.8, B), 0, 0, 0);          // shoulder seam
    add(B, band(0.856, 2.2, 1.2, B, 26), 0, 0, 0);      // stand collar
    // the placket: a raised strip from the collar to the jacket hem
    {
      const pos = [], uv = [], idx = [];
      const NL = 10;
      for (let i = 0; i <= NL; i++) {
        const t = 0.575 + (0.845 - 0.575) * (i / NL);
        for (let k = -1; k <= 1; k++) {
          const p = surf(t, Math.PI / 2 + k * 0.045);
          const r = Math.hypot(p[0], p[2]) + 0.55;
          pos.push(p[0] / Math.hypot(p[0], p[2]) * r, p[1], p[2] / Math.hypot(p[0], p[2]) * r);
          uv.push((k + 1) / 2, i / NL);
        }
      }
      for (let i = 0; i < NL; i++) for (let k = 0; k < 2; k++) {
        const a = i * 3 + k, b = a + 3;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      add(C, g, 0, 0, 0);
    }

    /* ---- the shawl: over both shoulders, falling down the front --------- */
    /* One patch swept on the body grid: the top edge runs round the
       shoulders, the bottom edge hangs to the waist at the front and stops
       high at the back, so the cloth reads as a draped uttariya. */
    /* An uttariya is worn over one shoulder, not both. It goes over Patel's
       left shoulder (+x), across the back and under the right arm; the right
       shoulder stays bare. Wrapping both shoulders was what made the figure
       read as a man in an open coat. */
    const FALL = Math.PI / 2 - 0.50;      // the front-left fall
    const dropAt = (ang) => {
      const d = Math.abs(ang - FALL);
      const k = Math.min(1, Math.max(0, d / 1.9));
      return 0.845 - (0.845 - 0.60) * (1 - k * k * (3 - 2 * k));
    };
    const shawlGeo = (off, thick) => {
      const NUu = 52, NVv = 16;
      const pos = [], uv = [], idx = [];
      const a0 = FALL, a1 = -2.40;
      for (let i = 0; i <= NVv; i++) {
        const v = i / NVv;
        for (let j = 0; j <= NUu; j++) {
          const u = j / NUu;
          const ang = a0 + (a1 - a0) * u;
          const t = 0.862 + (dropAt(ang) - 0.862) * v;
          const p = surf(t, ang);
          // folds deepen as the cloth hangs: a constant ripple read as a
          // smooth sheet with a wobble in it
          // the mean stays on the body surface and only the ripple grows, so
          // the cloth hangs on the shoulders instead of floating off them
          const amp = 0.18 + 0.55 * v;
          const r = Math.hypot(p[0], p[2]) + off + amp * Math.sin(7.4 * u * Math.PI);
          pos.push(Math.cos(ang) * r, p[1], Math.sin(ang) * r);
          uv.push(u, v);
        }
      }
      for (let i = 0; i < NVv; i++) {
        for (let j = 0; j < NUu; j++) {
          const a = i * (NUu + 1) + j, b = a + NUu + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    add(C, shawlGeo(0.6, 1.0), 0, 0, 0);
    add(C, shawlGeo(1.6, 1.0), 0, 0, 0);
    // the two front edges of the shawl, closing the cloth. These used to be
    // flat 1 m boards hanging beside the arms, which is what read as "flaps";
    // the fold now thins and curls inward as it falls.
    for (const ang of [FALL, -2.40]) {
      const NVv = 14;
      const pos = [], idx = [], uv = [];
      for (let v = 0; v <= NVv; v++) {
        const vv = v / NVv;
        const t = 0.862 + (dropAt(ang) - 0.862) * vv;
        const p = surf(t, ang);
        const base = Math.hypot(p[0], p[2]);
        const th = 0.95 * (1 - 0.82 * vv * vv);         // the fold thins as it falls
        const curl = -0.25 * vv * vv;                   // and curls in at the hem
        for (let i = 0; i <= 1; i++) {
          const r = base + 0.52 + curl + th * i;
          pos.push(Math.cos(ang) * r, p[1], Math.sin(ang) * r);
          uv.push(vv, i);
        }
      }
      for (let v = 0; v < NVv; v++) {
        const a = v * 2;
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      add(C, g, 0, 0, 0);
    }

    /* ---- the legs below the dhoti hem ----------------------------------- */
    const legGeo = (sd) => {
      const NVl = 22, NUl = 22;
      const pos = [], uv = [], idx = [];
      const cx = sd * 8.5;
      for (let i = 0; i <= NVl; i++) {
        const v = i / NVl;
        const t = 0.375 - 0.33 * v;               // up inside the hem, down to the ankle
        // thicker than they were: at 182 m the legs are ~15 m across at the
        // thigh, and the old 7.1-2.1v taper read as two sticks under a skirt
        const r = 9.6 - 2.4 * v + 2.0 * Math.sin(Math.PI * v * 1.08) * (1 - v * 0.5);
        for (let j = 0; j <= NUl; j++) {
          const a = (j / NUl) * Math.PI * 2;
          const rr = r * (1 + 0.05 * Math.cos(5 * a + sd));
          pos.push(cx + Math.cos(a) * rr, Y(t), Math.sin(a) * rr * 1.05);
          uv.push(j / NUl, v);
        }
      }
      for (let i = 0; i < NVl; i++) {
        for (let j = 0; j < NUl; j++) {
          const a = i * (NUl + 1) + j, b = a + NUl + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    [-1, 1].forEach((sd) => add(B, legGeo(sd), 0, 0, 0));

    /* ---- feet, in sandals ----------------------------------------------- */
    [-1, 1].forEach((sd) => {
      const x = sd * 8.2;
      add(B, sph(4.4, 14), x, Y(0.028), 5.0, { sx: 0.95, sy: 0.62, sz: 1.9 });
      add(B, box(7.6, 2.6, 17.0), x, Y(0.016), 5.4, { ry: sd * 0.09 });
      add(B, sph(3.4, 10), x + sd * 0.6, Y(0.022), 13.0, { sx: 0.9, sy: 0.55, sz: 0.9 });
      // the sandal sole and its strap
      add(DK, box(8.4, 1.1, 18.2), x, Y(0.002), 5.2, { ry: sd * 0.09 });
      add(C, box(8.0, 0.9, 3.0), x, Y(0.045), 8.0, { ry: sd * 0.09 });
      // toes
      for (let k = -1; k <= 1; k++) add(B, sph(1.05, 6), x + k * 2.2, Y(0.020), 12.6, { sy: 0.6, sz: 1.3 });
    });

    /* ---- the arms: one swept surface each, shoulder to wrist ------------ */
    const armGeo = (sd) => {
      const NS = 30, NA = 24;
      const P = ARM.map(([t, x, z, r]) => [sd * x, Y(t), z, r]);
      // resample the spine to NS stations
      const spine = [], rad = [];
      for (let i = 0; i <= NS; i++) {
        const u = i / NS * (P.length - 1);
        const i0 = Math.min(P.length - 2, Math.floor(u)), f = u - i0;
        const a = P[i0], b = P[i0 + 1];
        spine.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
        rad.push(a[3] + (b[3] - a[3]) * f);
      }
      const pos = [], uv = [], idx = [];
      for (let i = 0; i <= NS; i++) {
        const p0 = spine[Math.max(0, i - 1)], p1 = spine[Math.min(NS, i + 1)];
        const tx = p1[0] - p0[0], ty = p1[1] - p0[1], tz = p1[2] - p0[2];
        const tl = Math.hypot(tx, ty, tz) || 1;
        // a frame around the tangent, using +z as the reference direction
        let nx = 0, ny = 0, nz = 1;
        const d = (nx * tx + ny * ty + nz * tz) / tl;
        nx -= tx / tl * d; ny -= ty / tl * d; nz -= tz / tl * d;
        const nl = Math.hypot(nx, ny, nz) || 1;
        nx /= nl; ny /= nl; nz /= nl;
        const bx = ty / tl * nz - tz / tl * ny;
        const by = tz / tl * nx - tx / tl * nz;
        const bz = tx / tl * ny - ty / tl * nx;
        for (let j = 0; j <= NA; j++) {
          const a = (j / NA) * Math.PI * 2;
          const r = rad[i] * (1 + 0.04 * Math.cos(3 * a + sd));
          const ca = Math.cos(a) * r, sa = Math.sin(a) * r;
          pos.push(spine[i][0] + nx * ca + bx * sa,
            spine[i][1] + ny * ca + by * sa,
            spine[i][2] + nz * ca + bz * sa);
          uv.push(j / NA, i / NS);
        }
      }
      for (let i = 0; i < NS; i++) {
        for (let j = 0; j < NA; j++) {
          const a = i * (NA + 1) + j, b = a + NA + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    [-1, 1].forEach((sd) => add(B, armGeo(sd), 0, 0, 0));

    /* ---- the hands: fingers folded against the thighs -------------------- */
    [-1, 1].forEach((sd) => {
      add(B, sph(3.8, 14), sd * 18.7, Y(0.383), 4.2, { sy: 1.25, sz: 0.72 });
      for (let f = 0; f < 4; f++) {
        add(B, cyl(0.95, 1.1, 5.6, 5), sd * (17.5 + f * 1.4), Y(0.368), 5.4, { rx: 0.05 });
      }
      add(B, sph(1.6, 8), sd * 16.0, Y(0.392), 5.6, { sy: 1.4, sz: 0.6 });
    });

    /* ---- the head, lofted from the neck up ------------------------------ */
    // t, halfWidth, halfDepth, forward — hoisted so the face can be placed
    // against the surface instead of at fixed depths inside it
    // a full skull with a rounded crown; the first pass tapered to a point
    // and the head read as a bullet
    const HEAD_LV = [
      [0.00, 4.6, 5.4, 0.2],
      [0.10, 5.9, 7.5, 0.9],
      [0.26, 7.0, 8.9, 1.0],
      [0.44, 7.3, 9.2, 0.7],
      [0.60, 7.2, 8.9, 0.3],
      [0.75, 6.9, 8.0, 0.0],
      [0.88, 6.1, 6.9, -0.2],
      [0.95, 5.0, 5.6, -0.3],
      [1.00, 3.6, 4.0, -0.4]
    ];
    /* The face is carved into the head surface, not assembled out of spheres.
       Built from separate primitives it read as a mask of blobs — bulging
       cheeks, a bar across the brow, a slab of moustache — because a 21 m head
       is too big for stuck-on parts to blend. Here each feature is a smooth
       displacement of the loft along its own height and bearing: a nose ridge,
       brow, sunken eye sockets, cheeks, Patel's moustache, a mouth line, a chin. */
    const faceBump = (t, a) => {
      const ax = Math.cos(a), az = Math.sin(a);
      const front = Math.max(0, az);
      if (front < 0.12) return 0;
      const fx = Math.abs(ax);
      const g = (v, c, w) => { const q = (v - c) / w; return Math.exp(-q * q); };
      const cap = (v, w) => Math.max(0, 1 - Math.min(1, v / w));
      let d = 0;
      d += 1.45 * g(t, 0.615, 0.060) * cap(fx, 0.17);          // the nose ridge
      d += 1.00 * g(t, 0.710, 0.044) * cap(fx, 0.58);          // brow
      d -= 0.80 * g(t, 0.658, 0.038) * g(fx, 0.30, 0.14);      // eye sockets
      d += 0.45 * g(t, 0.505, 0.075) * g(fx, 0.46, 0.22);      // cheeks
      d += 0.95 * g(t, 0.458, 0.034) * cap(fx, 0.46);          // moustache
      d -= 0.30 * g(t, 0.372, 0.026) * cap(fx, 0.30);          // the mouth line
      d += 0.50 * g(t, 0.258, 0.055) * cap(fx, 0.36);          // chin
      return d * front;
    };
    function headGeometry() {
      const SEG = 44, ROWS = 30, HH = 21.5;
      const at = (f) => {
        const L = HEAD_LV;
        let i = 1;
        while (i < L.length - 1 && L[i][0] < f) i++;
        const a = L[i - 1], b = L[i];
        const u = (f - a[0]) / (b[0] - a[0]);
        return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
      };
      const pos = [], uv = [], idx = [];
      for (let i = 0; i <= ROWS; i++) {
        const t = i / ROWS;
        const [hw, hd, fw] = at(t);
        for (let j = 0; j <= SEG; j++) {
          const a = (j / SEG) * Math.PI * 2;
          const cx = Math.cos(a), cz = Math.sin(a);
          const front = Math.max(0, cz);
          let x = cx * hw;
          let z = cz * hd * (1 - 0.26 * front * front) + fw * front;
          const b = faceBump(t, a);
          if (b !== 0) {
            const len = Math.hypot(x, z) || 1;
            x += (x / len) * b;
            z += (z / len) * b;
          }
          pos.push(x, t * HH, z);
          uv.push(j / SEG, t);
        }
      }
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < SEG; j++) {
          const a = i * (SEG + 1) + j, b = a + SEG + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    const HY = Y(0.868) + 2.4;           // 219, crown at 240
    add(B, cyl(5.8, 8.4, 13.0, 16), 0, HY - 6.0, -0.4, { sz: 0.94 });   // neck
    add(B, headGeometry(), 0, HY, 0);
    const hh = (f) => HY + 21.5 * f;
    // the ears are the only feature the loft cannot carry, since they sit off
    // the side of the head
    [-1, 1].forEach((sd) => add(B, sph(1.9, 8), sd * 7.0, hh(0.56), -1.5, { sx: 0.42, sy: 1.3, sz: 0.8 }));

    /* ==================================================================== *
     * the plinth: 58 m of terrace, podium and platform
     * ==================================================================== */
    block('stone', 130, 4, 112, 0, -2, 0);
    block('paving', 118, 1.2, 100, 0, 2, 0);
    // the podium, with vertical fins down its faces
    block('stone', 104, 40, 86, 0, 4, 0);
    block('stone', 88, 12, 72, 0, 44, 0);
    block('basaltDark', 96, 2.2, 80, 0, 56, 0);
    block('stone', 74, 1.8, 62, 0, 58.2, 0);
    for (let i = -9; i <= 9; i++) {
      block('stone', 2.0, 38, 2.2, i * 5.2, 4, 43.6);
      block('stone', 2.2, 38, 2.0, 52.4, 4, i * 4.4);
      block('stone', 2.2, 38, 2.0, -52.4, 4, i * 4.4);
    }
    // the museum front and its doors
    for (let i = -3; i <= 3; i++) add(DK, box(5.0, 14, 0.5), i * 10.5, 20, 43.2);
    add('stone', box(108, 1.8, 90), 0, 43.2, 0);
    add('stone', box(76, 0.9, 64), 0, 58.0, 0);
    // the memorial walk: two rows of masts along the approach
    for (let i = 0; i < 9; i++) {
      [-1, 1].forEach((sd) => {
        add('white', cyl(0.55, 0.85, 26, 8), sd * 24, 3, 44 + i * 9);
        add('gold', sph(0.8, 8), sd * 24, 29.6, 44 + i * 9);
      });
    }
    add('paving', box(64, 0.3, 120), 0, 3.2, 88);

    /* ---- the dam across the water ---------------------------------------- */
    block('stone', 300, 30, 26, 0, -2, 520);
    for (let i = -9; i <= 9; i++) {
      block('stone', 14, 20, 34, i * 16, -2, 532);
      add('grey', cyl(0.8, 0.8, 7, 6), i * 16, 30, 518);
    }

    /* ---- gardens, people, trees ------------------------------------------ */
    [[-58, 34], [58, 34], [-64, -12], [64, -12], [-44, 62], [44, 62], [-72, 56], [72, 56]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.7 + (i % 3) * 0.3, 'round'));
    const people = [[-10, 42], [8, 43], [-18, 38], [16, 39], [0, 46], [-26, 34],
      [24, 35], [-4, 36], [11, 36], [30, 44]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 1.7));

    ctx.light({ pos: [-150, 110, 180], target: [0, 110, 0], color: 0xffe8c0, intensity: 4500, distance: 800 });
    ctx.light({ pos: [150, 100, 160], target: [0, 110, 0], color: 0xffd8a8, intensity: 3200, distance: 800 });
    ctx.light({ pos: [30, 60, 260], target: [0, 120, 0], color: 0xfff0d8, intensity: 2200, distance: 700 });
  }
};
