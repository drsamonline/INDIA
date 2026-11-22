/* Victoria Memorial — Kolkata · procedural miniature
   Indo-Saracenic marble memorial on the Maidan, 1906–1921.
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions, 1 unit = 1 metre.
   ----------------------------------------------------------------
   plan          103.0 x 69.0 m   (338 x 228 ft)
   terrace       120.7 x 86.3 m   (396 x 283 ft)
   wing parapet   25.6 m          hall cornice   31.0 m
   dome springs   39.7 m          dome apex      52.3 m
   lantern top    56.08 m         angel head     60.96 m  (angel 4.88 m)
   central chamber 19.5 m (64 ft) across · dome 18.5 m (61 ft) across
   ---------------------------------------------------------------- */

export default {
  id: 'victoria-memorial',
  accent: '#d8d2c4',
  accent2: '#f0e8d8',
  seed: 23,
  floodScale: 0.3,
  bounds: 150,
  minDist: 30,
  maxDist: 520,
  home: { pos: [110, 46, 230], target: [0, 30, 10], fov: 32 },
  ground: { texture: 'grass', size: 2200, color: 0x8b9468 },
  floods: [
    { pos: [-104, 34, 118], target: [0, 34, 0], color: 0xffd9ae, intensity: 3400, distance: 460 },
    { pos: [106, 32, 96], target: [0, 36, 0], color: 0xffe2bc, intensity: 2800, distance: 460 },
    { pos: [0, 18, 168], target: [0, 34, 26], color: 0xffd2a0, intensity: 2000, distance: 360 }
  ],
  views: [
    { name: 'Full', pos: [110, 46, 230], target: [0, 30, 10] },
    { name: 'Dome', pos: [38, 62, 92], target: [0, 45, 0] },
    { name: 'Facade', pos: [10, 15, 96], target: [0, 20, 20] },
    { name: 'Angel', pos: [13, 62, 27], target: [0, 57, 0] },
    { name: 'Pool', pos: [22, 6, 128], target: [0, 24, 34] }
  ],
  tour: [
    {
      title: 'A Memorial to an Empress', deva: 'विक्टोरिया मेमोरियल',
      text: 'The Victoria Memorial was proposed by Lord Curzon after Queen Victoria died in 1901, and built between 1906 and 1921 as a memorial to the Empress of India. Martin & Co. of Calcutta were the contractors for the superstructure, which went up from 1910.',
      pos: [72, 34, 128], target: [0, 25, 2], time: 16.8
    },
    {
      title: 'The Dome and the Angel', deva: 'गुंबद',
      text: 'The central dome is cut from Makrana marble, the same stone as the Taj Mahal. On its summit stands the bronze Angel of Victory, 4.9 metres tall, mounted on bearings so that it turns with the wind.',
      pos: [40, 48, 76], target: [0, 44, 0], time: 15.2
    },
    {
      title: 'Two Architects', deva: 'स्थापत्य',
      text: 'William Emerson designed the memorial with Vincent Esch, blending Indo-Saracenic forms with Mughal detail — high arcades, corner domes, domed chhatris and a long reflecting pool aligned on the Maidan.',
      pos: [-30, 16, 92], target: [0, 16, 8], time: 11.5
    },
    {
      title: 'The Arcaded Verandah', deva: 'बरामदा',
      text: 'Deep verandahs of pointed arches and slim columns run the whole length of the building, wrapping the hall in shade. Above them a band of small windows sits under the cornice and its parapet.',
      pos: [34, 11, 62], target: [8, 11, 30], time: 9.4
    },
    {
      title: 'The Reflecting Pool', deva: 'जलाशय',
      text: 'A long rectangular tank lies on the axis in front of the memorial, mirroring the dome. It is set in 26 hectares of gardens on the Maidan, the great open ground of central Kolkata.',
      pos: [22, 7, 120], target: [0, 22, 30], time: 17.6
    },
    {
      title: 'A Museum Since 1947', deva: 'संग्रहालय',
      text: 'Since independence the memorial has been a museum under the Ministry of Culture, holding paintings, sculpture, manuscripts and memorabilia of the colonial period. It is the largest monument to a monarch anywhere in the world.',
      pos: [-46, 20, 74], target: [-4, 18, 16], time: 13.6
    },
    {
      title: 'Marble at Night', deva: 'रात्रि',
      text: 'Floodlights pick out the ribs of the dome and the arcade after dark, and the pool carries the whole lit facade a second time. The gardens close late; the Maidan around them stays open.',
      pos: [64, 30, 120], target: [0, 28, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, cone, sph, plane, arch, archFrame, block, col, torus, THREE } = ctx;
    const PI = Math.PI;

    /* ---- ribbed dome: a full-shouldered profile with radial ribs -------- */
    function ribbedDome(r, h, ribs, amp, rings = 12) {
      const seg = ribs * 3;
      const pos = [], uv = [], idx = [];
      for (let j = 0; j <= rings; j++) {
        const v = j / rings, a = v * PI / 2;
        const y = Math.sin(a) * h;
        const rad = Math.pow(Math.cos(a), 0.72) * r;
        for (let i = 0; i <= seg; i++) {
          const t = (i / seg) * PI * 2;
          const rr = rad * (1 + amp * Math.cos(ribs * t));
          pos.push(Math.cos(t) * rr, y, Math.sin(t) * rr);
          uv.push(i / seg, v);
        }
      }
      for (let j = 0; j < rings; j++) {
        for (let i = 0; i < seg; i++) {
          const a0 = j * (seg + 1) + i, b0 = a0 + seg + 1;
          idx.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    /* ---- the measured stack -------------------------------------------- */
    const T = 1.8;                 // top of the terrace
    const LEN = 103, DEP = 69;     // plan
    const WZ = 22.5, WD = 22;      // wing centre-line and depth
    const TX = 46, TZ = 29, TW = 11;   // corner towers
    const COLZ = 34.2;             // colonnade line on the outer face
    const ATTIC = 21.0;            // top of the wing attic
    const HALL = 29.5;             // top of the hall block
    const ATT = 39.7;              // dome springs
    const DR = 9.25, DH = 12.6;    // dome radius / rise  (18.5 m across)
    const APEX = ATT + DH;         // 52.3
    const LANT = 56.08;            // base of the Angel of Victory
    const ANG = 4.88;

    /* ================= terrace ================= */
    block('stone', 120.7, 0.7, 86.3, 0, 0, 0);
    block('marble', 118.4, 1.1, 84.0, 0, 0.7, 0);
    block('marbleWarm', 119.4, 0.16, 85.0, 0, 1.64, 0);
    // broad flight up to the terrace on the axis
    for (let i = 0; i < 5; i++) {
      block('marble', 40 - i * 1.1, T * (5 - i) / 5, 1.6, 0, 0, 43.2 + i * 1.55);
    }

    /* ================= the two long ranges ================= */
    function range(sz) {
      const zc = sz * WZ;
      const zOut = sz * (DEP / 2);        // 34.5
      // solid mass behind the verandah
      block('marble', LEN, ATTIC - T, WD, 0, T, zc);
      // colonnade of slim columns on the outer face
      const runs = [[-40.5, -13.5], [13.5, 40.5]];
      for (const [x0, x1] of runs) {
        const n = 4, sp = (x1 - x0) / n;
        for (let i = 0; i <= n; i++) {
          const x = x0 + i * sp;
          col('marble', 0.56, 0.66, 9.4, x, T, COLZ * sz, 8);
          block('marbleWarm', 1.6, 0.5, 1.6, x, T, COLZ * sz);
          block('marbleWarm', 1.7, 0.55, 1.7, x, T + 9.4, COLZ * sz);
        }
        for (let i = 0; i < n; i++) {
          const x = x0 + (i + 0.5) * sp;
          const ry = sz > 0 ? 0 : PI;
          add('dark', arch(5.5, 9.3, 0.25), x, T + 0.15, zOut - sz * 1.05, { ry });
          add('marble', archFrame(6.2, 9.8, 0.34, 0.42), x, T + 0.15, zOut - sz * 0.95, { ry });
        }
        // entablature carried on the colonnade
        block('marbleWarm', x1 - x0 + 1.2, 1.7, 3.6, (x0 + x1) / 2, T + 9.95, zOut - sz * 1.8);
        // string course, then the attic band with framed windows
        block('marbleWarm', x1 - x0 + 1.2, 0.55, 1.1, (x0 + x1) / 2, 13.2, zOut - sz * 0.45);
        for (let i = 0; i < n; i++) {
          const x = x0 + (i + 0.5) * sp;
          add('dark', box(2.2, 4.2, 0.25), x, 16.9, zOut - sz * 0.98);
          add('marbleWarm', box(2.2, 0.45, 0.55), x, 19.2, zOut - sz * 0.9);   // lintel
          add('marbleWarm', box(3.0, 0.4, 0.7), x, 19.6, zOut - sz * 0.85);    // cornice over
          add('marbleWarm', box(0.42, 4.4, 0.55), x - 1.35, 16.9, zOut - sz * 0.9);
          add('marbleWarm', box(0.42, 4.4, 0.55), x + 1.35, 16.9, zOut - sz * 0.9);
          add('marbleWarm', box(3.0, 0.35, 0.75), x, 14.6, zOut - sz * 0.85);  // sill
        }
        // pilaster strips between the bays
        for (let i = 0; i <= n; i++) {
          const x = x0 + i * sp;
          block('marble', 1.1, 7.6, 0.7, x, 13.5, zOut - sz * 0.4);
        }
      }
      // plain recessed wall closing the verandah at the ends
      for (const s of [-1, 1]) {
        block('marble', 1.2, 9.4, WD - 1.4, s * 51.0, T, zc);
      }
      // cornice over the whole range, then the pierced parapet
      block('marbleWarm', LEN + 1.4, 1.6, WD + 3.6, 0, ATTIC, zc);
      block('marble', LEN + 0.6, 0.9, WD + 3.0, 0, ATTIC + 1.6, zc);
      for (let i = 0; i < 24; i++) {
        const x = (i - 11.5) * 4.35;
        add('jaliWhite', box(3.5, 2.1, 0.22), x, 24.55, zOut - sz * 0.55);
      }
      for (let i = 0; i < 25; i++) {
        add('marble', box(0.5, 2.1, 0.5), (i - 12) * 4.35, 24.55, zOut - sz * 0.55);
      }
      block('marbleWarm', LEN + 0.2, 0.4, WD + 3.2, 0, 25.6, zc);
      for (let i = 0; i < 12; i++) {
        const x = (i - 5.5) * 8.7;
        add('marble', cyl(0.44, 0.55, 1.3, 6), x, 26.0, zOut - sz * 0.55);
        add('gold', sph(0.24, 8), x, 27.4, zOut - sz * 0.55);
      }
      // inner face: plain attic wall with windows over the courtyard
      for (let i = 0; i < 8; i++) {
        const x = (i - 3.5) * 8.6;
        add('dark', box(2.0, 3.6, 0.25), x, 16.4, zc - sz * (WD / 2 - 0.1));
      }
    }
    range(1);
    range(-1);

    /* ================= curved colonnades closing the ends ================= */
    function endPorch(sx) {
      const N = 8;
      for (let i = 0; i <= N; i++) {
        const u = (i / N) * 2 - 1;
        const z = 10.5 * u;
        const x = sx * (51.5 - 4.0 * (1 - u * u));
        const dz = i < N ? 10.5 * (2 / N) : 0;
        col('marble', 0.55, 0.65, 10.6, x, T, z, 8);
        if (i < N) {
          const u2 = ((i + 1) / N) * 2 - 1;
          const z2 = 10.5 * u2, x2 = sx * (51.5 - 4.0 * (1 - u2 * u2));
          const mx = (x + x2) / 2, mz = (z + z2) / 2;
          const ang = Math.atan2(x2 - x, z2 - z);
          add('dark', box(0.25, 9.6, Math.hypot(x2 - x, z2 - z) * 0.92), mx, T + 4.8, mz, { ry: ang });
          add('marble', box(0.5, 0.7, Math.hypot(x2 - x, z2 - z) + 0.4), mx, T + 9.9, mz, { ry: ang });
        }
        void dz;
      }
      // entablature + parapet sweeping with the colonnade
      for (let i = 0; i < N; i++) {
        const u = (i / N) * 2 - 1, u2 = ((i + 1) / N) * 2 - 1;
        const z = 10.5 * u, x = sx * (51.5 - 4.0 * (1 - u * u));
        const z2 = 10.5 * u2, x2 = sx * (51.5 - 4.0 * (1 - u2 * u2));
        const mx = (x + x2) / 2, mz = (z + z2) / 2;
        const len = Math.hypot(x2 - x, z2 - z) + 0.5;
        const ang = Math.atan2(x2 - x, z2 - z);
        block('marbleWarm', 2.6, 1.4, len, mx, T + 10.6, mz, { ry: ang });
        block('marble', 1.6, 1.3, len, mx, T + 12.0, mz, { ry: ang });
      }
    }
    endPorch(1);
    endPorch(-1);

    /* ================= the hall block (the crossbar of the H) =================
       solid spine, with the two entrance bays genuinely hollowed so the
       great arch has depth behind it */
    block('marble', 27, HALL - T, 60, 0, T, 0);
    const AWC = 13, AHT = 22.2;               // arch width / height
    for (const sz of [1, -1]) {
      const zc = sz * 32.25;                  // end wall 30 .. 34.5
      const ry = sz > 0 ? 0 : PI;
      for (const s of [-1, 1]) block('marble', 7.0, HALL - T, 4.5, s * 10.0, T, zc);
      block('marble', 27, HALL - T - AHT, 4.5, 0, T + AHT, zc);
      // the opening, its archivolt and the shadowed porch behind
      add('dark', box(AWC, AHT + 0.6, 0.3), 0, T + AHT / 2, sz * 30.2);
      add('dark', arch(AWC, AHT, 0.3), 0, T + 0.05, sz * 30.05, { ry });
      add('marble', archFrame(14.4, 23.6, 0.75, 0.7), 0, T + 0.05, sz * 34.45, { ry });
      add('marbleWarm', archFrame(12.4, 21.6, 0.42, 0.5), 0, T + 0.05, sz * 33.1, { ry });
      // porch: floor, colonnade, gallery across the arch
      block('marbleWarm', AWC, 0.3, 4.4, 0, T, zc);
      for (const s of [-1, 1]) {
        for (const t of [1.9, 4.9]) {
          add('marble', cyl(0.42, 0.5, 8.6, 8), s * t, T + 0.3, sz * 33.6);
        }
      }
      block('marbleWarm', AWC + 0.8, 0.7, 1.8, 0, T + 9.0, sz * 33.2);
      block('marble', AWC + 0.4, 0.45, 2.6, 0, T + 12.6, sz * 33.0);
      for (let i = 0; i < 9; i++) {
        add('marble', cyl(0.13, 0.16, 0.9, 5), (i - 4) * 1.45, T + 13.05, sz * 33.4);
      }
      add('dark', arch(11.6, 19.4, 0.3), 0, T + 0.4, sz * 30.4, { ry });
      // flanking pilasters and the group over the arch
      for (const s of [-1, 1]) {
        block('marbleWarm', 2.8, HALL - T, 1.2, s * 11.4, T, sz * 34.3);
        block('marbleWarm', 3.6, 0.6, 1.7, s * 11.4, T + HALL - T, sz * 34.3);
      }
      block('marbleWarm', 27, 1.6, 1.6, 0, 27.6, sz * 34.2);
      block('marble', 10, 1.3, 1.4, 0, 29.2, sz * 34.2);
      for (const s of [-1, 1]) {
        block('marble', 1.4, 1.5, 1.0, s * 1.8, 29.3, sz * 34.1, { rz: s * 0.2 });
        add('marble', sph(0.5, 8), s * 1.8, 30.6, sz * 34.1);
      }
    }
    // cornice of the hall block
    block('marbleWarm', 28.6, 1.5, 66, 0, HALL, 0);
    block('marble', 27.6, 0.9, 65, 0, HALL + 1.5, 0);

    /* ================= attic, drum, and the four subsidiary domes ========= */
    block('marble', 20, 2.2, 20, 0, HALL + 2.4, 0);            // 31.9 .. 34.1
    block('marbleWarm', 21.4, 0.8, 21.4, 0, HALL + 4.6, 0);    // 34.1 .. 34.9
    for (let i = 0; i < 24; i++) {                              // attic balustrade
      const a = (i / 24) * PI * 2;
      const bx = Math.cos(a), bz = Math.sin(a);
      const t = Math.max(Math.abs(bx), Math.abs(bz));
      add('marble', cyl(0.15, 0.19, 1.0, 5), bx / t * 10.4, 34.9, bz / t * 10.4);
    }
    // four allegorical groups (Art, Architecture, Justice, Charity)
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      block('marble', 2.4, 1.5, 1.8, sx * 8.2, 34.9, sz * 8.2, { ry: Math.atan2(sz, sx) });
      add('marble', sph(0.66, 8), sx * 8.2, 37.0, sz * 8.2);
      add('marble', box(0.45, 1.1, 0.45), sx * 8.2, 36.4, sz * 8.2, { rz: 0.3 });
    }
    // the drum that carries the dome
    add('marble', cyl(DR, DR + 0.55, ATT - 34.9, 20), 0, 34.9, 0);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * PI * 2 + PI / 10;
      add('marbleWarm', box(1.0, ATT - 34.9, 0.7), Math.cos(a) * (DR + 0.1), (34.9 + ATT) / 2, Math.sin(a) * (DR + 0.1), { ry: -a });
      add('dark', box(1.6, 2.0, 0.4), Math.cos(a + PI / 10) * (DR + 0.2), ATT - 1.6, Math.sin(a + PI / 10) * (DR + 0.2), { ry: -a - PI / 10 });
    }
    // four subsidiary octagonal domes clustered round the great one
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = sx * 10.2, z = sz * 10.2;
      block('marble', 6.2, 1.2, 6.2, x, 34.1, z);
      add('marble', cyl(2.9, 3.2, 2.6, 8), x, 35.3, z);
      add('marbleWarm', cyl(3.45, 3.45, 0.6, 8), x, 37.9, z);
      add('marble', ctx.onion(3.25, 4.4, 16), x, 38.5, z);
      add('gold', cyl(0.15, 0.15, 1.0, 6), x, 42.9, z);
      add('gold', sph(0.28, 8), x, 43.8, z);
    }

    /* ================= the great dome ================= */
    add('marbleWarm', cyl(DR + 0.55, DR + 0.75, 1.1, 24), 0, ATT - 0.9, 0);
    add('marble', ribbedDome(DR, DH, 24, 0.045, 12), 0, ATT, 0);
    // ring of small pinnacles at the springing
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * PI * 2;
      add('marble', cyl(0.3, 0.36, 1.4, 5), Math.cos(a) * (DR + 0.2), ATT + 0.4, Math.sin(a) * (DR + 0.2));
      add('marbleWarm', sph(0.3, 6), Math.cos(a) * (DR + 0.2), ATT + 2.0, Math.sin(a) * (DR + 0.2));
    }

    /* ================= lantern, revolving base, Angel of Victory ========= */
    (function lantern() {
      const y0 = APEX - 0.2;
      add('marble', cyl(1.9, 2.3, 0.5, 12), 0, y0, 0);
      // colonnaded cupola
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2;
        add('marble', cyl(0.16, 0.18, 2.1, 6), Math.cos(a) * 1.65, y0 + 0.5, Math.sin(a) * 1.65);
      }
      add('marbleWarm', cyl(2.05, 2.05, 0.32, 12), 0, y0 + 2.6, 0);
      add('marble', ctx.onion(1.95, 1.9, 14), 0, y0 + 2.9, 0);
      // the drum on ball bearings that the angel turns on
      add('marbleWarm', cyl(1.35, 1.6, 0.45, 12), 0, LANT - 0.45, 0);
      add('bronze', cyl(0.95, 1.15, 0.35, 12), 0, LANT - 0.02, 0);
    })();

    (function angel(y0) {
      // the bronze figure is 4.88 m tall, wings spread, one arm raised
      add('bronze', cone(1.05, 1.5, 10), 0, y0 + 0.75, 0);        // robe hem
      add('bronze', cyl(0.62, 1.0, 1.9, 10), 0, y0 + 1.45, 0);    // body
      add('bronze', cyl(0.36, 0.5, 0.55, 8), 0, y0 + 2.95, 0);    // shoulders
      add('bronze', sph(0.42, 10), 0, y0 + 3.72, 0);              // head
      for (const s of [-1, 1]) {
        add('bronze', box(0.2, 1.6, 0.2), s * 0.55, y0 + 3.4, 0.16, { rz: s * 0.62 });
      }
      // wings swept up and back, ~2.9 m span
      for (const s of [-1, 1]) {
        add('bronze', box(2.5, 1.5, 0.14), s * 1.25, y0 + 3.35, -0.4, { rz: s * 0.36, ry: s * 0.34 });
        add('bronze', box(1.7, 0.8, 0.12), s * 2.25, y0 + 2.5, -0.55, { rz: s * 0.66, ry: s * 0.34 });
      }
      // trailing drapery
      add('bronze', box(0.9, 1.3, 0.12), 0.2, y0 + 1.1, -0.55, { rz: 0.16 });
    })(LANT);

    /* ================= the four corner towers ================= */
    function tower(x, z) {
      const ox = Math.sign(x), oz = Math.sign(z);
      block('marble', TW, 34.7, TW, x, T, z);                       // shaft T..36.5
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        block('marbleWarm', 1.7, 34.7, 1.7, x + dx * (TW / 2 - 0.85), T, z + dz * (TW / 2 - 0.85));
      }
      for (const y of [11.5, 19.5, 27.5, 35.0]) {
        block('marbleWarm', TW + 1.3, 0.85, TW + 1.3, x, y, z);
      }
      // windows on the two outward faces, one per stage
      for (const y of [14.4, 22.4, 30.2]) {
        add('dark', box(1.9, 3.4, 0.24), x, y, z + oz * (TW / 2 + 0.02));
        add('dark', box(0.24, 3.4, 1.9), x + ox * (TW / 2 + 0.02), y, z);
        add('marbleWarm', box(2.5, 0.4, 0.4), x, y + 2.0, z + oz * (TW / 2 + 0.1));
      }
      // belvedere: an open arched stage on four corner columns
      block('marble', TW - 3.4, 6.9, TW - 3.4, x, 36.5, z);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2 + PI / 4;
        add('dark', box(3.6, 5.6, 0.25), x + Math.cos(a) * (TW / 2 - 0.85), 39.1, z + Math.sin(a) * (TW / 2 - 0.85), { ry: -a + PI / 2 });
      }
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        col('marbleWarm', 0.52, 0.6, 6.9, x + dx * (TW / 2 - 0.9), 36.5, z + dz * (TW / 2 - 0.9), 6);
        block('marbleWarm', 1.3, 0.5, 1.3, x + dx * (TW / 2 - 0.9), 43.4, z + dz * (TW / 2 - 0.9));
        // small domed pinnacles at the belvedere corners
        add('marble', cyl(0.66, 0.74, 0.9, 8), x + dx * (TW / 2 - 0.2), 43.9, z + dz * (TW / 2 - 0.2));
        add('marble', ctx.onion(0.74, 1.6, 10), x + dx * (TW / 2 - 0.2), 44.8, z + dz * (TW / 2 - 0.2));
      }
      block('marbleWarm', TW + 1.2, 1.1, TW + 1.2, x, 43.4, z);
      // drum and the Mughal onion dome
      add('marble', cyl(4.0, 4.5, 1.2, 8), x, 44.5, z);
      add('marbleWarm', cyl(4.55, 4.55, 0.4, 8), x, 45.7, z);
      add('marble', ctx.onion(4.3, 5.0, 18), x, 46.0, z);
      add('gold', cyl(0.17, 0.17, 1.1, 6), x, 50.9, z);
      add('gold', sph(0.34, 8), x, 51.8, z);
      add('gold', cone(0.22, 0.65, 6), x, 52.6, z);
    }
    tower(TX, TZ); tower(-TX, TZ); tower(TX, -TZ); tower(-TX, -TZ);

    /* ================= the two tanks and the marble bridge ================ */
    const PW = 26;
    for (const [z0, z1] of [[52, 88], [96, 132]]) {
      const cz = (z0 + z1) / 2, len = z1 - z0;
      add('water', plane(PW - 3, len - 3), 0, 0.42, cz, { rx: -PI / 2 });
      block('marble', 2.2, 1.0, len, PW / 2, 0, cz);
      block('marble', 2.2, 1.0, len, -PW / 2, 0, cz);
      block('marble', PW + 2.2, 1.0, 2.2, 0, 0, z0);
      block('marble', PW + 2.2, 1.0, 2.2, 0, 0, z1);
      block('marbleWarm', 2.7, 0.16, len + 1, PW / 2, 1.0, cz);
      block('marbleWarm', 2.7, 0.16, len + 1, -PW / 2, 1.0, cz);
    }
    // bridge between the tanks, carrying Frampton's seated Queen Victoria
    block('marble', PW + 4, 1.15, 8, 0, 0, 92);
    for (const s of [-1, 1]) block('marbleWarm', 1.2, 1.5, 8, s * (PW / 2 + 1.4), 1.15, 92);
    block('marble', 4.2, 1.1, 4.2, 0, 1.15, 92);
    add('bronze', cyl(0.9, 1.2, 1.4, 8), 0, 3.1, 92);
    add('bronze', sph(0.45, 10), 0, 4.9, 92);
    add('bronze', box(1.5, 0.7, 0.9), 0, 3.9, 92);

    // clipped hedges along the axis
    for (let i = 0; i < 14; i++) {
      const z = 50 + i * 6.2;
      for (const s of [-1, 1]) block('green', 1.8, 1.05, 5.2, s * 16.6, 0, z);
    }

    /* ================= gardens ================= */
    add('foliage', plane(44, 108), 42, 0.14, 108, { rx: -PI / 2 });
    add('foliage', plane(44, 108), -42, 0.14, 108, { rx: -PI / 2 });
    add('foliage', plane(140, 40), 0, 0.14, -74, { rx: -PI / 2 });
    add('foliage', plane(36, 60), 62, 0.14, 30, { rx: -PI / 2 });
    add('foliage', plane(36, 60), -62, 0.14, 30, { rx: -PI / 2 });

    const trees = [
      [30, 58], [-30, 58], [30, 82], [-30, 82], [30, 108], [-30, 108], [30, 134], [-30, 134],
      [58, 62], [-58, 62], [58, 104], [-58, 104], [64, 34], [-64, 34],
      [46, -60], [-46, -60], [20, -58], [-20, -58], [70, 6], [-70, 6]
    ];
    trees.forEach(([x, z], i) => {
      const s = 1.0 + ((i * 37) % 7) / 13;
      ctx.tree(x, z, s, i % 7 === 3 ? 'palm' : 'round');
    });

    [[-17, 48], [17, 48], [-15, 74], [15, 74], [-15, 112], [15, 112], [-15, 142], [15, 142],
      [-34, 40], [34, 40], [-52, 44], [52, 44]]
      .forEach(([x, z]) => ctx.lamp(x, z, 3.8, 'black'));

    const people = [
      [3, 48, 'fabricWhite'], [-5, 47, 'fabricSaffron'], [8, 50, 'fabricRed'], [-9, 51, 'fabricWhite'],
      [2, 64, 'fabricRed'], [-3, 70, 'fabricWhite'], [6, 78, 'fabricSaffron'], [-6, 86, 'fabricWhite'],
      [4, 100, 'fabricRed'], [-4, 110, 'fabricSaffron'], [7, 122, 'fabricWhite'], [-7, 134, 'fabricRed'],
      [18, 56, 'fabricWhite'], [-18, 58, 'fabricSaffron'], [26, 44, 'fabricRed'], [-26, 46, 'fabricWhite']
    ];
    people.forEach(([x, z, k], i) => ctx.person(x, z, i * 1.1, k, 0.94 + (i % 3) * 0.06));

    /* benches and urns on the terrace */
    for (const s of [-1, 1]) {
      block('stone', 3.2, 0.5, 0.9, s * 26, T, 40);
      add('stone', cyl(0.9, 0.6, 1.0, 10), s * 26, T + 1.5, 40);
    }
  }
};
