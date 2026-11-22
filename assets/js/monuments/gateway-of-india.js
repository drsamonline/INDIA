/* Gateway of India — Mumbai · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Rebuilt to measured dimensions.  1 unit = 1 metre.

   real (m)                          model     source
   ---------------------------------------------------------------------
   overall height, to turret tip      26.0      Wikipedia; Structurae 20018993
   central dome diameter              15.0      Wikipedia; TIFR Bombay pages (48 ft)
   dome apex above ground             25.3      TIFR Bombay pages (83 ft)
   plan                               oblong    Wikipedia: "rectangular, two long
                                                sides and two much shorter ones";
                                                octopylon, eight piers
   front façade width                ~36.0      scaled off the lead photograph
                                                (not stated in any source)
   block depth                       ~17.0      octopylon plan; not stated
   great arch span                     8.6      scaled off the lead photograph
   great arch crown (from arch floor) 12.0      scaled off the lead photograph
   great arch springing                8.6      scaled off the lead photograph
   flanking arch span                  3.1      scaled off the lead photograph
   flanking arch crown                 5.4      scaled off the lead photograph
   wing cornice                       17.4      scaled off the lead photograph
   central cornice                    20.4      scaled off the lead photograph

   The often-quoted "15 m arch" is the dome: Wikipedia, Structurae and the
   TIFR Bombay pages all give 15 m as the *dome diameter*.  A 15 m opening in
   a 26 m monument would make the façade 63 m wide, which the photograph
   rules out.  See the report. */

