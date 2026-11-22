/* Basilica of Bom Jesus — Old Goa · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'basilica-bom-jesus',
  accent: '#c0a68c',
  accent2: '#e8d9bf',
  seed: 97,
  time: 15.8,
  bounds: 70,
  minDist: 16,
  maxDist: 260,
  home: { pos: [47, 18, 46], target: [0, 11, -2], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8b9a63, tile: 18 },
  views: [
    { name: 'Full', pos: [47, 18, 46], target: [0, 11, -2] },
    { name: 'Facade', pos: [15, 15, 41], target: [0, 14, 2] },
    { name: 'Portal', pos: [0, 7, 29], target: [0, 7, 2] },
    { name: 'Nave', pos: [31, 17, 22], target: [0, 10, -10] },
    { name: 'From the square', pos: [-44, 13, 42], target: [0, 13, 0] }
  ],
  tour: [
    {
      title: 'Bom Jesus', deva: 'बॉम जीसस',
      text: 'The Basilica of Bom Jesus was begun in 1594 and consecrated in 1605, in the Portuguese capital of Old Goa. It is one of the earliest baroque churches in India.',
      pos: [30, 15, 62], target: [0, 14, 0], time: 15.8
    },
    {
      title: 'Laterite and Lime', deva: 'लेटराइट',
      text: 'The church is built of laterite, a soft iron-rich stone quarried locally, faced with lime plaster. The facade rises in tiers of Ionic, Doric and Corinthian columns to a central pediment.',
      pos: [4, 13, 42], target: [0, 15, 0], time: 12
    },
    {
      title: 'Three Portals', deva: 'द्वार',
      text: 'Three doors open through the facade; the central one is the tallest, framed by pilasters and a carved pediment, with the Jesuit emblem above it.',
      pos: [0, 6, 26], target: [0, 8, 0], time: 9.6
    },
    {
      title: 'The Casket', deva: 'अवशेष',
      text: 'The chapel behind these walls holds the silver casket of St Francis Xavier, the Jesuit missionary who died off the China coast in 1552; his relics are displayed every ten years. The interior, with its gilded altars and painted ceiling, is not modelled here.',
      pos: [26, 12, 18], target: [0, 10, -6], time: 10.6
    },
    {
      title: 'Old Goa', deva: 'पुराना गोवा',
      text: 'In 1986 the basilica was inscribed, with the other churches and convents of Old Goa, as a UNESCO World Heritage Site. It was made a minor basilica in 1946, the first in India.',
      pos: [-34, 9, 40], target: [0, 14, 0], time: 17.4
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit, the white plaster turns gold and the facade reads as a set of stacked pediments against the dark.',
      pos: [26, 13, 54], target: [0, 14, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, arch, archFrame, block, torus } = ctx;

    /* white plaster wall, warm cream trim — the two must band clearly */
    const wall = 'plasterWhite', trim = 'cream', base = 'basaltDark';

    /* ------------------------------------------------------------------ *
     * small local geometry makers
     * ------------------------------------------------------------------ */

    // extruded triangular prism (isosceles), base on y = 0, apex up, centred on z
    const triPrism = (w, h, depth) => {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0);
      s.lineTo(w / 2, 0);
      s.lineTo(0, h);
      s.closePath();
      const g = new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false });
      g.translate(0, 0, -depth / 2);
      return g;
    };

    // a tube swept along a polyline / curve
    const sweep = (pts, r, key, seg = 48, rad = 6) => {
      const c = new T3.CatmullRomCurve3(pts.map((p) => new T3.Vector3(p[0], p[1], p[2])));
      add(key, new T3.TubeGeometry(c, seg, r, rad, false), 0, 0, 0);
    };

    // one classical column: plinth, torus base, shaft, capital, abacus
    const pillar = (x, y0, h, r, z, style) => {
      add(trim, box(r * 3.1, 0.42, r * 3.1), x, y0 + 0.21, z);
      add(trim, box(r * 2.7, 0.30, r * 2.7), x, y0 + 0.57, z);
      add(trim, torus(r * 1.18, r * 0.26, 5, 12), x, y0 + 0.78, z, { rx: Math.PI / 2 });
      const shaftH = h - 1.55;
      add(trim, cyl(r * 0.84, r * 0.98, shaftH, 10), x, y0 + 0.86 + shaftH / 2, z);
      // capital
      add(trim, torus(r * 1.02, r * 0.20, 5, 12), x, y0 + h - 0.72, z, { rx: Math.PI / 2 });
      add(trim, box(r * 2.5, 0.34, r * 2.5), x, y0 + h - 0.44, z);
      if (style === 'corinthian') {
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          add(trim, sph(r * 0.30, 6), x + Math.cos(a) * r * 1.05, y0 + h - 0.72, z + Math.sin(a) * r * 1.05);
        }
      } else if (style === 'ionic') {
        [-1, 1].forEach((s) => add(trim, torus(r * 0.34, r * 0.13, 4, 10),
          x + s * r * 1.0, y0 + h - 0.66, z, { rx: Math.PI / 2, rz: 0 }));
      }
      add(trim, box(r * 2.95, 0.22, r * 2.95), x, y0 + h - 0.13, z);
    };

    // shallow round-headed niche with a small figure
    const niche = (x, y, z, w, h) => {
      add('dark', arch(w, h, 0.22), x, y, z);
      add(trim, archFrame(w + 0.5, h + 0.35, 0.22, 0.26), x, y, z + 0.1);
      add(trim, box(w + 1.1, 0.22, 0.5), x, y - 0.11, z + 0.24);
      add(trim, cyl(0.26, 0.34, h * 0.46, 8), x, y + h * 0.16, z - 0.05);
      add(trim, sph(0.24, 8), x, y + h * 0.44, z - 0.05);
    };

    /* ------------------------------------------------------------------ *
     * plinth, steps and forecourt
     * ------------------------------------------------------------------ */
    const Y0 = 1.0;                       // top of the plinth = building datum
    block(base, 50, Y0, 44, 0, 0, -8);    // stepped stone base
    block(base, 47, 0.35, 41, 0, Y0, -8);
    add('paving', box(52, 0.24, 22), 0, 0.94, 24);          // forecourt
    ctx.stairs(0, 0, 15, 13, 1.0, 5, 1.0, 'basaltDark');
    // kerb lines across the forecourt
    for (let i = 0; i < 4; i++) add(base, box(52, 0.10, 0.18), 0, 1.06, 20 + i * 4);

    /* ------------------------------------------------------------------ *
     * the nave: long body, buttresses, gabled tiled roof
     * ------------------------------------------------------------------ */
    const NW = 24, NZ = 1.0, ND = 30, NTOP = 14.5;   // width, front z, depth, wall top
    const NZC = NZ - ND / 2;                          // nave centre z = -14
    block(wall, NW, NTOP - Y0, ND, 0, Y0, NZC);
    // plinth course + eaves cornice
    block(base, NW + 0.6, 0.5, ND + 0.4, 0, Y0, NZC);
    block(trim, NW + 0.9, 0.6, ND + 0.6, 0, NTOP - 0.5, NZC);

    // buttresses down both flanks
    for (let i = -2; i <= 2; i++) {
      [-1, 1].forEach((s) => {
        add(wall, box(1.5, 11.6, 2.8), s * (NW / 2 + 0.55), Y0 + 5.8, NZC + i * 6.2);
        add(trim, box(1.9, 0.45, 3.2), s * (NW / 2 + 0.55), Y0 + 11.6, NZC + i * 6.2);
      });
    }
    // clerestory windows between the buttresses
    for (let i = -1; i <= 1; i++) {
      [-1, 1].forEach((s) => {
        add('dark', arch(1.4, 2.9, 0.2), s * (NW / 2 + 0.01), Y0 + 6.0, NZC + i * 6.2 + 3.1,
          { ry: s > 0 ? Math.PI / 2 : -Math.PI / 2 });
        add(trim, archFrame(1.8, 3.3, 0.2, 0.24), s * (NW / 2 + 0.03), Y0 + 6.0, NZC + i * 6.2 + 3.1,
          { ry: s > 0 ? Math.PI / 2 : -Math.PI / 2 });
      });
    }

    /* gabled tiled roof — ridge 17.5, well below the facade */
    const EAVE = NTOP, RIDGE = 17.5;
    const halfW = NW / 2 + 0.6, rise = RIDGE - EAVE;
    const slope = Math.atan2(rise, halfW);
    const slopeLen = Math.hypot(halfW, rise);
    const roofL = ND + 0.8;
    [-1, 1].forEach((s) => {
      const cx = s * halfW / 2, cy = EAVE + rise / 2;
      add('terracotta', box(slopeLen, 0.46, roofL), cx, cy, NZC, { rz: -s * slope });
      // ribs running down the slope
      for (let i = 0; i < 13; i++) {
        const z = NZC - roofL / 2 + 1.2 + i * (roofL - 2.4) / 12;
        add('brick', box(slopeLen - 0.35, 0.26, 0.34),
          cx + s * Math.sin(slope) * 0.34, cy + Math.cos(slope) * 0.34, z, { rz: -s * slope });
      }
      // eaves fascia
      add(trim, box(0.5, 0.30, roofL), s * (halfW + 0.1), EAVE + 0.05, NZC);
    });
    add('terracotta', box(1.1, 0.42, roofL), 0, RIDGE + 0.2, NZC);        // ridge cap
    add(trim, box(1.5, 0.18, roofL), 0, RIDGE + 0.44, NZC);
    // rear gable
    add(wall, triPrism(NW + 0.4, rise + 0.2, 0.8), 0, EAVE, NZ - ND - 0.4);
    add(trim, box(NW + 0.8, 0.34, 1.0), 0, EAVE - 0.1, NZ - ND - 0.4);

    /* ------------------------------------------------------------------ *
     * THE FACADE — three stepped tiers, each with its own recessed face
     *
     *   tier 1  y 1.0 – 10.0   w 27.0   face z 6.50
     *   tier 2  y 10.7 – 16.6  w 20.5   face z 5.40
     *   tier 3  y 17.2 – 20.4  w 13.5   face z 4.40
     *   pediment y 20.9 – 25.3  w 14.0  face z 4.40
     * ------------------------------------------------------------------ */
    const F1 = 6.5, F2 = 5.4, F3 = 4.4;
    const Y1 = 10.0, Y2 = 16.6, Y3 = 20.4, TP = 25.3;

    /* -- tier 1: three portals, six columns, heavy entablature ---------- */
    block(wall, 27.0, Y1 - Y0, F1 - 1.0, 0, Y0, (F1 + 1.0) / 2);
    block(base, 27.4, 0.55, F1 - 0.9, 0, Y0, (F1 + 1.1) / 2);

    // central portal
    add('dark', arch(4.4, 6.1, 0.34), 0, Y0, F1 - 0.5);
    add(trim, archFrame(5.0, 6.7, 0.46, 0.5), 0, Y0, F1 - 0.2);
    add(trim, box(6.5, 0.32, 0.85), 0, Y0 + 6.85, F1 + 0.22);    // entablature over the door
    // the door's own triangular pediment
    add(wall, triPrism(6.4, 1.3, 0.8), 0, Y0 + 7.1, F1 + 0.5);
    [-1, 1].forEach((s2) => {
      const a = Math.atan2(1.3, 3.2), L = Math.hypot(3.2, 1.3) + 0.28;
      add(trim, box(L, 0.28, 1.05), s2 * 1.6 + s2 * Math.sin(a) * 0.12,
        Y0 + 7.75 + Math.cos(a) * 0.12, F1 + 0.5, { rz: -s2 * a });
    });
    add(trim, box(0.55, 0.42, 1.05), 0, Y0 + 8.48, F1 + 0.5);
    // side portals
    [-1, 1].forEach((s) => {
      add('dark', arch(2.8, 4.9, 0.28), s * 6.0, Y0, F1 - 0.45);
      add(trim, archFrame(3.3, 5.35, 0.34, 0.38), s * 6.0, Y0, F1 - 0.2);
      add(trim, box(4.2, 0.34, 0.7), s * 6.0, Y0 + 5.4, F1 + 0.15);
    });
    // Ionic columns
    [-12.2, -8.0, -3.4, 3.4, 8.0, 12.2].forEach((x) => pillar(x, Y0, 8.6, 0.52, F1 + 0.42, 'ionic'));
    // outer blind niches
    [-10.6, 10.6].forEach((x) => niche(x, Y0 + 1.5, F1 - 0.35, 1.5, 3.2));

    // the Jesuit emblem, set in the door tympanum
    add('gold', sph(0.42, 10), 0, Y0 + 7.72, F1 + 0.95, { sy: 1.35, sz: 0.30 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      add('gold', box(0.09, 0.46, 0.07), Math.cos(a) * 0.62, Y0 + 7.72 + Math.sin(a) * 0.72,
        F1 + 0.92, { rz: a - Math.PI / 2 });
    }

    // entablature: two cream bands with a dark shadow gap between
    add(trim, box(28.2, 0.55, F1 - 0.6), 0, Y1 + 0.28, (F1 + 1.1) / 2 + 0.15);
    add(trim, box(27.5, 0.14, 0.16), 0, Y1 + 0.62, F1 + 0.30);
    add(trim, box(28.6, 0.42, F1 - 0.2), 0, Y1 + 0.92, (F1 + 1.2) / 2 + 0.1);

    /* -- tier 2: choir window, oculi, Corinthian columns ---------------- */
    block(wall, 20.5, Y2 - (Y1 + 1.13), F2 - 1.0, 0, Y1 + 1.13, (F2 + 1.0) / 2);
    block(base, 20.9, 0.4, F2 - 0.9, 0, Y1 + 1.13, (F2 + 1.1) / 2);

    add('dark', arch(2.7, 4.3, 0.3), 0, Y1 + 1.6, F2 - 0.42);
    add(trim, archFrame(3.25, 4.85, 0.34, 0.4), 0, Y1 + 1.6, F2 - 0.18);
    add(trim, box(4.4, 0.36, 0.7), 0, Y1 + 6.55, F2 + 0.12);
    // balcony balustrade under the window
    ctx.railing(0, Y1 + 1.35, F2 + 0.30, 5.0, 'cream', 0.85, 0, 7);

    // oculi either side
    [-4.5, 4.5].forEach((x) => {
      add('dark', cyl(0.82, 0.82, 0.22, 14), x, Y1 + 4.3, F2 - 0.24, { rx: Math.PI / 2 });
      add(trim, torus(0.95, 0.19, 5, 16), x, Y1 + 4.3, F2 - 0.10);
      add(trim, box(2.4, 0.22, 0.45), x, Y1 + 3.05, F2 - 0.12);
    });

    [-9.6, -6.4, -2.6, 2.6, 6.4, 9.6].forEach((x) => pillar(x, Y1 + 1.13, 5.3, 0.44, F2 + 0.36, 'corinthian'));

    // tier-2 cornice — the deepest band on the facade
    add(trim, box(21.8, 0.5, F2 - 0.3), 0, Y2 + 0.25, (F2 + 1.0) / 2 + 0.2);
    add(trim, box(22.6, 0.4, F2 + 0.2), 0, Y2 + 0.70, (F2 + 1.0) / 2 + 0.25);

    /* -- tier 3: attic with cartouche ----------------------------------- */
    block(wall, 13.5, Y3 - (Y2 + 1.05), F3 - 1.0, 0, Y2 + 1.05, (F3 + 1.0) / 2);
    block(base, 13.9, 0.34, F3 - 0.9, 0, Y2 + 1.05, (F3 + 1.1) / 2);

    // small central window in the attic
    add('dark', arch(1.5, 2.3, 0.24), 0, Y2 + 1.7, F3 - 0.35);
    add(trim, archFrame(1.95, 2.7, 0.26, 0.3), 0, Y2 + 1.7, F3 - 0.14);
    // gold cartouche below it
    add('gold', sph(0.62, 10), 0, Y2 + 1.5, F3 + 0.18, { sy: 1.25, sz: 0.35 });

    [-5.6, -3.0, 3.0, 5.6].forEach((x) => {
      add(trim, box(0.9, 2.5, 0.5), x, Y2 + 2.35, F3 + 0.14);
      add(trim, box(1.2, 0.22, 0.7), x, Y2 + 3.66, F3 + 0.14);
    });

    add(trim, box(14.6, 0.42, F3 - 0.2), 0, Y3 + 0.21, (F3 + 1.0) / 2 + 0.2);
    add(trim, box(15.1, 0.32, F3 + 0.1), 0, Y3 + 0.58, (F3 + 1.0) / 2 + 0.25);

    /* -- the pediment: extruded triangular prism + raking cornice -------- */
    const PW = 14.0, PH = TP - (Y3 + 0.74), PEDB = Y3 + 0.74;
    add(wall, triPrism(PW, PH, 3.4), 0, PEDB, 2.7);
    // tympanum oculus
    add('dark', cyl(0.86, 0.86, 0.2, 14), 0, PEDB + PH * 0.42, F3 - 0.06, { rx: Math.PI / 2 });
    add(trim, torus(0.99, 0.20, 5, 16), 0, PEDB + PH * 0.42, F3 + 0.06);

    const rakeA = Math.atan2(PH, PW / 2);
    const rakeL = Math.hypot(PW / 2, PH) + 0.55;
    [-1, 1].forEach((s) => {
      const mx = s * PW / 4, my = PEDB + PH / 2;
      const nx = s * Math.sin(rakeA) * 0.24, ny = Math.cos(rakeA) * 0.24;
      // projecting raking cornice — sits proud of the tympanum face
      add(trim, box(rakeL, 0.52, 4.5), mx + nx, my + ny, 2.95, { rz: -s * rakeA });
      // inner fillet under the rake
      add(trim, box(rakeL - 0.45, 0.22, 4.1), mx - s * Math.sin(rakeA) * 0.48, my - Math.cos(rakeA) * 0.48,
        2.85, { rz: -s * rakeA });
    });
    // a crowning band along the base of the pediment
    add(trim, box(PW + 0.9, 0.44, 4.6), 0, PEDB - 0.16, 2.9);
    add(trim, box(1.5, 0.6, 3.4), 0, TP + 0.12, 2.7);
    add(base, box(1.0, 0.28, 2.2), 0, TP - 0.05, 2.7);

    /* -- volutes: S-scrolls from the attic down to the corner pinnacles -- */
    const VP = 4.95;   // volute plane, proud of the pediment face
    [-1, 1].forEach((s) => {
      // tangent-continuous S: a convex upper arc that inflects into the eye
      const pts = [];
      const R1 = 1.05, C1x = 6.40, C1y = 19.30;      // upper arc
      for (let i = 0; i <= 9; i++) {
        const th = Math.PI / 2 * (1 - i / 9);         // 90deg -> 0deg
        pts.push([s * (C1x + Math.cos(th) * R1), C1y + Math.sin(th) * R1, VP]);
      }
      const C2x = 8.60, C2y = 19.30, R0 = 1.15, turns = 1.4;   // the eye
      const N = 44;
      for (let i = 1; i <= N; i++) {
        const t = i / N;
        const th = Math.PI + t * turns * Math.PI * 2;
        const r = R0 * (1 - t * 0.66);
        pts.push([s * (C2x + Math.cos(th) * r), C2y + Math.sin(th) * r, VP]);
      }
      sweep(pts, 0.32, trim, 78, 7);

      // corner pinnacle the volute lands on
      const px = s * 9.75;
      block(base, 2.0, 0.42, 2.0, px, Y2 + 0.9, 3.9);
      block(trim, 1.5, 0.75, 1.5, px, Y2 + 1.32, 3.9);
      add(trim, cyl(0.34, 0.52, 1.05, 8), px, Y2 + 2.6, 3.9);
      add(trim, sph(0.33, 8), px, Y2 + 3.2, 3.9);
      add('gold', cone(0.22, 0.7, 8), px, Y2 + 3.62, 3.9);
    });

    /* -- cross on the apex ---------------------------------------------- */
    add('gold', cyl(0.14, 0.2, 1.5, 8), 0, TP + 1.15, 2.7);
    add('gold', box(0.20, 1.9, 0.20), 0, TP + 2.6, 2.7);
    add('gold', box(1.05, 0.20, 0.20), 0, TP + 3.15, 2.7);

    /* ------------------------------------------------------------------ *
     * grounds: people, palms, lamps, boundary, the neighbouring convent
     * ------------------------------------------------------------------ */
    const people = [[-6, 18], [7, 19], [-13, 15], [15, 16], [0, 23], [-19, 25], [19, 26], [-3, 14], [10, 15]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-19, 17], [19, 17], [-24, 28], [24, 28], [0, 31], [-9, 30], [9, 30]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-27, 20], [27, 20], [-31, 6], [31, 6], [-29, 32], [29, 32], [-34, 30], [34, 30]]
      .forEach(([x, z]) => ctx.tree(x, z, 1.3, 'palm'));

    block(trim, 74, 3.6, 1.0, 0, 0, -34);          // convent wall behind
    block(wall, 13, 10, 11, -33, 0, -29);          // neighbouring chapel
    add('terracotta', box(14, 0.5, 12), -33, 10, -29);
    add('marble', dome(2.8, 2.3, 16), -33, 10.3, -29);

    ctx.light({ pos: [-22, 13, 32], target: [0, 14, 2], color: 0xffd0a0, intensity: 1300, distance: 240 });
    ctx.light({ pos: [22, 13, 30], target: [0, 14, 2], color: 0xffc890, intensity: 1100, distance: 240 });
  }
};
