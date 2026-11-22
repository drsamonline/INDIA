/* Shore Temple — Mahabalipuram · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'shore-temple',
  accent: '#b0a48c',
  accent2: '#d0c4a8',
  seed: 59,
  time: 7.2,
  bounds: 55,
  minDist: 12,
  maxDist: 200,
  home: { pos: [-26, 13, 40], target: [0, 11, 0], fov: 40 },
  ground: { texture: 'sandGround', size: 2400, color: 0xcdbb96 },
  groundY: -0.3,
  water: { y: -0.24, size: 620, z: 330, color: 0x2a5361, distortion: 2.6 },
  views: [
    { name: 'Full', pos: [-26, 13, 40], target: [0, 11, 0] },
    { name: 'Towers', pos: [-9, 16, 24], target: [0, 15, 0] },
    { name: 'From the sea', pos: [10, 6, -26], target: [0, 10, 0] },
    { name: 'Nandi', pos: [0, 3.5, 26], target: [0, 4, 8] },
    { name: 'Shoreline', pos: [-34, 4, 30], target: [-4, 8, 10] }
  ],
  tour: [
    {
      title: 'On the Shore', deva: 'तटीय मंदिर',
      text: 'The Shore Temple at Mahabalipuram was built around 725 CE under the Pallava king Narasimhavarman II, called Rajasimha. It is one of the earliest structural stone temples of southern India, raised on the beach rather than cut into rock.',
      pos: [-26, 13, 40], target: [0, 11, 0], time: 7.2
    },
    {
      title: 'Two Towers', deva: 'दो शिखर',
      text: 'The complex holds two Shiva shrines and a smaller reclining Vishnu, each under a pyramidal tower of five storeys. They are built of dressed granite blocks and crowned with stupi finials.',
      pos: [-9, 16, 24], target: [0, 15, 0], time: 12
    },
    {
      title: 'Granite by the Sea', deva: 'ग्रेनाइट',
      text: 'Thirteen centuries of salt wind and wave have pitted the stone, and sand has buried and uncovered the site more than once. The 2004 tsunami scoured the beach and revealed further structures offshore.',
      pos: [10, 6, -26], target: [0, 10, 0], time: 10.4
    },
    {
      title: 'The Nandi Wall', deva: 'नंदी',
      text: 'A row of Nandi bulls faces the sea along the eastern wall, carved in the round and worn almost featureless by the weather.',
      pos: [0, 3.5, 26], target: [0, 4, 8], time: 8.6
    },
    {
      title: 'The Group of Monuments', deva: 'स्मारक समूह',
      text: 'The Shore Temple is part of the Group of Monuments at Mahabalipuram — the rathas, mandapas and the great relief of Arjuna’s Penance — inscribed as a UNESCO World Heritage Site in 1984.',
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
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    /* ---- the rock platform and enclosure wall --------------------------- */
    block('granite', 40, 1.2, 30, 0, -0.2, 0);
    add('stone', box(41, 0.3, 31), 0, 1.0, 0);
    // low boundary wall, open to the sea
    [[-20, 0, 0, 30], [20, 0, 0, 30], [0, 15, Math.PI / 2, 40]].forEach(([x, z, ry, len]) => {
      for (let i = 0; i < Math.round(len / 3.4); i++) {
        const off = (i - (len / 3.4 - 1) / 2) * 3.4;
        add('granite', box(3.3, 1.9, 0.8), x + Math.cos(ry) * off, 1.9, z - Math.sin(ry) * off, { ry });
        if (i % 2 === 0) add('granite', box(1.0, 0.6, 0.8), x + Math.cos(ry) * off, 3.1, z - Math.sin(ry) * off, { ry });
      }
    });

    /* ---- a five-storey vimana ------------------------------------------- */
    function vimana(cx, cz, baseW, tiers, key, crown) {
      let y = 1.2, w = baseW;
      block('granite', w + 1.2, 1.6, w + 1.2, cx, y - 1.2, cz);
      y += 0.4;
      for (let i = 0; i < tiers; i++) {
        block(key, w, 2.1, w, cx, y, cz);
        add('stone', box(w + 0.55, 0.22, w + 0.55), cx, y + 2.1, cz);
        // corner pilasters and a shallow niche on each face
        for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          add('stone', box(0.45, 2.0, 0.45), cx + dx * (w / 2 - 0.2), y + 1.05, cz + dz * (w / 2 - 0.2));
        }
        add('dark', box(w * 0.34, 1.1, 0.14), cx, y + 0.9, cz + w / 2 + 0.02);
        add('dark', box(w * 0.34, 1.1, 0.14), cx, y + 0.9, cz - w / 2 - 0.02);
        y += 2.32;
        w *= 0.83;
      }
      // the crown: an octagonal drum and a rounded shikhara
      add('stone', cyl(w * 0.78, w * 0.9, 0.5, 8), cx, y + 0.25, cz);
      add(key, cyl(w * 0.62, w * 0.72, 1.5, 8), cx, y + 1.25, cz);
      add('stone', cyl(w * 0.8, w * 0.72, 0.28, 8), cx, y + 2.1, cz);
      add(crown, dome(w * 0.62, w * 0.75, 14), cx, y + 2.25, cz);
      add('stone', sph(0.42, 8), cx, y + 2.25 + w * 0.75, cz);
      add('gold', cone(0.22, 0.7, 6), cx, y + 2.9 + w * 0.75, cz);
    }

    vimana(-6.5, 1.5, 9.0, 5, 'granite', 'granite');
    vimana(7.5, 2.5, 7.6, 5, 'granite', 'granite');
    // the small reclining-Vishnu shrine between them
    block('granite', 6.2, 4.2, 6.2, 0.5, 1.2, 7.5);
    add('stone', box(6.6, 0.3, 6.6), 0.5, 5.4, 7.5);
    add('dark', box(2.6, 2.4, 0.2), 0.5, 2.8, 10.6);
    add('granite', dome(2.6, 1.9, 14), 0.5, 5.7, 7.5);
    add('gold', sph(0.24, 8), 0.5, 7.8, 7.5);

    /* ---- the Nandi row facing the sea ------------------------------------ */
    for (let i = -3; i <= 3; i++) {
      const x = i * 2.4, z = -13.2;
      add('stone', box(1.5, 0.5, 1.0), x, 1.45, z);
      add('granite', box(0.95, 0.85, 1.9), x, 2.1, z);
      add('granite', box(0.7, 0.75, 0.8), x, 2.55, z - 0.95, { rx: 0.25 });
      add('granite', sph(0.34, 8), x, 2.95, z - 1.3);
      add('granite', box(0.2, 0.45, 0.2), x - 0.35, 2.6, z - 1.05, { rx: -0.4 });
      add('granite', box(0.2, 0.45, 0.2), x + 0.35, 2.6, z - 1.05, { rx: -0.4 });
    }

    /* ---- rock outcrops, sand, palms -------------------------------------- */
    [[-16, 12, 4.5], [15, -8, 5.2], [-13, -10, 3.6], [18, 11, 3.2], [0, 18, 2.8]].forEach(([x, z, r], i) => {
      add('granite', sph(r, 9), x, 0.6, z, { sy: 0.55 });
      add('stone', sph(r * 0.62, 8), x + 0.8, 1.3, z - 0.6, { sy: 0.6 });
    });
    [[-30, 12], [30, 12], [-28, -4], [28, -4], [-22, 20], [22, 20], [-34, 4], [34, 4]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.15 + (i % 3) * 0.15, 'palm'));
    const people = [[-8, 18], [6, 19], [-14, 15], [13, 16], [0, 21], [-18, 8], [18, 9], [-4, 14], [9, 13]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 0.95));

    ctx.light({ pos: [-18, 9, 18], target: [0, 12, 0], color: 0xffd6a8, intensity: 2200, distance: 120 });
    ctx.light({ pos: [18, 9, 14], target: [0, 12, 0], color: 0xffcf9a, intensity: 1900, distance: 120 });
  }
};