export default {
  id: 'gateway-of-india',
  accent: '#9aa8b4',
  accent2: '#c8d6e0',
  seed: 37,
  time: 11.4,
  exposure: 0.9,
  fogScale: 0.32,
  bounds: 66,
  minDist: 13,
  maxDist: 260,
  home: { pos: [44, 21, 84], target: [0, 12.5, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xa89c86, tile: 6 },
  groundY: -2.2,
  water: { y: -1.9, size: 300, x: 0, z: -170, color: 0x1b3540, distortion: 0.7 },
  views: [
    { name: 'Full', pos: [44, 21, 84], target: [0, 12.5, 0] },
    { name: 'The arch', pos: [7.5, 6.5, 26], target: [0, 8, 0] },
    { name: 'Turrets', pos: [15, 25, 30], target: [0, 19, 0] },
    { name: 'From the sea', pos: [34, 13, -64], target: [0, 12, 0] },
    { name: 'The quay', pos: [-22, 3.4, -26], target: [-6, 3, -6] }
  ],
  tour: [
    {
      title: 'A Gate to India', deva: 'गेटवे ऑफ़ इंडिया',
      text: 'The Gateway of India was built to mark the landing of King George V at Bombay in December 1911, the first British monarch to visit India. George Wittet\'s Indo-Saracenic design was sanctioned in 1914 and the arch finished in 1924.',
      pos: [54, 23, 80], target: [0, 14, 0], time: 11.6
    },
    {
      title: 'Basalt and Shadow', deva: 'मेहराब',
      text: 'Local basalt, 26 metres high, with a central arch about 15 metres across cut deep through the block. Two smaller arches flank it, and carved brackets carry the cornice above.',
      pos: [11, 10, 30], target: [0, 12, 0], time: 12
    },
    {
      title: 'Gujarati Detail', deva: 'जाली',
      text: 'The ornament draws on sixteenth-century Gujarati architecture: jaali screens, lotus motifs and slender columns set into the Indo-Saracenic frame Wittet used across Bombay.',
      pos: [15, 15, 28], target: [9, 15, 0], time: 9.6
    },
    {
      title: 'The Octagonal Towers', deva: 'मीनार',
      text: 'Two octagonal towers flank the arch, each under a ribbed dome of reinforced concrete. Together they give the monument the outline of a triumphal arch crossed with a mosque gateway.',
      pos: [26, 26, 38], target: [0, 21, 0], time: 16.4
    },
    {
      title: 'Apollo Bunder', deva: 'बंदरगाह',
      text: 'The Gateway faces the harbour at Apollo Bunder. The last British troops left India through this arch in 1948; today boats leave from the quay for Elephanta Island.',
      pos: [-34, 10, 44], target: [0, 13, 0], time: 17.8
    },
    {
      title: 'Harbour Lights', deva: 'रात्रि',
      text: 'After dark the basalt goes almost black and floodlights pick out the arch and the domes, with the city\'s lights across the water behind.',
      pos: [50, 20, 74], target: [0, 16, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, torus, dome, onion, block, col, plane } = ctx;

    function tint(key, hex) {
      const m = ctx.mat(key);
      if (!m || !m.clone) return key;
      const c = m.clone();
      c.color.setHex(hex);
      return c;
    }
    // weathered Deccan basalt is a warm buff-grey, not near-black
    const MASON = tint('basaltDark', 0xb0a184);
    const jaliTone = tint('jali', 0x8f7d63);      // shadowed pierced screen

    /* ------------------------------------------------------------ constants */
    const W = 36.0;             // façade width
    const D = 17.0;             // block depth
    const P = 1.0;              // top of the stepped plinth = arch floor
    const AW = 8.6, AH = 12.0, ASP = 0.715;   // great arch
    const SW = 3.1, SH = 5.4, SSP = 0.62;     // flanking and side arches
    const HCB = 19.6;           // central bay wall height above P
    const HWG = 16.0;           // wing wall height above P
    const DOME_R = 7.5;         // 15 m diameter
    const TOP = 26.0;

    const XC = AW / 2 + 4.3;    // centre of a flanking arch = 8.6
    const FLANK_X = 11.5;       // flanking arch centre
    const BAY = AW / 2 + 4.3;   // half-width of the central bay = 8.6

    /* -------------------------------------------------------- shape helpers */
    function pierced(w, h, depth, holes) {
      const s = new T3.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
      for (const o of holes) {
        const a = ctx.archShape(o.w, o.h, o.spring || 0.6);
        const pts = a.getPoints(20).map((p) => new T3.Vector2(p.x + o.x, p.y + (o.y || 0)));
        s.holes.push(new T3.Path(pts));
      }
      return new T3.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 });
    }
    /* a moulded arch ring: the hole is exactly w x h */
    function ring(w, h, spring, t, depth) {
      const outer = ctx.archShape(w + 2 * t, h + t, spring);
      const inner = ctx.archShape(w, h, spring);
      const pts = inner.getPoints(22).map((p) => new T3.Vector2(p.x, p.y + t * 0.55));
      outer.holes.push(new T3.Path(pts));
      return new T3.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 6 });
    }

    /* ------------------------------------------------ quay deck and the sea */
    block('paving', 620, 2.2, 420, 0, -2.2, 196);        // the raised quay deck
    block('stone', 96, 0.34, 60, 0, -0.34, 6);           // apron in front
    // sea wall on the harbour side, with a coping and mooring rings
    block(MASON, W + 22, 2.4, 1.8, 0, -2.4, -13.2);
    block('basalt', W + 22.6, 0.34, 2.4, 0, -0.14, -13.2);
    for (let i = -8; i <= 8; i++) {
      add('black', torus(0.22, 0.07, 5, 10), i * 3.4, -0.9, -12.3, { rx: Math.PI / 2 });
    }
    // steps behind the arch, down to the water
    for (let i = 0; i < 6; i++) {
      block('basalt', 13 - i * 0.4, 0.32, 0.9, 0, -0.32 - i * 0.32, -9.6 - i * 0.95);
    }
    // bollards along the quay edge
    for (let i = -7; i <= 7; i++) {
      if (Math.abs(i) < 2) continue;
      add('black', cyl(0.2, 0.26, 0.62, 8), i * 3.1, 0.31, -11.4);
      add('black', sph(0.22, 8), i * 3.1, 0.64, -11.4);
    }

    /* -------------------------------------------------- plinth and steps */
    block('stone', W + 9, 0.34, D + 9, 0, 0, 0);
    block('stone', W + 6, 0.34, D + 6, 0, 0.34, 0);
    block(MASON, W + 3.4, 0.32, D + 3.4, 0, 0.68, 0);
    for (let i = 0; i < 3; i++) {
      const w2 = 26 - i * 1.6, z = D / 2 + 5.2 + i * 0.95;
      add('stone', box(w2, 0.22 * (i + 1), 1.0), 0, 0.11 * (i + 1), z);
      add('stone', box(w2, 0.22 * (i + 1), 1.0), 0, 0.11 * (i + 1), -z);
    }

    /* ------------------------------------------------------ the front wall
       Central bay 17.2 m wide with the great arch, two wings 9.4 m wide
       each carrying a flanking arch at x = ±11.5. */
    add('basalt', pierced(2 * BAY, HCB, 2.6, [{ x: 0, w: AW, h: AH, spring: ASP }]),
      0, P, D / 2 - 2.6);
    add('basalt', pierced(2 * BAY, HCB, 2.6, [{ x: 0, w: AW, h: AH, spring: ASP }]),
      0, P, -D / 2);
    [-1, 1].forEach((s) => {
      add('basalt', pierced(9.4, HWG, 2.6, [{ x: -s * 1.8, w: SW, h: SH, spring: SSP }]),
        s * 13.3, P, D / 2 - 2.6);
      add('basalt', pierced(9.4, HWG, 2.6, [{ x: -s * 1.8, w: SW, h: SH, spring: SSP }]),
        s * 13.3, P, -D / 2);
    });
    /* the short faces: a single arch, 3.1 m, centred */
    [-1, 1].forEach((s) => {
      add('basalt', pierced(D, HWG, 2.6, [{ x: 0, w: SW, h: SH, spring: SSP }]),
        s * (W / 2 - 2.6), P, 0, { ry: s * Math.PI / 2 });
      // a shallow hall behind the side arch, dark
      add('dark', box(5.0, SH + 1.6, SW + 0.4), s * (W / 2 - 5.2), P + (SH + 1.6) / 2, 0);
    });
    // solid mass filling the wings behind the front walls
    [-1, 1].forEach((s) => {
      add(MASON, box(9.4, HWG, D - 5.2), s * 13.3, P + HWG / 2, 0);
    });

    /* ------------------------------------------ the great passage and vault
       The lining is one extruded pointed-arch ring running the full depth,
       so the vault reads as a genuine tunnel with the harbour at its end. */
    add(MASON, ring(AW, AH, ASP, 0.62, D), 0, P, -D / 2);
    // transverse ribs, standing proud of the lining
    [-5.6, -1.9, 1.9, 5.6].forEach((z) => {
      add('basalt', ring(AW - 0.5, AH - 0.3, ASP, 0.34, 0.8), 0, P, z - 0.4);
    });
    // keystone boss at the crown, front and back
    [-1, 1].forEach((s) => {
      add('basalt', box(0.9, 1.1, 0.5), 0, P + AH - 0.6, s * (D / 2 - 0.25));
    });
    // passage floor
    add('basalt', box(AW + 1.4, 0.2, D + 0.4), 0, P - 0.05, 0);

    /* ------------------------------------------------- archivolt and ornament
       Three moulded rings round the great arch, front and back. */
    [-1, 1].forEach((s) => {
      const zf = s * (D / 2 + 0.02);
      [0, 1, 2].forEach((k) => {
        add(k === 1 ? MASON : 'basalt',
          ring(AW + 1.5 + k * 0.9, AH + 0.7 + k * 0.55, ASP, 0.24, 0.3),
          0, P, zf + s * k * 0.28, { ry: s < 0 ? Math.PI : 0 });
      });
      // impost blocks at the springing, on the piers only
      [-1, 1].forEach((d) => {
        add('basalt', box(1.8, 0.5, 0.7), d * (AW / 2 + 0.95), P + 8.4, s * (D / 2 + 0.2));
      });
    });
    // projecting frame: pilasters either side of the arch and a lintel band
    [-1, 1].forEach((s) => {
      [-1, 1].forEach((d) => {
        add('basalt', box(1.0, 16.4, 0.75), d * (AW / 2 + 1.35), P + 8.2, s * (D / 2 + 0.3));
        add(MASON, box(1.4, 0.5, 0.9), d * (AW / 2 + 1.35), P + 0.25, s * (D / 2 + 0.3));
      });
      add('basalt', box(AW + 4.6, 0.7, 0.8), 0, P + 16.8, s * (D / 2 + 0.3));
    });
    // spandrel medallions
    [-1, 1].forEach((s) => {
      [[1, 0], [-1, 0]].forEach(([d]) => {
        add(MASON, torus(0.85, 0.16, 6, 14), d * 6.6, P + 10.2, D / 2 + 0.1);
        add('basalt', sph(0.42, 8), d * 6.6, P + 10.2, D / 2 + 0.16);
      });
    });

    /* ------------------------------------------------ entablature over the arch */
    add('basalt', box(2 * BAY + 0.6, 0.55, D + 0.6), 0, P + AH + 0.7, 0);
    // carved bracket course
    for (let i = -5; i <= 5; i++) {
      add(MASON, box(0.7, 0.9, 0.4), i * 1.6, P + AH + 1.5, D / 2 + 0.1);
      add(MASON, box(0.7, 0.9, 0.4), i * 1.6, P + AH + 1.5, -D / 2 - 0.1);
    }
    // the inscription band: a recessed panel with a moulded frame
    add('basalt', box(2 * BAY + 0.4, 3.2, D + 0.4), 0, P + 14.6, 0);
    [-1, 1].forEach((s) => {
      add(MASON, box(13.4, 2.3, 0.12), 0, P + 14.8, s * (D / 2 + 0.22));
      for (let i = 0; i < 4; i++) {
        add('basalt', box(11.4 - i * 0.5, 0.14, 0.06), 0, P + 13.95 + i * 0.5, s * (D / 2 + 0.3));
      }
      add('basalt', box(14.0, 0.26, 0.34), 0, P + 16.1, s * (D / 2 + 0.26));
    });

    /* ------------------------------------------ cornices, parapets, merlons */
    // wing cornice with dentils
    [-1, 1].forEach((s) => {
      add('basalt', box(9.4 + 0.9, 0.5, D + 0.9), s * 13.3, P + HWG + 0.25, 0);
      add(MASON, box(9.4 + 1.5, 0.3, D + 1.5), s * 13.3, P + HWG + 0.65, 0);
      for (let j = -4; j <= 4; j++) {
        add('basalt', box(0.36, 0.34, 0.34), s * 13.3 + j * 1.0, P + HWG + 0.98, D / 2 + 0.72);
        add('basalt', box(0.36, 0.34, 0.34), s * 13.3 + j * 1.0, P + HWG + 0.98, -D / 2 - 0.72);
        add('basalt', box(0.34, 0.34, 0.36), s * (13.3 + 4.9), P + HWG + 0.98, j * 1.9);
      }
      add('basalt', box(9.4 + 1.0, 0.55, D + 1.0), s * 13.3, P + HWG + 1.45, 0);
      // merlons along the wing parapet
      for (let i = -4; i <= 4; i++) {
        add('basalt', box(0.95, 0.85, 0.8), s * 13.3 + i * 1.05, P + HWG + 2.15, D / 2 + 0.4);
        add('basalt', box(0.95, 0.85, 0.8), s * 13.3 + i * 1.05, P + HWG + 2.15, -D / 2 - 0.4);
      }
    });
    // central bay cornice and parapet
    add('basalt', box(2 * BAY + 1.6, 0.5, D + 1.6), 0, P + 17.3, 0);
    add(MASON, box(2 * BAY + 2.2, 0.34, D + 2.2), 0, P + 17.72, 0);
    add('basalt', box(2 * BAY + 1.4, 0.6, D + 1.4), 0, P + 18.5, 0);
    for (let i = -6; i <= 6; i++) {
      add('basalt', box(0.95, 0.95, 0.8), i * 1.35, P + 19.3, D / 2 + 0.4);
      add('basalt', box(0.95, 0.95, 0.8), i * 1.35, P + 19.3, -D / 2 - 0.4);
    }
    for (let i = -5; i <= 5; i++) {
      add('basalt', box(0.8, 0.95, 0.95), BAY + 0.4, P + 19.3, i * 1.5);
      add('basalt', box(0.8, 0.95, 0.95), -BAY - 0.4, P + 19.3, i * 1.5);
    }

    /* ------------------------------------------------------ the ribbed dome
       15 m across.  Shallow, set behind the front block: from the plaza only
       its crown shows between the turrets, which is what the photograph
       shows; the whole dome appears from the water and from above. */
    add('basalt', cyl(DOME_R + 0.6, DOME_R + 1.0, 0.8, 24), 0, P + 11.2, -1.0);
    add(MASON, cyl(DOME_R, DOME_R, 2.9, 24), 0, P + 14.9, -1.0);      // drum
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      add('basalt', box(0.24, 2.5, 0.24), Math.cos(a) * (DOME_R - 0.2), P + 14.9,
        -1.0 + Math.sin(a) * (DOME_R - 0.2), { ry: -a });
    }
    add('basalt', cyl(DOME_R + 0.45, DOME_R + 0.05, 0.5, 24), 0, P + 14.55, -1.0);
    add(MASON, onion(DOME_R, 5.6, 26), 0, P + 15.0, -1.0);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      add('basalt', box(0.16, DOME_R * 0.62, 0.16),
        Math.cos(a) * (DOME_R - 0.4), P + 17.6, -1.0 + Math.sin(a) * (DOME_R - 0.4),
        { ry: -a, rz: 0.3 });
    }
    add('basalt', cyl(0.42, 0.66, 0.55, 10), 0, P + 20.4, -1.0);
    add('gold', cyl(0.08, 0.08, 0.8, 6), 0, P + 20.9, -1.0);

    /* --------------------------------------------------- four octagonal turrets
       2.6 m across, engaged at the corners of the central bay, tips at 26 m. */
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const x = sx * (BAY - 1.2), z = sz * (D / 2 - 1.6);
        add('basalt', cyl(1.5, 1.95, 1.1, 8), x, P + 11.9, z);          // corbel
        add(MASON, cyl(1.58, 1.58, 0.3, 8), x, P + 12.6, z);
        // shaft with engaged columns
        add('basalt', cyl(1.24, 1.32, 8.3, 8), x, P + 16.75, z);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          add(MASON, cyl(0.1, 0.13, 7.9, 5),
            x + Math.cos(a) * 1.33, P + 16.6, z + Math.sin(a) * 1.33);
        }
        add(MASON, cyl(1.58, 1.58, 0.3, 8), x, P + 20.05, z);    // balcony
        // open jali gallery
        add('basalt', cyl(1.16, 1.24, 1.5, 8), x, P + 20.95, z);
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          add('jaliWhite', box(0.48, 0.9, 0.06), x + Math.cos(a) * 1.2, P + 20.9,
            z + Math.sin(a) * 1.2, { ry: -a + Math.PI / 2 });
        }
        add('basalt', cyl(1.46, 1.26, 0.3, 8), x, P + 21.85, z);
        // ribbed dome and finial
        add(MASON, onion(1.24, 2.7, 16), x, P + 22.0, z);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          add('basalt', box(0.1, 1.7, 0.1), x + Math.cos(a) * 1.14, P + 23.1,
            z + Math.sin(a) * 1.14, { ry: -a, rz: 0.3 });
        }
        add('gold', cyl(0.07, 0.07, 0.9, 6), x, P + 24.7, z);
        add('gold', sph(0.16, 8), x, P + 25.0, z);
      });
    });

    /* ------------------------------------------- the screened flanking halls */
    [-1, 1].forEach((s) => {
      const x = s * FLANK_X;
      // jali screen filling the upper part of the flanking arch
      for (let i = -2; i <= 2; i++) {
        for (let j = 0; j < 3; j++) {
          add('jaliWhite', box(0.62, 0.72, 0.07), x + i * 0.72, P + 2.7 + j * 0.82, D / 2 + 0.06);
        }
      }
      add('basalt', ring(SW + 0.7, SH + 0.35, SSP, 0.26, 0.26), x, P, D / 2 + 0.04);
      add('basalt', ring(SW + 0.7, SH + 0.35, SSP, 0.26, 0.26), x, P, -D / 2 - 0.3);
      // carved blind panel above the arch: a shallow recess with a
      // moulded frame and a grid of pierced squares, as on the reference
      add(MASON, box(7.6, 5.6, 0.1), x, P + 9.6, D / 2 + 0.06);
      add(jaliTone, box(6.4, 4.6, 0.07), x, P + 9.6, D / 2 + 0.14);
      add('basalt', box(8.2, 0.4, 0.36), x, P + 12.6, D / 2 + 0.2);
      add('basalt', box(8.2, 0.4, 0.36), x, P + 6.6, D / 2 + 0.2);
      // carved band under the wing cornice
      for (let i = -3; i <= 3; i++) {
        add(MASON, box(0.62, 0.62, 0.16), x + i * 1.15, P + 14.6, D / 2 + 0.12);
        add(MASON, box(0.62, 0.62, 0.16), x + i * 1.15, P + 14.6, -D / 2 - 0.12);
      }
      // the same blind panel on the back face
      add(MASON, box(7.6, 5.6, 0.1), x, P + 9.6, -D / 2 - 0.06);
      add(jaliTone, box(6.4, 4.6, 0.07), x, P + 9.6, -D / 2 - 0.14);
    });
    // side-face panels
    [-1, 1].forEach((s) => {
      add(MASON, box(0.1, 5.6, 7.0), s * (W / 2 + 0.05), P + 9.6, 0);
      add(jaliTone, box(0.07, 4.6, 5.8), s * (W / 2 + 0.14), P + 9.6, 0);
      add('basalt', box(0.3, 0.4, 7.6), s * (W / 2 + 0.16), P + 12.8, 0);
      add('basalt', box(0.3, 0.4, 7.6), s * (W / 2 + 0.16), P + 6.6, 0);
      add('basalt', ring(SW + 0.7, SH + 0.35, SSP, 0.26, 0.26),
        s * (W / 2 + 0.02), P, 0, { ry: s * Math.PI / 2 });
    });

    /* ------------------------------------------------- boats on the harbour */
    const wx = -1.85;
    [[-52, -70, 1.0, 0.5], [34, -96, 1.2, -0.4], [76, -60, 0.9, 1.1],
     [-96, -120, 1.3, 0.2], [8, -150, 1.1, 1.9], [-20, -48, 0.8, -1.2]]
      .forEach(([x, z, s, ry], i) => {
        add(i % 2 ? 'wood' : 'plasterWhite', box(2.9 * s, 0.8 * s, 7.0 * s), x, wx + 0.4 * s, z, { ry });
        add(i % 2 ? 'plasterWhite' : 'wood', box(2.4 * s, 0.6 * s, 2.8 * s), x, wx + 1.05 * s, z + 1.2 * s, { ry });
        add('grey', cyl(0.07, 0.07, 4.6 * s, 5), x, wx + 3.1 * s, z - 0.6 * s);
        add('fabricWhite', box(0.06, 1.7 * s, 1.3 * s), x, wx + 3.9 * s, z - 0.6 * s);
      });

    /* ------------------------------------------------- plaza life and planting */
    const people = [[-8, 15], [7, 16], [-14, 11], [13, 12], [0, 19], [-20, 14], [20, 13],
      [-4, 10], [4, 9], [-11, 17], [11, 18], [16, 9], [-17, 8], [2, 22], [22, 17],
      [-24, 20], [24, 21], [0, 26]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2,
      ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-16, 12], [16, 12], [-26, 18], [26, 18], [0, 28]].forEach(([x, z]) => ctx.lamp(x, z, 3.6, 'black'));
    [[-24, -6], [24, -6], [-30, 6], [30, 6], [-34, 20], [34, 20], [-22, 34], [22, 34],
     [-40, 12], [40, 12], [-44, 30], [44, 30]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.2 + (i % 3) * 0.2, 'palm'));
    [[-52, 40], [52, 40], [-58, 62], [58, 62], [-46, 8], [46, 8]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.25, 'round'));

    /* the far shore across the water, kept low and hazy */
    for (let i = 0; i < 14; i++) {
      const x = -240 + i * 34;
      const h = 6 + ((i * 53) % 7) * 2.6;
      block('haze', 26, h, 14, x, -1.9, -430 - ((i * 17) % 5) * 12);
    }
    block('haze', 60, 26, 20, 150, -1.9, -470);

    ctx.light({ pos: [-20, 12, 22], target: [0, 12, 0], color: 0xffd0a0, intensity: 2400, distance: 160 });
    ctx.light({ pos: [20, 14, 20], target: [0, 12, 0], color: 0xffc890, intensity: 2000, distance: 160 });
    ctx.light({ pos: [0, 6, 16], target: [0, 4, 0], color: 0xffd9b0, intensity: 700, distance: 60 });
  }
};
