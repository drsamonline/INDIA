/* Basilica of Bom Jesus — Old Goa · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured proportions (1 unit = 1 m). The Archaeological Survey of
   India and Goa Tourism give the church as 55.77 m long, 16.76 m broad and
   18.59 m high inside; the nave is 50 m by 23 m with a chancel of 15 m by
   15 m. The three-storeyed facade is about 16 m wide at the nave and rises to
   an apex around 25 m — well above the ridge of the tiled roof behind it.
   The walls are laterite; the orders and carving are Bassein basalt.

   Datum:
     0     plinth top
     8.6   head of the ground tier (three portals)
     14.6  head of the second tier (three windows)
     19.4  head of the third tier (three oculi)
     20.2  attic and volutes
     25.0  apex of the pediment                                              */

export default {
  id: 'basilica-bom-jesus',
  accent: '#c0a68c',
  accent2: '#e8d9bf',
  seed: 97,
  floodScale: 0.3,
  time: 15.4,
  bounds: 74,
  minDist: 16,
  maxDist: 280,
  home: { pos: [46, 17, 44], target: [0, 11, -9], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8b9a63, tile: 18 },
  views: [
    { name: 'Full', pos: [46, 17, 44], target: [0, 11, -9] },
    { name: 'Facade', pos: [11, 14, 43], target: [0, 12, 0] },
    { name: 'Portal', pos: [0, 6, 26], target: [0, 7, 1] },
    { name: 'Nave', pos: [34, 20, 20], target: [0, 11, -16] },
    { name: 'Interior', pos: [0, 4.2, -3.4], target: [0, 7, -49.2] },
    { name: 'From the square', pos: [-46, 14, 40], target: [0, 13, -2] }
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
      text: 'Inside, a barrel vault boarded and painted over the nave runs to a gilded retable, and the chapel on the north side holds the silver casket of St Francis Xavier, the Jesuit missionary who died off the China coast in 1552. His relics are displayed every ten years.',
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
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    /* laterite walls, basalt orders, cream plaster panels */
    const LT = 'plasterWhite', LT2 = 'terracotta', BA = 'basaltDark', TR = 'cream', DK = 'dark';

    /* ---- local geometry makers ------------------------------------------ */
    const triPrism = (w, h, depth) => {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
      const g = new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false });
      g.translate(0, 0, -depth / 2);
      return g;
    };
    const sweep = (pts, r, key, seg = 44, rad = 7) => {
      const c = new T3.CatmullRomCurve3(pts.map((p) => new T3.Vector3(p[0], p[1], p[2])));
      add(key, new T3.TubeGeometry(c, seg, r, rad, false), 0, 0, 0);
    };
    /* one classical pilaster: plinth, shaft, capital, abacus */
    const pilaster = (x, y0, h, w, z, style) => {
      const d = 0.42;
      block(BA, w * 1.5, 0.34, d * 1.5, x, y0, z);
      block(BA, w, h - 1.15, d, x, y0 + 0.34, z);
      // fluting
      for (let i = -1; i <= 1; i++) add(BA, box(0.07, h - 1.5, 0.06), x + i * w * 0.26, y0 + h * 0.5, z + d * 0.5);
      if (style === 'corinthian') {
        add(BA, box(w * 1.25, 0.42, d * 1.2), x, y0 + h - 0.79, z);
        for (let i = -1; i <= 1; i += 2) add(BA, sph(w * 0.20, 6), x + i * w * 0.34, y0 + h - 0.62, z + d * 0.4);
      } else if (style === 'ionic') {
        add(BA, box(w * 1.2, 0.26, d * 1.15), x, y0 + h - 0.78, z);
        for (let i = -1; i <= 1; i += 2) add(BA, torus(w * 0.20, 0.10, 4, 10), x + i * w * 0.52, y0 + h - 0.72, z + d * 0.35, { rx: Math.PI / 2 });
      } else {
        add(BA, box(w * 1.22, 0.32, d * 1.15), x, y0 + h - 0.80, z);
      }
      add(BA, box(w * 1.45, 0.20, d * 1.35), x, y0 + h - 0.30, z);
    };
    const oculus = (x, y, z, r) => {
      add(DK, cyl(r, r, 0.3, 16), x, y, z, { rx: Math.PI / 2 });
      add(BA, torus(r, r * 0.20, 5, 18), x, y, z + 0.1);
      add(BA, box(r * 3.1, 0.26, 0.5), x, y - r * 1.55, z + 0.08);
      for (let i = -1; i <= 1; i += 2) add(BA, box(0.26, r * 2.4, 0.5), x + i * r * 1.5, y, z + 0.08);
    };

    /* ---- plinth, steps, forecourt --------------------------------------- */
    const Y0 = 1.1;
    block(BA, 60, Y0, 62, 0, 0, -20);
    block('stone', 56, 0.3, 58, 0, Y0, -20);
    add('paving', box(58, 0.26, 34), 0, 0.95, 22);
    ctx.stairs(0, 0, 7, 12, 1.1, 4, 0.9, BA);
    for (let i = 0; i < 4; i++) add(BA, box(58, 0.10, 0.18), 0, 1.06, 16 + i * 4);

    /* ---- the nave: 55.77 m long, 16.76 m broad, 18.59 m high ------------- */
    const NW = 16.76, NH = 18.6, NL = 55.77;
    const ZF = 0.6;                     // the facade plane
    const ZB = ZF - NL;                 // the east end
    const NZC = (ZF + ZB) / 2;
    /* The nave was one solid block, so there was no interior at all and the
       tour admitted it. It is hollow now: two long walls, an east wall, a
       barrel vault over the whole width, and the fittings the church is known
       for — the gilded retable, the side altars, the casket chapel and the
       painted ceiling. */
    const WT = 1.2;                       // wall thickness
    const IX = NW / 2 - WT / 2;           // centreline of each long wall
    const IZ0 = ZF - WT, IZ1 = ZB + WT;   // inner faces of the end walls
    block('stone', NW - 2 * WT, 0.5, NL - 2 * WT, 0, Y0, NZC);      // the floor
    [-1, 1].forEach((sd) => block(LT, WT, NH - Y0, NL, sd * IX, Y0, NZC));
    block(LT, NW, NH - Y0, WT, 0, Y0, ZB + WT / 2);                 // east wall
    block(LT, NW, NH - Y0, WT, 0, Y0, ZF - WT / 2);                 // west wall
    // the chancel arch through the east wall
    add(DK, ctx.arch(9.0, 12.0, WT + 0.2), 0, Y0 + 0.5, ZB + WT / 2);
    add(BA, ctx.archFrame(10.2, 12.8, 0.4, 0.5), 0, Y0 + 0.5, ZB + WT / 2 + 0.2);

    /* ---- the barrel vault, and its painted panels ----------------------- */
    const VDS = (() => {                       // laterite, lit from inside
      const mm = ctx.mat('cream');
      if (!mm || !mm.clone) return 'cream';
      const c = mm.clone();
      c.side = ctx.THREE.DoubleSide;
      c.color.setHex(0xd8bb8c);
      // a point light cannot reach a 55 m vault, and a light hung under it faces
      // away from the surface it is meant to light: the painted ceiling is
      // self-lit, which is how it reads through the door of the real church
      if (ctx.THREE && c.emissive) {
        c.emissive = new ctx.THREE.Color(0x8a6f4a);
        c.emissiveIntensity = 1.0;
      }
      c.needsUpdate = true;
      return c;
    })();
    /* A boarded ceiling in two slopes meeting at a shallow ridge. The barrel
       vault was a rotated open cylinder, and from inside the crown of it never
       drew — a band of nothing down the middle of the nave. Two boards cannot
       miss: there is no back face to get wrong. */
    const VY = NH - 1.0;                       // the eaves of the ceiling
    const VRIDGE = NH + 1.4;
    const cAng = Math.atan2(VRIDGE - VY, IX);
    const cLen = Math.hypot(IX, VRIDGE - VY);
    [-1, 1].forEach((sd) => {
      add(VDS, box(cLen + 0.4, 0.30, NL - 2 * WT), sd * IX / 2,
        (VY + VRIDGE) / 2, NZC, { rz: sd * cAng });
    });
    add(VDS, box(0.6, 0.4, NL - 2 * WT), 0, VRIDGE - 0.1, NZC);
    // painted panels: the ceiling of the nave is boarded and painted, not bare
    const PAINT = (() => {
      const mm = ctx.mat('cream');
      if (!mm || !mm.clone) return 'cream';
      const c = mm.clone();
      c.color.setHex(0xc9a06a);
      return c;
    })();
    for (let i = -6; i <= 6; i++) {
      const z = NZC + i * (NL - 2 * WT) / 13.5;
      add(BA, box(0.5, 0.34, 0.6), 0, VRIDGE - 0.34, z);        // a rib across the ridge
      for (const sd of [-1, 1]) {
        add(BA, box(0.45, 0.30, 0.55), sd * IX * 0.45, VY + (VRIDGE - VY) * 0.55 - 0.3, z);
        add(PAINT, box(cLen * 0.42, 0.06, 3.6), sd * IX * 0.52,
          VY + (VRIDGE - VY) * 0.48 - 0.34, z + 1.6, { rz: sd * cAng });
      }
    }

    /* ---- the gilded retable at the east end ----------------------------- */
    (function retable() {
      const z0 = ZB + WT + 0.1;
      block(BA, 13.0, 0.9, 3.2, 0, Y0 + 0.5, z0 + 1.6);          // the predella
      block(BA, 11.0, 1.2, 2.4, 0, Y0 + 1.4, z0 + 1.2);
      // four gilt columns carrying an entablature and a broken pediment
      for (const x of [-4.4, -1.5, 1.5, 4.4]) {
        add('gold', ctx.cyl(0.42, 0.46, 6.4, 10), x, Y0 + 2.6, z0 + 0.9);
        add('gold', ctx.cyl(0.58, 0.58, 0.36, 10), x, Y0 + 9.0, z0 + 0.9);
      }
      add('gold', box(10.4, 0.7, 1.1), 0, Y0 + 9.6, z0 + 0.9);    // entablature
      add('gold', box(9.0, 0.5, 0.9), 0, Y0 + 10.2, z0 + 0.9);
      // the centre panel: a gilt frame round a dark painting
      add(DK, box(3.4, 4.6, 0.2), 0, Y0 + 6.4, z0 + 0.5);
      add('gold', box(4.0, 5.2, 0.16), 0, Y0 + 6.4, z0 + 0.42);
      // tabernacle and its crown
      add('gold', box(2.2, 2.0, 1.4), 0, Y0 + 2.5, z0 + 1.6);
      add('gold', ctx.dome(1.0, 1.2, 12), 0, Y0 + 3.5, z0 + 1.6);
      add('gold', ctx.cone(0.24, 0.9, 6), 0, Y0 + 4.9, z0 + 1.6);
    })();

    /* ---- the two side altars -------------------------------------------- */
    [-1, 1].forEach((sd) => {
      const z = NZC + sd * 6.0;
      const x = sd * (IX - 0.4);
      block(BA, 0.9, 0.7, 4.6, x - sd * 0.5, Y0 + 0.5, z);
      add('gold', box(0.7, 0.5, 3.4), x - sd * 0.9, Y0 + 1.4, z);
      add(DK, box(0.2, 2.6, 2.0), x - sd * 1.05, Y0 + 3.0, z);
      add('gold', box(0.16, 3.0, 2.4), x - sd * 1.12, Y0 + 3.0, z);
      for (const o of [-1.5, 1.5]) {
        add('gold', ctx.cyl(0.20, 0.22, 2.6, 8), x - sd * 0.95, Y0 + 1.6, z + o);
      }
    });

    /* ---- the chapel of the relics, on the north flank ------------------- */
    (function casket() {
      const x = -(IX - 1.6), z = NZC - 9;
      block(BA, 3.4, 1.5, 5.0, x - 0.4, Y0 + 0.5, z);             // the platform
      add('stone', ctx.cyl(0.9, 0.9, 0.9, 8), x - 0.4, Y0 + 2.6, z);
      // the silver casket, in its glass case
      add('gold', box(2.0, 0.9, 1.2), x - 0.4, Y0 + 3.4, z);
      add('plasterWhite', box(1.8, 0.2, 1.0), x - 0.4, Y0 + 3.95, z);
      add('glass', box(2.6, 2.4, 1.8), x - 0.4, Y0 + 3.6, z);
      // a lamp and a pair of candles in front of it
      add('gold', ctx.cyl(0.10, 0.10, 0.8, 6), x + 0.6, Y0 + 2.4, z + 1.6);
      add('gold', ctx.sph(0.16, 8), x + 0.6, Y0 + 2.9, z + 1.6);
    })();

    /* ---- pews ----------------------------------------------------------- */
    for (let i = 0; i < 9; i++) {
      const z = NZC + 12 - i * 2.6;
      [-1, 1].forEach((sd) => {
        add(BA, box(5.4, 0.16, 0.7), sd * 3.4, Y0 + 1.5, z);
        add(BA, box(5.4, 1.0, 0.14), sd * 3.4, Y0 + 2.0, z - 0.34);
        add(BA, box(0.14, 1.0, 0.7), sd * 3.4 - 2.6, Y0 + 2.0, z);
        add(BA, box(0.14, 1.0, 0.7), sd * 3.4 + 2.6, Y0 + 2.0, z);
      });
    }
    // light for the interior: without it the nave is a black box
    // uplights on the vault, and one downlight on the floor: a light hung under
    // the vault faces away from the surface it is meant to light
    /* The engine's floods are spotlights that only switch on towards dusk, so a
       midday interior gets the ambient alone and renders as a black box. The
       inner faces are lined with a faintly self-lit plaster instead: at this
       scale that is what the light off lime-washed walls looks like, and it
       touches nothing on the outside. */
    const INNER = (() => {
      const mm = ctx.mat('cream');
      if (!mm || !mm.clone) return 'cream';
      const c = mm.clone();
      c.color.setHex(0xd6c6a8);
      if (ctx.THREE && c.emissive) {
        c.emissive = new ctx.THREE.Color(0x6a5940);
        c.emissiveIntensity = 1.0;
      }
      return c;
    })();
    [-1, 1].forEach((sd) => {
      add(INNER, box(0.06, NH - Y0 - 1.0, NL - 2 * WT), sd * (IX - WT / 2 - 0.03),
        Y0 + (NH - Y0 - 1.0) / 2, NZC);
    });
    add(INNER, box(NW - 2 * WT, 0.05, NL - 2 * WT), 0, Y0 + 0.52, NZC);
    add(INNER, box(NW - 2 * WT, NH - Y0 - 1.0, 0.06), 0, Y0 + (NH - Y0 - 1.0) / 2, ZB + WT + 0.03);

    // A 55 m interior needs candle-power on the scale of the exterior floods,
    // not the 1000 the first attempt used: at that intensity the nave rendered
    // as a black box with a lit altar.
    ctx.light({ pos: [0, NH - 3, NZC + 16], target: [0, Y0 + 2, NZC + 8], color: 0xffe6c0, intensity: 5200, distance: 120 });
    ctx.light({ pos: [0, NH - 3, NZC - 2], target: [0, Y0 + 2, NZC - 8], color: 0xffe6c0, intensity: 5200, distance: 120 });
    ctx.light({ pos: [0, NH - 3, NZC - 18], target: [0, Y0 + 3, NZC - 24], color: 0xffd9a8, intensity: 4200, distance: 110 });
    ctx.light({ pos: [0, Y0 + 4, ZB + 8], target: [0, Y0 + 7, ZB + 1], color: 0xffe0b0, intensity: 2600, distance: 60 });
    ctx.light({ pos: [0, Y0 + 3, NZC + 4], target: [0, NH - 1, NZC - 4], color: 0xfff0d8, intensity: 1800, distance: 80 });
    block(BA, NW + 0.5, 0.5, NL + 0.3, 0, Y0, NZC);          // plinth course
    block(BA, NW + 1.0, 0.7, NL + 0.7, 0, NH - 0.7, NZC);    // eaves cornice
    // the projecting gallery that runs along both long sides
    [-1, 1].forEach((sd) => {
      add(BA, box(1.7, 0.4, NL - 4), sd * (NW / 2 + 0.85), NH - 5.2, NZC);
      for (let i = -4; i <= 4; i++) {
        add(BA, box(1.5, 0.7, 0.5), sd * (NW / 2 + 0.75), NH - 5.8, NZC + i * 5.6);
        add(TR, box(0.22, 1.0, 0.22), sd * (NW / 2 + 1.6), NH - 4.4, NZC + i * 5.6);
      }
      add(TR, box(0.22, 0.16, NL - 4), sd * (NW / 2 + 1.6), NH - 3.9, NZC);
    });
    // buttresses, and the clerestory between them
    for (let i = -4; i <= 4; i++) {
      [-1, 1].forEach((sd) => {
        add(LT, box(1.5, NH - 2.6, 2.4), sd * (NW / 2 + 0.5), Y0 + (NH - 2.6) / 2, NZC + i * 6.2);
        add(BA, box(1.9, 0.5, 2.8), sd * (NW / 2 + 0.5), NH - 2.8, NZC + i * 6.2);
      });
    }
    for (let i = -3; i <= 3; i++) {
      [-1, 1].forEach((sd) => {
        add(DK, ctx.arch(1.5, 3.4, 0.24), sd * (NW / 2 - 0.02), Y0 + 8.4, NZC + i * 6.2,
          { ry: sd > 0 ? Math.PI / 2 : -Math.PI / 2 });
        add(BA, ctx.archFrame(1.9, 3.9, 0.24, 0.3), sd * (NW / 2 + 0.04), Y0 + 8.4, NZC + i * 6.2,
          { ry: sd > 0 ? Math.PI / 2 : -Math.PI / 2 });
      });
    }
    // the side chapel that holds the relics, on the north flank
    block(LT, 7, 9.0, 9, -NW / 2 - 3.2, Y0, NZC - 9);
    block(BA, 7.6, 0.6, 9.6, -NW / 2 - 3.2, Y0 + 9.0, NZC - 9);
    add(BA, cyl(2.6, 2.6, 0.5, 14), -NW / 2 - 3.2, Y0 + 9.7, NZC - 9);

    /* ---- the gabled tiled roof: ridge 21.4, below the facade ------------- */
    const RIDGE = 21.4, halfW = NW / 2 + 0.6, rise = RIDGE - NH;
    const slope = Math.atan2(rise, halfW), slopeLen = Math.hypot(halfW, rise);
    [-1, 1].forEach((sd) => {
      add(LT2, box(slopeLen, 0.5, NL + 0.8), sd * halfW / 2, NH + rise / 2, NZC, { rz: -sd * slope });
      for (let i = 0; i < 14; i++) {
        const z = NZC - NL / 2 + 1.4 + i * (NL - 2.8) / 13;
        add('brick', box(slopeLen - 0.4, 0.28, 0.36), sd * halfW / 2 + sd * Math.sin(slope) * 0.36,
          NH + rise / 2 + Math.cos(slope) * 0.36, z, { rz: -sd * slope });
      }
    });
    add(LT2, box(1.2, 0.45, NL + 0.8), 0, RIDGE + 0.2, NZC);
    // the rear gable
    add(LT, triPrism(NW + 0.4, rise + 0.2, 0.9), 0, NH, ZB - 0.4);
    /* The bell tower. It was modelled at the rear of the nave, where nothing
       could see it; the church's actual silhouette is asymmetric — one tall
       square tower at the front, on the right of the facade as you face it.
       The left tower was never completed, and the facade alone is what the
       photographs show. */
    const TX = NW / 2 + 3.6, TZ = ZF - 4.6, TH = 27;
    block(LT, 7, TH, 7, TX, Y0, TZ);
    block(BA, 7.8, 0.7, 7.8, TX, Y0 + 2.4, TZ);          // plinth band
    [9.0, 15.4, 21.6].forEach((y) => add(BA, box(7.4, 0.4, 7.4), TX, Y0 + y, TZ));
    // the belfry opening, facing the forecourt, and one on the flank
    add(DK, ctx.arch(2.4, 4.4, 0.4), TX, Y0 + 16.4, TZ + 3.55);
    add(BA, ctx.archFrame(3.0, 5.0, 0.36, 0.42), TX, Y0 + 16.4, TZ + 3.75);
    add(DK, ctx.arch(2.4, 4.4, 0.4), TX + 3.55, Y0 + 16.4, TZ, { ry: Math.PI / 2 });
    add(BA, ctx.archFrame(3.0, 5.0, 0.36, 0.42), TX + 3.75, Y0 + 16.4, TZ, { ry: Math.PI / 2 });
    // balustrade, then a small dome and a finial
    block(BA, 7.9, 0.6, 7.9, TX, Y0 + TH, TZ);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      add(BA, cyl(0.28, 0.34, 1.1, 6), TX + Math.cos(a) * 3.4, Y0 + TH + 1.15, TZ + Math.sin(a) * 3.4);
    }
    add(LT2, dome(3.4, 2.6, 16), TX, Y0 + TH + 0.6, TZ);
    add(BA, cyl(0.24, 0.34, 1.5, 8), TX, Y0 + TH + 3.9, TZ);

    /* ==================================================================== *
     * THE FACADE — three tiers, an attic and a pediment, apex at 25 m
     * ==================================================================== */
    /* proportions taken off the front elevation: the ground tier is a
       quarter of the facade, the two middle tiers a fifth each, and the
       attic and pediment together take the top two-fifths. */
    const F1 = 19.4, F2 = 17.4, F3 = 14.8, F4 = 10.6;
    const Y1 = 6.5, Y2 = 10.8, Y3 = 16.0, YA = 20.2, APEX = 25.0;
    const Z1 = ZF + 1.6, Z2 = ZF + 1.2, Z3 = ZF + 0.85, Z4 = ZF + 0.6;

    /* -- tier 1: three portals, eight pilasters, heavy entablature -------- */
    block(LT, F1, Y1 - Y0, 2.4, 0, Y0, ZF + 0.25);
    block(BA, F1 + 0.5, 0.45, 2.9, 0, Y0, ZF + 0.25);
    // the central portal
    add(DK, ctx.arch(3.9, 5.0, 0.5), 0, Y0, Z1 - 0.35);
    add(BA, ctx.archFrame(4.6, 5.6, 0.44, 0.5), 0, Y0, Z1 - 0.12);
    add(BA, box(6.0, 0.3, 0.85), 0, Y0 + 5.6, Z1 + 0.28);
    add(LT, triPrism(6.0, 1.2, 0.85), 0, Y0 + 5.85, Z1 + 0.5);
    [-1, 1].forEach((s2) => {
      const a = Math.atan2(1.2, 3.0), L = Math.hypot(3.0, 1.2) + 0.28;
      add(BA, box(L, 0.28, 1.0), s2 * 1.5, Y0 + 6.45, Z1 + 0.5, { rz: -s2 * a });
    });
    add(BA, box(0.55, 0.4, 1.0), 0, Y0 + 7.15, Z1 + 0.5);
    // the two side portals
    [-1, 1].forEach((s2) => {
      add(DK, box(2.2, 3.6, 0.4), s2 * 6.2, Y0 + 1.8, Z1 - 0.3);
      add(BA, ctx.archFrame(2.9, 4.2, 0.3, 0.38), s2 * 6.2, Y0, Z1 - 0.1);
      add(BA, box(3.4, 0.26, 0.65), s2 * 6.2, Y0 + 4.3, Z1 + 0.18);
      add(LT, triPrism(3.3, 0.85, 0.65), s2 * 6.2, Y0 + 4.5, Z1 + 0.32);
      // a carved panel in the outer bay
      add(DK, ctx.arch(1.2, 2.5, 0.2), s2 * 8.5, Y0 + 1.0, Z1 - 0.2);
      add(BA, ctx.archFrame(1.6, 2.9, 0.2, 0.24), s2 * 8.5, Y0 + 1.0, Z1 - 0.05);
    });
    // paired pilasters between the bays
    [-9.0, -7.5, -4.4, -2.9, 2.9, 4.4, 7.5, 9.0].forEach((x) => pilaster(x, Y0, 5.5, 0.66, Z1 + 0.26, 'doric'));
    add(BA, box(F1 + 0.7, 0.42, 2.5), 0, Y1 + 0.22, ZF + 0.5);
    add(TR, box(F1 + 0.2, 0.15, 0.2), 0, Y1 + 0.57, Z1 + 0.18);
    add(BA, box(F1 + 1.1, 0.34, 2.3), 0, Y1 + 0.78, ZF + 0.55);

    /* -- tier 2: three windows, each with its own pediment ---------------- */
    block(LT, F2, Y2 - (Y1 + 1.1), 2.0, 0, Y1 + 1.1, ZF + 0.05);
    block(BA, F2 + 0.4, 0.36, 2.4, 0, Y1 + 1.1, ZF + 0.05);
    [-5.8, 0, 5.8].forEach((x, i) => {
      add(DK, box(1.6, 2.8, 0.34), x, Y1 + 2.7, Z2 - 0.28);
      add(BA, box(2.0, 0.24, 0.5), x, Y1 + 1.28, Z2 - 0.1);       // sill
      add(BA, box(2.1, 0.24, 0.5), x, Y1 + 4.15, Z2 - 0.1);       // head
      add(LT, triPrism(2.1, 0.7, 0.5), x, Y1 + 4.31, Z2 + 0.04);  // little pediment
      if (i === 1) {
        add(BA, box(3.8, 0.26, 1.1), x, Y1 + 1.12, Z2 + 0.45);    // balcony
        for (let k = -2; k <= 2; k++) add(TR, box(0.15, 0.7, 0.15), x + k * 0.9, Y1 + 1.55, Z2 + 0.85);
        add(TR, box(3.6, 0.13, 0.15), x, Y1 + 1.92, Z2 + 0.85);
      }
    });
    [-8.0, -4.2, -2.2, 2.2, 4.2, 8.0].forEach((x) => pilaster(x, Y1 + 1.1, 3.4, 0.6, Z2 + 0.24, 'ionic'));
    add(BA, box(F2 + 0.7, 0.4, 2.2), 0, Y2 + 0.2, ZF + 0.4);
    add(BA, box(F2 + 1.1, 0.3, 2.0), 0, Y2 + 0.58, ZF + 0.45);

    /* -- tier 3: three oculi in heavy carved surrounds -------------------- */
    block(LT, F3, Y3 - (Y2 + 1.0), 1.7, 0, Y2 + 1.0, ZF - 0.15);
    block(BA, F3 + 0.4, 0.34, 2.1, 0, Y2 + 1.0, ZF - 0.15);
    [-4.4, 0, 4.4].forEach((x) => oculus(x, Y2 + 2.7, Z3 - 0.2, 1.45));
    [-6.4, -2.2, 2.2, 6.4].forEach((x) => pilaster(x, Y2 + 1.0, 3.8, 0.54, Z3 + 0.18, 'corinthian'));
    add(BA, box(F3 + 0.7, 0.36, 1.9), 0, Y3 + 0.18, ZF + 0.3);
    add(BA, box(F3 + 1.1, 0.28, 1.7), 0, Y3 + 0.52, ZF + 0.35);

    /* -- the attic: the IHS panel between two great volutes ---------------- */
    block(LT, F4, YA - Y3 - 0.75, 1.5, 0, Y3 + 0.75, ZF - 0.30);
    add(BA, box(5.2, 3.2, 0.4), 0, Y3 + 2.6, Z4 - 0.1);
    add('gold', sph(0.85, 10), 0, Y3 + 2.6, Z4 + 0.18, { sy: 1.15, sz: 0.35 });
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      add('gold', box(0.12, 0.85, 0.09), Math.cos(a) * 1.35, Y3 + 2.6 + Math.sin(a) * 1.35, Z4 + 0.16, { rz: a - Math.PI / 2 });
    }
    add(BA, box(6.0, 0.28, 0.6), 0, Y3 + 0.95, Z4 - 0.02);

    // the volutes: a wide S-scroll from the attic's foot out to the corners
    const VP = Z4 + 0.16;
    [-1, 1].forEach((sd) => {
      const pts = [];
      for (let i = 0; i <= 8; i++) {
        const th = Math.PI / 2 * (1 - i / 8);
        pts.push([sd * (4.6 + Math.cos(th) * 1.1), Y3 + 1.4 + Math.sin(th) * 1.1, VP]);
      }
      const N = 40;
      for (let i = 1; i <= N; i++) {
        const t = i / N;
        const th = Math.PI + t * 1.45 * Math.PI * 2;
        const r = 1.5 * (1 - t * 0.72);
        pts.push([sd * (7.2 + Math.cos(th) * r), Y3 + 2.6 + Math.sin(th) * r, VP]);
      }
      sweep(pts, 0.25, BA, 66, 7);
      const px = sd * 8.2;
      block(BA, 2.2, 0.36, 2.2, px, Y3 + 0.75, Z4 - 0.35);
      block(LT, 1.7, 0.85, 1.7, px, Y3 + 1.11, Z4 - 0.35);
      add(BA, cyl(0.32, 0.5, 1.0, 8), px, Y3 + 2.4, Z4 - 0.35);
      add(BA, sph(0.34, 8), px, Y3 + 3.05, Z4 - 0.35);
      add('gold', cone(0.2, 0.65, 8), px, Y3 + 3.48, Z4 - 0.35);
    });

    // the pediment
    const PW = F4, PH = APEX - YA;
    add(LT, triPrism(PW, PH, 1.6), 0, YA, ZF + 0.2);
    oculus(0, YA + PH * 0.38, Z4 - 0.1, 0.78);
    const rakeA = Math.atan2(PH, PW / 2), rakeL = Math.hypot(PW / 2, PH) + 0.5;
    [-1, 1].forEach((sd) => {
      add(BA, box(rakeL, 0.42, 2.3), sd * PW / 4 + sd * Math.sin(rakeA) * 0.2,
        YA + PH / 2 + Math.cos(rakeA) * 0.2, ZF + 0.4, { rz: -sd * rakeA });
    });
    add(BA, box(PW + 1.0, 0.4, 2.4), 0, YA - 0.12, ZF + 0.4);
    [[-PW / 2, YA + 0.15], [PW / 2, YA + 0.15], [0, APEX + 0.05]].forEach(([x, y]) => {
      add(BA, box(0.75, 0.28, 0.75), x, y, ZF + 0.3);
      add(BA, sph(0.4, 8), x, y + 0.5, ZF + 0.3);
    });
    add('gold', box(0.2, 2.0, 0.2), 0, APEX + 1.35, ZF + 0.3);
    add('gold', box(1.1, 0.2, 0.2), 0, APEX + 1.9, ZF + 0.3);

    /* ---- grounds -------------------------------------------------------- */
    const people = [[-6, 16], [7, 17], [-13, 13], [15, 14], [0, 21], [-19, 23], [19, 24], [-3, 12], [10, 13]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-19, 15], [19, 15], [-24, 26], [24, 26], [0, 29], [-9, 28], [9, 28]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    [[-26, 18], [26, 18], [-30, 4], [30, 4], [-28, 30], [28, 30], [-34, 28], [34, 28]]
      .forEach(([x, z]) => ctx.tree(x, z, 1.3, 'palm'));

    block(BA, 76, 3.6, 1.0, 0, 0, -52);        // the convent wall behind
    block(LT, 13, 11, 11, -33, 0, -44);        // neighbouring chapel
    add(LT2, box(14, 0.5, 12), -33, 11, -44);
    add(BA, dome(2.8, 2.3, 16), -33, 11.3, -44);

    ctx.light({ pos: [-24, 14, 30], target: [0, 13, 2], color: 0xffd0a0, intensity: 620, distance: 220 });
    ctx.light({ pos: [24, 14, 28], target: [0, 13, 2], color: 0xffc890, intensity: 480, distance: 220 });
  }
};
