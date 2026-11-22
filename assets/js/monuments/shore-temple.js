/* Shore Temple — Mahabalipuram · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured proportions.
   Main shrine (Kshatriyasimheshvaram, faces east): 18 m (60 ft) over five
   talas, on a 15.2 m (50 ft) square plinth.
   Second shrine (Rajasimheshvaram, faces west, behind): about half the
   height — 9.6 m over three talas.
   Reclining-Vishnu shrine between them: no superstructure, flat roof.
   All three stand on one shared granite jagati. Plan axis east–west; the
   main shrine faces +Z, toward the sea, and the Nandi row faces the water. */

export default {
  id: 'shore-temple',
  accent: '#b0a48c',
  accent2: '#d0c4a8',
  seed: 59,
  floodScale: 0.35,
  time: 15.2,
  bounds: 62,
  minDist: 12,
  maxDist: 230,
  home: { pos: [52, 19, 16], target: [0, 9.4, 4], fov: 38 },
  ground: { texture: 'sandGround', size: 2400, color: 0xcdbb96 },
  groundY: -0.62,
  water: { y: -0.46, size: 1400, z: 0, color: 0x27505f, distortion: 2.6 },
  views: [
    { name: 'Full', pos: [52, 19, 16], target: [0, 9.4, 4] },
    { name: 'Towers', pos: [19, 10.5, 14], target: [0, 11.0, 4] },
    { name: 'From the sea', pos: [14, 4.5, 38], target: [0, 10, 8] },
    { name: 'Nandi', pos: [10, 3.2, 27], target: [0, 2.6, 19.5] },
    { name: 'Shoreline', pos: [46, 4.0, 34], target: [0, 8, 6] }
  ],
  tour: [
    {
      title: 'On the Shore', deva: 'तटीय मंदिर',
      text: 'The Shore Temple at Mahabalipuram was built around 725 CE under the Pallava king Narasimhavarman II, called Rajasimha. It is one of the earliest structural stone temples of southern India, raised on the beach rather than cut into rock.',
      pos: [-26, 13, 40], target: [0, 11, 0], time: 7.2
    },
    {
      title: 'Two Towers', deva: 'दो शिखर',
      text: 'The complex holds two Shiva shrines and a smaller reclining Vishnu, each under a pyramidal tower of five storeys, built of dressed granite blocks and crowned with stupi finials.',
      pos: [-9, 16, 24], target: [0, 15, 0], time: 12
    },
    {
      title: 'Granite by the Sea', deva: 'ग्रेनाइट',
      text: 'Thirteen centuries of salt wind and wave have pitted the stone, and sand has buried the site and uncovered it again more than once. The 2004 tsunami scoured the beach and revealed further structures offshore.',
      pos: [10, 6, -26], target: [0, 10, 0], time: 10.4
    },
    {
      title: 'The Nandi Wall', deva: 'नंदी',
      text: 'A row of Nandi bulls faces the sea along the eastern wall, carved in the round and worn almost featureless by weather.',
      pos: [0, 3.5, 26], target: [0, 4, 8], time: 8.6
    },
    {
      title: 'The Group of Monuments', deva: 'स्मारक समूह',
      text: 'The Shore Temple belongs to the Group of Monuments at Mahabalipuram, with the rathas, the mandapas and the great relief of Arjuna\'s Penance, inscribed as a UNESCO World Heritage Site in 1984.',
      pos: [-34, 4, 30], target: [-4, 8, 10], time: 17.4
    },
    {
      title: 'Dawn on the Bay', deva: 'प्रभात',
      text: 'At dawn the sun comes up out of the Bay of Bengal behind the towers, and the granite turns from grey to gold.',
      pos: [4, 8, -30], target: [0, 12, 0], time: 6.4
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus, lathe } = ctx;

    /* ================= the shore ======================================= */
    // a low granite headland; the sea lies east (+z) and south (+x) of it
    block('sand', 216, 0.62, 132, -52, -0.62, -44);      // x -160..56, z -110..22
    for (let i = 0; i < 6; i++) {                        // beach falling east
      block('sand', 216, 0.62 - i * 0.11, 1.05, -52, -0.62, 22.5 + i * 1.05);
      block('sand', 1.05, 0.62 - i * 0.11, 132, 56.5 + i * 1.05, -0.62, -44);
    }

    /* ---- the shared jagati: 15.2 m across, 30 m long ------------------- */
    block('granite', 15.2, 1.0, 30, 0, -0.1, 3);
    add('stone', box(15.9, 0.3, 30.7), 0, 0.95, 3);
    block('granite', 14.4, 0.55, 29.2, 0, 0.9, 3);
    // steps up on the east (sea) side
    for (let i = 0; i < 4; i++) {
      block('granite', 7.0, 0.32 + i * 0.3, 0.75, 0, -0.1, 18.4 + (3 - i) * 0.75);
    }

    /* ---- paving joints and a carved base course on the jagati ---------- */
    for (let i = -5; i <= 5; i++) {
      add('stone', box(15.0, 0.06, 0.16), 0, 1.46, 3 + i * 2.6);
    }
    for (let i = -2; i <= 2; i++) {
      add('stone', box(0.16, 0.06, 29.0), i * 2.9, 1.46, 3);
    }
    // a row of small lions and pilasters along the jagati edge
    for (let i = -5; i <= 5; i++) {
      add('granite', box(0.5, 0.42, 0.5), i * 2.6, 1.66, 17.4);
    }

    /* ---- the enclosure wall and the Nandi row ------------------------- */
    const WH = 1.75;
    function wallRun(x, z, len, ry) {
      const n = Math.max(1, Math.round(len / 2.7));
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * 2.7;
        const px = x + Math.cos(ry) * off, pz = z - Math.sin(ry) * off;
        add('granite', box(2.66, WH, 0.85), px, WH / 2, pz, { ry });
        add('stone', box(2.8, 0.16, 0.98), px, WH + 0.06, pz, { ry });
        if (i % 2 === 0) add('granite', box(0.95, 0.55, 0.92), px, WH + 0.4, pz, { ry });
      }
    }
    wallRun(-11.3, 21.5, 18, Math.PI / 2);
    wallRun(11.3, 21.5, 18, Math.PI / 2);
    wallRun(-12.9, 3, 37, 0);
    wallRun(12.9, 3, 37, 0);

    // eleven Nandi, couchant, facing the sea (+z)
    for (let i = 0; i < 11; i++) {
      const x = (i - 5) * 1.95, z = 20.1;
      add('granite', box(1.75, 0.5, 1.3), x, 0.25, z);
      add('stone', box(1.68, 0.12, 1.24), x, 0.56, z);
      add('granite', box(0.76, 0.68, 1.3), x, 0.94, z - 0.05);
      add('granite', box(0.58, 0.56, 0.6), x, 1.14, z + 0.72, { rx: 0.2 });
      add('granite', sph(0.26, 8), x, 1.44, z + 0.98);
      add('granite', box(0.13, 0.26, 0.13), x - 0.28, 1.16, z + 0.76, { rx: -0.5 });
      add('granite', box(0.13, 0.26, 0.13), x + 0.28, 1.16, z + 0.76, { rx: -0.5 });
      add('granite', box(0.66, 0.3, 0.46), x, 0.77, z - 0.72);
    }

    /* ---- a Pallava vimana --------------------------------------------- */
    // moulded plinth; a ground storey split into bays by pilasters and
    // carried on squatting lions; square talas, each closed by a projecting
    // cornice with a hara of miniature shrines on it; an octagonal griva and
    // stepped shikhara; a pot stupi and a kalasha finial.
    function vimana(cx, cz, cfg) {
      const { baseW, talas, h0, ht, plinthW, plinthH, face, crownH } = cfg;
      let y = 0;

      block('granite', plinthW + 0.9, plinthH * 0.34, plinthW + 0.9, cx, y, cz);
      add('stone', box(plinthW + 1.35, 0.26, plinthW + 1.35), cx, y + plinthH * 0.34 + 0.13, cz);
      block('granite', plinthW, plinthH * 0.44, plinthW, cx, y + plinthH * 0.34 + 0.26, cz);
      add('stone', box(plinthW + 0.5, 0.3, plinthW + 0.5), cx, y + plinthH * 0.78 + 0.15, cz);
      block('granite', plinthW - 0.5, plinthH * 0.22, plinthW - 0.5, cx, y + plinthH * 0.78 + 0.3, cz);
      y += plinthH + 0.3;

      // ground storey
      let w = baseW;
      block('granite', w, h0, w, cx, y, cz);
      const faces = [[0, 1, 0], [0, -1, Math.PI], [1, 0, Math.PI / 2], [-1, 0, -Math.PI / 2]];
      for (const [ax, az, ry] of faces) {
        const bays = 3;
        for (let b = 0; b < bays; b++) {
          const off = (b - (bays - 1) / 2) * (w / bays);
          const px = cx + ax * (w / 2 + 0.15) + (az ? off : 0);
          const pz = cz + az * (w / 2 + 0.15) + (ax ? off : 0);
          add('dark', box(0.95, h0 * 0.52, 0.2), px, y + h0 * 0.42, pz, { ry });
          add('stone', box(1.26, 0.18, 0.28), px, y + h0 * 0.74, pz, { ry });
          add('granite', box(0.34, h0 * 0.3, 0.24), px, y + h0 * 0.4, pz, { ry });
        }
        for (const s of [-1, 1]) {
          const px = cx + ax * (w / 2 - 0.16) + (az ? s * (w / 2 - 0.16) : 0);
          const pz = cz + az * (w / 2 - 0.16) + (ax ? s * (w / 2 - 0.16) : 0);
          add('stone', box(0.52, h0 - 0.12, 0.52), px, y + h0 / 2, pz);
        }
        const nl = 4;
        for (let k = 0; k < nl; k++) {
          const off = (k - (nl - 1) / 2) * (w / nl);
          const px = cx + ax * (w / 2 + 0.22) + (az ? off : 0);
          const pz = cz + az * (w / 2 + 0.22) + (ax ? off : 0);
          add('granite', box(0.66, 0.46, 0.44), px, y + 0.23, pz, { ry });
          add('granite', sph(0.2, 6), px, y + 0.54, pz, { ry });
        }
      }
      // the sanctum door, and its moulded surround
      add('dark', box(1.45, 1.95, 0.28), cx, y + 1.25, cz + face * (w / 2 + 0.24));
      add('stone', box(1.95, 0.32, 0.4), cx, y + 2.36, cz + face * (w / 2 + 0.26));
      add('stone', box(0.28, 2.0, 0.36), cx - 0.86, y + 1.25, cz + face * (w / 2 + 0.26));
      add('stone', box(0.28, 2.0, 0.36), cx + 0.86, y + 1.25, cz + face * (w / 2 + 0.26));
      y += h0;

      // upper talas
      for (let t = 1; t < talas; t++) {
        w = baseW * Math.pow(0.845, t);
        block('granite', w, ht, w, cx, y, cz);
        const nh = Math.max(3, Math.round(w / 1.1));
        for (const [ax, az] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          for (let k = 0; k < nh; k++) {
            const off = (k - (nh - 1) / 2) * (w / nh);
            const px = cx + ax * (w / 2 + 0.17) + (az ? off : 0);
            const pz = cz + az * (w / 2 + 0.17) + (ax ? off : 0);
            add('stone', box(0.46, ht * 0.6, 0.32), px, y + ht * 0.3, pz);
            add('granite', box(0.58, 0.14, 0.44), px, y + ht * 0.66, pz);
            add('granite', cone(0.26, 0.32, 4), px, y + ht * 0.66 + 0.16, pz, { ry: Math.PI / 4 });
          }
        }
        add('stone', box(w + 1.32, 0.32, w + 1.32), cx, y + ht + 0.16, cz);
        add('granite', box(w + 0.94, 0.18, w + 0.94), cx, y + ht + 0.41, cz);
        y += ht + 0.44;
      }

      // crown: octagonal griva, a low stepped octagonal shikhara, the pot
      // stupi, and a kalasha finial — 4.6 m of the 18 m total on the big tower
      const k = crownH / 4.6, r = w * 0.53;
      add('stone', cyl(r * 1.2, r * 1.34, 0.32 * k, 8), cx, y + 0.16 * k, cz);
      add('granite', cyl(r * 0.97, r * 1.0, 0.9 * k, 8), cx, y + 0.77 * k, cz);
      add('stone', cyl(r * 1.1, r * 0.99, 0.22 * k, 8), cx, y + 1.33 * k, cz);
      add('granite', lathe([[0, 0], [r * 1.04, 0.09], [r * 1.02, 0.3], [r * 0.94, 0.5],
        [r * 0.98, 0.6], [r * 0.86, 0.78], [r * 0.72, 0.92], [r * 0.5, 1.02],
        [r * 0.26, 1.06], [0.02, 1.07]], 8),
        cx, y + 1.44 * k, cz);
      const capY = y + 2.5 * k;
      add('stone', cyl(r * 0.42, r * 0.52, 0.16 * k, 8), cx, capY + 0.08 * k, cz);
      add('granite', lathe([[0.02, 0], [0.30 * r, 0.05], [0.52 * r, 0.2], [0.62 * r, 0.44],
        [0.6 * r, 0.68], [0.48 * r, 0.9], [0.28 * r, 1.06], [0.16 * r, 1.14],
        [0.16 * r, 1.25], [0.02, 1.25]], 12), cx, capY + 0.16 * k, cz);
      add('gold', cone(0.16 * r + 0.06, 0.55 * k, 6), cx, capY + (0.16 + 1.25 + 0.27) * k, cz);
      add('gold', sph(0.15 * r + 0.05, 6), cx, capY + (0.16 + 1.25 + 0.58) * k, cz);
      return capY + (0.16 + 1.25 + 0.72) * k;
    }

    // main shrine — 18 m over five talas, plinth 15.2 m square
    vimana(0, 8.2, { baseW: 7.4, talas: 5, h0: 2.9, ht: 1.6, plinthW: 15.2, plinthH: 2.2, face: 1, crownH: 4.6 });
    // second shrine — 9.6 m over three talas, faces west
    vimana(0, -6.4, { baseW: 5.0, talas: 3, h0: 1.9, ht: 1.2, plinthW: 8.6, plinthH: 1.8, face: -1, crownH: 2.5 });

    /* ---- the reclining-Vishnu shrine: no superstructure ---------------- */
    block('granite', 4.6, 0.6, 3.6, 0, 0, 0.2);
    add('stone', box(5.0, 0.22, 4.0), 0, 0.71, 0.2);
    block('granite', 4.2, 3.0, 3.2, 0, 0.9, 0.2);
    add('stone', box(4.7, 0.3, 3.7), 0, 3.9, 0.2);        // flat roof
    add('granite', box(4.4, 0.2, 3.4), 0, 4.2, 0.2);
    for (const s of [-1, 1]) {
      add('dark', box(0.8, 1.4, 0.2), s * 1.15, 2.0, 1.82);
      add('stone', box(1.06, 0.18, 0.26), s * 1.15, 2.8, 1.84);
    }
    add('dark', box(1.3, 1.7, 0.24), 0, 1.75, -1.42);

    /* ---- the barrel-vaulted porch on the east face --------------------- */
    block('granite', 6.2, 2.9, 3.8, 0, 0, 14.9);
    add('granite', cyl(1.78, 1.78, 6.2, 14), 0, 2.9, 14.9, { rz: Math.PI / 2 });
    add('stone', box(6.5, 0.22, 4.1), 0, 2.82, 14.9);
    add('dark', box(1.85, 2.15, 0.28), 0, 1.08, 16.82);
    add('stone', box(2.45, 0.3, 0.38), 0, 2.32, 16.87);
    add('granite', box(0.5, 0.42, 0.5), 0, 4.7, 14.9);
    add('gold', sph(0.13, 6), 0, 5.05, 14.9);

    /* ---- subsidiary shrines on the jagati ------------------------------ */
    [[-6.0, -1.0], [6.0, -1.0]].forEach(([x, z]) => {
      block('granite', 2.6, 1.6, 2.6, x, 1.45, z);
      add('stone', box(2.9, 0.2, 2.9), x, 3.1, z);
      add('dark', box(0.8, 1.1, 0.18), x, 2.4, z + 1.36);
      add('granite', cyl(0.78, 0.86, 0.6, 8), x, 3.6, z);
      add('granite', dome(0.9, 0.7, 10), x, 3.9, z);
      add('gold', sph(0.1, 6), x, 4.7, z);
    });

    /* ---- rock outcrops, palms, scrub ----------------------------------- */
    [[-19, -4, 3.4], [19, -1, 4.0], [-18, 10, 2.6], [18.5, 12, 2.4],
     [-14, 20, 2.0], [15, 19, 1.9], [-24, 16, 2.8], [24, 15, 2.5]].forEach(([x, z, r]) => {
      add('granite', sph(r, 9), x, -0.1 + r * 0.26, z, { sy: 0.56 });
      add('stone', sph(r * 0.6, 8), x + r * 0.4, 0.2 + r * 0.4, z - r * 0.3, { sy: 0.6 });
    });
    [[-26, 2], [26, 2], [-25, -12], [25, -12], [-30, -26], [30, -26],
     [-20, -30], [20, -30], [-12, -26], [12, -26], [-34, 12], [34, 12]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.1 + (i % 3) * 0.16, 'palm'));
    [[-30, 18], [30, 18], [-22, -40], [22, -40]].forEach(([x, z]) => ctx.tree(x, z, 0.85, 'round'));

    const people = [[-7, 19], [7, 20], [-11, 16], [12, 17], [0, 21], [-16, 12],
      [16, 12], [-4, 14], [9, 15], [-21, 18], [21, 17], [-9, 8], [10, 7]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));

    ctx.lamp(-10, 19.0, 3.4, 'black');
    ctx.lamp(10, 19.0, 3.4, 'black');
    ctx.flag(0, 0.6, -11.5, 7.5, 'fabricSaffron');

    ctx.light({ pos: [-16, 9, 22], target: [0, 12, 8], color: 0xffd6a8, intensity: 2200, distance: 130 });
    ctx.light({ pos: [16, 9, 18], target: [0, 12, 6], color: 0xffcf9a, intensity: 1900, distance: 130 });
  }
};
