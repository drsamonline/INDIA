/* Somnath Temple — Prabhas Patan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured proportions (1 unit = 1 m). The Shree Somnath Trust gives
   the spire about 155 ft (47 m) above the ground and the flagstaff 27 ft
   (8.2 m); the widely quoted figure is 50 m. The tower itself stands about
   15 m above the sanctum (Wikipedia), so the sanctum walls carry the tower to
   a great height — this is a two-level temple, and the body is much taller
   than the spire.

   Datum:
     terrace top              2.7
     mandapa lower storey     2.7 – 13.4    (10.7 m of open verandah)
     mandapa upper storey    14.9 – 23.3    (8.4 m)
     mandapa roof apex       34.5           (clustered spire roof)
     sanctum wall top        31.2
     shikhara                31.4 – 46.4    (15 m, square plan, 22 m base)
     amalaka + kalasha       46.4 – 50.2    (the quoted ~50 m)
     flagstaff top           58.4           (50 + 8.2 m)                        */

export default {
  id: 'somnath-temple',
  accent: '#c3ad8c',
  accent2: '#e4d2b4',
  seed: 107,
  floodScale: 0.3,
  time: 15.4,          // a warm afternoon: at 10.6 the pale stone read grey-brown
  bounds: 82,
  minDist: 20,
  maxDist: 300,
  home: { pos: [74, 30, 98], target: [0, 24, 2], fov: 40 },
  // a stone precinct, not the brown checkerboard the paving texture made of it
  ground: { texture: 'stone', size: 2400, color: 0xc9c1b1, tile: 30 },
  // The sea sat at y -0.5, which is BELOW the engine's ground plane at -0.02,
  // so it never rendered: the site read as a desert plain with no water in
  // sight. It is 0.08 above the plane now, behind the sea wall at z -36.
  // the near edge sits behind the sea wall at z -36, and it runs to the horizon
  water: { y: 0.08, size: 1200, z: -640, color: 0x1d4653, distortion: 2.8 },
  views: [
    { name: 'Full', pos: [74, 30, 98], target: [0, 24, 2] },
    { name: 'Shikhara', pos: [22, 40, 48], target: [0, 36, -14] },
    { name: 'Mandapa', pos: [0, 11, 44], target: [0, 13, 2] },
    { name: 'From the sea', pos: [-32, 16, -74], target: [0, 24, -4] },
    { name: 'Flag', pos: [16, 52, 32], target: [0, 48, -14] }
  ],
  tour: [
    {
      title: 'The First Jyotirlinga', deva: 'सोमनाथ',
      text: 'Somnath, at Prabhas Patan on the Saurashtra coast, is the first of the twelve Jyotirlingas of Shiva. It has been destroyed and rebuilt repeatedly, most famously sacked by Mahmud of Ghazni in 1026.',
      pos: [51, 26.5, 93], target: [0, 22, 0], time: 17.4
    },
    {
      title: 'Fifty Metres', deva: 'शिखर',
      text: 'The present temple was rebuilt between 1950 and 1951 on the initiative of Sardar Vallabhbhai Patel, in the Kailash Mahameru Prasad style: a 50-metre shikhara of carved grey sandstone rising over the sanctum.',
      pos: [18, 40, 44], target: [0, 34, 0], time: 12
    },
    {
      title: 'The Pillared Hall', deva: 'सभा मंडप',
      text: 'A pillared hall of polished stone stands in front of the sanctum, its ceiling carried on carved columns, with the Nandi facing the shrine.',
      pos: [0, 12, 46], target: [0, 12, 0], time: 9.6
    },
    {
      title: 'Beside the Sea', deva: 'समुद्र',
      text: 'The temple stands within sight of the Arabian Sea, and the granite for the present building was brought from the other side of the continent.',
      pos: [-20, 12, -66], target: [0, 20, 0], time: 18.2
    },
    {
      title: 'The Flag', deva: 'ध्वज',
      text: 'A flag flies from the spire and is changed three times a day, each time to the sound of conches and drums.',
      pos: [10, 46, 26], target: [0, 46, 0], time: 16.8
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit after dark, the shikhara is visible along the coast, and the evening aarti draws crowds to the steps.',
      pos: [47, 24, 85], target: [0, 24, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, block, col, torus } = ctx;

    /* A pale warm sandstone, not the dark grey it was rendering: Somnath is
       built of light stone, and the carving reads only when the mass is light. */
    const tint = (base, col, rough) => {
      const mm = ctx.mat(base);
      if (!mm || !mm.clone) return base;
      const c = mm.clone();
      c.color.setHex(col);
      if (rough !== undefined) c.roughness = rough;
      return c;
    };
    // Cloned from 'cream', which has no texture map. Off 'basalt' the stone
    // map multiplied the hex down by half, which is why the temple kept
    // rendering grey-brown however light the tint was set.
    const ST = tint('cream', 0xd9cfb4), ST2 = tint('cream', 0xc2b598), TR = 'cream', DK = 'dark', GD = 'gold';

    const TERR = 2.7;                    // top of the terrace
    const MZ = 6;                        // sabhamandapa centre, z
    const SZ = -13.5;                    // sanctum centre, z

    /* ---- a closed loft: fn(u, v) -> [x, y, z] --------------------------- */
    const loft = (nu, nv, fn) => {
      const pos = [], uv = [], idx = [];
      for (let i = 0; i <= nv; i++) {
        for (let j = 0; j <= nu; j++) {
          const p = fn(j / nu, i / nv);
          pos.push(p[0], p[1], p[2]);
          uv.push(j / nu, i / nv);
        }
      }
      for (let i = 0; i < nv; i++) {
        for (let j = 0; j < nu; j++) {
          const a = i * (nu + 1) + j, b = a + nu + 1;
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

    /* a carved column: plinth, torus, shaft, capital, bracket */
    const pillar = (x, z, h, w = 1.2, y0 = TERR) => {
      block(TR, w * 2.2, 0.45, w * 2.2, x, y0, z);
      add(TR, cyl(w * 0.6, w * 0.68, 0.55, 10), x, y0 + 0.72, z);
      add(ST, cyl(w * 0.46, w * 0.54, h - 2.3, 10), x, y0 + 1.0 + (h - 2.3) / 2, z);
      add(TR, cyl(w * 0.62, w * 0.46, 0.5, 10), x, y0 + h - 1.05, z);
      block(TR, w * 1.9, 0.5, w * 1.9, x, y0 + h - 0.6, z);
      block(TR, w * 2.7, 0.45, w * 1.25, x, y0 + h - 0.1, z);
    };

    /* one miniature spire of the clustered roof — a square-sectioned lathe */
    const miniSpire = (x, z, y, s) => {
      const prof = [[0.001, 0], [0.56, 0.10], [0.50, 0.42], [0.35, 0.66],
        [0.20, 0.84], [0.10, 0.95], [0.001, 1.0]];
      add(ST, ctx.lathe(prof.map(([r, t]) => [r * s, t * s * 1.35]), 4), x, y, z, { ry: Math.PI / 4 });
      add(TR, cone(s * 0.10, s * 0.34, 4), x, y + s * 1.52, z);
    };

    /* a ring of miniature spires around the edge of a rectangle */
    const spireRing = (cx, cz, w, d, y, s, n) => {
      for (let i = 0; i < n; i++) {
        const f = (i / n) * 4;
        const side = Math.floor(f), k = f - side;
        let x, z;
        if (side === 0) { x = -w / 2 + k * w; z = d / 2; }
        else if (side === 1) { x = w / 2; z = d / 2 - k * d; }
        else if (side === 2) { x = w / 2 - k * w; z = -d / 2; }
        else { x = -w / 2; z = -d / 2 + k * d; }
        miniSpire(cx + x, cz + z, y, s);
      }
    };

    /* ---- terrace, steps ------------------------------------------------- */
    block(ST2, 60, 2.2, 54, 0, 0, 0);
    block('paving', 55, 0.5, 49, 0, 2.2, 0);
    block(TR, 56, 0.22, 50, 0, 2.48, 0);
    for (let i = 0; i < 6; i++) add(TR, box(20 - i * 1.1, 0.45, 1.5), 0, 0.45 + i * 0.45, 24.4 + i * 1.3);
    ctx.railing(-29.5, 2.7, 0, 52, 'stone', 0.9, Math.PI / 2, 12);
    ctx.railing(29.5, 2.7, 0, 52, 'stone', 0.9, Math.PI / 2, 12);

    /* ---- the sabhamandapa: two storeys of open verandah ------------------ */
    block(ST, 30, 10.7, 18, 0, TERR, MZ);
    for (let i = -3; i <= 3; i++) add(ST2, box(3.4, 8.6, 0.3), i * 3.9, TERR + 4.3, MZ + 9.0);
    for (let i = -1; i <= 1; i++) {
      add(DK, box(1.9, 6.6, 0.3), i * 7.8, TERR + 3.3, MZ + 9.15);
      add(DK, box(0.3, 6.6, 1.9), 15.1, TERR + 3.3, MZ + i * 7.2);
      add(DK, box(0.3, 6.6, 1.9), -15.1, TERR + 3.3, MZ + i * 7.2);
    }
    // lower colonnade: nine columns across the front, five down each side
    for (let i = -4; i <= 4; i++) pillar(i * 3.75, MZ + 11.6, 10.7, 1.15);
    for (let i = -2; i <= 2; i++) { pillar(-16.2, MZ + i * 3.7, 10.7, 1.15); pillar(16.2, MZ + i * 3.7, 10.7, 1.15); }
    block(ST2, 33, 0.6, 24, 0, TERR + 10.1, MZ);
    block(TR, 34.4, 1.5, 25.4, 0, TERR + 10.7, MZ);
    // upper storey
    block(ST, 27, 8.4, 15.5, 0, TERR + 12.2, MZ);
    for (let i = -3; i <= 3; i++) add(ST2, box(3.2, 6.2, 0.3), i * 3.6, TERR + 16.4, MZ + 7.7);
    for (let i = -3; i <= 3; i++) pillar(i * 3.6, MZ + 10.2, 8.4, 1.0, TERR + 12.2);
    for (let i = -2; i <= 2; i++) {
      pillar(-14.3, MZ + i * 3.4, 8.4, 1.05, TERR + 12.2);
      pillar(14.3, MZ + i * 3.4, 8.4, 1.05, TERR + 12.2);
    }
    block(ST2, 29, 0.55, 21, 0, TERR + 19.9, MZ);
    block(TR, 30.4, 1.4, 21.6, 0, TERR + 20.6, MZ);
    // relief panel band under the upper cornice
    for (let i = -6; i <= 6; i++) {
      add(TR, box(1.5, 1.15, 0.22), i * 2.2, TERR + 18.9, MZ + 7.9);
      add(TR, box(0.22, 1.15, 1.5), 13.7, TERR + 18.9, MZ + i * 1.9);
      add(TR, box(0.22, 1.15, 1.5), -13.7, TERR + 18.9, MZ + i * 1.9);
    }

    /* ---- the clustered pyramidal roof over the hall ---------------------- */
    let ry = TERR + 22.0, rw = 28, rd = 20;
    for (let i = 0; i < 6; i++) {
      block(ST2, rw, 0.95, rd, 0, ry, MZ);
      add(TR, box(rw + 0.3, 0.14, rd + 0.3), 0, ry + 0.95, MZ);
      spireRing(0, MZ, rw - 0.6, rd - 0.6, ry + 1.05, 0.70 + i * 0.04, 30 + i * 2);
      spireRing(0, MZ, rw - 2.4, rd - 2.4, ry + 1.05, 0.62 + i * 0.04, 22 + i);
      ry += 1.02; rw *= 0.885; rd *= 0.885;
    }
    miniSpire(0, MZ, ry - 0.3, 1.3);
    add(GD, cone(0.4, 1.6, 8), 0, ry + 1.9, MZ);

    /* ---- the nrityamandapa: the porch projecting in front ---------------- */
    block(ST, 22, 9.5, 8, 0, TERR, 20.5);
    for (let i = -2; i <= 2; i++) add(DK, box(2.9, 7.4, 0.3), i * 4.0, TERR + 3.9, 24.55);
    for (let i = -2; i <= 2; i++) pillar(i * 3.6, 23.9, 9.5, 1.15);
    block(ST2, 20, 0.55, 9.5, 0, TERR + 9.0, 20.5);
    block(TR, 24.4, 1.3, 11.4, 0, TERR + 9.5, 20.5);
    block(ST, 19, 6.4, 7, 0, TERR + 10.8, 20.5);
    for (let i = -2; i <= 2; i++) pillar(i * 3.7, 23.6, 6.4, 0.95, TERR + 10.8);
    block(TR, 21.4, 1.15, 9.6, 0, TERR + 17.2, 20.5);
    let py = TERR + 18.35, pw = 21, pd = 10;
    for (let i = 0; i < 4; i++) {
      block(ST2, pw, 1.1, pd, 0, py, 20.5);
      add(TR, box(pw + 0.26, 0.15, pd + 0.26), 0, py + 1.1, 20.5);
      spireRing(0, 20.5, pw - 0.9, pd - 0.9, py + 1.2, 0.92 + i * 0.05, 14 + i);
      py += 1.3; pw *= 0.83; pd *= 0.83;
    }
    miniSpire(0, 20.5, py - 0.2, 1.2);

    /* ---- the sanctum: two storeys of carved wall ------------------------- */
    block(ST, 21, 12.8, 21, 0, TERR, SZ);
    for (const [px, pz] of [[-9.9, -9.9], [9.9, -9.9], [-9.9, 9.9], [9.9, 9.9],
      [0, -9.9], [0, 9.9], [-9.9, 0], [9.9, 0]]) {
      add(TR, box(1.4, 12.0, 1.4), px, TERR + 6.2, SZ + pz);
    }
    for (let r = 0; r < 3; r++) {
      for (let i = -2; i <= 2; i++) {
        add(TR, box(2.0, 1.5, 0.22), i * 3.1, TERR + 3.3 + r * 3.5, SZ + 10.6);
        add(TR, box(0.22, 1.5, 2.0), 10.6, TERR + 3.3 + r * 3.5, SZ + i * 3.1);
        add(TR, box(0.22, 1.5, 2.0), -10.6, TERR + 3.3 + r * 3.5, SZ + i * 3.1);
      }
    }
    block(TR, 22.6, 1.2, 22.6, 0, TERR + 12.8, SZ);
    block(ST, 19.5, 13.3, 19.5, 0, TERR + 14.0, SZ);
    for (let i = -1; i <= 1; i++) add(DK, box(2.3, 6.2, 0.3), i * 4.6, TERR + 18.4, SZ + 9.8);
    for (let i = -1; i <= 1; i++) add(TR, box(3.2, 1.1, 0.26), i * 4.6, TERR + 21.9, SZ + 9.95);
    block(TR, 21, 1.2, 21, 0, TERR + 27.3, SZ);
    // the doorway and its carved frame, facing the hall
    add(DK, ctx.arch(4.6, 7.4, 0.5), 0, TERR, SZ + 10.6);
    add(TR, ctx.archFrame(5.4, 8.2, 0.5, 0.55), 0, TERR, SZ + 10.75);

    /* ---- the shikhara ---------------------------------------------------- */
    /* A square-sectioned curvilinear tower: w(t) = WT + (WB-WT)(1-t)^0.55,
       built as a four-segment lathe so the plan is a true square, with the
       corner clusters of miniature spires (urushringas) that give the
       Kailash Mahameru form its broad-shouldered silhouette. */
    const SHY = TERR + 28.7;             // 31.4
    const SHH = 15.6;                    // ~15 m above the sanctum
    const WB = 20.0, WT = 3.6;
    const wAt = (t) => WT + (WB - WT) * (1 - t) * (1 + 0.20 * Math.sin(Math.PI * t));
    const NP = 26;
    const prof = [];
    for (let i = 0; i <= NP; i++) {
      const t = i / NP;
      prof.push([(wAt(t) / 2) * Math.SQRT2, SHH * t]);
    }
    add(ST2, ctx.lathe(prof, 4), 0, SHY, SZ, { ry: Math.PI / 4 });

    for (const t of [0.34, 0.62, 0.86]) {
      const w = wAt(t);
      add(TR, box(w + 0.12, 0.14, w + 0.12), 0, SHY + SHH * t, SZ);
    }
    for (let i = 0; i < NP; i++) {
      const t0 = i / NP, t1 = (i + 1) / NP;
      const y0 = SHY + SHH * t0, y1 = SHY + SHH * t1;
      const w0 = wAt(t0), w1 = wAt(t1), wm = (w0 + w1) / 2;
      const h = y1 - y0, yc = (y0 + y1) / 2;
      // the lata down the middle of each face, and four flanking ribs
      const bw = 0.26 + 0.6 * (w0 / WB);
      const ribs = [-0.66, 0, 0.66];
      for (const [ax, az] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        for (const u of ribs) {
          const mid = Math.abs(u) < 0.01;
          const rw = mid ? bw : 0.13;
          const o = u * (wm / 2 - rw * 0.4);
          const key = TR;
          if (ax) add(key, box(0.15, h + 0.01, rw), ax * (wm / 2 - 0.02), yc, SZ + o);
          else add(key, box(rw, h + 0.01, 0.15), o, yc, SZ + az * (wm / 2 - 0.02));
        }
      }
      // the corner offsets of the tower, dying out at mid height
      if (t0 < 0.55) {
        const c = wm * 0.12 * Math.min(1, (0.55 - t0) / 0.18);
        const off = wm / 2 - c * 0.32;
        for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          add(ST2, box(c, h + 0.02, c), dx * off, yc, SZ + dz * off);
        }
      }
    }
    // corner clusters of miniature spires — the shoulders of the tower
    // the shoulders: a ring of spires standing on the tower at each stage,
    // and a cluster at every corner, both proud of the surface so they cut
    // the silhouette the way the urushringas of the Kailash Mahameru form do
    for (const [t, s] of [[0.26, 2.5], [0.48, 2.0], [0.68, 1.55]]) {
      const w = wAt(t), y = SHY + SHH * t;
      /* No ring of spires across the faces. At four segments each they are
         low-poly enough that half of every cone is in shadow, so a hundred of
         them turned the tower into a pinecone. The vertical ribs and the
         horizontal bands carry the surface; the spires belong at the corners,
         where they step the silhouette. */
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        miniSpire(dx * (w / 2 + 0.15), SZ + dz * (w / 2 + 0.15), y, s * 1.15);
        miniSpire(dx * (w / 2 - 2.0), SZ + dz * (w / 2 - 1.6), y + 0.5, s * 0.8);
      }
    }

    /* ---- amalaka, kalasha, flag ------------------------------------------ */
    const YT = SHY + SHH;                // 47.0
    add(ST2, cyl(2.2, 2.7, 0.55, 20), 0, YT + 0.28, SZ);        // neck
    add(TR, cyl(3.2, 2.4, 0.55, 22), 0, YT + 0.8, SZ);          // amalaka
    add(TR, cyl(3.3, 3.2, 0.5, 22), 0, YT + 1.3, SZ);
    for (let k = 0; k < 20; k++) {
      const a = (k / 20) * Math.PI * 2;
      add(TR, box(0.16, 1.0, 0.34), Math.cos(a) * 3.15, YT + 1.0, SZ + Math.sin(a) * 3.15, { ry: -a });
    }
    add(TR, cyl(2.0, 2.8, 0.5, 18), 0, YT + 1.75, SZ);
    add(GD, cyl(0.8, 1.3, 1.5, 12), 0, YT + 2.65, SZ);          // kalasha
    add(GD, sph(1.25, 12), 0, YT + 3.6, SZ);
    add(GD, cyl(0.3, 0.55, 1.5, 10), 0, YT + 4.9, SZ);
    // flagstaff, 8.2 m above the kalasha
    add('grey', cyl(0.11, 0.13, 8.2, 6), 0, YT + 5.7 + 4.1, SZ);
    add('fabricSaffron', box(3.0, 1.8, 0.08), 1.6, YT + 11.9, SZ);
    add(GD, sph(0.28, 8), 0, YT + 14.0, SZ);

    /* ---- subsidiary shrines --------------------------------------------- */
    for (const [x, z, s] of [[-24, -20, 1.0], [24, -20, 1.0], [-24, 9, 0.9], [24, 9, 0.9]]) {
      block(ST, 7.5 * s, 4.6 * s, 7.5 * s, x, TERR, z);
      add(TR, box(8.2 * s, 0.5, 8.2 * s), x, TERR + 4.6 * s, z);
      let sy = TERR + 5.1 * s, sw = 8.0 * s, sd = 8.0 * s;
      for (let i = 0; i < 4; i++) {
        block(ST2, sw, 0.95 * s, sd, x, sy, z);
        add(TR, box(sw + 0.24, 0.14, sd + 0.24), x, sy + 0.95 * s, z);
        spireRing(x, z, sw - 0.6, sd - 0.6, sy + 1.0 * s, 0.55 * s, 12);
        sy += 1.12 * s; sw *= 0.83; sd *= 0.83;
      }
      miniSpire(x, z, sy - 0.2, 1.0 * s);
    }

    /* ---- Nandi, facing the shrine ---------------------------------------- */
    block(ST2, 4.4, 1.3, 5.8, 0, TERR, 13.0);
    add('grey', box(2.4, 1.8, 3.0), 0, TERR + 2.2, 12.2);
    add('grey', sph(1.05, 8), 0, TERR + 3.2, 10.5, { sy: 0.9 });
    add('grey', cone(0.28, 1.1, 6), 0, TERR + 2.9, 9.4, { rx: -0.5 });

    /* ---- the sea wall, the Baan Stambh ----------------------------------- */
    block('stone', 84, 3.4, 3.2, 0, 0, -36);
    for (let i = -8; i <= 8; i++) add('stone', box(2.4, 1.5, 3.6), i * 5.4, 3.6, -36);
    add('stone', box(4.6, 1.2, 4.6), -40, 0.6, -38);
    add('stone', cyl(1.05, 1.5, 30, 4), -40, 16.2, -38, { ry: Math.PI / 4 });
    add(TR, cyl(1.7, 1.2, 1.1, 4), -40, 31.9, -38, { ry: Math.PI / 4 });
    add(TR, sph(0.8, 8), -40, 33.2, -38);
    add(GD, cone(0.55, 2.2, 8), -40, 35.0, -38);

    /* ---- people, lamps, trees -------------------------------------------- */
    const people = [[-9, 30], [8, 31], [-17, 27], [16, 28], [0, 33], [-24, 24], [24, 25], [-4, 27], [11, 26], [20, 33]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricSaffron', 'fabricWhite', 'fabricRed'][i % 3], 0.95));
    [[-21, 31], [21, 31], [-26, 16], [26, 16], [0, 38]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-30, 31], [30, 31], [-32, 4], [32, 4], [-27, -23], [27, -23], [-35, 20], [35, 20]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.15 + (i % 3) * 0.18, 'round'));

    ctx.light({ pos: [-30, 24, 40], target: [0, 26, 0], color: 0xffd0a0, intensity: 4200, distance: 220 });
    ctx.light({ pos: [30, 24, 34], target: [0, 26, 0], color: 0xffc890, intensity: 3400, distance: 220 });
  }
};
