/* Amber Fort — Amer, Rajasthan · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0

   Built to measured proportions.
   Amber Fort covers 30 ha; the palace range above Maota Lake is modelled at
   full size (Jaleb Chowk 100 m x 65 m, the courts stepping up the spur), with
   the hill and the lake compressed so the whole sits inside the frame.
   The palace platform stands 42 m above the water, the palace another 22 m
   above that. Ganesh Pol, the three-level gate, is the entrance on the lake
   axis. Ramparts run off along the ridge on both sides. */

export default {
  id: 'amber-fort',
  accent: '#d8a86a',
  accent2: '#f0c890',
  seed: 67,
  floodScale: 0.35,
  time: 15.6,
  bounds: 190,
  minDist: 40,
  maxDist: 520,
  home: { pos: [90, 52, 144], target: [-2, 36, -8], fov: 40 },
  ground: { texture: 'grass', size: 2600, color: 0x8f9868 },
  views: [
    { name: 'Full', pos: [90, 52, 144], target: [-2, 36, -8] },
    { name: 'Palace', pos: [34, 58, 68], target: [0, 48, -20] },
    { name: 'Ganesh Pol', pos: [16, 50, 26], target: [0, 48, -10] },
    { name: 'Ramparts', pos: [-136, 46, 62], target: [-46, 40, -40] },
    { name: 'Maota', pos: [10, 8, 96], target: [0, 22, 8] }
  ],
  tour: [
    {
      title: 'Above the Lake', deva: 'आमेर किला',
      text: 'Raja Man Singh I of the Kachwaha Rajputs began Amber Fort in 1592, on the ridge above the Maota lake outside Jaipur. It served as the seat of the rulers of Amber until the court moved down to Jaipur in 1727.',
      pos: [44, 50, 78], target: [0, 34, 0], time: 16.6
    },
    {
      title: 'Courtyards', deva: 'आँगन',
      text: 'A sequence of courtyards climbs the hill inside the walls: the Diwan-i-Aam for public audience, the Ganesh Pol gateway with its painted arches, and the private palaces behind.',
      pos: [16, 30, 56], target: [0, 26, 0], time: 11
    },
    {
      title: 'Sheesh Mahal', deva: 'शीश महल',
      text: 'Thousands of pieces of mirror, set into plaster, cover the walls and ceiling of the Hall of Mirrors. A single lamp is enough to fill the room with light.',
      pos: [12, 27, 44], target: [4, 26, 12], time: 9.4
    },
    {
      title: 'The Rampart', deva: 'प्राचीर',
      text: 'A long crenellated wall with watchtowers runs along the Aravalli ridge above the fort, joining it to Jaigarh. From the rampart the plain towards Jaipur opens out.',
      pos: [-56, 30, 44], target: [-18, 26, 0], time: 17.4
    },
    {
      title: 'Maota Lake', deva: 'मावठा',
      text: 'The Maota lake below the fort catches its reflection and waters the Dil-e-Aram garden, laid out in the Mughal charbagh manner at the foot of the hill.',
      pos: [10, 8, 74], target: [0, 14, 20], time: 18.2
    },
    {
      title: 'Hill Forts of Rajasthan', deva: 'दुर्ग',
      text: 'Amber was inscribed in 2013, with five other forts of Rajasthan, as a UNESCO World Heritage Site: the Hill Forts of Rajasthan.',
      pos: [40, 44, 72], target: [0, 34, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, onion, arch, archFrame, block, col, chhatri } = ctx;

    // Amber is pale yellow sandstone, not terracotta. sandstoneBuff under the
    // warm key pushed to orange, so the stone is tinted toward pale yellow.
    const STONE = (() => {
      const m = ctx.mat('sandstoneBuff');
      if (!m || !m.clone) return 'sandstoneBuff';
      const c = m.clone();
      c.color.setHex(0xe3d9b6);
      return c;
    })();
    const stone = STONE, stone2 = 'plasterWhite', trim = 'marble', cream = 'cream';

    /* ---- a light cupola: drum, four posts, dome, finial ---------------- */
    function cupola(x, y, z, sc, key, dk) {
      add(key, cyl(1.45 * sc, 1.6 * sc, 0.2 * sc, 8), x, y + 0.1 * sc, z);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        add(key, cyl(0.12 * sc, 0.14 * sc, 1.35 * sc, 5),
          x + Math.cos(a) * 1.0 * sc, y + 0.85 * sc, z + Math.sin(a) * 1.0 * sc);
      }
      add(key, cyl(1.45 * sc, 1.45 * sc, 0.15 * sc, 8), x, y + 1.6 * sc, z);
      add(dk, dome(1.2 * sc, 1.45 * sc, 10), x, y + 1.68 * sc, z);
      add('gold', cyl(0.05 * sc, 0.05 * sc, 0.4 * sc, 5), x, y + 3.3 * sc, z);
      add('gold', sph(0.09 * sc, 5), x, y + 3.55 * sc, z);
    }
    /* ---- a flat carved surround, much cheaper than an extruded frame --- */
    function surround(x, y, z, w, h, ry) {
      add(cream, box(0.26, h, 0.16), x - w / 2 - 0.13, y, z, { ry });
      add(cream, box(0.26, h, 0.16), x + w / 2 + 0.13, y, z, { ry });
      add(cream, box(w + 0.52, 0.24, 0.18), x, y + h / 2 + 0.1, z, { ry });
    }


    /* ================= the hill and its platform ======================== */
    // a spur of the Aravallis; compressed, the palace platform at y = 42
    block('stone', 236, 9, 96, 0, 0, -56);
    block('stone', 220, 10, 84, 0, 9, -54);
    block(stone, 206, 10, 74, 0, 19, -51);
    block(stone, 196, 9, 66, 0, 29, -48);
    // rock breaking out of the slopes
    [[-106, 4, 20, 10], [106, 4, 18, 9], [-88, 12, 34, 8], [90, 11, 32, 8],
     [-52, 3, 6, 8], [56, 3, 8, 7], [-116, 14, -16, 9], [116, 13, -18, 8],
     [-30, 2, 12, 7], [22, 2, 12, 6], [-74, 9, 6, 7], [78, 8, 6, 7],
     [4, 3, 12, 5], [-12, 2, 10, 6]]
      .forEach(([x, y, z, r]) => add('stone', sph(r, 9), x, y, z, { sy: 0.72 }));

    /* ---- the great retaining wall above the lake ----------------------- */
    // 24 m of dressed stone, blind-arched, carrying the palace terrace
    block(stone, 190, 22, 7.0, 0, 20, -13.5);
    add(trim, box(190.6, 0.5, 7.4), 0, 42.0, -13.5);
    for (let i = -11; i <= 11; i++) {
      const x = i * 8.0;
      add('dark', arch(3.2, 6.4, 0.3), x, 22.6, -9.9);
      surround(x, 25.6, -9.85, 3.2, 6.4, 0);
      surround(x, 37.0, -9.85, 3.2, 6.4, 0);
      add('dark', arch(3.2, 6.4, 0.3), x, 34.0, -9.9);
      // a pilaster between the bays
      add(stone, box(1.3, 22, 1.2), x + 4.0, 31, -9.6);
    }

    /* ---- the palace terrace -------------------------------------------- */
    block('stone', 190, 4.0, 68, 0, 38, -47);
    add(trim, box(191, 0.45, 69), 0, 42.0, -47);

    /* ---- the facade range along the lake -------------------------------- */
    // two storeys of arcade with jharokhas, running the length of the terrace
    function facadeBlock(x0, w, depth, h, y) {
      block(stone, w, h, depth, x0, y, -10 - depth / 2);
      add(trim, box(w + 0.5, 0.4, depth + 0.5), x0, y + h, -10 - depth / 2);
      const n = Math.max(1, Math.round(w / 4.6));
      for (let i = 0; i < n; i++) {
        const px = x0 + (i - (n - 1) / 2) * (w / n);
        for (const yy of [y + 0.2, y + h * 0.52]) {
          add('dark', arch(2.2, 3.4, 0.26), px, yy, -9.9);
          surround(px, yy + 1.7, -9.85, 2.2, 3.4, 0);
        }
        // a jharokha balcony between the bays
        if (i < n - 1) {
          add(stone, box(1.7, 1.9, 0.9), px + w / n / 2, y + h * 0.55, -9.5);
          add(trim, box(2.1, 0.2, 1.2), px + w / n / 2, y + h * 0.55 + 0.95, -9.4);
          add('dark', box(1.1, 1.2, 0.16), px + w / n / 2, y + h * 0.55, -9.05);
        }
      }
    }
    facadeBlock(-86, 28, 16, 15, 42);
    facadeBlock(86, 28, 16, 15, 42);
    facadeBlock(-52, 40, 15, 17, 42);
    facadeBlock(52, 40, 15, 17, 42);

    /* ---- Ganesh Pol: the three-level gate on the lake axis -------------- */
    const GY = 42;
    block(stone, 26, 20, 9, 0, GY, -6.5);
    add(trim, box(26.6, 0.5, 9.6), 0, GY + 20, -6.5);
    // the great arch
    add('dark', arch(8.4, 13.0, 0.6), 0, GY, -1.9);
    add(cream, archFrame(9.4, 14.0, 0.5, 0.55), 0, GY, -1.85);
    // painted bands and fresco panels on the two upper levels
    [GY + 14.4, GY + 17.2].forEach((y, i) => {
      add(i % 2 ? 'teal' : 'yellow', box(24.0, 0.42, 9.2), 0, y, -6.5);
    });
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      add('dark', arch(1.5, 2.6, 0.24), i * 2.5, GY + 10.4, -1.9);
      surround(i * 2.5, GY + 11.7, -1.85, 1.5, 2.6, 0);
    }
    // Suhag Mandir above the arch, with latticed windows
    block(stone, 12, 5.0, 7, 0, GY + 20, -6.5);
    add(trim, box(12.6, 0.4, 7.6), 0, GY + 25, -6.5);
    for (let i = -2; i <= 2; i++) {
      add('jali', box(1.7, 3.0, 0.12), i * 2.3, GY + 22.4, -2.95);
      surround(i * 2.3, GY + 22.4, -2.9, 1.7, 3.0, 0);
    }
    add(trim, box(13.4, 0.3, 8.2), 0, GY + 25.4, -6.5);
    // flanking octagonal towers and chhatris
    for (const s of [-1, 1]) {
      block(stone, 5.4, 24, 5.4, s * 14.5, GY, -6.5);
      add(trim, box(6.0, 0.4, 6.0), s * 14.5, GY + 24, -6.5);
      add(stone, cyl(2.3, 2.6, 2.4, 8), s * 14.5, GY + 24.4, -6.5);
      add(trim, cyl(2.7, 2.7, 0.3, 8), s * 14.5, GY + 26.8, -6.5);
      cupola(s * 14.5, GY + 26.9, -6.5, 1.15, stone, trim);
      add('jali', box(3.4, 2.6, 0.12), s * 14.5, GY + 13.6, -3.85);
    }
    // a pair of chhatris on the gate roof
    cupola(-7.4, GY + 25.4, -6.5, 1.05, stone, trim);
    cupola(7.4, GY + 25.4, -6.5, 1.05, stone, trim);
    add(stone, onion(3.4, 5.0, 20), 0, GY + 25.7, -6.5);
    add('gold', sph(0.2, 8), 0, GY + 31.2, -6.5);

    /* ---- the private court behind the gate ------------------------------ */
    // Jai Mandir (Sheesh Mahal) to one side, Sukh Niwas to the other,
    // a charbagh garden between them
    block('stone', 22, 3, 34, 0, 38, -32);
    add(trim, box(23, 0.4, 35), 0, 41, -32);
    add('grass', box(20, 0.16, 30), 0, 41.1, -32);
    for (let i = -2; i <= 2; i++) {
      add('marble', box(0.9, 0.2, 29), i * 4.4, 41.25, -32);
    }
    add('water', box(9, 0.1, 6), 0, 41.3, -32);
    // Jai Mandir
    block(stone, 15, 12, 18, -19.5, 42, -30);
    add(trim, box(16, 0.4, 19), -19.5, 54, -30);
    for (let i = -2; i <= 2; i++) {
      add('dark', arch(1.9, 3.4, 0.26), -19.5, 42.2, -20.9 + i * 0.01 + 0.0);
    }
    for (let i = -1; i <= 1; i++) {
      add('dark', arch(2.0, 3.6, 0.26), -19.5, 42.2, -24 + i * 5.4, { ry: Math.PI / 2 });
      surround(-19.5, 44.0, -24 + i * 5.4, 2.0, 3.6, Math.PI / 2);
    }
    cupola(-19.5, 54, -38, 1.1, stone, trim);
    cupola(-19.5, 54, -22, 1.1, stone, trim);
    add(stone, onion(3.2, 4.8, 20), -19.5, 54.2, -30);
    add('gold', sph(0.2, 8), -19.5, 59.4, -30);
    // Sukh Niwas
    block(stone, 15, 11, 18, 19.5, 42, -30);
    add(trim, box(16, 0.4, 19), 19.5, 53, -30);
    for (let i = -1; i <= 1; i++) {
      add('dark', arch(2.0, 3.6, 0.26), 19.5, 42.2, -24 + i * 5.4, { ry: Math.PI / 2 });
      surround(19.5, 44.0, -24 + i * 5.4, 2.0, 3.6, Math.PI / 2);
    }
    cupola(19.5, 53, -38, 1.1, stone, trim);
    cupola(19.5, 53, -22, 1.1, stone, trim);
    add(stone, onion(3.0, 4.4, 20), 19.5, 53.2, -30);
    add('gold', sph(0.2, 8), 19.5, 58.0, -30);

    /* ---- Jaleb Chowk, the first court, west of the gate ----------------- */
    // 100 m along the range, 40 m deep, at the terrace level
    add('paving', box(100, 0.3, 40), -62, 42.1, -32);
    for (let i = -5; i <= 5; i++) {
      add(stone, box(0.35, 0.2, 39), -62 + i * 9.6, 42.3, -32);
    }
    // its enclosing ranges
    block(stone, 100, 13, 12, -62, 42, -55);
    add(trim, box(101, 0.4, 13), -62, 55, -55);
    for (let i = -10; i <= 10; i++) {
      add('dark', arch(2.0, 3.2, 0.24), -62 + i * 4.8, 42.2, -48.9);
      surround(-62 + i * 4.8, 43.8, -48.85, 2.0, 3.2, 0);
    }
    block(stone, 12, 13, 40, -108, 42, -32);
    add(trim, box(13, 0.4, 41), -108, 55, -32);
    // the Diwan-i-Aam: a raised platform of 27 columns along the north side
    block(trim, 46, 1.6, 15, -62, 42, -20);
    add(stone, box(47, 0.35, 16), -62, 43.6, -20);
    for (const [zz, a, b] of [[-26.2, -6, 7], [-14.2, -6, 6]]) {
      for (let i = a; i <= b; i++) {
        col(trim, 0.42, 0.5, 6.4, -62 + i * 3.6, 43.9, zz, 10);
        add(stone, box(1.0, 0.5, 1.0), -62 + i * 3.6, 44.2, zz);
        add(stone, box(0.9, 0.4, 0.9), -62 + i * 3.6, 50.1, zz);
      }
    }
    block(stone, 47, 1.4, 16, -62, 50.5, -20);
    add(trim, box(48, 0.35, 17), -62, 51.9, -20);
    for (let i = -6; i <= 6; i += 2) {
      cupola(-62 + i * 3.6, 52.2, -20, 0.7, stone, trim);
    }
    // a stairway up from the court
    for (let i = 0; i < 8; i++) {
      block(stone, 12, 0.3 + i * 0.2, 1.0, -62, 42, -37 + i * 1.0);
    }

    /* ---- Man Singh Mahal, the oldest block, east ------------------------ */
    block(stone, 30, 16, 34, 74, 42, -32);
    add(trim, box(31, 0.45, 35), 74, 58, -32);
    for (let i = -2; i <= 2; i++) {
      add('dark', arch(2.2, 3.6, 0.26), 74 + i * 5.4, 42.2, -14.9);
      surround(74 + i * 5.4, 44.0, -14.85, 2.2, 3.6, 0);
    }
    for (let i = -2; i <= 2; i++) {
      add('jali', box(2.0, 2.6, 0.12), 74 + i * 5.4, 52.4, -14.9);
      surround(74 + i * 5.4, 52.4, -14.85, 1.9, 2.6, 0);
    }
    cupola(74, 58, -18, 1.2, stone, trim);
    cupola(74, 58, -46, 1.2, stone, trim);
    cupola(60, 58, -32, 1.1, stone, trim);
    cupola(88, 58, -32, 1.1, stone, trim);
    add(stone, onion(4.0, 6.0, 20), 74, 58.2, -32);
    add('gold', sph(0.22, 8), 74, 64.4, -32);

    /* ---- the back range, service blocks and a tower --------------------- */
    block(stone, 150, 10, 22, 0, 42, -68);
    add(trim, box(151, 0.4, 23), 0, 52, -68);
    for (let i = -12; i <= 12; i++) {
      add('dark', box(1.6, 1.6, 0.2), i * 6.0, 48, -56.9);
    }
    block(stone, 14, 26, 14, -40, 42, -66);
    add(trim, box(15, 0.4, 15), -40, 68, -66);
    add(stone, cyl(4.6, 5.2, 3.0, 10), -40, 68.4, -66);
    add(trim, cyl(5.4, 5.4, 0.3, 10), -40, 71.4, -66);
    cupola(-40, 71.5, -66, 1.4, stone, trim);
    // a run of chhatris along the whole terrace parapet
    for (let i = -8; i <= 8; i += 2) {
      if (Math.abs(i) < 2) continue;
      cupola(i * 11.0, 42.3, -11.6, 0.95, stone, trim);
    }
    // crenellations
    for (let i = -19; i <= 19; i++) {
      add(stone, box(1.4, 1.4, 0.8), i * 5.0, 42.9, -11.4);
      if (i % 2 === 0) add(stone, box(0.7, 0.6, 0.8), i * 5.0, 43.8, -11.4);
    }

    /* ---- the outer fortification and the ramparts ----------------------- */
    function rampart(x0, z0, x1, z1, y) {
      const dx = x1 - x0, dz = z1 - z0;
      const len = Math.hypot(dx, dz), ry = Math.atan2(dz, dx);
      const n = Math.max(2, Math.round(len / 4.2));
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const x = x0 + dx * t, z = z0 + dz * t;
        add(stone, box(4.3, 6.2, 1.9), x, y + 3.1, z, { ry });
        if (i % 2 === 0) add(stone, box(1.2, 1.2, 2.0), x, y + 6.8, z, { ry });
      }
      for (let i = 3; i < n; i += 8) {
        const t = i / (n - 1);
        const x = x0 + dx * t, z = z0 + dz * t;
        add(stone, cyl(2.6, 3.0, 9.4, 8), x, y + 4.7, z);
        add(trim, cyl(3.1, 3.1, 0.3, 8), x, y + 9.5, z);
        add(trim, dome(2.4, 2.0, 8), x, y + 9.6, z);
      }
    }
    // the wall round the spur, and two long runs away along the ridge
    rampart(-118, 6, -118, -44, 18);
    rampart(-118, -44, -140, -84, 22);
    rampart(118, 4, 118, -46, 18);
    rampart(118, -46, 142, -86, 22);
    rampart(-118, 6, -30, 14, 12);
    rampart(118, 4, 34, 14, 12);
    rampart(-140, -84, -196, -104, 26);
    rampart(142, -86, 198, -106, 26);

    /* ---- the ramp up from the lake to the gate -------------------------- */
    for (let i = 0; i < 24; i++) {
      const t = i / 23;
      const y = 0.8 + t * 41.2;
      const x = -66 + t * 22, z = 22 - t * 30;
      block(stone, 6.4, y, 3.0, x, 0, z, { ry: -0.63 });
      add(trim, box(6.7, 0.18, 3.2), x, y, z, { ry: -0.63 });
      if (i % 3 === 0) {
        add(stone, box(0.9, 1.1, 1.1), x + 3.3, y + 0.5, z, { ry: -0.63 });
        add(stone, box(0.9, 1.1, 1.1), x - 3.3, y + 0.5, z, { ry: -0.63 });
      }
    }

    /* ---- Maota lake ---------------------------------------------------- */
    // a dammed reservoir with a long blind-arcaded retaining wall
    block('stone', 236, 1.6, 122, 0, -1.2, 78);
    const lakeMat = ctx.mat('water').clone();
    lakeMat.roughness = 0.46; lakeMat.metalness = 0.08;
    lakeMat.color.setHex(0x33607a);
    add(lakeMat, box(228, 0.2, 114), 0, 0.42, 78);
    add('stone', box(238, 1.2, 3.2), 0, 1.1, 17.6);
    add(trim, box(238, 0.35, 3.6), 0, 2.3, 17.6);
    for (let i = -26; i <= 26; i++) {
      add('dark', arch(2.6, 4.4, 0.24), i * 4.5, 0.2, 19.2, { ry: Math.PI });
      add(stone, archFrame(3.0, 4.7, 0.2, 0.3), i * 4.5, 0.2, 19.15, { ry: Math.PI });
    }
    // the Kesar Kyari island garden
    block('stone', 30, 1.6, 30, 0, 0.4, 78);
    add('stone', box(31, 0.4, 31), 0, 2.0, 78);
    add('grass', box(27, 0.2, 27), 0, 2.3, 78);
    for (let i = -2; i <= 2; i++) {
      add('marble', box(0.7, 0.22, 26), i * 5.6, 2.45, 78);
      add('marble', box(26, 0.22, 0.7), 0, 2.45, 78 + i * 5.6);
    }
    for (const s of [-1, 1]) {
      cupola(s * 13.4, 2.3, 78, 0.8, stone, trim);
    }
    add('stone', cyl(4.2, 4.6, 2.0, 8), 0, 2.3, 78);
    add(trim, cyl(4.6, 4.6, 0.3, 8), 0, 4.3, 78);
    cupola(0, 4.4, 78, 1.2, stone, trim);

    /* ---- gardens, trees, people ---------------------------------------- */
    for (let i = 0; i < 3; i++) {
      for (const s of [-1, 1]) {
        add('grass', box(26, 0.14, 9), s * 74, 0.4, 40 + i * 12);
        add('grass', box(26, 0.14, 9), s * 74, 0.4, 96 + i * 12);
      }
    }
    [[-104, 34], [104, 32], [-96, 118], [96, 120], [-118, 70], [118, 68],
     [-70, 24], [70, 22], [-140, 96], [140, 94], [-88, -70], [90, -72],
     [-46, -92], [46, -92], [-150, 30], [152, 32], [-56, 10], [60, 10],
     [-24, 6], [30, 6], [-92, 22], [94, 20]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.25 + (i % 3) * 0.2, i % 5 === 0 ? 'cypress' : 'round'));
    const people = [[-62, -30], [-40, -24], [-84, -40], [74, -22], [86, -40],
      [-8, -30], [10, -34], [-16, -22], [16, -24], [-30, 6], [36, 2],
      [-8, 34], [8, 34], [22, 30], [-24, 32], [-62, -46], [58, -46]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.1, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));
    [[-70, 4], [70, 4], [-30, 8], [30, 8], [-96, 10], [96, 8]].forEach(([x, z]) => ctx.lamp(x, z, 3.4, 'black'));
    ctx.flag(0, 47.6, -6.5, 8.0, 'fabricSaffron');

    ctx.light({ pos: [-70, 30, 40], target: [0, 42, -20], color: 0xffd0a0, intensity: 4200, distance: 260 });
    ctx.light({ pos: [70, 30, 34], target: [0, 42, -20], color: 0xffc890, intensity: 3400, distance: 260 });
    ctx.light({ pos: [0, 44, 34], target: [0, 52, -8], color: 0xffe0b8, intensity: 1200, distance: 170 });
  }
};
