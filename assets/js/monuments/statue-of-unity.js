/* Statue of Unity — Kevadia, Gujarat · procedural miniature
   Author: Dr Sohil Momin · CC BY-NC 4.0 */

export default {
  id: 'statue-of-unity',
  accent: '#b8b2a4',
  accent2: '#d8d2c4',
  seed: 83,
  fogScale: 0.45,
  time: 16.9,
  bounds: 150,
  minDist: 60,
  maxDist: 900,
  home: { pos: [232, 128, 340], target: [0, 106, 0], fov: 40 },
  ground: { texture: 'grass', size: 2400, color: 0x8e9a68, tile: 30 },
  water: { y: -1.2, size: 900, z: 520, color: 0x2d5566, distortion: 2.0 },
  views: [
    { name: 'Full', pos: [232, 128, 340], target: [0, 106, 0] },
    { name: 'The figure', pos: [130, 150, 215], target: [0, 112, 0] },
    { name: 'From the dam', pos: [0, 60, 300], target: [0, 110, 0] },
    { name: 'Plinth', pos: [70, 40, 90], target: [0, 30, 0] },
    { name: 'Aerial', pos: [200, 300, 260], target: [0, 80, 0] }
  ],
  tour: [
    {
      title: 'The Tallest Statue', deva: 'एकता की प्रतिमा',
      text: 'The Statue of Unity stands on the island of Sadhu Bet in the Narmada, facing the Sardar Sarovar dam. At 182 metres it is the tallest statue in the world, dedicated to Sardar Vallabhbhai Patel, who brought the princely states into the Indian Union.',
      pos: [232, 128, 340], target: [0, 106, 0], time: 16.9
    },
    {
      title: 'Bronze on Steel', deva: 'कांस्य',
      text: 'The figure is a steel frame clad in about 1,700 tonnes of bronze panels over 25,000 tonnes of steel and concrete. It was designed by the sculptor Ram V. Sutar and built by Larsen & Toubro between 2013 and 2018.',
      pos: [130, 150, 215], target: [0, 112, 0], time: 12
    },
    {
      title: 'The Viewing Gallery', deva: 'दीर्घा',
      text: 'A gallery at 153 metres holds two hundred people at a time, looking out over the reservoir and the Vindhya hills.',
      pos: [60, 170, 110], target: [0, 155, 0], time: 9.6
    },
    {
      title: 'The Dam', deva: 'सरदार सरोवर',
      text: 'The statue faces the Sardar Sarovar dam across the water, a deliberate pairing: the man who argued for the project, looking at it.',
      pos: [0, 60, 300], target: [0, 110, 0], time: 17.6
    },
    {
      title: 'The Island', deva: 'साधु बेट',
      text: 'The plinth is a memorial complex with a museum, a garden and a memorial walk. The statue was unveiled on 31 October 2018, Patel’s birthday.',
      pos: [70, 40, 90], target: [0, 30, 0], time: 11
    },
    {
      title: 'Night', deva: 'रात्रि',
      text: 'Floodlit after dark, the bronze reads almost black against the sky, and the dam carries a line of lights.',
      pos: [140, 96, 210], target: [0, 102, 0], time: 21.2
    }
  ],

  build(ctx) {
    const T3 = ctx.THREE;
    const { add, box, cyl, sph, cone, dome, block, col, torus } = ctx;

    /* ---- the island and its plinth --------------------------------------- */
    block('stone', 120, 6, 100, 0, -2, 0);
    block('paving', 96, 4, 78, 0, 4, 0);
    block('marble', 60, 10, 52, 0, 8, 0);
    add('marble', box(62, 0.6, 54), 0, 18.2, 0);
    // steps up to the plinth on four sides
    for (let i = 0; i < 6; i++) {
      add('stone', box(20 - i * 1.2, 1.4, 2.4), 0, 18 - i * 1.4, 30 + i * 2.2);
    }
    // the memorial hall inside the plinth
    block('stone', 34, 9, 28, 0, 18, 0);
    for (let i = -2; i <= 2; i++) add('dark', box(3.2, 4.4, 0.4), i * 6, 22, 14.1);

    /* ---- the figure ------------------------------------------------------ */
    // 182 m tall on the plinth: dhoti hem 27 m radius -> waist 19 m, a jacket
    // over the chest, arms hanging clear of the body, head ~20 m on a neck.
    const BASE = 18.6;
    const B = 'bronze', J = 'copper';
    const latheOf = (pts, seg) => ctx.lathe(pts.map(([y, r]) => [Math.max(r, 0.001), y]), seg);

    // dhoti — nearly columnar, flaring only towards the hem, elliptical in plan
    const dhoti = [[0, 27.0], [4, 26.4], [10, 25.2], [20, 23.6], [32, 22.2],
      [46, 21.0], [60, 20.1], [74, 19.5], [88, 19.05], [92, 19.0]];
    add(B, latheOf(dhoti, 28), 0, BASE, 0, { sz: 0.74 });
    add(B, cyl(27.2, 27.6, 3.4, 28), 0, BASE + 1.7, 0, { sz: 0.74 });      // hem
    // folds down the front of the dhoti, each segment set on the surface
    const dR = (yy) => {
      for (let i = 1; i < dhoti.length; i++) {
        if (yy <= dhoti[i][0]) {
          const a = dhoti[i - 1], b = dhoti[i];
          return a[1] + (b[1] - a[1]) * ((yy - a[0]) / (b[0] - a[0]));
        }
      }
      return dhoti[dhoti.length - 1][1];
    };
    for (let q = 0; q < 5; q++) {
      const yy = 9 + q * 15, r = dR(yy + 7);
      for (const xx of [-6.5, 0, 6.5]) {
        const zz = 0.74 * Math.sqrt(Math.max(r * r - xx * xx, 1)) - 0.35;
        add(B, box(2.4, 15.4, 0.9), xx, BASE + yy + 7, zz, { rx: -0.06 });
      }
    }
    // waistband
    add(B, cyl(19.0, 19.7, 8.0, 26), 0, BASE + 96, 0, { sz: 0.76 });
    add(B, cyl(19.9, 19.4, 1.2, 26), 0, BASE + 100, 0, { sz: 0.76 });

    // torso — narrower than the dhoti, so the waist and chest read
    const torso = [[0, 19.0], [8, 18.6], [18, 18.0], [28, 17.5], [38, 17.2],
      [46, 16.5], [50, 15.2], [53, 11.0]];
    add(B, latheOf(torso, 24), 0, BASE + 100, 0, { sz: 0.72 });

    // jacket: a separate layer standing 1.6 m proud of the chest, with a hem,
    // a stand collar and a front edge
    const jacket = [[4, 18.4], [12, 18.3], [22, 18.0], [32, 17.8], [40, 17.4],
      [46, 16.9], [49, 16.2]];
    add(J, latheOf(jacket, 24), 0, BASE + 100, 0, { sz: 0.74 });
    add(J, cyl(18.5, 18.7, 1.5, 24), 0, BASE + 104, 0, { sz: 0.74 });      // jacket hem
    add(J, cyl(16.6, 17.0, 1.3, 24), 0, BASE + 147, 0, { sz: 0.74 });      // shoulder seam
    add(J, cyl(8.6, 9.6, 4.4, 16), 0, BASE + 147, 0, { sz: 0.86 });        // stand collar
    add(J, box(2.4, 28, 1.2), 0, BASE + 127, 12.6, { rx: 0.09 });          // jacket front edge

    // shoulders: wide and fairly square
    [-1, 1].forEach((sd) => {
      add(J, sph(8.4, 16), sd * 24.0, BASE + 143.5, 0, { sy: 0.74, sz: 0.92 });
    });
    add(J, sph(17.4, 20), 0, BASE + 141, 0, { sy: 0.5, sz: 0.72 });        // yoke

    // arms: hanging at the sides, hands beside the thighs
    [-1, 1].forEach((sd) => {
      add(B, cyl(6.2, 5.1, 34, 12), sd * 26.6, BASE + 129, 0);             // upper arm
      add(J, cyl(7.2, 5.4, 34, 12), sd * 22.6, BASE + 130.0, 0);           // jacket sleeve, tapered through
      add(J, sph(5.4, 10), sd * 22.6, BASE + 113.0, 0, { sy: 0.7 });        // rounded cuff, no step
      add(J, cyl(5.9, 6.0, 1.4, 12), sd * 26.5, BASE + 113.5, 0);          // cuff
      add(B, sph(5.3, 12), sd * 26.4, BASE + 112, 0, { sy: 0.85 });        // elbow
      add(B, cyl(5.0, 4.0, 30, 12), sd * 26.2, BASE + 96, 0);              // forearm
      add(B, sph(4.0, 12), sd * 21.8, BASE + 79, 0, { sy: 1.3, sz: 0.68 }); // hand
      for (let f = -2; f <= 2; f++) {
        add(B, cyl(0.75, 0.95, 6.4, 5), sd * 21.8 + f * 1.15, BASE + 73.4, 0.2, { rx: 0.08 });
      }
      add(B, cyl(3.2, 3.8, 7.0, 10), sd * 25.6, BASE + 71, 0.6, { sz: 0.68 }); // fingers
      add(B, sph(2.5, 10), sd * 24.2, BASE + 79, 1.8, { sy: 1.5, sz: 0.55 }); // thumb
    });

    // the shawl draped across the shoulders
    add('copper', cyl(25.6, 24.2, 4.4, 20), 0, BASE + 133.6, 0, { sz: 0.72 });
    add('copper', sph(26.0, 18), 0, BASE + 136.4, 0, { sy: 0.34, sz: 0.7 });
    add('copper', box(9.0, 15.0, 2.2), -13.0, BASE + 126.0, 11.6, { rz: 0.16 });   // the fall of the shawl
    add('copper', box(8.0, 12.0, 2.0), 12.0, BASE + 124.0, -10.4, { rz: -0.14 });

    /* ---- the head, lofted ------------------------------------------------
       A sphere cannot be a head. This is a stack of elliptical rings whose
       half-width and half-depth follow a profile from chin to crown, with the
       face flattened and pushed forward, so the skull narrows at the temples
       and the jaw tapers to the chin. */
    function headGeometry() {
      const LEVELS = [
        // t, halfWidth, halfDepth, forward
        [0.00, 3.2, 4.4, 0.6],
        [0.12, 5.6, 7.0, 0.9],
        [0.28, 6.9, 8.4, 1.0],
        [0.46, 7.3, 8.7, 0.7],
        [0.62, 7.2, 8.4, 0.3],
        [0.76, 6.6, 7.6, 0.0],
        [0.88, 5.2, 5.9, -0.2],
        [1.00, 2.6, 3.0, -0.4]
      ];
      const SEG = 20, H = 21.0;
      const pos = [], uv = [], idx = [];
      for (let i = 0; i < LEVELS.length; i++) {
        const [t, hw, hd, fw] = LEVELS[i];
        for (let j = 0; j <= SEG; j++) {
          const a = (j / SEG) * Math.PI * 2;
          const cx = Math.cos(a), cz = Math.sin(a);
          // flatten the face: pull the front arc toward a plane
          const front = Math.max(0, cz);
          const x = cx * hw;
          const z = cz * hd * (1 - 0.28 * front * front) + fw * front;
          pos.push(x, t * H, z);
          uv.push(j / SEG, t);
        }
      }
      for (let i = 0; i < LEVELS.length - 1; i++) {
        for (let j = 0; j < SEG; j++) {
          const a = i * (SEG + 1) + j, b = a + SEG + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const g = new T3.BufferGeometry();
      g.setAttribute('position', new T3.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    }

    // neck, head, jaw
    add(B, cyl(6.6, 7.2, 12, 14), 0, BASE + 156, 0, { sz: 0.92 });
    add(B, headGeometry(), 0, BASE + 160.6, 0);                            // head, lofted
    add(B, sph(2.4, 8), -7.6, BASE + 171.0, -1.0, { sx: 0.5, sy: 1.25 });  // ears
    add(B, sph(2.4, 8), 7.6, BASE + 171.0, -1.0, { sx: 0.5, sy: 1.25 });
    add('dark', sph(1.6, 8), -3.3, BASE + 173.4, 7.6, { sy: 0.62 });       // eye sockets
    add('dark', sph(1.6, 8), 3.3, BASE + 173.4, 7.6, { sy: 0.62 });
    add(B, sph(6.4, 16), 0, BASE + 166.6, 2.4, { sy: 0.62, sz: 0.95 });    // jaw line
    add(B, sph(3.6, 12), 0, BASE + 162.4, 5.4, { sy: 0.72, sz: 1.0 });     // chin
    add(B, box(11.0, 1.5, 2.2), 0, BASE + 174.4, 6.9);                     // brow
    // the moustache, the one feature that makes the face his
    add(B, box(9.6, 1.5, 1.9), 0, BASE + 165.4, 7.9, { rx: 0.12 });
    add(B, sph(1.5, 8), -4.6, BASE + 166.2, 7.4, { sx: 1.3, sy: 0.7 });
    add(B, sph(1.5, 8), 4.6, BASE + 166.2, 7.4, { sx: 1.3, sy: 0.7 });
    // cheekbones and a chin
    add(B, sph(3.0, 10), -4.8, BASE + 168.2, 5.4, { sy: 0.8 });
    add(B, sph(3.0, 10), 4.8, BASE + 168.2, 5.4, { sy: 0.8 });
    add(B, sph(3.4, 10), 0, BASE + 164.4, 6.6, { sy: 0.7 });
    add(B, cone(1.7, 4.8, 8), 0, BASE + 169.2, 8.8, { rx: Math.PI / 2 });  // nose
    [-1, 1].forEach((sd) => add(B, sph(2.4, 8), sd * 9.2, BASE + 169.0, -0.6, { sy: 1.3 })); // ears
    add(B, sph(7.6, 18), 0, BASE + 178.4, -0.8, { sy: 0.5, sz: 0.9 });     // hair, no cap
    add(B, sph(2.4, 8), 0, BASE + 178.4, 3.4, { sy: 0.5 });                 // the widow's peak

    // feet, just showing under the hem
    add(B, sph(4.6, 12), -9.0, BASE + 2.2, 19.6, { sy: 0.5, sz: 1.7 });
    add(B, sph(4.6, 12), 9.0, BASE + 2.2, 22.4, { sy: 0.5, sz: 1.7 });

    /* ---- the complex around it ------------------------------------------- */
    // memorial walk with columns
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      add('marble', cyl(1.6, 1.9, 8, 8), Math.cos(a) * 44, 22, Math.sin(a) * 44);
      add('gold', sph(1.0, 8), Math.cos(a) * 44, 30.4, Math.sin(a) * 44);
    }
    // the dam wall across the water
    block('stone', 260, 26, 22, 0, -2, 420);
    for (let i = -8; i <= 8; i++) {
      block('stone', 12, 18, 30, i * 15, -2, 430);
      add('grey', cyl(0.7, 0.7, 6, 6), i * 15, 26, 418);
    }
    // gardens and paths
    add('paving', box(90, 0.2, 12), 0, 6.1, 46);
    [[-52, 30], [52, 30], [-58, -10], [58, -10], [-40, 56], [40, 56], [-64, 50], [64, 50]]
      .forEach(([x, z], i) => ctx.tree(x, z, 1.6 + (i % 3) * 0.3, 'round'));
    const people = [[-8, 40], [6, 41], [-16, 36], [14, 37], [0, 44], [-24, 32], [22, 33], [-3, 34], [9, 34]];
    people.forEach(([x, z], i) => ctx.person(x, z, i * 1.2, ['fabricWhite', 'fabricSaffron', 'fabricRed'][i % 3], 1.6));

    ctx.light({ pos: [-90, 60, 110], target: [0, 100, 0], color: 0xffe0b0, intensity: 9000, distance: 400 });
    ctx.light({ pos: [90, 60, 100], target: [0, 100, 0], color: 0xffd0a0, intensity: 7000, distance: 400 });
  }
};
