/* FIDELITY: approximate — The gold is metal reflecting the engine's sky, and the shrine, causeway and tank are modelled; the interior and the surrounding bazaar are not.
   Improved by: (nobody yet). If you improve this model, add your name and
   a link here and it will appear on the site: see CONTRIBUTING.md. */
/* Golden Temple (Harmandir Sahib) — Amritsar · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured dimensions (1 unit = 1 metre):
     shrine plan            12.25 m square  (40.5 ft, SGPC)
     marble platform        20.4 m square   (67 ft, SGPC)
     parikrama round shrine  3.7 m wide     (13 ft)
     first-floor roof        8.15 m         (26 ft 9 in)
     total height           16.5 m          (54 ft)
     Amrit Sarovar         148.5 x 154.5 m, 5.1 m deep
     causeway               61.6 x 6.4 m    (202 x 21 ft)
*/

export default {
  id: 'golden-temple',
  accent: '#e0b64a',
  accent2: '#ffe08a',
  seed: 47,
  floodScale: 0.35,
  fogScale: 0.34,          // a walled courtyard, not a hazy plain
  bounds: 110,
  minDist: 14,
  maxDist: 420,
  time: 15.4,
  home: { pos: [-36, 12.5, 46], target: [0, 7.6, 0], fov: 40 },
  ground: { texture: 'paving', size: 2400, color: 0xd8cdb8 },
  groundY: -7.95,
  // distortion 0.9 left the tank a near-perfect mirror of a bright sky, so it
  // read as a pale marble floor. Ripples are what say "water".
  water: { y: -2.6, size: 157, color: 0x0e2a34, distortion: 4.2 },
  views: [
    { name: 'Full', pos: [-36, 12.5, 46], target: [0, 7.6, 0] },
    { name: 'Causeway', pos: [-64, 8.0, 12], target: [-6, 9, 0] },
    { name: 'Dome', pos: [14, 19, 21], target: [0, 13.2, 0] },
    { name: 'Tank', pos: [0, 34, 118], target: [0, 8, 0] },
    { name: 'Akal Takht', pos: [-64, 12, -44], target: [-86, 12, -26] }
  ],
  tour: [
    {
      title: 'Harmandir Sahib', deva: 'हरमंदिर साहिब',
      text: 'Guru Ram Das founded Amritsar and began the sacred pool, the Amrit Sarovar, in 1577. His son Guru Arjan completed the Harmandir Sahib at its centre in 1604, set lower than the ground around it so that visitors step down into it.',
      pos: [-26, 16, 46], target: [2, 11, 0], time: 16.8
    },
    {
      title: 'Four Doors', deva: 'चार द्वार',
      text: 'Four doors face four directions, open to every faith and every caste. The causeway from the west is the way in, and pilgrims walk it barefoot with their heads covered.',
      pos: [-34, 9, 26], target: [0, 9, 0], time: 12
    },
    {
      title: 'Gold Leaf', deva: 'सोना',
      text: 'In 1830 Maharaja Ranjit Singh had the upper storeys covered in gold leaf, which gave the building its English name. The gurdwara sits on an island reached by the causeway, its reflection held in the tank.',
      pos: [16, 26, 30], target: [0, 20, 0], time: 9.8
    },
    {
      title: 'The Amrit Sarovar', deva: 'अमृत सरोवर',
      text: 'The tank is the heart of the complex. A marble walkway, the parikrama, runs right round it between arcades and balustrades, and pilgrims circle as they recite.',
      pos: [30, 12, 44], target: [0, 6, 0], time: 16.2
    },
    {
      title: 'Akal Takht', deva: 'अकाल तख़्त',
      text: 'The Akal Takht faces the shrine across the water: seat of Sikh temporal authority and one of the five takhts. The complex also holds a clock tower, a museum and the langar, a kitchen that feeds every visitor free of charge.',
      pos: [-6, 16, -34], target: [-14, 12, -14], time: 17.4
    },
    {
      title: 'A Hundred and Fifty Thousand', deva: 'संगत',
      text: 'Around 150,000 people come each day, one of the largest daily gatherings at any religious site in the world. The gurdwara is on UNESCO\'s tentative list.',
      pos: [-30, 12, 50], target: [0, 10, 0], time: 17.9
    },
    {
      title: 'The Temple at Night', deva: 'रात्रि',
      text: 'After dark the floodlight takes the gold and the shrine seems to float on the black water, while the parikrama stays busy through the night.',
      pos: [-34, 18, 56], target: [0, 12, 0], time: 21.4
    }
  ],

  build(ctx) {
    const { add, box, cyl, sph, cone, torus, dome, onion, arch, archFrame, block, col, plane, lathe } = ctx;

    /* The engine's gold is metalness 1.0, and a metal with only a weak
       environment map to reflect renders dark and flat — which is why the gold
       read matte. Less metal, a little more roughness, a brighter hex. */
    /* Gold leaf is about 95 per cent reflective, so it looks bright from every
       angle: what you see is the whole sky, not the key light. A metal in this
       engine has no environment to reflect — the sky is drawn, not sampled — so
       lowering the metalness and brightening the hex still left it matte, which
       is what the roadmap kept seeing.

       The honest workaround is a small emissive: it stands in for the sky the
       gold would be reflecting. It is a cheat, and it is the only one available
       without an environment map in the engine. */
    const gilt = (base, col, metal, rough, emis, emisI) => {
      const mm = ctx.mat(base);
      if (!mm || !mm.clone) return base;
      const c = mm.clone();
      c.color.setHex(col); c.metalness = metal; c.roughness = rough;
      if (ctx.THREE && c.emissive && emis !== undefined) {
        c.emissive = new ctx.THREE.Color(emis);
        c.emissiveIntensity = emisI === undefined ? 0.6 : emisI;
      }
      return c;
    };
    /* The emissive was a stand-in for an environment that did not exist. The
       engine reflects a real sky now (§47), so the gold can go back to being
       metal: metalness up, emissive down to a token that keeps the shaded side
       from going to soot. */
    const GD = gilt('gold', 0xdfae4a, 0.88, 0.26, 0x1a1204, 0.20);   // the trims
    const GDL = gilt('goldLeaf', 0xf7cd6b, 0.82, 0.30, 0x2a1c06, 0.28);  // dome and leaf
    const PI = Math.PI;

    /* ---------- measured plan ------------------------------------------- */
    const DECK = 0;             // parikrama / platform level
    const WATER = -2.6;         // water surface, 2.6 m below the deck
    const BED = -7.7;           // tank bed: 5.1 m of water
    const TX = 74.25;           // half of 148.5 m  (east-west)
    const TZ = 77.25;           // half of 154.5 m  (north-south)
    const ISLE = 20.4;          // marble platform, 67 ft square
    const IH = ISLE / 2;
    const SW = 12.25;           // shrine plan, 40.5 ft square
    const SH = SW / 2;
    const EAVE = 7.0;           // half-width of the roof slab (projects past the wall)
    const H1 = 8.15;            // first-floor roof level, 26 ft 9 in
    const TOP = 16.5;           // total height to the finial, 54 ft

    /* ---------- the deck: a paving frame round the tank ---------------- */
    const OUT = 330;
    add('paving', box(OUT * 2, 1.2, OUT - TZ), 0, -1.2, (TZ + OUT) / 2);
    add('paving', box(OUT * 2, 1.2, OUT - TZ), 0, -1.2, -(TZ + OUT) / 2);
    add('paving', box(OUT - TX, 1.2, TZ * 2), (TX + OUT) / 2, -1.2, 0);
    add('paving', box(OUT - TX, 1.2, TZ * 2), -(TX + OUT) / 2, -1.2, 0);
    // tank bed, so the water has a floor
    add('stone', plane(TX * 2 + 1, TZ * 2 + 1), 0, BED, 0, { rx: -PI / 2 });

    /* ---------- tank walls, coping and ghats --------------------------- */
    const WH = 1.4;             // wall thickness
    [[0, TZ, TX * 2 + WH * 2, WH], [0, -TZ, TX * 2 + WH * 2, WH],
      [TX, 0, WH, TZ * 2], [-TX, 0, WH, TZ * 2]].forEach(([x, z, w, d]) => {
      block('marble', w, -BED, d, x, BED, z);
      // coping
      block('marble', w + 1.1, 0.55, d + 1.1, x, 0, z);
      add('marble', box(w + 1.5, 0.16, d + 1.5), x, 0.62, z);
      // ghat steps on the inner face, so the tank has visible depth
      const horiz = w > d;
      for (let i = 0; i < 3; i++) {
        const y = -0.55 - i * 0.55;
        const inset = 0.9 + i * 0.6;
        if (horiz) {
          block('marbleWarm', w - 0.4, 0.55, inset, x, y, z - Math.sign(z) * (d / 2 - inset / 2));
        } else {
          block('marbleWarm', inset, 0.55, d - 0.4, x - Math.sign(x) * (w / 2 - inset / 2), y, z);
        }
      }
    });
    // balustrade round the tank coping
    for (let i = 0; i < 4; i++) {
      const horiz = i < 2;
      const s = i % 2 ? -1 : 1;
      const len = horiz ? TX * 2 : TZ * 2;
      const n = Math.round(len / 2.4);
      for (let k = 0; k <= n; k++) {
        const t = -len / 2 + (k / n) * len;
        const x = horiz ? t : s * (TX + 0.9);
        const z = horiz ? s * (TZ + 0.9) : t;
        add('marble', cyl(0.13, 0.17, 0.95, 6), x, 0.9, z);
      }
      const cx = horiz ? 0 : s * (TX + 0.9);
      const cz = horiz ? s * (TZ + 0.9) : 0;
      add('marble', box(horiz ? len : 0.22, 0.14, horiz ? 0.22 : len), cx, 1.42, cz);
    }

    /* ---------- the island --------------------------------------------- */
    block('marble', ISLE, -BED, ISLE, 0, BED, 0);
    add('marble', box(ISLE + 0.9, 0.22, ISLE + 0.9), 0, -0.11, 0);
    add('marbleWarm', box(ISLE - 0.2, 0.1, ISLE - 0.2), 0, 0.06, 0);
    // a low balustrade round the island edge, broken where the causeway lands
    for (let i = 0; i < 4; i++) {
      const horiz = i < 2;
      const s = i % 2 ? -1 : 1;
      const n = 14;
      for (let k = 0; k <= n; k++) {
        const t = -IH + (k / n) * ISLE;
        if (!horiz && s < 0 && Math.abs(t) < 3.6) continue;     // causeway
        const x = horiz ? t : s * IH;
        const z = horiz ? s * IH : t;
        add('marble', cyl(0.11, 0.14, 0.9, 6), x, 0.45, z);
      }
      const cx = horiz ? 0 : s * IH;
      const cz = horiz ? s * IH : 0;
      add('marble', box(horiz ? ISLE : 0.2, 0.13, horiz ? 0.2 : ISLE), cx, 0.86, cz);
    }

    /* ---------- the shrine ---------------------------------------------
       Lower storey in white marble to 2.3 m, upper part in gold to the
       first-floor roof at 8.15 m, then a parapet, the corner pavilions and
       a small upper storey carrying the dome. */
    const M1 = 2.30;                                   // marble / gold divide
    block('marble', SW, 0.5, SW, 0, 0, 0);              // plinth
    add('marbleWarm', box(SW + 0.5, 0.28, SW + 0.5), 0, 0.36, 0);
    block('marbleWarm', SW - 0.3, M1 - 0.6, SW - 0.3, 0, 0.5, 0);
    block('yellow', SW - 0.3, H1 - M1 - 0.05, SW - 0.3, 0, M1, 0);

    /* face frames: 4 faces, 5 bays each */
    const BAY = 2.05;
    const faces = [
      { nx: 0, nz: 1, ry: 0 }, { nx: 0, nz: -1, ry: PI },
      { nx: 1, nz: 0, ry: PI / 2 }, { nx: -1, nz: 0, ry: -PI / 2 }
    ];
    faces.forEach((f) => {
      const off = SW / 2 - 0.15;                       // wall face
      const px = f.nx * off, pz = f.nz * off;
      const ax = -f.nz, az = f.nx;                     // along the face
      for (let k = -2; k <= 2; k++) {
        const x = px + ax * k * BAY, z = pz + az * k * BAY;
        const centre = k === 0;
        // marble dado panel below
        add('marble', box(1.5, 1.35, 0.16), x + f.nx * 0.06, 1.25, z + f.nz * 0.06, { ry: f.ry });
        add(GD, box(1.62, 0.1, 0.2), x + f.nx * 0.07, 2.0, z + f.nz * 0.07, { ry: f.ry });
        // tall cusped niche in gold
        if (centre) {
          add('dark', arch(1.55, 3.4, 0.22), x + f.nx * 0.04, 2.35, z + f.nz * 0.04, { ry: f.ry });
          add(GDL, archFrame(1.95, 3.75, 0.16, 0.22), x + f.nx * 0.08, 2.35, z + f.nz * 0.08, { ry: f.ry });
        } else {
          add('dark', arch(1.25, 2.6, 0.2), x + f.nx * 0.04, 2.55, z + f.nz * 0.04, { ry: f.ry });
          add(GDL, archFrame(1.6, 2.92, 0.14, 0.2), x + f.nx * 0.08, 2.55, z + f.nz * 0.08, { ry: f.ry });
        }
        // upper window
        add('dark', box(1.05, 1.5, 0.2), x + f.nx * 0.04, 6.1, z + f.nz * 0.04, { ry: f.ry });
        add(GDL, box(1.3, 0.16, 0.24), x + f.nx * 0.08, 6.95, z + f.nz * 0.08, { ry: f.ry });
        add(GDL, box(1.3, 0.16, 0.24), x + f.nx * 0.08, 5.3, z + f.nz * 0.08, { ry: f.ry });
        // pilaster between bays
        add(GD, box(0.34, H1 - M1 - 0.4, 0.26), x + ax * BAY / 2 + f.nx * 0.1,
          (M1 + H1) / 2 - 0.1, z + az * BAY / 2 + f.nz * 0.1, { ry: f.ry });
      }
    });

    /* first-floor roof: a projecting slab and a gold cornice */
    block(GD, EAVE * 2, 0.28, EAVE * 2, 0, H1, 0);
    add(GDL, box(EAVE * 2 + 0.4, 0.16, EAVE * 2 + 0.4), 0, H1 + 0.34, 0);
    // brackets under the eave
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * PI * 2;
      add(GD, box(0.3, 0.45, 0.7), Math.cos(a) * (EAVE - 0.5), H1 - 0.3,
        Math.sin(a) * (EAVE - 0.5), { ry: -a });
    }

    /* parapet, 1.2 m, on the roof edge */
    const PARA = 1.2;
    const PY = H1 + 0.4;
    const PW = EAVE - 0.55;
    block(GD, PW * 2, PARA, PW * 2, 0, PY, 0);
    add(GDL, box(PW * 2 + 0.3, 0.14, PW * 2 + 0.3), 0, PY + PARA, 0);

    /* the row of small gold kiosks along the parapet, as in the photograph */
    for (let i = 0; i < 4; i++) {
      const horiz = i < 2;
      const s = i % 2 ? -1 : 1;
      for (let k = -3; k <= 3; k++) {
        const t = k * 1.85;
        const x = horiz ? t : s * PW;
        const z = horiz ? s * PW : t;
        add('yellow', box(0.72, 0.55, 0.72), x, PY + PARA + 0.28, z);
        add(GDL, box(0.92, 0.1, 0.92), x, PY + PARA + 0.6, z);
        add(GD, sph(0.46, 8), x, PY + PARA + 0.84, z, { sy: 0.72 });
        add(GDL, sph(0.07, 6), x, PY + PARA + 1.24, z);
      }
    }

    /* four corner pavilions — the Mamtees of the SGPC description */
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = dx * PW, z = dz * PW;
      add(GD, box(2.2, 0.3, 2.2), x, PY + PARA + 0.15, z);
      block('yellow', 1.9, 2.1, 1.9, x, PY + PARA + 0.3, z);             // solid tower
      add('dark', box(1.1, 1.4, 1.1), x, PY + PARA + 1.35, z);           // shadowed opening
      add(GDL, box(2.35, 0.3, 2.35), x, PY + PARA + 2.55, z);     // entablature
      add(GD, cyl(1.0, 1.1, 0.45, 12), x, PY + PARA + 2.85, z);      // drum
      add(GD, onion(1.06, 1.5, 16), x, PY + PARA + 3.05, z);
      add(GDL, cyl(0.05, 0.05, 0.45, 6), x, PY + PARA + 4.7, z);
      add(GDL, sph(0.09, 6), x, PY + PARA + 4.95, z);
    }

    /* small upper storey: a square room with three gates, then the dome */
    const U2 = 9.35;                                    // top of the parapet
    const U2W = 8.2;
    block('yellow', U2W, 2.95, U2W, 0, U2, 0);
    add(GDL, box(U2W + 0.2, 0.16, U2W + 0.2), 0, U2 + 1.1, 0);
    faces.forEach((f) => {
      const off = U2W / 2;
      const px = f.nx * off, pz = f.nz * off;
      const ax = -f.nz, az = f.nx;
      for (let k = -1; k <= 1; k++) {
        const x = px + ax * k * 2.5, z = pz + az * k * 2.5;
        add('dark', box(0.95, 1.7, 0.18), x + f.nx * 0.03, U2 + 1.5, z + f.nz * 0.03, { ry: f.ry });
        add(GDL, box(1.2, 0.14, 0.22), x + f.nx * 0.06, U2 + 2.45, z + f.nz * 0.06, { ry: f.ry });
      }
    });
    // chhajja over the upper storey
    add(GDL, box(U2W + 1.6, 0.22, U2W + 1.6), 0, U2 + 3.05, 0);
    add(GD, box(U2W + 1.1, 0.24, U2W + 1.1), 0, U2 + 3.24, 0);

    /* drum and the low fluted onion dome */
    const DRY = 13.0;
    add(GD, cyl(2.95, 3.15, 1.0, 24), 0, DRY + 0.5, 0);
    add(GDL, cyl(3.25, 3.1, 0.16, 24), 0, DRY + 1.05, 0);
    const DOME_BASE = DRY + 1.0;                        // 14.0
    add(GD, onion(2.95, 1.85, 34), 0, DOME_BASE, 0);
    // fluting: 18 thin ribs following the bulb
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * PI * 2;
      [[0.12, 2.78], [0.45, 2.98], [0.78, 2.62], [1.1, 1.95], [1.4, 1.2]].forEach(([t, r]) => {
        add(GDL, box(0.1, 0.34, 0.16), Math.cos(a) * r, DOME_BASE + t, Math.sin(a) * r, { ry: -a });
      });
    }
    // cupola on the crown: the smaller dome of the pair
    add(GD, cyl(0.95, 1.05, 0.4, 14), 0, DOME_BASE + 1.78, 0);
    add(GDL, cyl(1.12, 1.05, 0.1, 14), 0, DOME_BASE + 2.0, 0);
    add(GD, onion(0.92, 1.0, 18), 0, DOME_BASE + 2.02, 0);
    add(GD, cyl(0.05, 0.05, 0.6, 6), 0, DOME_BASE + 3.0, 0);
    add(GDL, sph(0.1, 8), 0, DOME_BASE + 3.34, 0);

    /* ---------- har ki pauri: steps from the shrine into the water ----- */
    for (let i = 0; i < 5; i++) {
      block('marble', 5.4, 0.3, 0.75, 0, -0.3 - i * 0.42, IH - 1.0 + i * 0.75);
    }

    /* ---------- the causeway from the west ----------------------------- */
    const CW = 3.2;                                     // half of 6.4 m
    const C0 = IH, C1 = TX;                             // 10.2 -> 74.25
    const CL = C1 - C0, CM = -(C0 + C1) / 2;
    block('marble', CW * 2, 0.55, CL, CM, -0.55, 0);
    add('marbleWarm', box(CW * 2 + 0.5, 0.12, CL), CM, 0.06, 0);
    // deep side walls, so the causeway reads as a bridge over real water
    for (const s of [-1, 1]) {
      block('marble', 0.7, 3.4, CL, CM, -3.95, s * (CW + 0.35));
    }
    // gold balustrade along the causeway
    for (const s of [-1, 1]) {
      for (let i = 0; i <= 24; i++) {
        const x = C0 + (i / 24) * CL;
        add(GD, cyl(0.09, 0.12, 0.95, 6), -x, 0.48, s * CW);
      }
      add(GD, box(CL, 0.12, 0.16), CM, 1.0, s * CW);
      add(GD, box(CL, 0.1, 0.12), CM, 0.6, s * CW);
    }
    // lanterns along the balustrade
    for (let i = 1; i < 12; i++) {
      const x = -(C0 + (i / 12) * CL);
      for (const s of [-1, 1]) {
        add(GD, cyl(0.07, 0.09, 2.1, 6), x, 1.05, s * CW);
        add(GDL, sph(0.22, 8), x, 2.2, s * CW);
        add(GD, cone(0.26, 0.24, 6), x, 2.42, s * CW);
      }
    }

    /* Darshani Deori — the gateway at the head of the causeway */
    (function deori(x) {
      block('marble', 11, 0.6, 9, x, 0, 0);
      block('marbleWarm', 9.4, 6.4, 7.2, x, 0.6, 0);
      add('marble', box(10.2, 0.4, 8.0), x, 7.2, 0);
      add('dark', arch(2.6, 3.05, 0.5), x, 0.6, 3.62, { ry: PI / 2 });
      add(GD, archFrame(3.2, 3.5, 0.22, 0.36), x - 0.06, 0.6, 3.66, { ry: PI / 2 });
      for (const s of [-1, 1]) {
        add(GD, cyl(0.5, 0.55, 1.4, 10), x, 7.4, s * 2.6);
        add(GD, onion(0.62, 1.0, 16), x, 8.6, s * 2.6);
      }
      add(GD, cyl(1.5, 1.65, 0.8, 16), x, 7.5, 0);
      add(GD, onion(1.7, 2.1, 20), x, 8.2, 0);
      add(GDL, sph(0.12, 8), x, 10.5, 0);
    })(-(TX + 3.0));

    /* ---------- the parikrama and its arcades --------------------------- */
    const PR = 4.2;                                     // marble walk, 13 ft
    const WING = 16;                                    // depth of the buildings
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([nx, nz]) => {
      const horiz = nz !== 0;
      const s = horiz ? nz : nx;
      const inner = horiz ? TZ : TX;                    // tank face
      const walkOut = inner + PR;
      const wallIn = walkOut + WING;
      const len = horiz ? TX * 2 : TZ * 2;
      const cx = horiz ? 0 : s * (walkOut + WING / 2);
      const cz = horiz ? s * (walkOut + WING / 2) : 0;
      const w = horiz ? len : WING;
      const d = horiz ? WING : len;

      // the marble walk at tank level
      block('marbleWarm', horiz ? len : PR, 0.5, horiz ? PR : len,
        horiz ? 0 : s * (inner + PR / 2), -0.5, horiz ? s * (inner + PR / 2) : 0);

      /* The wings were 9.2 m blocks with square-headed slots. The parikrama
         buildings are two full storeys of white marble arcade, ~12.5 m to the
         cornice, with arched openings and a balustraded parapet. */
      block('marble', w, 12.4, d, cx, 0, cz);
      add('marble', box(w + 0.8, 0.55, d + 0.8), cx, 12.65, cz);      // cornice
      block('marbleWarm', w - 0.4, 1.0, d - 0.4, cx, 12.4, cz);       // parapet
      add('marble', box(w - 0.1, 0.22, d - 0.1), cx, 13.4, cz);
      add('marble', box(w + 0.4, 0.2, d + 0.4), cx, 6.4, cz);         // string course

      // arcade facing the tank: tall lower arches, small windows above
      const n = Math.round(len / 5.6);
      const ry = horiz ? 0 : PI / 2;
      for (let i = 0; i < n; i++) {
        const t = -len / 2 + (i + 0.5) * (len / n);
        const px = horiz ? t : s * (walkOut + 0.25);
        const pz = horiz ? s * (walkOut + 0.25) : t;
        // ground arcade: an arch, not a slot, in a marble surround
        add('dark', arch(3.4, 4.9, 0.5), px, 0.3, pz - 0.12, { ry });
        add('marble', archFrame(4.2, 5.5, 0.30, 0.5), px, 0.3, pz - 0.04, { ry });
        // upper storey: a smaller arched window over each bay
        add('dark', arch(1.9, 2.7, 0.35), px, 7.3, pz - 0.12, { ry });
        add('marble', archFrame(2.5, 3.2, 0.24, 0.4), px, 7.3, pz - 0.04, { ry });
        add('marble', box(2.9, 0.22, 0.5), px, 10.7, pz, { ry });
        const tm = t + (len / n) / 2;
        if (i < n - 1) {
          add('marble', box(0.7, 12.2, 0.7), horiz ? tm : s * (walkOut + 0.3), 6.1,
            horiz ? s * (walkOut + 0.3) : tm);
        }
      }
      // small chhatris along the parapet
      for (let i = 0; i < Math.max(2, Math.round(len / 22)); i++) {
        const t = -len / 2 + (i + 0.5) * (len / Math.max(2, Math.round(len / 22)));
        const px = horiz ? t : s * (walkOut + WING / 2);
        const pz = horiz ? s * (walkOut + WING / 2) : t;
        add('marble', cyl(0.95, 1.05, 0.9, 10), px, 13.6, pz);
        add('marble', dome(0.98, 1.15, 14), px, 14.05, pz);
        add(GD, sph(0.09, 6), px, 15.35, pz);
      }
    });

    /* ---------- Akal Takht, opposite the shrine across the water -------- */
    (function akal(x, z) {
      block('marble', 18, 0.7, 15, x, 0, z);
      block('marbleWarm', 16, 8.2, 13, x, 0.7, z);
      add('marble', box(17, 0.45, 14), x, 8.9, z);
      for (let i = -2; i <= 2; i++) {
        add('dark', box(2.2, 4.2, 0.3), x + 6.4, 3.0, z + i * 2.9, { ry: PI / 2 });
        add('marble', box(2.8, 0.28, 0.4), x + 6.5, 5.25, z + i * 2.9, { ry: PI / 2 });
      }
      block('marbleWarm', 13, 1.1, 11, x, 8.9, z);
      add(GD, cyl(4.2, 4.6, 1.6, 20), x, 10.5, z);
      add(GD, onion(4.3, 5.2, 26), x, 11.3, z);
      add(GDL, sph(0.22, 8), x, 16.9, z);
      // Nishan Sahib
      add('grey', cyl(0.1, 0.13, 14, 6), x + 11, 7, z + 5);
      add('fabricSaffron', ctx.plane(2.2, 1.4), x + 12.1, 12.6, z + 5);
    })(-86, -28);

    /* ---------- clock tower, north-east --------------------------------- */
    (function clock(x, z) {
      block('marbleWarm', 9, 0.6, 9, x, 0, z);
      block('marble', 8, 17, 8, x, 0.6, z);
      add('marble', box(9, 0.5, 9), x, 17.6, z);
      add('plasterWhite', cyl(2.5, 2.5, 0.12, 20), x - 4.05, 14.6, z, { rz: PI / 2 });
      add('black', box(0.1, 1.6, 0.14), x - 4.1, 15.0, z);
      add('black', box(0.14, 0.12, 1.1), x - 4.1, 14.6, z);
      add('marble', dome(3.0, 2.4, 16), x, 17.85, z);
      add(GD, cyl(0.08, 0.08, 1.4, 6), x, 20.3, z);
    })(62, -88);

    /* ---------- pilgrims, lamps, trees ---------------------------------- */
    const people = [
      [-14, 2.0], [-18, -2.0], [-24, 1.2], [-30, -1.4], [-36, 1.6], [-44, -1.2],
      [-52, 1.8], [-60, -1.6], [-8.6, 8.2], [-8.6, -8.2], [0, 8.8], [0, -8.8],
      [8.4, 8.4], [8.4, -8.4], [-6, 9.4], [6, -9.4], [-2, -9.6], [3, 9.2]
    ];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1,
      ['fabricSaffron', 'fabricWhite', 'fabricRed', 'fabricWhite'][i % 4], 1.0));

    // lamps along the causeway head and the parikrama
    [[-70, 8], [-70, -8], [-30, 12], [-30, -12], [24, 92], [-24, 92], [92, 20], [-92, 20]]
      .forEach(([x, z]) => ctx.lamp(x, z, 4.6, 'black'));

    // a few trees outside the arcades
    [[-118, 118], [118, 118], [-124, 62], [124, 62], [-96, -124], [96, -124],
      [-130, -30], [130, -30]].forEach(([x, z], i) => ctx.tree(x, z, 1.5, i % 3 ? 'round' : 'palm'));

    ctx.light({ pos: [-26, 15, 22], target: [0, 11, 0], color: 0xffd9a0, intensity: 950, distance: 220 });
    ctx.light({ pos: [26, 15, 20], target: [0, 11, 0], color: 0xffcf90, intensity: 800, distance: 220 });
    ctx.light({ pos: [0, 9, 34], target: [0, 10, 0], color: 0xffe0b0, intensity: 480, distance: 160 });
    ctx.light({ pos: [-56, 10, 10], target: [-20, 8, 0], color: 0xffd9a0, intensity: 320, distance: 120 });
  }
};
