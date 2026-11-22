/* Kandariya Mahadeva — Khajuraho · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions (1 unit = 1 metre):
     jagati platform           4.0 m high
     temple above the platform 27.0 m
     total to the kalasha      31.0 m   (31.0086 m, Vishwakosh)
     length, east–west         31.4 m   (31.0–31.17 m)
     width, north–south        20.0 m   (20.36 m) at the mahamandapa transepts
     sikhara                   11.2 → 28.2 m, 11.0 m square to 3.2 m
     plan                      five parts: mukhamandapa, mandapa,
                               mahamandapa, antarala, garbhagriha
*/

export default {
  id: 'kandariya-mahadeva',
  accent: '#c9a878',
  accent2: '#e0c49a',
  seed: 89,
  time: 11.2,
  bounds: 60,
  minDist: 14,
  maxDist: 220,
  home: { pos: [40, 22, 56], target: [6, 16, -2], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x94a06c, tile: 14 },
  views: [
    { name: 'Full', pos: [40, 22, 56], target: [6, 16, -2] },
    { name: 'Shikhara', pos: [20, 38, 30], target: [0, 27, -8] },
    { name: 'Carving', pos: [12, 10, 22], target: [0, 8, 6] },
    { name: 'Platform', pos: [-30, 9, 30], target: [0, 9, 0] },
    { name: 'From the north', pos: [-26, 15, -16], target: [0, 16, 0] }
  ],
  tour: [
    {
      title: 'The Great Temple', deva: 'कंदारिया महादेव',
      text: 'The Kandariya Mahadeva is the largest and tallest temple at Khajuraho, built by the Chandela kings around 1030 CE and dedicated to Shiva. A high platform carries the five-part plan around a central shrine.',
      pos: [34, 18, 46], target: [0, 16, 0], time: 15.6
    },
    {
      title: 'A Mountain in Stone', deva: 'शिखर',
      text: 'The tower rises about 31 metres in a curve of stacked tiers, each with its own row of small turrets, so the shikhara reads as a mountain with subsidiary peaks. The nagara form reaches its most elaborate here.',
      pos: [16, 34, 26], target: [0, 28, 0], time: 12
    },
    {
      title: 'Eight Hundred Figures', deva: 'मूर्तियाँ',
      text: 'Some 870 sculptures cover the walls: gods, nymphs, musicians, mithuna couples and animals, cut in a soft sandstone that has held its detail for a thousand years.',
      pos: [9, 9, 14], target: [0, 8, 2], time: 9.4
    },
    {
      title: 'The Platform', deva: 'जगती',
      text: 'A jagati, the raised platform, carries a walkway for circumambulation. A porch and a pillared hall come before the dark sanctum.',
      pos: [-26, 9, 30], target: [0, 10, 0], time: 10.8
    },
    {
      title: 'Abandoned and Kept', deva: 'खजुराहो',
      text: 'The temples went up in a burst between about 950 and 1050 and were then left. The site was remote enough to escape destruction, and Khajuraho became a UNESCO World Heritage Site in 1986.',
      pos: [-30, 16, -18], target: [0, 16, 0], time: 17.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Under floodlight the tiers throw long shadows up the tower and the carvings read as a texture of light and dark.',
      pos: [30, 16, 42], target: [0, 16, 0], time: 21.2
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, lathe } = ctx;
    const PI = Math.PI;

    const ST = 'plaster';
    const SP = 'sandstoneBuff';
    const TR = 'ivory';
    const OP = 'dark';

    /* ---- measured levels ------------------------------------------------ */
    const JAG = 4.0;        // the jagati
    const ADH = 6.2;        // top of the moulded base
    const JAN = 10.4;       // top of the sculpted wall
    const VAR = 11.2;       // cornice
    const SH1 = 28.2;       // sikhara neck
    const AMA = 29.4;       // top of the amalaka
    const TOP = 31.0;       // kalasha

    /* the sikhara profile: convex at the foot, concave near the top — the
       curve the brief asks for, and the curve the photograph shows */
    const PROF = [[1.000, 0.00], [1.022, 0.08], [0.998, 0.20], [0.945, 0.34],
      [0.868, 0.48], [0.775, 0.62], [0.678, 0.74], [0.578, 0.84],
      [0.470, 0.92], [0.291, 1.00]];
    const profAt = (p, t) => {
      let i = 0;
      while (i < p.length - 2 && t > p[i + 1][1]) i++;
      const a = p[i], b = p[i + 1];
      const k = (t - a[1]) / ((b[1] - a[1]) || 1);
      return a[0] + (b[0] - a[0]) * k;
    };
    const SH0W = 11.8;
    const sw = (t) => SH0W * profAt(PROF, t);

    /* a miniature shikhara: the urushringa that clusters the corners */
    const mini = (cx, cz, y, w, h, key) => {
      const N = 6, pts = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        pts.push([(w / Math.SQRT2) * (1 - 0.78 * t), y + t * h]);
      }
      add(key, lathe(pts, 4), cx, 0, cz, { ry: PI / 4 });
      add(key, cyl(w * 0.34, w * 0.42, h * 0.1, 8), cx, y + h * 0.95, cz);
      add('gold', cone(w * 0.1, h * 0.3, 6), cx, y + h * 1.15, cz);
    };

    /* a phamsana roof: stepped courses with a spirelet at each corner */
    const phamsana = (cx, cz, w, d, y0, h, tiers, key) => {
      let yy = y0, ww = w, dd = d;
      const th = h / tiers;
      for (let i = 0; i < tiers; i++) {
        add(key, box(ww, th * 1.06, dd), cx, yy + th / 2, cz);
        add(TR, box(ww + 0.07, th * 0.07, dd + 0.07), cx, yy + th * 0.96, cz);
        // a spirelet at each corner, every third course
        if (i % 3 === 0) {
          for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
            mini(cx + sx * (ww / 2 - 0.24), cz + sz * (dd / 2 - 0.24), yy + th * 0.6,
              Math.min(ww, dd) * 0.13, th * 3.4, key);
          }
        }
        yy += th;
        ww *= 0.952; dd *= 0.952;
      }
      add(key, cyl(ww * 0.46, ww * 0.56, 0.3, 8), cx, yy + 0.15, cz);
      add('gold', sph(0.2, 8), cx, yy + 0.55, cz);
      add('gold', cone(0.12, 0.6, 6), cx, yy + 1.0, cz);
    };

    /* a register of figures — the sculpture that covers these walls */
    const figures = (x, z, ry, y0, y1, n, key) => {
      const rows = 2, h = (y1 - y0) / rows;
      for (let r = 0; r < rows; r++) {
        for (let k = 0; k < n; k++) {
          const o = (k - (n - 1) / 2) * 1.02;
          add(key, box(0.36, h * 0.6, 0.13),
            x + Math.cos(ry) * o, y0 + h * (r + 0.5), z - Math.sin(ry) * o,
            { ry });
        }
      }
    };

    /* ---- the jagati platform -------------------------------------------- */
    const JX = 32, JZ = 24;
    block(ST, JX, JAG - 1.0, JZ, 0, 0, 0);
    // mouldings, and the frieze of elephants and processions
    add(TR, box(JX + 0.6, 0.34, JZ + 0.6), 0, 0.5, 0);
    add(ST, box(JX + 0.2, 0.7, JZ + 0.2), 0, 0.9, 0);
    add(TR, box(JX + 0.5, 0.22, JZ + 0.5), 0, 1.7, 0);
    (function frieze() {
      for (let i = 0; i < 31; i++) {
        const x = -15.0 + i * 1.0;
        [12.0, -12.0].forEach((z) => {
          add(SP, box(0.62, 0.66, 0.14), x, 2.5, z);
          add(SP, box(0.62, 0.4, 0.14), x, 3.25, z);
        });
      }
      for (let i = 0; i < 23; i++) {
        const z = -11.0 + i * 1.0;
        [-15.0, 15.0].forEach((x) => {
          add(SP, box(0.14, 0.66, 0.62), x, 2.5, z);
          add(SP, box(0.14, 0.4, 0.62), x, 3.25, z);
        });
      }
    })();
    add('paving', box(JX - 0.1, 0.16, JZ - 0.1), 0, JAG - 0.08, 0);
    add(TR, box(JX + 0.7, 0.4, 0.7), 0, JAG - 0.2, JZ / 2);
    add(TR, box(JX + 0.7, 0.4, 0.7), 0, JAG - 0.2, -JZ / 2);
    add(TR, box(0.7, 0.4, JZ + 0.7), JX / 2, JAG - 0.2, 0);
    add(TR, box(0.7, 0.4, JZ + 0.7), -JX / 2, JAG - 0.2, 0);
    // the flight of steps up the east side
    for (let i = 0; i < 9; i++) {
      add(ST, box(7.0, JAG * ((i + 1) / 9), 0.62), 0, 0, 13.3 + (8 - i) * 0.62);
      add(SP, box(7.3, 0.16, 0.66), 0, JAG * ((i + 1) / 9) - 0.06, 13.3 + (8 - i) * 0.62);
    }
    [-1, 1].forEach((s) => {
      add(ST, box(0.9, 1.1, 5.6), s * 3.9, JAG * 0.55, 15.9);
      add(SP, box(1.1, 0.22, 5.8), s * 3.9, JAG * 0.55 + 1.1, 15.9);
    });

    /* ---- the five parts of the plan, east to west ------------------------ */
    const parts = [
      { z: 12.4, w: 6.6, d: 4.2, top: 9.8, roof: 15.1 },
      { z: 8.4, w: 8.4, d: 5.0, top: 10.6, roof: 17.8 },
      { z: 1.0, w: 11.2, d: 9.6, top: VAR, roof: 22.1 },
      { z: -5.1, w: 5.0, d: 3.4, top: 10.8, roof: 13.6 }
    ];

    // adhisthana and jangha: the moulded base and the sculpted wall
    const body = (cx, cz, w, d, top) => {
      add(ST, box(w + 0.5, 0.55, d + 0.5), cx, JAG + 0.28, cz);   // khura
      add(SP, box(w + 0.28, 0.4, d + 0.28), cx, JAG + 0.75, cz);  // kumbha
      add(ST, box(w + 0.55, 0.55, d + 0.55), cx, JAG + 1.22, cz); // kalasha
      add(TR, box(w + 0.18, 0.14, d + 0.18), cx, ADH - 0.16, cz);
      block(ST, w, top - ADH, d, cx, ADH, cz);                    // jangha
      // two registers of figures on every visible face
      figures(cx, cz + d / 2 + 0.02, 0, ADH + 0.15, top - 0.9, Math.max(3, Math.round(w / 1.7)), SP);
      figures(cx, cz - d / 2 - 0.02, PI, ADH + 0.15, top - 0.9, Math.max(3, Math.round(w / 1.7)), SP);
      figures(cx + w / 2 + 0.02, cz, PI / 2, ADH + 0.15, top - 0.9, Math.max(3, Math.round(d / 1.7)), SP);
      figures(cx - w / 2 - 0.02, cz, -PI / 2, ADH + 0.15, top - 0.9, Math.max(3, Math.round(d / 1.7)), SP);
      // varandika cornice
      add(SP, box(w + 0.7, 0.34, d + 0.7), cx, top - 0.6, cz);
      add(TR, box(w + 0.9, 0.2, d + 0.9), cx, top - 0.18, cz);
    };

    parts.forEach((p) => body(0, p.z, p.w, p.d, p.top));

    // the lateral transepts of the mahamandapa, which give the temple its width
    [-1, 1].forEach((s) => {
      body(s * 8.4, 1.0, 3.2, 4.6, VAR);
      add(ST, box(3.0, 1.4, 4.2), s * 8.4, VAR, 1.0);
      phamsana(s * 8.4, 1.0, 3.4, 4.8, VAR + 1.4, 6.0, 7, ST);
    });

    // roofs
    phamsana(0, 12.4, 6.8, 4.4, 9.8, 5.3, 8, ST);
    phamsana(0, 8.4, 8.6, 5.2, 10.6, 7.2, 10, ST);
    phamsana(0, 1.0, 11.4, 9.8, VAR, 10.9, 13, ST);
    // the antarala: a short barrel roof
    block(ST, 5.2, 2.6, 3.6, 0, 10.8, -5.1);
    add(SP, box(5.6, 0.3, 4.0), 0, 13.4, -5.1);

    /* ---- the garbhagriha and the shikhara -------------------------------- */
    const gz = -11.8;
    body(0, gz, 11.2, 11.2, VAR);
    // the sanctum door on the east
    add(OP, arch(2.4, 3.9, 0.28), 0, JAG + 1.6, gz + 5.75);
    add(TR, archFrame(3.0, 4.5, 0.26, 0.32), 0, JAG + 1.6, gz + 5.8);

    // the shikhara: one smooth four-sided taper carrying the ogee profile
    const NS = 34;
    const pts = [];
    for (let i = 0; i <= NS; i++) {
      const t = i / NS;
      pts.push([sw(t) / Math.SQRT2, VAR + t * (SH1 - VAR)]);
    }
    add(ST, lathe(pts, 4), 0, 0, gz, { ry: PI / 4 });

    // horizontal courses, and the corner clusters of spirelets
    const TIERS = 22;
    for (let i = 1; i < TIERS; i++) {
      const t = i / TIERS, w = sw(t), y = VAR + t * (SH1 - VAR);
      add(SP, box(w + 0.06, 0.1, w + 0.06), 0, y, gz);
    }
    // four rows of urushringas climbing the corners
    for (let r = 0; r < 4; r++) {
      const t = 0.06 + r * 0.17;
      const w = sw(t), y = VAR + t * (SH1 - VAR);
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        mini(sx * (w / 2 - w * 0.13), gz + sz * (w / 2 - w * 0.13), y - 1.1,
          w * 0.3, w * 0.95, ST);
      }
      // and a pair on each face, between the corner clusters
      for (let f = 0; f < 4; f++) {
        const a = (f / 4) * PI * 2;
        [-0.26, 0.26].forEach((o) => {
          const px = Math.cos(a) * (w / 2 - w * 0.06) - Math.sin(a) * o * w;
          const pz = gz + Math.sin(a) * (w / 2 - w * 0.06) + Math.cos(a) * o * w;
          mini(px, pz, y - 1.0, w * 0.24, w * 0.8, ST);
        });
      }
    }
    // the central lata of each face, and the two flanking ones
    for (let f = 0; f < 4; f++) {
      const a = (f / 4) * PI * 2;
      [-0.3, 0, 0.3].forEach((o) => {
        const N = 14;
        for (let k = 0; k < N; k++) {
          const t0 = k / N, t1 = (k + 1) / N, tm = (t0 + t1) / 2;
          const r0 = sw(t0) / 2 + 0.12, r1 = sw(t1) / 2 + 0.12;
          const dr = r1 - r0, dy = (t1 - t0) * (SH1 - VAR);
          const rm = sw(tm) / 2 + 0.12;
          add(ST, box(0.42, Math.hypot(dr, dy) * 1.14, 0.42),
            Math.cos(a) * rm - Math.sin(a) * o * sw(tm), VAR + tm * (SH1 - VAR),
            gz + Math.sin(a) * rm + Math.cos(a) * o * sw(tm),
            { ry: PI / 2 - a, rx: Math.atan2(dr, dy) });
        }
      });
    }

    // amalaka and kalasha
    const wTop = sw(1.0);
    add(TR, cyl(wTop * 0.72, wTop * 0.9, 0.5, 14), 0, SH1 + 0.25, gz);
    add(ST, cyl(wTop * 0.66, wTop * 0.7, 0.62, 16), 0, SH1 + 0.8, gz);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * PI * 2;
      add(TR, box(0.2, 0.62, 0.34), Math.cos(a) * wTop * 0.68, SH1 + 0.8,
        gz + Math.sin(a) * wTop * 0.68, { ry: -a });
    }
    add(TR, cyl(wTop * 0.5, wTop * 0.62, 0.34, 14), 0, AMA, gz);
    add(ST, cyl(wTop * 0.3, wTop * 0.42, 0.4, 12), 0, AMA + 0.34, gz);
    add('gold', cyl(0.24, 0.3, 0.95, 10), 0, AMA + 0.74, gz);
    add('gold', sph(0.3, 10), 0, TOP - 0.3, gz);

    /* ---- the two free-standing sardula figures on the platform ----------- */
    [-1, 1].forEach((s) => {
      add(ST, box(1.0, 0.5, 2.4), s * 8.0, JAG, 10.6);
      add(SP, box(0.8, 1.1, 0.7), s * 8.0, JAG + 0.5, 10.6);
      add(SP, sph(0.42, 8), s * 8.0, JAG + 1.7, 10.0, { sy: 0.85 });
    });

    /* ---- grounds ---------------------------------------------------------- */
    const people = [[-6, 19], [7, 20], [-12, 15], [13, 16], [0, 22], [-18, 11], [18, 12],
      [-3, 17], [9, 14], [-22, 20], [22, 20], [-9, 24], [11, 24]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 24], [16, 24], [-24, 4], [24, 4], [-20, -18], [20, -18]].forEach(([x, z]) => ctx.lamp(x, z, 3.2, 'black'));
    [[-28, 18], [28, 18], [-32, -6], [32, -6], [-26, -26], [26, -26], [-34, 10], [34, 10],
      [-14, 30], [14, 30]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.15 + (i % 3) * 0.16, 'round'));

    ctx.light({ pos: [-20, 12, 22], target: [0, 18, 0], color: 0xffd0a0, intensity: 2600, distance: 140 });
    ctx.light({ pos: [20, 12, 18], target: [0, 18, 0], color: 0xffc890, intensity: 2200, distance: 140 });
  }
};
